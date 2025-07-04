// Test script for generate-personas edge function
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tyfmxjzcocjztocwemun.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5Zm14anpjb2NqenRvY3dlbXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MDIxODQsImV4cCI6MjA2Njk3ODE4NH0.D8x-aHx7HGlvuoMwEVN6zVYlcjC7Q93gEj6hdJA85Kg'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testGeneratePersonas() {
  console.log('Testing generate-personas edge function...')
  
  // First, validate a problem
  const projectId = crypto.randomUUID()
  const problemText = "I get coffee every morning and want a customized morning drink to start my day"
  
  console.log('Step 1: Validating problem...')
  const { data: validationData, error: validationError } = await supabase.functions.invoke('problem-validation', {
    body: {
      problemInput: problemText,
      projectId: projectId
    }
  })
  
  if (validationError) {
    console.error('Problem validation error:', validationError)
    return
  }
  
  console.log('Problem validated successfully:', validationData)
  
  // Now generate personas
  console.log('\nStep 2: Generating personas...')
  const { data: personasData, error: personasError } = await supabase.functions.invoke('generate-personas', {
    body: {
      projectId: projectId,
      coreProblemId: validationData.coreProblemId,
      coreProblem: validationData.validatedProblem || problemText,
      lockedPersonaIds: []
    }
  })
  
  if (personasError) {
    console.error('Personas generation error:', personasError)
  } else {
    console.log('Success! Generated personas:')
    console.log(JSON.stringify(personasData, null, 2))
    
    // Verify personas have names
    if (personasData.personas && personasData.personas.length > 0) {
      console.log('\nPersona names:')
      personasData.personas.forEach((persona, index) => {
        console.log(`${index + 1}. ${persona.name} - ${persona.role} in ${persona.industry}`)
      })
    }
  }
}

testGeneratePersonas() 