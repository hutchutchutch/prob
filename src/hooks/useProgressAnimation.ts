import { useEffect, useRef, useCallback } from 'react';

interface UseProgressAnimationOptions {
  duration?: number;
  easing?: string;
  fps?: number;
}

export const useProgressAnimation = (
  targetValue: number,
  options: UseProgressAnimationOptions = {}
) => {
  const {
    duration = 500,
    easing = 'ease-out',
    fps = 60
  } = options;

  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const startValueRef = useRef<number>(0);
  const currentValueRef = useRef<number>(0);

  // Easing functions
  const easingFunctions = {
    'linear': (t: number) => t,
    'ease-in': (t: number) => t * t,
    'ease-out': (t: number) => t * (2 - t),
    'ease-in-out': (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  };

  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    
    const easingFunction = easingFunctions[easing as keyof typeof easingFunctions] || easingFunctions['ease-out'];
    const easedProgress = easingFunction(progress);
    
    const currentValue = startValueRef.current + (targetValue - startValueRef.current) * easedProgress;
    currentValueRef.current = currentValue;

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [targetValue, duration, easing]);

  useEffect(() => {
    startValueRef.current = currentValueRef.current;
    startTimeRef.current = undefined;
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, animate]);

  return currentValueRef.current;
};

// Hook for smooth step transitions
export const useStepTransition = (currentStep: number, totalSteps: number) => {
  const previousStepRef = useRef(currentStep);
  const transitionRef = useRef<{
    from: number;
    to: number;
    startTime: number;
  } | null>(null);

  useEffect(() => {
    if (currentStep !== previousStepRef.current) {
      transitionRef.current = {
        from: previousStepRef.current,
        to: currentStep,
        startTime: Date.now()
      };
      previousStepRef.current = currentStep;
    }
  }, [currentStep]);

  const getTransitionState = useCallback(() => {
    if (!transitionRef.current) return null;

    const elapsed = Date.now() - transitionRef.current.startTime;
    const duration = 300; // ms

    if (elapsed >= duration) {
      transitionRef.current = null;
      return null;
    }

    const progress = elapsed / duration;
    return {
      from: transitionRef.current.from,
      to: transitionRef.current.to,
      progress,
      isTransitioning: true
    };
  }, []);

  return {
    getTransitionState,
    isTransitioning: transitionRef.current !== null
  };
};