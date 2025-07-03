// supabase/functions/generate-pain-points/index.ts
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
    console.log('Generate pain points function started')
    
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
    const { projectId, personaId, personas, lockedPainPointIds = [] } = await req.json()
    
    // Handle both API patterns: single personaId or personas array
    let activePersonaId = personaId
    if (!activePersonaId && personas && personas.length > 0) {
      activePersonaId = personas[0].id
    }
    
    if (!projectId || !activePersonaId) {
      return new Response(JSON.stringify({ 
        error: { message: 'Missing required fields', code: 'INVALID_REQUEST' }
      }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }
    
    console.log('Processing persona:', activePersonaId)
    
    // Step 1: Load persona and problem context
    const { data: persona, error: personaError } = await supabase
      .from('personas')
      .select(`
        *,
        core_problems!inner(
          validated_problem
        )
      `)
      .eq('id', activePersonaId)
      .single()
    
    if (personaError || !persona) {
      console.error('Error loading persona:', personaError)
      throw new Error('Failed to load persona data')
    }
    
    const coreProblem = persona.core_problems.validated_problem
    console.log('Core problem:', coreProblem?.substring(0, 50) + '...')
    
    // Step 2: Get existing pain points
    const { data: existingPainPoints = [] } = await supabase
      .from('pain_points')
      .select('*')
      .eq('persona_id', activePersonaId)
      .order('position')
    
    const lockedPainPoints = (existingPainPoints || []).filter(pp => 
      lockedPainPointIds.includes(pp.id)
    )
    
    const painPointsToGenerate = 7 - lockedPainPoints.length
    console.log('Generating', painPointsToGenerate, 'pain points')
    
    // Step 3: Generate pain points
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an expert at identifying specific, actionable pain points that personas experience with particular problems.

CRITICAL REQUIREMENT: Every pain point MUST be directly related to how the persona experiences the specified core problem in their daily work/life. Do not generate generic pain points - only those that stem from or connect to the core problem.

Pain points should be:
- Specific manifestations of the core problem for this persona
- Detailed problems they actually face, not vague statements
- Actionable (something that could theoretically be solved)
- Realistic for their role, industry, and demographics
- Varied in severity and impact areas`
        },
        {
          role: "user",
          content: `Generate ${painPointsToGenerate} pain points that specifically show how this persona experiences the core problem:

CORE PROBLEM TO ADDRESS: "${coreProblem}"

Persona Details:
- Name: ${persona.name}
- Role: ${persona.role} in ${persona.industry}
- Demographics: ${JSON.stringify(persona.demographics || {})}
- Psychographics: ${JSON.stringify(persona.psychographics || {})}

AVOID duplicating these existing pain points:
${lockedPainPoints.map((p) => p.description).join('\n')}

INSTRUCTIONS:
1. Each pain point MUST directly relate to "${coreProblem}"
2. Think about how someone in their specific role/industry would experience this problem
3. Consider their demographics and psychographics when crafting pain points
4. Make each pain point specific to their daily work/life context
5. Vary the severity and impact areas across the pain points

Return a JSON object with a 'painPoints' array. Each pain point should have:
- description: detailed, specific pain point that directly connects to the core problem
- severity: low/medium/high/critical  
- impactArea: category of impact (time, money, productivity, stress, reputation, growth, efficiency, etc.)

Example format:
{
  "painPoints": [
    {
      "description": "Spends 3+ hours daily manually tracking customer interactions across multiple platforms because the core problem of [specific manifestation] prevents centralized visibility",
      "severity": "high",
      "impactArea": "time"
    }
  ]
}`
        }
      ],
      response_format: { type: "json_object" }
    })
    
    const { painPoints } = JSON.parse(completion.choices[0].message.content!)
    console.log('Generated', painPoints.length, 'pain points')
    
    // Step 4: Delete non-locked pain points
    if (lockedPainPointIds.length > 0) {
      await supabase
        .from('pain_points')
        .delete()
        .eq('persona_id', activePersonaId)
        .not('id', 'in', `(${lockedPainPointIds.join(',')})`)
    } else {
      await supabase
        .from('pain_points')
        .delete()
        .eq('persona_id', activePersonaId)
    }
    
    // Step 5: Insert new pain points
    const generationBatch = crypto.randomUUID()
    const painPointsToInsert = painPoints.map((painPoint: any, index: number) => ({
      persona_id: activePersonaId,
      description: painPoint.description,
      severity: painPoint.severity,
      impact_area: painPoint.impactArea,
      position: index + lockedPainPointIds.length,
      is_locked: false,
      generation_batch: generationBatch
    }))
    
    const { data: insertedPainPoints, error: insertError } = await supabase
      .from('pain_points')
      .insert(painPointsToInsert)
      .select()
    
    if (insertError) {
      console.error('Error inserting pain points:', insertError)
      throw new Error('Failed to save pain points')
    }
    
    console.log('Inserted', insertedPainPoints?.length, 'pain points')
    
    // Step 6: Update persona to active
    await supabase
      .from('personas')
      .update({ is_active: true })
      .eq('id', activePersonaId)
    
    // Deactivate other personas
    await supabase
      .from('personas')
      .update({ is_active: false })
      .eq('core_problem_id', persona.core_problem_id)
      .neq('id', activePersonaId)
    
    // Get all pain points for response
    const { data: allPainPoints } = await supabase
      .from('pain_points')
      .select('*')
      .eq('persona_id', activePersonaId)
      .order('position')
    
    console.log('Returning', allPainPoints?.length, 'total pain points')
    
    return new Response(JSON.stringify({ painPoints: allPainPoints || [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
    
  } catch (error) {
    console.error('Error in generate-pain-points:', error)
    return new Response(JSON.stringify({ 
      error: {
        message: error.message || 'Internal server error',
        code: 'INTERNAL_ERROR'
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})