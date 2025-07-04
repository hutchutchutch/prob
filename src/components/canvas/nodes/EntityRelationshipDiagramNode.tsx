import React from 'react';
import { NodeProps } from '@xyflow/react';
import { BaseDocumentNodeComponent } from './BaseDocumentNode';
import { EntityRelationshipDiagramNodeData } from '@/types/documentNodes.types';
import { Database, Key, Link, Shield, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';

export const EntityRelationshipDiagramNode: React.FC<NodeProps<EntityRelationshipDiagramNodeData>> = ({ data, selected }) => {
  const totalRelationships = Object.values(data.relationships.byCardinality).reduce((a, b) => a + b, 0);
  const hasDataIssues = data.entities.withoutRelationships.length > 0 || 
                       data.relationships.cyclicRelationships.length > 0;

  return (
    <BaseDocumentNodeComponent
      data={data}
      selected={selected}
      variant="technical"
      icon={<Database className="w-5 h-5 text-teal-500" />}
    >
      <div className="space-y-3">
        {/* ERD Summary */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-gray-800/50 rounded">
            <p className="text-2xl font-bold text-teal-400">{data.summary.entityCount}</p>
            <p className="text-xs text-gray-400">Entities</p>
          </div>
          <div className="text-center p-2 bg-gray-800/50 rounded">
            <p className="text-2xl font-bold text-blue-400">{totalRelationships}</p>
            <p className="text-xs text-gray-400">Relations</p>
          </div>
          <div className="text-center p-2 bg-gray-800/50 rounded">
            <p className="text-2xl font-bold text-purple-400">{data.summary.attributeCount}</p>
            <p className="text-xs text-gray-400">Attributes</p>
          </div>
        </div>

        {/* Normal Form Badge */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Normalization</span>
          <span className="px-2 py-1 text-xs font-semibold bg-teal-900/30 text-teal-400 rounded">
            {data.summary.normalForm}
          </span>
        </div>

        {/* Relationship Breakdown */}
        <div className="space-y-2">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Relationships</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-300">One-to-One</span>
              <span className="text-gray-400">{data.relationships.byCardinality.oneToOne}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-300">One-to-Many</span>
              <span className="text-gray-400">{data.relationships.byCardinality.oneToMany}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-300">Many-to-Many</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">{data.relationships.byCardinality.manyToMany}</span>
                {data.relationships.junctionTablesNeeded > 0 && (
                  <span className="text-yellow-400">({data.relationships.junctionTablesNeeded} junction tables needed)</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Data Issues */}
        {hasDataIssues && (
          <div className="space-y-1 p-2 bg-yellow-900/20 rounded">
            <p className="text-xs text-yellow-400 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Structure Issues
            </p>
            {data.entities.withoutRelationships.length > 0 && (
              <p className="text-xs text-yellow-300 ml-4">
                • {data.entities.withoutRelationships.length} isolated entities
              </p>
            )}
            {data.relationships.cyclicRelationships.length > 0 && (
              <p className="text-xs text-yellow-300 ml-4">
                • {data.relationships.cyclicRelationships.length} cyclic relationships
              </p>
            )}
          </div>
        )}

        {/* Data Integrity */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 p-1 bg-gray-800/50 rounded">
            <Key className="w-3 h-3 text-gold-500" />
            <span className="text-gray-300">{data.dataIntegrity.foreignKeyCount} FKs</span>
          </div>
          <div className="flex items-center gap-2 p-1 bg-gray-800/50 rounded">
            <Link className="w-3 h-3 text-blue-500" />
            <span className="text-gray-300">{data.dataIntegrity.uniqueConstraints} Unique</span>
          </div>
          <div className="flex items-center gap-2 p-1 bg-gray-800/50 rounded">
            <span className="text-green-400">⚡</span>
            <span className="text-gray-300">{data.dataIntegrity.indexCount} Indexes</span>
          </div>
          <div className="flex items-center gap-2 p-1 bg-gray-800/50 rounded">
            <span className="text-purple-400">📋</span>
            <span className="text-gray-300">{data.dataIntegrity.businessRulesImplemented} Rules</span>
          </div>
        </div>

        {/* Data Classification */}
        {(data.dataClassification.hasPII || data.dataClassification.complianceFlags.length > 0) && (
          <div className="pt-2 border-t border-gray-700">
            <div className="flex items-center gap-2 text-xs">
              <Shield className={cn(
                "w-3 h-3",
                data.dataClassification.hasPII ? "text-red-500" : "text-gray-500"
              )} />
              {data.dataClassification.hasPII && (
                <span className="text-red-400">Contains PII</span>
              )}
              {data.dataClassification.complianceFlags.map((flag, i) => (
                <span key={i} className="px-2 py-1 bg-red-900/30 text-red-400 rounded">
                  {flag}
                </span>
              ))}
            </div>
            {data.dataClassification.sensitiveEntities.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {data.dataClassification.sensitiveEntities.length} sensitive entities
              </p>
            )}
          </div>
        )}

        {/* Largest Entity Info */}
        {data.entities.largestEntity.name && (
          <div className="text-xs text-gray-500">
            Largest entity: <span className="text-gray-400">{data.entities.largestEntity.name}</span>
            <span className="text-gray-600"> ({data.entities.largestEntity.attributeCount} attrs)</span>
          </div>
        )}
      </div>
    </BaseDocumentNodeComponent>
  );
};

export default EntityRelationshipDiagramNode;