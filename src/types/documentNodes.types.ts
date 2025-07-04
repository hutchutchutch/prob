// Base DocumentNode Interface
export interface BaseDocumentNode {
  id: string;
  type: DocumentType;
  projectId: string;
  version: string;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    author?: string;
    status: 'draft' | 'review' | 'approved' | 'published';
    tags?: string[];
  };
  validation: {
    isComplete: boolean;
    missingFields: string[];
    warnings?: string[];
  };
}

// Document Types Enum
export enum DocumentType {
  PRODUCT_VISION = 'product_vision',
  FUNCTIONAL_REQUIREMENTS = 'functional_requirements',
  SYSTEM_ARCHITECTURE = 'system_architecture',
  DATA_FLOW_DIAGRAM = 'data_flow_diagram',
  ENTITY_RELATIONSHIP_DIAGRAM = 'entity_relationship_diagram',
  DESIGN_SYSTEM = 'design_system'
}

// =====================================================
// PRODUCT VISION NODE
// =====================================================
export interface ProductVisionNode extends BaseDocumentNode {
  type: DocumentType.PRODUCT_VISION;
  
  // Quick summary for node display
  summary: {
    productName: string;
    elevatorPitch: string;
    completionPercentage: number;
  };
  
  // Core sections status
  sections: {
    executive: {
      complete: boolean;
      fields: ['productName', 'elevatorPitch', 'visionStatement'];
    };
    problem: {
      complete: boolean;
      fields: ['problemStatement', 'targetAudience', 'marketOpportunity'];
    };
    solution: {
      complete: boolean;
      fields: ['valuePropositions', 'keyDifferentiators'];
    };
    strategy: {
      complete: boolean;
      fields: ['successMetrics', 'constraints', 'assumptions', 'risks'];
    };
    roadmap: {
      complete: boolean;
      fields: ['milestones', 'stakeholders'];
    };
  };
  
  // Key metrics for dashboard
  metrics: {
    targetAudienceCount: number;
    valuePropositionCount: number;
    milestoneCount: number;
    riskCount: number;
  };
  
  // Relationships to other documents
  relationships: {
    feeds: DocumentType[]; // [FUNCTIONAL_REQUIREMENTS, SYSTEM_ARCHITECTURE]
    referencedBy: DocumentType[];
  };
}

// =====================================================
// FUNCTIONAL REQUIREMENTS NODE
// =====================================================
export interface FunctionalRequirementsNode extends BaseDocumentNode {
  type: DocumentType.FUNCTIONAL_REQUIREMENTS;
  
  summary: {
    featureCount: number;
    requirementCount: number;
    priorityBreakdown: {
      mustHave: number;
      shouldHave: number;
      niceToHave: number;
    };
  };
  
  sections: {
    features: {
      complete: boolean;
      byPriority: Map<string, number>;
      completedUserStories: number;
      totalUserStories: number;
    };
    dataHandling: {
      complete: boolean;
      validationRuleCount: number;
    };
    workflows: {
      complete: boolean;
      workflowCount: number;
      coveredFeatures: string[];
    };
    errorHandling: {
      complete: boolean;
      scenarioCount: number;
      severityBreakdown: Map<string, number>;
    };
    integrations: {
      complete: boolean;
      systemCount: number;
      externalDependencies: string[];
    };
  };
  
  coverage: {
    featuresWithRequirements: number;
    featuresWithAcceptanceCriteria: number;
    requirementsTraceability: number; // % linked to product vision
  };
  
  relationships: {
    derivedFrom: ['product_vision'];
    feeds: ['system_architecture', 'data_flow_diagram'];
    referencedBy: DocumentType[];
  };
}

// =====================================================
// SYSTEM ARCHITECTURE NODE
// =====================================================
export interface SystemArchitectureNode extends BaseDocumentNode {
  type: DocumentType.SYSTEM_ARCHITECTURE;
  
  summary: {
    architecturePattern: string;
    componentCount: number;
    technologySummary: string; // "React + Node.js + PostgreSQL"
  };
  
  sections: {
    overview: {
      complete: boolean;
      pattern: string;
      hasJustification: boolean;
    };
    context: {
      complete: boolean;
      externalSystemCount: number;
      integrationPoints: string[];
    };
    components: {
      complete: boolean;
      breakdown: {
        frontend: number;
        backend: number;
        database: number;
        infrastructure: number;
      };
      dependencyMap: Map<string, string[]>;
    };
    deployment: {
      complete: boolean;
      environments: string[];
      hasProductionConfig: boolean;
    };
    decisions: {
      complete: boolean;
      documentedDecisions: number;
      criticalDecisions: string[];
    };
  };
  
  healthMetrics: {
    componentsWithoutDependencies: number; // Potential issues
    circularDependencies: string[];
    securityMeasuresCoverage: number;
    performanceTargetsDefined: boolean;
  };
  
  relationships: {
    implements: ['functional_requirements'];
    feeds: ['data_flow_diagram', 'entity_relationship_diagram'];
    referencedBy: DocumentType[];
  };
}

// =====================================================
// DATA FLOW DIAGRAM NODE
// =====================================================
export interface DataFlowDiagramNode extends BaseDocumentNode {
  type: DocumentType.DATA_FLOW_DIAGRAM;
  
  summary: {
    entityCount: number;
    processCount: number;
    dataStoreCount: number;
    flowCount: number;
  };
  
  levels: {
    context: {
      complete: boolean;
      systemName: string;
      externalEntityCount: number;
    };
    level1: {
      complete: boolean;
      processCount: number;
      balanced: boolean; // Flows match context diagram
    };
    level2Plus: {
      exists: boolean;
      decomposedProcesses: string[];
      maxDepth: number;
    };
  };
  
  validation: {
    noOrphanedProcesses: boolean;
    allFlowsValid: boolean; // Follow DFD rules
    dataStoresProperlyConnected: boolean;
    balancedAcrossLevels: boolean;
  };
  
  complexity: {
    averageFlowsPerProcess: number;
    criticalPaths: Array<{
      name: string;
      length: number;
      processes: string[];
    }>;
  };
  
  relationships: {
    basedOn: ['functional_requirements', 'system_architecture'];
    feeds: ['entity_relationship_diagram'];
    referencedBy: DocumentType[];
  };
}

// =====================================================
// ENTITY RELATIONSHIP DIAGRAM NODE
// =====================================================
export interface EntityRelationshipDiagramNode extends BaseDocumentNode {
  type: DocumentType.ENTITY_RELATIONSHIP_DIAGRAM;
  
  summary: {
    entityCount: number;
    relationshipCount: number;
    attributeCount: number;
    normalForm: '1NF' | '2NF' | '3NF' | 'BCNF';
  };
  
  entities: {
    withPrimaryKeys: number;
    withoutRelationships: string[]; // Potential issues
    largestEntity: {
      name: string;
      attributeCount: number;
    };
  };
  
  relationships: {
    byCardinality: {
      oneToOne: number;
      oneToMany: number;
      manyToMany: number;
    };
    junctionTablesNeeded: number;
    cyclicRelationships: string[];
  };
  
  dataIntegrity: {
    foreignKeyCount: number;
    uniqueConstraints: number;
    businessRulesImplemented: number;
    indexCount: number;
  };
  
  dataClassification: {
    hasPII: boolean;
    sensitiveEntities: string[];
    complianceFlags: string[]; // GDPR, HIPAA, etc.
  };
  
  relationships: {
    modeledFrom: ['data_flow_diagram', 'functional_requirements'];
    feeds: ['system_architecture']; // For database design
    referencedBy: DocumentType[];
  };
}

// =====================================================
// DESIGN SYSTEM NODE
// =====================================================
export interface DesignSystemNode extends BaseDocumentNode {
  type: DocumentType.DESIGN_SYSTEM;
  
  summary: {
    brandName: string;
    componentCount: number;
    primaryColor: string;
    fontFamily: string;
  };
  
  foundations: {
    colors: {
      complete: boolean;
      paletteSize: number;
      hasSemanticColors: boolean;
      accessibilityCompliant: boolean;
    };
    typography: {
      complete: boolean;
      fontFamilyCount: number;
      scaleSteps: number;
      hasResponsiveScale: boolean;
    };
    spacing: {
      complete: boolean;
      hasConsistentScale: boolean;
      gridDefined: boolean;
    };
  };
  
  components: {
    byCategory: Map<string, number>;
    withVariants: number;
    withStates: number;
    documentationCoverage: number; // % with examples
  };
  
  maturity: {
    hasDesignPrinciples: boolean;
    hasAccessibilityGuidelines: boolean;
    hasMotionPrinciples: boolean;
    patternCount: number;
    adoptionMetrics?: {
      componentsInUse: number;
      consistencyScore: number;
    };
  };
  
  assets: {
    logoVariations: number;
    iconCount: number;
    illustrationCount: number;
  };
  
  relationships: {
    implements: ['product_vision']; // Brand alignment
    usedBy: ['functional_requirements', 'system_architecture'];
    referencedBy: DocumentType[];
  };
}

// =====================================================
// DOCUMENT GRAPH NODE (for visualization)
// =====================================================
export interface DocumentGraphNode {
  id: string;
  type: DocumentType;
  label: string;
  status: 'empty' | 'partial' | 'complete' | 'approved';
  completionPercentage: number;
  
  // For graph visualization
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  
  // Connections
  dependencies: Array<{
    targetId: string;
    relationship: 'feeds' | 'implements' | 'basedOn' | 'references';
    strength: 'required' | 'recommended' | 'optional';
  }>;
  
  // Quick actions
  actions: Array<{
    label: string;
    action: 'create' | 'edit' | 'preview' | 'export';
    enabled: boolean;
  }>;
  
  // Validation state
  health: {
    status: 'healthy' | 'warning' | 'error';
    issues: string[];
    suggestions: string[];
  };
}

// =====================================================
// DOCUMENT COLLECTION (Project Overview)
// =====================================================
export interface DocumentCollection {
  projectId: string;
  projectName: string;
  
  nodes: Map<DocumentType, DocumentGraphNode>;
  
  statistics: {
    totalDocuments: number;
    completedDocuments: number;
    averageCompletion: number;
    lastUpdated: Date;
  };
  
  workflow: {
    suggestedNext: DocumentType;
    blockedDocuments: Array<{
      document: DocumentType;
      blockedBy: DocumentType[];
      reason: string;
    }>;
  };
  
  qualityMetrics: {
    traceability: number; // % of requirements traced
    consistency: number; // Cross-document consistency
    coverage: number; // Feature coverage
    maturity: 'initial' | 'developing' | 'defined' | 'managed' | 'optimized';
  };
}

// Node Data Types for React Flow
export type ProductVisionNodeData = ProductVisionNode;
export type FunctionalRequirementsNodeData = FunctionalRequirementsNode;
export type SystemArchitectureNodeData = SystemArchitectureNode;
export type DataFlowDiagramNodeData = DataFlowDiagramNode;
export type EntityRelationshipDiagramNodeData = EntityRelationshipDiagramNode;
export type DesignSystemNodeData = DesignSystemNode;