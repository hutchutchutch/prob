-- Seed data for testing GoldiDocs application
-- This data matches the mock data generated in our Rust commands

-- Insert test user
INSERT INTO users (id, email) VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'test@example.com')
ON CONFLICT (email) DO NOTHING;

-- Insert test workspace
INSERT INTO workspaces (id, user_id, name, folder_path, is_active) VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Test Workspace', '/Users/test/projects', TRUE)
ON CONFLICT (user_id, name) DO NOTHING;

-- Insert test projects (multiple scenarios for comprehensive testing)
INSERT INTO projects (id, workspace_id, name, status, current_step) VALUES 
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Inventory Management System', 'problem_validation', 'persona_generation'),
    ('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440001', 'Remote Collaboration Platform', 'solution_discovery', 'solution_selection'),
    ('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440001', 'Educational Progress Tracker', 'feature_definition', 'user_stories')
ON CONFLICT (id) DO NOTHING;

-- Insert realistic test problem data (matching our Rust mock generation)
INSERT INTO core_problems (id, project_id, original_input, validated_problem, is_valid, validation_feedback, version) VALUES 
    (
        '550e8400-e29b-41d4-a716-446655440003',
        '550e8400-e29b-41d4-a716-446655440002',
        'Small businesses struggle to manage their inventory efficiently, leading to stockouts and overstock situations',
        'Business Process Optimization: Small businesses struggle to manage their inventory efficiently, leading to stockouts and overstock situations. This challenge affects operational efficiency and requires systematic analysis to identify key personas and solution pathways.',
        TRUE,
        'Excellent problem statement! The core issue is clearly defined and provides a solid foundation for persona generation. Key strengths: problem scope is well-defined, target context is clear, and the impact is evident.',
        1
    ),
    (
        '550e8400-e29b-41d4-a716-446655440004',
        '550e8400-e29b-41d4-a716-446655440002',
        'Remote workers find it difficult to stay connected and collaborate effectively with their team members',
        'User Experience Problem: Remote workers find it difficult to stay connected and collaborate effectively with their team members. This issue directly impacts user satisfaction and retention, requiring persona-driven solution development.',
        TRUE,
        'Excellent problem statement! The core issue is clearly defined and provides a solid foundation for persona generation. Key strengths: problem scope is well-defined, target context is clear, and the impact is evident.',
        2
    ),
    (
        '550e8400-e29b-41d4-a716-446655440005',
        '550e8400-e29b-41d4-a716-446655440002',
        'Students need a better way to track their learning progress and study habits across multiple subjects',
        'Mobile Application Challenge: Students need a better way to track their learning progress and study habits across multiple subjects. This problem impacts user experience and requires a strategic solution that balances technical feasibility with user needs.',
        TRUE,
        'Excellent problem statement! The core issue is clearly defined and provides a solid foundation for persona generation. Key strengths: problem scope is well-defined, target context is clear, and the impact is evident.',
        3
    )
ON CONFLICT (project_id, version) DO NOTHING;

-- Insert test personas for the validated problems (matching create_test_persona_data)
INSERT INTO personas (id, core_problem_id, name, industry, role, pain_degree, position, is_locked, is_active, generation_batch) VALUES 
    (
        '550e8400-e29b-41d4-a716-446655440006',
        '550e8400-e29b-41d4-a716-446655440003',
        'Sarah Chen',
        'Retail',
        'Small Business Owner',
        4,
        0,
        FALSE,
        TRUE,
        'batch_001'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440007',
        '550e8400-e29b-41d4-a716-446655440003',
        'Marcus Rodriguez',
        'Retail',
        'Inventory Manager',
        5,
        1,
        FALSE,
        FALSE,
        'batch_001'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440008',
        '550e8400-e29b-41d4-a716-446655440003',
        'Jennifer Taylor',
        'Technology',
        'Remote Software Developer',
        3,
        2,
        FALSE,
        FALSE,
        'batch_002'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440018',
        '550e8400-e29b-41d4-a716-446655440003',
        'David Kim',
        'Education',
        'College Student',
        4,
        3,
        FALSE,
        FALSE,
        'batch_003'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440019',
        '550e8400-e29b-41d4-a716-446655440003',
        'Emily Johnson',
        'Healthcare',
        'Practice Manager',
        5,
        4,
        FALSE,
        FALSE,
        'batch_004'
    )
ON CONFLICT (id) DO NOTHING;

-- Insert pain points for the personas
INSERT INTO pain_points (id, persona_id, description, severity, impact_area, position, is_locked, generation_batch) VALUES 
    (
        '550e8400-e29b-41d4-a716-446655440009',
        '550e8400-e29b-41d4-a716-446655440006',
        'Constantly running out of popular items during peak seasons',
        'High',
        'Revenue Loss',
        0,
        FALSE,
        'batch_001'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440010',
        '550e8400-e29b-41d4-a716-446655440006',
        'Tying up capital in slow-moving inventory',
        'Medium',
        'Cash Flow',
        1,
        FALSE,
        'batch_001'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440011',
        '550e8400-e29b-41d4-a716-446655440007',
        'Difficulty tracking inventory across multiple locations',
        'High',
        'Operations',
        0,
        FALSE,
        'batch_001'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440020',
        '550e8400-e29b-41d4-a716-446655440008',
        'Feeling isolated from team members throughout the workday',
        'High',
        'Team Collaboration',
        0,
        FALSE,
        'batch_002'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440021',
        '550e8400-e29b-41d4-a716-446655440018',
        'Struggling to maintain focus across multiple subjects',
        'Medium',
        'Academic Performance',
        0,
        FALSE,
        'batch_003'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440022',
        '550e8400-e29b-41d4-a716-446655440019',
        'Managing patient scheduling conflicts and double bookings',
        'High',
        'Patient Care',
        0,
        FALSE,
        'batch_004'
    )
ON CONFLICT (id) DO NOTHING;

-- Insert key solutions
INSERT INTO key_solutions (id, project_id, persona_id, title, description, solution_type, complexity, position, is_locked, is_selected, generation_batch) VALUES 
    (
        '550e8400-e29b-41d4-a716-446655440012',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440006',
        'Smart Inventory Prediction System',
        'AI-powered system that analyzes sales patterns, seasonal trends, and external factors to predict optimal inventory levels',
        'Software Solution',
        'High',
        0,
        FALSE,
        TRUE,
        'batch_001'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440013',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440006',
        'Real-time Stock Alerts',
        'Mobile and web notifications for low stock levels and reorder recommendations',
        'Notification System',
        'Medium',
        1,
        FALSE,
        FALSE,
        'batch_001'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440014',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440007',
        'Multi-Location Inventory Tracker',
        'Centralized system for tracking inventory across multiple store locations with real-time sync',
        'Management System',
        'High',
        0,
        FALSE,
        FALSE,
        'batch_001'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440023',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440008',
        'Virtual Team Presence Dashboard',
        'Real-time dashboard showing team member availability, current projects, and quick communication tools',
        'Dashboard Solution',
        'Medium',
        0,
        FALSE,
        FALSE,
        'batch_002'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440024',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440018',
        'Study Progress Tracker',
        'Comprehensive platform for tracking learning progress, study habits, and academic performance across subjects',
        'Educational Platform',
        'Medium',
        0,
        FALSE,
        FALSE,
        'batch_003'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440025',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440019',
        'Smart Scheduling System',
        'Intelligent patient scheduling system that prevents conflicts and optimizes appointment slots',
        'Healthcare Solution',
        'High',
        0,
        FALSE,
        FALSE,
        'batch_004'
    )
ON CONFLICT (id) DO NOTHING;

-- Insert solution-pain point mappings
INSERT INTO solution_pain_point_mappings (id, solution_id, pain_point_id, relevance_score) VALUES 
    (
        '550e8400-e29b-41d4-a716-446655440015',
        '550e8400-e29b-41d4-a716-446655440012',
        '550e8400-e29b-41d4-a716-446655440009',
        0.95
    ),
    (
        '550e8400-e29b-41d4-a716-446655440016',
        '550e8400-e29b-41d4-a716-446655440012',
        '550e8400-e29b-41d4-a716-446655440010',
        0.85
    ),
    (
        '550e8400-e29b-41d4-a716-446655440017',
        '550e8400-e29b-41d4-a716-446655440013',
        '550e8400-e29b-41d4-a716-446655440009',
        0.88
    ),
    (
        '550e8400-e29b-41d4-a716-446655440026',
        '550e8400-e29b-41d4-a716-446655440014',
        '550e8400-e29b-41d4-a716-446655440011',
        0.92
    ),
    (
        '550e8400-e29b-41d4-a716-446655440027',
        '550e8400-e29b-41d4-a716-446655440023',
        '550e8400-e29b-41d4-a716-446655440020',
        0.90
    ),
    (
        '550e8400-e29b-41d4-a716-446655440028',
        '550e8400-e29b-41d4-a716-446655440024',
        '550e8400-e29b-41d4-a716-446655440021',
        0.87
    ),
    (
        '550e8400-e29b-41d4-a716-446655440029',
        '550e8400-e29b-41d4-a716-446655440025',
        '550e8400-e29b-41d4-a716-446655440022',
        0.93
    )
ON CONFLICT (solution_id, pain_point_id) DO NOTHING;

-- Insert test user stories for comprehensive workflow testing
INSERT INTO user_stories (id, project_id, title, as_a, i_want, so_that, acceptance_criteria, priority, complexity_points, position, is_edited, original_content, edited_content) VALUES 
    (
        '550e8400-e29b-41d4-a716-446655440032',
        '550e8400-e29b-41d4-a716-446655440002',
        'Inventory Level Monitoring',
        'small business owner',
        'to receive real-time alerts when inventory levels drop below threshold',
        'I can reorder stock before running out',
        '["Alert triggers when stock < 10 units", "Email and SMS notifications sent", "Reorder suggestions provided", "Historical data shows alert effectiveness"]',
        'High',
        8,
        0,
        FALSE,
        NULL,
        NULL
    ),
    (
        '550e8400-e29b-41d4-a716-446655440033',
        '550e8400-e29b-41d4-a716-446655440002',
        'Sales Trend Analysis',
        'inventory manager',
        'to view sales trends and seasonal patterns',
        'I can make informed purchasing decisions',
        '["Charts display monthly/quarterly trends", "Seasonal pattern detection", "Export data to spreadsheet", "Filter by product category"]',
        'Medium',
        5,
        1,
        FALSE,
        NULL,
        NULL
    ),
    (
        '550e8400-e29b-41d4-a716-446655440034',
        '550e8400-e29b-41d4-a716-446655440030',
        'Team Presence Dashboard',
        'remote developer',
        'to see which team members are currently online and available',
        'I can collaborate more effectively',
        '["Real-time online status display", "Current project indicators", "Availability status (busy/free)", "Quick message capability"]',
        'High',
        3,
        0,
        FALSE,
        NULL,
        NULL
    ),
    (
        '550e8400-e29b-41d4-a716-446655440035',
        '550e8400-e29b-41d4-a716-446655440031',
        'Study Progress Tracking',
        'college student',
        'to track my study time and progress across multiple subjects',
        'I can better manage my time and improve performance',
        '["Timer for study sessions", "Progress visualization", "Subject categorization", "Weekly/monthly reports", "Goal setting and tracking"]',
        'High',
        8,
        0,
        FALSE,
        NULL,
        NULL
    )
ON CONFLICT (id) DO NOTHING;

-- Insert test canvas states for visual workflow testing
INSERT INTO canvas_states (id, project_id, nodes, edges, viewport) VALUES 
    (
        '550e8400-e29b-41d4-a716-446655440036',
        '550e8400-e29b-41d4-a716-446655440002',
        '[
            {"id": "problem-1", "type": "problem", "position": {"x": 100, "y": 300}, "data": {"label": "Inventory Management"}},
            {"id": "persona-1", "type": "persona", "position": {"x": 400, "y": 200}, "data": {"label": "Sarah Chen", "role": "Business Owner"}},
            {"id": "persona-2", "type": "persona", "position": {"x": 400, "y": 400}, "data": {"label": "Marcus Rodriguez", "role": "Inventory Manager"}},
            {"id": "pain-1", "type": "painPoint", "position": {"x": 700, "y": 150}, "data": {"label": "Stockouts during peak seasons"}},
            {"id": "pain-2", "type": "painPoint", "position": {"x": 700, "y": 350}, "data": {"label": "Tracking across locations"}},
            {"id": "solution-1", "type": "solution", "position": {"x": 1000, "y": 200}, "data": {"label": "Smart Prediction System", "selected": true}}
        ]',
        '[
            {"id": "e-problem-persona1", "source": "problem-1", "target": "persona-1", "type": "smoothstep"},
            {"id": "e-problem-persona2", "source": "problem-1", "target": "persona-2", "type": "smoothstep"},
            {"id": "e-persona1-pain1", "source": "persona-1", "target": "pain-1", "type": "smoothstep"},
            {"id": "e-persona2-pain2", "source": "persona-2", "target": "pain-2", "type": "smoothstep"},
            {"id": "e-pain1-solution1", "source": "pain-1", "target": "solution-1", "type": "smoothstep"},
            {"id": "e-pain2-solution1", "source": "pain-2", "target": "solution-1", "type": "smoothstep"}
        ]',
        '{"x": 0, "y": 0, "zoom": 0.8}'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440037',
        '550e8400-e29b-41d4-a716-446655440030',
        '[
            {"id": "problem-2", "type": "problem", "position": {"x": 100, "y": 300}, "data": {"label": "Remote Collaboration"}},
            {"id": "persona-3", "type": "persona", "position": {"x": 400, "y": 300}, "data": {"label": "Jennifer Taylor", "role": "Remote Developer"}},
            {"id": "pain-3", "type": "painPoint", "position": {"x": 700, "y": 300}, "data": {"label": "Team isolation"}},
            {"id": "solution-2", "type": "solution", "position": {"x": 1000, "y": 300}, "data": {"label": "Presence Dashboard"}}
        ]',
        '[
            {"id": "e-problem2-persona3", "source": "problem-2", "target": "persona-3", "type": "smoothstep"},
            {"id": "e-persona3-pain3", "source": "persona-3", "target": "pain-3", "type": "smoothstep"},
            {"id": "e-pain3-solution2", "source": "pain-3", "target": "solution-2", "type": "smoothstep"}
        ]',
        '{"x": 0, "y": 0, "zoom": 1.0}'
    )
ON CONFLICT (id) DO NOTHING; 