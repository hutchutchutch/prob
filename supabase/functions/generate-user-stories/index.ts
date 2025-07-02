// supabase/functions/generate-user-stories/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { StateGraph } from "https://esm.sh/@langchain/langgraph@0.0.25"
import { OpenAI } from "https://esm.sh/openai@4"

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

interface UserStoryGenerationState {
  projectId: string
  selectedSolutions?: any[]
  persona?: any
  coreProblem?: string
  userStories?: any[]
  dataFlows?: any[]
}

// Node: Load selected solutions and context
async function loadContext(state: UserStoryGenerationState) {
  // Get selected solutions with persona and pain point mappings
  const { data: selectedSolutions } = await supabase
    .from('key_solutions')
    .select(`
      *,
      personas!inner(
        *,
        core_problems!inner(
          validated_problem
        )
      ),
      solution_pain_point_mappings(
        pain_points!inner(
          description,
          severity
        )
      )
    `)
    .eq('project_id', state.projectId)
    .eq('is_selected', true)
    .order('position')
  
  if (!selectedSolutions || selectedSolutions.length === 0) {
    throw new Error('No solutions selected')
  }
  
  const persona = selectedSolutions[0].personas
  const coreProblem = persona.core_problems.validated_problem
  
  return {
    ...state,
    selectedSolutions,
    persona,
    coreProblem
  }
}

// Node: Generate user stories from selected solutions
async function generateUserStories(state: UserStoryGenerationState) {
  const { selectedSolutions, persona, coreProblem } = state
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `You are an expert agile product manager and user story writer.
        Create detailed user stories that implement the selected solutions.
        Each story should be specific, testable, and valuable.`
      },
      {
        role: "user",
        content: `Core Problem: "${coreProblem}"
        Persona: ${persona.name} (${persona.role} in ${persona.industry})
        
        Selected Solutions:
        ${selectedSolutions?.map((sol, i) => `${i + 1}. ${sol.title}: ${sol.description}`).join('\n') || 'None'}
        
        Generate 6 user stories that implement these solutions.
        
        Return as JSON:
        {
          "userStories": [
            {
              "title": "Story title",
              "asA": "Role/persona",
              "iWant": "Specific feature or capability",
              "soThat": "Business value or outcome",
              "acceptanceCriteria": [
                "Specific testable criterion 1",
                "Specific testable criterion 2",
                "Specific testable criterion 3"
              ],
              "priority": "High|Medium|Low",
              "complexityPoints": 1-13,
              "relatedSolutionIndices": [0, 1] // which solutions this story implements
            }
          ]
        }`
      }
    ],
    response_format: { type: "json_object" }
  })
  
  const { userStories } = JSON.parse(completion.choices[0].message.content!)
  
  return {
    ...state,
    userStories
  }
}

// Node: Generate data flows for each user story
async function generateDataFlows(state: UserStoryGenerationState) {
  const { userStories } = state
  const dataFlows: any[] = []
  
  for (const story of userStories!) {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a system architect expert at designing data flows.
          Create detailed data flow steps for implementing user stories.`
        },
        {
          role: "user",
          content: `User Story: As a ${story.asA}, I want ${story.iWant} so that ${story.soThat}
          
          Create a data flow showing how this feature works.
          
          Return as JSON:
          {
            "description": "Overall flow description",
            "steps": [
              {
                "stepNumber": 1,
                "action": "User action or system process",
                "source": "Component/Actor initiating",
                "target": "Component/System receiving",
                "dataPayload": "What data is transferred"
              }
            ]
          }`
        }
      ],
      response_format: { type: "json_object" }
    })
    
    const flow = JSON.parse(completion.choices[0].message.content!)
    dataFlows.push({
      userStory: story,
      ...flow
    })
  }
  
  return {
    ...state,
    dataFlows
  }
}

// Node: Ensure story coverage and quality
async function validateStories(state: UserStoryGenerationState) {
  const { userStories, selectedSolutions } = state
  
  // Check if all solutions are covered
  const coveredSolutionIndices = new Set(
    userStories!.flatMap(story => story.relatedSolutionIndices)
  )
  
  const uncoveredSolutions = selectedSolutions!.filter((_, index) => 
    !coveredSolutionIndices.has(index)
  )
  
  if (uncoveredSolutions.length > 0) {
    // Generate additional stories for uncovered solutions
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `Generate user stories for solutions that aren't covered yet.`
        },
        {
          role: "user",
          content: `These solutions need user stories:
          ${uncoveredSolutions.map(sol => `${sol.title}: ${sol.description}`).join('\n')}
          
          Generate stories in the same JSON format as before.`
        }
      ],
      response_format: { type: "json_object" }
    })
    
    const { userStories: additionalStories } = JSON.parse(completion.choices[0].message.content!)
    userStories!.push(...additionalStories)
  }
  
  return state
}

// Node: Save user stories and data flows
async function saveUserStories(state: UserStoryGenerationState) {
  const { projectId, userStories, dataFlows } = state
  
  // Delete existing user stories and related data
  const { data: existingStories } = await supabase
    .from('user_stories')
    .select('id')
    .eq('project_id', projectId)
  
  if (existingStories && existingStories.length > 0) {
    const storyIds = existingStories.map(s => s.id)
    
    // Delete data flow steps
    const { data: dataFlowIds } = await supabase
      .from('data_flows')
      .select('id')
      .in('user_story_id', storyIds)
    
    if (dataFlowIds && dataFlowIds.length > 0) {
      await supabase
        .from('data_flow_steps')
        .delete()
        .in('data_flow_id', dataFlowIds.map(df => df.id))
    }
    
    // Delete data flows
    await supabase
      .from('data_flows')
      .delete()
      .in('user_story_id', storyIds)
    
    // Delete user stories
    await supabase
      .from('user_stories')
      .delete()
      .eq('project_id', projectId)
  }
  
  // Insert new user stories
  const storiesToInsert = userStories!.map((story, index) => ({
    project_id: projectId,
    title: story.title,
    as_a: story.asA,
    i_want: story.iWant,
    so_that: story.soThat,
    acceptance_criteria: story.acceptanceCriteria,
    priority: story.priority,
    complexity_points: story.complexityPoints,
    position: index,
    is_edited: false
  }))
  
  const { data: insertedStories, error } = await supabase
    .from('user_stories')
    .insert(storiesToInsert)
    .select()
  
  if (error) throw error
  
  // Insert data flows and steps
  for (let i = 0; i < insertedStories.length; i++) {
    const story = insertedStories[i]
    const flow = dataFlows![i]
    
    // Insert data flow
    const { data: insertedFlow } = await supabase
      .from('data_flows')
      .insert({
        user_story_id: story.id,
        description: flow.description
      })
      .select()
      .single()
    
    // Insert data flow steps
    const stepsToInsert = flow.steps.map((step: any) => ({
      data_flow_id: insertedFlow.id,
      step_number: step.stepNumber,
      action: step.action,
      source: step.source,
      target: step.target,
      data_payload: step.dataPayload
    }))
    
    await supabase
      .from('data_flow_steps')
      .insert(stepsToInsert)
  }
  
  // Update project status
  await supabase
    .from('projects')
    .update({ 
      current_step: 'user_stories',
      status: 'user_stories'
    })
    .eq('id', projectId)
  
  // Log event
  await supabase.from('langgraph_state_events').insert({
    project_id: projectId,
    event_type: 'user_stories_generated',
    event_data: {
      storyCount: insertedStories.length,
      dataFlowCount: dataFlows!.length
    },
    sequence_number: await getNextSequenceNumber(projectId)
  })
  
  return {
    ...state,
    insertedStories
  }
}

// Helper function
async function getNextSequenceNumber(projectId: string): Promise<number> {
  const { data } = await supabase
    .from('langgraph_state_events')
    .select('sequence_number')
    .eq('project_id', projectId)
    .order('sequence_number', { ascending: false })
    .limit(1)
    .single()
  
  return (data?.sequence_number || 0) + 1
}

// Create the workflow
const workflow = new StateGraph<UserStoryGenerationState>({
  channels: {
    projectId: null,
    selectedSolutions: null,
    persona: null,
    coreProblem: null,
    userStories: null,
    dataFlows: null,
    insertedStories: null
  }
})

// Add nodes
workflow.addNode("loadContext", loadContext)
workflow.addNode("generateUserStories", generateUserStories)
workflow.addNode("generateDataFlows", generateDataFlows)
workflow.addNode("validateStories", validateStories)
workflow.addNode("saveUserStories", saveUserStories)

// Define the flow
workflow.setEntryPoint("loadContext")
workflow.addEdge("loadContext", "generateUserStories")
workflow.addEdge("generateUserStories", "generateDataFlows")
workflow.addEdge("generateDataFlows", "validateStories")
workflow.addEdge("validateStories", "saveUserStories")
workflow.setFinishPoint("saveUserStories")

const app = workflow.compile()

serve(async (req) => {
  try {
    const { projectId } = await req.json()
    
    const startTime = Date.now()
    
    // Execute the workflow
    const result = await app.invoke({ projectId })
    
    // Get all user stories with data flows
    const { data: allStories } = await supabase
      .from('user_stories')
      .select(`
        *,
        data_flows(
          *,
          data_flow_steps(*)
        )
      `)
      .eq('project_id', projectId)
      .order('position')
    
    // Log execution
    await supabase.from('langgraph_execution_logs').insert({
      project_id: projectId,
      node_name: 'generate_user_stories_workflow',
      input_state: { projectId },
      output_state: { 
        storyCount: allStories?.length
      },
      status: 'success',
      execution_time_ms: Date.now() - startTime
    })
    
    return new Response(JSON.stringify({ 
      userStories: allStories
    }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error('Error in generate-user-stories:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})