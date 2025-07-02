import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { tauriAPI } from '@/services/tauri/api'
import { problemApi } from '@/services/api/problem'
import type { WorkflowStep } from '@/types/workflow.types'

// Import other stores for integration
import { useCanvasStore } from './canvasStore'
import { useUIStore } from './uiStore'

// Helper functions for pain point transformation
const mapSeverityToNumber = (severity: string): number => {
  const severityMap: Record<string, number> = {
    'low': 1,
    'medium': 3,
    'high': 4,
    'critical': 5
  }
  return severityMap[severity.toLowerCase()] || 3
}

const mapFrequencyToNumber = (frequency: string): number => {
  const frequencyMap: Record<string, number> = {
    'rarely': 1,
    'monthly': 2,
    'weekly': 3,
    'daily': 4,
    'constantly': 5
  }
  return frequencyMap[frequency.toLowerCase()] || 3
}

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
  
  // Project management
  setProjectId: (projectId: string) => void
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
      
      // NOTE: Canvas navigation is now handled by WorkflowCanvas component
      // using the useCanvasNavigation hook for responsive positioning
      
      // Notify canvas store of step change
      // NOTE: Don't call syncWithWorkflow here - WorkflowCanvas handles the nodes directly
      // const canvasStore = useCanvasStore.getState()
      // canvasStore.syncWithWorkflow(get())
      
      // Apply appropriate layout for the current step
      // NOTE: Don't apply layout here - WorkflowCanvas positions nodes correctly
      // const canvasStore = useCanvasStore.getState()
      // if (step === 'persona_discovery') {
      //   canvasStore.applyLayout('hierarchical')
      // }
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
      console.log('[workflowStore] proceedToNextStep called, canProceed:', state.canProceedToNextStep())
      console.log('[workflowStore] Current state:', { 
        currentStep: state.currentStep, 
        coreProblem: state.coreProblem,
        isValidated: state.coreProblem?.is_validated 
      })
      if (!state.canProceedToNextStep()) {
        console.log('[workflowStore] Cannot proceed to next step - conditions not met')
        return
      }

      const stepOrder: WorkflowStep[] = [
        'problem_input',
        'persona_discovery',
        'pain_points',
        'solution_generation',
        'user_stories',
        'architecture'
      ]

      const currentIndex = stepOrder.indexOf(state.currentStep)
      console.log('[workflowStore] Current step index:', currentIndex, 'out of', stepOrder.length - 1)
      if (currentIndex < stepOrder.length - 1) {
        const nextStep = stepOrder[currentIndex + 1]
        console.log('[workflowStore] Advancing from', state.currentStep, 'to', nextStep)
        set({ currentStep: nextStep })
        
        // Notify other stores and show progress
        // NOTE: Don't call syncWithWorkflow here - WorkflowCanvas handles the nodes directly
        // const canvasStore = useCanvasStore.getState()
        const uiStore = useUIStore.getState()
        
        // canvasStore.syncWithWorkflow(get())
        try {
          uiStore.showSuccess(`Advanced to ${nextStep.replace('_', ' ')}`)
        } catch (error) {
          console.warn('[workflowStore] UIStore showSuccess failed:', error)
        }
      } else {
        console.log('[workflowStore] Already at final step')
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
        const projectId = get().projectId || crypto.randomUUID()
        const coreProblem: CoreProblem = {
          id: crypto.randomUUID(),
          project_id: projectId,
          description: input,
          is_validated: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        
        // Ensure we have a project ID
        if (!get().projectId) {
          set({ projectId })
        }
        
        set({ coreProblem, problemInput: input })
        
        console.log('[workflowStore] Problem validated, coreProblem set:', coreProblem)
        
        // Note: Persona generation is now triggered directly from CoreProblemNode
        // This ensures it happens when the UI validation succeeds, not when this method completes
        console.log('[workflowStore] Problem validation completed - personas will be generated by CoreProblemNode')
        
        // Notify canvas and UI stores
        // NOTE: Don't call syncWithWorkflow here - WorkflowCanvas handles the nodes directly
        // const canvasStore = useCanvasStore.getState()
        // canvasStore.syncWithWorkflow(get())
        try {
          uiStore.showSuccess('Problem validated successfully')
        } catch (error) {
          console.warn('[workflowStore] UIStore showSuccess failed:', error)
        }
        
      } catch (error) {
        console.error('Problem validation failed:', error)
        try {
          uiStore.showError('Problem validation failed', error instanceof Error ? error.message : 'Unknown error')
        } catch (uiError) {
          console.warn('[workflowStore] UIStore showError failed:', uiError)
        }
      } finally {
        set({ isValidating: false })
      }
    },

    // Persona management
    generatePersonas: async () => {
      console.log('[workflowStore] generatePersonas called')
      const state = get()
      console.log('[workflowStore] generatePersonas state check:', {
        hasCoreProblem: !!state.coreProblem,
        coreProblem: state.coreProblem,
        hasProjectId: !!state.projectId,
        projectId: state.projectId
      })
      
      if (!state.coreProblem || !state.projectId) {
        console.log('[workflowStore] generatePersonas early return - missing coreProblem or projectId')
        return
      }

      console.log('[workflowStore] generatePersonas proceeding with generation...')
      const uiStore = useUIStore.getState()
      
      set({ isGeneratingPersonas: true })
              try {
          // Import personas API
          const { problemApi } = await import('@/services/api/problem')
          
          const batchId = crypto.randomUUID()
          
          // Get locked personas for preservation
          const lockedPersonas = state.personas.filter(p => state.lockedItems.personas.has(p.id))
          
          // Call the edge function to generate personas
          console.log('[workflowStore] Calling problemApi.generatePersonas with:', {
            projectId: state.projectId,
            coreProblemId: state.coreProblem.id,
            lockedPersonaIds: lockedPersonas.map(p => p.id)
          })
          const response = await problemApi.generatePersonas(
            state.projectId,
            state.coreProblem.id,
            lockedPersonas.map(p => p.id)
          )
          console.log('[workflowStore] problemApi.generatePersonas response:', response)
          
          // Transform the response to match our Persona interface
          const personas: Persona[] = response.map((persona: any) => ({
            id: persona.id || crypto.randomUUID(),
            project_id: state.projectId!,
            name: persona.name,
            description: persona.description,
            demographics: { 
              industry: persona.industry || 'Unknown',
              role: persona.role || 'Unknown',
              ...persona.demographics 
            },
            psychographics: persona.psychographics || {},
            goals: persona.goals || [],
            frustrations: persona.frustrations || [],
            batch_id: batchId,
            is_locked: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            // Add pain_degree to the raw persona object for WorkflowCanvas
            pain_degree: persona.pain_degree || 3
          } as Persona & { pain_degree?: number }))
          
          // Combine with locked personas
          const allPersonas = [...lockedPersonas, ...personas]
          
          set({ 
            personas: allPersonas,
            personaGenerationBatch: batchId
          })
        
        console.log('[workflowStore] Personas generated:', allPersonas.length)
        console.log('[workflowStore] Personas data:', allPersonas)
        
        // Notify canvas and UI stores
        // NOTE: Don't call syncWithWorkflow here - WorkflowCanvas handles the nodes directly
        // const canvasStore = useCanvasStore.getState()
        // canvasStore.syncWithWorkflow(get())
        try {
          uiStore.showSuccess(`Generated ${personas.length} new personas`)
        } catch (error) {
          console.warn('[workflowStore] UIStore showSuccess failed:', error)
        }
        
        // Automatically trigger pain points generation after personas are generated
        if (personas.length > 0) {
          console.log('[workflowStore] Auto-triggering pain points generation...')
          setTimeout(() => {
            const { generatePainPoints } = get()
            generatePainPoints()
          }, 1000) // Small delay to let UI update
        }
        
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
      if (!state.projectId || !state.coreProblem) {
        console.warn('[workflowStore] Cannot generate pain points: missing project ID or core problem')
        return
      }

      const uiStore = useUIStore.getState()
      const batchId = crypto.randomUUID()
      
      set({ isGeneratingPainPoints: true })
      try {
        console.log('[workflowStore] Generating pain points...')
        console.log('[workflowStore] Using personas:', state.personas.length)
        
        // Get locked pain points
        const lockedPainPoints = state.painPoints.filter(p => state.lockedItems.painPoints.has(p.id))
        
        const response = await problemApi.generatePainPoints(
          state.projectId,
          state.personas, // Pass all personas to the API
          lockedPainPoints.map(p => p.id)
        )
        console.log('[workflowStore] problemApi.generatePainPoints response:', response)
        
                 // Transform the response to match our PainPoint interface
        const painPoints: PainPoint[] = response.map((painPoint: any) => ({
          id: painPoint.id || crypto.randomUUID(),
          project_id: state.projectId!,
          persona_id: '', // Pain points can be associated with multiple personas
          title: painPoint.title || painPoint.description?.split('.')[0] || 'Untitled Pain Point',
          description: painPoint.description,
          severity: mapSeverityToNumber(painPoint.severity || 'medium'),
          frequency: painPoint.frequency ? mapFrequencyToNumber(painPoint.frequency) : 3,
          impact: painPoint.impactArea || painPoint.impact || 'General',
          is_locked: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as PainPoint))
        
        // Combine with locked pain points
        const allPainPoints = [...lockedPainPoints, ...painPoints]
        
        set({ 
          painPoints: allPainPoints,
          currentStep: 'pain_points' // Advance to pain points step
        })
        
        console.log('[workflowStore] Pain points generated:', allPainPoints.length)
        
        // Show success message
        try {
          uiStore.showSuccess(`Generated ${painPoints.length} new pain points`)
        } catch (error) {
          console.warn('[workflowStore] UIStore showSuccess failed:', error)
        }
        
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
    
    // Project management
    setProjectId: (projectId: string) => {
      console.log('[workflowStore] Setting project ID:', projectId)
      set({ projectId })
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
