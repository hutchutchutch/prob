import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { tauriAPI } from '@/services/tauri/api'
import type { WorkflowStep } from '@/types/workflow.types'

// Import other stores for integration
import { useCanvasStore } from './canvasStore'
import { useUIStore } from './uiStore'

// Import or define types (these should match your database schema)
export interface CoreProblem {
  id: string
  project_id: string
  description: string
  is_validated: boolean
  created_at: string
  updated_at: string
}

export interface Persona {
  id: string
  project_id: string
  name: string
  description: string
  demographics: Record<string, any>
  psychographics: Record<string, any>
  goals: string[]
  frustrations: string[]
  batch_id: string
  is_locked: boolean
  created_at: string
  updated_at: string
}

export interface PainPoint {
  id: string
  project_id: string
  persona_id: string
  title: string
  description: string
  severity: number
  frequency: number
  impact: string
  is_locked: boolean
  created_at: string
  updated_at: string
}

export interface Solution {
  id: string
  project_id: string
  title: string
  description: string
  feasibility_score: number
  impact_score: number
  effort_estimate: string
  is_locked: boolean
  created_at: string
  updated_at: string
}

export interface SolutionPainPointMapping {
  id: string
  solution_id: string
  pain_point_id: string
  addresses_directly: boolean
  impact_level: string
  created_at: string
}

export interface UserStory {
  id: string
  project_id: string
  solution_id: string
  persona_id: string
  title: string
  description: string
  acceptance_criteria: string[]
  priority: string
  effort_points: number
  created_at: string
  updated_at: string
}

interface WorkflowState {
  // Current workflow position
  currentStep: WorkflowStep
  projectId: string | null
  
  // Problem data
  coreProblem: CoreProblem | null
  problemInput: string
  isValidating: boolean
  
  // Personas data
  personas: Persona[]
  activePersonaId: string | null
  personaGenerationBatch: string | null
  
  // Pain points data
  painPoints: PainPoint[]
  
  // Solutions data
  solutions: Solution[]
  solutionMappings: SolutionPainPointMapping[]
  selectedSolutionIds: Set<string>
  
  // User stories data
  userStories: UserStory[]
  
  // Lock management
  lockedItems: {
    personas: Set<string>
    painPoints: Set<string>
    solutions: Set<string>
  }
  
  // Loading states
  isGeneratingPersonas: boolean
  isGeneratingPainPoints: boolean
  isGeneratingSolutions: boolean
  isGeneratingUserStories: boolean
}

interface WorkflowActions {
  // Navigation
  setCurrentStep: (step: WorkflowStep) => void
  canProceedToNextStep: () => boolean
  proceedToNextStep: () => void
  goToPreviousStep: () => void
  
  // Problem validation
  setProblemInput: (input: string) => void
  validateProblem: (input: string) => Promise<void>
  
  // Persona management
  generatePersonas: () => Promise<void>
  regeneratePersonas: () => Promise<void>
  selectPersona: (personaId: string) => Promise<void>
  togglePersonaLock: (personaId: string) => void
  
  // Pain point management
  generatePainPoints: () => Promise<void>
  regeneratePainPoints: () => Promise<void>
  togglePainPointLock: (painPointId: string) => void
  
  // Solution management
  generateSolutions: () => Promise<void>
  regenerateSolutions: () => Promise<void>
  toggleSolutionLock: (solutionId: string) => void
  toggleSolutionSelection: (solutionId: string) => void
  
  // User story management
  generateUserStories: () => Promise<void>
  updateUserStory: (storyId: string, updates: Partial<UserStory>) => void
  
  // State persistence
  saveWorkflowState: () => Promise<void>
  loadWorkflowState: (projectId: string) => Promise<void>
  
  // Reset
  resetWorkflow: () => void
}

const initialState: WorkflowState = {
  currentStep: 'problem_input',
  projectId: null,
  coreProblem: null,
  problemInput: '',
  isValidating: false,
  personas: [],
  activePersonaId: null,
  personaGenerationBatch: null,
  painPoints: [],
  solutions: [],
  solutionMappings: [],
  selectedSolutionIds: new Set(),
  userStories: [],
  lockedItems: {
    personas: new Set(),
    painPoints: new Set(),
    solutions: new Set(),
  },
  isGeneratingPersonas: false,
  isGeneratingPainPoints: false,
  isGeneratingSolutions: false,
  isGeneratingUserStories: false,
}

export const useWorkflowStore = create<WorkflowState & WorkflowActions>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Navigation
    setCurrentStep: (step) => {
      set({ currentStep: step })
      
      // Notify canvas store of step change
      const canvasStore = useCanvasStore.getState()
      canvasStore.syncWithWorkflow(get())
      
      // Apply appropriate layout for the current step
      if (step === 'persona_discovery') {
        canvasStore.applyLayout('hierarchical')
      }
    },

    canProceedToNextStep: () => {
      const state = get()
      switch (state.currentStep) {
        case 'problem_input':
          return state.coreProblem?.is_validated === true
        case 'persona_discovery':
          return state.activePersonaId !== null
        case 'pain_points':
          return state.painPoints.length > 0
        case 'solution_generation':
          return state.selectedSolutionIds.size > 0
        case 'user_stories':
          return state.userStories.length > 0
        default:
          return false
      }
    },

    proceedToNextStep: () => {
      const state = get()
      if (!state.canProceedToNextStep()) return

      const stepOrder: WorkflowStep[] = [
        'problem_input',
        'persona_discovery',
        'pain_points',
        'solution_generation',
        'user_stories',
        'architecture'
      ]

      const currentIndex = stepOrder.indexOf(state.currentStep)
      if (currentIndex < stepOrder.length - 1) {
        const nextStep = stepOrder[currentIndex + 1]
        set({ currentStep: nextStep })
        
        // Notify other stores and show progress
        const canvasStore = useCanvasStore.getState()
        const uiStore = useUIStore.getState()
        
        canvasStore.syncWithWorkflow(get())
        uiStore.showSuccess(`Advanced to ${nextStep.replace('_', ' ')}`)
      }
    },

    goToPreviousStep: () => {
      const state = get()
      const stepOrder: WorkflowStep[] = [
        'problem_input',
        'persona_discovery',
        'pain_points',
        'solution_generation',
        'user_stories',
        'architecture'
      ]

      const currentIndex = stepOrder.indexOf(state.currentStep)
      if (currentIndex > 0) {
        const prevStep = stepOrder[currentIndex - 1]
        set({ currentStep: prevStep })
        
        // Notify canvas store
        const canvasStore = useCanvasStore.getState()
        canvasStore.syncWithWorkflow(get())
      }
    },

    // Problem validation
    setProblemInput: (problemText: string) => {
      set({
        coreProblem: {
          id: crypto.randomUUID(),
          project_id: get().projectId || '',
          description: problemText,
          is_validated: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      })
    },

    validateProblem: async (input) => {
      const uiStore = useUIStore.getState()
      
      set({ isValidating: true })
      try {
        // Call Tauri API to validate and analyze problem
        const analysis = await tauriAPI.analyzeProblem(input)
        // TODO: Parse analysis and create CoreProblem object
        const coreProblem: CoreProblem = {
          id: crypto.randomUUID(),
          project_id: get().projectId || '',
          description: input,
          is_validated: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        set({ coreProblem, problemInput: input })
        
        // Notify canvas and UI stores
        const canvasStore = useCanvasStore.getState()
        canvasStore.syncWithWorkflow(get())
        uiStore.showSuccess('Problem validated successfully')
        
      } catch (error) {
        console.error('Problem validation failed:', error)
        uiStore.showError('Problem validation failed', error instanceof Error ? error.message : 'Unknown error')
      } finally {
        set({ isValidating: false })
      }
    },

    // Persona management
    generatePersonas: async () => {
      const state = get()
      if (!state.coreProblem) return

      const uiStore = useUIStore.getState()
      
      set({ isGeneratingPersonas: true })
      try {
        // TODO: Call Tauri API to generate personas
        // const personas = await tauriAPI.generatePersonas(state.coreProblem.id)
        const batchId = crypto.randomUUID()
        set({ 
          personas: [], // TODO: Set actual personas from API
          personaGenerationBatch: batchId
        })
        
        // Notify canvas and UI stores
        const canvasStore = useCanvasStore.getState()
        canvasStore.syncWithWorkflow(get())
        uiStore.showSuccess('Personas generated successfully')
        
      } catch (error) {
        console.error('Persona generation failed:', error)
        uiStore.showError('Persona generation failed', error instanceof Error ? error.message : 'Unknown error')
      } finally {
        set({ isGeneratingPersonas: false })
      }
    },

    regeneratePersonas: async () => {
      const state = get()
      const unlockedPersonas = state.personas.filter(p => !state.lockedItems.personas.has(p.id))
      const uiStore = useUIStore.getState()
      
      set({ isGeneratingPersonas: true })
      try {
        // TODO: Call Tauri API to regenerate unlocked personas
        // const newPersonas = await tauriAPI.regeneratePersonas(unlockedPersonas.map(p => p.id))
        // Update only unlocked personas
        
        // Notify canvas store
        const canvasStore = useCanvasStore.getState()
        canvasStore.syncWithWorkflow(get())
        uiStore.showSuccess(`Regenerated ${unlockedPersonas.length} personas`)
        
      } catch (error) {
        console.error('Persona regeneration failed:', error)
        uiStore.showError('Persona regeneration failed', error instanceof Error ? error.message : 'Unknown error')
      } finally {
        set({ isGeneratingPersonas: false })
      }
    },

    selectPersona: async (personaId) => {
      set({ activePersonaId: personaId })
      
      // Notify canvas to update visual state
      const canvasStore = useCanvasStore.getState()
      canvasStore.syncWithWorkflow(get())
      canvasStore.selectNode(`persona-${personaId}`)
      
      // Show notification
      const uiStore = useUIStore.getState()
      const persona = get().personas.find(p => p.id === personaId)
      uiStore.showSuccess('Persona selected', persona ? `Selected ${persona.name}` : undefined)
    },

    togglePersonaLock: (personaId) => {
      set((state) => {
        const newLockedPersonas = new Set(state.lockedItems.personas)
        const isLocking = !newLockedPersonas.has(personaId)
        
        if (isLocking) {
          newLockedPersonas.add(personaId)
        } else {
          newLockedPersonas.delete(personaId)
        }
        
        return {
          lockedItems: {
            ...state.lockedItems,
            personas: newLockedPersonas
          }
        }
      })
      
      // Notify canvas and UI stores
      const canvasStore = useCanvasStore.getState()
      const uiStore = useUIStore.getState()
      
      canvasStore.syncWithWorkflow(get())
      
      const persona = get().personas.find(p => p.id === personaId)
      const isLocked = get().lockedItems.personas.has(personaId)
      uiStore.showInfo(
        `Persona ${isLocked ? 'locked' : 'unlocked'}`,
        persona ? persona.name : undefined
      )
    },

    // Pain point management
    generatePainPoints: async () => {
      const state = get()
      if (!state.activePersonaId) return

      const uiStore = useUIStore.getState()
      
      set({ isGeneratingPainPoints: true })
      try {
        // TODO: Call Tauri API to generate pain points
        // const painPoints = await tauriAPI.generatePainPoints(state.activePersonaId)
        set({ painPoints: [] }) // TODO: Set actual pain points from API
        
        // Notify canvas and UI stores
        const canvasStore = useCanvasStore.getState()
        canvasStore.syncWithWorkflow(get())
        uiStore.showSuccess('Pain points generated successfully')
        
      } catch (error) {
        console.error('Pain point generation failed:', error)
        uiStore.showError('Pain point generation failed', error instanceof Error ? error.message : 'Unknown error')
      } finally {
        set({ isGeneratingPainPoints: false })
      }
    },

    regeneratePainPoints: async () => {
      const state = get()
      const unlockedPainPoints = state.painPoints.filter(p => !state.lockedItems.painPoints.has(p.id))
      const uiStore = useUIStore.getState()
      
      set({ isGeneratingPainPoints: true })
      try {
        // TODO: Call Tauri API to regenerate unlocked pain points
        // const newPainPoints = await tauriAPI.regeneratePainPoints(unlockedPainPoints.map(p => p.id))
        
        // Notify canvas store
        const canvasStore = useCanvasStore.getState()
        canvasStore.syncWithWorkflow(get())
        uiStore.showSuccess(`Regenerated ${unlockedPainPoints.length} pain points`)
        
      } catch (error) {
        console.error('Pain point regeneration failed:', error)
        uiStore.showError('Pain point regeneration failed', error instanceof Error ? error.message : 'Unknown error')
      } finally {
        set({ isGeneratingPainPoints: false })
      }
    },

    togglePainPointLock: (painPointId) => {
      set((state) => {
        const newLockedPainPoints = new Set(state.lockedItems.painPoints)
        const isLocking = !newLockedPainPoints.has(painPointId)
        
        if (isLocking) {
          newLockedPainPoints.add(painPointId)
        } else {
          newLockedPainPoints.delete(painPointId)
        }
        
        return {
          lockedItems: {
            ...state.lockedItems,
            painPoints: newLockedPainPoints
          }
        }
      })
      
      // Notify canvas and UI stores
      const canvasStore = useCanvasStore.getState()
      const uiStore = useUIStore.getState()
      
      canvasStore.syncWithWorkflow(get())
      
      const painPoint = get().painPoints.find(p => p.id === painPointId)
      const isLocked = get().lockedItems.painPoints.has(painPointId)
      uiStore.showInfo(
        `Pain point ${isLocked ? 'locked' : 'unlocked'}`,
        painPoint ? painPoint.title : undefined
      )
    },

    // Solution management
    generateSolutions: async () => {
      const state = get()
      if (state.painPoints.length === 0) return

      const uiStore = useUIStore.getState()
      
      set({ isGeneratingSolutions: true })
      try {
        // TODO: Call Tauri API to generate solutions
        // const solutions = await tauriAPI.generateSolutions(state.painPoints.map(p => p.id))
        set({ solutions: [], solutionMappings: [] }) // TODO: Set actual data from API
        
        // Notify canvas and UI stores
        const canvasStore = useCanvasStore.getState()
        canvasStore.syncWithWorkflow(get())
        uiStore.showSuccess('Solutions generated successfully')
        
      } catch (error) {
        console.error('Solution generation failed:', error)
        uiStore.showError('Solution generation failed', error instanceof Error ? error.message : 'Unknown error')
      } finally {
        set({ isGeneratingSolutions: false })
      }
    },

    regenerateSolutions: async () => {
      const state = get()
      const unlockedSolutions = state.solutions.filter(s => !state.lockedItems.solutions.has(s.id))
      const uiStore = useUIStore.getState()
      
      set({ isGeneratingSolutions: true })
      try {
        // TODO: Call Tauri API to regenerate unlocked solutions
        // const newSolutions = await tauriAPI.regenerateSolutions(unlockedSolutions.map(s => s.id))
        
        // Notify canvas store
        const canvasStore = useCanvasStore.getState()
        canvasStore.syncWithWorkflow(get())
        uiStore.showSuccess(`Regenerated ${unlockedSolutions.length} solutions`)
        
      } catch (error) {
        console.error('Solution regeneration failed:', error)
        uiStore.showError('Solution regeneration failed', error instanceof Error ? error.message : 'Unknown error')
      } finally {
        set({ isGeneratingSolutions: false })
      }
    },

    toggleSolutionLock: (solutionId) => {
      set((state) => {
        const newLockedSolutions = new Set(state.lockedItems.solutions)
        const isLocking = !newLockedSolutions.has(solutionId)
        
        if (isLocking) {
          newLockedSolutions.add(solutionId)
        } else {
          newLockedSolutions.delete(solutionId)
        }
        
        return {
          lockedItems: {
            ...state.lockedItems,
            solutions: newLockedSolutions
          }
        }
      })
      
      // Notify canvas and UI stores
      const canvasStore = useCanvasStore.getState()
      const uiStore = useUIStore.getState()
      
      canvasStore.syncWithWorkflow(get())
      
      const solution = get().solutions.find(s => s.id === solutionId)
      const isLocked = get().lockedItems.solutions.has(solutionId)
      uiStore.showInfo(
        `Solution ${isLocked ? 'locked' : 'unlocked'}`,
        solution ? solution.title : undefined
      )
    },

    toggleSolutionSelection: (solutionId) => {
      set((state) => {
        const newSelectedSolutions = new Set(state.selectedSolutionIds)
        const isSelecting = !newSelectedSolutions.has(solutionId)
        
        if (isSelecting) {
          newSelectedSolutions.add(solutionId)
        } else {
          newSelectedSolutions.delete(solutionId)
        }
        
        return { selectedSolutionIds: newSelectedSolutions }
      })
      
      // Notify canvas and UI stores
      const canvasStore = useCanvasStore.getState()
      const uiStore = useUIStore.getState()
      
      canvasStore.syncWithWorkflow(get())
      canvasStore.selectNode(`solution-${solutionId}`)
      
      const solution = get().solutions.find(s => s.id === solutionId)
      const isSelected = get().selectedSolutionIds.has(solutionId)
      uiStore.showInfo(
        `Solution ${isSelected ? 'selected' : 'deselected'}`,
        solution ? solution.title : undefined
      )
    },

    // User story management
    generateUserStories: async () => {
      const state = get()
      if (state.selectedSolutionIds.size === 0) return

      const uiStore = useUIStore.getState()
      
      set({ isGeneratingUserStories: true })
      try {
        // TODO: Call Tauri API to generate user stories
        // const userStories = await tauriAPI.generateUserStories(Array.from(state.selectedSolutionIds))
        set({ userStories: [] }) // TODO: Set actual user stories from API
        
        // Notify canvas and UI stores
        const canvasStore = useCanvasStore.getState()
        canvasStore.syncWithWorkflow(get())
        uiStore.showSuccess('User stories generated successfully')
        
      } catch (error) {
        console.error('User story generation failed:', error)
        uiStore.showError('User story generation failed', error instanceof Error ? error.message : 'Unknown error')
      } finally {
        set({ isGeneratingUserStories: false })
      }
    },

    updateUserStory: (storyId, updates) => {
      set((state) => ({
        userStories: state.userStories.map(story =>
          story.id === storyId ? { ...story, ...updates } : story
        )
      }))
      
      // Notify canvas store
      const canvasStore = useCanvasStore.getState()
      canvasStore.syncWithWorkflow(get())
    },

    // State persistence
    saveWorkflowState: async () => {
      const state = get()
      if (!state.projectId) return

      const uiStore = useUIStore.getState()
      
      try {
        // TODO: Call Tauri API to save workflow state
        // await tauriAPI.saveWorkflowState(state.projectId, state)
        uiStore.showSuccess('Workflow saved')
      } catch (error) {
        console.error('Failed to save workflow state:', error)
        uiStore.showError('Failed to save workflow', error instanceof Error ? error.message : 'Unknown error')
      }
    },

    loadWorkflowState: async (projectId) => {
      const uiStore = useUIStore.getState()
      
      try {
        // TODO: Call Tauri API to load workflow state
        // const workflowState = await tauriAPI.loadWorkflowState(projectId)
        set({ projectId })
        
        // Notify canvas store
        const canvasStore = useCanvasStore.getState()
        canvasStore.syncWithWorkflow(get())
        
        uiStore.showSuccess('Workflow loaded')
      } catch (error) {
        console.error('Failed to load workflow state:', error)
        uiStore.showError('Failed to load workflow', error instanceof Error ? error.message : 'Unknown error')
      }
    },

    // Reset
    resetWorkflow: () => {
      set({
        ...initialState,
        projectId: get().projectId, // Keep project ID
      })
      
      // Notify canvas store
      const canvasStore = useCanvasStore.getState()
      canvasStore.resetCanvas()
    },
  }))
)

// Subscribe to state changes for side effects
useWorkflowStore.subscribe(
  (state) => state.currentStep,
  (currentStep, previousStep) => {
    console.log(`Workflow step changed: ${previousStep} -> ${currentStep}`)
    // TODO: Notify canvas store of step change
    // TODO: Auto-save state on step change
  }
)

useWorkflowStore.subscribe(
  (state) => state.activePersonaId,
  (activePersonaId) => {
    if (activePersonaId) {
      console.log(`Active persona changed: ${activePersonaId}`)
      // TODO: Update canvas visualization
    }
  }
)
