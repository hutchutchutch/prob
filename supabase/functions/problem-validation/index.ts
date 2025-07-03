// supabase/functions/problem-validation/index.ts
import { serve } from "std/http/server.ts"
import { createClient } from "@supabase/supabase-js"
import { OpenAI } from "openai"

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
    
    console.log('Environment variables validated')
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
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
    
    // Store in database
    let coreProblemId = crypto.randomUUID()
    let actualProjectId = projectId
    
    if (projectId) {
      console.log('Storing core problem in database for project:', projectId)
      
      // Check if project exists
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .single()
      
      if (projectError || !project) {
        console.warn('Project not found:', projectError)
        
        // Try to create a default project if it doesn't exist
        // First check if we have any workspace
        const { data: workspaces, error: wsError } = await supabase
          .from('workspaces')
          .select('id')
          .limit(1)
        
        if (wsError || !workspaces || workspaces.length === 0) {
          console.warn('No workspace found, creating temporary project without workspace')
          // Create a project without workspace for now
          const { data: newProject, error: createError } = await supabase
            .from('projects')
            .insert({
              id: projectId,
              name: 'Untitled Project',
              status: 'problem_input',
              current_step: 'problem_input'
            })
            .select()
            .single()
          
          if (createError) {
            console.error('Failed to create project:', createError)
            // Continue without storing in database
          } else {
            console.log('Created new project:', newProject.id)
          }
        } else {
          // Create project with workspace
          const { data: newProject, error: createError } = await supabase
            .from('projects')
            .insert({
              id: projectId,
              workspace_id: workspaces[0].id,
              name: 'Untitled Project',
              status: 'problem_input',
              current_step: 'problem_input'
            })
            .select()
            .single()
          
          if (createError) {
            console.error('Failed to create project with workspace:', createError)
          } else {
            console.log('Created new project with workspace:', newProject.id)
          }
        }
      }
      
      // Now try to insert the core problem
      const { data: coreProblem, error: coreProblemError } = await supabase
        .from('core_problems')
        .insert({
          id: coreProblemId,
          project_id: actualProjectId,
          original_input: problemInput,
          validated_problem: analysis.isValid ? problemInput : null,
          is_valid: analysis.isValid,
          validation_feedback: analysis.feedback,
          version: 1
        })
        .select()
        .single()
      
      if (coreProblemError) {
        console.error('Error storing core problem:', coreProblemError)
        // If it's a unique constraint violation, try to get the existing one
        if (coreProblemError.code === '23505') {
          const { data: existingProblem } = await supabase
            .from('core_problems')
            .select('id')
            .eq('project_id', actualProjectId)
            .eq('version', 1)
            .single()
          
          if (existingProblem) {
            coreProblemId = existingProblem.id
            console.log('Using existing core problem:', coreProblemId)
          }
        }
      } else {
        console.log('Core problem stored successfully:', coreProblem.id)
        coreProblemId = coreProblem.id
      }
    }
    
    const result = {
      originalInput: problemInput,
      isValid: analysis.isValid,
      validationFeedback: analysis.feedback,
      validatedProblem: analysis.isValid ? problemInput : (analysis.suggestedRefinement || problemInput),
      keyTerms: analysis.keyTerms || [],
      projectId: actualProjectId || crypto.randomUUID(),
      coreProblemId: coreProblemId
    }

    console.log('Validation complete, isValid:', result.isValid)
    console.log('Returning coreProblemId:', result.coreProblemId)

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