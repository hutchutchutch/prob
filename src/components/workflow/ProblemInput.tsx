import { useState } from 'react';
import { useWorkflowStore } from '@/stores/workflowStore';
import { problemApi } from '@/services/api/problem';
import { Sparkles, Loader2 } from 'lucide-react';

export function ProblemInput() {
  const [problemText, setProblemText] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { setProblemInput, proceedToNextStep } = useWorkflowStore();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Allow all characters including apostrophes, quotes, etc.
    const newText = e.target.value;
    setProblemText(newText);
    // Clear any validation errors when user types
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleSubmit = async () => {
    const trimmedText = problemText.trim();
    if (!trimmedText) return;
    
    console.log('[ProblemInput] Starting validation for:', trimmedText);
    console.log('[ProblemInput] Text contains apostrophe:', trimmedText.includes("'"));
    console.log('[ProblemInput] Character codes:', [...trimmedText].map(c => `${c}: ${c.charCodeAt(0)}`));
    
    setIsValidating(true);
    setValidationError(null);
    
    try {
      // First set the problem input in the store
      setProblemInput(trimmedText);
      
      // Call the validation API - no sanitization, send as-is
      console.log('[ProblemInput] Calling problemApi.validateProblem...');
      const validationResult = await problemApi.validateProblem(trimmedText);
      console.log('[ProblemInput] Full validation result:', JSON.stringify(validationResult, null, 2));
      
      if (validationResult.isValid) {
        console.log('[ProblemInput] Problem is valid, proceeding to next step');
        // Update the store with validation result
        const workflowStore = useWorkflowStore.getState();
        await workflowStore.validateProblem(trimmedText);
        
        // Proceed to next step
        proceedToNextStep();
      } else {
        console.log('[ProblemInput] Problem is invalid:', validationResult.feedback);
        setValidationError(validationResult.feedback || 'Invalid problem statement');
      }
    } catch (error) {
      console.error('[ProblemInput] Validation error:', error);
      console.error('[ProblemInput] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown',
        stack: error instanceof Error ? error.stack : 'No stack',
        error
      });
      setValidationError(error instanceof Error ? error.message : 'Failed to validate problem');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-gray-900">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl shadow-2xl max-w-2xl w-full mx-8 border border-gray-700">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h2 className="text-2xl font-semibold text-white">
            What problem are you trying to solve?
          </h2>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <textarea
            value={problemText}
            onChange={handleTextChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Describe your problem in detail..."
            className="w-full h-32 p-4 bg-gray-900/50 text-white rounded-lg border-2 border-gray-700 focus:border-blue-500 focus:outline-none resize-none transition-all duration-300 placeholder-gray-500"
            disabled={isValidating}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </form>
        
        {validationError && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400">
            {validationError}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">
            Press {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+Enter to submit
          </span>
          
          <button
            onClick={handleSubmit}
            disabled={!problemText.trim() || isValidating}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
          >
            {isValidating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Validating...
              </>
            ) : (
              'Analyze Problem'
            )}
          </button>
        </div>
        
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 bg-gray-800 rounded text-xs text-gray-500 font-mono overflow-auto">
            <div>Debug: Text length: {problemText.length}</div>
            <div>Debug: Validating: {isValidating ? 'Yes' : 'No'}</div>
            {validationError && <div className="text-red-400">Debug: Error: {validationError}</div>}
            <div className="break-all">Debug: Input: "{problemText}"</div>
          </div>
        )}
      </div>
    </div>
  );
}