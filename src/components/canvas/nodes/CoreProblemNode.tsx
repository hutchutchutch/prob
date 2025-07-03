import React, { useState, useEffect } from 'react';
import { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { useWorkflowStore } from '@/stores/workflowStore';
import { useCanvasStore } from '@/stores/canvasStore';
import { problemApi } from '@/services/api/problem';
import { Sparkles, Loader2, CheckCircle } from 'lucide-react';

// Core Problem Node
export interface CoreProblemNodeData {
  id: string;
  problem?: string;
  status?: 'valid' | 'invalid' | 'editing';
  isDemo?: boolean;
}

export const CoreProblemNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as CoreProblemNodeData;
  const [problemText, setProblemText] = useState(nodeData.problem || '');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(!nodeData.problem);
  const [showGoldFlash, setShowGoldFlash] = useState(false);
  
  const { setProblemInput, proceedToNextStep, coreProblem } = useWorkflowStore();
  
  // Derive isValidated from coreProblem state
  const isValidated = coreProblem?.is_validated === true;

  // Update local state when node data changes
  useEffect(() => {
    if (nodeData.problem && nodeData.problem !== problemText) {
      setProblemText(nodeData.problem);
      setIsEditing(false);
    }
  }, [nodeData.problem]);

  // Auto-focus when in editing mode
  useEffect(() => {
    if (isEditing && !nodeData.isDemo) {
      const textarea = document.querySelector('.problem-textarea') as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
      }
    }
  }, [isEditing, nodeData.isDemo]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setProblemText(newText);
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleSubmit = async () => {
    const trimmedText = problemText.trim();
    if (!trimmedText) return;
    
    console.log('[CoreProblemNode] Starting validation and persona generation for:', trimmedText);
    
    setIsValidating(true);
    setValidationError(null);
    
    try {
      setProblemInput(trimmedText);
      
      console.log('[CoreProblemNode] Calling both problemApi.validateProblem and generatePersonas in parallel...');
      console.log('[CoreProblemNode] Input text:', trimmedText);
      
      // Animate edges when validation starts
      const canvasStore = useCanvasStore.getState();
      for (let i = 1; i <= 5; i++) {
        canvasStore.updateEdge(`problem-to-persona-${i}`, {
          animated: true
        });
      }
      console.log('[CoreProblemNode] Started edge animations during validation');
      
      // Set up core problem data first for persona generation
      const workflowStore = useWorkflowStore.getState();
      const projectId = workflowStore.projectId || crypto.randomUUID();
      const coreProblemId = crypto.randomUUID();
      
      const coreProblem = {
        id: coreProblemId,
        project_id: projectId,
        description: trimmedText,
        is_validated: false, // Will be updated if validation succeeds
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Update store state immediately so persona generation can access it
      useWorkflowStore.setState({ 
        projectId,
        coreProblem,
        problemInput: trimmedText
      });
      
      console.log('[CoreProblemNode] Set preliminary coreProblem for persona generation:', coreProblem);
      
      // Run validation and persona generation in parallel
      const [validationResult, personaGenerationResult] = await Promise.allSettled([
        problemApi.validateProblem(trimmedText),
        workflowStore.generatePersonas()
      ]);
      
      console.log('[CoreProblemNode] Validation result:', validationResult);
      console.log('[CoreProblemNode] Persona generation result:', personaGenerationResult);
      
      // Process validation result
      if (validationResult.status === 'fulfilled' && validationResult.value.isValid) {
        console.log('[CoreProblemNode] Problem is valid, triggering UI updates');
        
        // 1. Trigger gold flash animation
        setShowGoldFlash(true);
        setTimeout(() => setShowGoldFlash(false), 800);
        
        // 2. Update the core problem as validated
        const updatedCoreProblem = {
          ...coreProblem,
          id: (validationResult.value as any).coreProblemId || coreProblem.id,
          is_validated: true,
        };
        
        useWorkflowStore.setState({ 
          coreProblem: updatedCoreProblem
        });
        
        console.log('[CoreProblemNode] Updated coreProblem as validated:', updatedCoreProblem);
        
        // 3. Close editing mode
        setIsEditing(false);
        
        // 4. Proceed to next step immediately
        console.log('[CoreProblemNode] Proceeding to next step');
        proceedToNextStep();
        
      } else {
        console.log('[CoreProblemNode] Problem validation failed');
        if (validationResult.status === 'fulfilled') {
          setValidationError(validationResult.value.feedback || 'Invalid problem statement');
        } else {
          setValidationError('Validation failed with an error');
        }
      }
      
      // Handle persona generation result
      if (personaGenerationResult.status === 'rejected') {
        console.warn('[CoreProblemNode] Persona generation failed:', personaGenerationResult.reason);
      } else {
        console.log('[CoreProblemNode] Persona generation completed successfully');
      }
      
    } catch (error) {
      console.error('[CoreProblemNode] Error in handleSubmit:', error);
      setValidationError(error instanceof Error ? error.message : 'Failed to process problem');
    } finally {
      setIsValidating(false);
    }
  };

  const handleEdit = () => {
    if (!isValidating) {
      setIsEditing(true);
      setValidationError(null);
    }
  };

  // Demo mode - just show static content
  if (nodeData.isDemo) {
    return (
      <BaseNode
        variant="problem"
        selected={selected}
        showTargetHandle={false}
        showSourceHandle={false}
        className="min-w-[320px] max-w-[400px]"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Core Problem
            </h3>
          </div>
          <p className="text-base leading-relaxed opacity-50">
            {nodeData.problem || 'Your problem will appear here'}
          </p>
        </div>
      </BaseNode>
    );
  }

  return (
    <BaseNode
      variant="problem"
      selected={selected}
      showTargetHandle={false}
      showSourceHandle={true}
      className={`min-w-[400px] max-w-[500px] ${showGoldFlash ? 'animate-gold-flash' : ''} ${isValidated ? 'border-accent-500 border-2' : ''}`}
    >
      <div className="problem-input-container">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
            Core Problem
          </h3>
          {coreProblem?.is_validated && !isEditing && (
            <CheckCircle className="w-4 h-4 text-gold-500 ml-auto" />
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <textarea
              id="core-problem-input"
              name="problemDescription"
              value={problemText}
              onChange={handleTextChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleSubmit();
                }
                // Prevent node dragging when typing
                e.stopPropagation();
              }}
              placeholder="Describe your problem in detail..."
              className="problem-textarea"
              disabled={isValidating}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            
            {validationError && (
              <div className="p-2 bg-gray-800/50 border border-gray-600 rounded text-gray-300 text-xs">
                {validationError}
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+Enter to submit
              </span>
              
              <button
                onClick={handleSubmit}
                disabled={!problemText.trim() || isValidating}
                className="btn-gold"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Validating...
                  </>
                ) : (
                  'Analyze Problem'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p 
              className="text-base leading-relaxed cursor-pointer"
              onClick={handleEdit}
            >
              {problemText || 'Click to enter your problem description...'}
            </p>
            {problemText && (
              <button
                onClick={handleEdit}
                className="text-xs text-gray-400"
              >
                Click to edit
              </button>
            )}
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default CoreProblemNode; 