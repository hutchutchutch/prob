# Migration Guide: Monolithic to Modular LangGraph

This guide shows how to migrate from the old monolithic orchestrator to the new modular architecture.

## Before (Monolithic)

```typescript
// Old way - single large file
import { LangGraphOrchestrator } from '../services/langgraph/orchestrator';

const orchestrator = new LangGraphOrchestrator();
const result = await orchestrator.runCompleteWorkflow(problemStatement);
```

## After (Modular)

```typescript
// New way - clean module imports
import { runProductSpecWorkflow } from '../workflows/product-spec';

const result = await runProductSpecWorkflow(problemStatement, {
  projectId: 'my-project',
  customPrompts: {
    productVision: "Create a detailed product vision..."
  },
  onNodeComplete: (node, state) => {
    console.log(`✓ ${node} completed`);
  }
});
```

## Key Benefits

1. **Type Safety**: Full Zod validation on all inputs/outputs
2. **Modularity**: Each node is a separate, testable function
3. **Streaming**: Built-in streaming support for real-time updates
4. **Error Handling**: Comprehensive error handling with retries
5. **Customization**: Easy to customize prompts and behavior

## Streaming Example

```typescript
// Stream updates in real-time
import { streamProductSpecWorkflow } from '../workflows/product-spec';

for await (const { node, state } of streamProductSpecWorkflow(problemStatement)) {
  console.log(`Node: ${node}`);
  console.log(`Progress: ${state.currentStep}`);
  
  // Update UI in real-time
  updateProgress(node, state);
}
```

## Hook Integration

```typescript
// Use with React hooks
import { useProductSpecWorkflow } from '../hooks/useProductSpecWorkflow';

function MyComponent() {
  const { runWorkflow, state, isLoading } = useProductSpecWorkflow();
  
  const handleRun = async () => {
    await runWorkflow(problemStatement, {
      onNodeComplete: (node, state) => {
        // Real-time updates
        setProgress(node);
      }
    });
  };
  
  return (
    <div>
      <button onClick={handleRun}>Run Workflow</button>
      {isLoading && <div>Processing: {state.currentStep}</div>}
    </div>
  );
}
```

## File Structure

The new modular structure is organized as follows:

```
src/workflows/product-spec/
├── index.ts                 # Main entry point
├── graph.ts                 # Graph assembly
├── config.ts                # Configuration
├── schemas/                 # Zod schemas
│   ├── state.schema.ts
│   ├── entities.schema.ts
│   └── api.schema.ts
├── state/                   # State management
├── nodes/                   # Individual workflow nodes
├── subgraphs/              # Subworkflows
├── edges/                  # Conditional routing
├── prompts/                # Prompt templates
└── utils/                  # Utilities
```

## Next Steps

1. Replace imports in your components
2. Update your hooks to use the new API
3. Test the streaming functionality
4. Customize prompts as needed
5. Remove the old monolithic orchestrator.ts file 