import React, { useState, useEffect } from 'react';
import { NodeProps } from '@xyflow/react';
import { Lock, Unlock, Edit2, MoreVertical, Plus, X, FileText } from 'lucide-react';
import { cn } from '@/utils/cn';
import { BaseNode } from './BaseNode';
import { useCanvasStore } from '@/stores/canvasStore';

// User Story Node
export interface UserStoryNodeData {
  id: string;
  storyNumber: number;
  asA: string;
  iWant: string;
  soThat: string;
  acceptanceCriteria: string[];
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  storyPoints: number;
  connectedSolutions: string[];
  isLocked?: boolean;
  isSkeleton?: boolean;
  estimatedHours?: number;
  onToggleLock?: () => void;
  onUpdate?: (data: Partial<UserStoryNodeData>) => void;
}

export const UserStoryNode: React.FC<NodeProps> = ({ data, selected, id }) => {
  const nodeData = data as unknown as UserStoryNodeData;
  const { isLocked = false, isSkeleton = false, onToggleLock, onUpdate } = nodeData;
  const { updateNode } = useCanvasStore();
  
  // Local state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [draftData, setDraftData] = useState({
    asA: nodeData.asA || '',
    iWant: nodeData.iWant || '',
    soThat: nodeData.soThat || '',
    acceptanceCriteria: nodeData.acceptanceCriteria || []
  });
  const [newCriterion, setNewCriterion] = useState('');
  const [floatOffset, setFloatOffset] = useState({ x: 0, y: 0 });

  // Create ethereal floating effect for skeleton nodes
  useEffect(() => {
    if (!isSkeleton) return;

    // Random parameters for each node to create variety
    const baseAmplitude = 10 + Math.random() * 8; // 10-18 pixels (subtle for user stories)
    const xSpeed = 0.0002 + Math.random() * 0.0001; // Slower speed
    const ySpeed = 0.0003 + Math.random() * 0.0001;
    const phaseOffset = Math.random() * Math.PI * 2; // Random starting phase

    let animationFrame: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      
      // Create smooth sinusoidal movement
      const xOffset = Math.sin(elapsed * xSpeed + phaseOffset) * baseAmplitude;
      const yOffset = Math.sin(elapsed * ySpeed + phaseOffset + Math.PI/2) * baseAmplitude * 0.6;

      setFloatOffset({ x: xOffset, y: yOffset });
      
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isSkeleton]);

  // Auto-save draft changes
  useEffect(() => {
    if (!isEditing) return;
    
    const saveTimer = setTimeout(() => {
      // Auto-save logic here
      console.log('Auto-saving draft:', draftData);
    }, 2000);

    return () => clearTimeout(saveTimer);
  }, [draftData, isEditing]);

  const handleEdit = () => {
    if (!isLocked) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    onUpdate?.(draftData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraftData({
      asA: nodeData.asA || '',
      iWant: nodeData.iWant || '',
      soThat: nodeData.soThat || '',
      acceptanceCriteria: nodeData.acceptanceCriteria || []
    });
    setIsEditing(false);
  };

  const handleAddCriterion = () => {
    if (newCriterion.trim()) {
      setDraftData(prev => ({
        ...prev,
        acceptanceCriteria: [...prev.acceptanceCriteria, newCriterion.trim()]
      }));
      setNewCriterion('');
    }
  };

  const handleRemoveCriterion = (index: number) => {
    setDraftData(prev => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria.filter((_, i) => i !== index)
    }));
  };

  const priorityColors = {
    Low: 'bg-gray-600 text-gray-200',
    Medium: 'bg-yellow-600 text-yellow-100',
    High: 'bg-orange-600 text-orange-100',
    Critical: 'bg-red-600 text-red-100'
  };

  // Skeleton state with ethereal floating
  if (isSkeleton) {
    return (
      <div 
        style={{
          transform: `translate(${floatOffset.x}px, ${floatOffset.y}px)`,
          transition: 'none',
        }}
      >
        <BaseNode
          variant="solution"
          selected={selected}
          showSourceHandle={false}
          showTargetHandle={true}
          targetHandlePosition="left"
          className={cn(
            "w-[400px] h-[320px]",
            "opacity-70",
            "shadow-lg shadow-blue-500/20",
            "transition-shadow duration-1000"
          )}
        >
          <div className="space-y-4">
            {/* Skeleton Header */}
            <div className="flex items-center justify-between h-12 border-b border-blue-500/20 pb-3">
              <div className="h-6 rounded skeleton-shimmer w-24"></div>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded skeleton-shimmer"></div>
                <div className="w-8 h-8 rounded skeleton-shimmer"></div>
              </div>
            </div>

            {/* Skeleton Story Template */}
            <div className="bg-white/5 rounded-lg p-4 space-y-3">
              <div className="h-4 rounded skeleton-shimmer w-3/4"></div>
              <div className="h-4 rounded skeleton-shimmer w-full"></div>
              <div className="h-4 rounded skeleton-shimmer w-5/6"></div>
            </div>

            {/* Skeleton Acceptance Criteria */}
            <div className="space-y-2">
              <div className="h-4 rounded skeleton-shimmer w-32"></div>
              <div className="h-3 rounded skeleton-shimmer w-full"></div>
              <div className="h-3 rounded skeleton-shimmer w-4/5"></div>
            </div>

            {/* Skeleton Footer */}
            <div className="flex items-center gap-3 pt-2 border-t border-blue-500/20">
              <div className="h-5 rounded skeleton-shimmer w-20"></div>
              <div className="h-5 rounded skeleton-shimmer w-16"></div>
              <div className="h-5 rounded skeleton-shimmer w-16"></div>
            </div>
          </div>
        </BaseNode>
      </div>
    );
  }

  return (
    <BaseNode
      variant="solution"
      selected={selected}
      showSourceHandle={false}
      showTargetHandle={true}
      targetHandlePosition="left"
      className={cn(
        "w-[400px] min-h-[320px]",
        isEditing && "ring-2 ring-white",
        isLocked && "border-2 border-yellow-400"
      )}
    >
      <div className="space-y-4">
        {/* Header Section */}
        <div className="flex items-center justify-between h-12 border-b border-blue-500/20 pb-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            Story #{nodeData.storyNumber}
          </h3>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEdit}
                  disabled={isLocked}
                  className={cn(
                    "p-1.5 rounded transition-colors",
                    isLocked ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600/20"
                  )}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLock?.();
                  }}
                  className="p-1.5 hover:bg-blue-600/20 rounded transition-colors"
                >
                  {isLocked ? (
                    <Lock className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <Unlock className="w-4 h-4 opacity-60" />
                  )}
                </button>
                <button className="p-1.5 hover:bg-blue-600/20 rounded transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Story Template Section */}
        <div className="bg-white/10 rounded-lg p-4 space-y-3">
          <div className="space-y-2">
            <label className="text-xs text-gray-300">As a:</label>
            {isEditing ? (
              <input
                type="text"
                value={draftData.asA}
                onChange={(e) => setDraftData(prev => ({ ...prev, asA: e.target.value }))}
                className="w-full bg-blue-900/50 border border-blue-500/30 rounded px-3 py-1 text-sm text-white focus:border-blue-400 focus:outline-none"
                placeholder="User role..."
              />
            ) : (
              <p className="text-sm text-white">{nodeData.asA || 'User role'}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-300">I want:</label>
            {isEditing ? (
              <textarea
                value={draftData.iWant}
                onChange={(e) => setDraftData(prev => ({ ...prev, iWant: e.target.value }))}
                className="w-full bg-blue-900/50 border border-blue-500/30 rounded px-3 py-1 text-sm text-white focus:border-blue-400 focus:outline-none resize-none"
                rows={2}
                placeholder="Feature or functionality..."
              />
            ) : (
              <p className="text-sm text-white">{nodeData.iWant || 'Feature description'}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-300">So that:</label>
            {isEditing ? (
              <textarea
                value={draftData.soThat}
                onChange={(e) => setDraftData(prev => ({ ...prev, soThat: e.target.value }))}
                className="w-full bg-blue-900/50 border border-blue-500/30 rounded px-3 py-1 text-sm text-white focus:border-blue-400 focus:outline-none resize-none"
                rows={2}
                placeholder="Business value..."
              />
            ) : (
              <p className="text-sm text-white">{nodeData.soThat || 'Business value'}</p>
            )}
          </div>
        </div>

        {/* Acceptance Criteria Section */}
        <div className="space-y-2 max-h-[100px] overflow-y-auto">
          <h4 className="text-xs font-medium text-gray-300 uppercase tracking-wide">
            Acceptance Criteria:
          </h4>
          <ul className="space-y-1">
            {(isEditing ? draftData.acceptanceCriteria : nodeData.acceptanceCriteria).map((criterion, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-blue-400 mt-0.5">•</span>
                <span className="flex-1 text-white">{criterion}</span>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveCriterion(index)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </li>
            ))}
          </ul>
          {isEditing && (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={newCriterion}
                onChange={(e) => setNewCriterion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCriterion();
                  }
                }}
                className="flex-1 bg-blue-900/50 border border-blue-500/30 rounded px-2 py-1 text-xs text-white focus:border-blue-400 focus:outline-none"
                placeholder="New criterion..."
              />
              <button
                onClick={handleAddCriterion}
                className="text-blue-300 hover:text-blue-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Metadata Footer */}
        <div className="flex items-center gap-3 text-xs pt-2 border-t border-blue-500/20">
          <span className={cn(
            "px-2 py-1 rounded font-medium",
            priorityColors[nodeData.priority]
          )}>
            {nodeData.priority}
          </span>
          <span className="text-gray-300">
            Points: <span className="text-white font-medium">{nodeData.storyPoints}</span>
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-300">
            {nodeData.connectedSolutions.length} sols
          </span>
          {nodeData.estimatedHours && (
            <>
              <span className="text-gray-300">|</span>
              <span className="text-gray-300">
                {nodeData.estimatedHours}h
              </span>
            </>
          )}
        </div>
      </div>
    </BaseNode>
  );
};

export default UserStoryNode;