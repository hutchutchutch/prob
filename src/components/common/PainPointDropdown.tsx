import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, AlertTriangle, ArrowLeft } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useWorkflowStore } from '@/stores/workflowStore';

interface PainPointDropdownProps {
  onPainPointSelect?: (painPointId: string) => void;
  onGoToProblem?: () => void;
  className?: string;
}

export const PainPointDropdown: React.FC<PainPointDropdownProps> = ({
  onPainPointSelect,
  onGoToProblem,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { painPoints, coreProblem } = useWorkflowStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePainPointClick = (painPointId: string) => {
    onPainPointSelect?.(painPointId);
    setIsOpen(false);
  };

  const handleGoToProblem = () => {
    onGoToProblem?.();
    setIsOpen(false);
  };

  // Show "Enter Problem" CTA if no core problem exists
  if (!coreProblem) {
    return (
      <div ref={dropdownRef} className={cn("relative", className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Pain Points</span>
          <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
            <div className="p-4">
              <div className="text-center">
                <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <p className="text-gray-300 text-sm mb-4">
                  No problem defined yet. Please enter your core problem first.
                </p>
                <button
                  onClick={handleGoToProblem}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Enter Problem
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show "No Pain Points" CTA if core problem exists but no pain points
  if (painPoints.length === 0) {
    return (
      <div ref={dropdownRef} className={cn("relative", className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Pain Points</span>
          <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
            <div className="p-4">
              <div className="text-center">
                <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <p className="text-gray-300 text-sm mb-4">
                  No pain points generated yet. Generate personas first to create pain points.
                </p>
                <button
                  onClick={handleGoToProblem}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Go to Problem
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show pain points dropdown
  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
      >
        <AlertTriangle className="w-4 h-4" />
        <span>Pain Points ({painPoints.length})</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-400 px-3 py-2 border-b border-gray-700">
              Select a pain point to focus on:
            </div>
            {painPoints.map((painPoint, index) => (
              <button
                key={painPoint.id}
                onClick={() => handlePainPointClick(painPoint.id)}
                className="w-full text-left p-3 hover:bg-gray-700 rounded-lg transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-2",
                      painPoint.severity === 1 ? "bg-red-500" :
                      painPoint.severity === 2 ? "bg-orange-500" :
                      painPoint.severity === 3 ? "bg-yellow-500" :
                      "bg-gray-500"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white">
                        Pain Point {index + 1}
                      </span>
                      <span className={cn(
                        "px-1.5 py-0.5 text-xs rounded",
                        painPoint.severity === 1 ? "bg-red-900/50 text-red-300" :
                        painPoint.severity === 2 ? "bg-orange-900/50 text-orange-300" :
                        painPoint.severity === 3 ? "bg-yellow-900/50 text-yellow-300" :
                        "bg-gray-900/50 text-gray-300"
                      )}>
                        {painPoint.severity === 1 ? "Critical" :
                         painPoint.severity === 2 ? "High" :
                         painPoint.severity === 3 ? "Medium" : "Low"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2 group-hover:text-white transition-colors">
                      {painPoint.description}
                    </p>
                    {painPoint.impact && (
                      <p className="text-xs text-gray-500 mt-1">
                        Impact: {painPoint.impact}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PainPointDropdown; 