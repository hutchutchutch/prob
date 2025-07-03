# Container vs Presentational Components Pattern

## Overview

This project uses the **Container/Presentational** component pattern (also known as **Smart/Dumb** components) to separate business logic from UI rendering. This architectural pattern helps maintain clean, testable, and reusable code.

## Pattern Definition

### Container Components (Smart)
- Handle data fetching and state management
- Connect to stores (Zustand, Redux, etc.)
- Contain business logic and side effects
- Pass data down to presentational components via props
- Handle user interactions that require business logic

### Presentational Components (Dumb)
- Focus purely on UI rendering
- Receive all data via props
- Contain only UI-related state (e.g., expanded/collapsed)
- Are highly reusable and testable
- Emit events upward via callback props

## Example: Sidebar Implementation

Our sidebar implementation demonstrates this pattern clearly:

```typescript
// Presentational Component (Sidebar.tsx)
export const Sidebar: React.FC<SidebarProps> = ({
  workspaces,        // Data passed as props
  activeWorkspaceId,
  onWorkspaceSelect, // Callbacks for user actions
  onWorkspaceCreate,
  // ... other props
}) => {
  // Only UI state
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<Set<string>>(new Set());
  
  // Pure rendering logic
  return <aside>...</aside>;
};

// Container Component (ConnectedSidebar.tsx)
export const ConnectedSidebar: React.FC = () => {
  // Store connections
  const { user } = useAuth();
  const workflowStore = useWorkflowStore();
  
  // Data fetching
  useEffect(() => {
    const fetchWorkspaces = async () => {
      const { data } = await supabase.from('workspaces').select();
      // ... handle data
    };
    fetchWorkspaces();
  }, [user]);
  
  // Business logic
  const handleWorkspaceCreate = async () => {
    // API calls, state updates, etc.
  };
  
  // Pass everything to presentational component
  return <Sidebar workspaces={workspaces} onWorkspaceCreate={handleWorkspaceCreate} />;
};
```

## Benefits

### 1. **Testability**
Presentational components can be tested with simple prop passing:
```typescript
test('Sidebar renders workspaces', () => {
  const mockWorkspaces = [{ id: '1', name: 'Test' }];
  render(<Sidebar workspaces={mockWorkspaces} />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

### 2. **Reusability**
The same UI component can be used with different data sources:
```typescript
// Use with Supabase
<ConnectedSidebar />

// Use with mock data
<Sidebar workspaces={mockData} />

// Use in Storybook
<Sidebar {...storybookProps} />
```

### 3. **Separation of Concerns**
- UI developers focus on `Sidebar.tsx`
- Backend/integration developers focus on `ConnectedSidebar.tsx`
- Changes to data fetching don't affect UI
- UI changes don't affect business logic

### 4. **Type Safety**
Clear prop interfaces make TypeScript more effective:
```typescript
interface SidebarProps {
  workspaces: Workspace[];
  activeWorkspaceId?: string;
  onWorkspaceSelect: (id: string) => void;
  // ... clearly defined props
}
```

## When to Use This Pattern

### Use Container/Presentational When:
- Component has complex data fetching logic
- Component connects to multiple stores
- Component needs to be reusable with different data sources
- You want to showcase components in Storybook
- Multiple developers work on UI vs business logic
- Component has significant business logic

### Consider a Single Component When:
- Component is simple with minimal logic
- Component is used only once in the app
- Data fetching is trivial (single store value)
- Separation would create unnecessary complexity

## Implementation Guidelines

### 1. **Naming Convention**
- Container: `Connected[ComponentName]` or `[ComponentName]Container`
- Presentational: `[ComponentName]`

### 2. **File Structure**
```
components/
  layout/
    Sidebar/
      Sidebar.tsx           # Presentational
      ConnectedSidebar.tsx  # Container
      types.ts             # Shared types
      index.ts             # Exports
```

### 3. **Props Interface**
Always define clear prop interfaces for presentational components:
```typescript
interface PresentationalProps {
  // Data props
  items: Item[];
  selectedId?: string;
  
  // Callback props
  onSelect: (id: string) => void;
  onCreate: () => void;
  
  // UI props
  className?: string;
  isLoading?: boolean;
}
```

### 4. **State Management**
- Container: Business state, API state, store state
- Presentational: UI state only (hover, expanded, focus, etc.)

## Common Pitfalls to Avoid

### 1. **Over-Engineering**
Don't split every component. Simple components can contain both logic and UI.

### 2. **Prop Drilling**
If passing too many props becomes cumbersome, consider:
- Component composition
- Context API for truly global UI state
- Compound components pattern

### 3. **Business Logic in Presentational Components**
Avoid:
```typescript
// ❌ Bad: Business logic in presentational component
const handleSave = async () => {
  await api.saveWorkspace(data);
};

// ✅ Good: Emit event upward
const handleSave = () => {
  onSave(data);
};
```

### 4. **Store Access in Presentational Components**
Avoid:
```typescript
// ❌ Bad: Direct store access
const { user } = useAuth();

// ✅ Good: Receive as prop
interface Props {
  user: User;
}
```

## Testing Strategy

### Presentational Components
```typescript
describe('Sidebar', () => {
  it('renders all workspaces', () => {
    // Simple prop-based testing
  });
  
  it('calls onSelect when workspace clicked', () => {
    // Test callbacks
  });
});
```

### Container Components
```typescript
describe('ConnectedSidebar', () => {
  it('fetches workspaces on mount', () => {
    // Mock API calls and stores
  });
  
  it('handles workspace creation', () => {
    // Test business logic
  });
});
```

## Migration Guide

To refactor an existing component:

1. **Identify what belongs where**:
   - Data fetching → Container
   - Store connections → Container
   - Business logic → Container
   - UI rendering → Presentational
   - UI state → Presentational

2. **Create the presentational component first**:
   - Extract all rendering logic
   - Define prop interface
   - Replace direct store/API access with props

3. **Create the container component**:
   - Move all business logic
   - Connect to stores
   - Handle data fetching
   - Pass props to presentational component

4. **Update imports**:
   - Export container as default for backward compatibility
   - Export presentational component for testing/Storybook

## Conclusion

The Container/Presentational pattern provides a clean architecture for complex React applications. While it adds some boilerplate, the benefits in testability, reusability, and maintainability make it worthwhile for components with significant business logic or data requirements.

Remember: Not every component needs this pattern. Use it where it provides clear value, and keep simple components simple. 