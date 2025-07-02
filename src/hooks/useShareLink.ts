import { useState, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { ShareLink, ShareOptions, AccessHistory } from '../types/export.types';
import { generateShareToken } from '../utils/shareTokenGenerator';

export const useShareLink = () => {
  const [shareLink, setShareLink] = useState<ShareLink | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [accessHistory, setAccessHistory] = useState<AccessHistory[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateShareLink = useCallback(async (
    projectId: string,
    options: ShareOptions
  ) => {
    setIsGenerating(true);
    setError(null);

    try {
      // Generate a secure token
      const token = generateShareToken();
      
      // Create the share link in the backend
      const link = await invoke<ShareLink>('create_share_link', {
        projectId,
        token,
        permission: options.permission,
        expiresIn: options.expiresIn
      });

      // Generate the full URL
      const baseUrl = window.location.origin;
      const fullLink: ShareLink = {
        ...link,
        url: `${baseUrl}/share/${token}`
      };

      setShareLink(fullLink);
      return fullLink;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate share link';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const revokeShareLink = useCallback(async (linkId: string) => {
    try {
      await invoke('revoke_share_link', { linkId });
      if (shareLink?.id === linkId) {
        setShareLink(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to revoke share link';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [shareLink]);

  const loadAccessHistory = useCallback(async (projectId: string) => {
    try {
      const history = await invoke<AccessHistory[]>('get_share_access_history', {
        projectId
      });
      setAccessHistory(history);
      return history;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load access history';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const trackAccess = useCallback(async (token: string, userEmail?: string) => {
    try {
      const access = await invoke<AccessHistory>('track_share_access', {
        token,
        userEmail,
        ipAddress: 'auto' // Backend will determine IP
      });
      
      setAccessHistory(prev => [access, ...prev]);
      return access;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to track access';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  return {
    shareLink,
    generateShareLink,
    revokeShareLink,
    loadAccessHistory,
    trackAccess,
    isGenerating,
    accessHistory,
    error
  };
};