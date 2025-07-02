import { useState, useEffect, useCallback, useMemo } from 'react';
import { useWorkflowStore } from '../stores/workflowStore';
import { useCanvasStore } from '../stores/canvasStore';
import { useLockStore } from '../stores/lockStore';
import type { WorkflowStep } from '../types/workflow.types';

interface WorkflowProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  lockedSteps: number[];
  personas: Array<{
    id: string;
    name: string;
    role: string;
    pain_degree: number;
  }>;
  connections: {
    painPoints: number;
    solutions: number;
  };
  documentProgress: {
    current: number;
    total: number;
  };
  canNavigate: boolean;
  navigateToStep: (stepIndex: number) => void;
}

const stepMapping: Record<WorkflowStep, number> = {
  'problem_input': 0,
  'persona_discovery': 1,
  'pain_points': 2,
  'solution_generation': 3,
  'user_stories': 4,
  'architecture': 5,
  'export': 6
};

export const useWorkflowProgress = (): WorkflowProgress => {
  const currentWorkflowStep = useWorkflowStore(state => state.currentStep);
  const nodes = useCanvasStore(state => state.nodes);
  const edges = useCanvasStore(state => state.edges);
  const lockedNodes = useLockStore(state => state.lockedItems);
  
  // Map workflow step to progress index
  const currentStep = useMemo(() => {
    return stepMapping[currentWorkflowStep] ?? 0;
  }, [currentWorkflowStep]);

  // Calculate completed steps based on node data
  const completedSteps = useMemo(() => {
    const completed: number[] = [];
    
    // Problem input is completed if we have a validated problem node
    const problemNode = nodes.find(n => n.type === 'coreProblem' && n.data.validated);
    if (problemNode) completed.push(0);
    
    // Persona discovery is completed if we have personas
    const personaNodes = nodes.filter(n => n.type === 'persona');
    if (personaNodes.length > 0) completed.push(1);
    
    // Pain points completed if we have pain point nodes
    const painPointNodes = nodes.filter(n => n.type === 'painPoint');
    if (painPointNodes.length > 0) completed.push(2);
    
    // Solutions completed if we have solution nodes
    const solutionNodes = nodes.filter(n => n.type === 'solution');
    if (solutionNodes.length > 0) completed.push(3);
    
    // User stories completed if we have user story nodes
    const userStoryNodes = nodes.filter(n => n.type === 'userStory');
    if (userStoryNodes.length > 0) completed.push(4);
    
    // Architecture completed if we have document nodes
    const documentNodes = nodes.filter(n => n.type === 'document' && n.data.status === 'completed');
    if (documentNodes.length > 0) completed.push(5);
    
    return completed;
  }, [nodes]);

  // Get locked steps based on locked nodes
  const lockedSteps = useMemo(() => {
    const locked: number[] = [];
    
    // Check if any nodes of each type are locked
    const hasLockedProblem = nodes.some(n => n.type === 'coreProblem' && lockedNodes.has(n.id));
    if (hasLockedProblem) locked.push(0);
    
    const hasLockedPersona = nodes.some(n => n.type === 'persona' && lockedNodes.has(n.id));
    if (hasLockedPersona) locked.push(1);
    
    const hasLockedPainPoint = nodes.some(n => n.type === 'painPoint' && lockedNodes.has(n.id));
    if (hasLockedPainPoint) locked.push(2);
    
    const hasLockedSolution = nodes.some(n => n.type === 'solution' && lockedNodes.has(n.id));
    if (hasLockedSolution) locked.push(3);
    
    return locked;
  }, [nodes, lockedNodes]);

  // Extract personas
  const personas = useMemo(() => {
    return nodes
      .filter(n => n.type === 'persona')
      .map(n => ({
        id: n.id,
        name: String(n.data.name || 'Unknown'),
        role: String(n.data.role || 'Unknown Role'),
        pain_degree: Number(n.data.pain_degree || 5)
      }));
  }, [nodes]);

  // Count connections
  const connections = useMemo(() => {
    const painPointNodes = nodes.filter(n => n.type === 'painPoint');
    const solutionNodes = nodes.filter(n => n.type === 'solution');
    
    return {
      painPoints: painPointNodes.length,
      solutions: solutionNodes.length
    };
  }, [nodes]);

  // Calculate document progress
  const documentProgress = useMemo(() => {
    const documentNodes = nodes.filter(n => n.type === 'document');
    const completedDocs = documentNodes.filter(n => n.data.status === 'completed');
    
    return {
      current: completedDocs.length,
      total: Math.max(documentNodes.length, 7) // Assume 7 documents total for all steps
    };
  }, [nodes]);

  // Navigation handler
  const navigateToStep = useCallback((stepIndex: number) => {
    const stepNames: WorkflowStep[] = [
      'problem_input',
      'persona_discovery',
      'pain_points',
      'solution_generation',
      'user_stories',
      'architecture',
      'export'
    ];
    
    if (stepIndex >= 0 && stepIndex < stepNames.length) {
      const targetStep = stepNames[stepIndex];
      useWorkflowStore.getState().setCurrentStep(targetStep);
      
      // Could also focus on relevant nodes in the canvas
      // This would require implementing canvas navigation
    }
  }, []);

  return {
    currentStep,
    totalSteps: 7,
    completedSteps,
    lockedSteps,
    personas,
    connections,
    documentProgress,
    canNavigate: true,
    navigateToStep
  };
};