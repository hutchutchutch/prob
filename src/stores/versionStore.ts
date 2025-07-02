import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface VersionEvent {
  id: string;
  projectId: string;
  eventType: 'node_added' | 'node_updated' | 'node_deleted' | 'validation' | 'generation' | 'edge_added' | 'edge_removed' | 'lock_toggled' | 'refresh';
  timestamp: string;
  eventData: {
    beforeState?: any;
    afterState?: any;
    changesDiff?: any;
    metadata: {
      triggeredBy: string;
      lockedItems?: string[];
      description: string;
      nodeType?: string;
      nodeId?: string;
    };
  };
}

interface VersionState {
  events: VersionEvent[];
  currentEventIndex: number;
  isPreviewMode: boolean;
  previewEventId: string | null;
  
  // Actions
  addEvent: (event: Omit<VersionEvent, 'id' | 'timestamp'>) => void;
  navigateToEvent: (eventId: string) => void;
  previewEvent: (eventId: string) => void;
  exitPreview: () => void;
  restoreToEvent: (eventId: string) => void;
  navigatePrevious: () => void;
  navigateNext: () => void;
  
  // Getters
  getCurrentState: () => any;
  getEventById: (eventId: string) => VersionEvent | undefined;
  getFilteredEvents: (filter: string[]) => VersionEvent[];
}

export const useVersionStore = create<VersionState>()(
  devtools(
    (set, get) => ({
      events: [],
      currentEventIndex: -1,
      isPreviewMode: false,
      previewEventId: null,
      
      addEvent: (event) => {
        const newEvent: VersionEvent = {
          ...event,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        };
        
        set((state) => ({
          events: [...state.events, newEvent],
          currentEventIndex: state.events.length,
        }));
      },
      
      navigateToEvent: (eventId) => {
        const { events } = get();
        const index = events.findIndex((e) => e.id === eventId);
        if (index !== -1) {
          set({ currentEventIndex: index });
        }
      },
      
      previewEvent: (eventId) => {
        set({ isPreviewMode: true, previewEventId: eventId });
      },
      
      exitPreview: () => {
        set({ isPreviewMode: false, previewEventId: null });
      },
      
      restoreToEvent: (eventId) => {
        const { events } = get();
        const index = events.findIndex((e) => e.id === eventId);
        if (index !== -1) {
          // Create a restore event
          const restoreEvent: Omit<VersionEvent, 'id' | 'timestamp'> = {
            projectId: events[index].projectId,
            eventType: 'node_updated',
            eventData: {
              beforeState: events[get().currentEventIndex]?.eventData.afterState,
              afterState: events[index].eventData.afterState,
              metadata: {
                triggeredBy: 'version_restore',
                description: `Restored to version from ${new Date(events[index].timestamp).toLocaleString()}`,
              },
            },
          };
          
          get().addEvent(restoreEvent);
        }
      },
      
      navigatePrevious: () => {
        const { currentEventIndex } = get();
        if (currentEventIndex > 0) {
          set({ currentEventIndex: currentEventIndex - 1 });
        }
      },
      
      navigateNext: () => {
        const { currentEventIndex, events } = get();
        if (currentEventIndex < events.length - 1) {
          set({ currentEventIndex: currentEventIndex + 1 });
        }
      },
      
      getCurrentState: () => {
        const { events, currentEventIndex } = get();
        if (currentEventIndex >= 0 && currentEventIndex < events.length) {
          return events[currentEventIndex].eventData.afterState;
        }
        return null;
      },
      
      getEventById: (eventId) => {
        return get().events.find((e) => e.id === eventId);
      },
      
      getFilteredEvents: (filter) => {
        if (filter.length === 0) return get().events;
        return get().events.filter((e) => filter.includes(e.eventType));
      },
    }),
    {
      name: 'version-store',
    }
  )
);