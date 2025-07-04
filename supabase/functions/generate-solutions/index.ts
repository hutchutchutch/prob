// supabase/functions/generate-solutions/index.ts
import { serve } from "std/http/server.ts"
import { OpenAI } from "openai"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-request-id',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

interface CoreProblem {
  id: string
  validated_problem: string
}

interface Persona {
  id: string
  name: string
  role: string
  industry: string
  description?: string
}

interface PainPoint {
  id: string
  description: string
  severity: string
  persona_id: string
}

interface GenerateSolutionsRequest {
  coreProblem: CoreProblem
  personas: Persona[]
  painPoints: PainPoint[]
}

interface Solution {
  id: string
  title: string
  description: string
  complexity: "low" | "medium" | "high"
  impact: "low" | "medium" | "high"
  aligned_personas: string[]
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    console.log('Generate solutions function started')
    console.log('Request method:', req.method)
    console.log('Request headers:', JSON.stringify(Object.fromEntries(req.headers.entries())))
    console.log('Request URL:', req.url)
    
    // Initialize OpenAI client
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiKey) {
      console.error('Missing OpenAI API key')
      return new Response(
        JSON.stringify({ error: { message: 'Service configuration error', code: 'CONFIG_ERROR' } }), 
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    const openai = new OpenAI({ apiKey: openaiKey })
    
    // Parse request body with better error handling
    let requestBody: GenerateSolutionsRequest;
    let rawBody: string = '';
    try {
      // First, try to read the body as text to log it
      const bodyClone = req.clone()
      rawBody = await bodyClone.text()
      console.log('Raw request body:', rawBody)
      console.log('Body length:', rawBody.length)
      
      // Check if body is empty
      if (!rawBody || rawBody.trim() === '') {
        console.error('Empty request body received')
        return new Response(
          JSON.stringify({ 
            error: { 
              message: 'Empty request body. Expected JSON with coreProblem, personas, and painPoints fields', 
              code: 'EMPTY_REQUEST_BODY'
            }
          }), 
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
      
      // Now parse the original request
      requestBody = await req.json()
      console.log('Parsed request body:', JSON.stringify(requestBody))
    } catch (parseError) {
      console.error('Error parsing request body:', parseError)
      console.error('Raw body that failed to parse:', rawBody)
      return new Response(
        JSON.stringify({ 
          error: { 
            message: `Invalid JSON in request body: ${parseError.message}. Body received: ${rawBody.substring(0, 200)}${rawBody.length > 200 ? '...' : ''}`, 
            code: 'INVALID_REQUEST_BODY'
          }
        }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    const { coreProblem, personas, painPoints } = requestBody
    
    // Validate required fields with detailed logging
    if (!coreProblem) {
      console.error('Missing coreProblem in request')
      return new Response(
        JSON.stringify({ error: { message: 'Missing required field: coreProblem', code: 'MISSING_CORE_PROBLEM' } }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    if (!personas) {
      console.error('Missing personas in request')
      return new Response(
        JSON.stringify({ error: { message: 'Missing required field: personas', code: 'MISSING_PERSONAS' } }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    if (!painPoints) {
      console.error('Missing painPoints in request')
      return new Response(
        JSON.stringify({ error: { message: 'Missing required field: painPoints', code: 'MISSING_PAIN_POINTS' } }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    if (!Array.isArray(personas) || personas.length === 0) {
      console.error('Invalid personas array:', personas)
      return new Response(
        JSON.stringify({ error: { message: 'At least one persona is required', code: 'INVALID_PERSONAS' } }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    if (!Array.isArray(painPoints)) {
      console.error('Invalid painPoints array:', painPoints)
      return new Response(
        JSON.stringify({ error: { message: 'painPoints must be an array', code: 'INVALID_PAIN_POINTS' } }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    console.log(`Processing request for ${personas.length} personas and ${painPoints.length} pain points`)
    console.log('Core problem:', coreProblem.validated_problem)
    console.log('First persona:', JSON.stringify(personas[0]))
    
    // Group pain points by persona for better context
    const painPointsByPersona = painPoints.reduce((acc, pp) => {
      if (!acc[pp.persona_id]) {
        acc[pp.persona_id] = []
      }
      acc[pp.persona_id].push(pp)
      return acc
    }, {} as Record<string, PainPoint[]>)
    
    // Generate solutions using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an expert product strategist and solution architect.
          Generate innovative software solutions that directly address the identified pain points across multiple personas.
          Each solution should align with exactly 2 personas who would benefit most from it.
          
          Solutions should be:
          - Specific software features or capabilities
          - Technically feasible to implement
          - Clearly valuable to the aligned personas
          - Different from each other (diverse approaches)
          - Appropriately scoped (not too broad or narrow)
          
          CRITICAL REQUIREMENTS:
          1. Generate exactly 5 solutions
          2. Each solution must align with exactly 2 personas (use their names)
          3. Each solution must address pain points from the aligned personas
          4. Vary complexity and impact levels across solutions
          5. Ensure solutions are complementary and cover different aspects of the problem`
        },
        {
          role: "user",
          content: `Generate 5 software solutions for this problem context:

          CORE PROBLEM: "${coreProblem.validated_problem}"
          
          PERSONAS:
          ${personas.map(p => `- ${p.name} (${p.role} in ${p.industry})`).join('\n')}
          
          PAIN POINTS BY PERSONA:
          ${personas.map(persona => {
            const personaPainPoints = painPointsByPersona[persona.id] || []
            return `${persona.name}:
            ${personaPainPoints.map(pp => `  • [${pp.severity}] ${pp.description}`).join('\n')}`
          }).join('\n\n')}
          
          INSTRUCTIONS:
          1. Each solution must address pain points from its 2 aligned personas
          2. Use exact persona names from the list above
          3. Vary complexity: include low, medium, and high complexity solutions
          4. Vary impact: include different impact levels (low, medium, high)
          5. Make solutions complementary - they should work together as a cohesive product suite
          6. Focus on practical, implementable software solutions
          
          Return a JSON object with this exact structure:
          {
            "solutions": [
              {
                "id": "sol_1",
                "title": "Clear, specific solution title",
                "description": "Detailed explanation of how this solution works and what value it provides to the aligned personas",
                "complexity": "low|medium|high",
                "impact": "low|medium|high",
                "aligned_personas": ["Persona Name 1", "Persona Name 2"]
              }
            ]
          }
          
          Ensure each solution has a unique id (sol_1, sol_2, sol_3, sol_4, sol_5).`
        }
      ],
      response_format: { type: "json_object" }
    })
    
    const result = JSON.parse(completion.choices[0].message.content!)
    
    if (!result.solutions || !Array.isArray(result.solutions)) {
      throw new Error('Invalid response format from AI')
    }
    
    // Validate solution structure
    const validatedSolutions: Solution[] = result.solutions.map((solution: any, index: number) => {
      if (!solution.id) {
        solution.id = `sol_${index + 1}`
      }
      
      // Ensure aligned_personas is an array of exactly 2 strings
      if (!Array.isArray(solution.aligned_personas) || solution.aligned_personas.length !== 2) {
        console.warn(`Solution ${solution.id} has invalid aligned_personas, using first 2 personas`)
        solution.aligned_personas = [personas[0].name, personas[1] ? personas[1].name : personas[0].name]
      }
      
      return {
        id: solution.id,
        title: solution.title || `Solution ${index + 1}`,
        description: solution.description || 'No description provided',
        complexity: solution.complexity || 'medium',
        impact: solution.impact || 'medium',
        aligned_personas: solution.aligned_personas
      }
    })
    
    console.log(`Successfully generated ${validatedSolutions.length} solutions`)
    
    return new Response(
      JSON.stringify({ solutions: validatedSolutions }), 
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
    
  } catch (error) {
    console.error('Error in generate-solutions:', error)
    console.error('Error stack:', error.stack)
    return new Response(
      JSON.stringify({ 
        error: { 
          message: error.message || 'Internal server error', 
          code: 'GENERATION_ERROR' 
        }
      }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})