import React from 'react';
import { cn } from '@/utils/cn';

export interface Persona {
  id: string;
  name: string;
  avatar?: string;
}

interface PersonaCirclesProps {
  personas: Persona[];
  maxVisible?: number;
  className?: string;
}

export const PersonaCircles: React.FC<PersonaCirclesProps> = ({
  personas,
  maxVisible = 3,
  className = '',
}) => {
  const visiblePersonas = personas.slice(0, maxVisible);
  const remainingCount = personas.length - maxVisible;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visiblePersonas.map((persona, index) => (
        <div
          key={persona.id}
          className={cn(
            'relative w-10 h-10 rounded-full ring-2 ring-gray-800',
            'transition-transform duration-fast hover:z-10 hover:scale-110'
          )}
          style={{ zIndex: visiblePersonas.length - index }}
          title={persona.name}
        >
          {persona.avatar ? (
            <img 
              src={persona.avatar} 
              alt={persona.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {persona.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
          )}
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div 
          className="relative w-10 h-10 rounded-full bg-gray-700 ring-2 ring-gray-800 flex items-center justify-center"
          style={{ zIndex: 0 }}
        >
          <span className="text-sm font-medium text-gray-300">
            +{remainingCount}
          </span>
        </div>
      )}
    </div>
  );
};