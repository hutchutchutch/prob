import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { 
  Node, 
  Edge, 
  Viewport, 
  NodeChange, 
  EdgeChange, 
  Connection,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge
} from '@xyflow/react'
import { tauriAPI } from '@/services/tauri/api'
import type { CanvasState } from '@/types/database.types'

// Import other stores for integration
import { useWorkflowStore } from './workflowStore'
import { useUIStore } from './uiStore'

// Node types for different workflow elements
export type WorkflowNodeType = 
  | 'problem'
  | 'persona' 
  | 'painPoint'
  | 'solution'
  | 'userStory'

export interface WorkflowNodeData extends Record<string, unknown> {
  id: string
  title: string
  description: string
  type: WorkflowNodeType
  isLocked?: boolean
  isSelected?: boolean
  metadata?: Record<string, any>
}

export interface WorkflowNode extends Node {
  data: WorkflowNodeData
}

interface CanvasStoreState {
  // React Flow state
  nodes: Node[]
  edges: Edge[]
  viewport: Viewport
  
  // Canvas metadata
  canvasId: string | null
  projectId: string | null
  lastSaved: Date | null
  isDirty: boolean
  
  // UI state
  selectedNodeIds: Set<string>
  hoveredNodeId: string | null
  isAnimating: boolean
  
  // Layout
  layoutType: 'hierarchical' | 'force' | 'grid'
  nodeSpacing: { x: number; y: number }
}

interface CanvasActions {
  // Node operations
  addNode: (node: Node) => void
  addNodes: (nodes: Node[]) => void
  updateNode: (nodeId: string, updates: Partial<Node>) => void
  removeNode: (nodeId: string) => void
  onNodesChange: (changes: NodeChange[]) => void
  
  // Edge operations
  addEdge: (edge: Edge) => void
  addEdges: (edges: Edge[]) => void
  updateEdge: (edgeId: string, updates: Partial<Edge>) => void
  removeEdge: (edgeId: string) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  
  // Viewport
  setViewport: (viewport: Viewport) => void
  fitView: () => void
  zoomTo: (level: number) => void
  
  // Selection
  selectNode: (nodeId: string) => void
  selectNodes: (nodeIds: string[]) => void
  clearSelection: () => void
  setHoveredNode: (nodeId: string | null) => void
  
  // Layout
  applyLayout: (layoutType: 'hierarchical' | 'force' | 'grid') => void
  calculateNodePositions: (nodes: Node[]) => Node[]
  setNodeSpacing: (spacing: { x: number; y: number }) => void
  
  // Persistence
  saveCanvasState: () => Promise<void>
  loadCanvasState: (projectId: string) => Promise<void>
  markDirty: () => void
  markClean: () => void
  
  // Animation
  animateNodeAppearance: (nodes: Node[], staggerDelay?: number) => void
  animateTransition: (fromNodes: Node[], toNodes: Node[]) => void
  setAnimating: (isAnimating: boolean) => void
  
  // Workflow integration
  syncWithWorkflow: (workflowState: any) => void
  transformWorkflowToNodes: (data: any) => { nodes: Node[], edges: Edge[] }
  
  // Utilities
  getNodeById: (nodeId: string) => Node | undefined
  getEdgeById: (edgeId: string) => Edge | undefined
  getConnectedNodes: (nodeId: string) => Node[]
  
  // Reset
  resetCanvas: () => void
}

const initialViewport: Viewport = {
  x: 0,
  y: 0,
  zoom: 1
}

const initialState: CanvasStoreState = {
  nodes: [],
  edges: [],
  viewport: initialViewport,
  canvasId: null,
  projectId: null,
  lastSaved: null,
  isDirty: false,
  selectedNodeIds: new Set(),
  hoveredNodeId: null,
  isAnimating: false,
  layoutType: 'hierarchical',
  nodeSpacing: { x: 200, y: 150 }
}

// Debounce utility for auto-save
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T => {
  let timeout: NodeJS.Timeout
  return ((...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}

export const useCanvasStore = create<CanvasStoreState & CanvasActions>()(
  subscribeWithSelector((set, get) => {
    // Create debounced save function
    const debouncedSave = debounce(async () => {
      const state = get()
      if (state.isDirty && state.projectId) {
        await state.saveCanvasState()
      }
    }, 1000)

    return {
      ...initialState,

      // Node operations
      addNode: (node) => {
        set((state) => ({
          nodes: [...state.nodes, node],
          isDirty: true
        }))
        debouncedSave()
      },

      addNodes: (newNodes) => {
        set((state) => ({
          nodes: [...state.nodes, ...newNodes],
          isDirty: true
        }))
        debouncedSave()
      },

      updateNode: (nodeId, updates) => {
        set((state) => ({
          nodes: state.nodes.map(node => 
            node.id === nodeId ? { ...node, ...updates } : node
          ),
          isDirty: true
        }))
        debouncedSave()
      },

      removeNode: (nodeId) => {
        set((state) => ({
          nodes: state.nodes.filter(node => node.id !== nodeId),
          edges: state.edges.filter(edge => 
            edge.source !== nodeId && edge.target !== nodeId
          ),
          selectedNodeIds: new Set([...state.selectedNodeIds].filter(id => id !== nodeId)),
          isDirty: true
        }))
        debouncedSave()
      },

      onNodesChange: (changes) => {
        set((state) => ({
          nodes: applyNodeChanges(changes, state.nodes),
          isDirty: true
        }))
        debouncedSave()
      },

      // Edge operations
      addEdge: (edge) => {
        set((state) => ({
          edges: [...state.edges, edge],
          isDirty: true
        }))
        debouncedSave()
      },

      addEdges: (newEdges) => {
        set((state) => ({
          edges: [...state.edges, ...newEdges],
          isDirty: true
        }))
        debouncedSave()
      },

      updateEdge: (edgeId, updates) => {
        set((state) => ({
          edges: state.edges.map(edge => 
            edge.id === edgeId ? { ...edge, ...updates } : edge
          ),
          isDirty: true
        }))
        debouncedSave()
      },

      removeEdge: (edgeId) => {
        set((state) => ({
          edges: state.edges.filter(edge => edge.id !== edgeId),
          isDirty: true
        }))
        debouncedSave()
      },

      onEdgesChange: (changes) => {
        set((state) => ({
          edges: applyEdgeChanges(changes, state.edges),
          isDirty: true
        }))
        debouncedSave()
      },

      onConnect: (connection) => {
        set((state) => ({
          edges: addEdge(connection, state.edges),
          isDirty: true
        }))
        debouncedSave()
      },

      // Viewport
      setViewport: (viewport) => {
        set({ viewport, isDirty: true })
        debouncedSave()
      },

      fitView: () => {
        // This would typically be handled by React Flow's fitView function
        // We'll just mark as dirty for now
        set({ isDirty: true })
        debouncedSave()
      },

      zoomTo: (level) => {
        set((state) => ({ 
          viewport: { ...state.viewport, zoom: level },
          isDirty: true
        }))
        debouncedSave()
      },

      // Selection
      selectNode: (nodeId) => {
        set((state) => ({
          selectedNodeIds: new Set([nodeId])
        }))
        
        // Update node visual state
        get().updateNode(nodeId, {
          style: { 
            ...get().getNodeById(nodeId)?.style,
            border: '2px solid #3b82f6'
          }
        })
      },

      selectNodes: (nodeIds) => {
        set({
          selectedNodeIds: new Set(nodeIds)
        })
        
        // Update visual state for all selected nodes
        const currentNodes = get().nodes
        nodeIds.forEach(nodeId => {
          const node = currentNodes.find(n => n.id === nodeId)
          if (node) {
            get().updateNode(nodeId, {
              style: {
                ...node.style,
                border: '2px solid #3b82f6'
              }
            })
          }
        })
      },

      clearSelection: () => {
        const previousSelection = get().selectedNodeIds
        set({
          selectedNodeIds: new Set()
        })
        
        // Clear visual selection state
        previousSelection.forEach(nodeId => {
          const node = get().getNodeById(nodeId)
          if (node) {
            get().updateNode(nodeId, {
              style: {
                ...node.style,
                border: undefined
              }
            })
          }
        })
      },

      setHoveredNode: (nodeId) => {
        set({ hoveredNodeId: nodeId })
      },

      // Layout
      applyLayout: (layoutType) => {
        const state = get()
        const newNodes = state.calculateNodePositions(state.nodes)
        
        set({
          layoutType,
          nodes: newNodes,
          isDirty: true
        })
        debouncedSave()
        
        // Show notification
        const uiStore = useUIStore.getState()
        uiStore.showInfo(`Applied ${layoutType} layout`)
      },

      calculateNodePositions: (nodes) => {
        const state = get()
        const { layoutType, nodeSpacing } = state

        switch (layoutType) {
          case 'hierarchical':
            return calculateHierarchicalLayout(nodes, nodeSpacing)
          case 'force':
            return calculateForceLayout(nodes, nodeSpacing)
          case 'grid':
            return calculateGridLayout(nodes, nodeSpacing)
          default:
            return nodes
        }
      },

      setNodeSpacing: (spacing) => {
        set({ nodeSpacing: spacing })
      },

      // Persistence
      saveCanvasState: async () => {
        const state = get()
        if (!state.projectId) return

        const uiStore = useUIStore.getState()

        try {
          const canvasState: CanvasState = {
            id: state.canvasId || crypto.randomUUID(),
            project_id: state.projectId,
            nodes: state.nodes,
            edges: state.edges,
            viewport: state.viewport,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }

          await tauriAPI.saveCanvasState(canvasState)
          
          set({ 
            canvasId: canvasState.id,
            lastSaved: new Date(),
            isDirty: false
          })
          
          uiStore.showSuccess('Canvas saved')
        } catch (error) {
          console.error('Failed to save canvas state:', error)
          uiStore.showError('Failed to save canvas', error instanceof Error ? error.message : 'Unknown error')
        }
      },

      loadCanvasState: async (projectId) => {
        const uiStore = useUIStore.getState()
        
        try {
          // TODO: Implement loadCanvasState in tauriAPI
          // const canvasState = await tauriAPI.loadCanvasState(projectId)
          set({
            projectId,
            // nodes: canvasState.nodes,
            // edges: canvasState.edges,
            // viewport: canvasState.viewport,
            // canvasId: canvasState.id,
            lastSaved: new Date(),
            isDirty: false
          })
          
          uiStore.showSuccess('Canvas loaded')
        } catch (error) {
          console.error('Failed to load canvas state:', error)
          uiStore.showError('Failed to load canvas', error instanceof Error ? error.message : 'Unknown error')
          set({ projectId })
        }
      },

      markDirty: () => set({ isDirty: true }),
      markClean: () => set({ isDirty: false }),

      // Animation
      animateNodeAppearance: async (nodes, staggerDelay = 100) => {
        set({ isAnimating: true })
        
        // Add nodes with initial hidden state
        const hiddenNodes = nodes.map(node => ({
          ...node,
          style: { ...node.style, opacity: 0, transform: 'scale(0.8)' }
        }))
        
        get().addNodes(hiddenNodes)
        
        // Animate each node with stagger
        for (let i = 0; i < nodes.length; i++) {
          setTimeout(() => {
            get().updateNode(nodes[i].id, {
              style: { ...nodes[i].style, opacity: 1, transform: 'scale(1)' }
            })
            
            if (i === nodes.length - 1) {
              setTimeout(() => set({ isAnimating: false }), 300)
            }
          }, i * staggerDelay)
        }
      },

      animateTransition: async (fromNodes, toNodes) => {
        set({ isAnimating: true })
        
        // TODO: Implement smooth transition animation
        // For now, just replace nodes
        set({ 
          nodes: toNodes,
          isAnimating: false,
          isDirty: true
        })
        debouncedSave()
      },

      setAnimating: (isAnimating) => {
        set({ isAnimating })
      },

      // Workflow integration
      syncWithWorkflow: (workflowState) => {
        const { nodes, edges } = get().transformWorkflowToNodes(workflowState)
        const layoutedNodes = get().calculateNodePositions(nodes)
        
        // Use animation if enabled
        const uiStore = useUIStore.getState()
        if (uiStore.experimentalFeatures.advancedAnimations) {
          get().animateTransition(get().nodes, layoutedNodes)
        } else {
          set({
            nodes: layoutedNodes,
            edges,
            isDirty: true
          })
          debouncedSave()
        }
      },

      transformWorkflowToNodes: (data) => {
        const { currentStep, coreProblem, personas, painPoints, solutions, userStories } = data
        const nodes: Node[] = []
        const edges: Edge[] = []
        
        // IMPORTANT: This method is incomplete and was clearing the canvas
        // For now, just return the current nodes/edges to prevent clearing
        // The WorkflowCanvas component manages nodes directly
        console.warn('[canvasStore] transformWorkflowToNodes called - returning current nodes to prevent clearing')
        return { 
          nodes: get().nodes, 
          edges: get().edges 
        }
        
        // TODO: Implement proper transformation logic if needed
        // Transform data based on current workflow step
        switch (currentStep) {
          case 'problem_input':
            // Show problem node only
            if (coreProblem) {
              nodes.push(createWorkflowNode({
                id: 'problem',
                title: 'Core Problem',
                description: coreProblem.description,
                type: 'problem',
                position: { x: 400, y: 300 },
                isLocked: true,
              }))
            }
            break
            
          case 'persona_discovery':
            // Show problem and personas
            // ... add transformation logic
            break
            
          case 'pain_points':
            // Show problem, personas, and pain points
            // ... add transformation logic
            break
            
          case 'solution_generation':
            // Show everything up to solutions
            // ... add transformation logic
            break
            
          case 'user_stories':
            // Show full workflow
            // ... add transformation logic
            break
        }
        
        return { nodes, edges }
      },

      // Utilities
      getNodeById: (nodeId) => {
        return get().nodes.find(node => node.id === nodeId)
      },

      getEdgeById: (edgeId) => {
        return get().edges.find(edge => edge.id === edgeId)
      },

      getConnectedNodes: (nodeId) => {
        const state = get()
        const connectedEdges = state.edges.filter(
          edge => edge.source === nodeId || edge.target === nodeId
        )
        const connectedNodeIds = connectedEdges.flatMap(edge => 
          [edge.source, edge.target].filter(id => id !== nodeId)
        )
        return state.nodes.filter(node => connectedNodeIds.includes(node.id))
      },

      // Reset
      resetCanvas: () => {
        set({
          ...initialState,
          projectId: get().projectId // Keep project ID
        })
      }
    }
  })
)

// Helper function to create workflow nodes
function createWorkflowNode(config: {
  id: string
  title: string
  description: string
  type: WorkflowNodeType
  position: { x: number; y: number }
  isLocked?: boolean
  isSelected?: boolean
  metadata?: Record<string, any>
}): Node {
  return {
    id: config.id,
    type: config.type,
    position: config.position,
    data: {
      id: config.id,
      title: config.title,
      description: config.description,
      type: config.type,
      isLocked: config.isLocked,
      isSelected: config.isSelected,
      metadata: config.metadata
    },
    style: {
      opacity: config.isSelected ? 1 : 0.8,
      border: config.isLocked ? '2px solid #f59e0b' : undefined
    }
  }
}

// Layout algorithms
function calculateHierarchicalLayout(nodes: Node[], spacing: { x: number; y: number }): Node[] {
  const nodesByType = groupNodesByType(nodes)
  let yOffset = 0
  
  const layoutedNodes: Node[] = []
  
  // Order: problem -> personas -> painPoints -> solutions -> userStories
  const typeOrder: WorkflowNodeType[] = ['problem', 'persona', 'painPoint', 'solution', 'userStory']
  
  typeOrder.forEach(type => {
    const typeNodes = nodesByType[type] || []
    if (typeNodes.length === 0) return
    
    const totalWidth = (typeNodes.length - 1) * spacing.x
    const startX = -totalWidth / 2
    
    typeNodes.forEach((node, index) => {
      layoutedNodes.push({
        ...node,
        position: {
          x: startX + (index * spacing.x),
          y: yOffset
        }
      })
    })
    
    yOffset += spacing.y
  })
  
  return layoutedNodes
}

function calculateForceLayout(nodes: Node[], spacing: { x: number; y: number }): Node[] {
  // Simple force-directed layout simulation
  // In a real implementation, you'd use a proper force simulation library
  return nodes.map((node, index) => ({
    ...node,
    position: {
      x: Math.cos(index * 2 * Math.PI / nodes.length) * 300,
      y: Math.sin(index * 2 * Math.PI / nodes.length) * 300
    }
  }))
}

function calculateGridLayout(nodes: Node[], spacing: { x: number; y: number }): Node[] {
  const cols = Math.ceil(Math.sqrt(nodes.length))
  
  return nodes.map((node, index) => ({
    ...node,
    position: {
      x: (index % cols) * spacing.x,
      y: Math.floor(index / cols) * spacing.y
    }
  }))
}

function groupNodesByType(nodes: Node[]): Record<WorkflowNodeType, Node[]> {
  const groups: Record<WorkflowNodeType, Node[]> = {
    problem: [],
    persona: [],
    painPoint: [],
    solution: [],
    userStory: []
  }
  
  nodes.forEach(node => {
    const nodeData = node.data as unknown as WorkflowNodeData
    const nodeType = nodeData?.type
    if (nodeType && groups[nodeType]) {
      groups[nodeType].push(node)
    }
  })
  
  return groups
}

// Initialize store subscriptions after both stores are created
export function initializeCanvasSubscriptions() {
  // Subscribe to workflow changes for reactive updates
  useWorkflowStore.subscribe(
    (state) => state.currentStep,
    (currentStep) => {
      console.log(`Canvas reacting to workflow step change: ${currentStep}`)
      
      const canvasStore = useCanvasStore.getState()
      const workflowState = useWorkflowStore.getState()
      
      // React to step changes with appropriate layout
      switch (currentStep) {
        case 'persona_discovery':
          canvasStore.applyLayout('hierarchical')
          break
        case 'pain_points':
          canvasStore.applyLayout('hierarchical')
          break
        case 'solution_generation':
          canvasStore.applyLayout('force')
          break
        case 'user_stories':
          canvasStore.applyLayout('hierarchical')
          break
      }
      
      // Sync with current workflow state
      canvasStore.syncWithWorkflow(workflowState)
    }
  )

  useWorkflowStore.subscribe(
    (state) => state.activePersonaId,
    (activePersonaId) => {
      if (activePersonaId) {
        console.log(`Canvas reacting to persona selection: ${activePersonaId}`)
        
        const canvasStore = useCanvasStore.getState()
        
        // Clear previous selections
        canvasStore.clearSelection()
        
        // Select the active persona node
        canvasStore.selectNode(`persona-${activePersonaId}`)
        
        // Sync with workflow state
        const workflowState = useWorkflowStore.getState()
        canvasStore.syncWithWorkflow(workflowState)
      }
    }
  )

  useWorkflowStore.subscribe(
    (state) => state.selectedSolutionIds,
    (selectedSolutionIds) => {
      console.log(`Canvas reacting to solution selection changes`)
      
      const canvasStore = useCanvasStore.getState()
      
      // Update visual selection state for solutions
      const solutionNodeIds = Array.from(selectedSolutionIds).map(id => `solution-${id}`)
      canvasStore.selectNodes(solutionNodeIds)
      
      // Sync with workflow state
      const workflowState = useWorkflowStore.getState()
      canvasStore.syncWithWorkflow(workflowState)
    }
  )

  // Subscribe to project changes
  useCanvasStore.subscribe(
    (state) => state.projectId,
    (projectId, previousProjectId) => {
      if (projectId !== previousProjectId && projectId) {
        console.log(`Canvas reacting to project change: ${projectId}`)
        
        // Load canvas state for new project
        const canvasStore = useCanvasStore.getState()
        canvasStore.loadCanvasState(projectId)
      }
    }
  )

  // Subscribe to canvas changes for auto-save
  useCanvasStore.subscribe(
    (state) => state.isDirty,
    (isDirty) => {
      if (isDirty) {
        console.log('Canvas marked as dirty, auto-saving...')
      }
    }
  )
}
