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
  
  const { setProblemInput, proceedToNextStep, coreProblem } = useWorkflowStore();

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
      const textarea = document.querySelector('.problem-input-textarea') as HTMLTextAreaElement;
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
        console.log('[CoreProblemNode] Problem is valid, proceeding to next step');
        const workflowStore = useWorkflowStore.getState();
        await workflowStore.validateProblem(trimmedText);
        
        setIsEditing(false);
        proceedToNextStep();
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
      className="min-w-[400px] max-w-[500px]"
    >
      <div className="space-y-3">
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
              className="problem-input-textarea w-full h-24 p-3 bg-gray-800/80 text-white rounded-lg border border-gray-600 focus:border-gray-400 focus:outline-none resize-none transition-all duration-300 placeholder-gray-500 text-sm"
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
                className="px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 text-sm"
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