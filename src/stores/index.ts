// Store exports
export { default as useProjectStore } from './projectStore'
export { useWorkflowStore } from './workflowStore'
export { useCanvasStore } from './canvasStore'
export { useUIStore } from './uiStore'

/**
 * Store Integration Architecture
 * =============================
 * 
 * This application uses a multi-store architecture with clean separation of concerns
 * and efficient cross-store communication patterns.
 * 
 * Store Responsibilities:
 * 
 * 1. ProjectStore (projectStore.ts)
 *    - Source of truth for workspace and project management
 *    - Handles user authentication context
 *    - Manages project lifecycle and recent projects
 *    - Triggers workflow and canvas loading when projects change
 * 
 * 2. WorkflowStore (workflowStore.ts)
 *    - Source of truth for business workflow data
 *    - Manages problem validation, personas, pain points, solutions, user stories
 *    - Orchestrates the workflow progression through steps
 *    - Notifies canvas store for visual updates
 *    - Uses UI store for user feedback notifications
 * 
 * 3. CanvasStore (canvasStore.ts)
 *    - Source of truth for visual representation and layout
 *    - Manages React Flow nodes, edges, and viewport state
 *    - Subscribes to workflow changes for reactive updates
 *    - Handles animations and visual transitions
 *    - Responds to UI preference changes (grid, snap, animations)
 * 
 * 4. UIStore (uiStore.ts)
 *    - Source of truth for user interface preferences and temporary state
 *    - Manages notifications, modals, theme, and layout preferences
 *    - Provides centralized notification system for all stores
 *    - Handles feature flags and experimental features
 * 
 * Integration Patterns:
 * 
 * 1. Direct Method Calls (Immediate Updates)
 *    Example: workflowStore.selectPersona() calls canvasStore.selectNode()
 *    Usage: When one store needs to immediately update another store's state
 * 
 * 2. Subscription Pattern (Reactive Updates)
 *    Example: canvasStore subscribes to workflowStore.currentStep changes
 *    Usage: When a store needs to react to state changes in another store
 * 
 * 3. Notification Pattern (User Feedback)
 *    Example: All stores use uiStore.showSuccess() for user notifications
 *    Usage: Centralized user feedback system across all operations
 * 
 * 4. Lazy Loading Pattern (Avoiding Circular Dependencies)
 *    Example: uiStore uses dynamic imports to notify canvas store
 *    Usage: When circular dependencies would occur with direct imports
 * 
 * Key Integration Points:
 * 
 * Project Changes:
 * - projectStore.setActiveProject() → workflowStore.loadWorkflowState()
 * - projectStore.setActiveProject() → canvasStore.loadCanvasState()
 * - projectStore operations → uiStore notifications
 * 
 * Workflow Progression:
 * - workflowStore.setCurrentStep() → canvasStore.syncWithWorkflow()
 * - workflowStore.selectPersona() → canvasStore.selectNode()
 * - workflowStore operations → uiStore notifications
 * - workflowStore.toggleSolutionSelection() → canvasStore visual updates
 * 
 * Canvas Updates:
 * - canvasStore subscribes to workflowStore.currentStep for layout changes
 * - canvasStore subscribes to workflowStore.activePersonaId for selection
 * - canvasStore subscribes to workflowStore.selectedSolutionIds for multi-select
 * - canvasStore operations → uiStore notifications
 * 
 * UI Preferences:
 * - uiStore.toggleGrid() → canvasStore.markDirty() for re-render
 * - uiStore.toggleFeature('advancedAnimations') → canvasStore animation behavior
 * - uiStore provides centralized notification system for all stores
 * 
 * Data Flow Example (Persona Selection):
 * 1. User clicks persona in UI
 * 2. workflowStore.selectPersona(id) is called
 * 3. workflowStore updates activePersonaId
 * 4. workflowStore calls canvasStore.syncWithWorkflow() and canvasStore.selectNode()
 * 5. workflowStore calls uiStore.showSuccess() for feedback
 * 6. canvasStore subscription detects activePersonaId change
 * 7. canvasStore updates visual selection state
 * 8. UI reflects all changes with proper visual feedback
 * 
 * This architecture ensures:
 * - Clean separation of concerns
 * - Predictable data flow
 * - Centralized user feedback
 * - Reactive visual updates
 * - Maintainable code structure
 */ 