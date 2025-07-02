import React, { useCallback } from 'react';
import { cn } from '../../utils/cn';
import { useWorkflowStore } from '../../stores/workflowStore';

export interface Persona {
  id: string;
  name: string;
  role: string;
  pain_degree: number;
  avatar?: string;
}

interface PersonaCirclesProps {
  personas: Persona[];
  maxVisible?: number;
  onPersonaClick?: (personaId: string) => void;
  activePersonaId?: string;
  className?: string;
}

export const PersonaCircles: React.FC<PersonaCirclesProps> = ({
  personas,
  maxVisible = 3,
  onPersonaClick,
  activePersonaId,
  className = ''
}) => {
  const visiblePersonas = personas.slice(0, maxVisible);
  const remainingCount = personas.length - maxVisible;

  const handlePersonaClick = useCallback((personaId: string) => {
    if (onPersonaClick) {
      onPersonaClick(personaId);
    }
    // Could also trigger canvas navigation here
    const canvasStore = useWorkflowStore.getState();
    // Navigate to persona node in canvas
    // This would require implementing a method to focus on a specific node
  }, [onPersonaClick]);

  const getPersonaColor = (painDegree: number): string => {
    if (painDegree >= 8) return 'from-red-500 to-red-600';
    if (painDegree >= 5) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  const getPersonaInitials = (name: string): string => {
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn('persona-circles-container persona-circles-container--show', className)}>
      {visiblePersonas.map((persona, index) => (
        <button
          key={persona.id}
          className={cn(
            'persona-circle',
            persona.pain_degree >= 8 && 'persona-circle--high',
            persona.pain_degree >= 5 && persona.pain_degree < 8 && 'persona-circle--medium',
            persona.pain_degree < 5 && 'persona-circle--low',
            activePersonaId === persona.id && 'persona-circle--active'
          )}
          style={{ zIndex: visiblePersonas.length - index }}
          title={`${persona.name} - ${persona.role}\nPain Level: ${persona.pain_degree}/10`}
          onClick={() => handlePersonaClick(persona.id)}
        >
          {persona.avatar ? (
            <img 
              src={persona.avatar} 
              alt={persona.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getPersonaInitials(persona.name)
          )}
        </button>
      ))}
      
      {remainingCount > 0 && (
        <div 
          className="persona-circle"
          style={{ 
            zIndex: 0,
            background: 'var(--color-gray-600)'
          }}
          title={`${remainingCount} more personas`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};