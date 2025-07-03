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

## Step-Based Navigation Strategy

### Step 1: Problem Definition Focus

**Objective**: Center the CoreProblemNode in the viewport with PersonaNodes positioned to the right, creating an optimal layout for the problem definition phase.

**✅ Implementation Status**: COMPLETED - Fully functional clickable ProgressSteps with intelligent Step 1 canvas positioning.

### Step 2: Persona Discovery Focus

**Objective**: Position the canvas to optimally display both CoreProblemNode and PersonaNodes for the persona discovery phase, with emphasis on the persona column.

**✅ Implementation Status**: COMPLETED - Fully functional Step 2 navigation with persona-focused viewport positioning.

#### Step 2 Implementation Strategy

**Enhanced Persona Discovery Positioning**:
```typescript
const goToStep2 = useCallback(() => {
  // Find core problem node and all persona nodes
  const coreNode = getNode('problem-input');
  const personaNodes = allNodes.filter(node => 
    node.id.startsWith('persona-') && node.type === 'persona'
  );
  
  if (!coreNode || personaNodes.length === 0) return;
  
  // Create comprehensive bounding box for Step 2 perspective
  const allRelevantNodes = [coreNode, ...personaNodes];
  const bounds = calculateBoundingBox(allRelevantNodes);
  
  // Persona-focused zoom calculation (slightly closer than Step 1)
  const baseZoom = Math.min(
    viewport.width / 1200,
    viewport.height / 800
  );
  const optimalZoom = Math.max(0.6, Math.min(1.4, baseZoom * 1.25));
  
  // Center calculation with slight shift towards persona column
  const layoutCenterX = bounds.minX + (bounds.maxX - bounds.minX) * 0.55; // Shift towards personas
  const layoutCenterY = bounds.minY + (bounds.maxY - bounds.minY) * 0.5;
  
  // Apply viewport transformation
  setViewport({ x: flowX, y: flowY, zoom: optimalZoom }, { duration: 1000 });
}, [getNode, getNodes, setViewport]);
```

**Key Step 2 Features:**
- **Persona-Centric Positioning**: Slight rightward shift (0.55 vs 0.5) to emphasize persona column
- **Enhanced Zoom Level**: 1.25x multiplier for closer persona detail viewing  
- **Comprehensive Bounds**: Includes all persona nodes for complete context
- **Smooth Animation**: 1-second transition maintains professional UX

**📋 What Was Accomplished:**

1. **Enhanced useCanvasNavigation.ts**: 
   - **Step 1**: Intelligent positioning with flexible node discovery, responsive zoom calculation, and sidebar-aware viewport positioning
   - **Step 2**: Persona-focused navigation with enhanced zoom level and rightward positioning shift

2. **Updated App.tsx**: Integrated clickable ProgressSteps with proper React Flow context, mapping workflow steps to progress indices, and comprehensive click handling for both Step 1 and Step 2.

3. **Improved ProgressSteps Component**: Added hover effects, focus states, and clickable functionality with proper accessibility support.

4. **Added CSS Utility Classes**: Defined interactive utility classes (hover:scale-110, focus:ring-2, etc.) for smooth animations and user feedback.

5. **Comprehensive Debugging**: Added detailed console logging for troubleshooting node discovery, viewport calculations, and click events.

#### Implementation Strategy

**1. Node Detection & Bounding Box Calculation**:
```typescript
const goToStep1 = useCallback(() => {
  // Find core problem node
  const coreNode = getNode('problem-input');
  
  // Find all persona nodes (excluding labels)
  const personaNodes = allNodes.filter(node => 
    node.id.startsWith('persona-') && node.id !== 'personas-label'
  );
  
  // Calculate combined bounding box
  const allRelevantNodes = [coreNode, ...personaNodes];
  const bounds = calculateBoundingBox(allRelevantNodes);
}
```

**2. Responsive Zoom Calculation**:
```typescript
// Account for sidebar and calculate available space
const sidebarOffset = 256;
const availableWidth = viewport.width - sidebarOffset;
const availableHeight = viewport.height;

// Calculate optimal zoom to fit all relevant content
const padding = 100;
const zoomX = availableWidth / (totalWidth + padding * 2);
const zoomY = availableHeight / (totalHeight + padding * 2);
const optimalZoom = Math.min(zoomX, zoomY, 1.2); // Cap at 1.2x for readability
```

**3. Viewport Positioning**:
```typescript
// Calculate the center point of the entire layout
const layoutCenterX = bounds.minX + (totalWidth / 2);
const layoutCenterY = bounds.minY + (totalHeight / 2);

// Position viewport to center the layout considering sidebar
const viewportCenterX = (availableWidth / 2) + sidebarOffset;
const viewportCenterY = availableHeight / 2;

// Calculate final viewport transformation
const flowX = viewportCenterX - (layoutCenterX * optimalZoom);
const flowY = viewportCenterY - (layoutCenterY * optimalZoom);
```

**4. Smooth Animation**:
```typescript
setViewport(
  { x: flowX, y: flowY, zoom: optimalZoom },
  { duration: 1000 }
);
```

#### Visual Result

When Step 1 is clicked:
- **CoreProblemNode** appears centered-left in the main viewport
- **PersonaNodes** are visible to the right in their column formation
- **Optimal zoom level** ensures both problem and persona areas are clearly visible
- **Smooth animation** (1 second) transitions from current view to Step 1 layout
- **Sidebar accommodation** ensures content doesn't overlap with the navigation sidebar

#### ✅ Testing Results (Verified via Playwright MCP)

Successfully tested on localhost:1420 with complete functionality:

**✅ User Interaction:**
- ProgressSteps buttons are clickable and responsive
- Both step numbers and step titles trigger navigation
- Hover effects and focus states work correctly
- Step 1 button successfully triggers canvas navigation

**✅ Node Discovery:**
- Navigation system finds all 8 nodes in React Flow context
- CoreProblemNode (ID: "problem-input") is successfully located
- All 5 PersonaNodes are detected and included in calculations

**✅ Viewport Calculations:**
- Bounding box calculation: 680px × 706px layout area
- Optimal zoom calculated: ≈0.714 (responsive to screen size)
- Viewport positioning accounts for 256px sidebar width
- Layout centers CoreProblemNode with PersonaNodes visible to the right

**✅ Animation & User Experience:**
- Canvas smoothly animates to focused view with 1-second duration
- Zoom level optimized for content visibility and readability
- Navigation respects existing canvas state and provides smooth transitions

**✅ Step 2 Navigation Results:**
- Step 2 button click triggers persona discovery mode
- Workflow state changes from "problem_input" to "persona_discovery"
- Canvas viewport shifts with persona-focused positioning (0.55 vs 0.5 center ratio)
- Enhanced zoom level (1.25x multiplier) provides closer persona detail viewing
- Smooth 1-second animation transition maintains professional UX

#### 🔧 Key Technical Fix Applied

**Problem Identified**: Dual ReactFlowProvider contexts prevented node discovery
**Solution**: Removed duplicate `ReactFlowProvider` from Canvas.tsx component
**Result**: Navigation hooks can now properly access React Flow node context

#### 🎯 Final Implementation Status

✅ **COMPLETED** - Multi-step navigation system is fully functional and tested:

**Step 1 Navigation**: Users can click on the "1" in the ProgressSteps to intelligently center the CoreProblemNode with PersonaNodes visible to the right, providing an optimal view for the problem definition phase.

**Step 2 Navigation**: Users can click on the "2" in the ProgressSteps to transition to persona discovery mode with enhanced persona-focused positioning and closer zoom level for detailed persona analysis.
- **Smooth animation** (1 second) transitions from current view to Step 1 layout
- **Sidebar accommodation** ensures content doesn't overlap with the navigation sidebar

#### Implementation Details

**Node Discovery & Fallback Logic:**
```typescript
// Find core problem node with flexible ID matching
const allNodes = getNodes();
const coreNode = getNode('problem-input');

if (!coreNode) {
  // Fallback to alternative node IDs
  const alternativeNode = allNodes.find(node => 
    node.id.includes('problem') || 
    node.type === 'problem' ||
    node.id.includes('core')
  );
  
  if (alternativeNode) {
    centerOnNode(alternativeNode.id, { padding: 100, zoom: 1.2, duration: 1000 });
  }
  return;
}
```

**Bounding Box Calculation:**
```typescript
// Calculate optimal viewport to show problem + personas
const personaNodes = allNodes.filter(node => 
  node.id.startsWith('persona-') && 
  node.id !== 'personas-label' &&
  node.type === 'persona'
);

const allRelevantNodes = [coreNode, ...personaNodes];
const bounds = allRelevantNodes.reduce((acc, node) => {
  const nodeWidth = node.measured?.width || node.width || 300;
  const nodeHeight = node.measured?.height || node.height || 150;
  
  return {
    minX: Math.min(acc.minX, node.position.x),
    minY: Math.min(acc.minY, node.position.y),
    maxX: Math.max(acc.maxX, node.position.x + nodeWidth),
    maxY: Math.max(acc.maxY, node.position.y + nodeHeight)
  };
}, { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });
```

**Responsive Zoom & Positioning:**
```typescript
// Account for sidebar and calculate optimal view
const sidebarOffset = 256;
const availableWidth = viewport.width - sidebarOffset;
const availableHeight = viewport.height;

const padding = 100;
const zoomX = availableWidth / (totalWidth + padding * 2);
const zoomY = availableHeight / (totalHeight + padding * 2);
const optimalZoom = Math.min(zoomX, zoomY, 1.2); // Capped for readability

// Center the layout considering sidebar offset
const layoutCenterX = bounds.minX + (totalWidth / 2);
const layoutCenterY = bounds.minY + (totalHeight / 2);
const viewportCenterX = (availableWidth / 2) + sidebarOffset;
const viewportCenterY = availableHeight / 2;

const flowX = viewportCenterX - (layoutCenterX * optimalZoom);
const flowY = viewportCenterY - (layoutCenterY * optimalZoom);

// Apply smooth transition
setViewport({ x: flowX, y: flowY, zoom: optimalZoom }, { duration: 1000 });
```

#### Debugging & Monitoring

The implementation includes comprehensive logging for troubleshooting:

**Navigation Function Logging:**
```typescript
console.log('[useCanvasNavigation] goToStep1 called');
console.log('[useCanvasNavigation] All available nodes:', allNodes.map(n => ({ id: n.id, type: n.type })));
console.log('[useCanvasNavigation] Core node found:', coreNode.id);
console.log('[useCanvasNavigation] Found persona nodes:', personaNodes.map(n => ({ id: n.id, type: n.type })));
```

**Click Handler Logging:**
```typescript
console.log('[App] Step clicked:', stepIndex);
console.log('[App] Available navigation functions:', { goToStep1: typeof goToStep1, goToStep: typeof goToStep });
console.log('[App] Calling goToStep1...');
```

**Viewport Calculation Logging:**
```typescript
console.log('[useCanvasNavigation] Step 1 calculation:', {
  bounds,
  totalWidth,
  totalHeight,
  optimalZoom,
  layoutCenter: { x: layoutCenterX, y: layoutCenterY },
  viewportCenter: { x: viewportCenterX, y: viewportCenterY },
  targetViewport: { x: flowX, y: flowY, zoom: optimalZoom }
});
```

#### Manual Testing Instructions

To test the Step 1 navigation functionality:

1. **Open Developer Console**: Press F12 to open browser dev tools
2. **Navigate to Application**: Go to http://localhost:1420
3. **Pan Canvas Away**: Click and drag in the canvas to move the view away from the center
4. **Click Step 1**: Click on the "1" button in the ProgressSteps at the top
5. **Observe Animation**: Watch for smooth 1-second animation returning to centered view
6. **Check Console Logs**: Look for debug messages confirming:
   - `[App] Step clicked: 0`
   - `[App] Calling goToStep1...`
   - `[useCanvasNavigation] goToStep1 called`
   - Node discovery and positioning calculations

**Expected Behavior:**
- Canvas smoothly animates to center CoreProblemNode
- PersonaNodes are visible to the right
- Zoom level is optimized for content visibility
- Sidebar doesn't overlap content

**Troubleshooting:**
- If no logs appear: Check that click handler is attached
- If nodes not found: Verify node IDs and types in console
- If positioning is off: Check viewport calculations and sidebar offset
- If animation stutters: Verify React Flow context availability

#### Integration with ProgressSteps

The Step 1 navigation is triggered via the clickable ProgressSteps component:
```typescript
// In App.tsx
const handleStepClick = (stepIndex: number) => {
  switch (stepIndex) {
    case 0: // Problem
      goToStep1(); // Triggers the Step 1 positioning strategy
      break;
    // ... other cases
  }
};
```

**Progressive Workflow Navigation**:
- **Step 1**: Focus on core problem (zoom: calculated, shows problem + personas)
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