// supabase/functions/generate-personas/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { OpenAI } from "https://esm.sh/openai@4";

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
          content: `You are a persona generator. Create diverse personas that would experience the given problem.`
        },
        {
          role: "user",
          content: `Problem: "${coreProblem}"
          
          Generate 5 diverse personas who would face this problem.
          
          Return as JSON:
          {
            "personas": [
              {
                "name": "Punny name that captures the essence of the persona (max 3 words, letters and spaces only, no special characters)",
                "industry": "Industry Name",
                "role": "Job Title",
                "description": "Brief description of who they are and why they face this problem",
                "painDegree": 1-5
              }
            ]
          }`
        }
      ],
      response_format: { type: "json_object" }
    })
    
    const result = JSON.parse(completion.choices[0].message.content!)
    const generationBatch = crypto.randomUUID()
    
    // Store personas in database
    const personasToInsert = result.personas.map((persona: any, index: number) => ({
      id: crypto.randomUUID(),
      core_problem_id: coreProblemId,
      name: persona.name,
      industry: persona.industry,
      role: persona.role,
      pain_degree: persona.painDegree || 3,
      position: index + 1,
      is_locked: false,
      is_active: false,
      generation_batch: generationBatch
    }))
    
    console.log('Inserting personas into database...')
    console.log('Core problem ID:', coreProblemId)
    console.log('Personas to insert:', personasToInsert.length)
    
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
      description: result.personas.find((p: any) => p.name === persona.name)?.description || '',
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