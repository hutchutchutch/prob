import { apiClient } from './client'
import type { Solution, PainPoint, Persona, SolutionPainPointMapping } from '@/types/database.types'
import type { CoreProblem } from '@/types/workflow.types'

export interface SolutionGenerationRequest {
  coreProblem: CoreProblem
  personas: Persona[]
  painPoints: PainPoint[]
}

export interface SolutionGenerationResponse {
  solutions: Array<{
    id: string
    title: string
    description: string
    complexity: 'low' | 'medium' | 'high'
    impact: 'low' | 'medium' | 'high'
    aligned_personas: string[]
  }>
}

export interface SolutionAnalysis {
  technicalFeasibility: number
  businessValue: number
  implementationComplexity: 'low' | 'medium' | 'high'
  estimatedEffort: string
}

export class SolutionsService {
  /**
   * Generates solutions based on core problem, personas and pain points
   */
  async generateSolutions(request: SolutionGenerationRequest): Promise<SolutionGenerationResponse> {
    console.log('[SolutionsService] Calling generate-solutions edge function with:', {
      coreProblem: request.coreProblem.validatedProblem || request.coreProblem.originalInput,
      personasCount: request.personas.length,
      painPointsCount: request.painPoints.length
    });

    const edgeFunctionPayload = {
      coreProblem: {
        id: request.coreProblem.id,
        validated_problem: request.coreProblem.validatedProblem || request.coreProblem.originalInput
      },
      personas: request.personas.map(p => ({
        id: p.id,
        name: p.name,
        role: p.demographics?.role || 'Unknown',
        industry: p.demographics?.industry || 'Unknown',
        description: p.description
      })),
      painPoints: request.painPoints.map(pp => {
        // Handle both number and string severity types
        const severityNum = typeof pp.severity === 'number' ? pp.severity : 
                           pp.severity === 'high' ? 8 : pp.severity === 'medium' ? 5 : 3;
        return {
          id: pp.id,
          description: pp.description,
          severity: severityNum <= 3 ? 'low' : severityNum <= 6 ? 'medium' : 'high',
          persona_id: pp.persona_id
        }
      })
    }
    
    console.log('[SolutionsService] Edge function payload:', edgeFunctionPayload)
    console.log('[SolutionsService] Payload JSON string:', JSON.stringify(edgeFunctionPayload))
    
    const response = await apiClient.invokeEdgeFunction<SolutionGenerationResponse>(
      'generate-solutions',
      edgeFunctionPayload
    )

    if (response.error) {
      console.error('[SolutionsService] Edge function error:', response.error);
      throw new Error(`Solution generation failed: ${response.error.message}`)
    }

    if (!response.data) {
      console.error('[SolutionsService] No data in response');
      throw new Error('No solution data received')
    }

    console.log('[SolutionsService] Solutions generated:', response.data.solutions);
    return response.data
  }

  /**
   * Calculates relevance scores between solutions and pain points
   */
  calculateRelevanceScores(solution: Solution, painPoints: PainPoint[]): SolutionPainPointMapping[] {
    return painPoints.map(painPoint => {
      // Calculate relevance based on keywords, categories, and semantic similarity
      const relevanceScore = this.calculateRelevanceScore(solution, painPoint)
      
      return {
        id: `${solution.id}-${painPoint.id}`,
        solution_id: solution.id,
        pain_point_id: painPoint.id,
        relevance_score: relevanceScore,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    })
  }

  /**
   * Analyzes solution complexity and provides detailed metrics
   */
  analyzeSolutionComplexity(solution: Solution): SolutionAnalysis {
    // Analyze technical complexity based on solution description and requirements
    const technicalFeasibility = this.assessTechnicalFeasibility(solution)
    const businessValue = this.assessBusinessValue(solution)
    const implementationComplexity = this.assessImplementationComplexity(solution)
    const estimatedEffort = this.generateImplementationEstimate(solution, implementationComplexity)

    return {
      technicalFeasibility,
      businessValue,
      implementationComplexity,
      estimatedEffort,
    }
  }

  /**
   * Generates implementation time estimates based on solution complexity
   */
  generateImplementationEstimate(solution: Solution, complexity: string): string {
    const baseEstimates = {
      low: { min: 1, max: 4, unit: 'weeks' },
      medium: { min: 1, max: 3, unit: 'months' },
      high: { min: 3, max: 12, unit: 'months' },
    }

    const estimate = baseEstimates[complexity as keyof typeof baseEstimates]
    
    if (estimate.min === estimate.max) {
      return `${estimate.min} ${estimate.unit}`
    }
    
    return `${estimate.min}-${estimate.max} ${estimate.unit}`
  }

  /**
   * Ranks solutions by business value and relevance
   */
  rankSolutionsByValue(solutions: Solution[], mappings: SolutionPainPointMapping[]): Solution[] {
    return solutions
      .map(solution => {
        const solutionMappings = mappings.filter(m => m.solution_id === solution.id)
        const avgRelevanceScore = solutionMappings.length > 0
          ? solutionMappings.reduce((sum, m) => sum + m.relevance_score, 0) / solutionMappings.length
          : 0

        const analysis = this.analyzeSolutionComplexity(solution)
        
        // Composite score: business value + relevance - complexity penalty
        const complexityPenalty = analysis.implementationComplexity === 'high' ? 0.2 : 
                                 analysis.implementationComplexity === 'medium' ? 0.1 : 0
        
        const compositeScore = (analysis.businessValue * 0.4) + 
                              (avgRelevanceScore * 0.4) + 
                              (analysis.technicalFeasibility * 0.2) - 
                              complexityPenalty

        return { solution, compositeScore }
      })
      .sort((a, b) => b.compositeScore - a.compositeScore)
      .map(item => item.solution)
  }

  /**
   * Calculates relevance score between a solution and pain point
   */
  private calculateRelevanceScore(solution: Solution, painPoint: PainPoint): number {
    // This would typically use semantic similarity, keyword matching, etc.
    // For now, implementing a simple keyword-based approach
    const solutionText = `${solution.title} ${solution.description}`.toLowerCase()
    const painPointText = `${painPoint.title} ${painPoint.description}`.toLowerCase()
    
    // Simple keyword overlap scoring
    const solutionWords = new Set(solutionText.split(/\s+/).filter(w => w.length > 3))
    const painPointWords = new Set(painPointText.split(/\s+/).filter(w => w.length > 3))
    
    const intersection = new Set([...solutionWords].filter(w => painPointWords.has(w)))
    const union = new Set([...solutionWords, ...painPointWords])
    
    // Jaccard similarity with boost for exact matches
    const jaccardSimilarity = intersection.size / union.size
    const exactMatchBoost = solutionText.includes(painPointText) || painPointText.includes(solutionText) ? 0.2 : 0
    
    return Math.min(1.0, jaccardSimilarity + exactMatchBoost)
  }

  /**
   * Assesses technical feasibility of a solution
   */
  private assessTechnicalFeasibility(solution: Solution): number {
    // Analyze technical requirements, dependencies, and implementation complexity
    const description = solution.description?.toLowerCase() || ''
    
    // Simple heuristic based on keywords indicating complexity
    const complexityIndicators = [
      'ai', 'machine learning', 'blockchain', 'quantum',
      'real-time', 'distributed', 'microservices', 'scale'
    ]
    
    const simplicityIndicators = [
      'simple', 'basic', 'straightforward', 'minimal',
      'standard', 'conventional', 'existing'
    ]
    
    let score = 0.7 // Base feasibility score
    
    complexityIndicators.forEach(indicator => {
      if (description.includes(indicator)) score -= 0.1
    })
    
    simplicityIndicators.forEach(indicator => {
      if (description.includes(indicator)) score += 0.1
    })
    
    return Math.max(0.1, Math.min(1.0, score))
  }

  /**
   * Assesses business value of a solution
   */
  private assessBusinessValue(solution: Solution): number {
    const description = solution.description?.toLowerCase() || ''
    
    // Keywords indicating high business value
    const highValueIndicators = [
      'revenue', 'cost savings', 'efficiency', 'automation',
      'user experience', 'customer satisfaction', 'competitive advantage'
    ]
    
    const mediumValueIndicators = [
      'improvement', 'optimization', 'streamline', 'enhance',
      'productivity', 'quality', 'performance'
    ]
    
    let score = 0.5 // Base business value score
    
    highValueIndicators.forEach(indicator => {
      if (description.includes(indicator)) score += 0.15
    })
    
    mediumValueIndicators.forEach(indicator => {
      if (description.includes(indicator)) score += 0.1
    })
    
    return Math.max(0.1, Math.min(1.0, score))
  }

  /**
   * Assesses implementation complexity
   */
  private assessImplementationComplexity(solution: Solution): 'low' | 'medium' | 'high' {
    const description = solution.description?.toLowerCase() || ''
    
    const highComplexityIndicators = [
      'ai', 'machine learning', 'blockchain', 'distributed',
      'microservices', 'real-time', 'complex algorithm'
    ]
    
    const lowComplexityIndicators = [
      'simple', 'basic', 'straightforward', 'minimal',
      'configuration', 'existing tool', 'off-the-shelf'
    ]
    
    const highComplexityCount = highComplexityIndicators.filter(indicator => 
      description.includes(indicator)
    ).length
    
    const lowComplexityCount = lowComplexityIndicators.filter(indicator => 
      description.includes(indicator)
    ).length
    
    if (highComplexityCount > lowComplexityCount && highComplexityCount >= 2) {
      return 'high'
    } else if (lowComplexityCount > highComplexityCount && lowComplexityCount >= 2) {
      return 'low'
    } else {
      return 'medium'
    }
  }
}

// Export singleton instance
export const solutionsService = new SolutionsService()
