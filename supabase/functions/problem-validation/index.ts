// supabase/functions/validate-problem/index.ts
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

// Define the state interface
interface ProblemValidationState {
  originalInput: string
  validatedProblem?: string
  isValid?: boolean
  validationFeedback?: string
  keyTerms?: string[]
  projectId?: string
}

// Node: Validate the problem statement
async function validateProblem(state: ProblemValidationState) {
  const { originalInput } = state
  
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
        content: `Analyze this problem statement: "${originalInput}"
        
        Respond in JSON format:
        {
          "isValid": boolean,
          "feedback": "Explanation of why it's valid or what needs improvement",
          "suggestedRefinement": "A clearer version of the problem if needed"
        }`
      }
    ],
    response_format: { type: "json_object" }
  })
  
  const analysis = JSON.parse(completion.choices[0].message.content!)
  
  return {
    ...state,
    isValid: analysis.isValid,
    validationFeedback: analysis.feedback,
    validatedProblem: analysis.isValid ? originalInput : analysis.suggestedRefinement
  }
}

// Node: Refine the problem for clarity
async function refineProblem(state: ProblemValidationState) {
  if (state.isValid) return state // Skip if already valid
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `You are an expert at refining problem statements to be clear, specific, and actionable.`
      },
      {
        role: "user",
        content: `Original problem: "${state.originalInput}"
        Feedback: ${state.validationFeedback}
        
        Create a refined problem statement that addresses the feedback while maintaining the user's intent.
        Make it specific and actionable for software development.`
      }
    ]
  })
  
  return {
    ...state,
    validatedProblem: completion.choices[0].message.content!.trim(),
    isValid: true
  }
}

// Node: Extract key domain terms
async function extractKeyTerms(state: ProblemValidationState) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `Extract key domain terms, technologies, and concepts from the problem statement.`
      },
      {
        role: "user",
        content: `Problem: "${state.validatedProblem}"
        
        Extract key terms that will help generate relevant personas and solutions.
        Return as JSON: { "keyTerms": ["term1", "term2", ...] }`
      }
    ],
    response_format: { type: "json_object" }
  })
  
  const { keyTerms } = JSON.parse(completion.choices[0].message.content!)
  
  return {
    ...state,
    keyTerms
  }
}

// Node: Save to database
async function saveToDatabase(state: ProblemValidationState) {
  const { projectId, originalInput, validatedProblem, isValid, validationFeedback } = state
  
  // Insert core problem record
  const { data: coreProblem, error } = await supabase
    .from('core_problems')
    .insert({
      project_id: projectId,
      original_input: originalInput,
      validated_problem: validatedProblem,
      is_valid: isValid,
      validation_feedback: validationFeedback,
      version: 1
    })
    .select()
    .single()
  
  if (error) throw error
  
  // Log event for event sourcing
  await supabase.from('langgraph_state_events').insert({
    project_id: projectId,
    event_type: 'problem_validated',
    event_data: {
      coreProblemId: coreProblem.id,
      ...state
    },
    sequence_number: 1
  })
  
  return {
    ...state,
    coreProblemId: coreProblem.id
  }
}

// Create the workflow
const workflow = new StateGraph<ProblemValidationState>({
  channels: {
    originalInput: null,
    validatedProblem: null,
    isValid: null,
    validationFeedback: null,
    keyTerms: null,
    projectId: null,
    coreProblemId: null
  }
})

// Add nodes
workflow.addNode("validateProblem", validateProblem)
workflow.addNode("refineProblem", refineProblem)
workflow.addNode("extractKeyTerms", extractKeyTerms)
workflow.addNode("saveToDatabase", saveToDatabase)

// Define the flow
workflow.setEntryPoint("validateProblem")
workflow.addEdge("validateProblem", "refineProblem")
workflow.addEdge("refineProblem", "extractKeyTerms")
workflow.addEdge("extractKeyTerms", "saveToDatabase")
workflow.setFinishPoint("saveToDatabase")

const app = workflow.compile()

serve(async (req) => {
  try {
    const { problemInput, projectId } = await req.json()
    
    // Execute the workflow
    const result = await app.invoke({
      originalInput: problemInput,
      projectId
    })
    
    // Log execution
    await supabase.from('langgraph_execution_logs').insert({
      project_id: projectId,
      node_name: 'validate_problem_workflow',
      input_state: { problemInput, projectId },
      output_state: result,
      status: 'success',
      execution_time_ms: Date.now() - performance.now()
    })
    
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error('Error in validate-problem:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})