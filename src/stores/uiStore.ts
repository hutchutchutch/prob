import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Import other stores for integration (lazy imports to avoid circular dependencies)
import type { useWorkflowStore } from './workflowStore'
import type { useCanvasStore } from './canvasStore'
import type useProjectStore from './projectStore'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  timestamp: Date
}

type ModalType = 
  | 'export' 
  | 'projectSettings' 
  | 'keyboardShortcuts'
  | 'about'
  | 'confirmDelete'
  | null

interface UIStoreState {
  // Theme (for future)
  theme: 'dark' // Only dark for now
  
  // Layout
  sidebarCollapsed: boolean
  sidebarWidth: number
  canvasControlsPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  showMinimap: boolean
  showProgressBar: boolean
  
  // Modals
  activeModal: ModalType | null
  modalProps: Record<string, any>
  
  // Notifications/Toasts
  notifications: Notification[]
  
  // Canvas preferences
  gridEnabled: boolean
  snapToGrid: boolean
  connectionLineType: 'straight' | 'bezier' | 'step'
  
  // Keyboard shortcuts
  shortcutsEnabled: boolean
  customShortcuts: Record<string, string>
  
  // Feature flags
  experimentalFeatures: {
    aiStreaming: boolean
    collaborationMode: boolean
    advancedAnimations: boolean
  }
}

interface UIActions {
  // Layout
  toggleSidebar: () => void
  setSidebarWidth: (width: number) => void
  setCanvasControlsPosition: (position: UIStoreState['canvasControlsPosition']) => void
  toggleMinimap: () => void
  toggleProgressBar: () => void
  
  // Modals
  openModal: (type: ModalType, props?: Record<string, any>) => void
  closeModal: () => void
  
  // Notifications
  showNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  dismissNotification: (id: string) => void
  clearAllNotifications: () => void
  
  // Canvas preferences
  toggleGrid: () => void
  toggleSnapToGrid: () => void
  setConnectionLineType: (type: 'straight' | 'bezier' | 'step') => void
  
  // Keyboard shortcuts
  toggleShortcuts: () => void
  updateShortcut: (action: string, keys: string) => void
  resetShortcuts: () => void
  
  // Feature flags
  toggleFeature: (feature: keyof UIStoreState['experimentalFeatures']) => void
  
  // Helpers
  showSuccess: (title: string, message?: string) => void
  showError: (title: string, message?: string) => void
  showWarning: (title: string, message?: string) => void
  showInfo: (title: string, message?: string) => void
}

type UIStore = UIStoreState & UIActions

const defaultShortcuts: Record<string, string> = {
  'save': 'Cmd+S',
  'undo': 'Cmd+Z',
  'redo': 'Cmd+Shift+Z',
  'copy': 'Cmd+C',
  'paste': 'Cmd+V',
  'delete': 'Delete',
  'selectAll': 'Cmd+A',
  'toggleSidebar': 'Cmd+B',
  'newProject': 'Cmd+N',
  'openProject': 'Cmd+O',
  'exportProject': 'Cmd+E'
}

let notificationTimeouts: Record<string, NodeJS.Timeout> = {}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'dark',
      
      // Layout
      sidebarCollapsed: false,
      sidebarWidth: 280,
      canvasControlsPosition: 'top-left',
      showMinimap: true,
      showProgressBar: true,
      
      // Modals
      activeModal: null,
      modalProps: {},
      
      // Notifications
      notifications: [],
      
      // Canvas preferences
      gridEnabled: true,
      snapToGrid: true,
      connectionLineType: 'bezier',
      
      // Keyboard shortcuts
      shortcutsEnabled: true,
      customShortcuts: { ...defaultShortcuts },
      
      // Feature flags
      experimentalFeatures: {
        aiStreaming: false,
        collaborationMode: false,
        advancedAnimations: true
      },

      // Layout actions
      toggleSidebar: () => set((state) => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),
      
      setSidebarWidth: (width: number) => set({ sidebarWidth: width }),
      
      setCanvasControlsPosition: (position) => set({ 
        canvasControlsPosition: position 
      }),
      
      toggleMinimap: () => set((state) => ({ 
        showMinimap: !state.showMinimap 
      })),
      
      toggleProgressBar: () => set((state) => ({ 
        showProgressBar: !state.showProgressBar 
      })),

      // Modal actions
      openModal: (type: ModalType, props = {}) => set({ 
        activeModal: type, 
        modalProps: props 
      }),
      
      closeModal: () => set({ 
        activeModal: null, 
        modalProps: {} 
      }),

      // Notification actions
      showNotification: (notification) => {
        const id = `notification-${Date.now()}-${Math.random()}`
        const newNotification: Notification = {
          ...notification,
          id,
          timestamp: new Date(),
          duration: notification.duration ?? 5000
        }

        set((state) => ({
          notifications: [...state.notifications, newNotification]
        }))

        // Auto-dismiss after duration
        if (newNotification.duration && newNotification.duration > 0) {
          notificationTimeouts[id] = setTimeout(() => {
            get().dismissNotification(id)
          }, newNotification.duration)
        }
      },
      
      dismissNotification: (id: string) => {
        // Clear timeout if exists
        if (notificationTimeouts[id]) {
          clearTimeout(notificationTimeouts[id])
          delete notificationTimeouts[id]
        }
        
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }))
      },
      
      clearAllNotifications: () => {
        // Clear all timeouts
        Object.values(notificationTimeouts).forEach(timeout => {
          clearTimeout(timeout)
        })
        notificationTimeouts = {}
        
        set({ notifications: [] })
      },

      // Canvas preference actions
      toggleGrid: () => {
        const newGridEnabled = !get().gridEnabled
        set({ gridEnabled: newGridEnabled })
        
        // Notify canvas store of grid preference change
        // Using dynamic import to avoid circular dependency
        import('./canvasStore').then(({ useCanvasStore }) => {
          const canvasStore = useCanvasStore.getState()
          if (canvasStore.markDirty) {
            canvasStore.markDirty() // Trigger canvas re-render with new grid setting
          }
        })
      },
      
      toggleSnapToGrid: () => {
        const newSnapToGrid = !get().snapToGrid
        set({ snapToGrid: newSnapToGrid })
        
        // Notify canvas store of snap preference change
        import('./canvasStore').then(({ useCanvasStore }) => {
          const canvasStore = useCanvasStore.getState()
          if (canvasStore.markDirty) {
            canvasStore.markDirty()
          }
        })
      },
      
      setConnectionLineType: (type) => {
        set({ connectionLineType: type })
        
        // Notify canvas store to update connection line styling
        import('./canvasStore').then(({ useCanvasStore }) => {
          const canvasStore = useCanvasStore.getState()
          if (canvasStore.markDirty) {
            canvasStore.markDirty()
          }
        })
      },

      // Keyboard shortcut actions
      toggleShortcuts: () => set((state) => ({ 
        shortcutsEnabled: !state.shortcutsEnabled 
      })),
      
      updateShortcut: (action: string, keys: string) => set((state) => ({
        customShortcuts: {
          ...state.customShortcuts,
          [action]: keys
        }
      })),
      
      resetShortcuts: () => set({ 
        customShortcuts: { ...defaultShortcuts } 
      }),

      // Feature flag actions
      toggleFeature: (feature) => {
        const currentValue = get().experimentalFeatures[feature]
        const newValue = !currentValue
        
        set((state) => ({
          experimentalFeatures: {
            ...state.experimentalFeatures,
            [feature]: newValue
          }
        }))
        
        // Show notification about feature toggle
        get().showInfo(
          `${feature.replace(/([A-Z])/g, ' $1').toLowerCase()} ${newValue ? 'enabled' : 'disabled'}`
        )
        
        // Handle specific feature toggles
        if (feature === 'advancedAnimations') {
          // Notify canvas store about animation preference change
          import('./canvasStore').then(({ useCanvasStore }) => {
            const canvasStore = useCanvasStore.getState()
            if (canvasStore.markDirty) {
              canvasStore.markDirty()
            }
          })
        }
      },

      // Helper notification methods
      showSuccess: (title: string, message?: string) => {
        get().showNotification({
          type: 'success',
          title,
          message,
          duration: 4000
        })
      },
      
      showError: (title: string, message?: string) => {
        get().showNotification({
          type: 'error',
          title,
          message,
          duration: 8000
        })
      },
      
      showWarning: (title: string, message?: string) => {
        get().showNotification({
          type: 'warning',
          title,
          message,
          duration: 6000
        })
      },
      
      showInfo: (title: string, message?: string) => {
        get().showNotification({
          type: 'info',
          title,
          message,
          duration: 5000
        })
      }
    }),
    {
      name: 'ui-store',
      // Only persist certain fields, not notifications or modal state
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        sidebarWidth: state.sidebarWidth,
        canvasControlsPosition: state.canvasControlsPosition,
        showMinimap: state.showMinimap,
        showProgressBar: state.showProgressBar,
        gridEnabled: state.gridEnabled,
        snapToGrid: state.snapToGrid,
        connectionLineType: state.connectionLineType,
        shortcutsEnabled: state.shortcutsEnabled,
        customShortcuts: state.customShortcuts,
        experimentalFeatures: state.experimentalFeatures
      })
    }
  )
)

// Export types for use in components
export type { Notification, ModalType, UIStoreState, UIActions }
