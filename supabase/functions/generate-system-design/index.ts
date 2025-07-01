// supabase/functions/generate-architecture/index.ts
// @ts-ignore
declare const Deno: any;

// @ts-ignore
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

interface ArchitectureGenerationState {
  projectId: string
  userStories?: any[]
  solutions?: any[]
  coreProblem?: string
  techStack?: any[]
  databaseSchema?: any
  uiScreens?: any[]
  designSystem?: any
}

// Node: Load project context
async function loadContext(state: ArchitectureGenerationState) {
  // Get user stories
  const { data: userStories } = await supabase
    .from('user_stories')
    .select('*')
    .eq('project_id', state.projectId)
    .order('position')
  
  // Get selected solutions with core problem
  const { data: solutions } = await supabase
    .from('key_solutions')
    .select(`
      *,
      personas!inner(
        core_problems!inner(
          validated_problem
        )
      )
    `)
    .eq('project_id', state.projectId)
    .eq('is_selected', true)
  
  const coreProblem = solutions?.[0]?.personas?.core_problems?.validated_problem
  
  return {
    ...state,
    userStories,
    solutions,
    coreProblem
  }
}

// Node: Generate technology stack recommendations
async function generateTechStack(state: ArchitectureGenerationState) {
  const { userStories, solutions, coreProblem } = state
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `You are a senior solutions architect with expertise in modern web technologies.
        Recommend a technology stack based on the requirements.
        Prioritize proven, scalable technologies with good developer experience.`
      },
      {
        role: "user",
        content: `Core Problem: "${coreProblem}"
        
        Key Features (from solutions):
        ${solutions!.map(s => `- ${s.title}: ${s.description}`).join('\n')}
        
        User Stories Summary:
        ${userStories!.slice(0, 3).map(us => `- As ${us.as_a}, I want ${us.i_want}`).join('\n')}
        
        Recommend a modern tech stack.
        
        Return as JSON:
        {
          "techStack": [
            {
              "layer": "Frontend|Backend|Database|DevOps|Testing",
              "technology": "Technology name",
              "justification": "Why this technology fits the requirements"
            }
          ]
        }`
      }
    ],
    response_format: { type: "json_object" }
  })
  
  const { techStack } = JSON.parse(completion.choices[0].message.content!)
  
  return {
    ...state,
    techStack
  }
}

// Node: Generate database schema
async function generateDatabaseSchema(state: ArchitectureGenerationState) {
  const { userStories, solutions } = state
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `You are a database architect expert in data modeling.
        Design a normalized relational database schema.`
      },
      {
        role: "user",
        content: `Based on these user stories and features:
        ${userStories!.map(us => `- ${us.title}: As ${us.as_a}, I want ${us.i_want}`).join('\n')}
        
        Design the database schema.
        
        Return as JSON:
        {
          "tables": [
            {
              "tableName": "table_name",
              "columns": [
                {
                  "columnName": "id",
                  "dataType": "UUID",
                  "isPrimaryKey": true,
                  "isForeignKey": false,
                  "referencesTable": null,
                  "constraints": ["NOT NULL", "DEFAULT gen_random_uuid()"]
                }
              ]
            }
          ],
          "relationships": [
            {
              "fromTable": "table1",
              "toTable": "table2",
              "relationshipType": "one-to-many"
            }
          ]
        }`
      }
    ],
    response_format: { type: "json_object" }
  })
  
  const schema = JSON.parse(completion.choices[0].message.content!)
  
  return {
    ...state,
    databaseSchema: schema
  }
}

// Node: Generate UI screens and components
async function generateUIScreens(state: ArchitectureGenerationState) {
  const { userStories, techStack } = state
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `You are a UX architect designing application screens and components.
        Create a comprehensive list of screens and their components.`
      },
      {
        role: "user",
        content: `User Stories:
        ${userStories!.map(us => `- ${us.title}: ${us.i_want}`).join('\n')}
        
        Frontend Technology: ${techStack!.find(t => t.layer === 'Frontend')?.technology || 'React'}
        
        Design the UI screens and components.
        
        Return as JSON:
        {
          "screens": [
            {
              "screenName": "Dashboard",
              "description": "Main dashboard view",
              "routePath": "/dashboard",
              "components": [
                {
                  "componentName": "StatsCard",
                  "componentType": "molecule",
                  "dataDisplayed": "Key metrics",
                  "props": {
                    "title": "string",
                    "value": "number",
                    "trend": "number"
                  }
                }
              ]
            }
          ]
        }`
      }
    ],
    response_format: { type: "json_object" }
  })
  
  const { screens } = JSON.parse(completion.choices[0].message.content!)
  
  return {
    ...state,
    uiScreens: screens
  }
}

// Node: Generate design system
async function generateDesignSystem(state: ArchitectureGenerationState) {
  const { uiScreens } = state
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `You are a design system architect creating a cohesive visual language.
        Define design tokens and atomic components.`
      },
      {
        role: "user",
        content: `Based on these UI screens:
        ${uiScreens!.map(s => s.screenName).join(', ')}
        
        Create a minimal but complete design system.
        
        Return as JSON:
        {
          "designTokens": [
            {
              "category": "color|typography|spacing|shadow",
              "tokenName": "primary-500",
              "tokenValue": "#3B82F6"
            }
          ],
          "atomicComponents": [
            {
              "componentLevel": "atom|molecule|organism",
              "componentName": "Button",
              "description": "Primary action button",
              "props": {
                "variant": "primary|secondary|ghost",
                "size": "sm|md|lg"
              },
              "composedOf": []
            }
          ]
        }`
      }
    ],
    response_format: { type: "json_object" }
  })
  
  const designSystem = JSON.parse(completion.choices[0].message.content!)
  
  return {
    ...state,
    designSystem
  }
}

// Node: Save all architecture data
async function saveArchitecture(state: ArchitectureGenerationState) {
  const { projectId, techStack, databaseSchema, uiScreens, designSystem } = state
  
  // Clear existing architecture data
  await Promise.all([
    supabase.from('system_architecture').delete().eq('project_id', projectId),
    supabase.from('database_tables').delete().eq('project_id', projectId),
    supabase.from('database_relationships').delete().eq('project_id', projectId),
    supabase.from('ui_screens').delete().eq('project_id', projectId),
    supabase.from('design_tokens').delete().eq('project_id', projectId),
    supabase.from('atomic_components').delete().eq('project_id', projectId)
  ])
  
  // Save tech stack
  const techStackToInsert = techStack!.map(tech => ({
    project_id: projectId,
    layer: tech.layer,
    technology: tech.technology,
    justification: tech.justification,
    version: 1
  }))
  
  await supabase
    .from('system_architecture')
    .insert(techStackToInsert)
  
  // Save database schema
  for (const table of databaseSchema!.tables) {
    const { data: insertedTable } = await supabase
      .from('database_tables')
      .insert({
        project_id: projectId,
        table_name: table.tableName
      })
      .select()
      .single()
    
    const columnsToInsert = table.columns.map((col: any) => ({
      table_id: insertedTable.id,
      column_name: col.columnName,
      data_type: col.dataType,
      is_primary_key: col.isPrimaryKey,
      is_foreign_key: col.isForeignKey,
      references_table: col.referencesTable,
      constraints: col.constraints
    }))
    
    await supabase
      .from('database_columns')
      .insert(columnsToInsert)
  }
  
  // Save relationships
  const relationshipsToInsert = databaseSchema!.relationships.map((rel: any) => ({
    project_id: projectId,
    from_table: rel.fromTable,
    to_table: rel.toTable,
    relationship_type: rel.relationshipType
  }))
  
  if (relationshipsToInsert.length > 0) {
    await supabase
      .from('database_relationships')
      .insert(relationshipsToInsert)
  }
  
  // Save UI screens and components
  for (const screen of uiScreens!) {
    const { data: insertedScreen } = await supabase
      .from('ui_screens')
      .insert({
        project_id: projectId,
        screen_name: screen.screenName,
        description: screen.description,
        route_path: screen.routePath
      })
      .select()
      .single()
    
    if (screen.components && screen.components.length > 0) {
      const componentsToInsert = screen.components.map((comp: any) => ({
        screen_id: insertedScreen.id,
        component_name: comp.componentName,
        component_type: comp.componentType,
        data_displayed: comp.dataDisplayed,
        props: comp.props
      }))
      
      await supabase
        .from('ui_components')
        .insert(componentsToInsert)
    }
  }
  
  // Save design system
  const designTokensToInsert = designSystem!.designTokens.map((token: any) => ({
    project_id: projectId,
    token_category: token.category,
    token_name: token.tokenName,
    token_value: token.tokenValue
  }))
  
  await supabase
    .from('design_tokens')
    .insert(designTokensToInsert)
  
  const atomicComponentsToInsert = designSystem!.atomicComponents.map((comp: any) => ({
    project_id: projectId,
    component_level: comp.componentLevel,
    component_name: comp.componentName,
    description: comp.description,
    props: comp.props,
    composed_of: comp.composedOf
  }))
  
  await supabase
    .from('atomic_components')
    .insert(atomicComponentsToInsert)
  
  // Update project status
  await supabase
    .from('projects')
    .update({ 
      current_step: 'architecture',
      status: 'architecture_complete'
    })
    .eq('id', projectId)
  
  // Log event
  await supabase.from('langgraph_state_events').insert({
    project_id: projectId,
    event_type: 'architecture_generated',
    event_data: {
      techStackCount: techStack!.length,
      tableCount: databaseSchema!.tables.length,
      screenCount: uiScreens!.length,
      designTokenCount: designSystem!.designTokens.length
    },
    sequence_number: await getNextSequenceNumber(projectId)
  })
  
  return state
}

// Helper function
async function getNextSequenceNumber(projectId: string): Promise<number> {
  const { data } = await supabase
    .from('langgraph_state_events')
    .select('sequence_number')
    .eq('project_id', projectId)
    .order('sequence_number', { ascending: false })
    .limit(1)
    .single()
  
  return (data?.sequence_number || 0) + 1
}

// Create the workflow
const workflow = new StateGraph<ArchitectureGenerationState>({
  channels: {
    projectId: null,
    userStories: null,
    solutions: null,
    coreProblem: null,
    techStack: null,
    databaseSchema: null,
    uiScreens: null,
    designSystem: null
  }
})

// Add nodes
workflow.addNode("loadContext", loadContext)
workflow.addNode("generateTechStack", generateTechStack)
workflow.addNode("generateDatabaseSchema", generateDatabaseSchema)
workflow.addNode("generateUIScreens", generateUIScreens)
workflow.addNode("generateDesignSystem", generateDesignSystem)
workflow.addNode("saveArchitecture", saveArchitecture)

// Define the flow
workflow.setEntryPoint("loadContext")
workflow.addEdge("loadContext", "generateTechStack")
workflow.addEdge("generateTechStack", "generateDatabaseSchema")
workflow.addEdge("generateDatabaseSchema", "generateUIScreens")
workflow.addEdge("generateUIScreens", "generateDesignSystem")
workflow.addEdge("generateDesignSystem", "saveArchitecture")
workflow.setFinishPoint("saveArchitecture")

const app = workflow.compile()

serve(async (req) => {
  try {
    const { projectId } = await req.json()
    
    const startTime = Date.now()
    
    // Execute the workflow
    await app.invoke({ projectId })
    
    // Get all architecture data
    const [techStack, tables, screens, designTokens, atomicComponents, relationships] = await Promise.all([
      supabase.from('system_architecture').select('*').eq('project_id', projectId),
      supabase.from('database_tables').select(`
        *,
        database_columns(*)
      `).eq('project_id', projectId),
      supabase.from('ui_screens').select(`
        *,
        ui_components(*)
      `).eq('project_id', projectId),
      supabase.from('design_tokens').select('*').eq('project_id', projectId),
      supabase.from('atomic_components').select('*').eq('project_id', projectId),
      supabase.from('database_relationships').select('*').eq('project_id', projectId)
    ])
    
    // Log execution
    await supabase.from('langgraph_execution_logs').insert({
      project_id: projectId,
      node_name: 'generate_architecture_workflow',
      input_state: { projectId },
      output_state: { 
        techStackCount: techStack.data?.length,
        tableCount: tables.data?.length,
        screenCount: screens.data?.length,
        tokenCount: designTokens.data?.length
      },
      status: 'success',
      execution_time_ms: Date.now() - startTime
    })
    
    return new Response(JSON.stringify({ 
      techStack: techStack.data,
      databaseSchema: {
        tables: tables.data,
        relationships: relationships.data
      },
      uiScreens: screens.data,
      designSystem: {
        tokens: designTokens.data,
        components: atomicComponents.data
      }
    }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error('Error in generate-architecture:', error)
    
    // Log error
    await supabase.from('langgraph_execution_logs').insert({
      project_id: req.json().projectId,
      node_name: 'generate_architecture_workflow',
      input_state: { projectId: req.json().projectId },
      output_state: null,
      status: 'error',
      error_message: error.message,
      execution_time_ms: Date.now() - performance.now()
    })
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})