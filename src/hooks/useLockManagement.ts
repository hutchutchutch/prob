import { useCallback, useEffect } from 'react';
import { useLockStore } from '../stores/lockStore';
import { useVersionStore } from '../stores/versionStore';
import { useAuth } from './useAuth';
import { supabase } from '../services/supabase/client';

export const useLockManagement = () => {
  const { user } = useAuth();
  const {
    lockedItems,
    lockItem,
    unlockItem,
    toggleLock,
    bulkLock,
    bulkUnlock,
    isLocked,
    getLockedCount,
    getLockedItemsByType,
    clearExpiredLocks,
    syncWithDatabase,
  } = useLockStore();
  
  const { addEvent } = useVersionStore();
  
  // Sync locks with database on mount
  useEffect(() => {
    const fetchLocks = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('lock_management')
        .select('*')
        .eq('locked_by', user.id)
        .gte('expires_at', new Date().toISOString());
      
      if (!error && data) {
        syncWithDatabase(data.map(lock => ({
          nodeId: lock.item_id,
          nodeType: lock.item_type,
          lockedAt: lock.locked_at,
          lockedBy: lock.locked_by,
          expiresAt: lock.expires_at,
        })));
      }
    };
    
    fetchLocks();
    
    // Clear expired locks periodically
    const interval = setInterval(() => {
      clearExpiredLocks();
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [user, syncWithDatabase, clearExpiredLocks]);
  
  // Lock item with database sync
  const lockItemWithSync = useCallback(async (nodeId: string, nodeType: string) => {
    if (!user) return;
    
    // Optimistic update
    lockItem(nodeId, nodeType, user.id);
    
    // Track in version history
    addEvent({
      projectId: 'current', // TODO: Get actual project ID
      eventType: 'lock_toggled',
      eventData: {
        afterState: { isLocked: true },
        metadata: {
          triggeredBy: 'user_action',
          nodeId,
          nodeType,
          description: `Locked ${nodeType} ${nodeId}`,
        },
      },
    });
    
    // Sync with database
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      await supabase.from('lock_management').insert({
        item_id: nodeId,
        item_type: nodeType,
        locked_by: user.id,
        locked_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        project_id: 'current', // TODO: Get actual project ID
      });
    } catch (error) {
      console.error('Failed to sync lock to database:', error);
      // Rollback on error
      unlockItem(nodeId);
    }
  }, [user, lockItem, unlockItem, addEvent]);
  
  // Unlock item with database sync
  const unlockItemWithSync = useCallback(async (nodeId: string) => {
    if (!user) return;
    
    const lockInfo = lockedItems.get(nodeId);
    if (!lockInfo) return;
    
    // Optimistic update
    unlockItem(nodeId);
    
    // Track in version history
    addEvent({
      projectId: 'current', // TODO: Get actual project ID
      eventType: 'lock_toggled',
      eventData: {
        afterState: { isLocked: false },
        metadata: {
          triggeredBy: 'user_action',
          nodeId,
          nodeType: lockInfo.nodeType,
          description: `Unlocked ${lockInfo.nodeType} ${nodeId}`,
        },
      },
    });
    
    // Sync with database
    try {
      await supabase
        .from('lock_management')
        .delete()
        .eq('item_id', nodeId)
        .eq('locked_by', user.id);
    } catch (error) {
      console.error('Failed to sync unlock to database:', error);
      // Rollback on error
      lockItem(nodeId, lockInfo.nodeType, user.id);
    }
  }, [user, lockedItems, lockItem, unlockItem, addEvent]);
  
  // Toggle lock with sync
  const toggleLockWithSync = useCallback(async (nodeId: string, nodeType: string) => {
    if (isLocked(nodeId)) {
      await unlockItemWithSync(nodeId);
    } else {
      await lockItemWithSync(nodeId, nodeType);
    }
  }, [isLocked, lockItemWithSync, unlockItemWithSync]);
  
  // Bulk operations
  const bulkLockWithSync = useCallback(async (nodeIds: string[], nodeType: string) => {
    if (!user) return;
    
    // Optimistic update
    bulkLock(nodeIds, nodeType, user.id);
    
    // Track in version history
    addEvent({
      projectId: 'current',
      eventType: 'lock_toggled',
      eventData: {
        afterState: { isLocked: true, count: nodeIds.length },
        metadata: {
          triggeredBy: 'bulk_action',
          description: `Locked ${nodeIds.length} ${nodeType} items`,
        },
      },
    });
    
    // Sync with database
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      const locks = nodeIds.map(nodeId => ({
        item_id: nodeId,
        item_type: nodeType,
        locked_by: user.id,
        locked_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        project_id: 'current',
      }));
      
      await supabase.from('lock_management').insert(locks);
    } catch (error) {
      console.error('Failed to sync bulk lock to database:', error);
      // Rollback on error
      bulkUnlock(nodeIds);
    }
  }, [user, bulkLock, bulkUnlock, addEvent]);
  
  const bulkUnlockWithSync = useCallback(async (nodeIds: string[]) => {
    if (!user) return;
    
    // Get node types for history
    const nodeTypes = new Set<string>();
    nodeIds.forEach(nodeId => {
      const lock = lockedItems.get(nodeId);
      if (lock) nodeTypes.add(lock.nodeType);
    });
    
    // Optimistic update
    bulkUnlock(nodeIds);
    
    // Track in version history
    addEvent({
      projectId: 'current',
      eventType: 'lock_toggled',
      eventData: {
        afterState: { isLocked: false, count: nodeIds.length },
        metadata: {
          triggeredBy: 'bulk_action',
          description: `Unlocked ${nodeIds.length} items`,
        },
      },
    });
    
    // Sync with database
    try {
      await supabase
        .from('lock_management')
        .delete()
        .in('item_id', nodeIds)
        .eq('locked_by', user.id);
    } catch (error) {
      console.error('Failed to sync bulk unlock to database:', error);
      // Rollback would be complex here, so we'll just log the error
    }
  }, [user, lockedItems, bulkUnlock, addEvent]);
  
  return {
    lockedItems: Array.from(lockedItems.entries()),
    lockItem: lockItemWithSync,
    unlockItem: unlockItemWithSync,
    toggleLock: toggleLockWithSync,
    bulkLock: bulkLockWithSync,
    bulkUnlock: bulkUnlockWithSync,
    isLocked,
    getLockedCount,
    getLockedItemsByType,
    clearExpiredLocks,
  };
};