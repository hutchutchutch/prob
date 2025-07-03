Product Vision
GoldiDocs is a macOS desktop application built with Tauri that transforms vague product ideas into fully architected, implementation-ready software projects through an AI-guided visual workflow. By combining LangGraph's intelligent processing via Supabase Edge Functions with React Flow's interactive canvas, developers and product teams can go from "I need a solution for X" to a complete technical specification with database schemas, UI components, and architectural decisions in under 30 minutes.
Technical Architecture Overview
Frontend Stack

Desktop Framework: Tauri 2.x (Rust backend + Web frontend)
UI Framework: React 18 with TypeScript
Canvas Engine: React Flow (xyflow) for node-based interactions
State Management: Zustand for global state, React Query for server state
Styling: TailwindCSS with custom atomic design system
Animations: Framer Motion for smooth transitions

Backend Infrastructure

Cloud Database: Supabase (PostgreSQL) with Row Level Security
AI Orchestration: LangGraph running in Supabase Edge Functions
Local Storage: SQLite for offline caching and performance
Real-time Sync: Supabase Realtime for collaborative features

The User Journey - Implementation Details
Act 1: The Problem Statement
Sarah opens GoldiDocs on her Mac. The application launches instantly thanks to Tauri's native performance. She's greeted by the ProblemInput component:
typescript// The canvas shows a demo of the full workflow
const demoNodes = createDemoNodes(); // 5 personas, 3 pain points, 5 solutions
const demoEdges = createDemoEdges(); // Animated connections

// After 2 seconds, zooms to the problem input
zoomTo(3, { x: 300, y: 300, duration: 1500 });
The demo nodes fade to 10% opacity as a custom ProblemInputNode appears with a textarea. Sarah types her problem and hits Cmd+Enter.
Act 2: Problem Validation & AI Processing
Behind the scenes, the problemApi.validateProblem() sends her input to a Supabase Edge Function:
typescript// Edge Function: validate-problem
const workflow = new StateGraph({
  channels: {
    problem: null,
    validation: null,
    refinement: null,
  }
});

workflow.addNode("validateProblem", validateWithGPT4);
workflow.addNode("refineProblem", refineForClarity);
workflow.addNode("extractKeyTerms", extractDomainTerms);
The validated problem is stored in PostgreSQL with event sourcing:
sqlINSERT INTO langgraph_state_events (
  project_id, event_type, event_data, sequence_number
) VALUES (
  'proj_123', 'problem_validated', {...}, 1
);
Act 3: Persona Discovery - The Canvas Comes Alive
The app transitions from ProblemInput to WorkflowCanvas. The canvas intelligently manages all workflow steps in a single continuous experience:
typescript// WorkflowCanvas handles all steps after problem input
function updateCanvasFromWorkflowState() {
  // Shows/hides nodes based on currentStep
  if (currentStep === 'persona_discovery') {
    // Add persona nodes with staggered animation
    personas.forEach((persona, index) => {
      setTimeout(() => addNode(personaNode), index * 150);
    });
  }
}
Five PersonaNode components appear, each with:

Lock toggle functionality (LockToggle component)
Pain level indicator (PainLevelIndicator showing 1-5 dots)
Gradient backgrounds (teal for personas)
Smooth animations via Framer Motion

Act 4: Deep Dive with Visual Relationships
When Sarah clicks "Sally Sales-a-lot", the canvas transforms:
typescript// Auto-zoom to show persona + pain points
fitView({ 
  nodes: [activePersona, ...painPoints], 
  padding: 0.3, 
  duration: 800 
});

// PersonaNode expands to show description
{isExpanded && (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
  >
    {persona.description}
  </motion.div>
)}
Three PainPointNode components slide in from the right, connected by orange edges. Each shows severity badges (Critical/High/Medium) with color coding.
Act 5: Solution Generation with Smart Mappings
The system generates solutions using another LangGraph workflow:
typescript// Edge Function: generate-solutions
workflow.addNode("analyzePainPoints", analyzePainPoints);
workflow.addNode("generateSolutions", generateWithGPT4);
workflow.addNode("mapSolutionsToPains", createMappings);
workflow.addNode("scoreRelevance", calculateRelevanceScores);
SolutionNode components appear with:

Checkboxes for selection (using CheckSquare/Square icons)
Solution type badges with emojis (⚡ Feature, 🔗 Integration, etc.)
Complexity indicators (color-coded text)

The SolutionEdge components visualize mappings:

Green (>0.8 relevance): Thick, animated
Yellow (0.5-0.8): Medium thickness
Gray (<0.5): Thin, semi-transparent

Act 6: Technical Specification Generation
When Sarah clicks "Continue to User Stories →", LangGraph orchestrates the complete technical generation:
typescript// Parallel processing in Edge Functions
const specs = await Promise.all([
  generateUserStories(selectedSolutions),
  generateArchitecture(selectedSolutions),
  generateDataModel(selectedSolutions),
  generateUIScreens(selectedSolutions),
  generateDesignSystem(selectedSolutions),
]);
Each specification is stored with full history:
sql-- Every change creates an immutable event
INSERT INTO langgraph_state_events (
  event_type: 'user_stories_generated',
  event_data: { before: null, after: stories, changes: [...] }
);
Act 7: Version Control & Time Travel
The event sourcing architecture enables powerful features:
typescript// Reconstruct any previous state
async function getStateAtSequence(projectId: string, sequence: number) {
  const events = await getEventsUpTo(projectId, sequence);
  return events.reduce((state, event) => 
    applyEvent(state, event), initialState
  );
}

// UI shows timeline
<ProgressBar>
  <HistoryTimeline events={events} onRestore={restoreToEvent} />
</ProgressBar>
Sarah can:

See exactly when each change occurred
Restore previous versions instantly
Branch explorations without losing work
Track who changed what in team mode

Act 8: Export & Implementation
The export system generates production-ready artifacts:
typescript// Multiple export formats
export const exportProject = {
  toMarkdown: async (project) => {
    // Generates comprehensive documentation
    return generateMarkdownSpec(project);
  },
  
  toGithub: async (project) => {
    // Creates repository with:
    // - Folder structure
    // - README with specs
    // - Initial code scaffolding
    // - GitHub Actions workflows
    return await createGithubRepo(project);
  },
  
  toCode: async (project) => {
    // Generates actual code files:
    // - Database migrations
    // - API routes
    // - React components
    // - Type definitions
    return generateCodebase(project);
  }
};
Key Implementation Details
1. Single Canvas Architecture
Unlike traditional multi-step wizards, GoldiDocs uses one continuous canvas:

ProblemInput: Special intro with demo preview
WorkflowCanvas: Handles all other steps seamlessly
Nodes appear/disappear based on workflow state
Canvas auto-zooms to relevant content

2. Intelligent Node Management
typescript// Nodes have built-in intelligence
<PersonaNode 
  data={{
    ...persona,
    isLocked: lockedItems.has(persona.id),
    isExpanded: activePersonaId === persona.id,
    onToggleLock: () => toggleLock('personas', persona.id)
  }}
/>
3. Real-time AI Processing

Edge Functions run LangGraph workflows
Streaming responses for better UX
Intelligent caching of results
Regeneration respects locked items

4. Offline-First Architecture
typescript// Dual database strategy
if (isOnline) {
  await supabase.from('projects').update(data);
  await sqliteCache.sync(data);
} else {
  await sqliteCache.save(data);
  // Queue for sync when online
}
5. Component Library Architecture

Atomic Design: 50+ reusable components
Canvas Components: Specialized nodes and edges
Control Components: RefreshButton, LockToggle, SelectionCounter
Layout Components: Sidebar, ProgressBar with persona indicators