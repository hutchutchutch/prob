// supabase/functions/validate-problem/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { OpenAI } from "https://esm.sh/openai@4"

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

serve(async (req) => {
  // Add CORS headers for browser compatibility
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    const { problemInput, projectId } = await req.json()
    
    console.log('Validating problem:', problemInput)
    
    // Validate the problem statement using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an expert product manager and problem analyst. 
          Analyze the given problem statement and determine if it's a valid, actionable problem.
          A valid problem should:
          1. Describe a clear pain point or need
          2. Be specific enough to generate solutions
          3. Not be too broad or vague
          4. Relate to a potential software solution`
        },
        {
          role: "user",
          content: `Analyze this problem statement: "${problemInput}"
          
          Respond in JSON format:
          {
            "isValid": boolean,
            "feedback": "Explanation of why it's valid or what needs improvement",
            "suggestedRefinement": "A clearer version of the problem if needed",
            "keyTerms": ["term1", "term2", "term3"]
          }`
        }
      ],
      response_format: { type: "json_object" }
    })
    
    const analysis = JSON.parse(completion.choices[0].message.content!)
    
    // Create result object
    const result = {
      originalInput: problemInput,
      isValid: analysis.isValid,
      validationFeedback: analysis.feedback,
      validatedProblem: analysis.isValid ? problemInput : analysis.suggestedRefinement,
      keyTerms: analysis.keyTerms || [],
      projectId: projectId || crypto.randomUUID(),
      coreProblemId: crypto.randomUUID()
    }
    
    console.log('Validation result:', result)
    
    return new Response(JSON.stringify(result), {
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      },
    })
  } catch (error) {
    console.error('Error in problem-validation:', error)
    return new Response(JSON.stringify({ 
      error: {
        message: error.message,
        code: 'VALIDATION_ERROR'
      }
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      },
    })
  }
})