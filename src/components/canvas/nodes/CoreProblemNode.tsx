import React, { useState, useEffect } from 'react';
import { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { useWorkflowStore } from '@/stores/workflowStore';
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
    
    console.log('[CoreProblemNode] Starting validation for:', trimmedText);
    
    setIsValidating(true);
    setValidationError(null);
    
    try {
      setProblemInput(trimmedText);
      
      console.log('[CoreProblemNode] Calling problemApi.validateProblem...');
      console.log('[CoreProblemNode] Input text:', trimmedText);
      const validationResult = await problemApi.validateProblem(trimmedText);
      console.log('[CoreProblemNode] Validation result:', validationResult);
      
      if (validationResult.isValid) {
        console.log('[CoreProblemNode] Problem is valid, triggering all actions');
        
        // 1. Trigger gold flash animation
        setShowGoldFlash(true);
        setTimeout(() => setShowGoldFlash(false), 800);
        
        // 2. Set validated problem in store
        const workflowStore = useWorkflowStore.getState();
        const projectId = workflowStore.projectId || crypto.randomUUID();
        
        // Get the coreProblemId from the validation response
        const coreProblemId = (validationResult as any).coreProblemId || crypto.randomUUID();
        console.log('[CoreProblemNode] Using coreProblemId from validation:', coreProblemId);
        
        const coreProblem = {
          id: coreProblemId,  // Use the ID from validation response
          project_id: projectId,
          description: trimmedText,
          is_validated: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        // Update store state immediately
        useWorkflowStore.setState({ 
          projectId,
          coreProblem,
          problemInput: trimmedText
        });
        
        console.log('[CoreProblemNode] Set coreProblem:', coreProblem);
        
        // 3. Close editing mode
        setIsEditing(false);
        
        // 4. Proceed to next step immediately
        console.log('[CoreProblemNode] Proceeding to next step');
        proceedToNextStep();
        
        // 5. Generate personas immediately
        console.log('[CoreProblemNode] Triggering persona generation');
        workflowStore.generatePersonas();
      } else {
        console.log('[CoreProblemNode] Problem is invalid:', validationResult.feedback);
        setValidationError(validationResult.feedback || 'Invalid problem statement');
      }
    } catch (error) {
      console.error('[CoreProblemNode] Validation error:', error);
      setValidationError(error instanceof Error ? error.message : 'Failed to validate problem');
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
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
            Core Problem
          </h3>
          {coreProblem?.is_validated && !isEditing && (
            <CheckCircle className="w-4 h-4 text-blue-400 ml-auto" />
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
              className="text-base leading-relaxed cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleEdit}
            >
              {problemText || 'Click to enter your problem description...'}
            </p>
            {problemText && (
              <button
                onClick={handleEdit}
                className="text-xs text-gray-400 hover:text-gray-300 transition-colors"
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