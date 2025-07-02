export interface AnimationStep {
  id: string;
  duration: number; // in milliseconds
  action: () => void;
  description: string;
}

export interface AnimationPhase {
  name: string;
  steps: AnimationStep[];
  totalDuration: number;
}

export const ANIMATION_TIMINGS = {
  // Phase durations
  TYPING_PROBLEM: 3000,
  VALIDATION_FLASH: 2000,
  PERSONAS_APPEAR: 3000,
  CANVAS_SLIDE: 4000,
  SOLUTIONS_EMERGE: 4000,
  STORIES_MATERIALIZE: 3000,
  DOCUMENTS_GENERATE: 5000,
  FADE_AND_RESET: 2000,
  
  // Individual timings
  TYPING_SPEED: 50, // ms per character
  GOLD_FLASH_DURATION: 600, // ms per flash
  GOLD_FLASH_COUNT: 3,
  PERSONA_STAGGER: 150,
  EDGE_DRAW_DURATION: 300,
  NODE_FADE_IN: 300,
  BREATHING_DURATION: 2000,
  PARTICLE_LIFETIME: 1500,
  SHIMMER_DURATION: 1500,
  CAMERA_TRANSITION: 800,
};

export const TOTAL_LOOP_DURATION = 28000; // 28 seconds (excluding fade)

export class AnimationSequence {
  private phases: AnimationPhase[] = [];
  private currentPhaseIndex = 0;
  private currentStepIndex = 0;
  private isRunning = false;
  private isPaused = false;
  private loopCount = 0;
  
  constructor() {
    this.initializePhases();
  }
  
  private initializePhases() {
    this.phases = [
      {
        name: 'Problem Input',
        steps: [],
        totalDuration: ANIMATION_TIMINGS.TYPING_PROBLEM,
      },
      {
        name: 'Validation',
        steps: [],
        totalDuration: ANIMATION_TIMINGS.VALIDATION_FLASH,
      },
      {
        name: 'Personas',
        steps: [],
        totalDuration: ANIMATION_TIMINGS.PERSONAS_APPEAR,
      },
      {
        name: 'Pain Points',
        steps: [],
        totalDuration: ANIMATION_TIMINGS.CANVAS_SLIDE,
      },
      {
        name: 'Solutions',
        steps: [],
        totalDuration: ANIMATION_TIMINGS.SOLUTIONS_EMERGE,
      },
      {
        name: 'User Stories',
        steps: [],
        totalDuration: ANIMATION_TIMINGS.STORIES_MATERIALIZE,
      },
      {
        name: 'Documents',
        steps: [],
        totalDuration: ANIMATION_TIMINGS.DOCUMENTS_GENERATE,
      },
      {
        name: 'Reset',
        steps: [],
        totalDuration: ANIMATION_TIMINGS.FADE_AND_RESET,
      },
    ];
  }
  
  start() {
    this.isRunning = true;
    this.currentPhaseIndex = 0;
    this.currentStepIndex = 0;
    this.executeNextStep();
  }
  
  pause() {
    this.isPaused = true;
  }
  
  resume() {
    this.isPaused = false;
    this.executeNextStep();
  }
  
  stop() {
    this.isRunning = false;
    this.isPaused = false;
    this.currentPhaseIndex = 0;
    this.currentStepIndex = 0;
  }
  
  private executeNextStep() {
    if (!this.isRunning || this.isPaused) return;
    
    const currentPhase = this.phases[this.currentPhaseIndex];
    if (!currentPhase) {
      this.handleLoopComplete();
      return;
    }
    
    const currentStep = currentPhase.steps[this.currentStepIndex];
    if (!currentStep) {
      this.moveToNextPhase();
      return;
    }
    
    // Execute the step action
    currentStep.action();
    
    // Schedule next step
    setTimeout(() => {
      this.currentStepIndex++;
      this.executeNextStep();
    }, currentStep.duration);
  }
  
  private moveToNextPhase() {
    this.currentPhaseIndex++;
    this.currentStepIndex = 0;
    this.executeNextStep();
  }
  
  private handleLoopComplete() {
    this.loopCount++;
    
    // Reset for next loop
    setTimeout(() => {
      this.currentPhaseIndex = 0;
      this.currentStepIndex = 0;
      if (this.isRunning) {
        this.executeNextStep();
      }
    }, ANIMATION_TIMINGS.FADE_AND_RESET);
  }
  
  getCurrentPhase(): string {
    return this.phases[this.currentPhaseIndex]?.name || 'Complete';
  }
  
  getProgress(): number {
    let totalElapsed = 0;
    
    // Add completed phases
    for (let i = 0; i < this.currentPhaseIndex; i++) {
      totalElapsed += this.phases[i].totalDuration;
    }
    
    // Add current phase progress
    const currentPhase = this.phases[this.currentPhaseIndex];
    if (currentPhase) {
      let phaseElapsed = 0;
      for (let i = 0; i < this.currentStepIndex; i++) {
        phaseElapsed += currentPhase.steps[i]?.duration || 0;
      }
      totalElapsed += phaseElapsed;
    }
    
    const totalDuration = this.phases.reduce((sum, phase) => sum + phase.totalDuration, 0);
    return Math.min((totalElapsed / totalDuration) * 100, 100);
  }
}