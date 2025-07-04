# Product Specification Workflow

A modular, type-safe LangGraph workflow for generating complete product specifications with focus groups and document generation.

## Features

- ✅ **Type-Safe**: Full Zod validation throughout
- ✅ **Modular**: Clean separation of concerns
- ✅ **Streaming**: Real-time progress updates
- ✅ **Error Handling**: Comprehensive retry logic
- ✅ **Customizable**: User-defined prompts and behavior
- ✅ **Testable**: Each node is independently testable

## Quick Start

```typescript
import { runProductSpecWorkflow } from './workflows/product-spec';

const result = await runProductSpecWorkflow(
  "Users struggle with managing their daily tasks efficiently",
  {
    projectId: 'my-project',
    customPrompts: {
      productVision: "Create a comprehensive product vision..."
    },
    onNodeComplete: (node, state) => {
      console.log(`✓ ${node} completed`);
    }
  }
);
```

## Architecture

The workflow consists of several phases:

1. **Problem Validation**: Validates and refines the problem statement
2. **Persona Generation**: Creates user personas based on the problem
3. **Pain Point Analysis**: Identifies specific pain points for each persona
4. **Solution Generation**: Generates potential solutions
5. **Focus Group**: Conducts virtual focus group with feature prioritization
6. **Document Generation**: Creates all 6 GoldiDocs
7. **Final State**: Saves results to database

## Generated Documents

1. **Product Vision** - Executive summary and MVP features
2. **Functional Requirements** - Detailed feature specifications
3. **System Architecture** - Technical architecture design
4. **Data Flow Diagram** - User flow visualizations
5. **Entity Relationship Diagram** - Database design
6. **Design System** - UI/UX foundation

## State Management

The workflow uses LangGraph's state management with custom reducers:

- **Array Replace**: Replaces entire arrays (personas, solutions)
- **Array Append**: Adds to existing arrays (errors, features)
- **Object Merge**: Merges objects (finalDocuments)
- **Error Accumulation**: Collects and deduplicates errors

## Error Handling

- **Node-Level**: Each node wrapped with error handling
- **Retry Logic**: Automatic retries with exponential backoff
- **Graceful Degradation**: Continues workflow on non-critical errors
- **Error Accumulation**: Tracks errors for debugging

## Customization

### Custom Prompts

```typescript
const customPrompts = {
  productVision: "Create a vision focusing on mobile-first design...",
  systemArchitecture: "Design a microservices architecture..."
};
```

### Locked Items

```typescript
const lockedItems = {
  personas: ['tech-savvy-user', 'business-professional'],
  solutions: ['mobile-app', 'web-dashboard']
};
```

## Streaming Updates

```typescript
for await (const { node, state } of streamProductSpecWorkflow(problem)) {
  console.log(`Progress: ${node}`);
  updateUI(state);
}
```

## Testing

Each node can be tested independently:

```typescript
import { validateProblem } from './nodes/validateProblem';

const mockState = createTestState();
const result = await validateProblem(mockState);
expect(result.coreProblem.isValid).toBe(true);
```

## Configuration

Workflow behavior can be configured via `config.ts`:

- **Timeouts**: Node and workflow timeouts
- **Retries**: Retry attempts and backoff
- **Limits**: Maximum items per generation type

## Migration

See [MIGRATION.md](./MIGRATION.md) for migration guide from the monolithic version.

## File Structure

```
src/workflows/product-spec/
├── index.ts                 # Main entry point
├── graph.ts                 # Graph assembly
├── config.ts                # Configuration
├── schemas/                 # Zod schemas
├── state/                   # State management
├── nodes/                   # Individual workflow nodes
├── subgraphs/              # Subworkflows
├── edges/                  # Conditional routing
├── prompts/                # Prompt templates
└── utils/                  # Utilities
```

## Requirements

- Node.js 18+
- @langchain/langgraph
- @langchain/core
- zod
- Tauri backend for LLM calls 