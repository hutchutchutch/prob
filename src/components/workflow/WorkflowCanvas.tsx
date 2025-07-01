import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Canvas } from '@/components/canvas';
import { ProblemInput } from './ProblemInput';
import { useWorkflowStore } from '@/stores/workflowStore';
import { useCanvasStore } from '@/stores/canvasStore';
import { Node, Edge } from '@xyflow/react';

// Demo nodes for the initial canvas state
const createDemoNodes = (): Node[] => {
  const nodes: Node[] = [];
  
  // Core problem node
  nodes.push({
    id: 'demo-problem',
    type: 'problem',
    position: { x: 500, y: 50 },
    data: { 
      title: 'Core Problem',
      description: 'Your problem will appear here',
      isDemo: true,
      status: 'valid'
    }
  });

  // Persona nodes
  const personaNames = ['Sally Sales-a-lot', 'Tim Tech-savvy', 'Mary Manager', 'Dave Developer', 'Clara Customer'];
  personaNames.forEach((name, index) => {
    nodes.push({
      id: `demo-persona-${index}`,
      type: 'persona',
      position: { x: 200 + (index * 150), y: 200 },
      data: { 
        name,
        description: 'Persona description',
        isDemo: true,
        demographics: {},
        psychographics: {}
      }
    });
  });

  // Pain point nodes
  const painPoints = ['Slow workflow', 'Data silos', 'Poor collaboration'];
  painPoints.forEach((pain, index) => {
    nodes.push({
      id: `demo-pain-${index}`,
      type: 'painPoint',
      position: { x: 300 + (index * 200), y: 350 },
      data: { 
        title: pain,
        severity: index === 0 ? 5 : index === 1 ? 4 : 3,
        isDemo: true
      }
    });
  });

  // Solution nodes
  const solutions = ['Unified Dashboard', 'API Integration', 'Real-time Sync', 'Mobile App', 'Analytics Suite'];
  solutions.forEach((solution, index) => {
    nodes.push({
      id: `demo-solution-${index}`,
      type: 'solution',
      position: { x: 150 + (index * 180), y: 500 },
      data: { 
        title: solution,
        type: index % 2 === 0 ? 'feature' : 'integration',
        isDemo: true,
        impact: 'high'
      }
    });
  });

  return nodes;
};

const createDemoEdges = (): Edge[] => {
  const edges: Edge[] = [];
  
  // Connect problem to personas
  for (let i = 0; i < 5; i++) {
    edges.push({
      id: `demo-edge-problem-persona-${i}`,
      source: 'demo-problem',
      target: `demo-persona-${i}`,
      type: 'animated',
      animated: true,
      style: { opacity: 0.3, stroke: '#9CA3AF' }
    });
  }

  // Connect personas to pain points
  edges.push({
    id: 'demo-edge-persona-pain-0',
    source: 'demo-persona-0',
    target: 'demo-pain-0',
    type: 'animated',
    animated: true,
    style: { opacity: 0.3, stroke: '#9CA3AF' }
  });

  edges.push({
    id: 'demo-edge-persona-pain-1',
    source: 'demo-persona-2',
    target: 'demo-pain-1',
    type: 'animated',
    animated: true,
    style: { opacity: 0.3, stroke: '#9CA3AF' }
  });

  // Connect pain points to solutions
  edges.push({
    id: 'demo-edge-pain-solution-0',
    source: 'demo-pain-0',
    target: 'demo-solution-0',
    type: 'solution',
    style: { opacity: 0.3, stroke: '#10B981' }
  });

  edges.push({
    id: 'demo-edge-pain-solution-1',
    source: 'demo-pain-1',
    target: 'demo-solution-1',
    type: 'solution',
    style: { opacity: 0.3, stroke: '#F59E0B' }
  });

  return edges;
};

export function WorkflowCanvas() {
  const { currentStep, coreProblem } = useWorkflowStore();
  const { addNodes, addEdges, zoomTo, resetCanvas } = useCanvasStore();
  const [showDemoNodes, setShowDemoNodes] = useState(true);
  const [canvasInitialized, setCanvasInitialized] = useState(false);

  // Initialize demo nodes when component mounts
  useEffect(() => {
    console.log('[WorkflowCanvas] Initializing with currentStep:', currentStep);
    console.log('[WorkflowCanvas] Canvas initialized:', canvasInitialized);
    
    if (currentStep === 'problem_input' && !coreProblem && !canvasInitialized) {
      console.log('[WorkflowCanvas] Setting up demo nodes...');
      
      // Clear canvas first
      resetCanvas();
      
      // Set demo nodes with low opacity
      const demoNodes = createDemoNodes();
      const demoEdges = createDemoEdges();
      
      // Make demo nodes semi-transparent
      demoNodes.forEach(node => {
        node.style = { ...node.style, opacity: 0.1 };
      });
      
      console.log('[WorkflowCanvas] Adding nodes:', demoNodes.length);
      console.log('[WorkflowCanvas] Adding edges:', demoEdges.length);
      
      addNodes(demoNodes);
      addEdges(demoEdges);
      
      setCanvasInitialized(true);
      
      // After a short delay, zoom to the problem area
      setTimeout(() => {
        console.log('[WorkflowCanvas] Zooming to problem area...');
        zoomTo(1.5);
      }, 500);
    }
  }, [currentStep, coreProblem, canvasInitialized, addNodes, addEdges, zoomTo, resetCanvas]);

  // Hide demo nodes when moving past problem input
  useEffect(() => {
    if (currentStep !== 'problem_input' && showDemoNodes) {
      console.log('[WorkflowCanvas] Hiding demo nodes...');
      setShowDemoNodes(false);
      // Clear demo nodes and start fresh
      resetCanvas();
    }
  }, [currentStep, showDemoNodes, resetCanvas]);

  return (
    <div className="relative w-full h-full">
      {/* React Flow Canvas */}
      <Canvas />

      {/* Problem Input Overlay */}
      <AnimatePresence>
        {currentStep === 'problem_input' && !coreProblem?.is_validated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="pointer-events-auto"
            >
              <ProblemInput />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 bg-gray-800 p-2 rounded text-xs text-gray-400 z-30">
          <div>Step: {currentStep}</div>
          <div>Problem: {coreProblem ? 'Validated' : 'Not validated'}</div>
          <div>Canvas Init: {canvasInitialized ? 'Yes' : 'No'}</div>
          <div>Demo Nodes: {showDemoNodes ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  );
}