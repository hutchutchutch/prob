import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface LockState {
  lockedItems: Map<string, {
    nodeId: string;
    nodeType: string;
    lockedAt: string;
    lockedBy: string;
    expiresAt?: string;
  }>;
  
  // Actions
  lockItem: (nodeId: string, nodeType: string, userId: string) => void;
  unlockItem: (nodeId: string) => void;
  toggleLock: (nodeId: string, nodeType: string, userId: string) => void;
  bulkLock: (nodeIds: string[], nodeType: string, userId: string) => void;
  bulkUnlock: (nodeIds: string[]) => void;
  isLocked: (nodeId: string) => boolean;
  getLockedCount: () => number;
  getLockedItemsByType: (nodeType: string) => string[];
  clearExpiredLocks: () => void;
  syncWithDatabase: (locks: any[]) => void;
}

export const useLockStore = create<LockState>()(
  devtools(
    (set, get) => ({
      lockedItems: new Map(),
      
      lockItem: (nodeId, nodeType, userId) => {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
        
        set((state) => {
          const newLocks = new Map(state.lockedItems);
          newLocks.set(nodeId, {
            nodeId,
            nodeType,
            lockedAt: now.toISOString(),
            lockedBy: userId,
            expiresAt: expiresAt.toISOString(),
          });
          return { lockedItems: newLocks };
        });
      },
      
      unlockItem: (nodeId) => {
        set((state) => {
          const newLocks = new Map(state.lockedItems);
          newLocks.delete(nodeId);
          return { lockedItems: newLocks };
        });
      },
      
      toggleLock: (nodeId, nodeType, userId) => {
        const { isLocked, lockItem, unlockItem } = get();
        if (isLocked(nodeId)) {
          unlockItem(nodeId);
        } else {
          lockItem(nodeId, nodeType, userId);
        }
      },
      
      bulkLock: (nodeIds, nodeType, userId) => {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        
        set((state) => {
          const newLocks = new Map(state.lockedItems);
          nodeIds.forEach((nodeId) => {
            newLocks.set(nodeId, {
              nodeId,
              nodeType,
              lockedAt: now.toISOString(),
              lockedBy: userId,
              expiresAt: expiresAt.toISOString(),
            });
          });
          return { lockedItems: newLocks };
        });
      },
      
      bulkUnlock: (nodeIds) => {
        set((state) => {
          const newLocks = new Map(state.lockedItems);
          nodeIds.forEach((nodeId) => {
            newLocks.delete(nodeId);
          });
          return { lockedItems: newLocks };
        });
      },
      
      isLocked: (nodeId) => {
        return get().lockedItems.has(nodeId);
      },
      
      getLockedCount: () => {
        return get().lockedItems.size;
      },
      
      getLockedItemsByType: (nodeType) => {
        const items: string[] = [];
        get().lockedItems.forEach((lock, nodeId) => {
          if (lock.nodeType === nodeType) {
            items.push(nodeId);
          }
        });
        return items;
      },
      
      clearExpiredLocks: () => {
        const now = new Date();
        set((state) => {
          const newLocks = new Map(state.lockedItems);
          state.lockedItems.forEach((lock, nodeId) => {
            if (lock.expiresAt && new Date(lock.expiresAt) < now) {
              newLocks.delete(nodeId);
            }
          });
          return { lockedItems: newLocks };
        });
      },
      
      syncWithDatabase: (locks) => {
        set(() => {
          const newLocks = new Map();
          locks.forEach((lock) => {
            newLocks.set(lock.nodeId, {
              nodeId: lock.nodeId,
              nodeType: lock.nodeType,
              lockedAt: lock.lockedAt,
              lockedBy: lock.lockedBy,
              expiresAt: lock.expiresAt,
            });
          });
          return { lockedItems: newLocks };
        });
      },
    }),
    {
      name: 'lock-store',
    }
  )
);