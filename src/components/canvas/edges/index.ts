// Import components for edgeTypes configuration
import { AnimatedEdge } from './AnimatedEdge';
import { SolutionEdge } from './SolutionEdge';
import { HighlightedEdge } from './HighlightedEdge';
import { DependencyEdge } from './DependencyEdge';

// Export all edge components
export { AnimatedEdge } from './AnimatedEdge';
export { SolutionEdge } from './SolutionEdge';
export { HighlightedEdge } from './HighlightedEdge';
export { DependencyEdge } from './DependencyEdge';

// Export edge types
export type { SolutionEdgeData } from './SolutionEdge';

// Export edge types configuration for React Flow
export const edgeTypes = {
  animated: AnimatedEdge,
  solution: SolutionEdge,
  highlighted: HighlightedEdge,
  dependency: DependencyEdge,
};

// Add CSS for edge animations
const edgeStyles = `
@keyframes dash {
  from {
    stroke-dashoffset: 16;
  }
  to {
    stroke-dashoffset: 0;
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
const styleElement = document.createElement('style');
styleElement.textContent = edgeStyles;
document.head.appendChild(styleElement);
}