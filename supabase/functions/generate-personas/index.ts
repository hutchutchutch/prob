// supabase/functions/generate-personas/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// @ts-ignore
import { StateGraph } from "https://esm.sh/@langchain/langgraph"
// @ts-ignore
import { OpenAI } from "https://esm.sh/openai@4"

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

interface PersonaGenerationState {
  projectId: string
  coreProblemId: string
  coreProblem: string
  lockedPersonaIds: string[]
  existingPersonas?: any[]
  newPersonas?: any[]
  generationBatch?: string
}

// Node: Load existing personas and problem context
async function loadContext(state: PersonaGenerationState) {
  // Get existing personas
  const { data: existingPersonas } = await supabase
    .from('personas')
    .select('*')
    .eq('core_problem_id', state.coreProblemId)
    .order('position')
  
  return {
    ...state,
    existingPersonas: existingPersonas || [],
    generationBatch: crypto.randomUUID()
  }
}

// Node: Generate new personas using GPT-4
async function generatePersonas(state: PersonaGenerationState) {
  const { coreProblem, existingPersonas, lockedPersonaIds } = state
  
  // Filter out locked personas
  const lockedPersonas = existingPersonas?.filter(p => 
    lockedPersonaIds.includes(p.id)
  ) || []
  
  const personasToGenerate = 5 - lockedPersonas.length
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `You are an expert at identifying user personas who would benefit from software solutions.
        Generate diverse personas across different industries and roles.
        Each persona should have a clear pain point related to the problem.`
      },
      {
        role: "user",
        content: `Problem: "${coreProblem}"
        
        ${lockedPersonas.length > 0 ? `Keep these existing personas: ${JSON.stringify(lockedPersonas.map(p => ({
          name: p.name,
          industry: p.industry,
          role: p.role
        })))}` : ''}
        
        Generate ${personasToGenerate} new personas who would face this problem.
        
        Return as JSON:
        {
          "personas": [
            {
              "name": "Descriptive name (e.g., 'Sally Sales-a-lot')",
              "industry": "Industry sector",
              "role": "Job title/role",
              "painDegree": 1-5 (how much this problem affects them),
              "description": "Brief description of how they experience this problem"
            }
          ]
        }`
      }
    ],
    response_format: { type: "json_object" }
  })
  
  const { personas } = JSON.parse(completion.choices[0].message.content!)
  
  return {
    ...state,
    newPersonas: personas
  }
}

// Node: Ensure diversity in personas
async function ensureDiversity(state: PersonaGenerationState) {
  const { newPersonas, existingPersonas, lockedPersonaIds } = state
  
  const lockedPersonas = existingPersonas?.filter(p => 
    lockedPersonaIds.includes(p.id)
  ) || []
  
  // Check for diversity across industries and roles
  const allPersonas = [...lockedPersonas, ...newPersonas!]
  const industries = new Set(allPersonas.map(p => p.industry))
  const roles = new Set(allPersonas.map(p => p.role))
  
  // If not diverse enough, regenerate
  if (industries.size < 3 || roles.size < 4) {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `Improve diversity in the persona set by varying industries and roles more.`
        },
        {
          role: "user",
          content: `Current personas lack diversity.
          Industries: ${Array.from(industries).join(', ')}
          Roles: ${Array.from(roles).join(', ')}
          
          Regenerate personas with more variety while keeping locked personas.
          Return the same JSON format as before.`
        }
      ],
      response_format: { type: "json_object" }
    })
    
    const { personas } = JSON.parse(completion.choices[0].message.content!)
    return { ...state, newPersonas: personas }
  }
  
  return state
}

// Node: Save personas to database
async function savePersonas(state: PersonaGenerationState) {
  const { coreProblemId, newPersonas, lockedPersonaIds, generationBatch, projectId } = state
  
  // Delete non-locked personas
  if (lockedPersonaIds.length > 0) {
    await supabase
      .from('personas')
      .delete()
      .eq('core_problem_id', coreProblemId)
      .not('id', 'in', `(${lockedPersonaIds.join(',')})`)
  } else {
    await supabase
      .from('personas')
      .delete()
      .eq('core_problem_id', coreProblemId)
  }
  
  // Insert new personas
  const personasToInsert = newPersonas!.map((persona, index) => ({
    core_problem_id: coreProblemId,
    name: persona.name,
    industry: persona.industry,
    role: persona.role,
    pain_degree: persona.painDegree,
    position: index + lockedPersonaIds.length,
    is_locked: false,
    is_active: false,
    generation_batch: generationBatch
  }))
  
  const { data: insertedPersonas, error } = await supabase
    .from('personas')
    .insert(personasToInsert)
    .select()
  
  if (error) throw error
  
  // Log event
  await supabase.from('langgraph_state_events').insert({
    project_id: projectId,
    event_type: 'personas_generated',
    event_data: {
      coreProblemId,
      generationBatch,
      personaCount: insertedPersonas.length,
      lockedCount: lockedPersonaIds.length
    },
    sequence_number: await getNextSequenceNumber(projectId)
  })
  
  return {
    ...state,
    insertedPersonas
  }
}

// Helper function to get next sequence number
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
const workflow = new StateGraph<PersonaGenerationState>({
  channels: {
    projectId: null,
    coreProblemId: null,
    coreProblem: null,
    lockedPersonaIds: null,
    existingPersonas: null,
    newPersonas: null,
    generationBatch: null,
    insertedPersonas: null
  }
})

// Add nodes
workflow.addNode("loadContext", loadContext)
workflow.addNode("generatePersonas", generatePersonas)
workflow.addNode("ensureDiversity", ensureDiversity)
workflow.addNode("savePersonas", savePersonas)

// Define the flow
workflow.setEntryPoint("loadContext")
workflow.addEdge("loadContext", "generatePersonas")
workflow.addEdge("generatePersonas", "ensureDiversity")
workflow.addEdge("ensureDiversity", "savePersonas")
workflow.setFinishPoint("savePersonas")

const app = workflow.compile()

serve(async (req) => {
  try {
    const { projectId, coreProblemId, coreProblem, lockedPersonaIds = [] } = await req.json()
    
    const startTime = Date.now()
    
    // Execute the workflow
    const result = await app.invoke({
      projectId,
      coreProblemId,
      coreProblem,
      lockedPersonaIds
    })
    
    // Get all personas (locked + new)
    const { data: allPersonas } = await supabase
      .from('personas')
      .select('*')
      .eq('core_problem_id', coreProblemId)
      .order('position')
    
    // Log execution
    await supabase.from('langgraph_execution_logs').insert({
      project_id: projectId,
      node_name: 'generate_personas_workflow',
      input_state: { projectId, coreProblemId, lockedPersonaIds },
      output_state: { personaCount: allPersonas?.length },
      status: 'success',
      execution_time_ms: Date.now() - startTime
    })
    
    return new Response(JSON.stringify({ personas: allPersonas }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error('Error in generate-personas:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})