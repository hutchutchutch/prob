import { apiClient } from './client'
import { tauriAPI } from '../tauri/api'
import { invoke } from '@tauri-apps/api/core'
import type { EdgeFunctionResponse } from './client'

// Core types
export interface CoreProblem {
  id: string
  project_id: string
  original_input: string
  validated_statement: string
  confidence_score: number
  feedback: string
  suggestions: string[]
  validation_history: ProblemValidationAttempt[]
  created_at: string
  updated_at: string
}

export interface ProblemValidationRequest {
  problemInput: string
  projectId: string
  previousAttempts?: string[]
}

export interface ProblemValidationResponse {
  isValid: boolean
  validatedProblem?: string
  feedback: string
  suggestions?: string[]
  confidenceScore: number
}

export interface StreamingValidationUpdate {
  type: 'thinking' | 'validating' | 'complete'
  message: string
  progress: number
}

export interface ProblemValidationAttempt {
  attempt_number: number
  input: string
  result: ProblemValidationResponse
  timestamp: string
}

export interface CachedValidation {
  problemInput: string
  result: ProblemValidationResponse
  timestamp: string
  projectId: string
}

export interface OfflineValidationRequest extends ProblemValidationRequest {
  id: string
  timestamp: string
  retryCount: number
}

class ProblemValidationService {
  private cache = new Map<string, CachedValidation>()
  private offlineQueue: OfflineValidationRequest[] = []
  private isOnline = navigator.onLine
  private streamingControllers = new Map<string, AbortController>()

  constructor() {
    // Set up online/offline detection
    window.addEventListener('online', () => {
      this.isOnline = true
      this.processOfflineQueue()
    })
    
    window.addEventListener('offline', () => {
      this.isOnline = false
    })

    // Load cached data and offline queue from localStorage on init
    this.loadFromStorage()
  }

  /**
   * Main validation method with fallback to offline queue
   */
  async validateProblem(request: ProblemValidationRequest): Promise<ProblemValidationResponse> {
    // Check cache first
    const cached = await this.getCachedValidation(request.problemInput)
    if (cached && this.isCacheValid(cached)) {
      return cached.result
    }

    // If offline, queue the request
    if (!this.isOnline) {
      await this.queueOfflineValidation(request)
      return {
        isValid: false,
        feedback: 'You are currently offline. This validation has been queued and will be processed when you reconnect.',
        suggestions: ['Check your internet connection', 'Your request will be automatically processed once online'],
        confidenceScore: 0
      }
    }

    try {
      const response = await this.performValidation(request)
      
      // Cache successful results
      if (response.isValid) {
        this.cacheValidation(request.problemInput, response, request.projectId)
      }

      // Save to local database via Tauri
      await this.saveProblemValidation(request, response)

      return response
    } catch (error) {
      // If network error and not already queued, add to offline queue
      if (this.isNetworkError(error)) {
        await this.queueOfflineValidation(request)
        return {
          isValid: false,
          feedback: 'Network error occurred. Your validation has been queued for retry.',
          suggestions: ['Check your internet connection', 'Request will be retried automatically'],
          confidenceScore: 0
        }
      }
      throw error
    }
  }

  /**
   * Streaming validation with real-time updates
   */
  async validateProblemStreaming(
    request: ProblemValidationRequest,
    onUpdate: (update: StreamingValidationUpdate) => void
  ): Promise<ProblemValidationResponse> {
    const requestId = crypto.randomUUID()
    const controller = new AbortController()
    this.streamingControllers.set(requestId, controller)

    try {
      // Check cache first
      const cached = await this.getCachedValidation(request.problemInput)
      if (cached && this.isCacheValid(cached)) {
        onUpdate({
          type: 'complete',
          message: 'Validation found in cache',
          progress: 100
        })
        return cached.result
      }

      // If offline, queue and return early
      if (!this.isOnline) {
        await this.queueOfflineValidation(request)
        onUpdate({
          type: 'complete',
          message: 'Queued for offline processing',
          progress: 100
        })
        return {
          isValid: false,
          feedback: 'You are currently offline. This validation has been queued.',
          suggestions: ['Check your internet connection'],
          confidenceScore: 0
        }
      }

      // Start streaming validation
      onUpdate({
        type: 'thinking',
        message: 'Analyzing problem statement...',
        progress: 10
      })

      const response = await apiClient.invokeEdgeFunction<{
        validation: ProblemValidationResponse
        stream_updates?: StreamingValidationUpdate[]
      }>('problem-validation', {
        ...request,
        streaming: true
      }, {
        signal: controller.signal,
        onProgress: (progress: number) => {
          onUpdate({
            type: 'validating',
            message: 'Processing validation...',
            progress: 10 + (progress * 0.8) // Map to 10-90%
          })
        }
      })

      if (response.error) {
        throw new Error(response.error.message)
      }

      const validationResult = response.data!.validation

      // Process any additional stream updates from edge function
      if (response.data!.stream_updates) {
        for (const update of response.data!.stream_updates) {
          onUpdate(update)
        }
      }

      onUpdate({
        type: 'complete',
        message: 'Validation complete',
        progress: 100
      })

      // Cache and save successful results
      if (validationResult.isValid) {
        this.cacheValidation(request.problemInput, validationResult, request.projectId)
      }
      await this.saveProblemValidation(request, validationResult)

      return validationResult

    } catch (error) {
      if (controller.signal.aborted) {
        onUpdate({
          type: 'complete',
          message: 'Validation cancelled',
          progress: 100
        })
        throw new Error('Validation was cancelled')
      }

      // Handle network errors
      if (this.isNetworkError(error)) {
        await this.queueOfflineValidation(request)
        onUpdate({
          type: 'complete',
          message: 'Queued for retry due to network error',
          progress: 100
        })
        return {
          isValid: false,
          feedback: 'Network error occurred. Your validation has been queued for retry.',
          suggestions: ['Check your internet connection'],
          confidenceScore: 0
        }
      }

      throw error
    } finally {
      this.streamingControllers.delete(requestId)
    }
  }

  /**
   * Cancel a streaming validation
   */
  cancelStreamingValidation(requestId?: string): void {
    if (requestId && this.streamingControllers.has(requestId)) {
      this.streamingControllers.get(requestId)!.abort()
      this.streamingControllers.delete(requestId)
    } else {
      // Cancel all streaming requests
      for (const [id, controller] of this.streamingControllers) {
        controller.abort()
      }
      this.streamingControllers.clear()
    }
  }

  /**
   * Get cached validation result
   */
  async getCachedValidation(problemInput: string): Promise<CachedValidation | null> {
    const cacheKey = this.generateCacheKey(problemInput)
    return this.cache.get(cacheKey) || null
  }

  /**
   * Queue validation for offline processing
   */
  async queueOfflineValidation(request: ProblemValidationRequest): Promise<void> {
    const queueItem: OfflineValidationRequest = {
      ...request,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      retryCount: 0
    }

    // Check if already queued
    const existingIndex = this.offlineQueue.findIndex(
      item => item.problemInput === request.problemInput && item.projectId === request.projectId
    )

    if (existingIndex >= 0) {
      this.offlineQueue[existingIndex] = queueItem
    } else {
      this.offlineQueue.push(queueItem)
    }

    await this.saveToStorage()
  }

  /**
   * Process all queued offline validations
   */
  async processOfflineQueue(): Promise<void> {
    if (!this.isOnline || this.offlineQueue.length === 0) {
      return
    }

    const itemsToProcess = [...this.offlineQueue]
    this.offlineQueue = []

    for (const item of itemsToProcess) {
      try {
        const request: ProblemValidationRequest = {
          problemInput: item.problemInput,
          projectId: item.projectId,
          previousAttempts: item.previousAttempts
        }

        const result = await this.performValidation(request)
        
        // Cache successful results
        if (result.isValid) {
          this.cacheValidation(request.problemInput, result, request.projectId)
        }

        // Save to local database
        await this.saveProblemValidation(request, result)

      } catch (error) {
        // Re-queue with incremented retry count if not max retries
        if (item.retryCount < 3) {
          this.offlineQueue.push({
            ...item,
            retryCount: item.retryCount + 1
          })
        }
      }
    }

    await this.saveToStorage()
  }

  /**
   * Get validation history for a project
   */
  async getValidationHistory(projectId: string): Promise<ProblemValidationAttempt[]> {
    try {
      return await invoke<ProblemValidationAttempt[]>('get_validation_history', { projectId })
    } catch (error) {
      console.error('Failed to get validation history:', error)
      return []
    }
  }

  /**
   * Clear validation cache
   */
  clearCache(): void {
    this.cache.clear()
    this.saveToStorage()
  }

  /**
   * Get offline queue status
   */
  getOfflineQueueStatus(): { count: number; items: OfflineValidationRequest[] } {
    return {
      count: this.offlineQueue.length,
      items: [...this.offlineQueue]
    }
  }

  // Private methods
  private async performValidation(request: ProblemValidationRequest): Promise<ProblemValidationResponse> {
    console.log('[ProblemValidationService] Using local validation for:', request);
    
    // For now, use simple local validation to avoid CORS issues
    // TODO: Set up proper authentication and use edge function
    return this.performLocalValidation(request);
  }

  private async performLocalValidation(request: ProblemValidationRequest): Promise<ProblemValidationResponse> {
    const { problemInput } = request;
    
    // Simple validation logic
    const trimmed = problemInput.trim();
    
    if (trimmed.length < 10) {
      return {
        isValid: false,
        feedback: 'Problem statement is too short. Please provide more detail about the specific issue you want to solve.',
        suggestions: ['Describe the pain point in more detail', 'Explain who is affected by this problem', 'Add context about when this problem occurs'],
        confidenceScore: 0.2
      };
    }
    
    if (trimmed.length > 500) {
      return {
        isValid: false,
        feedback: 'Problem statement is too long. Try to focus on the core issue.',
        suggestions: ['Focus on the main problem', 'Remove unnecessary details', 'Break down into smaller, specific problems'],
        confidenceScore: 0.3
      };
    }
    
    // Check for vague terms
    const vagueTerms = ['something', 'somehow', 'better', 'improve', 'good', 'bad', 'issue', 'problem'];
    const hasVagueTerms = vagueTerms.some(term => trimmed.toLowerCase().includes(term));
    
    if (hasVagueTerms) {
      return {
        isValid: false,
        feedback: 'Problem statement is too vague. Be more specific about what exactly needs to be solved.',
        suggestions: ['Use specific examples', 'Quantify the impact', 'Describe the current situation vs desired outcome'],
        confidenceScore: 0.4
      };
    }
    
    // Check for solution-oriented language
    const solutionWords = ['build', 'create', 'make', 'develop', 'app', 'website', 'system'];
    const hasSolutionWords = solutionWords.some(word => trimmed.toLowerCase().includes(word));
    
    if (hasSolutionWords) {
      return {
        isValid: false,
        feedback: 'Focus on the problem, not the solution. Describe what people struggle with, not what you want to build.',
        suggestions: ['Describe the pain point people experience', 'Explain what is currently difficult or impossible', 'Focus on user needs rather than technical solutions'],
        confidenceScore: 0.5
      };
    }
    
    // If it passes basic checks, consider it valid
    return {
      isValid: true,
      validatedProblem: trimmed,
      feedback: 'Problem statement looks good! It\'s specific and focuses on a real issue.',
      suggestions: ['Consider who specifically faces this problem', 'Think about the impact and frequency'],
      confidenceScore: 0.8
    };
  }

  private cacheValidation(problemInput: string, result: ProblemValidationResponse, projectId: string): void {
    const cacheKey = this.generateCacheKey(problemInput)
    this.cache.set(cacheKey, {
      problemInput,
      result,
      timestamp: new Date().toISOString(),
      projectId
    })
    this.saveToStorage()
  }

  private generateCacheKey(problemInput: string): string {
    // First encode the string to handle Unicode characters
    try {
      // Convert to UTF-8 bytes then to base64
      const encoder = new TextEncoder();
      const data = encoder.encode(problemInput.toLowerCase().trim());
      const base64 = btoa(String.fromCharCode(...data));
      return base64.replace(/[^a-zA-Z0-9]/g, '');
    } catch (error) {
      // Fallback: use a simple hash if encoding fails
      console.warn('[ProblemValidationService] Cache key generation failed, using fallback', error);
      let hash = 0;
      const str = problemInput.toLowerCase().trim();
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return Math.abs(hash).toString(36);
    }
  }

  private isCacheValid(cached: CachedValidation): boolean {
    const cacheAge = Date.now() - new Date(cached.timestamp).getTime()
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours
    return cacheAge < maxAge
  }

  private async saveProblemValidation(
    request: ProblemValidationRequest,
    response: ProblemValidationResponse
  ): Promise<void> {
    try {
      await invoke<void>('save_problem_validation', {
        request,
        response,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Failed to save problem validation:', error)
    }
  }

  private isNetworkError(error: any): boolean {
    return (
      error instanceof TypeError ||
      error?.name === 'NetworkError' ||
      error?.code === 'NETWORK_ERROR' ||
      error?.message?.includes('fetch')
    )
  }

  private async saveToStorage(): Promise<void> {
    try {
      const data = {
        cache: Array.from(this.cache.entries()),
        offlineQueue: this.offlineQueue
      }
      localStorage.setItem('problemValidationService', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save to storage:', error)
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('problemValidationService')
      if (stored) {
        const data = JSON.parse(stored)
        this.cache = new Map(data.cache || [])
        this.offlineQueue = data.offlineQueue || []
      }
    } catch (error) {
      console.error('Failed to load from storage:', error)
    }
  }
}

// Export singleton instance
export const problemValidationService = new ProblemValidationService()

// Export individual methods for easier testing
export const {
  validateProblem,
  validateProblemStreaming,
  getCachedValidation,
  queueOfflineValidation,
  processOfflineQueue,
  getValidationHistory,
  clearCache,
  getOfflineQueueStatus,
  cancelStreamingValidation
} = problemValidationService

// Add this at the very bottom of the file, after the existing exports:

// Export a problemApi object that matches what the components expect
export const problemApi = {
    validateProblem: async (input: string): Promise<ProblemValidationResponse> => {
      return problemValidationService.validateProblem({
        problemInput: input,
        projectId: 'temp-project-id' // You'll need to get this from your store
      });
    },
    
    generatePersonas: async (
      projectId: string,
      coreProblemId: string,
      lockedPersonaIds: string[]
    ): Promise<any[]> => {
      // This should call the personas service
      try {
        const { generatePersonas } = await import('./personas');
        const result = await generatePersonas({
          coreProblem: { id: coreProblemId } as any,
          lockedPersonas: [],
          projectId,
          generationBatch: crypto.randomUUID()
        });
        
        // Extract personas array from the response
        return result.personas || [];
      } catch (error) {
        console.warn('generatePersonas not available yet:', error);
        return [];
      }
    },
    
    generatePainPoints: async (
      projectId: string,
      personaId: string,
      lockedPainPointIds: string[]
    ): Promise<any[]> => {
      // TODO: Implement when you have pain points service
      console.warn('generatePainPoints not implemented yet');
      return [];
    },
    
    generateSolutions: async (
      projectId: string,
      personaId: string,
      painPointIds: string[],
      lockedSolutionIds: string[]
    ): Promise<any[]> => {
      // This should call the solutions service
      const { solutionsService } = await import('./solutions');
      // TODO: Implement properly
      console.warn('generateSolutions not fully implemented yet');
      return [];
    }
  };