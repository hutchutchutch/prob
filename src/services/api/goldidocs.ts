import { supabase } from '@/services/supabase/client';
import type { DocumentType, DocumentStatus } from '@/components/layout/Sidebar/types';

export interface GoldiDocsStatusResponse {
  document_type: DocumentType;
  doc_status: DocumentStatus;
  doc_generated_at: string | null;
  doc_version: string | null;
}

export const goldiDocsAPI = {
  // Get GoldiDocs status for a project
  async getStatus(projectId: string): Promise<GoldiDocsStatusResponse[]> {
    const { data, error } = await supabase
      .rpc('get_goldidocs_status', { p_project_id: projectId });

    if (error) {
      console.error('Error fetching GoldiDocs status:', error);
      throw error;
    }

    return data || [];
  },

  // Get simplified status view
  async getStatusView(projectId: string) {
    const { data, error } = await supabase
      .from('goldidocs_status')
      .select('*')
      .eq('project_id', projectId)
      .single();

    if (error) {
      console.error('Error fetching GoldiDocs status view:', error);
      throw error;
    }

    return data;
  },

  // Generate a document
  async generateDocument(projectId: string, documentType: DocumentType) {
    // This would call an edge function or backend API to generate the document
    // For now, we'll just simulate it
    console.log(`Generating ${documentType} document for project ${projectId}`);
    
    // TODO: Implement actual document generation
    // const { data, error } = await supabase.functions.invoke(`generate-${documentType.toLowerCase()}`, {
    //   body: { projectId }
    // });

    return { success: true };
  },

  // Get document content
  async getDocumentContent(projectId: string, documentType: DocumentType) {
    const tableMap: Record<DocumentType, string> = {
      PV: 'product_vision',
      FR: 'functional_requirements',
      SA: 'system_architecture',
      DF: 'data_flow_diagrams',
      ER: 'entity_relationship_diagrams',
      DS: 'design_systems'
    };

    const table = tableMap[documentType];

    // Special handling for system_architecture
    if (documentType === 'SA') {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data?.[0];
    }

    // Standard handling for other documents
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error(`Error fetching ${documentType} content:`, error);
      throw error;
    }

    return data;
  },

  // Queue document generation
  async queueDocumentGeneration(projectId: string, documentType: DocumentType, priority: number = 5) {
    const { data, error } = await supabase
      .from('document_generation_queue')
      .insert({
        project_id: projectId,
        document_type: documentType,
        priority,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error queuing document generation:', error);
      throw error;
    }

    return data;
  }
}; 