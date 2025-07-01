import { tauriAPI } from '@/services/tauri/api'
import type { 
  Project, 
  Persona, 
  Solution, 
  PainPoint,
  SolutionPainPointMapping 
} from '@/types/database.types'

// Extended types for export functionality
export interface CoreProblem {
  id: string
  project_id: string
  validated_problem: string
  created_at: string
  updated_at: string
}

export interface UserStory {
  id: string
  project_id: string
  persona_id: string
  title: string
  as_a: string
  i_want: string
  so_that: string
  acceptance_criteria: string[]
  technical_notes?: string
  created_at: string
  updated_at: string
}

export interface SystemArchitecture {
  id: string
  project_id: string
  layer: string
  technology: string
  justification: string
  created_at: string
  updated_at: string
}

export interface DesignToken {
  id: string
  project_id: string
  category: 'color' | 'typography' | 'spacing'
  name: string
  value: string
  description?: string
  created_at: string
  updated_at: string
}

export interface AtomicComponent {
  id: string
  project_id: string
  type: 'atom' | 'molecule' | 'organism'
  name: string
  description: string
  props: Record<string, any>
  created_at: string
  updated_at: string
}

export interface DataFlow {
  id: string
  project_id: string
  name: string
  description: string
  user_story_id: string
  created_at: string
  updated_at: string
}

export interface DataFlowStep {
  id: string
  data_flow_id: string
  sequence: number
  description: string
  actor: string
  action: string
  created_at: string
  updated_at: string
}

export interface DatabaseTable {
  id: string
  project_id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface DatabaseColumn {
  id: string
  table_id: string
  name: string
  type: string
  constraints: string[]
  description?: string
  created_at: string
  updated_at: string
}

export interface DatabaseRelationship {
  id: string
  from_table_id: string
  to_table_id: string
  relationship_type: 'one_to_one' | 'one_to_many' | 'many_to_many'
  description?: string
  created_at: string
  updated_at: string
}

export interface ExportRequest {
  projectId: string
  exportFormat: 'markdown'
  includeFiles: {
    productVision: boolean
    userEpics: boolean
    systemArchitecture: boolean
    designSystem: boolean
    dataFlow: boolean
    entityRelationshipDiagram: boolean
  }
}

export interface ExportResponse {
  files: ExportedFile[]
  metadata: {
    exportDate: Date
    projectName: string
    totalFiles: number
  }
}

export interface ExportedFile {
  filename: string
  content: string
  type: 'markdown'
}

interface ProjectData {
  project: Project
  coreProblem?: CoreProblem
  personas: Persona[]
  painPoints: PainPoint[]
  solutions: Solution[]
  solutionMappings: SolutionPainPointMapping[]
  userStories: UserStory[]
}

interface Section {
  title: string
  level: number
  anchor: string
}

interface Reference {
  source: string
  target: string
  text: string
}

class ExportService {
  /**
   * Main export method - generates all requested documents
   */
  async exportProject(request: ExportRequest): Promise<ExportResponse> {
    try {
      // Gather all project data
      const projectData = await this.gatherProjectData(request.projectId)
      const files: ExportedFile[] = []

      // Generate requested documents
      if (request.includeFiles.productVision) {
        files.push({
          filename: 'product_vision.md',
          content: this.generateProductVision(projectData),
          type: 'markdown'
        })
      }

      if (request.includeFiles.userEpics) {
        files.push({
          filename: 'user_epics.md',
          content: this.generateUserEpics(projectData.userStories, projectData.personas),
          type: 'markdown'
        })
      }

      if (request.includeFiles.systemArchitecture) {
        const architectureData = await this.getSystemArchitecture(request.projectId)
        files.push({
          filename: 'system_architecture.md',
          content: this.generateSystemArchitecture(architectureData),
          type: 'markdown'
        })
      }

      if (request.includeFiles.designSystem) {
        const designTokens = await this.getDesignTokens(request.projectId)
        const components = await this.getAtomicComponents(request.projectId)
        files.push({
          filename: 'design_system.md',
          content: this.generateDesignSystem(designTokens, components),
          type: 'markdown'
        })
      }

      if (request.includeFiles.dataFlow) {
        const dataFlows = await this.getDataFlows(request.projectId)
        const dataFlowSteps = await this.getDataFlowSteps(request.projectId)
        files.push({
          filename: 'data_flow.md',
          content: this.generateDataFlow(dataFlows, dataFlowSteps),
          type: 'markdown'
        })
      }

      if (request.includeFiles.entityRelationshipDiagram) {
        const tables = await this.getDatabaseTables(request.projectId)
        const columns = await this.getDatabaseColumns(request.projectId)
        const relationships = await this.getDatabaseRelationships(request.projectId)
        files.push({
          filename: 'entity_relationship_diagram.md',
          content: this.generateEntityRelationshipDiagram(tables, columns, relationships),
          type: 'markdown'
        })
      }

      return {
        files,
        metadata: {
          exportDate: new Date(),
          projectName: projectData.project.name,
          totalFiles: files.length
        }
      }
    } catch (error) {
      console.error('Export failed:', error)
      throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Generate Product Vision document
   */
  generateProductVision(projectData: ProjectData): string {
    const { project, coreProblem, personas, solutions, painPoints } = projectData
    
    let content = `# Product Vision - ${project.name}\n\n`
    content += `## Executive Summary\n\n`
    
    if (coreProblem) {
      content += `${coreProblem.validated_problem}\n\n`
    }
    
    content += `## Problem Statement\n\n`
    if (coreProblem) {
      content += `${coreProblem.validated_problem}\n\n`
    }
    
    content += `## Target Personas\n\n`
    personas.forEach(persona => {
      content += `### ${persona.name}\n`
      content += `${persona.description}\n\n`
      content += `**Goals:**\n`
      persona.goals.forEach(goal => content += `- ${goal}\n`)
      content += `\n**Frustrations:**\n`
      persona.frustrations.forEach(frustration => content += `- ${frustration}\n`)
      content += `\n`
    })
    
    content += `## Proposed Solution\n\n`
    solutions.forEach(solution => {
      content += `### ${solution.title}\n`
      content += `${solution.description}\n\n`
    })
    
    content += `## Key Features\n\n`
    solutions.forEach(solution => {
      content += `- **${solution.title}**: ${solution.description}\n`
    })
    
    content += `\n## Success Metrics\n\n`
    const highPainPoints = painPoints.filter(p => p.severity === 'high')
    highPainPoints.forEach(painPoint => {
      content += `- Reduce ${painPoint.title.toLowerCase()} incidents by addressing ${painPoint.description}\n`
    })
    
    return content
  }

  /**
   * Generate User Epics document
   */
  generateUserEpics(userStories: UserStory[], personas: Persona[]): string {
    let content = `# User Epics\n\n`
    content += `## Epic Overview\n\n`
    content += `This document contains all user stories organized by persona and feature area.\n\n`
    
    content += `## Detailed User Stories\n\n`
    
    userStories.forEach((story, index) => {
      const persona = personas.find(p => p.id === story.persona_id)
      content += `### Story ${index + 1}: ${story.title}\n\n`
      content += `**As a** ${story.as_a}\n`
      content += `**I want** ${story.i_want}\n`
      content += `**So that** ${story.so_that}\n\n`
      
      content += `**Persona:** ${persona?.name || 'Unknown'}\n\n`
      
      content += `**Acceptance Criteria:**\n`
      story.acceptance_criteria.forEach(criteria => {
        content += `- [ ] ${criteria}\n`
      })
      
      if (story.technical_notes) {
        content += `\n**Technical Notes:**\n${story.technical_notes}\n`
      }
      
      content += `\n---\n\n`
    })
    
    return content
  }

  /**
   * Generate System Architecture document
   */
  generateSystemArchitecture(architecture: SystemArchitecture[]): string {
    let content = `# System Architecture\n\n`
    content += `## Technology Stack\n\n`
    
    const headers = ['Layer', 'Technology', 'Justification']
    const rows = architecture.map(arch => [arch.layer, arch.technology, arch.justification])
    content += this.formatMarkdownTable(headers, rows)
    
    content += `\n## Architecture Diagram\n\n`
    content += this.generateMermaidDiagram('flow', architecture)
    
    content += `\n## Component Details\n\n`
    architecture.forEach(arch => {
      content += `### ${arch.layer}\n`
      content += `**Technology:** ${arch.technology}\n\n`
      content += `**Justification:** ${arch.justification}\n\n`
    })
    
    content += `## Integration Points\n\n`
    content += `Components communicate through well-defined interfaces and APIs as shown in the architecture diagram above.\n\n`
    
    return content
  }

  /**
   * Generate Design System document
   */
  generateDesignSystem(designTokens: DesignToken[], components: AtomicComponent[]): string {
    let content = `# Design System\n\n`
    content += `## Design Principles\n\n`
    content += `- Consistency: Maintain visual and functional consistency across all interfaces\n`
    content += `- Accessibility: Ensure all components meet WCAG 2.1 AA standards\n`
    content += `- Scalability: Design for growth and reusability\n`
    content += `- User-Centered: Prioritize user needs and usability\n\n`
    
    content += `## Design Tokens\n\n`
    
    const colorTokens = designTokens.filter(t => t.category === 'color')
    if (colorTokens.length > 0) {
      content += `### Colors\n\n`
      const headers = ['Name', 'Value', 'Description']
      const rows = colorTokens.map(token => [token.name, token.value, token.description || ''])
      content += this.formatMarkdownTable(headers, rows)
      content += `\n`
    }
    
    const typographyTokens = designTokens.filter(t => t.category === 'typography')
    if (typographyTokens.length > 0) {
      content += `### Typography\n\n`
      const headers = ['Name', 'Value', 'Description']
      const rows = typographyTokens.map(token => [token.name, token.value, token.description || ''])
      content += this.formatMarkdownTable(headers, rows)
      content += `\n`
    }
    
    const spacingTokens = designTokens.filter(t => t.category === 'spacing')
    if (spacingTokens.length > 0) {
      content += `### Spacing\n\n`
      const headers = ['Name', 'Value', 'Description']
      const rows = spacingTokens.map(token => [token.name, token.value, token.description || ''])
      content += this.formatMarkdownTable(headers, rows)
      content += `\n`
    }
    
    content += `## Component Library\n\n`
    
    const atoms = components.filter(c => c.type === 'atom')
    if (atoms.length > 0) {
      content += `### Atoms\n\n`
      atoms.forEach(component => {
        content += `#### ${component.name}\n`
        content += `${component.description}\n\n`
      })
    }
    
    const molecules = components.filter(c => c.type === 'molecule')
    if (molecules.length > 0) {
      content += `### Molecules\n\n`
      molecules.forEach(component => {
        content += `#### ${component.name}\n`
        content += `${component.description}\n\n`
      })
    }
    
    const organisms = components.filter(c => c.type === 'organism')
    if (organisms.length > 0) {
      content += `### Organisms\n\n`
      organisms.forEach(component => {
        content += `#### ${component.name}\n`
        content += `${component.description}\n\n`
      })
    }
    
    return content
  }

  /**
   * Generate Data Flow document
   */
  generateDataFlow(dataFlows: DataFlow[], dataFlowSteps: DataFlowStep[]): string {
    let content = `# Data Flow\n\n`
    content += `## Overview\n\n`
    content += `This document describes the data flows throughout the application, showing how information moves between different components and systems.\n\n`
    
    content += `## Detailed Flows\n\n`
    
    dataFlows.forEach(flow => {
      content += `### Flow: ${flow.name}\n\n`
      content += `${flow.description}\n\n`
      
      const steps = dataFlowSteps
        .filter(step => step.data_flow_id === flow.id)
        .sort((a, b) => a.sequence - b.sequence)
      
      if (steps.length > 0) {
        content += this.generateMermaidDiagram('sequence', { flow, steps })
        content += `\n**Steps:**\n`
        steps.forEach((step, index) => {
          content += `${index + 1}. **${step.actor}** ${step.action}: ${step.description}\n`
        })
        content += `\n`
      }
    })
    
    return content
  }

  /**
   * Generate Entity Relationship Diagram document
   */
  generateEntityRelationshipDiagram(
    tables: DatabaseTable[], 
    columns: DatabaseColumn[], 
    relationships: DatabaseRelationship[]
  ): string {
    let content = `# Entity Relationship Diagram\n\n`
    content += `## Database Schema Overview\n\n`
    content += `This document describes the database schema including all tables, columns, and relationships.\n\n`
    
    content += `## ERD Diagram\n\n`
    content += this.generateMermaidDiagram('erd', { tables, columns, relationships })
    
    content += `\n## Table Definitions\n\n`
    
    tables.forEach(table => {
      content += `### Table: ${table.name}\n\n`
      if (table.description) {
        content += `${table.description}\n\n`
      }
      
      const tableColumns = columns.filter(col => col.table_id === table.id)
      if (tableColumns.length > 0) {
        const headers = ['Column', 'Type', 'Constraints', 'Description']
        const rows = tableColumns.map(col => [
          col.name,
          col.type,
          col.constraints.join(', '),
          col.description || ''
        ])
        content += this.formatMarkdownTable(headers, rows)
        content += `\n`
      }
    })
    
    content += `## Relationships\n\n`
    relationships.forEach(rel => {
      const fromTable = tables.find(t => t.id === rel.from_table_id)
      const toTable = tables.find(t => t.id === rel.to_table_id)
      content += `- **${fromTable?.name}** ${rel.relationship_type.replace('_', ' ')} **${toTable?.name}**`
      if (rel.description) {
        content += `: ${rel.description}`
      }
      content += `\n`
    })
    
    return content
  }

  /**
   * Format data as a markdown table
   */
  formatMarkdownTable(headers: string[], rows: string[][]): string {
    let table = `| ${headers.join(' | ')} |\n`
    table += `| ${headers.map(() => '---').join(' | ')} |\n`
    rows.forEach(row => {
      table += `| ${row.join(' | ')} |\n`
    })
    return table
  }

  /**
   * Generate Mermaid diagrams based on type and data
   */
  generateMermaidDiagram(type: 'flow' | 'erd' | 'sequence', data: any): string {
    switch (type) {
      case 'flow':
        return this.generateFlowDiagram(data)
      case 'erd':
        return this.generateERDDiagram(data)
      case 'sequence':
        return this.generateSequenceDiagram(data)
      default:
        return '```mermaid\ngraph TD\n  A[Diagram not available]\n```\n'
    }
  }

  private generateFlowDiagram(architecture: SystemArchitecture[]): string {
    let diagram = '```mermaid\ngraph TD\n'
    architecture.forEach((arch, index) => {
      const nodeId = `${arch.layer.replace(/\s+/g, '')}`
      diagram += `  ${nodeId}["${arch.layer}<br/>${arch.technology}"]\n`
    })
    diagram += '```\n'
    return diagram
  }

  private generateERDDiagram(data: { tables: DatabaseTable[], relationships: DatabaseRelationship[] }): string {
    let diagram = '```mermaid\nerDiagram\n'
    data.tables.forEach(table => {
      diagram += `  ${table.name.toUpperCase()} {\n`
      diagram += `    string id PK\n`
      diagram += `    string name\n`
      diagram += `  }\n`
    })
    data.relationships.forEach(rel => {
      const fromTable = data.tables.find(t => t.id === rel.from_table_id)
      const toTable = data.tables.find(t => t.id === rel.to_table_id)
      if (fromTable && toTable) {
        const relType = rel.relationship_type === 'one_to_many' ? '||--o{' : '||--||'
        diagram += `  ${fromTable.name.toUpperCase()} ${relType} ${toTable.name.toUpperCase()} : ${rel.relationship_type}\n`
      }
    })
    diagram += '```\n'
    return diagram
  }

  private generateSequenceDiagram(data: { flow: DataFlow, steps: DataFlowStep[] }): string {
    let diagram = '```mermaid\nsequenceDiagram\n'
    const actors = new Set(data.steps.map(step => step.actor))
    actors.forEach(actor => {
      diagram += `  participant ${actor.replace(/\s+/g, '')}\n`
    })
    data.steps.forEach(step => {
      const actor = step.actor.replace(/\s+/g, '')
      diagram += `  ${actor}->>${actor}: ${step.description}\n`
    })
    diagram += '```\n'
    return diagram
  }

  /**
   * Create table of contents from sections
   */
  createTableOfContents(sections: Section[]): string {
    let toc = '## Table of Contents\n\n'
    sections.forEach(section => {
      const indent = '  '.repeat(section.level - 1)
      toc += `${indent}- [${section.title}](#${section.anchor})\n`
    })
    return toc + '\n'
  }

  /**
   * Add cross-references to content
   */
  addCrossReferences(content: string, references: Reference[]): string {
    let updatedContent = content
    references.forEach(ref => {
      const linkText = `[${ref.text}](#${ref.target})`
      updatedContent = updatedContent.replace(ref.source, linkText)
    })
    return updatedContent
  }

  // Data gathering methods (to be implemented with actual Tauri commands)
  private async gatherProjectData(projectId: string): Promise<ProjectData> {
    // TODO: Implement with actual Tauri API calls
    return {
      project: { id: projectId, name: 'Sample Project' } as Project,
      personas: [],
      painPoints: [],
      solutions: [],
      solutionMappings: [],
      userStories: []
    }
  }

  private async getSystemArchitecture(projectId: string): Promise<SystemArchitecture[]> {
    // TODO: Implement with actual Tauri API call
    return []
  }

  private async getDesignTokens(projectId: string): Promise<DesignToken[]> {
    // TODO: Implement with actual Tauri API call
    return []
  }

  private async getAtomicComponents(projectId: string): Promise<AtomicComponent[]> {
    // TODO: Implement with actual Tauri API call
    return []
  }

  private async getDataFlows(projectId: string): Promise<DataFlow[]> {
    // TODO: Implement with actual Tauri API call
    return []
  }

  private async getDataFlowSteps(projectId: string): Promise<DataFlowStep[]> {
    // TODO: Implement with actual Tauri API call
    return []
  }

  private async getDatabaseTables(projectId: string): Promise<DatabaseTable[]> {
    // TODO: Implement with actual Tauri API call
    return []
  }

  private async getDatabaseColumns(projectId: string): Promise<DatabaseColumn[]> {
    // TODO: Implement with actual Tauri API call
    return []
  }

  private async getDatabaseRelationships(projectId: string): Promise<DatabaseRelationship[]> {
    // TODO: Implement with actual Tauri API call
    return []
  }
}

export const exportAPI = new ExportService()
