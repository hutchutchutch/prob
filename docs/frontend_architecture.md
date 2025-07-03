# GoldiDocs - Frontend Architecture

## Overview

This document outlines the comprehensive frontend architecture for Prob, a Vite-powered React application that transforms product ideas into implementation-ready software projects through an AI-guided visual workflow.

## Technology Stack

### Core Technologies
- **Build Tool**: Vite 5.x
- **Framework**: React 18.x with TypeScript
- **Canvas Library**: React Flow (xyflow)
- **Styling**: TailwindCSS 3.x
- **State Management**: Zustand (global state) + React Query (server state)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Desktop Framework**: Tauri 2.x

### Development Tools
- **Type Safety**: TypeScript 5.x
- **Code Quality**: ESLint + Prettier
- **Testing**: Vitest + React Testing Library
- **Component Development**: Storybook

## Project Structure

```
src/
├── main.tsx                    # App entry point
├── App.tsx                     # Main app component with routing
├── index.css                   # Global styles + Tailwind imports
│
├── components/                 # Reusable UI components
│   ├── common/                # Generic components
│   │   ├── Button/
│   │   ├── Modal/
│   │   ├── Tooltip/
│   │   └── LoadingStates/
│   │
│   ├── layout/                # Layout components
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── WorkspaceList.tsx
│   │   │   └── ProjectTree.tsx
│   │   ├── ProgressBar/
│   │   │   ├── ProgressBar.tsx
│   │   │   └── PersonaCircles.tsx
│   │   └── Header/
│   │
│   ├── canvas/                # React Flow components
│   │   ├── nodes/
│   │   │   ├── CoreProblemNode.tsx
│   │   │   ├── PersonaNode.tsx
│   │   │   ├── PainPointNode.tsx
│   │   │   ├── SolutionNode.tsx
│   │   │   └── index.ts
│   │   ├── edges/
│   │   │   ├── CustomEdge.tsx
│   │   │   └── SolutionEdge.tsx
│   │   ├── controls/
│   │   │   ├── RefreshButton.tsx
│   │   │   └── LockToggle.tsx
│   │   └── Canvas.tsx        # Main React Flow wrapper
│   │
│   └── workflow/              # Workflow-specific components
│       ├── ProblemInput/
│       ├── PersonaSelector/
│       ├── SolutionBuilder/
│       ├── UserStoryEditor/
│       └── ExportDialog/
│
├── hooks/                     # Custom React hooks
│   ├── useWorkflow.ts        # Main workflow state management
│   ├── useCanvas.ts          # React Flow helpers
│   ├── useAnimations.ts      # Animation sequences
│   ├── useEventSourcing.ts   # Event store interactions
│   └── useKeyboardShortcuts.ts
│
├── services/                  # API and external services
│   ├── api/
│   │   ├── client.ts         # API client setup
│   │   ├── problem.ts        # Problem analysis endpoints
│   │   ├── personas.ts       # Persona generation
│   │   └── solutions.ts      # Solution generation
│   ├── supabase/
│   │   ├── client.ts
│   │   └── realtime.ts       # Real-time subscriptions
│   └── tauri/                # Tauri-specific APIs
│       ├── filesystem.ts
│       └── window.ts
│
├── stores/                    # Zustand state stores
│   ├── workflowStore.ts      # Main workflow state
│   ├── canvasStore.ts        # React Flow state
│   ├── projectStore.ts       # Project management
│   └── uiStore.ts            # UI preferences
│
├── types/                     # TypeScript definitions
│   ├── workflow.types.ts
│   ├── canvas.types.ts
│   ├── api.types.ts
│   └── database.types.ts     # Generated from Supabase
│
├── utils/                     # Utility functions
│   ├── animations.ts         # Animation helpers
│   ├── canvas.ts             # Canvas calculations
│   ├── export.ts             # Export utilities
│   └── validators.ts         # Input validation
│
└── views/                     # Main view components
    ├── Welcome/              # Initial screen
    ├── ProblemAnalysis/      # Problem → Personas → Solutions
    ├── ArchitectureDesign/   # Technical specification
    └── Export/               # Export and sharing

```

## Component Architecture

### 1. Main App Component

```typescript
// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactFlowProvider } from '@xyflow/react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProgressBar } from '@/components/layout/ProgressBar';
import { Canvas } from '@/components/canvas/Canvas';
import { useWorkflowStore } from '@/stores/workflowStore';

const queryClient = new QueryClient();

export function App() {
  const { currentStep, mode } = useWorkflowStore();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactFlowProvider>
        <div className="flex h-screen bg-gray-900">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <ProgressBar currentStep={currentStep} />
            <main className="flex-1 relative">
              {mode === 'input' ? (
                <ProblemInput />
              ) : (
                <Canvas />
              )}
            </main>
          </div>
        </div>
      </ReactFlowProvider>
    </QueryClientProvider>
  );
}
```

### 2. State Management Architecture

```typescript
// stores/workflowStore.ts
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { WorkflowState, WorkflowStep } from '@/types/workflow.types';

interface WorkflowStore extends WorkflowState {
  // State
  currentStep: WorkflowStep;
  projectId: string | null;
  coreProblem: CoreProblem | null;
  personas: Persona[];
  activePersonaId: string | null;
  painPoints: PainPoint[];
  solutions: Solution[];
  selectedSolutionIds: Set<string>;
  lockedItems: {
    personas: Set<string>;
    painPoints: Set<string>;
    solutions: Set<string>;
  };

  // Actions
  setCoreProblem: (problem: CoreProblem) => void;
  setPersonas: (personas: Persona[]) => void;
  selectPersona: (personaId: string) => void;
  toggleLock: (itemType: 'personas' | 'painPoints' | 'solutions', itemId: string) => void;
  toggleSolutionSelection: (solutionId: string) => void;
  regenerateItems: (itemType: 'personas' | 'painPoints' | 'solutions') => Promise<void>;
  proceedToNextStep: () => void;
}

export const useWorkflowStore = create<WorkflowStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    currentStep: 'problem_input',
    projectId: null,
    coreProblem: null,
    personas: [],
    activePersonaId: null,
    painPoints: [],
    solutions: [],
    selectedSolutionIds: new Set(),
    lockedItems: {
      personas: new Set(),
      painPoints: new Set(),
      solutions: new Set(),
    },

    // Actions implementation
    setCoreProblem: (problem) => set({ coreProblem: problem }),
    
    toggleLock: (itemType, itemId) => set((state) => {
      const newLocked = new Set(state.lockedItems[itemType]);
      if (newLocked.has(itemId)) {
        newLocked.delete(itemId);
      } else {
        newLocked.add(itemId);
      }
      return {
        lockedItems: {
          ...state.lockedItems,
          [itemType]: newLocked,
        },
      };
    }),

    // ... other actions
  }))
);
```

### 3. React Flow Canvas Architecture

```typescript
// components/canvas/Canvas.tsx
import { useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  Panel,
} from '@xyflow/react';
import { useWorkflowStore } from '@/stores/workflowStore';
import { useCanvasStore } from '@/stores/canvasStore';
import { nodeTypes } from './nodes';
import { edgeTypes } from './edges';
import { RefreshButton } from './controls/RefreshButton';
import { animateCanvasTransition } from '@/utils/animations';

export function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  const { 
    currentStep, 
    coreProblem, 
    personas, 
    activePersonaId,
    painPoints,
    solutions,
  } = useWorkflowStore();

  const { viewport, setViewport } = useCanvasStore();

  // Transform workflow state to React Flow nodes/edges
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = transformWorkflowToFlow({
      currentStep,
      coreProblem,
      personas,
      activePersonaId,
      painPoints,
      solutions,
    });

    // Animate the transition
    animateCanvasTransition(nodes, newNodes, setNodes, setEdges, newEdges);
  }, [currentStep, coreProblem, personas, activePersonaId, painPoints, solutions]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.type === 'persona' && !activePersonaId) {
      useWorkflowStore.getState().selectPersona(node.id);
    }
  }, [activePersonaId]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      defaultViewport={viewport}
      onViewportChange={setViewport}
    >
      <Background variant="dots" gap={12} size={1} />
      <Controls />
      <MiniMap />
      
      {/* Context-aware controls */}
      <Panel position="top-left">
        {currentStep === 'personas' && (
          <RefreshButton 
            label="Personas"
            onClick={() => useWorkflowStore.getState().regenerateItems('personas')}
          />
        )}
      </Panel>
    </ReactFlow>
  );
}
```

### 4. Custom Node Components

```typescript
// components/canvas/nodes/PersonaNode.tsx
import { Handle, Position, NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Lock, Unlock } from 'lucide-react';
import { Persona } from '@/types/workflow.types';
import { useWorkflowStore } from '@/stores/workflowStore';

interface PersonaNodeData extends Persona {
  isExpanded?: boolean;
  isLocked?: boolean;
}

export function PersonaNode({ data, selected }: NodeProps<PersonaNodeData>) {
  const toggleLock = useWorkflowStore((state) => state.toggleLock);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        bg-teal-500 text-white p-4 rounded-lg shadow-lg min-w-[280px]
        cursor-pointer transition-all hover:shadow-xl
        ${data.isExpanded ? 'min-w-[350px]' : ''}
        ${selected ? 'ring-2 ring-teal-300' : ''}
      `}
    >
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">{data.name}</h3>
          <div className="text-sm opacity-90 space-y-1">
            <div className="flex items-center gap-2">
              <span>🏢</span>
              <span>{data.industry}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>👤</span>
              <span>{data.role}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📊</span>
              <span>Pain Level: {data.painDegree}/5</span>
            </div>
          </div>
          
          {data.isExpanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 text-xs opacity-80"
            >
              {data.description}
            </motion.div>
          )}
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLock('personas', data.id);
          }}
          className="ml-3 p-1 hover:bg-teal-600 rounded transition-colors"
        >
          {data.isLocked ? <Lock size={16} /> : <Unlock size={16} />}
        </button>
      </div>
      
      {data.isExpanded && (
        <Handle type="source" position={Position.Right} className="w-3 h-3" />
      )}
    </motion.div>
  );
}
```

### 5. Animation System

```typescript
// utils/animations.ts
import { Node, Edge } from '@xyflow/react';

export async function animateCanvasTransition(
  currentNodes: Node[],
  newNodes: Node[],
  setNodes: (nodes: Node[]) => void,
  setEdges: (edges: Edge[]) => void,
  newEdges: Edge[]
) {
  // Identify nodes to add, remove, or update
  const nodeMap = new Map(currentNodes.map(n => [n.id, n]));
  const newNodeMap = new Map(newNodes.map(n => [n.id, n]));
  
  const nodesToRemove = currentNodes.filter(n => !newNodeMap.has(n.id));
  const nodesToAdd = newNodes.filter(n => !nodeMap.has(n.id));
  const nodesToUpdate = newNodes.filter(n => nodeMap.has(n.id));

  // Fade out removed nodes
  if (nodesToRemove.length > 0) {
    const fadedNodes = currentNodes.map(node => {
      if (nodesToRemove.find(n => n.id === node.id)) {
        return { ...node, data: { ...node.data, opacity: 0 } };
      }
      return node;
    });
    setNodes(fadedNodes);
    await delay(300);
  }

  // Update existing nodes positions
  const updatedNodes = currentNodes
    .filter(n => !nodesToRemove.find(r => r.id === n.id))
    .map(node => {
      const newNode = newNodeMap.get(node.id);
      if (newNode) {
        return { ...node, position: newNode.position, data: newNode.data };
      }
      return node;
    });

  // Add new nodes with staggered animation
  for (let i = 0; i < nodesToAdd.length; i++) {
    const node = nodesToAdd[i];
    updatedNodes.push({
      ...node,
      data: { ...node.data, opacity: 0 },
    });
    
    setNodes([...updatedNodes]);
    
    // Fade in after a delay
    setTimeout(() => {
      setNodes(nodes => 
        nodes.map(n => 
          n.id === node.id 
            ? { ...n, data: { ...n.data, opacity: 1 } }
            : n
        )
      );
    }, i * 100);
  }

  // Update edges after all nodes are in place
  setTimeout(() => {
    setEdges(newEdges);
  }, nodesToAdd.length * 100 + 300);
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

### 6. API Integration Layer

```typescript
// services/api/problem.ts
import { apiClient } from './client';
import { CoreProblem, ValidationResult } from '@/types/workflow.types';

export const problemApi = {
  async validateProblem(input: string): Promise<ValidationResult> {
    const { data } = await apiClient.post('/edge-functions/validate-problem', {
      problemInput: input,
    });
    return data;
  },

  async generatePersonas(
    projectId: string, 
    coreProblem: string, 
    lockedPersonaIds: string[]
  ): Promise<Persona[]> {
    const { data } = await apiClient.post('/edge-functions/generate-personas', {
      projectId,
      coreProblem,
      lockedPersonaIds,
    });
    return data.personas;
  },

  async generatePainPoints(
    projectId: string,
    personaId: string,
    lockedPainPointIds: string[]
  ): Promise<PainPoint[]> {
    const { data } = await apiClient.post('/edge-functions/generate-pain-points', {
      projectId,
      personaId,
      lockedPainPointIds,
    });
    return data.painPoints;
  },

  async generateSolutions(
    projectId: string,
    personaId: string,
    lockedSolutionIds: string[]
  ): Promise<{ solutions: Solution[]; mappings: SolutionMapping[] }> {
    const { data } = await apiClient.post('/edge-functions/generate-solutions', {
      projectId,
      personaId,
      lockedSolutionIds,
    });
    return data;
  },
};
```

### 7. Progress Bar Component

```typescript
// components/layout/ProgressBar/ProgressBar.tsx
import { motion } from 'framer-motion';
import { WorkflowStep } from '@/types/workflow.types';
import { PersonaCircles } from './PersonaCircles';
import { useWorkflowStore } from '@/stores/workflowStore';

const WORKFLOW_STEPS: { id: WorkflowStep; label: string }[] = [
  { id: 'problem_input', label: 'Problem Identification' },
  { id: 'solution_discovery', label: 'Solution Discovery' },
  { id: 'feature_selection', label: 'Feature Selection' },
  { id: 'user_stories', label: 'User Stories' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'design_system', label: 'Design System' },
  { id: 'repository_setup', label: 'Repository Setup' },
];

interface ProgressBarProps {
  currentStep: WorkflowStep;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  const { personas, activePersonaId } = useWorkflowStore();
  const currentStepIndex = WORKFLOW_STEPS.findIndex(s => s.id === currentStep);

  return (
    <div className="w-full bg-gray-100 border-b border-gray-300">
      <div className="p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            {WORKFLOW_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: index === currentStepIndex ? '#2563eb' : '#e5e7eb',
                    color: index === currentStepIndex ? '#ffffff' : '#4b5563',
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                >
                  {step.label}
                </motion.div>
                
                {index < WORKFLOW_STEPS.length - 1 && (
                  <div className="w-8 h-0.5 bg-gray-300 mx-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Show persona circles when in expanded view */}
      {activePersonaId && personas.length > 0 && (
        <PersonaCircles 
          personas={personas} 
          activePersonaId={activePersonaId} 
        />
      )}
    </div>
  );
}
```

### 8. Sidebar Component

```typescript
// components/layout/Sidebar/Sidebar.tsx
import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, File, Plus } from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import { WorkspaceList } from './WorkspaceList';
import { ProjectTree } from './ProjectTree';

export function Sidebar() {
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<Set<string>>(new Set());
  const { workspaces, activeProjectId, setActiveProject } = useProjectStore();

  const toggleWorkspace = (workspaceId: string) => {
    setExpandedWorkspaces(prev => {
      const next = new Set(prev);
      if (next.has(workspaceId)) {
        next.delete(workspaceId);
      } else {
        next.add(workspaceId);
      }
      return next;
    });
  };

  return (
    <div className="w-64 bg-gray-800 text-gray-100 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">Prob</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <button className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded">
            <span className="text-sm font-medium">New Project</span>
            <Plus size={16} />
          </button>
        </div>
        
        <WorkspaceList 
          workspaces={workspaces}
          expandedWorkspaces={expandedWorkspaces}
          onToggleWorkspace={toggleWorkspace}
          activeProjectId={activeProjectId}
          onSelectProject={setActiveProject}
        />
      </div>
      
      <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
        Version 1.0.0
      </div>
    </div>
  );
}
```

### 9. Keyboard Shortcuts

```typescript
// hooks/useKeyboardShortcuts.ts
import { useEffect } from 'react';
import { useWorkflowStore } from '@/stores/workflowStore';

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter to submit
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        const { currentStep, proceedToNextStep } = useWorkflowStore.getState();
        if (canProceed(currentStep)) {
          proceedToNextStep();
        }
      }
      
      // Cmd/Ctrl + R to refresh (regenerate)
      if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
        e.preventDefault();
        const { currentStep } = useWorkflowStore.getState();
        regenerateCurrentStep(currentStep);
      }
      
      // Cmd/Ctrl + Z for undo (via event sourcing)
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        // Implement undo via event sourcing
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
```

### 10. Export Functionality

```typescript
// components/workflow/ExportDialog/ExportDialog.tsx
import { useState } from 'react';
import { FileText, Github, Link, Download } from 'lucide-react';
import { exportProject } from '@/utils/export';
import { useWorkflowStore } from '@/stores/workflowStore';

export function ExportDialog({ isOpen, onClose }: ExportDialogProps) {
  const [exportFormat, setExportFormat] = useState<'markdown' | 'github' | 'link'>('markdown');
  const projectData = useWorkflowStore((state) => state.getProjectData());

  const handleExport = async () => {
    switch (exportFormat) {
      case 'markdown':
        const markdown = await exportProject.toMarkdown(projectData);
        downloadFile('project-spec.md', markdown);
        break;
      case 'github':
        const repoUrl = await exportProject.toGithub(projectData);
        window.open(repoUrl, '_blank');
        break;
      case 'link':
        const shareUrl = await exportProject.createShareLink(projectData);
        navigator.clipboard.writeText(shareUrl);
        break;
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Export Project</h2>
        
        <div className="space-y-4">
          <ExportOption
            icon={<FileText />}
            title="Markdown Documentation"
            description="Complete project specification as markdown files"
            selected={exportFormat === 'markdown'}
            onClick={() => setExportFormat('markdown')}
          />
          
          <ExportOption
            icon={<Github />}
            title="GitHub Repository"
            description="Initialize a new repository with project structure"
            selected={exportFormat === 'github'}
            onClick={() => setExportFormat('github')}
          />
          
          <ExportOption
            icon={<Link />}
            title="Share Link"
            description="Create a read-only link to share with your team"
            selected={exportFormat === 'link'}
            onClick={() => setExportFormat('link')}
          />
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600">
            Cancel
          </button>
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Export
          </button>
        </div>
      </div>
    </Dialog>
  );
}
```

## Key Design Patterns

### 1. Separation of Concerns
- **Components**: Pure UI elements
- **Hooks**: Reusable logic and side effects
- **Services**: External API communication
- **Stores**: Application state management
- **Utils**: Pure utility functions

### 2. Progressive Enhancement
- Start with basic functionality
- Layer on animations and transitions
- Add keyboard shortcuts and advanced features
- Maintain functionality without JavaScript (for exports)

### 3. Type Safety
- Comprehensive TypeScript types
- Generated types from Supabase
- Strict null checks
- Exhaustive switch statements

### 4. Performance Optimization
- React.memo for expensive components
- useMemo/useCallback for complex calculations
- Virtual scrolling for large lists
- Debounced API calls
- Optimistic UI updates

### 5. Error Handling
- Error boundaries for component crashes
- Retry logic for failed API calls
- Graceful degradation
- User-friendly error messages

## Testing Strategy

### 1. Unit Tests
- Utility functions
- Store actions
- Custom hooks
- API service methods

### 2. Component Tests
- Individual component rendering
- User interactions
- State changes
- Accessibility

### 3. Integration Tests
- Complete workflows
- API integration
- State persistence
- Export functionality

### 4. E2E Tests
- Full user journeys
- Cross-platform testing
- Performance benchmarks

## Development Workflow

### 1. Component Development
```bash
# Start Storybook for isolated component development
npm run storybook

# Create new component
npm run generate:component MyComponent
```

### 2. Local Development
```bash
# Start Vite dev server
npm run dev

# Start Tauri in development mode
npm run tauri dev
```

### 3. Production Build
```bash
# Build for production
npm run build

# Build Tauri app
npm run tauri build
```

## Future Considerations

### 1. Collaboration Features
- WebRTC for real-time collaboration
- Conflict resolution for concurrent edits
- Presence indicators
- Comments and annotations

### 2. Plugin System
- Custom node types
- External tool integrations
- Custom export formats
- Workflow templates

### 3. Performance at Scale
- Web Workers for heavy computations
- IndexedDB for large data caching
- Lazy loading for complex projects
- Canvas virtualization for large flows

### 4. Accessibility
- Keyboard navigation throughout
- Screen reader support
- High contrast themes
- Reduced motion options

This architecture provides a solid foundation for building GoldiDocs while maintaining flexibility for future enhancements and scaling.