// Import components for edgeTypes configuration
import { AnimatedEdge } from './AnimatedEdge';
import { SolutionEdge } from './SolutionEdge';
import { HighlightedEdge } from './HighlightedEdge';
import { DependencyEdge } from './DependencyEdge';
import { FloatingEdge } from './FloatingEdge';

// Export all edge components
export { AnimatedEdge } from './AnimatedEdge';
export { SolutionEdge } from './SolutionEdge';
export { HighlightedEdge } from './HighlightedEdge';
export { DependencyEdge } from './DependencyEdge';
export { FloatingEdge } from './FloatingEdge';

// Export edge types
export type { SolutionEdgeData } from './SolutionEdge';
export type { FloatingEdgeData } from './FloatingEdge';

// Export edge types configuration for React Flow
export const edgeTypes = {
  animated: AnimatedEdge,
  solution: SolutionEdge,
  highlighted: HighlightedEdge,
  dependency: DependencyEdge,
  floating: FloatingEdge,
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