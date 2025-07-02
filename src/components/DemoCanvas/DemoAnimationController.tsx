import React, { useEffect, useRef } from 'react';
import { useReactFlow } from 'reactflow';
import { AnimationSequence, ANIMATION_TIMINGS } from './AnimationSequence';
import demoData from '../../data/demoFlowData.json';

interface DemoAnimationControllerProps {
  onPhaseChange?: (phase: string) => void;
  onProgressUpdate?: (progress: number) => void;
}

export const DemoAnimationController: React.FC<DemoAnimationControllerProps> = ({
  onPhaseChange,
  onProgressUpdate,
}) => {
  const { setNodes, setEdges, fitView } = useReactFlow();
  const sequenceRef = useRef<AnimationSequence | null>(null);
  const animationFrameRef = useRef<number>();
  
  useEffect(() => {
    const sequence = new AnimationSequence();
    sequenceRef.current = sequence;
    
    // Initialize animation steps
    initializeAnimationSteps(sequence);
    
    // Start the animation
    sequence.start();
    
    // Progress tracking
    const updateProgress = () => {
      if (sequenceRef.current) {
        const progress = sequenceRef.current.getProgress();
        const phase = sequenceRef.current.getCurrentPhase();
        
        onProgressUpdate?.(progress);
        onPhaseChange?.(phase);
      }
      
      animationFrameRef.current = requestAnimationFrame(updateProgress);
    };
    
    updateProgress();
    
    return () => {
      sequence.stop();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  const initializeAnimationSteps = (sequence: AnimationSequence) => {
    // Phase 1: Problem Input
    const problemPhase = sequence.phases[0];
    problemPhase.steps = [
      {
        id: 'show-problem-node',
        duration: 500,
        action: () => {
          setNodes([{
            id: 'demo-problem',
            type: 'demoProblem',
            position: { x: 100, y: 300 },
            data: {
              statement: '',
              isTyping: false,
              isValidating: false,
              isValidated: false,
              goldFlashCount: 0,
            },
          }]);
          setEdges([]);
        },
        description: 'Show empty problem node',
      },
      {
        id: 'start-typing',
        duration: ANIMATION_TIMINGS.TYPING_PROBLEM - 500,
        action: () => {
          setNodes(nodes => nodes.map(node => 
            node.id === 'demo-problem' 
              ? { ...node, data: { ...node.data, statement: demoData.problem.statement, isTyping: true } }
              : node
          ));
        },
        description: 'Type problem statement',
      },
    ];
    
    // Phase 2: Validation
    const validationPhase = sequence.phases[1];
    validationPhase.steps = [
      {
        id: 'start-validation',
        duration: 800,
        action: () => {
          setNodes(nodes => nodes.map(node => 
            node.id === 'demo-problem' 
              ? { ...node, data: { ...node.data, isTyping: false, isValidating: true } }
              : node
          ));
        },
        description: 'Start validation animation',
      },
      {
        id: 'gold-flash',
        duration: ANIMATION_TIMINGS.GOLD_FLASH_DURATION * ANIMATION_TIMINGS.GOLD_FLASH_COUNT,
        action: () => {
          setNodes(nodes => nodes.map(node => 
            node.id === 'demo-problem' 
              ? { 
                  ...node, 
                  data: { 
                    ...node.data, 
                    isValidating: false, 
                    isValidated: true,
                    goldFlashCount: ANIMATION_TIMINGS.GOLD_FLASH_COUNT,
                  } 
                }
              : node
          ));
        },
        description: 'Gold flash animation',
      },
    ];
    
    // Phase 3: Personas
    const personasPhase = sequence.phases[2];
    const personaSteps = demoData.personas.map((persona, index) => ({
      id: `show-persona-${index}`,
      duration: index === demoData.personas.length - 1 
        ? ANIMATION_TIMINGS.PERSONAS_APPEAR - (index * ANIMATION_TIMINGS.PERSONA_STAGGER)
        : ANIMATION_TIMINGS.PERSONA_STAGGER,
      action: () => {
        setNodes(nodes => [
          ...nodes,
          {
            id: persona.id,
            type: 'demoPersona',
            position: { x: 500, y: 100 + (index * 140) },
            data: {
              ...persona,
              isAppearing: true,
              isHighlighted: persona.painDegree === Math.max(...demoData.personas.map(p => p.painDegree)),
            },
          },
        ]);
        
        setEdges(edges => [
          ...edges,
          {
            id: `edge-problem-${persona.id}`,
            source: 'demo-problem',
            target: persona.id,
            animated: true,
            style: { 
              stroke: persona.painDegree === Math.max(...demoData.personas.map(p => p.painDegree)) 
                ? '#F59E0B' 
                : '#4B5563',
              strokeWidth: 2,
            },
          },
        ]);
        
        // Fit view to show all nodes
        setTimeout(() => fitView({ padding: 0.2, duration: 800 }), 100);
      },
      description: `Show persona ${index + 1}`,
    }));
    
    personasPhase.steps = personaSteps;
    
    // Continue with remaining phases...
    // Phase 4: Pain Points (Canvas Slide)
    // Phase 5: Solutions
    // Phase 6: User Stories
    // Phase 7: Documents
    // Phase 8: Reset
  };
  
  return null; // This is a controller component, no UI
};