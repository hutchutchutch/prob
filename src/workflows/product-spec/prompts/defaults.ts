// Default prompts that the user can edit
export const DEFAULT_PROMPTS = {
  productVision: "Use the product-vision-guide.md as a template. Create an executive summary, a core value proposition based on the personas and problem, and define the MVP feature set based on the must-have features.",
  functionalRequirements: "Use functional_requirements_doc.md. Detail features derived from the user stories, including acceptance criteria and data handling rules.",
  systemArchitecture: "Use system_architecture.md. Define an architectural pattern, component breakdown, and technology stack suitable for the functional requirements.",
  dataFlowDiagram: "Use data_flow_diagram.md. Create Mermaid syntax diagrams for key user flows, showing how data moves between the defined system components.",
  entityRelationshipDiagram: "Use entity_relationship_diagram.md. Create a Mermaid ERD based on the data stores and flows. Define entities, attributes, and relationships to support the application's features.",
  designSystem: "Use atomic-design-system.md. Define foundational design tokens (colors, typography) and key atomic components required to build the UI for the specified features."
}; 