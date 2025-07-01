// Import components for nodeTypes configuration
import { CoreProblemNode } from './CoreProblemNode';
import { PersonaNode } from './PersonaNode';
import { PainPointNode } from './PainPointNode';
import { SolutionNode } from './SolutionNode';
import { LabelNode } from './LabelNode';

// Export all node components
export { BaseNode } from './BaseNode';
export { CoreProblemNode } from './CoreProblemNode';
export { PersonaNode } from './PersonaNode';
export { PainPointNode } from './PainPointNode';
export { SolutionNode } from './SolutionNode';
export { PainLevelIndicator } from './PainLevelIndicator';
export { LabelNode } from './LabelNode';

// Export types
export type { CoreProblemNodeData } from './CoreProblemNode';
export type { PersonaNodeData } from './PersonaNode';
export type { PainPointNodeData } from './PainPointNode';
export type { SolutionNodeData } from './SolutionNode';
export type { PainLevelIndicatorProps } from './PainLevelIndicator';

// Export node types configuration for React Flow
export const nodeTypes = {
  problem: CoreProblemNode,
  persona: PersonaNode,
  painPoint: PainPointNode,
  solution: SolutionNode,
  label: LabelNode,
};