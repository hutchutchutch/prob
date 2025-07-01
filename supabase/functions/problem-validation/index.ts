// supabase/functions/validate-problem/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { OpenAI } from "https://esm.sh/openai@4"

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-request-id',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  }
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    console.log('Function started')
    
    // Validate environment variables
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiKey) {
      console.error('Missing OPENAI_API_KEY')
      return new Response(JSON.stringify({ 
        error: { message: 'Service configuration error', code: 'CONFIG_ERROR' }
      }), { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }
    
    console.log('OpenAI key found, length:', openaiKey.length)
    
    // Validate request body
    let requestData
    try {
      requestData = await req.json()
      console.log('Request data parsed:', Object.keys(requestData))
    } catch (error) {
      console.error('Invalid JSON:', error)
      return new Response(JSON.stringify({ 
        error: { message: 'Invalid request format', code: 'INVALID_JSON' }
      }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    const { problemInput, projectId } = requestData
    if (!problemInput) {
      return new Response(JSON.stringify({ 
        error: { message: 'problemInput is required', code: 'MISSING_INPUT' }
      }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    console.log('Processing problem:', problemInput.substring(0, 50) + '...')

    // Initialize OpenAI
    const openai = new OpenAI({ apiKey: openaiKey })
    console.log('OpenAI client initialized')

    // Call OpenAI with timeout
    const completion = await Promise.race([
      openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a problem analyst. Analyze the problem and respond with JSON."
          },
          {
            role: "user", 
            content: `Analyze: "${problemInput}"\n\nRespond with: {"isValid": boolean, "feedback": "string", "keyTerms": ["term1", "term2"]}`
          }
        ],
        response_format: { type: "json_object" }
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('OpenAI request timeout')), 25000)
      )
    ])

    console.log('OpenAI response received')
    const analysis = JSON.parse(completion.choices[0].message.content!)
    
    const result = {
      originalInput: problemInput,
      isValid: analysis.isValid,
      validationFeedback: analysis.feedback,
      validatedProblem: analysis.isValid ? problemInput : (analysis.suggestedRefinement || problemInput),
      keyTerms: analysis.keyTerms || [],
      projectId: projectId || crypto.randomUUID(),
      coreProblemId: crypto.randomUUID()
    }

    console.log('Validation complete, isValid:', result.isValid)

    return new Response(JSON.stringify(result), {
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      }
    })

  } catch (error) {
    console.error('Function error:', error)
    console.error('Error stack:', error.stack)
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