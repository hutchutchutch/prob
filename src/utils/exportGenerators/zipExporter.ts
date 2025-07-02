import type { ExportOptions } from '../../types/export.types';
import { markdownExporter } from './markdownExporter';

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

export const zipExporter = async (
  projectData: ProjectData,
  options: ExportOptions
): Promise<{ content: string; size: number }> => {
  // In a real implementation, this would use a ZIP library like JSZip
  // to create an actual ZIP file with all documents and assets
  
  const zipContents: Record<string, string> = {};

  // Create README.md
  const readmeOptions = { ...options, sections: options.sections };
  const { content: readmeContent } = await markdownExporter(projectData, readmeOptions);
  zipContents['README.md'] = readmeContent;

  // Create individual markdown files for each section
  if (options.sections.includes('problem')) {
    zipContents['01-problem-statement.md'] = createProblemDocument(projectData.problem);
  }

  if (options.sections.includes('personas')) {
    zipContents['02-user-personas.md'] = createPersonasDocument(projectData.personas);
  }

  if (options.sections.includes('painPoints')) {
    zipContents['03-pain-points.md'] = createPainPointsDocument(projectData.painPoints);
  }

  if (options.sections.includes('solutions')) {
    zipContents['04-solutions.md'] = createSolutionsDocument(projectData.solutions);
  }

  if (options.sections.includes('userStories')) {
    zipContents['05-user-stories.md'] = createUserStoriesDocument(projectData.userStories);
  }

  // Add generated documents
  if (options.sections.includes('productVision') && projectData.documents.productVision) {
    zipContents['documents/product-vision.md'] = projectData.documents.productVision;
  }

  if (options.sections.includes('requirements') && projectData.documents.functionalRequirements) {
    zipContents['documents/functional-requirements.md'] = projectData.documents.functionalRequirements;
  }

  if (options.sections.includes('architecture') && projectData.documents.systemArchitecture) {
    zipContents['documents/system-architecture.md'] = projectData.documents.systemArchitecture;
  }

  if (options.sections.includes('dataFlow') && projectData.documents.dataFlow) {
    zipContents['documents/data-flow.md'] = projectData.documents.dataFlow;
  }

  if (options.sections.includes('database') && projectData.documents.databaseSchema) {
    zipContents['database/schema.sql'] = projectData.documents.databaseSchema;
  }

  if (options.sections.includes('designSystem') && projectData.documents.designSystem) {
    zipContents['design/design-system.md'] = projectData.documents.designSystem;
  }

  // Create manifest.json
  zipContents['manifest.json'] = JSON.stringify({
    exportDate: new Date().toISOString(),
    version: '1.0.0',
    projectData: {
      problemId: projectData.problem.id,
      personaCount: projectData.personas.length,
      painPointCount: projectData.painPoints.length,
      solutionCount: projectData.solutions.length,
      userStoryCount: projectData.userStories.length
    },
    files: Object.keys(zipContents)
  }, null, 2);

  // In a real implementation, this would be compressed into a ZIP file
  // For now, we'll return a JSON representation
  const content = JSON.stringify(zipContents);
  const size = new TextEncoder().encode(content).length;

  return { content, size };
};

function createProblemDocument(problem: any): string {
  return `# Problem Statement

${problem.content}

${problem.validated_statement ? `## Validated Statement\n\n${problem.validated_statement}` : ''}

---

*Created: ${new Date(problem.created_at).toLocaleDateString()}*
`;
}

function createPersonasDocument(personas: any[]): string {
  let content = '# User Personas\n\n';
  
  personas.forEach((persona, index) => {
    content += `## ${index + 1}. ${persona.name}

**Role:** ${persona.role}

**Description:** ${persona.description}

**Pain Degree:** ${persona.pain_degree}/10

${persona.goals ? `### Goals\n${persona.goals}` : ''}

${persona.frustrations ? `### Frustrations\n${persona.frustrations}` : ''}

---

`;
  });
  
  return content;
}

function createPainPointsDocument(painPoints: any[]): string {
  let content = '# Pain Points\n\n';
  
  painPoints.forEach((painPoint, index) => {
    content += `## ${index + 1}. ${painPoint.title}

${painPoint.description}

**Severity:** ${painPoint.severity}/10

${painPoint.affected_personas?.length > 0 ? `**Affected Personas:** ${painPoint.affected_personas.join(', ')}` : ''}

---

`;
  });
  
  return content;
}

function createSolutionsDocument(solutions: any[]): string {
  let content = '# Solutions\n\n';
  
  solutions.forEach((solution, index) => {
    content += `## ${index + 1}. ${solution.title}

${solution.description}

${solution.voting_results?.total_votes ? `**Total Votes:** ${solution.voting_results.total_votes}` : ''}

${solution.must_have_features?.length > 0 ? `### Must-Have Features\n${solution.must_have_features.map((f: string) => `- ${f}`).join('\n')}` : ''}

---

`;
  });
  
  return content;
}

function createUserStoriesDocument(userStories: any[]): string {
  let content = '# User Stories\n\n';
  
  userStories.forEach((story, index) => {
    content += `## Story ${index + 1}

**As a** ${story.as_a}

**I want** ${story.i_want}

**So that** ${story.so_that}

${story.acceptance_criteria?.length > 0 ? `### Acceptance Criteria\n${story.acceptance_criteria.map((c: string) => `- ${c}`).join('\n')}` : ''}

---

`;
  });
  
  return content;
}