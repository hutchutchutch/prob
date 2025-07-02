import { useState, useCallback } from 'react';
import { useCanvasStore } from '../stores/canvasStore';
import { useProjectStore } from '../stores/projectStore';
import { DocumentMetadata } from '../utils/documentFormatters';

export type DocumentType = DocumentMetadata['type'];

export interface DocumentGenerationOptions {
  type: DocumentType;
  projectId: string;
  regenerate?: boolean;
}

export interface DocumentGenerationResult {
  content: string;
  metadata: DocumentMetadata;
  error?: string;
}

export function useDocumentGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<Record<DocumentType, 'pending' | 'generating' | 'complete' | 'error'>>({
    'product-vision': 'pending',
    'functional-requirements': 'pending',
    'system-architecture': 'pending',
    'data-flow': 'pending',
    'design-system': 'pending',
    'database-schema': 'pending',
  });

  const canvasNodes = useCanvasStore((state) => state.nodes);
  const currentProject = useProjectStore((state) => state.currentProject);

  const generateDocument = useCallback(async (options: DocumentGenerationOptions): Promise<DocumentGenerationResult | null> => {
    const { type, projectId, regenerate = false } = options;

    setIsGenerating(true);
    setProgress((prev) => ({ ...prev, [type]: 'generating' }));

    try {
      // Simulate API call to generate document
      // In production, this would call the actual Supabase Edge Function
      await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 3000));

      // Mock document content based on type
      const mockContent = getMockDocumentContent(type);
      
      const metadata: DocumentMetadata = {
        title: getDocumentTitle(type),
        type,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: '1.0.0',
      };

      setProgress((prev) => ({ ...prev, [type]: 'complete' }));

      return {
        content: mockContent,
        metadata,
      };
    } catch (error) {
      setProgress((prev) => ({ ...prev, [type]: 'error' }));
      return {
        content: '',
        metadata: {
          title: getDocumentTitle(type),
          type,
          createdAt: new Date(),
          updatedAt: new Date(),
          version: '1.0.0',
        },
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateAllDocuments = useCallback(async (projectId: string) => {
    const documentTypes: DocumentType[] = [
      'product-vision',
      'functional-requirements',
      'system-architecture',
      'data-flow',
      'design-system',
      'database-schema',
    ];

    const results: Record<DocumentType, DocumentGenerationResult | null> = {} as any;

    // Generate product vision first (no dependencies)
    results['product-vision'] = await generateDocument({ type: 'product-vision', projectId });

    // Generate functional requirements (depends on product vision)
    if (results['product-vision'] && !results['product-vision'].error) {
      results['functional-requirements'] = await generateDocument({ type: 'functional-requirements', projectId });
    }

    // Generate system architecture and design system in parallel (depend on functional requirements)
    if (results['functional-requirements'] && !results['functional-requirements'].error) {
      const [architecture, designSystem] = await Promise.all([
        generateDocument({ type: 'system-architecture', projectId }),
        generateDocument({ type: 'design-system', projectId }),
      ]);
      results['system-architecture'] = architecture;
      results['design-system'] = designSystem;
    }

    // Generate data flow and database schema (depend on system architecture)
    if (results['system-architecture'] && !results['system-architecture'].error) {
      const [dataFlow, dbSchema] = await Promise.all([
        generateDocument({ type: 'data-flow', projectId }),
        generateDocument({ type: 'database-schema', projectId }),
      ]);
      results['data-flow'] = dataFlow;
      results['database-schema'] = dbSchema;
    }

    return results;
  }, [generateDocument]);

  return {
    generateDocument,
    generateAllDocuments,
    isGenerating,
    progress,
  };
}

function getDocumentTitle(type: DocumentType): string {
  const titles: Record<DocumentType, string> = {
    'product-vision': 'Product Vision Document',
    'functional-requirements': 'Functional Requirements',
    'system-architecture': 'System Architecture',
    'data-flow': 'Data Flow Diagram',
    'design-system': 'Design System',
    'database-schema': 'Database Schema',
  };
  return titles[type];
}

function getMockDocumentContent(type: DocumentType): string {
  const contents: Record<DocumentType, string> = {
    'product-vision': `# Product Vision Document

## Executive Summary

This document outlines the vision for our next-generation CRM system designed specifically for modern sales teams.

## Core Value Proposition

**For**: Sales teams struggling with data entry and follow-ups
**Our product**: Provides an intelligent CRM that automates routine tasks
**Unlike**: Traditional CRMs that require manual data entry
**Our solution**: Uses AI to capture interactions and suggest next actions

## Key Features

### 1. Unified Dashboard
- Real-time activity tracking
- Customizable widgets
- Mobile-responsive design

### 2. Intelligent Data Capture
- Automatic email and call logging
- Meeting notes transcription
- Contact enrichment

### 3. Smart Follow-ups
- AI-powered next action suggestions
- Automated reminder system
- Personalized outreach templates

## Success Metrics
- 50% reduction in manual data entry
- 30% increase in follow-up completion rate
- 25% improvement in deal velocity`,

    'functional-requirements': `# Functional Requirements

## 1. User Management

### 1.1 Authentication
- Email/password login
- SSO integration (Google, Microsoft)
- Two-factor authentication
- Password reset functionality

### 1.2 User Roles
- Admin: Full system access
- Manager: Team oversight and reporting
- Sales Rep: Individual pipeline management
- Read-only: View access for stakeholders

## 2. Contact Management

### 2.1 Contact Records
- Basic information (name, email, phone)
- Company association
- Interaction history
- Custom fields support

### 2.2 Company Records
- Company details and hierarchy
- Associated contacts
- Deal history
- Revenue tracking

## 3. Pipeline Management

### 3.1 Deal Stages
- Customizable pipeline stages
- Drag-and-drop interface
- Stage probability settings
- Automated stage transitions

### 3.2 Deal Tracking
- Deal value and products
- Close date forecasting
- Activity requirements per stage
- Win/loss analysis`,

    'system-architecture': `# System Architecture

## Overview

The CRM system follows a modern microservices architecture with a React frontend and Node.js backend services.

## Architecture Layers

### 1. Presentation Layer
- **Frontend**: React + TypeScript
- **State Management**: Redux Toolkit
- **UI Framework**: Material-UI
- **Real-time**: WebSocket connections

### 2. API Gateway
- **Technology**: Express.js + GraphQL
- **Authentication**: JWT tokens
- **Rate Limiting**: Redis-based
- **API Documentation**: GraphQL Playground

### 3. Microservices
- **User Service**: Authentication and authorization
- **Contact Service**: Contact and company management
- **Pipeline Service**: Deal and pipeline operations
- **Analytics Service**: Reporting and insights
- **Notification Service**: Email and in-app notifications

### 4. Data Layer
- **Primary Database**: PostgreSQL
- **Cache**: Redis
- **Search**: Elasticsearch
- **File Storage**: AWS S3

## Deployment Architecture

\`\`\`yaml
production:
  frontend:
    - Load Balancer (AWS ALB)
    - React App (S3 + CloudFront)
  
  backend:
    - API Gateway (ECS Fargate)
    - Microservices (ECS Fargate)
    - Database (RDS PostgreSQL)
    - Cache (ElastiCache Redis)
\`\`\``,

    'data-flow': `# Data Flow Diagram

## User Authentication Flow

\`\`\`mermaid
graph TD
    A[User] -->|Login Request| B[Frontend]
    B -->|Credentials| C[API Gateway]
    C -->|Validate| D[Auth Service]
    D -->|Query| E[User Database]
    E -->|User Data| D
    D -->|Generate Token| F[JWT Service]
    F -->|Token| C
    C -->|Auth Response| B
    B -->|Store Token| G[Local Storage]
\`\`\`

## Contact Creation Flow

\`\`\`mermaid
graph TD
    A[Sales Rep] -->|New Contact| B[Frontend Form]
    B -->|Validate| C[Form Validation]
    C -->|Submit| D[API Gateway]
    D -->|Create Contact| E[Contact Service]
    E -->|Enrich Data| F[Enrichment API]
    F -->|Enhanced Data| E
    E -->|Store| G[PostgreSQL]
    E -->|Index| H[Elasticsearch]
    E -->|Notify| I[Notification Service]
    I -->|Email| J[Email Service]
\`\`\`

## Real-time Activity Sync

\`\`\`mermaid
graph TD
    A[User Activity] -->|WebSocket| B[Socket Server]
    B -->|Publish| C[Redis Pub/Sub]
    C -->|Subscribe| D[Other Clients]
    C -->|Log| E[Activity Service]
    E -->|Store| F[Activity Log DB]
\`\`\``,

    'design-system': `# Design System

## Color Palette

### Primary Colors
\`\`\`css
--color-primary-500: #3B82F6;  /* Main Blue */
--color-primary-600: #2563EB;  /* Hover Blue */
--color-primary-700: #1D4ED8;  /* Active Blue */
\`\`\`

### Semantic Colors
\`\`\`css
--color-success: #10B981;
--color-warning: #F59E0B;
--color-error: #EF4444;
--color-info: #3B82F6;
\`\`\`

## Typography

### Font Stack
\`\`\`css
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-mono: "SF Mono", Monaco, "Cascadia Code", monospace;
\`\`\`

### Font Sizes
\`\`\`css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
\`\`\`

## Components

### Button Component
\`\`\`tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  variant, 
  size, 
  children,
  ...props 
}) => {
  return (
    <button className={cx(
      'btn',
      \`btn--\${variant}\`,
      \`btn--\${size}\`
    )} {...props}>
      {children}
    </button>
  );
};
\`\`\`

### Card Component
\`\`\`css
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  transition: all 0.2s;
}

.card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
\`\`\``,

    'database-schema': `-- Database Schema for CRM System

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    industry VARCHAR(100),
    size VARCHAR(50),
    revenue DECIMAL(15, 2),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contacts table
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    title VARCHAR(100),
    company_id UUID REFERENCES companies(id),
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Deals table
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    value DECIMAL(15, 2),
    stage VARCHAR(100) NOT NULL,
    probability INTEGER,
    expected_close_date DATE,
    company_id UUID REFERENCES companies(id),
    contact_id UUID REFERENCES contacts(id),
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activities table
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL,
    subject VARCHAR(255),
    description TEXT,
    due_date TIMESTAMP,
    completed BOOLEAN DEFAULT FALSE,
    deal_id UUID REFERENCES deals(id),
    contact_id UUID REFERENCES contacts(id),
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_contacts_company ON contacts(company_id);
CREATE INDEX idx_deals_owner ON deals(owner_id);
CREATE INDEX idx_activities_due_date ON activities(due_date);
CREATE INDEX idx_activities_deal ON activities(deal_id);`,
  };

  return contents[type];
}