-- Fix RLS policies to work with authenticated users
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can manage own workspaces" ON workspaces;
DROP POLICY IF EXISTS "Users can manage projects in own workspaces" ON projects;

-- Create new policies that work with Supabase Auth
-- Users table: Allow authenticated users to manage their own records
CREATE POLICY "Users can manage own record" ON users FOR ALL 
USING (auth.uid() = id);

-- Workspaces table: Allow users to manage their own workspaces
CREATE POLICY "Users can manage own workspaces" ON workspaces FOR ALL 
USING (auth.uid() = user_id);

-- Projects table: Allow users to manage projects in their workspaces
CREATE POLICY "Users can manage projects in own workspaces" ON projects FOR ALL 
USING (
  workspace_id IN (
    SELECT id FROM workspaces WHERE user_id = auth.uid()
  )
);

-- Core problems table: Allow users to manage core problems in their projects
CREATE POLICY "Users can manage core problems in own projects" ON core_problems FOR ALL 
USING (
  project_id IN (
    SELECT p.id FROM projects p
    JOIN workspaces w ON p.workspace_id = w.id
    WHERE w.user_id = auth.uid()
  )
);

-- Personas table: Allow users to manage personas for their core problems
CREATE POLICY "Users can manage personas for own core problems" ON personas FOR ALL 
USING (
  core_problem_id IN (
    SELECT cp.id FROM core_problems cp
    JOIN projects p ON cp.project_id = p.id
    JOIN workspaces w ON p.workspace_id = w.id
    WHERE w.user_id = auth.uid()
  )
);

-- Pain points table: Allow users to manage pain points for their personas
CREATE POLICY "Users can manage pain points for own personas" ON pain_points FOR ALL 
USING (
  persona_id IN (
    SELECT pe.id FROM personas pe
    JOIN core_problems cp ON pe.core_problem_id = cp.id
    JOIN projects p ON cp.project_id = p.id
    JOIN workspaces w ON p.workspace_id = w.id
    WHERE w.user_id = auth.uid()
  )
);

-- Key solutions table: Allow users to manage solutions in their projects
CREATE POLICY "Users can manage solutions in own projects" ON key_solutions FOR ALL 
USING (
  project_id IN (
    SELECT p.id FROM projects p
    JOIN workspaces w ON p.workspace_id = w.id
    WHERE w.user_id = auth.uid()
  )
);

-- Solution pain point mappings: Allow users to manage mappings for their data
CREATE POLICY "Users can manage solution mappings for own data" ON solution_pain_point_mappings FOR ALL 
USING (
  solution_id IN (
    SELECT ks.id FROM key_solutions ks
    JOIN projects p ON ks.project_id = p.id
    JOIN workspaces w ON p.workspace_id = w.id
    WHERE w.user_id = auth.uid()
  )
);

-- User stories table: Allow users to manage user stories in their projects
CREATE POLICY "Users can manage user stories in own projects" ON user_stories FOR ALL 
USING (
  project_id IN (
    SELECT p.id FROM projects p
    JOIN workspaces w ON p.workspace_id = w.id
    WHERE w.user_id = auth.uid()
  )
);

-- Canvas states table: Allow users to manage canvas states for their projects
CREATE POLICY "Users can manage canvas states for own projects" ON canvas_states FOR ALL 
USING (
  project_id IN (
    SELECT p.id FROM projects p
    JOIN workspaces w ON p.workspace_id = w.id
    WHERE w.user_id = auth.uid()
  )
);

-- LangGraph state events table: Allow users to manage state events for their projects
CREATE POLICY "Users can manage state events for own projects" ON langgraph_state_events FOR ALL 
USING (
  project_id IN (
    SELECT p.id FROM projects p
    JOIN workspaces w ON p.workspace_id = w.id
    WHERE w.user_id = auth.uid()
  )
); 