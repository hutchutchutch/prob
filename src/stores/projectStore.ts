import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { tauriAPI } from '@/services/tauri/api'
import type { Workspace, Project, User } from '@/types/database.types'

// Import other stores for integration
import { useWorkflowStore } from './workflowStore'
import { useCanvasStore } from './canvasStore'
import { useUIStore } from './uiStore'

interface ProjectStoreState {
  // User context
  currentUser: User | null
  
  // Workspace data
  workspaces: Workspace[]
  activeWorkspaceId: string | null
  
  // Project data
  projects: Project[]
  activeProjectId: string | null
  recentProjects: string[] // Project IDs
  
  // UI state
  isLoadingWorkspaces: boolean
  isLoadingProjects: boolean
  expandedWorkspaceIds: Set<string>
}

interface ProjectActions {
  // User management
  setCurrentUser: (user: User) => void
  
  // Workspace operations
  loadWorkspaces: () => Promise<void>
  createWorkspace: (name: string, folderPath?: string) => Promise<Workspace>
  updateWorkspace: (id: string, updates: Partial<Workspace>) => Promise<void>
  deleteWorkspace: (id: string) => Promise<void>
  setActiveWorkspace: (id: string) => void
  
  // Project operations
  loadProjects: (workspaceId: string) => Promise<void>
  createProject: (workspaceId: string, name: string) => Promise<Project>
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  duplicateProject: (id: string, newName: string) => Promise<Project>
  setActiveProject: (id: string) => void
  
  // Recent projects
  addToRecentProjects: (projectId: string) => void
  clearRecentProjects: () => void
  
  // UI state
  toggleWorkspaceExpanded: (workspaceId: string) => void
  
  // Import/Export
  exportProject: (projectId: string, format: 'markdown' | 'json') => Promise<string>
  importProject: (workspaceId: string, data: string, format: 'markdown' | 'json') => Promise<Project>
}

type ProjectStore = ProjectStoreState & ProjectActions

const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      workspaces: [],
      activeWorkspaceId: null,
      projects: [],
      activeProjectId: null,
      recentProjects: [],
      isLoadingWorkspaces: false,
      isLoadingProjects: false,
      expandedWorkspaceIds: new Set<string>(),

      // User management
      setCurrentUser: (user: User) => {
        set({ currentUser: user })
        
        // Load workspaces for the user
        get().loadWorkspaces()
        
        // Show welcome notification
        const uiStore = useUIStore.getState()
        uiStore.showSuccess(`Welcome back, ${user.email || 'User'}!`)
      },

      // Workspace operations
      loadWorkspaces: async () => {
        const { currentUser } = get()
        if (!currentUser?.id) return
        
        const uiStore = useUIStore.getState()
        
        set({ isLoadingWorkspaces: true })
        try {
          const workspaces = await tauriAPI.listWorkspaces(currentUser.id)
          set({ workspaces, isLoadingWorkspaces: false })
          
          if (workspaces.length === 0) {
            uiStore.showInfo('No workspaces found', 'Create your first workspace to get started')
          }
        } catch (error) {
          console.error('Failed to load workspaces:', error)
          uiStore.showError('Failed to load workspaces', error instanceof Error ? error.message : 'Unknown error')
          set({ isLoadingWorkspaces: false })
        }
      },

      createWorkspace: async (name: string, folderPath?: string) => {
        const uiStore = useUIStore.getState()
        
        try {
          const workspace = await tauriAPI.createWorkspace({ 
            id: crypto.randomUUID(),
            name, 
            folder_path: folderPath || null,
            user_id: get().currentUser?.id || '',
            is_active: true
          })
          
          set(state => ({
            workspaces: [...state.workspaces, workspace]
          }))
          
          uiStore.showSuccess('Workspace created', `Created workspace "${name}"`)
          return workspace
        } catch (error) {
          console.error('Failed to create workspace:', error)
          uiStore.showError('Failed to create workspace', error instanceof Error ? error.message : 'Unknown error')
          throw error
        }
      },

      updateWorkspace: async (id: string, updates: Partial<Workspace>) => {
        const uiStore = useUIStore.getState()
        
        try {
          // TODO: Implement updateWorkspace in Tauri API
          console.warn('updateWorkspace not yet implemented in Tauri API')
          throw new Error('updateWorkspace not yet implemented')
        } catch (error) {
          uiStore.showError('Failed to update workspace', error instanceof Error ? error.message : 'Unknown error')
          throw error
        }
      },

      deleteWorkspace: async (id: string) => {
        const uiStore = useUIStore.getState()
        
        try {
          // TODO: Implement deleteWorkspace in Tauri API
          console.warn('deleteWorkspace not yet implemented in Tauri API')
          throw new Error('deleteWorkspace not yet implemented')
        } catch (error) {
          uiStore.showError('Failed to delete workspace', error instanceof Error ? error.message : 'Unknown error')
          throw error
        }
      },

      setActiveWorkspace: (id: string) => {
        const previousWorkspaceId = get().activeWorkspaceId
        set({ activeWorkspaceId: id })
        
        // Load projects for the active workspace
        get().loadProjects(id)
        
        // Show notification if workspace changed
        if (previousWorkspaceId !== id) {
          const workspace = get().workspaces.find(w => w.id === id)
          const uiStore = useUIStore.getState()
          uiStore.showInfo('Workspace switched', workspace ? `Now viewing "${workspace.name}"` : undefined)
        }
      },

      // Project operations
      loadProjects: async (workspaceId: string) => {
        const uiStore = useUIStore.getState()
        
        set({ isLoadingProjects: true })
        try {
          // TODO: Implement getProjects in Tauri API
          console.warn('loadProjects not yet implemented in Tauri API')
          set({ isLoadingProjects: false, projects: [] })
          
          // For now, show placeholder message
          uiStore.showInfo('Projects loading not yet implemented')
        } catch (error) {
          console.error('Failed to load projects:', error)
          uiStore.showError('Failed to load projects', error instanceof Error ? error.message : 'Unknown error')
          set({ isLoadingProjects: false })
        }
      },

      createProject: async (workspaceId: string, name: string) => {
        const uiStore = useUIStore.getState()
        
        try {
          // TODO: Implement createProject in Tauri API
          console.warn('createProject not yet implemented in Tauri API')
          throw new Error('createProject not yet implemented')
        } catch (error) {
          uiStore.showError('Failed to create project', error instanceof Error ? error.message : 'Unknown error')
          throw error
        }
      },

      updateProject: async (id: string, updates: Partial<Project>) => {
        const uiStore = useUIStore.getState()
        
        try {
          // TODO: Implement updateProject in Tauri API
          console.warn('updateProject not yet implemented in Tauri API')
          throw new Error('updateProject not yet implemented')
        } catch (error) {
          uiStore.showError('Failed to update project', error instanceof Error ? error.message : 'Unknown error')
          throw error
        }
      },

      deleteProject: async (id: string) => {
        const uiStore = useUIStore.getState()
        
        try {
          // TODO: Implement deleteProject in Tauri API
          console.warn('deleteProject not yet implemented in Tauri API')
          throw new Error('deleteProject not yet implemented')
        } catch (error) {
          uiStore.showError('Failed to delete project', error instanceof Error ? error.message : 'Unknown error')
          throw error
        }
      },

      duplicateProject: async (id: string, newName: string) => {
        const uiStore = useUIStore.getState()
        
        try {
          // TODO: Implement duplicateProject in Tauri API
          console.warn('duplicateProject not yet implemented in Tauri API')
          throw new Error('duplicateProject not yet implemented')
        } catch (error) {
          uiStore.showError('Failed to duplicate project', error instanceof Error ? error.message : 'Unknown error')
          throw error
        }
      },

      setActiveProject: (id: string) => {
        const previousProjectId = get().activeProjectId
        set({ activeProjectId: id })
        get().addToRecentProjects(id)
        
        // Notify other stores about project switch
        if (previousProjectId !== id) {
          const workflowStore = useWorkflowStore.getState()
          const canvasStore = useCanvasStore.getState()
          const uiStore = useUIStore.getState()
          
          // Load workflow and canvas state for the new project
          workflowStore.loadWorkflowState(id)
          canvasStore.loadCanvasState(id)
          
          // Show notification
          const project = get().projects.find(p => p.id === id)
          uiStore.showSuccess('Project opened', project ? `Opened "${project.name}"` : undefined)
        }
      },

      // Recent projects management
      addToRecentProjects: (projectId: string) => {
        set(state => {
          const filtered = state.recentProjects.filter(id => id !== projectId)
          const updated = [projectId, ...filtered].slice(0, 10) // Max 10 recent projects
          return { recentProjects: updated }
        })
      },

      clearRecentProjects: () => {
        set({ recentProjects: [] })
        
        const uiStore = useUIStore.getState()
        uiStore.showInfo('Recent projects cleared')
      },

      // UI state
      toggleWorkspaceExpanded: (workspaceId: string) => {
        set(state => {
          const newExpanded = new Set(state.expandedWorkspaceIds)
          if (newExpanded.has(workspaceId)) {
            newExpanded.delete(workspaceId)
          } else {
            newExpanded.add(workspaceId)
          }
          return { expandedWorkspaceIds: newExpanded }
        })
      },

      // Import/Export
      exportProject: async (projectId: string, format: 'markdown' | 'json') => {
        const uiStore = useUIStore.getState()
        
        try {
          // TODO: Implement exportProject in Tauri API
          console.warn('exportProject not yet implemented in Tauri API')
          throw new Error('exportProject not yet implemented')
        } catch (error) {
          uiStore.showError('Failed to export project', error instanceof Error ? error.message : 'Unknown error')
          throw error
        }
      },

      importProject: async (workspaceId: string, data: string, format: 'markdown' | 'json') => {
        const uiStore = useUIStore.getState()
        
        try {
          // TODO: Implement importProject in Tauri API
          console.warn('importProject not yet implemented in Tauri API')
          throw new Error('importProject not yet implemented')
        } catch (error) {
          uiStore.showError('Failed to import project', error instanceof Error ? error.message : 'Unknown error')
          throw error
        }
      }
    }),
    {
      name: 'project-store',
      partialize: (state) => ({
        activeWorkspaceId: state.activeWorkspaceId,
        activeProjectId: state.activeProjectId,
        recentProjects: state.recentProjects,
        expandedWorkspaceIds: Array.from(state.expandedWorkspaceIds) // Convert Set to Array for serialization
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.expandedWorkspaceIds) {
          // Convert Array back to Set after rehydration
          state.expandedWorkspaceIds = new Set(state.expandedWorkspaceIds as unknown as string[])
        }
      }
    }
  )
)

export default useProjectStore
