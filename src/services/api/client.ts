import { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '../supabase/client'

export interface RequestConfig {
  maxRetries?: number
  retryDelay?: number
  timeout?: number
  onProgress?: (progress: number) => void
  signal?: AbortSignal
}

export interface EdgeFunctionResponse<T> {
  data?: T
  error?: {
    message: string
    code: string
    details?: any
  }
  metadata?: {
    duration: number
    tokens_used?: number
  }
}

export interface EdgeFunctionError {
  message: string
  code: string
  details?: any
  originalError?: any
}

class ApiClient {
  private supabase: SupabaseClient
  private defaultConfig: RequestConfig = {
    maxRetries: 3,
    retryDelay: 1000,
    timeout: 30000,
  }

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient
  }

  /**
   * Invokes a Supabase Edge Function with retry logic and error handling
   */
  async invokeEdgeFunction<T>(
    functionName: string,
    payload: any,
    config?: RequestConfig
  ): Promise<EdgeFunctionResponse<T>> {
    const finalConfig = { ...this.defaultConfig, ...config }
    const startTime = Date.now()
    
    let lastError: any
    let attempt = 0

    while (attempt <= (finalConfig.maxRetries || 3)) {
      try {
        // Create abort controller for timeout
        const { controller, timeout } = this.createAbortController(finalConfig.timeout)
        const signals = [controller.signal, finalConfig.signal].filter((signal): signal is AbortSignal => signal !== undefined)
        const combinedSignal = this.combineAbortSignals(signals)

        // Check if already aborted
        if (combinedSignal.aborted) {
          throw new Error('Request was cancelled')
        }

        // Add request interceptors
        const headers = await this.addRequestInterceptors()
        
        // Create a promise that rejects when the signal is aborted
        const requestPromise = this.supabase.functions.invoke(functionName, {
          body: payload,
          headers,
        })

        const abortPromise = new Promise<never>((_, reject) => {
          combinedSignal.addEventListener('abort', () => {
            reject(new Error('Request was cancelled'))
          })
        })

        // Race the request against the abort signal
        const response = await Promise.race([requestPromise, abortPromise])

        // Clear timeout
        if (timeout) clearTimeout(timeout)

        // Handle response
        if (response.error) {
          const transformedError = this.transformError(response.error)
          
          // Check if we should retry
          if (attempt < (finalConfig.maxRetries || 3) && await this.handleRetry(response.error, attempt, finalConfig)) {
            attempt++
            continue
          }
          
          return {
            error: transformedError,
            metadata: {
              duration: Date.now() - startTime,
            }
          }
        }

        // Success response
        const result: EdgeFunctionResponse<T> = {
          data: response.data,
          metadata: {
            duration: Date.now() - startTime,
            tokens_used: response.data?.metadata?.tokens_used,
          }
        }

        // Apply response interceptors
        return this.applyResponseInterceptors(result)

      } catch (error) {
        lastError = error
        
        // Check if we should retry
        if (attempt < (finalConfig.maxRetries || 3) && await this.handleRetry(error, attempt, finalConfig)) {
          attempt++
          continue
        }
        
        // Transform and return error
        const transformedError = this.transformError(error)
        return {
          error: transformedError,
          metadata: {
            duration: Date.now() - startTime,
          }
        }
      }
    }

    // Fallback error if all retries failed
    return {
      error: this.transformError(lastError),
      metadata: {
        duration: Date.now() - startTime,
      }
    }
  }

  /**
   * Creates an AbortController with optional timeout
   */
  createAbortController(timeout?: number): { controller: AbortController, timeout?: NodeJS.Timeout } {
    const controller = new AbortController()
    let timeoutId: NodeJS.Timeout | undefined

    if (timeout) {
      timeoutId = setTimeout(() => {
        controller.abort(new Error('Request timeout'))
      }, timeout)
    }

    return { controller, timeout: timeoutId }
  }

  /**
   * Handles retry logic with exponential backoff
   */
  async handleRetry(error: any, attempt: number, config: RequestConfig): Promise<boolean> {
    // Don't retry on certain error types
    if (
      error?.name === 'AbortError' ||
      error?.code === 'UNAUTHORIZED' ||
      error?.code === 'FORBIDDEN' ||
      error?.status === 401 ||
      error?.status === 403 ||
      error?.status === 404
    ) {
      return false
    }

    // Calculate delay with exponential backoff
    const baseDelay = config.retryDelay || 1000
    const delay = Math.min(baseDelay * Math.pow(2, attempt), 10000) // Max 10 seconds
    
    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.1 * delay
    const finalDelay = delay + jitter

    await new Promise(resolve => setTimeout(resolve, finalDelay))
    return true
  }

  /**
   * Transforms errors to consistent format
   */
  transformError(error: any): EdgeFunctionError {
    if (!error) {
      return {
        message: 'Unknown error occurred',
        code: 'UNKNOWN_ERROR'
      }
    }

    // Handle different error formats
    if (error.message && error.code) {
      return {
        message: error.message,
        code: error.code,
        details: error.details,
        originalError: error
      }
    }

    if (error.name === 'AbortError') {
      return {
        message: 'Request was cancelled',
        code: 'REQUEST_CANCELLED',
        originalError: error
      }
    }

    if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
      return {
        message: 'Request timed out',
        code: 'REQUEST_TIMEOUT',
        originalError: error
      }
    }

    // Network errors
    if (error.name === 'NetworkError' || !navigator.onLine) {
      return {
        message: 'Network connection error',
        code: 'NETWORK_ERROR',
        originalError: error
      }
    }

    // HTTP status errors
    if (error.status) {
      const statusMessages: Record<number, string> = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        429: 'Too Many Requests',
        500: 'Internal Server Error',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        504: 'Gateway Timeout'
      }

      return {
        message: statusMessages[error.status] || `HTTP ${error.status}`,
        code: `HTTP_${error.status}`,
        details: error.data || error.body,
        originalError: error
      }
    }

    // Fallback
    return {
      message: error.message || 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      details: error,
      originalError: error
    }
  }

  /**
   * Adds request interceptors for auth and logging
   */
  private async addRequestInterceptors(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Add auth token if available
    const { data: { session } } = await this.supabase.auth.getSession()
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    }

    // Add request ID for tracing
    headers['X-Request-ID'] = crypto.randomUUID()

    return headers
  }

  /**
   * Applies response interceptors for data transformation
   */
  private applyResponseInterceptors<T>(response: EdgeFunctionResponse<T>): EdgeFunctionResponse<T> {
    // Log successful requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        duration: response.metadata?.duration,
        tokens: response.metadata?.tokens_used,
        hasData: !!response.data,
        hasError: !!response.error
      })
    }

    return response
  }

  /**
   * Combines multiple abort signals
   */
  private combineAbortSignals(signals: AbortSignal[]): AbortSignal {
    if (signals.length === 1) return signals[0]
    
    const controller = new AbortController()
    
    signals.forEach(signal => {
      if (signal.aborted) {
        controller.abort(signal.reason)
        return
      }
      
      signal.addEventListener('abort', () => {
        controller.abort(signal.reason)
      }, { once: true })
    })
    
    return controller.signal
  }
}

// Export singleton instance
export const apiClient = new ApiClient(supabase)

// Export for testing or custom instances
export { ApiClient }
