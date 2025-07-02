import { useState, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { ExportOptions, ExportHistory } from '../types/export.types';
import { markdownExporter } from '../utils/exportGenerators/markdownExporter';
import { jsonExporter } from '../utils/exportGenerators/jsonExporter';
import { pdfExporter } from '../utils/exportGenerators/pdfExporter';
import { zipExporter } from '../utils/exportGenerators/zipExporter';

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState<ExportHistory[]>([]);
  const [error, setError] = useState<string | null>(null);

  const exportProject = useCallback(async (
    projectId: string,
    projectName: string,
    options: ExportOptions
  ) => {
    setIsExporting(true);
    setError(null);

    try {
      // Get project data from the backend
      const projectData = await invoke('get_project_export_data', { projectId });
      
      let exportResult;
      
      // Use the appropriate exporter based on format
      switch (options.format) {
        case 'markdown':
          exportResult = await markdownExporter(projectData, options);
          break;
        case 'json':
          exportResult = await jsonExporter(projectData, options);
          break;
        case 'pdf':
          exportResult = await pdfExporter(projectData, options);
          break;
        case 'zip':
          exportResult = await zipExporter(projectData, options);
          break;
        default:
          throw new Error(`Unsupported export format: ${options.format}`);
      }

      // Save the export file
      const timestamp = new Date().toISOString();
      const fileName = `${projectName}-${options.format}-${Date.now()}`;
      
      await invoke('save_export_file', {
        fileName,
        content: exportResult.content,
        format: options.format
      });

      // Add to history
      const historyEntry: ExportHistory = {
        id: crypto.randomUUID(),
        projectId,
        format: options.format,
        template: options.template,
        timestamp,
        fileSize: exportResult.size
      };

      setExportHistory(prev => [historyEntry, ...prev]);
      
      return exportResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Export failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsExporting(false);
    }
  }, []);

  const downloadExport = useCallback(async (historyId: string) => {
    const entry = exportHistory.find(h => h.id === historyId);
    if (!entry) {
      throw new Error('Export not found in history');
    }

    try {
      await invoke('download_export', { historyId });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Download failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [exportHistory]);

  return {
    exportProject,
    downloadExport,
    isExporting,
    exportHistory,
    error
  };
};