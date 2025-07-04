import { StateGraph, START, END } from "@langchain/langgraph";
import { MemorySaver } from "@langchain/langgraph";
import { WorkflowStateAnnotation } from "./state/annotations";
import * as nodes from "./nodes";
import { focusGroupSubgraph } from "./subgraphs/focus-group";
import { documentGenerationSubgraph } from "./subgraphs/document-generation";
import { shouldContinueAfterValidation } from "./edges/conditionals";

export function createProductSpecWorkflow(options?: {
  checkpointer?: MemorySaver;
  debug?: boolean;
}) {
  const workflow = new StateGraph(WorkflowStateAnnotation)
    // Main workflow nodes
    .addNode("validateProblem", nodes.validateProblem)
    .addNode("generatePersonas", nodes.generatePersonas)
    .addNode("generatePainPoints", nodes.generatePainPoints)
    .addNode("generateSolutions", nodes.generateSolutions)
    
    // Subgraphs
    .addNode("focusGroup", focusGroupSubgraph)
    .addNode("generateDocuments", documentGenerationSubgraph)
    
    // Persistence
    .addNode("saveFinalState", nodes.saveFinalState)
    
    // Define edges
    .addEdge(START, "validateProblem")
    
    // Conditional routing after validation
    .addConditionalEdges(
      "validateProblem",
      shouldContinueAfterValidation,
      {
        continue: "generatePersonas",
        end: END
      }
    )
    
    // Sequential flow
    .addEdge("generatePersonas", "generatePainPoints")
    .addEdge("generatePainPoints", "generateSolutions")
    .addEdge("generateSolutions", "focusGroup")
    .addEdge("focusGroup", "generateDocuments")
    .addEdge("generateDocuments", "saveFinalState")
    .addEdge("saveFinalState", END);

  return workflow.compile({
    checkpointer: options?.checkpointer
  });
} 