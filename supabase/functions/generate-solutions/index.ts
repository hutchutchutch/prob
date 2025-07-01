// supabase/functions/generate-solutions/index.ts
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

interface SolutionGenerationState {
  projectId: string
  personaId: string
  persona?: any
  coreProblem?: string
  painPoints?: any[]
  lockedSolutionIds: string[]
  existingSolutions?: any[]
  newSolutions?: any[]
  solutionMappings?: any[]
  generationBatch?: string
}

// Node: Load context including persona and pain points
async function loadContext(state: SolutionGenerationState) {
  // Get persona with core problem
  const { data: persona } = await supabase
    .from('personas')
    .select(`
      *,
      core_problems!inner(
        validated_problem
      )
    `)
    .eq('id', state.personaId)
    .single()
  
  // Get pain points
  const { data: painPoints } = await supabase
    .from('pain_points')
    .select('*')
    .eq('persona_id', state.personaId)
    .order('position')
  
  // Get existing solutions
  const { data: existingSolutions } = await supabase
    .from('key_solutions')
    .select('*')
    .eq('persona_id', state.personaId)
    .order('position')
  
  return {
    ...state,
    persona,
    coreProblem: persona.core_problems.validated_problem,
    painPoints: painPoints || [],
    existingSolutions: existingSolutions || [],
    generationBatch: crypto.randomUUID()
  }
}

// Node: Generate solutions that address the pain points
async function generateSolutions(state: SolutionGenerationState) {
  const { persona, coreProblem, painPoints, existingSolutions, lockedSolutionIds } = state
  
  const lockedSolutions = existingSolutions?.filter(s => 
    lockedSolutionIds.includes(s.id)
  ) || []
  
  const solutionsToGenerate = 5 - lockedSolutions.length
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `You are an expert product strategist and solution architect.
        Generate innovative software solutions that directly address the identified pain points.
        Solutions should be specific, implementable, and valuable.`
      },
      {
        role: "user",
        content: `Core Problem: "${coreProblem}"
        
        Persona: ${persona.name} (${persona.role} in ${persona.industry})
        
        Pain Points:
        ${painPoints?.map((pp, i) => `${i + 1}. [${pp.severity}] ${pp.description}`).join('\n') || 'None'}
        
        ${lockedSolutions.length > 0 ? `Keep these existing solutions: ${JSON.stringify(lockedSolutions.map(s => s.title))}` : ''}
        
        Generate ${solutionsToGenerate} software solutions.
        
        Return as JSON:
        {
          "solutions": [
            {
              "title": "Solution title",
              "description": "How this solution works and what it accomplishes",
              "solutionType": "Feature|Integration|Automation|Analytics|Platform",
              "complexity": "Low|Medium|High",
              "addressedPainPoints": [0, 1, 2] // indices of pain points this solution addresses
            }
          ]
        }`
      }
    ],
    response_format: { type: "json_object" }
  })
  
  const { solutions } = JSON.parse(completion.choices[0].message.content!)
  
  return {
    ...state,
    newSolutions: solutions
  }
}

// Node: Calculate solution-pain point relevance scores
async function calculateRelevanceScores(state: SolutionGenerationState) {
  const { newSolutions, painPoints } = state
  
  const mappings: any[] = []
  
  for (const solution of newSolutions!) {
    for (const painPointIndex of solution.addressedPainPoints) {
      const painPoint = painPoints![painPointIndex]
      if (!painPoint) continue
      
      // Calculate relevance score using GPT-4
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: `Rate how well a solution addresses a specific pain point on a scale of 0.0 to 1.0.`
          },
          {
            role: "user",
            content: `Pain Point: ${painPoint.description}
            Solution: ${solution.title} - ${solution.description}
            
            Rate the relevance (0.0-1.0) and explain briefly.
            Return as JSON: { "score": 0.0-1.0, "reasoning": "brief explanation" }`
          }
        ],
        response_format: { type: "json_object" }
      })
      
      const { score } = JSON.parse(completion.choices[0].message.content!)
      
      mappings.push({
        solution,
        painPointId: painPoint.id,
        relevanceScore: score
      })
    }
  }
  
  return {
    ...state,
    solutionMappings: mappings
  }
}

// Node: Ensure solution diversity and coverage
async function ensureCoverage(state: SolutionGenerationState) {
  const { newSolutions, painPoints, solutionMappings } = state
  
  // Check if all pain points are addressed
  const addressedPainPointIds = new Set(solutionMappings!.map(m => m.painPointId))
  const unaddressedPainPoints = painPoints!.filter(pp => !addressedPainPointIds.has(pp.id))
  
  if (unaddressedPainPoints.length > 0) {
    // Generate additional solution for unaddressed pain points
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `Generate a solution that specifically addresses unaddressed pain points.`
        },
        {
          role: "user",
          content: `These pain points are not well addressed:
          ${unaddressedPainPoints.map(pp => pp.description).join('\n')}
          
          Generate one comprehensive solution that addresses these.
          Use the same JSON format as before.`
        }
      ],
      response_format: { type: "json_object" }
    })
    
    const { solutions } = JSON.parse(completion.choices[0].message.content!)
    
    // Add the new solution and its mappings
    newSolutions!.push(solutions[0])
    
    for (const pp of unaddressedPainPoints) {
      solutionMappings!.push({
        solution: solutions[0],
        painPointId: pp.id,
        relevanceScore: 0.8 // Default high relevance for targeted solution
      })
    }
  }
  
  return state
}

// Node: Save solutions and mappings to database
async function saveSolutions(state: SolutionGenerationState) {
  const { projectId, personaId, newSolutions, solutionMappings, lockedSolutionIds, generationBatch } = state
  
  // Delete non-locked solutions and their mappings
  if (lockedSolutionIds.length > 0) {
    const { data: solutionsToDelete } = await supabase
      .from('key_solutions')
      .select('id')
      .eq('persona_id', personaId)
      .not('id', 'in', `(${lockedSolutionIds.join(',')})`)
    
    if (solutionsToDelete && solutionsToDelete.length > 0) {
      const idsToDelete = solutionsToDelete.map(s => s.id)
      
      // Delete mappings first
      await supabase
        .from('solution_pain_point_mappings')
        .delete()
        .in('solution_id', idsToDelete)
      
      // Then delete solutions
      await supabase
        .from('key_solutions')
        .delete()
        .in('id', idsToDelete)
    }
  } else {
    // Delete all mappings for this persona's solutions
    const { data: allSolutions } = await supabase
      .from('key_solutions')
      .select('id')
      .eq('persona_id', personaId)
    
    if (allSolutions && allSolutions.length > 0) {
      await supabase
        .from('solution_pain_point_mappings')
        .delete()
        .in('solution_id', allSolutions.map(s => s.id))
    }
    
    // Delete all solutions
    await supabase
      .from('key_solutions')
      .delete()
      .eq('persona_id', personaId)
  }
  
  // Insert new solutions
  const solutionsToInsert = newSolutions!.map((solution, index) => ({
    project_id: projectId,
    persona_id: personaId,
    title: solution.title,
    description: solution.description,
    solution_type: solution.solutionType,
    complexity: solution.complexity,
    position: index + lockedSolutionIds.length,
    is_locked: false,
    is_selected: false,
    generation_batch: generationBatch
  }))
  
  const { data: insertedSolutions, error } = await supabase
    .from('key_solutions')
    .insert(solutionsToInsert)
    .select()
  
  if (error) throw error
  
  // Create solution ID map
  const solutionIdMap = new Map()
  insertedSolutions.forEach((sol, index) => {
    solutionIdMap.set(newSolutions![index], sol.id)
  })
  
  // Insert mappings
  const mappingsToInsert = solutionMappings!
    .filter(m => solutionIdMap.has(m.solution))
    .map(m => ({
      solution_id: solutionIdMap.get(m.solution),
      pain_point_id: m.painPointId,
      relevance_score: m.relevanceScore
    }))
  
  await supabase
    .from('solution_pain_point_mappings')
    .insert(mappingsToInsert)
  
  // Update project status
  await supabase
    .from('projects')
    .update({ 
      current_step: 'solution_discovery',
      status: 'solution_discovery'
    })
    .eq('id', projectId)
  
  // Log event
  await supabase.from('langgraph_state_events').insert({
    project_id: projectId,
    event_type: 'solutions_generated',
    event_data: {
      personaId,
      generationBatch,
      solutionCount: insertedSolutions.length,
      mappingCount: mappingsToInsert.length,
      lockedCount: lockedSolutionIds.length
    },
    sequence_number: await getNextSequenceNumber(projectId)
  })
  
  return {
    ...state,
    insertedSolutions,
    insertedMappings: mappingsToInsert
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
const workflow = new StateGraph<SolutionGenerationState>({
  channels: {
    projectId: null,
    personaId: null,
    persona: null,
    coreProblem: null,
    painPoints: null,
    lockedSolutionIds: null,
    existingSolutions: null,
    newSolutions: null,
    solutionMappings: null,
    generationBatch: null,
    insertedSolutions: null,
    insertedMappings: null
  }
})

// Add nodes
workflow.addNode("loadContext", loadContext)
workflow.addNode("generateSolutions", generateSolutions)
workflow.addNode("calculateRelevanceScores", calculateRelevanceScores)
workflow.addNode("ensureCoverage", ensureCoverage)
workflow.addNode("saveSolutions", saveSolutions)

// Define the flow
workflow.setEntryPoint("loadContext")
workflow.addEdge("loadContext", "generateSolutions")
workflow.addEdge("generateSolutions", "calculateRelevanceScores")
workflow.addEdge("calculateRelevanceScores", "ensureCoverage")
workflow.addEdge("ensureCoverage", "saveSolutions")
workflow.setFinishPoint("saveSolutions")

const app = workflow.compile()

serve(async (req) => {
  try {
    const { projectId, personaId, lockedSolutionIds = [] } = await req.json()
    
    const startTime = Date.now()
    
    // Execute the workflow
    const result = await app.invoke({
      projectId,
      personaId,
      lockedSolutionIds
    })
    
    // Get all solutions with mappings
    const { data: allSolutions } = await supabase
      .from('key_solutions')
      .select(`
        *,
        solution_pain_point_mappings(
          pain_point_id,
          relevance_score
        )
      `)
      .eq('persona_id', personaId)
      .order('position')
    
    // Log execution
    await supabase.from('langgraph_execution_logs').insert({
      project_id: projectId,
      node_name: 'generate_solutions_workflow',
      input_state: { projectId, personaId, lockedSolutionIds },
      output_state: { 
        solutionCount: allSolutions?.length,
        mappingCount: result.insertedMappings?.length
      },
      status: 'success',
      execution_time_ms: Date.now() - startTime
    })
    
    return new Response(JSON.stringify({ 
      solutions: allSolutions,
      mappings: result.insertedMappings
    }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error('Error in generate-solutions:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})