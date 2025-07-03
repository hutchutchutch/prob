// supabase/functions/generate-solutions/index.ts
import { serve } from "std/http/server.ts"
import { createClient } from "@supabase/supabase-js"
import { OpenAI } from "openai"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-request-id',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    console.log('Generate solutions function started')
    
    // Initialize clients
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!openaiKey || !supabaseUrl || !supabaseServiceKey) {
      console.error('Missing required environment variables')
      return new Response(JSON.stringify({ 
        error: { message: 'Service configuration error', code: 'CONFIG_ERROR' }
      }), { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }
    
    const openai = new OpenAI({ apiKey: openaiKey })
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Parse request
    const { projectId, personaId, lockedSolutionIds = [] } = await req.json()
    
    if (!projectId || !personaId) {
      return new Response(JSON.stringify({ 
        error: { message: 'Missing required fields', code: 'INVALID_REQUEST' }
      }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }
    
    console.log('Processing persona:', personaId)
    
    // Step 1: Load persona and problem context
    const { data: persona, error: personaError } = await supabase
      .from('personas')
      .select(`
        *,
        core_problems!inner(
          validated_problem
        )
      `)
      .eq('id', personaId)
      .single()
    
    if (personaError || !persona) {
      console.error('Error loading persona:', personaError)
      throw new Error('Failed to load persona data')
    }
    
    const coreProblem = persona.core_problems.validated_problem
    console.log('Core problem:', coreProblem?.substring(0, 50) + '...')
    
    // Step 2: Get pain points
    const { data: painPoints } = await supabase
      .from('pain_points')
      .select('*')
      .eq('persona_id', personaId)
      .order('position')
    
    const painPointsArray = painPoints || []
    
    if (painPointsArray.length === 0) {
      console.log('No pain points found for persona')
      return new Response(JSON.stringify({ 
        error: { message: 'No pain points found for this persona', code: 'NO_PAIN_POINTS' }
      }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }
    
    console.log('Found', painPointsArray.length, 'pain points')
    
    // Step 3: Get existing solutions
    const { data: existingSolutions } = await supabase
      .from('key_solutions')
      .select('*')
      .eq('persona_id', personaId)
      .order('position')
    
    const existingSolutionsArray = existingSolutions || []
    const lockedSolutions = existingSolutionsArray.filter(s => 
      lockedSolutionIds.includes(s.id)
    )
    
    const solutionsToGenerate = 5 - lockedSolutions.length
    console.log('Generating', solutionsToGenerate, 'solutions')
    
    // Step 4: Generate solutions
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an expert product strategist and solution architect.
          Generate innovative software solutions that directly address the identified pain points.
          Solutions should be specific, implementable, and valuable.
          
          CRITICAL REQUIREMENT: Each solution MUST directly address one or more of the provided pain points.
          
          Solutions should be:
          - Specific software features or capabilities
          - Technically feasible to implement
          - Clearly valuable to the persona
          - Different from each other (diverse approaches)
          - Appropriately scoped (not too broad or narrow)`
        },
        {
          role: "user",
          content: `Generate ${solutionsToGenerate} software solutions that address these pain points:

          CORE PROBLEM: "${coreProblem}"
          
          PERSONA: ${persona.name} (${persona.role} in ${persona.industry})
          
          PAIN POINTS TO SOLVE:
          ${painPointsArray.map((pp, i) => `${i}. [${pp.severity}] ${pp.description}`).join('\n')}
          
          ${lockedSolutions.length > 0 ? `KEEP these existing solutions: ${JSON.stringify(lockedSolutions.map(s => s.title))}` : ''}
          
          INSTRUCTIONS:
          1. Each solution must clearly address at least one pain point
          2. Reference pain points by their index numbers (0, 1, 2, etc.)
          3. Solutions should be implementable software features
          4. Vary the complexity and approach across solutions
          5. Focus on practical, valuable solutions
          
          Return a JSON object with a 'solutions' array:
          {
            "solutions": [
              {
                "title": "Clear, specific solution title",
                "description": "Detailed explanation of how this solution works and what value it provides",
                "solutionType": "Feature|Integration|Automation|Analytics|Platform",
                "complexity": "Low|Medium|High",
                "addressedPainPoints": [0, 1] // array of pain point indices this addresses
              }
            ]
          }`
        }
      ],
      response_format: { type: "json_object" }
    })
    
    const { solutions } = JSON.parse(completion.choices[0].message.content!)
    console.log('Generated', solutions.length, 'solutions')
    
    // Step 5: Delete non-locked solutions
    if (lockedSolutionIds.length > 0) {
      await supabase
        .from('key_solutions')
        .delete()
        .eq('persona_id', personaId)
        .not('id', 'in', `(${lockedSolutionIds.join(',')})`)
    } else {
      await supabase
        .from('key_solutions')
        .delete()
        .eq('persona_id', personaId)
    }
    
    // Step 6: Insert new solutions
    const generationBatch = crypto.randomUUID()
    const solutionsToInsert = solutions.map((solution: any, index: number) => ({
      persona_id: personaId,
      title: solution.title,
      description: solution.description,
      solution_type: solution.solutionType,
      complexity: solution.complexity,
      position: index + lockedSolutionIds.length,
      is_locked: false,
      generation_batch: generationBatch
    }))
    
    const { data: insertedSolutions, error: insertError } = await supabase
      .from('key_solutions')
      .insert(solutionsToInsert)
      .select()
    
    if (insertError) {
      console.error('Error inserting solutions:', insertError)
      throw new Error('Failed to save solutions')
    }
    
    console.log('Inserted', insertedSolutions?.length, 'solutions')
    
    // Step 7: Create solution-pain point mappings
    const mappings: Array<{
      solution_id: string;
      pain_point_id: string;
      relevance_score: number;
      generation_batch: string;
    }> = []
    
    for (let solutionIndex = 0; solutionIndex < solutions.length; solutionIndex++) {
      const solution = solutions[solutionIndex]
      const insertedSolution = insertedSolutions![solutionIndex]
      
      for (const painPointIndex of solution.addressedPainPoints) {
        const painPoint = painPointsArray[painPointIndex]
        if (!painPoint) continue
        
        mappings.push({
          solution_id: insertedSolution.id,
          pain_point_id: painPoint.id,
          relevance_score: 0.8, // Default high relevance since solutions are generated to address specific pain points
          generation_batch: generationBatch
        })
      }
    }
    
    if (mappings.length > 0) {
      const { error: mappingError } = await supabase
        .from('solution_pain_point_mappings')
        .insert(mappings)
      
      if (mappingError) {
        console.error('Error inserting mappings:', mappingError)
        // Don't throw - solutions were successful
      } else {
        console.log('Inserted', mappings.length, 'solution-pain point mappings')
      }
    }
    
    // Get all solutions for response
    const { data: allSolutions } = await supabase
      .from('key_solutions')
      .select('*')
      .eq('persona_id', personaId)
      .order('position')
    
    console.log('Returning', allSolutions?.length, 'total solutions')
    
    return new Response(JSON.stringify({ 
      solutions: allSolutions || [],
      mappings: mappings
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
    
  } catch (error) {
    console.error('Error in generate-solutions:', error)
    return new Response(JSON.stringify({ 
      error: { 
        message: error.message || 'Internal server error', 
        code: 'GENERATION_ERROR' 
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})