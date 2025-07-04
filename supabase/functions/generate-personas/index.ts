// supabase/functions/generate-personas/index.ts
import { serve } from "std/http/server.ts";
import { createClient } from "@supabase/supabase-js";
import { OpenAI } from "openai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-request-id',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    console.log('Generate personas function started')
    
    // Validate environment variables
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
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Validate request body
    const { projectId, coreProblemId, coreProblem, lockedPersonaIds = [] } = await req.json()
    
    if (!projectId || !coreProblemId || !coreProblem) {
      return new Response(JSON.stringify({ 
        error: { message: 'Missing required fields', code: 'INVALID_REQUEST' }
      }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }
    
    console.log('Generating personas for problem:', coreProblem.substring(0, 50) + '...')
    
    // Initialize OpenAI
    const openai = new OpenAI({ apiKey: openaiKey })
    
    // Generate personas
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a persona generator. Create diverse personas that would experience the given problem. IMPORTANT: Always include all required fields in your response.`
        },
        {
          role: "user",
          content: `Problem: "${coreProblem}"
          
          Generate 5 diverse personas who would face this problem.
          
          IMPORTANT: Each persona MUST have ALL of these fields:
          - name: A punny name that captures the essence of the persona (max 3 words, letters and spaces only, NO special characters)
          - industry: The industry they work in
          - role: Their job title
          - description: Brief description of who they are and why they face this problem
          - painDegree: A number from 1 to 5 indicating how severely they experience this problem
          
          Return as JSON:
          {
            "personas": [
              {
                "name": "Punny name (REQUIRED - max 3 words, letters and spaces only)",
                "industry": "Industry Name (REQUIRED)",
                "role": "Job Title (REQUIRED)",
                "description": "Brief description (REQUIRED)",
                "painDegree": 3
              }
            ]
          }`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    })
    
    const aiResponse = completion.choices[0].message.content!
    console.log('AI Response:', aiResponse)
    
    let result;
    try {
      result = JSON.parse(aiResponse)
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      throw new Error('Invalid AI response format')
    }
    
    // Validate the AI response structure
    if (!result.personas || !Array.isArray(result.personas)) {
      console.error('Invalid AI response structure:', result)
      throw new Error('AI response missing personas array')
    }
    
    // Validate and clean each persona
    const validatedPersonas = result.personas.map((persona: any, index: number) => {
      // Validate required fields
      if (!persona.name || typeof persona.name !== 'string' || persona.name.trim() === '') {
        console.error(`Persona ${index} missing or invalid name:`, persona)
        throw new Error(`Persona ${index} is missing a valid name`)
      }
      
      if (!persona.industry || typeof persona.industry !== 'string' || persona.industry.trim() === '') {
        console.error(`Persona ${index} missing or invalid industry:`, persona)
        throw new Error(`Persona ${index} is missing a valid industry`)
      }
      
      if (!persona.role || typeof persona.role !== 'string' || persona.role.trim() === '') {
        console.error(`Persona ${index} missing or invalid role:`, persona)
        throw new Error(`Persona ${index} is missing a valid role`)
      }
      
      // Clean the name - remove any special characters and ensure max 3 words
      const cleanedName = persona.name
        .replace(/[^a-zA-Z\s]/g, '') // Remove non-letter characters
        .trim()
        .split(/\s+/) // Split by whitespace
        .slice(0, 3) // Max 3 words
        .join(' ')
      
      if (!cleanedName) {
        throw new Error(`Persona ${index} has an invalid name after cleaning: ${persona.name}`)
      }
      
      return {
        name: cleanedName,
        industry: persona.industry.trim(),
        role: persona.role.trim(),
        description: persona.description || '',
        painDegree: Math.min(5, Math.max(1, parseInt(persona.painDegree) || 3))
      }
    })
    
    console.log('Validated personas:', validatedPersonas)
    
    const generationBatch = crypto.randomUUID()
    
    // Store personas in database
    const personasToInsert = validatedPersonas.map((persona: any, index: number) => ({
      id: crypto.randomUUID(),
      core_problem_id: coreProblemId,
      name: persona.name,
      industry: persona.industry,
      role: persona.role,
      pain_degree: persona.painDegree,
      position: index + 1,
      is_locked: false,
      is_active: false,
      generation_batch: generationBatch
    }))
    
    console.log('Inserting personas into database...')
    console.log('Core problem ID:', coreProblemId)
    console.log('Personas to insert:', JSON.stringify(personasToInsert, null, 2))
    
    const { data: insertedPersonas, error: insertError } = await supabase
      .from('personas')
      .insert(personasToInsert)
      .select()
    
    if (insertError) {
      console.error('Error inserting personas:', insertError)
      console.error('Error details:', JSON.stringify(insertError, null, 2))
      
      // Check if it's a foreign key constraint error
      if (insertError.code === '23503') {
        // Try to verify if the core problem exists
        const { data: coreProblemCheck, error: checkError } = await supabase
          .from('core_problems')
          .select('id')
          .eq('id', coreProblemId)
          .single()
        
        if (checkError || !coreProblemCheck) {
          console.error('Core problem not found in database:', coreProblemId)
          return new Response(JSON.stringify({ 
            error: { 
              message: 'Core problem not found. Please validate the problem again.', 
              code: 'CORE_PROBLEM_NOT_FOUND',
              details: { coreProblemId }
            }
          }), { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          })
        }
      }
      
      throw new Error('Failed to store personas in database: ' + insertError.message)
    }
    
    console.log('Personas stored successfully:', insertedPersonas?.length)
    console.log('First inserted persona:', insertedPersonas?.[0])
    
    // Format response to match frontend expectations
    const formattedPersonas = insertedPersonas?.map((persona: any) => ({
      id: persona.id,
      name: persona.name,
      industry: persona.industry,
      role: persona.role,
      description: validatedPersonas.find((p: any) => p.name === persona.name)?.description || '',
      pain_degree: persona.pain_degree,
      demographics: {
        industry: persona.industry,
        role: persona.role
      },
      psychographics: {},
      goals: [],
      frustrations: [],
      batch_id: persona.generation_batch,
      is_locked: persona.is_locked,
      created_at: persona.created_at,
      updated_at: persona.created_at
    }))
    
    return new Response(JSON.stringify({ personas: formattedPersonas || [] }), {
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      }
    })
    
  } catch (error) {
    console.error('Function error:', error)
    return new Response(JSON.stringify({ 
      error: {
        message: error.message || 'Internal server error',
        code: 'INTERNAL_ERROR'
      }
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      }
    })
  }
})