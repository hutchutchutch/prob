import type { ExportOptions } from '../../types/export.types';

interface ProjectData {
  problem: any;
  personas: any[];
  painPoints: any[];
  solutions: any[];
  userStories: any[];
  documents: {
    productVision?: string;
    functionalRequirements?: string;
    systemArchitecture?: string;
    dataFlow?: string;
    databaseSchema?: string;
    designSystem?: string;
  };
}

export const jsonExporter = async (
  projectData: ProjectData,
  options: ExportOptions
): Promise<{ content: string; size: number }> => {
  const exportData: any = {
    metadata: {
      exportDate: new Date().toISOString(),
      exportVersion: '1.0.0',
      template: options.template,
      format: 'json'
    }
  };

  // Add sections based on options
  if (options.sections.includes('problem')) {
    exportData.problem = {
      id: projectData.problem.id,
      content: projectData.problem.content,
      validatedStatement: projectData.problem.validated_statement,
      createdAt: projectData.problem.created_at,
      updatedAt: projectData.problem.updated_at
    };
  }

  if (options.sections.includes('personas')) {
    exportData.personas = projectData.personas.map(persona => ({
      id: persona.id,
      name: persona.name,
      role: persona.role,
      description: persona.description,
      painDegree: persona.pain_degree,
      goals: persona.goals,
      frustrations: persona.frustrations,
      createdAt: persona.created_at
    }));
  }

  if (options.sections.includes('painPoints')) {
    exportData.painPoints = projectData.painPoints.map(painPoint => ({
      id: painPoint.id,
      title: painPoint.title,
      description: painPoint.description,
      severity: painPoint.severity,
      affectedPersonas: painPoint.affected_personas || [],
      createdAt: painPoint.created_at
    }));
  }

  if (options.sections.includes('solutions')) {
    exportData.solutions = projectData.solutions.map(solution => ({
      id: solution.id,
      title: solution.title,
      description: solution.description,
      votingResults: solution.voting_results || null,
      mustHaveFeatures: solution.must_have_features || [],
      priority: solution.priority,
      createdAt: solution.created_at
    }));
  }

  if (options.sections.includes('userStories')) {
    exportData.userStories = projectData.userStories.map(story => ({
      id: story.id,
      asA: story.as_a,
      iWant: story.i_want,
      soThat: story.so_that,
      acceptanceCriteria: story.acceptance_criteria || [],
      priority: story.priority,
      solutionId: story.solution_id,
      createdAt: story.created_at
    }));
  }

  // Add documents
  const documents: any = {};
  
  if (options.sections.includes('productVision') && projectData.documents.productVision) {
    documents.productVision = {
      content: projectData.documents.productVision,
      format: 'markdown'
    };
  }

  if (options.sections.includes('requirements') && projectData.documents.functionalRequirements) {
    documents.functionalRequirements = {
      content: projectData.documents.functionalRequirements,
      format: 'markdown'
    };
  }

  if (options.sections.includes('architecture') && projectData.documents.systemArchitecture) {
    documents.systemArchitecture = {
      content: projectData.documents.systemArchitecture,
      format: 'markdown'
    };
  }

  if (options.sections.includes('dataFlow') && projectData.documents.dataFlow) {
    documents.dataFlow = {
      content: projectData.documents.dataFlow,
      format: 'markdown'
    };
  }

  if (options.sections.includes('database') && projectData.documents.databaseSchema) {
    documents.databaseSchema = {
      content: projectData.documents.databaseSchema,
      format: 'sql'
    };
  }

  if (options.sections.includes('designSystem') && projectData.documents.designSystem) {
    documents.designSystem = {
      content: projectData.documents.designSystem,
      format: 'markdown'
    };
  }

  if (Object.keys(documents).length > 0) {
    exportData.documents = documents;
  }

  // Create relationships map for reimport
  exportData.relationships = {
    personaPainPoints: [],
    painPointSolutions: [],
    solutionUserStories: []
  };

  // Map persona to pain points
  if (exportData.personas && exportData.painPoints) {
    exportData.painPoints.forEach((painPoint: any) => {
      painPoint.affectedPersonas.forEach((personaId: string) => {
        exportData.relationships.personaPainPoints.push({
          personaId,
          painPointId: painPoint.id
        });
      });
    });
  }

  const content = JSON.stringify(exportData, null, 2);
  const size = new TextEncoder().encode(content).length;

  return { content, size };
};