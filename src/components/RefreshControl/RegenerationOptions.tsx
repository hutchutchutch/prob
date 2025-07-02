import React from 'react';
import { motion } from 'framer-motion';
import { Users, Zap, Lightbulb, FileText, File, Lock } from 'lucide-react';

interface RegenerationOptionsProps {
  options: {
    personas: boolean;
    painPoints: boolean;
    solutions: boolean;
    userStories: boolean;
    documents: boolean;
  };
  onChange: (options: any) => void;
  lockedCounts: {
    personas: number;
    painPoints: number;
    solutions: number;
    userStories: number;
    documents: number;
  };
  disabled?: boolean;
}

const optionConfig = [
  {
    key: 'personas',
    label: 'Personas',
    icon: Users,
    description: 'Regenerate user personas',
    color: 'var(--color-node-persona)',
  },
  {
    key: 'painPoints',
    label: 'Pain Points',
    icon: Zap,
    description: 'Regenerate pain points',
    color: 'var(--color-node-pain)',
  },
  {
    key: 'solutions',
    label: 'Solutions',
    icon: Lightbulb,
    description: 'Regenerate solution ideas',
    color: 'var(--color-node-solution)',
  },
  {
    key: 'userStories',
    label: 'User Stories',
    icon: FileText,
    description: 'Regenerate user stories',
    color: '#8B5CF6',
  },
  {
    key: 'documents',
    label: 'Documents',
    icon: File,
    description: 'Regenerate all documents',
    color: '#6B7280',
  },
];

const RegenerationOptions: React.FC<RegenerationOptionsProps> = ({
  options,
  onChange,
  lockedCounts,
  disabled = false,
}) => {
  const handleToggle = (key: string) => {
    if (!disabled) {
      onChange({ ...options, [key]: !options[key as keyof typeof options] });
    }
  };
  
  return (
    <div className="regeneration-options">
      {optionConfig.map((config, index) => {
        const Icon = config.icon;
        const isChecked = options[config.key as keyof typeof options];
        const lockedCount = lockedCounts[config.key as keyof typeof lockedCounts];
        
        return (
          <motion.div
            key={config.key}
            className={`regeneration-option ${isChecked ? 'regeneration-option--selected' : ''}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleToggle(config.key)}
          >
            <label className="regeneration-option-label">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleToggle(config.key)}
                disabled={disabled}
                className="regeneration-option-checkbox"
              />
              
              <div className="regeneration-option-content">
                <div className="regeneration-option-header">
                  <div
                    className="regeneration-option-icon"
                    style={{ backgroundColor: `${config.color}20`, color: config.color }}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="regeneration-option-text">
                    <h4>{config.label}</h4>
                    <p>{config.description}</p>
                  </div>
                </div>
                
                {lockedCount > 0 && (
                  <div className="regeneration-option-locked">
                    <Lock size={12} />
                    <span>{lockedCount} locked</span>
                  </div>
                )}
              </div>
              
              <motion.div
                className="regeneration-option-check"
                initial={false}
                animate={{
                  scale: isChecked ? 1 : 0,
                  opacity: isChecked ? 1 : 0,
                }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                ✓
              </motion.div>
            </label>
          </motion.div>
        );
      })}
    </div>
  );
};

export default RegenerationOptions;