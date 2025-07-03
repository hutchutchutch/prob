// Import components for nodeTypes configuration
import { CoreProblemNode } from './CoreProblemNode';
import { PersonaNode } from './PersonaNode';
import { PainPointNode } from './PainPointNode';
import { SolutionNode } from './SolutionNode';
import { UserStoryNode } from './UserStoryNode';
import { LabelNode } from './LabelNode';
import { QuoteNode } from './QuoteNode';

// Export all node components
export { BaseNode } from './BaseNode';
export { CoreProblemNode } from './CoreProblemNode';
export { PersonaNode } from './PersonaNode';
export { PainPointNode } from './PainPointNode';
export { SolutionNode } from './SolutionNode';
export { UserStoryNode } from './UserStoryNode';
export { PainLevelIndicator } from './PainLevelIndicator';
export { LabelNode } from './LabelNode';
export { QuoteNode } from './QuoteNode';

// Export types
export type { CoreProblemNodeData } from './CoreProblemNode';
export type { PersonaNodeData } from './PersonaNode';
export type { PainPointNodeData } from './PainPointNode';
export type { SolutionNodeData } from './SolutionNode';
export type { UserStoryNodeData } from './UserStoryNode';
export type { PainLevelIndicatorProps } from './PainLevelIndicator';
export type { QuoteNodeData } from './QuoteNode';

// Export node types configuration for React Flow
export const nodeTypes = {
  problem: CoreProblemNode,
  coreProblem: CoreProblemNode, // Add alias for coreProblem type
  persona: PersonaNode,
  painPoint: PainPointNode,
  solution: SolutionNode,
  userStory: UserStoryNode,
  label: LabelNode,
  quote: QuoteNode,
};