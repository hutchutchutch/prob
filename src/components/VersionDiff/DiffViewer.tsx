import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Edit3 } from 'lucide-react';

interface DiffViewerProps {
  baseData: any;
  targetData: any;
  type: 'nodes' | 'edges' | 'metadata';
}

interface DiffItem {
  type: 'added' | 'removed' | 'modified' | 'unchanged';
  id: string;
  label: string;
  details?: string;
  changes?: string[];
}

const DiffViewer: React.FC<DiffViewerProps> = ({ baseData, targetData, type }) => {
  const computeDiff = (): DiffItem[] => {
    const diffs: DiffItem[] = [];
    
    if (type === 'nodes' || type === 'edges') {
      const baseMap = new Map(
        (baseData || []).map((item: any) => [item.id, item])
      );
      const targetMap = new Map(
        (targetData || []).map((item: any) => [item.id, item])
      );
      
      // Find removed items
      baseMap.forEach((item, id) => {
        if (!targetMap.has(id)) {
          diffs.push({
            type: 'removed',
            id,
            label: item.data?.label || item.id,
            details: type === 'nodes' ? item.type : `${item.source} → ${item.target}`,
          });
        }
      });
      
      // Find added and modified items
      targetMap.forEach((item, id) => {
        const baseItem = baseMap.get(id);
        if (!baseItem) {
          diffs.push({
            type: 'added',
            id,
            label: item.data?.label || item.id,
            details: type === 'nodes' ? item.type : `${item.source} → ${item.target}`,
          });
        } else {
          // Check for modifications
          const changes = detectChanges(baseItem, item);
          if (changes.length > 0) {
            diffs.push({
              type: 'modified',
              id,
              label: item.data?.label || item.id,
              details: type === 'nodes' ? item.type : `${item.source} → ${item.target}`,
              changes,
            });
          }
        }
      });
    } else {
      // Metadata comparison
      const changes = detectChanges(baseData, targetData);
      if (changes.length > 0) {
        diffs.push({
          type: 'modified',
          id: 'metadata',
          label: 'Event Metadata',
          changes,
        });
      }
    }
    
    return diffs.sort((a, b) => {
      const order = { removed: 0, modified: 1, added: 2, unchanged: 3 };
      return order[a.type] - order[b.type];
    });
  };
  
  const detectChanges = (obj1: any, obj2: any): string[] => {
    const changes: string[] = [];
    
    // Simple deep comparison for demonstration
    const keys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);
    
    keys.forEach(key => {
      if (JSON.stringify(obj1?.[key]) !== JSON.stringify(obj2?.[key])) {
        if (key === 'position' && obj1?.position && obj2?.position) {
          const dx = Math.round(obj2.position.x - obj1.position.x);
          const dy = Math.round(obj2.position.y - obj1.position.y);
          if (dx !== 0 || dy !== 0) {
            changes.push(`Position moved (${dx}, ${dy})`);
          }
        } else if (key === 'data' && obj1?.data && obj2?.data) {
          // Compare nested data
          const dataChanges = detectChanges(obj1.data, obj2.data);
          dataChanges.forEach(change => changes.push(`data.${change}`));
        } else {
          changes.push(`${key}: ${obj1?.[key]} → ${obj2?.[key]}`);
        }
      }
    });
    
    return changes;
  };
  
  const diffs = computeDiff();
  
  const getDiffIcon = (diffType: DiffItem['type']) => {
    switch (diffType) {
      case 'added':
        return <Plus className="diff-icon diff-icon--added" />;
      case 'removed':
        return <Minus className="diff-icon diff-icon--removed" />;
      case 'modified':
        return <Edit3 className="diff-icon diff-icon--modified" />;
      default:
        return null;
    }
  };
  
  return (
    <motion.div
      className="diff-viewer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {diffs.length === 0 ? (
        <div className="diff-empty">
          <p>No changes detected between versions</p>
        </div>
      ) : (
        <div className="diff-list">
          {diffs.map((diff, index) => (
            <motion.div
              key={diff.id}
              className={`diff-item diff-item--${diff.type}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="diff-item-header">
                {getDiffIcon(diff.type)}
                <span className="diff-item-label">{diff.label}</span>
                {diff.details && (
                  <span className="diff-item-details">{diff.details}</span>
                )}
              </div>
              {diff.changes && diff.changes.length > 0 && (
                <div className="diff-item-changes">
                  {diff.changes.map((change, i) => (
                    <div key={i} className="diff-change">
                      {change}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default DiffViewer;