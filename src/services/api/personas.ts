import { apiClient } from './client'
import { invoke } from '@tauri-apps/api/core'
import type { EdgeFunctionResponse } from './client'
import type { Persona, CoreProblem } from '@/stores/workflowStore'

// Persona generation interfaces
export interface PersonaGenerationRequest {
  coreProblem: CoreProblem
  lockedPersonas: Persona[]
  projectId: string
  generationBatch: string
}

export interface PersonaGenerationResponse {
  personas: Persona[]
  generationMetadata: {
    diversityScore: number
    coverageAnalysis: string[]
    generationBatch: string
  }
}

export interface PersonaQualityMetrics {
  painRelevance: number
  uniqueness: number
  actionability: number
  specificity: number
}

interface CachedPersonaBatch {
  personas: Persona[]
  batchId: string
  projectId: string
  timestamp: string
  generationMetadata: PersonaGenerationResponse['generationMetadata']
}

interface StreamingPersonaUpdate {
  type: 'analyzing' | 'generating' | 'diversifying' | 'validating' | 'complete'
  message: string
  progress: number
  currentPersona?: Partial<Persona>
}

class PersonaGenerationService {
  private cache = new Map<string, CachedPersonaBatch>()
  private isOnline = navigator.onLine
  private streamingControllers = new Map<string, AbortController>()

  constructor() {
    // Set up online/offline detection
    window.addEventListener('online', () => {
      this.isOnline = true
    })
    
    window.addEventListener('offline', () => {
      this.isOnline = false
    })

    // Load cached data from localStorage on init
    this.loadFromStorage()
  }

  /**
   * Generates 5 diverse personas while respecting locked personas
   */
  async generatePersonas(request: PersonaGenerationRequest): Promise<PersonaGenerationResponse> {
    // Check cache first
    const cached = await this.getCachedPersonaBatch(request.projectId, request.generationBatch)
    if (cached && this.isCacheValid(cached)) {
      return {
        personas: cached.personas,
        generationMetadata: cached.generationMetadata
      }
    }

    // Validate locked personas diversity
    if (!this.ensurePersonaDiversity([], request.lockedPersonas)) {
      throw new Error('Locked personas lack sufficient diversity for generation')
    }

    try {
      const response = await this.performPersonaGeneration(request)
      
      // Cache successful results
      await this.cachePersonaBatch(response.personas, request.generationBatch, request.projectId, response.generationMetadata)

      // Save to local database via Tauri
      await this.savePersonasToDatabase(response.personas, request.projectId)

      return response
    } catch (error) {
      console.error('Persona generation failed:', error)
      throw error
    }
  }

  /**
   * Regenerates personas with new batch ID
   */
  async regeneratePersonas(request: PersonaGenerationRequest): Promise<PersonaGenerationResponse> {
    // Create new generation batch ID
    const newBatchId = crypto.randomUUID()
    const regenerationRequest = {
      ...request,
      generationBatch: newBatchId
    }

    // Clear cache for this project to force fresh generation
    this.clearProjectCache(request.projectId)

    return this.generatePersonas(regenerationRequest)
  }

  /**
   * Streaming persona generation with real-time updates
   */
  async generatePersonasStreaming(
    request: PersonaGenerationRequest,
    onUpdate: (update: StreamingPersonaUpdate) => void
  ): Promise<PersonaGenerationResponse> {
    const requestId = crypto.randomUUID()
    const controller = new AbortController()
    this.streamingControllers.set(requestId, controller)

    try {
      // Check cache first
      const cached = await this.getCachedPersonaBatch(request.projectId, request.generationBatch)
      if (cached && this.isCacheValid(cached)) {
        onUpdate({
          type: 'complete',
          message: 'Personas found in cache',
          progress: 100
        })
        return {
          personas: cached.personas,
          generationMetadata: cached.generationMetadata
        }
      }

      // Start streaming generation
      onUpdate({
        type: 'analyzing',
        message: 'Analyzing problem context for persona generation...',
        progress: 10
      })

      const response = await apiClient.invokeEdgeFunction<{
        personas: Persona[]
        generationMetadata: PersonaGenerationResponse['generationMetadata']
        stream_updates?: StreamingPersonaUpdate[]
      }>('generate-personas', {
        ...request,
        streaming: true
      }, {
        signal: controller.signal,
        onProgress: (progress: number) => {
          onUpdate({
            type: 'generating',
            message: 'Generating diverse personas...',
            progress: 10 + (progress * 0.7) // Map to 10-80%
          })
        }
      })

      if (response.error) {
        throw new Error(response.error.message)
      }

      const result = {
        personas: response.data!.personas,
        generationMetadata: response.data!.generationMetadata
      }

      // Process stream updates
      if (response.data!.stream_updates) {
        for (const update of response.data!.stream_updates) {
          onUpdate(update)
        }
      }

      onUpdate({
        type: 'complete',
        message: 'Persona generation complete',
        progress: 100
      })

      // Cache and save results
      await this.cachePersonaBatch(result.personas, request.generationBatch, request.projectId, result.generationMetadata)
      await this.savePersonasToDatabase(result.personas, request.projectId)

      return result

    } finally {
      this.streamingControllers.delete(requestId)
    }
  }

  /**
   * Scores persona quality based on problem relevance and other metrics
   */
  scorePersonaQuality(persona: Persona, problem: CoreProblem): PersonaQualityMetrics {
    const problemKeywords = this.extractKeywords(problem.description)
    const personaText = `${persona.name} ${persona.description} ${persona.goals.join(' ')} ${persona.frustrations.join(' ')}`
    const personaKeywords = this.extractKeywords(personaText)

    // Calculate pain relevance based on keyword overlap and semantic similarity
    const keywordOverlap = this.calculateKeywordOverlap(problemKeywords, personaKeywords)
    const painRelevance = Math.max(keywordOverlap, this.calculateSemanticRelevance(problem, persona))

    // Calculate uniqueness based on demographics and psychographics diversity
    const uniqueness = this.calculatePersonaUniqueness(persona)

    // Calculate actionability based on specificity of goals and frustrations
    const actionability = this.calculateActionability(persona)

    // Calculate specificity based on detail level in demographics and descriptions
    const specificity = this.calculateSpecificity(persona)

    return {
      painRelevance: Math.round(painRelevance * 100) / 100,
      uniqueness: Math.round(uniqueness * 100) / 100,
      actionability: Math.round(actionability * 100) / 100,
      specificity: Math.round(specificity * 100) / 100
    }
  }

  /**
   * Ensures persona diversity by analyzing demographics, psychographics, and goals
   */
  ensurePersonaDiversity(personas: Persona[], lockedPersonas: Persona[]): boolean {
    const allPersonas = [...personas, ...lockedPersonas]
    
    if (allPersonas.length === 0) return true
    if (allPersonas.length === 1) return true

    // Check demographic diversity
    const demographicDiversity = this.calculateDemographicDiversity(allPersonas)
    
    // Check psychographic diversity
    const psychographicDiversity = this.calculatePsychographicDiversity(allPersonas)
    
    // Check goal diversity
    const goalDiversity = this.calculateGoalDiversity(allPersonas)

    // Require minimum diversity scores
    const minDiversityThreshold = 0.6
    return (
      demographicDiversity >= minDiversityThreshold &&
      psychographicDiversity >= minDiversityThreshold &&
      goalDiversity >= minDiversityThreshold
    )
  }

  /**
   * Caches persona batch for reuse
   */
  async cachePersonaBatch(
    personas: Persona[], 
    batchId: string, 
    projectId: string,
    generationMetadata: PersonaGenerationResponse['generationMetadata']
  ): Promise<void> {
    const cacheKey = this.generateCacheKey(projectId, batchId)
    const cached: CachedPersonaBatch = {
      personas,
      batchId,
      projectId,
      timestamp: new Date().toISOString(),
      generationMetadata
    }

    this.cache.set(cacheKey, cached)
    await this.saveToStorage()
  }

  /**
   * Cancels streaming persona generation
   */
  cancelStreamingGeneration(requestId?: string): void {
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

  // Private helper methods

  private async performPersonaGeneration(request: PersonaGenerationRequest): Promise<PersonaGenerationResponse> {
    const response = await apiClient.invokeEdgeFunction<PersonaGenerationResponse>('generate-personas', request)

    if (response.error) {
      throw new Error(response.error.message)
    }

    return response.data!
  }

  private async getCachedPersonaBatch(projectId: string, batchId: string): Promise<CachedPersonaBatch | null> {
    const cacheKey = this.generateCacheKey(projectId, batchId)
    return this.cache.get(cacheKey) || null
  }

  private isCacheValid(cached: CachedPersonaBatch): boolean {
    const maxAge = 1000 * 60 * 60 * 24 // 24 hours
    const age = Date.now() - new Date(cached.timestamp).getTime()
    return age < maxAge
  }

  private generateCacheKey(projectId: string, batchId: string): string {
    return `personas_${projectId}_${batchId}`
  }

  private clearProjectCache(projectId: string): void {
    for (const [key, cached] of this.cache) {
      if (cached.projectId === projectId) {
        this.cache.delete(key)
      }
    }
    this.saveToStorage()
  }

  private async savePersonasToDatabase(personas: Persona[], projectId: string): Promise<void> {
    try {
      for (const persona of personas) {
        await invoke('save_persona', { persona, projectId })
      }
    } catch (error) {
      console.error('Failed to save personas to database:', error)
      throw error
    }
  }

  private extractKeywords(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['this', 'that', 'with', 'from', 'they', 'them', 'their', 'have', 'been', 'will'].includes(word))
  }

  private calculateKeywordOverlap(keywords1: string[], keywords2: string[]): number {
    const set1 = new Set(keywords1)
    const set2 = new Set(keywords2)
    const intersection = new Set([...set1].filter(x => set2.has(x)))
    const union = new Set([...set1, ...set2])
    
    return union.size > 0 ? intersection.size / union.size : 0
  }

  private calculateSemanticRelevance(problem: CoreProblem, persona: Persona): number {
    // Simple semantic relevance based on common themes
    const problemThemes = this.extractThemes(problem.description)
    const personaThemes = this.extractThemes(`${persona.description} ${persona.goals.join(' ')} ${persona.frustrations.join(' ')}`)
    
    let relevanceScore = 0
    for (const theme of problemThemes) {
      if (personaThemes.includes(theme)) {
        relevanceScore += 0.2
      }
    }
    
    return Math.min(relevanceScore, 1.0)
  }

  private extractThemes(text: string): string[] {
    const themes = []
    const lowerText = text.toLowerCase()
    
    // Technology themes
    if (/tech|software|app|digital|online|web|mobile/.test(lowerText)) themes.push('technology')
    if (/work|job|career|professional|business/.test(lowerText)) themes.push('work')
    if (/health|fitness|wellness|medical/.test(lowerText)) themes.push('health')
    if (/money|finance|budget|cost|expensive/.test(lowerText)) themes.push('finance')
    if (/time|busy|schedule|quick|fast/.test(lowerText)) themes.push('time')
    if (/family|kids|children|parent/.test(lowerText)) themes.push('family')
    if (/learn|education|study|skill/.test(lowerText)) themes.push('education')
    
    return themes
  }

  private calculatePersonaUniqueness(persona: Persona): number {
    // Score based on diversity of demographics and psychographics
    let uniquenessScore = 0.5 // Base score
    
    // Add points for specific demographics
    const demographics = Object.keys(persona.demographics)
    uniquenessScore += Math.min(demographics.length * 0.1, 0.3)
    
    // Add points for specific psychographics
    const psychographics = Object.keys(persona.psychographics)
    uniquenessScore += Math.min(psychographics.length * 0.1, 0.2)
    
    return Math.min(uniquenessScore, 1.0)
  }

  private calculateActionability(persona: Persona): number {
    // Score based on specificity and actionability of goals and frustrations
    let actionabilityScore = 0
    
    // Score goals
    const specificGoals = persona.goals.filter((goal: string) => goal.length > 20 && /\b(want|need|achieve|improve|get|find)\b/i.test(goal))
    actionabilityScore += Math.min(specificGoals.length * 0.25, 0.5)
    
    // Score frustrations
    const specificFrustrations = persona.frustrations.filter((frustration: string) => 
      frustration.length > 20 && /\b(difficult|hard|frustrating|annoying|time-consuming)\b/i.test(frustration)
    )
    actionabilityScore += Math.min(specificFrustrations.length * 0.25, 0.5)
    
    return Math.min(actionabilityScore, 1.0)
  }

  private calculateSpecificity(persona: Persona): number {
    // Score based on detail level in descriptions and data
    let specificityScore = 0
    
    // Score description length and detail
    if (persona.description.length > 100) specificityScore += 0.3
    if (persona.description.length > 200) specificityScore += 0.2
    
    // Score demographic specificity
    const demographicValues = Object.values(persona.demographics)
    const specificDemographics = demographicValues.filter(value => 
      typeof value === 'string' && value.length > 5
    )
    specificityScore += Math.min(specificDemographics.length * 0.1, 0.3)
    
    // Score psychographic specificity
    const psychographicValues = Object.values(persona.psychographics)
    const specificPsychographics = psychographicValues.filter(value => 
      typeof value === 'string' && value.length > 10
    )
    specificityScore += Math.min(specificPsychographics.length * 0.1, 0.2)
    
    return Math.min(specificityScore, 1.0)
  }

  private calculateDemographicDiversity(personas: Persona[]): number {
    if (personas.length <= 1) return 1.0
    
    const demographicFields = ['age', 'gender', 'location', 'occupation', 'income']
    let diversitySum = 0
    
    for (const field of demographicFields) {
      const values = personas
        .map(p => p.demographics[field])
        .filter(v => v !== undefined && v !== null)
      
      const uniqueValues = new Set(values)
      const diversity = values.length > 0 ? uniqueValues.size / values.length : 0
      diversitySum += diversity
    }
    
    return diversitySum / demographicFields.length
  }

  private calculatePsychographicDiversity(personas: Persona[]): number {
    if (personas.length <= 1) return 1.0
    
    const psychographicFields = ['personality', 'values', 'lifestyle', 'interests']
    let diversitySum = 0
    
    for (const field of psychographicFields) {
      const values = personas
        .map(p => p.psychographics[field])
        .filter(v => v !== undefined && v !== null)
      
      const uniqueValues = new Set(values)
      const diversity = values.length > 0 ? uniqueValues.size / values.length : 0
      diversitySum += diversity
    }
    
    return diversitySum / psychographicFields.length
  }

  private calculateGoalDiversity(personas: Persona[]): number {
    if (personas.length <= 1) return 1.0
    
    const allGoals = personas.flatMap(p => p.goals)
    const uniqueGoals = new Set(allGoals.map(goal => goal.toLowerCase().trim()))
    
    return allGoals.length > 0 ? uniqueGoals.size / allGoals.length : 0
  }

  private async saveToStorage(): Promise<void> {
    try {
      const cacheData = Array.from(this.cache.entries())
      localStorage.setItem('personaGenerationCache', JSON.stringify(cacheData))
    } catch (error) {
      console.warn('Failed to save persona cache to localStorage:', error)
    }
  }

  private loadFromStorage(): void {
    try {
      const cacheData = localStorage.getItem('personaGenerationCache')
      if (cacheData) {
        const parsed = JSON.parse(cacheData)
        this.cache = new Map(parsed)
      }
    } catch (error) {
      console.warn('Failed to load persona cache from localStorage:', error)
      this.cache = new Map()
    }
  }
}

// Export singleton instance
export const personaService = new PersonaGenerationService()

// Export individual methods for tree-shaking
export const {
  generatePersonas,
  regeneratePersonas,
  generatePersonasStreaming,
  scorePersonaQuality,
  ensurePersonaDiversity,
  cachePersonaBatch,
  cancelStreamingGeneration
} = personaService
