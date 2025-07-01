// supabase/functions/generate-pain-points/index.ts
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

interface PainPointGenerationState {
  projectId: string
  personaId: string
  persona?: any
  coreProblem?: string
  lockedPainPointIds: string[]
  existingPainPoints?: any[]
  newPainPoints?: any[]
  generationBatch?: string
}

// Node: Load persona and problem context
async function loadContext(state: PainPointGenerationState) {
  // Get persona details
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
  
  // Get existing pain points
  const { data: existingPainPoints } = await supabase
    .from('pain_points')
    .select('*')
    .eq('persona_id', state.personaId)
    .order('position')
  
  return {
    ...state,
    persona,
    coreProblem: persona.core_problems.validated_problem,
    existingPainPoints: existingPainPoints || [],
    generationBatch: crypto.randomUUID()
  }
}

// Node: Generate pain points specific to the persona
async function generatePainPoints(state: PainPointGenerationState) {
  const { persona, coreProblem, existingPainPoints, lockedPainPointIds } = state
  
  const lockedPainPoints = existingPainPoints?.filter(pp => 
    lockedPainPointIds.includes(pp.id)
  ) || []
  
  const painPointsToGenerate = 3 - lockedPainPoints.length
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `You are an expert at understanding user pain points in specific contexts.
        Generate pain points that are specific, actionable, and directly related to the persona's role and industry.`
      },
      {
        role: "user",
        content: `Core Problem: "${coreProblem}"
        
        Persona: ${persona.name}
        Industry: ${persona.industry}
        Role: ${persona.role}
        Pain Level: ${persona.pain_degree}/5
        
        ${lockedPainPoints.length > 0 ? `Keep these existing pain points: ${JSON.stringify(lockedPainPoints.map(pp => pp.description))}` : ''}
        
        Generate ${painPointsToGenerate} specific pain points this persona experiences.
        
        Return as JSON:
        {
          "painPoints": [
            {
              "description": "Specific pain point description",
              "severity": "Critical|High|Medium",
              "impactArea": "Operations|Productivity|Revenue|Customer Experience|Compliance"
            }
          ]
        }`
      }
    ],
    response_format: { type: "json_object" }
  })
  
  const { painPoints } = JSON.parse(completion.choices[0].message.content!)
  
  return {
    ...state,
    newPainPoints: painPoints
  }
}

// Node: Validate pain point relevance
async function validateRelevance(state: PainPointGenerationState) {
  const { newPainPoints, persona, coreProblem } = state
  
  // Ensure pain points are specific and relevant
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `Validate that pain points are specific and directly relevant to the persona and problem.`
      },
      {
        role: "user",
        content: `Validate these pain points:
        ${JSON.stringify(newPainPoints)}
        
        For persona: ${persona.name} (${persona.role} in ${persona.industry})
        Problem: ${coreProblem}
        
        If any are too generic or not relevant, provide improved versions.
        Return the validated/improved pain points in the same JSON format.`
      }
    ],
    response_format: { type: "json_object" }
  })
  
  const { painPoints } = JSON.parse(completion.choices[0].message.content!)
  
  return {
    ...state,
    newPainPoints: painPoints
  }
}

// Node: Save pain points to database
async function savePainPoints(state: PainPointGenerationState) {
  const { personaId, newPainPoints, lockedPainPointIds, generationBatch, projectId } = state
  
  // Delete non-locked pain points
  if (lockedPainPointIds.length > 0) {
    await supabase
      .from('pain_points')
      .delete()
      .eq('persona_id', personaId)
      .not('id', 'in', `(${lockedPainPointIds.join(',')})`)
  } else {
    await supabase
      .from('pain_points')
      .delete()
      .eq('persona_id', personaId)
  }
  
  // Insert new pain points
  const painPointsToInsert = newPainPoints!.map((painPoint, index) => ({
    persona_id: personaId,
    description: painPoint.description,
    severity: painPoint.severity,
    impact_area: painPoint.impactArea,
    position: index + lockedPainPointIds.length,
    is_locked: false,
    generation_batch: generationBatch
  }))
  
  const { data: insertedPainPoints, error } = await supabase
    .from('pain_points')
    .insert(painPointsToInsert)
    .select()
  
  if (error) throw error
  
  // Update persona to active
  await supabase
    .from('personas')
    .update({ is_active: true })
    .eq('id', personaId)
  
  // Deactivate other personas
  await supabase
    .from('personas')
    .update({ is_active: false })
    .eq('core_problem_id', state.persona!.core_problem_id)
    .neq('id', personaId)
  
  // Log event
  await supabase.from('langgraph_state_events').insert({
    project_id: projectId,
    event_type: 'pain_points_generated',
    event_data: {
      personaId,
      generationBatch,
      painPointCount: insertedPainPoints.length,
      lockedCount: lockedPainPointIds.length
    },
    sequence_number: await getNextSequenceNumber(projectId)
  })
  
  return {
    ...state,
    insertedPainPoints
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
const workflow = new StateGraph<PainPointGenerationState>({
  channels: {
    projectId: null,
    personaId: null,
    persona: null,
    coreProblem: null,
    lockedPainPointIds: null,
    existingPainPoints: null,
    newPainPoints: null,
    generationBatch: null,
    insertedPainPoints: null
  }
})

// Add nodes
workflow.addNode("loadContext", loadContext)
workflow.addNode("generatePainPoints", generatePainPoints)
workflow.addNode("validateRelevance", validateRelevance)
workflow.addNode("savePainPoints", savePainPoints)

// Define the flow
workflow.setEntryPoint("loadContext")
workflow.addEdge("loadContext", "generatePainPoints")
workflow.addEdge("generatePainPoints", "validateRelevance")
workflow.addEdge("validateRelevance", "savePainPoints")
workflow.setFinishPoint("savePainPoints")

const app = workflow.compile()

serve(async (req) => {
  try {
    const { projectId, personaId, lockedPainPointIds = [] } = await req.json()
    
    const startTime = Date.now()
    
    // Execute the workflow
    const result = await app.invoke({
      projectId,
      personaId,
      lockedPainPointIds
    })
    
    // Get all pain points
    const { data: allPainPoints } = await supabase
      .from('pain_points')
      .select('*')
      .eq('persona_id', personaId)
      .order('position')
    
    // Log execution
    await supabase.from('langgraph_execution_logs').insert({
      project_id: projectId,
      node_name: 'generate_pain_points_workflow',
      input_state: { projectId, personaId, lockedPainPointIds },
      output_state: { painPointCount: allPainPoints?.length },
      status: 'success',
      execution_time_ms: Date.now() - startTime
    })
    
    return new Response(JSON.stringify({ painPoints: allPainPoints }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error('Error in generate-pain-points:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})