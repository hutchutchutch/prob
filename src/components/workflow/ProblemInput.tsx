import { useState } from 'react';
import { useWorkflowStore } from '@/stores/workflowStore';
import { Sparkles } from 'lucide-react';

export function ProblemInput() {
  const [problemText, setProblemText] = useState('');
  const { setProblemInput, proceedToNextStep } = useWorkflowStore();

  const handleSubmit = () => {
    if (!problemText.trim()) return;
    
    setProblemInput(problemText);
    // For now, just proceed to next step
    // In a real app, this would validate the problem first
    proceedToNextStep();
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
        
        <textarea
          value={problemText}
          onChange={(e) => setProblemText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Describe your problem in detail..."
          className="w-full h-32 p-4 bg-gray-900/50 text-white rounded-lg border-2 border-gray-700 focus:border-blue-500 focus:outline-none resize-none transition-all duration-300 placeholder-gray-500"
        />
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">
            Press {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+Enter to submit
          </span>
          
          <button
            onClick={handleSubmit}
            disabled={!problemText.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Analyze Problem
          </button>
        </div>
      </div>
    </div>
  );
}