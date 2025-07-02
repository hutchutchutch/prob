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

export const markdownExporter = async (
  projectData: ProjectData,
  options: ExportOptions
): Promise<{ content: string; size: number }> => {
  let markdown = '';
  
  // Add custom branding header if provided
  if (options.customBranding?.companyName) {
    markdown += `# ${options.customBranding.companyName}\n\n`;
    if (options.customBranding.logoUrl) {
      markdown += `![Logo](${options.customBranding.logoUrl})\n\n`;
    }
  }

  // Add table of contents
  markdown += '## Table of Contents\n\n';
  let tocIndex = 1;
  
  if (options.sections.includes('problem')) {
    markdown += `${tocIndex}. [Problem Statement](#problem-statement)\n`;
    tocIndex++;
  }
  if (options.sections.includes('personas')) {
    markdown += `${tocIndex}. [User Personas](#user-personas)\n`;
    tocIndex++;
  }
  if (options.sections.includes('painPoints')) {
    markdown += `${tocIndex}. [Pain Points](#pain-points)\n`;
    tocIndex++;
  }
  if (options.sections.includes('solutions')) {
    markdown += `${tocIndex}. [Solutions](#solutions)\n`;
    tocIndex++;
  }
  if (options.sections.includes('userStories')) {
    markdown += `${tocIndex}. [User Stories](#user-stories)\n`;
    tocIndex++;
  }
  if (options.sections.includes('productVision')) {
    markdown += `${tocIndex}. [Product Vision](#product-vision)\n`;
    tocIndex++;
  }
  if (options.sections.includes('requirements')) {
    markdown += `${tocIndex}. [Functional Requirements](#functional-requirements)\n`;
    tocIndex++;
  }
  if (options.sections.includes('architecture')) {
    markdown += `${tocIndex}. [System Architecture](#system-architecture)\n`;
    tocIndex++;
  }
  if (options.sections.includes('dataFlow')) {
    markdown += `${tocIndex}. [Data Flow](#data-flow)\n`;
    tocIndex++;
  }
  if (options.sections.includes('database')) {
    markdown += `${tocIndex}. [Database Schema](#database-schema)\n`;
    tocIndex++;
  }
  if (options.sections.includes('designSystem')) {
    markdown += `${tocIndex}. [Design System](#design-system)\n`;
    tocIndex++;
  }
  
  markdown += '\n---\n\n';

  // Add content sections
  if (options.sections.includes('problem')) {
    markdown += '## Problem Statement\n\n';
    markdown += `${projectData.problem.content}\n\n`;
    if (projectData.problem.validated_statement) {
      markdown += `**Validated Statement:** ${projectData.problem.validated_statement}\n\n`;
    }
  }

  if (options.sections.includes('personas')) {
    markdown += '## User Personas\n\n';
    projectData.personas.forEach((persona, index) => {
      markdown += `### ${index + 1}. ${persona.name}\n\n`;
      markdown += `**Role:** ${persona.role}\n\n`;
      markdown += `**Description:** ${persona.description}\n\n`;
      markdown += `**Pain Degree:** ${persona.pain_degree}/10\n\n`;
      markdown += '---\n\n';
    });
  }

  if (options.sections.includes('painPoints')) {
    markdown += '## Pain Points\n\n';
    projectData.painPoints.forEach((painPoint, index) => {
      markdown += `### ${index + 1}. ${painPoint.title}\n\n`;
      markdown += `${painPoint.description}\n\n`;
      markdown += `**Severity:** ${painPoint.severity}/10\n\n`;
      if (painPoint.affected_personas?.length > 0) {
        markdown += `**Affected Personas:** ${painPoint.affected_personas.join(', ')}\n\n`;
      }
      markdown += '---\n\n';
    });
  }

  if (options.sections.includes('solutions')) {
    markdown += '## Solutions\n\n';
    projectData.solutions.forEach((solution, index) => {
      markdown += `### ${index + 1}. ${solution.title}\n\n`;
      markdown += `${solution.description}\n\n`;
      if (solution.voting_results?.total_votes) {
        markdown += `**Total Votes:** ${solution.voting_results.total_votes}\n\n`;
      }
      if (solution.must_have_features?.length > 0) {
        markdown += '**Must-Have Features:**\n';
        solution.must_have_features.forEach((feature: string) => {
          markdown += `- ${feature}\n`;
        });
        markdown += '\n';
      }
      markdown += '---\n\n';
    });
  }

  if (options.sections.includes('userStories')) {
    markdown += '## User Stories\n\n';
    projectData.userStories.forEach((story, index) => {
      markdown += `### Story ${index + 1}\n\n`;
      markdown += `**As a** ${story.as_a}\n\n`;
      markdown += `**I want** ${story.i_want}\n\n`;
      markdown += `**So that** ${story.so_that}\n\n`;
      if (story.acceptance_criteria?.length > 0) {
        markdown += '**Acceptance Criteria:**\n';
        story.acceptance_criteria.forEach((criteria: string) => {
          markdown += `- ${criteria}\n`;
        });
        markdown += '\n';
      }
      markdown += '---\n\n';
    });
  }

  // Add generated documents
  if (options.sections.includes('productVision') && projectData.documents.productVision) {
    markdown += '## Product Vision\n\n';
    markdown += projectData.documents.productVision + '\n\n';
  }

  if (options.sections.includes('requirements') && projectData.documents.functionalRequirements) {
    markdown += '## Functional Requirements\n\n';
    markdown += projectData.documents.functionalRequirements + '\n\n';
  }

  if (options.sections.includes('architecture') && projectData.documents.systemArchitecture) {
    markdown += '## System Architecture\n\n';
    markdown += projectData.documents.systemArchitecture + '\n\n';
  }

  if (options.sections.includes('dataFlow') && projectData.documents.dataFlow) {
    markdown += '## Data Flow\n\n';
    markdown += projectData.documents.dataFlow + '\n\n';
  }

  if (options.sections.includes('database') && projectData.documents.databaseSchema) {
    markdown += '## Database Schema\n\n';
    markdown += '```sql\n';
    markdown += projectData.documents.databaseSchema;
    markdown += '\n```\n\n';
  }

  if (options.sections.includes('designSystem') && projectData.documents.designSystem) {
    markdown += '## Design System\n\n';
    markdown += projectData.documents.designSystem + '\n\n';
  }

  // Add footer
  markdown += '\n---\n\n';
  markdown += `*Generated with Prob on ${new Date().toLocaleDateString()}*\n`;

  const content = markdown;
  const size = new TextEncoder().encode(content).length;

  return { content, size };
};