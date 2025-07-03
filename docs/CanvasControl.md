# Canvas Control System Documentation

## Overview

The Canvas Control System is the comprehensive framework that manages the visual representation, navigation, and user interaction within the React Flow-based canvas in our workflow application. It consists of four core layers: **State Management**, **View Control**, **User Interface Controls**, and **Navigation System**.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Canvas.tsx    │───▶│  canvasStore.ts │───▶│ CanvasControls  │
│  (React Flow)   │    │ (State Manager) │    │   (UI Layer)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              useCanvasNavigation.ts                             │
│                (Navigation & Viewport Control)                  │
└─────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Canvas.tsx - Main Canvas Component

**Purpose**: Primary React Flow canvas wrapper that renders the visual workspace.

**Key Features**:
- React Flow integration with custom node and edge types
- Viewport management and responsive behavior
- Background patterns and visual styling
- Built-in controls (zoom, fit view, minimap)
- Custom canvas controls integration

**State Integration**:
```typescript
const {
  nodes,
  edges,
  viewport,
  onNodesChange,
  onEdgesChange,
  onConnect,
  setViewport,
} = useCanvasStore();
```

**Configuration**:
- **Zoom Range**: 0.3x to 2x
- **Default Viewport**: `{ x: 0, y: 0, zoom: 1 }`
- **Manual fit view**: Disabled (handled by navigation hook)
- **Background**: Dot pattern with gray grid

### 2. canvasStore.ts - State Management Core

**Purpose**: Zustand-based state manager that orchestrates all canvas data and behavior.

#### State Structure
```typescript
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
  
  // Force layout state
  forceLayoutMode: boolean
  selectedPersonaId: string | null
}
```

#### Key Responsibilities

**Node & Edge Management**:
- CRUD operations for nodes and edges
- Batch operations for performance
- Relationship management between connected elements

**Layout Algorithms**:
- **Hierarchical**: Vertical step-based arrangement
- **Force**: Physics-based node positioning
- **Grid**: Regular grid-based layout

**Persistence**:
- Auto-save with 1-second debounce
- Integration with Tauri API for local storage
- Dirty state tracking for efficient saves

**Animation System**:
- Staggered node appearance animations
- Smooth layout transitions
- Visual state management during animations

### 3. CanvasControls.tsx - UI Control Components

**Purpose**: Collection of reusable UI components for canvas interaction.

#### Component Catalog

**RefreshButton**:
- Regenerates workflow content
- Shows loading states and counters
- Displays locked item counts

**LockToggle**:
- Individual item locking/unlocking
- Visual feedback with animations
- Size variants (sm, md, lg)

**CanvasControls**:
- Zoom in/out controls
- Fit to view functionality
- Grid toggle
- Zoom level display

**SelectionCounter**:
- Shows selected item counts
- Contextual selection feedback

**BulkActionsBar**:
- Bulk operations on selected items
- Lock/unlock all functionality
- Custom action integration

### 4. useCanvasNavigation.ts - Navigation & Viewport Control

**Purpose**: Advanced navigation system with responsive viewport management.

#### Key Features

**Responsive Viewport**:
```typescript
interface ViewportDimensions {
  width: number;
  height: number;
}

const getEffectiveViewport = (includeSidebar = false): ViewportDimensions => {
  // Accounts for sidebar width (256px)
  // Returns actual available canvas space
}
```

**Smart Node Centering**:
```typescript
const centerOnNode = (nodeId: string, options: NodeCenteringOptions) => {
  // Calculates optimal viewport position
  // Accounts for node dimensions and sidebar
  // Smooth animated transitions
}
```

**Progressive Workflow Navigation**:
- **Step 1**: Focus on core problem (zoom: 1.2x)
- **Step 2**: Show problem + personas (zoom: 0.9x)
- **Step 3**: Include pain points (zoom: 0.7x)
- **Step 4+**: Full workflow view

**Responsive Calculations**:
- Dynamic zoom based on screen size
- Adaptive padding for different viewport sizes
- Optimal node positioning for new elements

## Control Flow & Data Management

### State Update Flow
```
User Action → Canvas Controls → canvasStore → React Flow → Canvas.tsx
     ↑                                                        ↓
Navigation Hook ←─────────── Viewport Changes ←──────────────┘
```

### Auto-Save System
```
Node/Edge Change → markDirty() → debounced saveCanvasState() → Tauri API
                              ↓
                          Success/Error → UI Notifications
```

### Layout Application Flow
```
applyLayout(type) → calculateNodePositions() → updateNodes() → markDirty()
                                           ↓
                                   Visual Transition
```

## Integration Points

### Workflow Store Integration
The canvas reacts to workflow state changes:
- **Step changes**: Automatic layout adjustments
- **Persona selection**: Visual focus and selection
- **Solution selection**: Multi-select state management

### Performance Considerations
- **Debounced saves**: 1-second delay to batch operations
- **Optimistic updates**: Immediate UI feedback
- **Selective re-renders**: Zustand subscriptions prevent unnecessary renders

### Persistence Layer
- **Local storage**: Via Tauri API for offline capability
- **State reconstruction**: Full canvas state serialization
- **Conflict resolution**: Dirty state tracking

## Advanced Features

### Animation System
```typescript
animateNodeAppearance(nodes: Node[], staggerDelay = 100) => {
  // Staggered entrance animations
  // Scale and opacity transitions
  // Completion callbacks
}
```

### Lock Management
- Individual node locking
- Bulk lock operations
- Visual lock indicators
- Regeneration protection

### Responsive Design
- Viewport-aware positioning
- Dynamic zoom calculations
- Sidebar accommodation
- Window resize handling

## Usage Patterns

### Basic Canvas Setup
```typescript
// In a component
const Canvas = () => (
  <ReactFlowProvider>
    <div className="canvas-container">
      <Canvas />
      <CanvasControls />
    </div>
  </ReactFlowProvider>
);
```

### Custom Control Integration
```typescript
const { centerOnNode, goToStep } = useCanvasNavigation();
const { selectNode, clearSelection } = useCanvasStore();

// Navigate to specific workflow step
const handleStepChange = (step: number) => {
  goToStep(step);
};

// Focus on specific element
const handleFocus = (nodeId: string) => {
  centerOnNode(nodeId, { zoom: 1.5, duration: 800 });
  selectNode(nodeId);
};
```

### Layout Management
```typescript
const { applyLayout, calculateNodePositions } = useCanvasStore();

// Change layout type
applyLayout('hierarchical'); // or 'force' or 'grid'

// Custom positioning
const customNodes = calculateNodePositions(nodes);
```

## Performance Optimization

### Debouncing Strategy
- **Save operations**: 1-second debounce
- **Viewport updates**: Immediate with debounced persistence
- **Layout calculations**: Batched with state updates

### Memory Management
- **Subscription cleanup**: Automatic on component unmount
- **Event listener management**: Window resize handlers
- **Reference optimization**: useCallback for expensive operations

### Rendering Optimization
- **React Flow optimizations**: Node/edge memoization
- **Store subscriptions**: Selective state subscription
- **Animation frame usage**: Smooth 60fps animations

## Error Handling

### Persistence Errors
- Graceful degradation when save fails
- User notification via UI store
- Retry mechanisms for critical operations

### Navigation Errors
- Fallback positioning for missing nodes
- Boundary checking for viewport limits
- Safe defaults for malformed data

## Future Extensibility

### Plugin Architecture
The control system is designed for easy extension:
- Custom control components
- Additional layout algorithms
- New navigation patterns
- Enhanced animation systems

### Configuration Options
- Customizable zoom ranges
- Adjustable animation timings
- Layout algorithm parameters
- Responsive breakpoints

## Development Guidelines

### Adding New Controls
1. Create component in `src/components/canvas/controls/`
2. Export from `index.ts`
3. Integrate with canvas store actions
4. Add to main Canvas component

### Extending Navigation
1. Add new functions to `useCanvasNavigation`
2. Integrate with existing viewport management
3. Consider responsive behavior
4. Test across different screen sizes

### State Management
1. Add new state to `CanvasStoreState` interface
2. Implement corresponding actions
3. Consider persistence requirements
4. Add appropriate subscriptions

This documentation provides a comprehensive overview of the Canvas Control System, serving as both a reference for understanding the current implementation and a guide for future development and maintenance. 