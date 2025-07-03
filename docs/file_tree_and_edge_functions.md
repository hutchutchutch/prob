<file_map>
/Users/hutch/Documents/projects/gauntlet/p3/prob
├── src
│   ├── assets
│   │   └── react.svg
│   ├── components
│   │   ├── auth
│   │   │   └── AuthForm.tsx
│   │   ├── canvas
│   │   │   ├── controls
│   │   │   │   ├── BulkActionsBar.tsx
│   │   │   │   ├── CanvasControls.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── LockToggle.tsx
│   │   │   │   ├── RefreshButton.tsx
│   │   │   │   └── SelectionCounter.tsx
│   │   │   ├── edges
│   │   │   │   ├── AnimatedEdge.tsx
│   │   │   │   ├── DependencyEdge.tsx
│   │   │   │   ├── HighlightedEdge.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── SolutionEdge.tsx
│   │   │   ├── nodes
│   │   │   │   ├── BaseNode.tsx
│   │   │   │   ├── CoreProblemNode.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── LabelNode.tsx
│   │   │   │   ├── PainLevelIndicator.tsx
│   │   │   │   ├── PainPointNode.tsx
│   │   │   │   ├── PersonaNode.tsx
│   │   │   │   └── SolutionNode.tsx
│   │   │   ├── Canvas.tsx
│   │   │   └── index.ts
│   │   ├── common
│   │   │   ├── Button.tsx
│   │   │   ├── index.ts
│   │   │   ├── Input.tsx
│   │   │   ├── LoadingStates.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Tooltip.tsx
│   │   ├── debug
│   │   │   └── AuthDebug.tsx
│   │   ├── layout
│   │   │   ├── ProgressBar
│   │   │   │   ├── ConnectedProgressBar.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── PersonaCircles.tsx
│   │   │   │   ├── ProgressBar.tsx
│   │   │   │   └── ProgressSteps.tsx
│   │   │   ├── Sidebar
│   │   │   │   ├── ConnectedSidebar.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── types.ts
│   │   │   │   └── WorkspaceItem.tsx
│   │   │   └── index.ts
│   │   └── workflow
│   │       ├── index.ts
│   │       ├── ProblemInput.tsx
│   │       └── WorkflowCanvas.tsx
│   ├── hooks
│   │   ├── useAuth.ts
│   │   └── useKeyboardShortcuts.ts
│   ├── services
│   │   ├── api
│   │   │   ├── client.ts
│   │   │   ├── export.ts
│   │   │   ├── personas.ts
│   │   │   ├── problem.ts
│   │   │   └── solutions.ts
│   │   ├── supabase
│   │   │   ├── client.ts
│   │   │   └── database.ts
│   │   ├── tauri
│   │   │   └── api.ts
│   │   └── index.ts
│   ├── stores
│   │   ├── canvasStore.ts
│   │   ├── index.ts
│   │   ├── projectStore.ts
│   │   ├── uiStore.ts
│   │   └── workflowStore.ts
│   ├── types
│   │   ├── database.types.ts
│   │   ├── index.ts
│   │   └── workflow.types.ts
│   ├── utils
│   │   ├── animations.ts
│   │   ├── cn.ts
│   │   └── index.ts
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
└── supabase
    ├── functions
    │   ├── generate-pain-points
    │   │   └── index.ts
    │   ├── generate-personas
    │   │   └── index.ts
    │   ├── generate-solutions
    │   │   └── index.ts
    │   ├── generate-system-design
    │   │   └── index.ts
    │   ├── generate-user-stories
    │   │   └── index.ts
    │   └── problem-validation
    │       └── index.ts
    ├── migrations
    │   ├── 001_initial_schema.sql
    │   └── 002_fix_rls_policies.sql
    ├── import_map.json
    └── seed.sql



<Referenced APIs>
Path: /Users/hutch/Documents/projects/gauntlet/p3/prob/src-tauri/src/db/models.rs

---
Classes:
  Class: User
  Class: Workspace
  Class: Project
  Class: CoreProblem
  Class: Persona
  Class: PainPoint
  Class: Solution
  Class: SolutionPainPointMapping
  Class: UserStory
  Class: SystemArchitecture
  Class: DataFlow
  Class: DataFlowStep
  Class: DatabaseTable
  Class: DatabaseColumn
  Class: DatabaseRelationship
  Class: UIScreen
  Class: UIComponent
  Class: DesignToken
  Class: AtomicComponent
  Class: LangGraphExecutionLog
  Class: ReactFlowState
  Class: LangGraphStateEvent
  Class: CanvasState
    Methods:
      - fn default() -> Self {
      - fn default() -> Self {
      - fn default() -> Self {
      - fn default() -> Self {
  Class: PersonaBuilder
    Methods:
      - pub fn new(core_problem_id: String, name: String) -> Self {
      - pub fn industry(mut self, industry: String) -> Self {
      - pub fn role(mut self, role: String) -> Self {
      - pub fn pain_degree(mut self, pain_degree: i32) -> Self {
      - pub fn position(mut self, position: i32) -> Self {
      - pub fn generation_batch(mut self, batch: String) -> Self {
      - pub fn build(self) -> Persona {
  Class: SolutionBuilder
    Methods:
      - pub fn new(project_id: String, persona_id: String, title: String) -> Self {
      - pub fn description(mut self, description: String) -> Self {
      - pub fn solution_type(mut self, solution_type: String) -> Self {
      - pub fn complexity(mut self, complexity: String) -> Self {
      - pub fn position(mut self, position: i32) -> Self {
      - pub fn build(self) -> Solution {
      - pub fn validate(&self) -> Result<(), String> {
      - pub fn validate(&self) -> Result<(), String> {
      - pub fn validate(&self) -> Result<(), String> {
      - fn to_string(&self) -> String {
      - fn from(s: String) -> Self {

Enums:
  - WorkflowStep
    Cases:
      - ProblemInput
      - SolutionDiscovery
      - FeatureSelection
      - UserStories
      - Architecture
      - DesignSystem
      - RepositorySetup
---

</Referenced APIs>
</file_map>

<file_contents>
File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/assets/react.svg
```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/auth/AuthForm.tsx
```tsx
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

interface AuthFormProps {
  onAuthSuccess?: () => void;
}

export function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const { signInWithEmail, signUpWithEmail, error, loading } = useAuth();
  const [email, setEmail] = useState('hutchenbach@gmail.com');
  const [password, setPassword] = useState('password123');
  const [isSignUp, setIsSignUp] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Email and password are required');
      return;
    }

    try {
      const result = isSignUp 
        ? await signUpWithEmail(email, password)
        : await signInWithEmail(email, password);

      if (result.error) {
        setLocalError(typeof result.error === 'string' ? result.error : result.error.message);
      } else {
        onAuthSuccess?.();
      }
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Welcome to GoldiDocs - Problem Discovery Tool
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {displayError && (
            <div className="rounded-md bg-red-900/20 border border-red-800 p-3">
              <div className="text-sm text-red-400">
                {displayError}
              </div>
            </div>
          )}

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Please wait...' : (isSignUp ? 'Sign up' : 'Sign in')}
            </Button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-blue-400 hover:text-blue-300"
              disabled={loading}
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/canvas/controls/BulkActionsBar.tsx
```tsx
import React from 'react';
import { Lock, Unlock, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { Button, IconButton } from '@/components/common/Button';

interface BulkActionsBarProps {
  selectedCount: number;
  onLockAll: () => void;
  onUnlockAll: () => void;
  onClearSelection: () => void;
  className?: string;
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onLockAll,
  onUnlockAll,
  onClearSelection,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={cn(
        'flex items-center gap-3 bg-gray-800 rounded-lg px-4 py-3 border border-gray-700',
        'shadow-lg',
        className
      )}
    >
      <span className="text-sm font-medium text-gray-300">
        {selectedCount} items selected
      </span>
      
      <div className="w-px h-6 bg-gray-700" />
      
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          icon={Lock}
          onClick={onLockAll}
        >
          Lock All
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          icon={Unlock}
          onClick={onUnlockAll}
        >
          Unlock All
        </Button>
      </div>
      
      <div className="flex-1" />
      
      <IconButton
        icon={X}
        size="sm"
        onClick={onClearSelection}
        aria-label="Clear selection"
      />
    </motion.div>
  );
};

export default BulkActionsBar; 
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/canvas/controls/CanvasControls.tsx
```tsx
import React, { useState } from 'react';
import { RefreshCw, Lock, Unlock, ZoomIn, ZoomOut, Maximize2, Grid } from 'lucide-react';
import { cn } from '@/utils/cn';
import { IconButton } from '@/components/common/Button';
import { SimpleTooltip } from '@/components/common/Tooltip';
import { motion, AnimatePresence } from 'framer-motion';

// Refresh Button Component
export interface RefreshButtonProps {
  label: string;
  onClick: () => void;
  loading?: boolean;
  count?: number;
  lockedCount?: number;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  label,
  onClick,
  loading = false,
  count,
  lockedCount = 0,
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={loading}
      className={cn(
        'flex items-center gap-2 px-4 py-2 bg-gray-800/90 backdrop-blur-sm',
        'border border-gray-700 rounded-lg text-white',
        'hover:bg-gray-700/90 hover:border-gray-600',
        'transition-all duration-base',
        'disabled:opacity-50 disabled:cursor-not-allowed'
      )}
    >
      <RefreshCw
        className={cn(
          'w-4 h-4',
          loading && 'animate-spin'
        )}
      />
      <span className="text-sm font-medium">
        {loading ? 'Regenerating...' : `Regenerate ${label}`}
      </span>
      {count !== undefined && (
        <div className="flex items-center gap-1.5 ml-2">
          <span className="text-xs text-gray-400">
            {count - lockedCount} of {count}
          </span>
          {lockedCount > 0 && (
            <Lock className="w-3 h-3 text-warning-500" />
          )}
        </div>
      )}
    </motion.button>
  );
};

// Lock Toggle Component
export interface LockToggleProps {
  isLocked: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md';
}

export const LockToggle: React.FC<LockToggleProps> = ({
  isLocked,
  onToggle,
  size = 'sm',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
  };

  return (
    <SimpleTooltip content={isLocked ? 'Unlock' : 'Lock'}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className={cn(
          'flex items-center justify-center rounded-lg',
          'bg-gray-800/50 hover:bg-gray-700/50',
          'border border-gray-700 hover:border-gray-600',
          'transition-all duration-fast',
          sizeClasses[size]
        )}
      >
        <AnimatePresence mode="wait">
          {isLocked ? (
            <motion.div
              key="locked"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.2 }}
            >
              <Lock className="w-4 h-4 text-warning-500" />
            </motion.div>
          ) : (
            <motion.div
              key="unlocked"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -180 }}
              transition={{ duration: 0.2 }}
            >
              <Unlock className="w-4 h-4 text-gray-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </SimpleTooltip>
  );
};

// Canvas Control Panel
interface CanvasControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onToggleGrid: () => void;
  showGrid: boolean;
  zoomLevel: number;
  className?: string;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onFitView,
  onToggleGrid,
  showGrid,
  zoomLevel,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-1 bg-gray-800 rounded-lg p-1 border border-gray-700', className)}>
      <SimpleTooltip content="Zoom in">
        <IconButton
          icon={ZoomIn}
          size="sm"
          onClick={onZoomIn}
          aria-label="Zoom in"
        />
      </SimpleTooltip>
      
      <div className="px-2 text-xs font-medium text-gray-400 min-w-[3rem] text-center">
        {Math.round(zoomLevel)}%
      </div>
      
      <SimpleTooltip content="Zoom out">
        <IconButton
          icon={ZoomOut}
          size="sm"
          onClick={onZoomOut}
          aria-label="Zoom out"
        />
      </SimpleTooltip>
      
      <div className="w-px h-6 bg-gray-700 mx-1" />
      
      <SimpleTooltip content="Fit to view">
        <IconButton
          icon={Maximize2}
          size="sm"
          onClick={onFitView}
          aria-label="Fit to view"
        />
      </SimpleTooltip>
      
      <SimpleTooltip content={showGrid ? 'Hide grid' : 'Show grid'}>
        <IconButton
          icon={Grid}
          size="sm"
          onClick={onToggleGrid}
          className={cn(showGrid && 'bg-gray-700')}
          aria-label={showGrid ? 'Hide grid' : 'Show grid'}
        />
      </SimpleTooltip>
    </div>
  );
}

export default CanvasControls;

// Selection Counter
export interface SelectionCounterProps {
  selected: number;
  total: number;
  label: string;
}

export const SelectionCounter: React.FC<SelectionCounterProps> = ({
  selected,
  total,
  label,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-2 bg-primary-600/10 backdrop-blur-sm border border-primary-600 rounded-full"
    >
      <span className="text-sm font-medium text-primary-400">
        {selected} of {total} {label} selected
      </span>
    </motion.div>
  );
};

// Bulk Actions Bar
export interface BulkActionsProps {
  selectedCount: number;
  onLockAll: () => void;
  onUnlockAll: () => void;
  onClearSelection: () => void;
  actions?: Array<{
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
  }>;
}

export const BulkActionsBar: React.FC<BulkActionsProps> = ({
  selectedCount,
  onLockAll,
  onUnlockAll,
  onClearSelection,
  actions = [],
}) => {
  if (selectedCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex items-center gap-3 px-4 py-3 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg"
    >
      <span className="text-sm text-gray-400">
        {selectedCount} items selected
      </span>
      
      <div className="h-4 w-px bg-gray-700" />
      
      <div className="flex items-center gap-2">
        <button
          onClick={onLockAll}
          className="px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
        >
          Lock All
        </button>
        <button
          onClick={onUnlockAll}
          className="px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
        >
          Unlock All
        </button>
        
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors flex items-center gap-1.5"
          >
            <action.icon className="w-4 h-4" />
            {action.label}
          </button>
        ))}
      </div>
      
      <div className="flex-1" />
      
      <button
        onClick={onClearSelection}
        className="text-sm text-gray-400 hover:text-white transition-colors"
      >
        Clear
      </button>
    </motion.div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/canvas/controls/index.ts
```ts
// Export all control components
export { RefreshButton } from './RefreshButton';
export { LockToggle } from './LockToggle';
export { CanvasControls } from './CanvasControls';
export { SelectionCounter } from './SelectionCounter';
export { BulkActionsBar } from './BulkActionsBar';

// Placeholder export to make this a valid module
export const CONTROLS_TODO = 'Controls components need to be implemented'; 
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/canvas/controls/LockToggle.tsx
```tsx
import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import { cn } from '@/utils/cn';
import { IconButton } from '@/components/common/Button';
import { SimpleTooltip } from '@/components/common/Tooltip';

interface LockToggleProps {
  isLocked: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LockToggle: React.FC<LockToggleProps> = ({
  isLocked,
  onToggle,
  size = 'sm',
  className,
}) => {
  return (
    <SimpleTooltip content={isLocked ? 'Unlock' : 'Lock'}>
      <IconButton
        icon={isLocked ? Lock : Unlock}
        size={size}
        onClick={onToggle}
        className={cn(
          isLocked && 'text-warning-500 hover:text-warning-400',
          className
        )}
        aria-label={isLocked ? 'Unlock item' : 'Lock item'}
      />
    </SimpleTooltip>
  );
};

export default LockToggle; 
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/canvas/controls/RefreshButton.tsx
```tsx
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/common/Button';

interface RefreshButtonProps {
  label: string;
  onClick: () => void;
  count?: number;
  lockedCount?: number;
  loading?: boolean;
  className?: string;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  label,
  onClick,
  count = 0,
  lockedCount = 0,
  loading = false,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant="secondary"
        size="sm"
        icon={RefreshCw}
        onClick={onClick}
        loading={loading}
        disabled={loading || (count > 0 && count === lockedCount)}
      >
        Regenerate {label}
      </Button>
      {count > 0 && (
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>{count - lockedCount} unlocked</span>
          {lockedCount > 0 && (
            <>
              <span>•</span>
              <span>{lockedCount} locked</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RefreshButton; 
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/canvas/controls/SelectionCounter.tsx
```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface SelectionCounterProps {
  selected: number;
  total: number;
  label?: string;
  className?: string;
}

export const SelectionCounter: React.FC<SelectionCounterProps> = ({
  selected,
  total,
  label = 'items',
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'bg-primary-600/10 border border-primary-600 text-primary-400',
        'px-4 py-2 rounded-full text-sm font-medium',
        'backdrop-blur-sm',
        className
      )}
    >
      <span className="text-white">{selected}</span>
      <span className="mx-1">/</span>
      <span>{total}</span>
      <span className="ml-1">{label} selected</span>
    </motion.div>
  );
};

export default SelectionCounter; 
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/canvas/edges/AnimatedEdge.tsx
```tsx
import React from 'react';
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
} from '@xyflow/react';
import { cn } from '@/utils/cn';

export interface AnimatedEdgeData {
  label?: string;
  animated?: boolean;
}

export const AnimatedEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeData = data as AnimatedEdgeData;
  const isAnimated = edgeData?.animated !== false;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        className={cn(
          isAnimated && 'animate-pulse',
          selected && 'stroke-primary-500'
        )}
        style={{
          stroke: selected ? '#3B82F6' : '#4B5563',
          strokeWidth: selected ? 2 : 1,
          strokeDasharray: isAnimated ? '5 5' : 'none',
        }}
      />
      
      {edgeData?.label && (
        <EdgeLabelRenderer>
          <div
            className="absolute px-2 py-1 text-xs font-medium bg-gray-800 text-gray-300 rounded-md border border-gray-700 pointer-events-none"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            {edgeData.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default AnimatedEdge;


```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/canvas/edges/DependencyEdge.tsx
```tsx
import React from 'react';
import {
  EdgeProps,
  getStraightPath,
  EdgeLabelRenderer,
  BaseEdge,
} from '@xyflow/react';
import { cn } from '@/utils/cn';

export interface DependencyEdgeData {
  label?: string;
  type?: 'blocks' | 'requires' | 'optional';
}

export const DependencyEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const edgeData = data as DependencyEdgeData;
  const dependencyType = edgeData?.type || 'requires';
  
  const typeStyles = {
    blocks: {
      stroke: '#EF4444',
      dashArray: '8 4',
    },
    requires: {
      stroke: '#F59E0B',
      dashArray: '5 5',
    },
    optional: {
      stroke: '#6B7280',
      dashArray: '2 4',
    },
  };

  const style = typeStyles[dependencyType];

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: selected ? '#3B82F6' : style.stroke,
          strokeWidth: selected ? 2 : 1.5,
          strokeDasharray: style.dashArray,
          opacity: dependencyType === 'optional' ? 0.6 : 1,
        }}
      />
      
      {edgeData?.label && (
        <EdgeLabelRenderer>
          <div
            className={cn(
              'absolute px-2 py-1 text-xs font-medium rounded pointer-events-none',
              dependencyType === 'blocks' && 'bg-error-600/20 text-error-400 border border-error-600/30',
              dependencyType === 'requires' && 'bg-warning-600/20 text-warning-400 border border-warning-600/30',
              dependencyType === 'optional' && 'bg-gray-700/50 text-gray-400 border border-gray-600/30'
            )}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            {edgeData.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default DependencyEdge;
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/canvas/edges/HighlightedEdge.tsx
```tsx
import React from 'react';
import {
  EdgeProps,
  getSmoothStepPath,
  EdgeLabelRenderer,
  BaseEdge,
} from '@xyflow/react';
import { cn } from '@/utils/cn';

export interface HighlightedEdgeData {
  label?: string;
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export const HighlightedEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeData = data as HighlightedEdgeData;
  const color = edgeData?.color || '#3B82F6';
  const intensity = edgeData?.intensity || 'medium';
  
  const glowIntensity = {
    low: 'drop-shadow(0 0 4px currentColor)',
    medium: 'drop-shadow(0 0 8px currentColor)',
    high: 'drop-shadow(0 0 12px currentColor)',
  };

  return (
    <>
      {/* Glow layer */}
      <path
        d={edgePath}
        fill="none"
        stroke={color}
        strokeWidth={8}
        opacity={0.3}
        style={{
          filter: glowIntensity[intensity],
        }}
      />
      
      {/* Main edge */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: color,
          strokeWidth: selected ? 3 : 2,
        }}
      />
      
      {edgeData?.label && (
        <EdgeLabelRenderer>
          <div
            className={cn(
              'absolute px-3 py-1.5 text-xs font-medium rounded-full pointer-events-none',
              'bg-gray-800 text-white border border-gray-700'
            )}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              boxShadow: `0 0 12px ${color}40`,
            }}
          >
            {edgeData.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default HighlightedEdge;
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/canvas/edges/index.ts
```ts
// Import components for edgeTypes configuration
import { AnimatedEdge } from './AnimatedEdge';
import { SolutionEdge } from './SolutionEdge';
import { HighlightedEdge } from './HighlightedEdge';
import { DependencyEdge } from './DependencyEdge';

// Export all edge components
export { AnimatedEdge } from './AnimatedEdge';
export { SolutionEdge } from './SolutionEdge';
export { HighlightedEdge } from './HighlightedEdge';
export { DependencyEdge } from './DependencyEdge';

// Export edge types
export type { SolutionEdgeData } from './SolutionEdge';

// Export edge types configuration for React Flow
export const edgeTypes = {
  animated: AnimatedEdge,
  solution: SolutionEdge,
  highlighted: HighlightedEdge,
  dependency: DependencyEdge,
};

// Add CSS for edge animations
const edgeStyles = `
@keyframes dash {
  from {
    stroke-dashoffset: 16;
  }
  to {
    stroke-dashoffset: 0;
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
const styleElement = document.createElement('style');
styleElement.textContent = edgeStyles;
document.head.appendChild(styleElement);
}
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/canvas/edges/SolutionEdge.tsx
```tsx
import React from 'react';
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
  getStraightPath,
} from '@xyflow/react';
import { cn } from '@/utils/cn';

// Solution Mapping Edge with Relevance Score
export interface SolutionEdgeData {
    relevanceScore: number;
    label?: string;
  }
  
  export const SolutionEdge: React.FC<EdgeProps<SolutionEdgeData>> = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    selected,
  }) => {
    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  
    const relevanceScore = data?.relevanceScore || 0;
    const isStrong = relevanceScore > 0.8;
    const isMedium = relevanceScore > 0.5 && relevanceScore <= 0.8;
    const isWeak = relevanceScore <= 0.5;
  
    const getStrokeColor = () => {
      if (selected) return '#2563EB';
      if (isStrong) return '#10B981';
      if (isMedium) return '#F59E0B';
      return '#6B7280';
    };
  
    const getStrokeWidth = () => {
      if (selected) return 3;
      if (isStrong) return 3;
      if (isMedium) return 2;
      return 1;
    };
  
    return (
      <>
        <BaseEdge
          id={id}
          path={edgePath}
          style={{
            stroke: getStrokeColor(),
            strokeWidth: getStrokeWidth(),
            opacity: isWeak ? 0.5 : 1,
          }}
        />
        
        {data?.relevanceScore !== undefined && (
          <EdgeLabelRenderer>
            <div
              className={cn(
                'absolute px-2 py-1 text-xs font-medium rounded-full pointer-events-none',
                isStrong && 'bg-success-600 text-white',
                isMedium && 'bg-warning-600 text-white',
                isWeak && 'bg-gray-600 text-white'
              )}
              style={{
                transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              }}
            >
              {Math.round(relevanceScore * 100)}%
            </div>
          </EdgeLabelRenderer>
        )}
      </>
    );
  };
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/canvas/nodes/BaseNode.tsx
```tsx
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

// Base Node Wrapper
interface BaseNodeProps {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
  variant: 'problem' | 'persona' | 'pain' | 'solution';
  showSourceHandle?: boolean;
  showTargetHandle?: boolean;
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  children,
  className,
  selected,
  variant,
  showSourceHandle = true,
  showTargetHandle = true,
}) => {
  const variantClasses = {
    problem: 'gradient-problem',
    persona: 'gradient-persona',
    pain: 'gradient-pain',
    solution: 'gradient-solution',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'canvas-node text-white',
        variantClasses[variant],
        selected && 'ring-2 ring-white ring-offset-2 ring-offset-gray-900',
        className
      )}
    >
      {showTargetHandle && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !bg-gray-600 !border-2 !border-gray-900"
        />
      )}
      {children}
      {showSourceHandle && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !bg-gray-600 !border-2 !border-gray-900"
        />
      )}
    </motion.div>
  );
};

export default BaseNode;
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/canvas/nodes/CoreProblemNode.tsx
```tsx
import React, { useState, useEffect } from 'react';
import { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { useWorkflowStore } from '@/stores/workflowStore';
import { problemApi } from '@/services/api/problem';
import { Sparkles, Loader2, CheckCircle } from 'lucide-react';

// Core Problem Node
export interface CoreProblemNodeData {
  id: string;
  problem?: string;
  status?: 'valid' | 'invalid' | 'editing';
  isDemo?: boolean;
}

export const CoreProblemNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as CoreProblemNodeData;
  const [problemText, setProblemText] = useState(nodeData.problem || '');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(!nodeData.problem);
  const [showGoldFlash, setShowGoldFlash] = useState(false);
  
  const { setProblemInput, proceedToNextStep, coreProblem } = useWorkflowStore();
  
  // Derive isValidated from coreProblem state
  const isValidated = coreProblem?.is_validated === true;

  // Update local state when node data changes
  useEffect(() => {
    if (nodeData.problem && nodeData.problem !== problemText) {
      setProblemText(nodeData.problem);
      setIsEditing(false);
    }
  }, [nodeData.problem]);

  // Auto-focus when in editing mode
  useEffect(() => {
    if (isEditing && !nodeData.isDemo) {
      const textarea = document.querySelector('.problem-input-textarea') as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
      }
    }
  }, [isEditing, nodeData.isDemo]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setProblemText(newText);
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleSubmit = async () => {
    const trimmedText = problemText.trim();
    if (!trimmedText) return;
    
    console.log('[CoreProblemNode] Starting validation for:', trimmedText);
    
    setIsValidating(true);
    setValidationError(null);
    
    try {
      setProblemInput(trimmedText);
      
      console.log('[CoreProblemNode] Calling problemApi.validateProblem...');
      console.log('[CoreProblemNode] Input text:', trimmedText);
      const validationResult = await problemApi.validateProblem(trimmedText);
      console.log('[CoreProblemNode] Validation result:', validationResult);
      
      if (validationResult.isValid) {
        console.log('[CoreProblemNode] Problem is valid, triggering all actions');
        
        // 1. Trigger gold flash animation
        setShowGoldFlash(true);
        setTimeout(() => setShowGoldFlash(false), 800);
        
        // 2. Set validated problem in store
        const workflowStore = useWorkflowStore.getState();
        const projectId = workflowStore.projectId || crypto.randomUUID();
        
        // Get the coreProblemId from the validation response
        const coreProblemId = (validationResult as any).coreProblemId || crypto.randomUUID();
        console.log('[CoreProblemNode] Using coreProblemId from validation:', coreProblemId);
        
        const coreProblem = {
          id: coreProblemId,  // Use the ID from validation response
          project_id: projectId,
          description: trimmedText,
          is_validated: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        // Update store state immediately
        useWorkflowStore.setState({ 
          projectId,
          coreProblem,
          problemInput: trimmedText
        });
        
        console.log('[CoreProblemNode] Set coreProblem:', coreProblem);
        
        // 3. Close editing mode
        setIsEditing(false);
        
        // 4. Proceed to next step immediately
        console.log('[CoreProblemNode] Proceeding to next step');
        proceedToNextStep();
        
        // 5. Generate personas immediately
        console.log('[CoreProblemNode] Triggering persona generation');
        workflowStore.generatePersonas();
      } else {
        console.log('[CoreProblemNode] Problem is invalid:', validationResult.feedback);
        setValidationError(validationResult.feedback || 'Invalid problem statement');
      }
    } catch (error) {
      console.error('[CoreProblemNode] Validation error:', error);
      setValidationError(error instanceof Error ? error.message : 'Failed to validate problem');
    } finally {
      setIsValidating(false);
    }
  };

  const handleEdit = () => {
    if (!isValidating) {
      setIsEditing(true);
      setValidationError(null);
    }
  };

  // Demo mode - just show static content
  if (nodeData.isDemo) {
    return (
      <BaseNode
        variant="problem"
        selected={selected}
        showTargetHandle={false}
        showSourceHandle={false}
        className="min-w-[320px] max-w-[400px]"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Core Problem
            </h3>
          </div>
          <p className="text-base leading-relaxed opacity-50">
            {nodeData.problem || 'Your problem will appear here'}
          </p>
        </div>
      </BaseNode>
    );
  }

  return (
    <BaseNode
      variant="problem"
      selected={selected}
      showTargetHandle={false}
      showSourceHandle={true}
      className={`min-w-[400px] max-w-[500px] ${showGoldFlash ? 'animate-gold-flash' : ''} ${isValidated ? 'border-accent-500 border-2' : ''}`}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
            Core Problem
          </h3>
          {coreProblem?.is_validated && !isEditing && (
            <CheckCircle className="w-4 h-4 text-blue-400 ml-auto" />
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <textarea
              id="core-problem-input"
              name="problemDescription"
              value={problemText}
              onChange={handleTextChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleSubmit();
                }
                // Prevent node dragging when typing
                e.stopPropagation();
              }}
              placeholder="Describe your problem in detail..."
              className="problem-input-textarea w-full h-24 p-3 bg-gray-800/80 text-white rounded-lg border border-gray-600 focus:border-gray-400 focus:outline-none resize-none transition-all duration-300 placeholder-gray-500 text-sm"
              disabled={isValidating}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            
            {validationError && (
              <div className="p-2 bg-gray-800/50 border border-gray-600 rounded text-gray-300 text-xs">
                {validationError}
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+Enter to submit
              </span>
              
              <button
                onClick={handleSubmit}
                disabled={!problemText.trim() || isValidating}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 text-sm"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Validating...
                  </>
                ) : (
                  'Analyze Problem'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p 
              className="text-base leading-relaxed cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleEdit}
            >
              {problemText || 'Click to enter your problem description...'}
            </p>
            {problemText && (
              <button
                onClick={handleEdit}
                className="text-xs text-gray-400 hover:text-gray-300 transition-colors"
              >
                Click to edit
              </button>
            )}
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default CoreProblemNode; 
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/canvas/nodes/index.ts
```ts
// Import components for nodeTypes configuration
import { CoreProblemNode } from './CoreProblemNode';
import { PersonaNode } from './PersonaNode';
import { PainPointNode } from './PainPointNode';
import { SolutionNode } from './SolutionNode';
import { LabelNode } from './LabelNode';

// Export all node components
export { BaseNode } from './BaseNode';
export { CoreProblemNode } from './CoreProblemNode';
export { PersonaNode } from './PersonaNode';
export { PainPointNode } from './PainPointNode';
export { SolutionNode } from './SolutionNode';
export { PainLevelIndicator } from './PainLevelIndicator';
export { LabelNode } from './LabelNode';

// Export types
export type { CoreProblemNodeData } from './CoreProblemNode';
export type { PersonaNodeData } from './PersonaNode';
export type { PainPointNodeData } from './PainPointNode';
export type { SolutionNodeData } from './SolutionNode';
export type { PainLevelIndicatorProps } from './PainLevelIndicator';

// Export node types configuration for React Flow
export const nodeTypes = {
  problem: CoreProblemNode,
  persona: PersonaNode,
  painPoint: PainPointNode,
  solution: SolutionNode,
  label: LabelNode,
};
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/canvas/nodes/LabelNode.tsx
```tsx
import React from 'react';
import { NodeProps } from '@xyflow/react';
import { RefreshCw } from 'lucide-react';

export interface LabelNodeData {
  text: string;
  showRefresh?: boolean;
  onRefresh?: () => void;
}

export const LabelNode: React.FC<NodeProps> = ({ data }) => {
  const nodeData = data as unknown as LabelNodeData;
  const { text, showRefresh = false, onRefresh } = nodeData;

  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
      <span>{text}</span>
      {showRefresh && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRefresh?.();
          }}
          className="p-1 hover:bg-gray-700 rounded transition-colors group"
          title="Refresh personas"
        >
          <RefreshCw className="w-4 h-4 group-hover:text-gray-300 transition-colors" />
        </button>
      )}
    </div>
  );
};

export default LabelNode; 
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/canvas/nodes/PainLevelIndicator.tsx
```tsx
import React from 'react';
import { cn } from '@/utils/cn';

export interface PainLevelIndicatorProps {
  level: number;
  maxLevel?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const sizeClasses = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
};

const gapClasses = {
  sm: 'gap-0.5',
  md: 'gap-1',
  lg: 'gap-1.5',
};

export const PainLevelIndicator: React.FC<PainLevelIndicatorProps> = ({
  level,
  maxLevel = 5,
  size = 'md',
  showLabel = true,
}) => {
  return (
    <div className={cn('flex items-center', gapClasses[size])}>
      {Array.from({ length: maxLevel }, (_, i) => i + 1).map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full transition-all',
            sizeClasses[size],
            i <= level ? 'bg-white' : 'bg-white/20'
          )}
        />
      ))}
      {showLabel && (
        <span className="ml-1 text-sm font-medium">
          {level}/{maxLevel}
        </span>
      )}
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/canvas/nodes/PainPointNode.tsx
```tsx
import React from 'react';
import { NodeProps } from '@xyflow/react';
import { Lock, Unlock } from 'lucide-react';
import { cn } from '@/utils/cn';
import { BaseNode } from './BaseNode';

// Pain Point Node
export interface PainPointNodeData {
  id: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  impactArea: string;
  isLocked?: boolean;
  isSkeleton?: boolean;
  onToggleLock?: () => void;
}

export const PainPointNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as PainPointNodeData;
  const { isLocked = false, isSkeleton = false, onToggleLock } = nodeData;

  const severityStyles = {
    critical: 'bg-error-600',
    high: 'bg-orange-600',
    medium: 'bg-warning-600',
    low: 'bg-gray-600',
  };

  // Skeleton state
  if (isSkeleton) {
    return (
      <BaseNode
        variant="pain"
        selected={selected}
        showSourceHandle={false}
        showTargetHandle={true}
        className="min-w-[280px] opacity-60"
      >
        <div className="space-y-3">
          {/* Skeleton Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="h-6 bg-gray-600 rounded skeleton-shimmer w-20"></div>
            <div className="w-4 h-4 bg-gray-600 rounded skeleton-shimmer"></div>
          </div>

          {/* Skeleton Description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-600 rounded skeleton-shimmer w-full"></div>
            <div className="h-4 bg-gray-600 rounded skeleton-shimmer w-3/4"></div>
          </div>

          {/* Skeleton Impact */}
          <div className="flex items-center gap-2 text-sm">
            <div className="h-4 bg-gray-600 rounded skeleton-shimmer w-12"></div>
            <div className="h-4 bg-gray-600 rounded skeleton-shimmer w-24"></div>
          </div>
        </div>
      </BaseNode>
    );
  }

  return (
    <BaseNode
      variant="pain"
      selected={selected}
      className="min-w-[280px]"
    >
      <div className="space-y-3">
        {/* Header with Severity and Lock */}
        <div className="flex items-start justify-between gap-3">
          <span
            className={cn(
              'px-2 py-1 text-xs font-medium rounded-full capitalize',
              severityStyles[nodeData.severity]
            )}
          >
            {nodeData.severity}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock?.();
            }}
            className="p-1 hover:bg-orange-600/20 rounded transition-colors"
          >
            {isLocked ? (
              <Lock className="w-4 h-4" />
            ) : (
              <Unlock className="w-4 h-4 opacity-60" />
            )}
          </button>
        </div>

        {/* Description */}
        <p className="text-base leading-relaxed">"{nodeData.description}"</p>

        {/* Impact Area */}
        <div className="flex items-center gap-2 text-sm opacity-80">
          <span>Impact:</span>
          <span className="font-medium">{nodeData.impactArea}</span>
        </div>
      </div>
    </BaseNode>
  );
};

export default PainPointNode; 
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/canvas/nodes/PersonaNode.tsx
```tsx
import React from 'react';
import { NodeProps } from '@xyflow/react';
import { Lock, Unlock } from 'lucide-react';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';
import { BaseNode } from './BaseNode';
import { PainLevelIndicator } from './PainLevelIndicator';

// Persona Node
export interface PersonaNodeData {
  id: string;
  name: string;
  industry: string;
  role: string;
  painDegree: number;
  description?: string;
  isLocked?: boolean;
  isExpanded?: boolean;
  isSkeleton?: boolean;
  onToggleLock?: () => void;
}

export const PersonaNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as PersonaNodeData;
  const { isLocked = false, isExpanded = false, isSkeleton = false, onToggleLock } = nodeData;

  // Skeleton state
  if (isSkeleton) {
    return (
      <BaseNode
        variant="persona"
        selected={selected}
        showSourceHandle={false}
        showTargetHandle={true}
        className="min-w-[280px] opacity-60"
      >
        <div className="space-y-3">
          {/* Skeleton Header */}
          <div className="flex items-start justify-between">
            <div className="h-6 bg-gray-600 rounded skeleton w-32"></div>
            <div className="w-4 h-4 bg-gray-600 rounded skeleton"></div>
          </div>

          {/* Skeleton Details */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg opacity-50">🏢</span>
              <div className="h-4 bg-gray-600 rounded skeleton w-24"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg opacity-50">👤</span>
              <div className="h-4 bg-gray-600 rounded skeleton w-28"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg opacity-50">📊</span>
              <div className="h-4 bg-gray-600 rounded skeleton w-20"></div>
            </div>
          </div>
        </div>
      </BaseNode>
    );
  }

  // Normal state
  return (
    <BaseNode
      variant="persona"
      selected={selected}
      showSourceHandle={isExpanded}
      showTargetHandle={true}
      className={cn(
        'min-w-[280px]',
        isExpanded ? 'min-w-[350px]' : ''
      )}
    >
      <div className="space-y-3">
        {/* Header with Lock */}
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold">{nodeData.name}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock?.();
            }}
            className="p-1 hover:bg-teal-600/20 rounded transition-colors"
          >
            {isLocked ? (
              <Lock className="w-4 h-4" />
            ) : (
              <Unlock className="w-4 h-4 opacity-60" />
            )}
          </button>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏢</span>
            <span className="opacity-90">{nodeData.industry}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">👤</span>
            <span className="opacity-90">{nodeData.role}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <div className="flex items-center gap-2 flex-1">
              <span className="opacity-90">Pain Level:</span>
              <PainLevelIndicator level={nodeData.painDegree} maxLevel={5} showLabel={true} />
            </div>
          </div>
        </div>

        {/* Expanded Description */}
        {isExpanded && nodeData.description && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="pt-3 border-t border-teal-600/30"
          >
            <p className="text-sm opacity-80 leading-relaxed">
              {nodeData.description}
            </p>
          </motion.div>
        )}
      </div>
    </BaseNode>
  );
};

export default PersonaNode; 
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/canvas/nodes/SolutionNode.tsx
```tsx
import React from 'react';
import { NodeProps } from '@xyflow/react';
import { Lock, Unlock, CheckSquare, Square } from 'lucide-react';
import { cn } from '@/utils/cn';
import { BaseNode } from './BaseNode';

// Solution Node
export interface SolutionNodeData {
  id: string;
  title: string;
  description: string;
  solutionType: 'feature' | 'integration' | 'automation' | 'analytics';
  complexity: 'low' | 'medium' | 'high';
  isLocked?: boolean;
  isSelected?: boolean;
  onToggleLock?: () => void;
  onToggleSelect?: () => void;
}

export const SolutionNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as SolutionNodeData;
  const { isLocked = false, isSelected = false, onToggleLock, onToggleSelect } = nodeData;

  const typeIcons = {
    feature: '⚡',
    integration: '🔗',
    automation: '🤖',
    analytics: '📊',
  };

  const complexityColors = {
    low: 'text-success-400',
    medium: 'text-warning-400',
    high: 'text-error-400',
  };

  return (
    <BaseNode
      variant="solution"
      selected={selected}
      showSourceHandle={false}
      className="min-w-[320px] max-w-[380px]"
    >
      <div className="space-y-3">
        {/* Header with Selection and Lock */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect?.();
              }}
              className="mt-0.5 hover:scale-110 transition-transform"
            >
              {isSelected ? (
                <CheckSquare className="w-5 h-5" />
              ) : (
                <Square className="w-5 h-5 opacity-60" />
              )}
            </button>
            <h3 className="text-lg font-bold">{nodeData.title}</h3>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock?.();
            }}
            className="p-1 hover:bg-blue-600/20 rounded transition-colors"
          >
            {isLocked ? (
              <Lock className="w-4 h-4" />
            ) : (
              <Unlock className="w-4 h-4 opacity-60" />
            )}
          </button>
        </div>

        {/* Description */}
        <p className="text-sm opacity-90 leading-relaxed line-clamp-2">
          {nodeData.description}
        </p>

        {/* Tags */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-900/30 rounded-full">
            <span>{typeIcons[nodeData.solutionType]}</span>
            <span className="capitalize">{nodeData.solutionType}</span>
          </div>
          <div className={cn('font-medium', complexityColors[nodeData.complexity])}>
            {nodeData.complexity} complexity
          </div>
        </div>
      </div>
    </BaseNode>
  );
};

export default SolutionNode; 
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/canvas/Canvas.tsx
```tsx
import React from 'react';
import { ReactFlow, Background, BackgroundVariant, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useCanvasStore } from '@/stores/canvasStore';
import { CanvasControls } from './controls';
import { nodeTypes } from './nodes';
import { edgeTypes } from './edges';

export function Canvas() {
  const {
    nodes,
    edges,
    viewport,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setViewport,
  } = useCanvasStore();

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        viewport={viewport}
        onViewportChange={setViewport}
        fitView
        className="bg-gray-900"
      >
        {/* Background pattern */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
          color="#374151"
        />
        
        {/* Controls */}
        <Controls
          className="bg-gray-800 border border-gray-700 rounded-lg"
          showZoom
          showFitView
          showInteractive
        />
        
        {/* MiniMap */}
        <MiniMap
          className="bg-gray-800 border border-gray-700 rounded-lg"
          maskColor="rgba(0, 0, 0, 0.6)"
          nodeColor={(node) => {
            const type = node.type || 'default';
            const colorMap: Record<string, string> = {
              problem: '#DC2626',
              persona: '#14B8A6',
              painPoint: '#F97316',
              solution: '#3B82F6',
              userStory: '#8B5CF6',
            };
            return colorMap[type] || '#6B7280';
          }}
        />
        
        {/* Custom Canvas Controls - temporarily disabled */}
        {/* <CanvasControls /> */}
      </ReactFlow>
    </div>
  );
}
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/canvas/index.ts
```ts
// Export all canvas components
export { Canvas } from './Canvas';
export * from './nodes';
export * from './edges';
export * from './controls'; 
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/common/Button.tsx
```tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm h-10 min-w-[100px]',
  md: 'px-6 py-3 text-base h-12 min-w-[120px]',
  lg: 'px-8 py-4 text-lg h-14 min-w-[140px]',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      loading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'btn',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          loading && 'cursor-wait',
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <span className="spinner mr-2" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {Icon && iconPosition === 'left' && (
              <Icon className="w-4 h-4 mr-2" />
            )}
            {children}
            {Icon && iconPosition === 'right' && (
              <Icon className="w-4 h-4 ml-2" />
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Icon Button Component
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'danger';
  loading?: boolean;
}

const iconButtonSizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const iconButtonVariants = {
  default: 'btn-icon',
  primary: 'bg-primary-600 text-white hover:bg-primary-700 border-primary-600',
  danger: 'bg-error-600 text-white hover:bg-error-700 border-error-600',
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      icon: Icon,
      size = 'md',
      variant = 'default',
      loading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'btn-icon',
          iconButtonSizes[size],
          iconButtonVariants[variant],
          loading && 'cursor-wait',
          className
        )}
        {...props}
      >
        {loading ? <span className="spinner" /> : <Icon className="w-4 h-4" />}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/common/index.ts
```ts
export { Button } from './Button';
export { Input } from './Input';
export { Modal } from './Modal';
export { Spinner, Skeleton, LoadingOverlay } from './LoadingStates';
export { Tooltip } from './Tooltip'; 
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/common/Input.tsx
```tsx
import React from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-400">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'input',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-error-500 focus:border-error-500 focus:ring-error-500/10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || hint) && (
          <p className={cn('text-sm', error ? 'text-error-500' : 'text-gray-500')}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea Component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, resize = 'vertical', id, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    
    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-gray-400">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'input min-h-[120px]',
            resizeClasses[resize],
            error && 'border-error-500 focus:border-error-500 focus:ring-error-500/10',
            className
          )}
          {...props}
        />
        {(error || hint) && (
          <p className={cn('text-sm', error ? 'text-error-500' : 'text-gray-500')}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Form Field Wrapper Component
export interface FormFieldProps {
  children: React.ReactNode;
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  children,
  label,
  error,
  hint,
  required,
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-400">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {(error || hint) && (
        <p className={cn('text-sm', error ? 'text-error-500' : 'text-gray-500')}>
          {error || hint}
        </p>
      )}
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/common/LoadingStates.tsx
```tsx
import React from 'react';
import { cn } from '@/utils/cn';

// Spinner Component
export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const spinnerSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-8 h-8',
};

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
  return (
    <div
      className={cn(
        'spinner',
        spinnerSizes[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
};

// Skeleton Component
export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = true,
}) => {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={cn(
        'bg-gray-800',
        animation && 'skeleton',
        variantClasses[variant],
        className
      )}
      style={{
        width: width || '100%',
        height: height || (variant === 'text' ? '1em' : '100%'),
      }}
    />
  );
};

// Loading Overlay Component
export interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  fullScreen?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = 'Loading...',
  fullScreen = false,
}) => {
  if (!visible) return null;

  return (
    <div
      className={cn(
        'flex items-center justify-center bg-gray-900/75 backdrop-blur-sm z-50',
        fullScreen ? 'fixed inset-0' : 'absolute inset-0'
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        {message && (
          <p className="text-sm text-gray-400">{message}</p>
        )}
      </div>
    </div>
  );
};

// Progress Bar Component
export interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  animated?: boolean;
}

const progressSizes = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const progressVariants = {
  default: 'bg-primary-600',
  success: 'bg-success-600',
  warning: 'bg-warning-600',
  error: 'bg-error-600',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  animated = true,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm text-gray-400">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-gray-700 rounded-full overflow-hidden', progressSizes[size])}>
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out',
            progressVariants[variant],
            animated && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

// Dots Loading Component
export const DotsLoading: React.FC = () => {
  return (
    <div className="flex gap-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
    </div>
  );
};

// Loading Card Component (for content placeholders)
export interface LoadingCardProps {
  lines?: number;
  showAvatar?: boolean;
  className?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({
  lines = 3,
  showAvatar = false,
  className,
}) => {
  return (
    <div className={cn('card', className)}>
      <div className="flex gap-4">
        {showAvatar && (
          <Skeleton variant="circular" width={48} height={48} />
        )}
        <div className="flex-1 space-y-3">
          <Skeleton variant="text" width="60%" height={20} />
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
              key={i}
              variant="text"
              width={i === lines - 1 ? '40%' : '100%'}
              height={16}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/common/Modal.tsx
```tsx
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { IconButton, Button } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const sizeStyles = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-7xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  children,
  footer,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    firstElement?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div
        ref={modalRef}
        className={cn(
          'relative w-full bg-gray-800 border border-gray-700 rounded-xl shadow-xl',
          'animate-slide-up max-h-[90vh] overflow-hidden flex flex-col',
          sizeStyles[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-6 border-b border-gray-700">
            <div>
              {title && (
                <h2 className="text-xl font-semibold text-white">{title}</h2>
              )}
              {description && (
                <p className="mt-1 text-sm text-gray-400">{description}</p>
              )}
            </div>
            {showCloseButton && (
              <IconButton
                icon={X}
                variant="default"
                size="sm"
                onClick={onClose}
                className="ml-4"
              />
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-6 border-t border-gray-700">{footer}</div>
        )}
      </div>
    </div>
  );
};

// Confirm Dialog Component
export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  loading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      closeOnOverlayClick={!loading}
      closeOnEscape={!loading}
      footer={
        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      {/* Empty content - title and description handle the message */}
      <div />
    </Modal>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/common/Tooltip.tsx
```tsx
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 200,
  className,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout>();
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (disabled) return;
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const spacing = 8;

    let x = 0;
    let y = 0;

    switch (position) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.top - tooltipRect.height - spacing;
        break;
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.bottom + spacing;
        break;
      case 'left':
        x = triggerRect.left - tooltipRect.width - spacing;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
      case 'right':
        x = triggerRect.right + spacing;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
    }

    // Ensure tooltip stays within viewport
    x = Math.max(8, Math.min(x, window.innerWidth - tooltipRect.width - 8));
    y = Math.max(8, Math.min(y, window.innerHeight - tooltipRect.height - 8));

    setCoords({ x, y });
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isVisible]);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-700',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-700',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-700',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-700',
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>
      
      {isVisible && content && (
        <div
          ref={tooltipRef}
          className={cn(
            'fixed z-50 px-3 py-2 text-sm text-white bg-gray-700 rounded-lg shadow-lg',
            'animate-fade-in pointer-events-none',
            className
          )}
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`,
          }}
          role="tooltip"
        >
          {content}
          <div
            className={cn(
              'absolute w-0 h-0 border-4 border-transparent',
              arrowClasses[position]
            )}
          />
        </div>
      )}
    </>
  );
};

// Simple Tooltip for Icon Buttons
export interface SimpleTooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export const SimpleTooltip: React.FC<SimpleTooltipProps> = ({
  content,
  children,
  side = 'top',
}) => {
  return (
    <Tooltip content={content} position={side} delay={500}>
      {children}
    </Tooltip>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/debug/AuthDebug.tsx
```tsx
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWorkflowStore } from '@/stores/workflowStore';

export const AuthDebug: React.FC = () => {
  const { user, session, loading, error } = useAuth();
  const { projectId, coreProblem, personas } = useWorkflowStore();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-gray-800 p-4 rounded-lg text-xs text-white z-50 max-w-md">
      <h3 className="font-bold mb-2">Debug Info</h3>
      
      <div className="space-y-1">
        <div>
          <strong>Auth Status:</strong> {loading ? 'Loading...' : user ? 'Authenticated' : 'Not authenticated'}
        </div>
        
        {user && (
          <div>
            <strong>User:</strong> {user.email} ({user.id.slice(0, 8)}...)
          </div>
        )}
        
        {error && (
          <div className="text-red-400">
            <strong>Auth Error:</strong> {error}
          </div>
        )}
        
        <div>
          <strong>Project ID:</strong> {projectId ? projectId.slice(0, 8) + '...' : 'None'}
        </div>
        
        <div>
          <strong>Core Problem:</strong> {coreProblem ? 'Set' : 'None'}
        </div>
        
        <div>
          <strong>Personas:</strong> {personas.length}
        </div>
        
        {session && (
          <div>
            <strong>Session:</strong> Valid (expires: {new Date(session.expires_at! * 1000).toLocaleTimeString()})
          </div>
        )}
      </div>
    </div>
  );
}; 
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/layout/ProgressBar/ConnectedProgressBar.tsx
```tsx
import React from 'react';
import { ProgressBar } from './ProgressBar';
import { useWorkflowStore } from '@/stores/workflowStore';

const WORKFLOW_STEPS = [
  'problem_input',
  'persona_discovery', 
  'pain_point_analysis',
  'solution_ideation',
  'user_story_creation'
];

export const ConnectedProgressBar: React.FC = () => {
  const { currentStep, personas } = useWorkflowStore();
  
  const currentStepIndex = WORKFLOW_STEPS.indexOf(currentStep) + 1;
  const totalSteps = WORKFLOW_STEPS.length;
  
  const formattedPersonas = personas.slice(0, 5).map(persona => ({
    id: persona.id,
    name: persona.name,
    avatar: undefined // We don't have avatars yet
  }));

  return (
    <ProgressBar
      currentStep={currentStepIndex}
      totalSteps={totalSteps}
      personas={formattedPersonas}
      showPersonas={personas.length > 0}
    />
  );
}; 
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/layout/ProgressBar/index.ts
```ts
// Export components
export { ProgressBar } from './ProgressBar';
export { ProgressSteps } from './ProgressSteps';
export { PersonaCircles } from './PersonaCircles';
export { ConnectedProgressBar } from './ConnectedProgressBar';

// Export types
export type { Persona } from './PersonaCircles';
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/layout/ProgressBar/PersonaCircles.tsx
```tsx
import React from 'react';
import { cn } from '@/utils/cn';

export interface Persona {
  id: string;
  name: string;
  avatar?: string;
}

interface PersonaCirclesProps {
  personas: Persona[];
  maxVisible?: number;
  className?: string;
}

export const PersonaCircles: React.FC<PersonaCirclesProps> = ({
  personas,
  maxVisible = 3,
  className = '',
}) => {
  const visiblePersonas = personas.slice(0, maxVisible);
  const remainingCount = personas.length - maxVisible;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visiblePersonas.map((persona, index) => (
        <div
          key={persona.id}
          className={cn(
            'relative w-10 h-10 rounded-full ring-2 ring-gray-800',
            'transition-transform duration-fast hover:z-10 hover:scale-110'
          )}
          style={{ zIndex: visiblePersonas.length - index }}
          title={persona.name}
        >
          {persona.avatar ? (
            <img 
              src={persona.avatar} 
              alt={persona.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {persona.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
          )}
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div 
          className="relative w-10 h-10 rounded-full bg-gray-700 ring-2 ring-gray-800 flex items-center justify-center"
          style={{ zIndex: 0 }}
        >
          <span className="text-sm font-medium text-gray-300">
            +{remainingCount}
          </span>
        </div>
      )}
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/layout/ProgressBar/ProgressBar.tsx
```tsx
import React from 'react';
import { cn } from '@/utils/cn';
import { PersonaCircles } from './PersonaCircles';
import { ProgressSteps } from './ProgressSteps';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  personas?: Array<{ id: string; name: string; avatar?: string }>;
  showPersonas?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  personas = [],
  showPersonas = true,
  className = '',
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className={cn('w-full space-y-4', className)}>
      <div className="flex items-center justify-between w-full">
        <div className="space-y-1">
          <span className="text-sm font-medium text-gray-400">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-2xl font-semibold text-white">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        
        {showPersonas && personas.length > 0 && (
          <PersonaCircles personas={personas} />
        )}
      </div>
      
      <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden w-full">
        <div 
          className="absolute inset-y-0 left-0 bg-primary-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse" />
        </div>
      </div>
      
      <div className="w-full">
        <ProgressSteps 
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      </div>
    </div>
  );
}; 
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/layout/ProgressBar/ProgressSteps.tsx
```tsx
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
  className?: string;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  currentStep,
  totalSteps,
  stepLabels = [],
  className = '',
}) => {
  console.log('[ProgressSteps] Rendering with currentStep:', currentStep, 'totalSteps:', totalSteps);
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  
  console.log('[ProgressSteps] Steps array:', steps);
  console.log('[ProgressSteps] Step analysis:', steps.map(step => ({
    step,
    isCompleted: step < currentStep,
    isCurrent: step === currentStep
  })));

  return (
    <div className={cn('relative w-full', className)}>
      {/* Connecting lines background */}
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-700" />
      
      {/* Progress overlay on connecting lines */}
      <div 
        className="absolute top-4 left-0 h-0.5 bg-accent-500 transition-all duration-slow"
        style={{ 
          width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` 
        }}
      />
      
      {/* Steps grid */}
      <div 
        className="grid w-full"
        style={{ 
          gridTemplateColumns: `repeat(${totalSteps}, 1fr)`,
        }}
      >
        {steps.map((step) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const label = stepLabels[step - 1] || `Step ${step}`;

          return (
            <div key={step} className="flex flex-col items-center gap-2 relative z-10">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-base',
                  'ring-2 ring-offset-2 ring-offset-gray-900',
                  isCompleted && 'bg-accent-500 ring-accent-500',
                  isCurrent && 'bg-gray-700 ring-primary-500 animate-pulse-glow',
                  !isCompleted && !isCurrent && 'bg-gray-700 ring-gray-600'
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span className={cn(
                    'text-sm font-medium',
                    isCurrent ? 'text-white' : 'text-gray-400'
                  )}>
                    {step}
                  </span>
                )}
              </div>
              <span className={cn(
                'text-xs font-medium text-center',
                (isCompleted || isCurrent) ? 'text-gray-300' : 'text-gray-500'
              )}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/layout/Sidebar/ConnectedSidebar.tsx
```tsx
import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useWorkflowStore } from '@/stores/workflowStore';
import { supabase } from '@/services/supabase/client';
import type { Workspace, Project } from './types';

export const ConnectedSidebar: React.FC = () => {
  const { user } = useAuth();
  const { projectId } = useWorkflowStore();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (!user) return;
      
      try {
        // Fetch workspaces with their projects
        const { data: workspacesData, error } = await supabase
          .from('workspaces')
          .select(`
            id,
            name,
            created_at,
            updated_at,
            projects (
              id,
              name,
              status,
              updated_at
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('[ConnectedSidebar] Error fetching workspaces:', error);
          return;
        }

        const formattedWorkspaces: Workspace[] = workspacesData.map(ws => ({
          id: ws.id,
          name: ws.name,
          updatedAt: ws.updated_at,
          projects: ws.projects.map((p: any) => ({
            id: p.id,
            name: p.name,
            status: p.status,
            updatedAt: new Date(p.updated_at)
          }))
        }));

        setWorkspaces(formattedWorkspaces);
      } catch (error) {
        console.error('[ConnectedSidebar] Error fetching workspaces:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, [user]);

  const handleWorkspaceCreate = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .insert({
          user_id: user.id,
          name: `Workspace ${workspaces.length + 1}`,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('[ConnectedSidebar] Error creating workspace:', error);
        return;
      }

      // Refresh workspaces
      setWorkspaces(prev => [
        {
          id: data.id,
          name: data.name,
          updatedAt: data.updated_at,
          projects: []
        },
        ...prev
      ]);
    } catch (error) {
      console.error('[ConnectedSidebar] Error creating workspace:', error);
    }
  };

  const handleProjectSelect = (selectedProjectId: string) => {
    // TODO: Load the selected project into the workflow store
    console.log('[ConnectedSidebar] Project selected:', selectedProjectId);
  };

  const handleSettings = () => {
    // TODO: Open settings modal
    console.log('[ConnectedSidebar] Settings clicked');
  };

  if (loading) {
    return (
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="heading-3">Workspaces</h2>
        </div>
        <div className="sidebar-content">
          <div className="p-4 text-gray-400">Loading...</div>
        </div>
      </aside>
    );
  }

  return (
    <Sidebar
      workspaces={workspaces}
      activeProjectId={projectId || undefined}
      onWorkspaceCreate={handleWorkspaceCreate}
      onProjectSelect={handleProjectSelect}
      onSettings={handleSettings}
    />
  );
}; 
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/layout/Sidebar/index.ts
```ts
// Export components
export { Sidebar } from './Sidebar';
export { WorkspaceItem } from './WorkspaceItem';

// Export types
export type { Workspace, Project, SidebarProps } from './types';
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/layout/Sidebar/Sidebar.tsx
```tsx
import React, { useState } from 'react';
import { Plus, Settings } from 'lucide-react';
import { WorkspaceItem } from './WorkspaceItem';
import type { SidebarProps } from './types';
import { cn } from '@/utils/cn';

export const Sidebar: React.FC<SidebarProps> = ({
  workspaces,
  activeWorkspaceId,
  activeProjectId,
  onWorkspaceSelect,
  onWorkspaceCreate,
  onProjectSelect,
  onNewProject,
  onSettings,
  className = '',
}) => {
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<Set<string>>(new Set());

  const toggleWorkspace = (workspaceId: string) => {
    setExpandedWorkspaces(prev => {
      const newSet = new Set(prev);
      if (newSet.has(workspaceId)) {
        newSet.delete(workspaceId);
      } else {
        newSet.add(workspaceId);
      }
      return newSet;
    });
  };

  return (
    <aside 
      className={cn(
        'sidebar',
        className
      )}
    >
      {/* Header */}
      <div className="sidebar-header">
        <h2 className="heading-3">Workspaces</h2>
        <button
          onClick={onWorkspaceCreate}
          className="btn-icon btn-icon--small"
          title="Create new workspace"
        >
          <Plus className="icon" />
        </button>
      </div>

      {/* Workspace List */}
      <div className="sidebar-content">
        {workspaces.map((workspace) => (
          <WorkspaceItem
            key={workspace.id}
            workspace={workspace}
            isExpanded={expandedWorkspaces.has(workspace.id)}
            onToggle={() => toggleWorkspace(workspace.id)}
            activeProjectId={activeProjectId}
            onProjectSelect={onProjectSelect || (() => {})}
            onSelect={() => onWorkspaceSelect?.(workspace.id)}
            isActive={activeWorkspaceId === workspace.id}
            statusColors={{
              draft: 'status-dot--draft',
              'in-progress': 'status-dot--progress',
              completed: 'status-dot--completed',
            }}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <button
          onClick={onSettings}
          className="sidebar-item"
        >
          <Settings className="icon" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}; 
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/layout/Sidebar/types.ts
```ts
export interface Workspace {
  id: string;
  name: string;
  projects: Project[];
  icon?: string;
  description?: string;
  updatedAt?: string;
  problemCount?: number;
}

export interface Project {
  id: string;
  name: string;
  status: 'draft' | 'in-progress' | 'completed';
  updatedAt: Date;
}

export interface SidebarProps {
  workspaces: Workspace[];
  activeWorkspaceId?: string;
  activeProjectId?: string;
  onWorkspaceSelect?: (workspaceId: string) => void;
  onWorkspaceCreate?: () => void;
  onProjectSelect?: (projectId: string) => void;
  onNewProject?: () => void;
  onSettings?: () => void;
  className?: string;
}
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/layout/Sidebar/WorkspaceItem.tsx
```tsx
import React from 'react';
import { ChevronRight, Folder, File } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Workspace, Project } from './types';

export interface WorkspaceItemProps {
  workspace: Workspace;
  isExpanded: boolean;
  onToggle: () => void;
  activeProjectId?: string;
  onProjectSelect: (projectId: string) => void;
  statusColors: Record<string, string>;
  className?: string;
  isActive?: boolean;
  onSelect: () => void;
}

export const WorkspaceItem: React.FC<WorkspaceItemProps> = ({
  workspace,
  isExpanded,
  onToggle,
  activeProjectId,
  onProjectSelect,
  statusColors,
  className = '',
  isActive,
  onSelect,
}) => {
  return (
    <div className="workspace-item">
      <button
        onClick={onToggle}
        className={cn(
          'sidebar-item sidebar-item--workspace',
          isExpanded && 'sidebar-item--active',
          className
        )}
      >
        <ChevronRight className={cn('icon icon-sm workspace-chevron', isExpanded && 'workspace-chevron--expanded')} />
        <div className="workspace-content">
          <h3 className="workspace-title">{workspace.name}</h3>
          {workspace.description && (
            <p className="body-sm workspace-description">
              {workspace.description}
            </p>
          )}
          <div className="workspace-meta">
            {workspace.updatedAt && (
              <>
                <span className="workspace-meta-item">
                  {new Date(workspace.updatedAt).toLocaleDateString()}
                </span>
                <span className="workspace-meta-separator">•</span>
              </>
            )}
            <span className="workspace-meta-item">
              {workspace.problemCount || 0} problems
            </span>
          </div>
        </div>
      </button>

      {isExpanded && workspace.projects.length > 0 && (
        <div className="project-list">
          {workspace.projects.map((project) => (
            <ProjectItem
              key={project.id}
              project={project}
              isActive={activeProjectId === project.id}
              onSelect={() => onProjectSelect(project.id)}
              statusColor={statusColors[project.status]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Project Item Sub-component
interface ProjectItemProps {
  project: Project;
  isActive: boolean;
  onSelect: () => void;
  statusColor: string;
}

const ProjectItem: React.FC<ProjectItemProps> = ({
  project,
  isActive,
  onSelect,
  statusColor,
}) => {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'project-item',
        isActive && 'project-item--active'
      )}
    >
      <File className="icon icon-sm" />
      <span className="project-name">
        {project.name}
      </span>
      <div
        className={cn('status-dot', statusColor)}
        title={project.status}
      />
    </button>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/layout/index.ts
```ts
export * from './Sidebar';
export * from './ProgressBar'; 
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/workflow/index.ts
```ts
export { ProblemInput } from './ProblemInput';
export { WorkflowCanvas } from './WorkflowCanvas';
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/workflow/ProblemInput.tsx
```tsx
import { useState } from 'react';
import { useWorkflowStore } from '@/stores/workflowStore';
import { problemApi } from '@/services/api/problem';
import { Sparkles, Loader2 } from 'lucide-react';

export function ProblemInput() {
  const [problemText, setProblemText] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { setProblemInput, proceedToNextStep } = useWorkflowStore();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Allow all characters including apostrophes, quotes, etc.
    const newText = e.target.value;
    setProblemText(newText);
    // Clear any validation errors when user types
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleSubmit = async () => {
    const trimmedText = problemText.trim();
    if (!trimmedText) return;
    
    console.log('[ProblemInput] Starting validation for:', trimmedText);
    console.log('[ProblemInput] Text contains apostrophe:', trimmedText.includes("'"));
    console.log('[ProblemInput] Character codes:', [...trimmedText].map(c => `${c}: ${c.charCodeAt(0)}`));
    
    setIsValidating(true);
    setValidationError(null);
    
    try {
      // First set the problem input in the store
      setProblemInput(trimmedText);
      
      // Call the validation API - no sanitization, send as-is
      console.log('[ProblemInput] Calling problemApi.validateProblem...');
      const validationResult = await problemApi.validateProblem(trimmedText);
      console.log('[ProblemInput] Full validation result:', JSON.stringify(validationResult, null, 2));
      
      if (validationResult.isValid) {
        console.log('[ProblemInput] Problem is valid, proceeding to next step');
        // Update the store with validation result
        const workflowStore = useWorkflowStore.getState();
        await workflowStore.validateProblem(trimmedText);
        
        // Proceed to next step
        proceedToNextStep();
      } else {
        console.log('[ProblemInput] Problem is invalid:', validationResult.feedback);
        setValidationError(validationResult.feedback || 'Invalid problem statement');
      }
    } catch (error) {
      console.error('[ProblemInput] Validation error:', error);
      console.error('[ProblemInput] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown',
        stack: error instanceof Error ? error.stack : 'No stack',
        error
      });
      setValidationError(error instanceof Error ? error.message : 'Failed to validate problem');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-gray-900">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl shadow-2xl max-w-2xl w-full mx-8 border border-gray-700">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h2 className="text-2xl font-semibold text-white">
            What problem are you trying to solve?
          </h2>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <textarea
            value={problemText}
            onChange={handleTextChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Describe your problem in detail..."
            className="w-full h-32 p-4 bg-gray-900/50 text-white rounded-lg border-2 border-gray-700 focus:border-blue-500 focus:outline-none resize-none transition-all duration-300 placeholder-gray-500"
            disabled={isValidating}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </form>
        
        {validationError && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400">
            {validationError}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">
            Press {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+Enter to submit
          </span>
          
          <button
            onClick={handleSubmit}
            disabled={!problemText.trim() || isValidating}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
          >
            {isValidating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Validating...
              </>
            ) : (
              'Analyze Problem'
            )}
          </button>
        </div>
        
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 bg-gray-800 rounded text-xs text-gray-500 font-mono overflow-auto">
            <div>Debug: Text length: {problemText.length}</div>
            <div>Debug: Validating: {isValidating ? 'Yes' : 'No'}</div>
            {validationError && <div className="text-red-400">Debug: Error: {validationError}</div>}
            <div className="break-all">Debug: Input: "{problemText}"</div>
          </div>
        )}
      </div>
    </div>
  );
}
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/components/workflow/WorkflowCanvas.tsx
```tsx
import React, { useEffect, useState } from 'react';
import { Canvas } from '@/components/canvas';
import { useWorkflowStore } from '@/stores/workflowStore';
import { useCanvasStore } from '@/stores/canvasStore';
import { Node, Edge } from '@xyflow/react';

export function WorkflowCanvas() {
  const { currentStep, coreProblem, personas, isGeneratingPersonas } = useWorkflowStore();
  const { addNodes, addEdges, updateEdge, zoomTo, resetCanvas, nodes, edges } = useCanvasStore();
  const [canvasInitialized, setCanvasInitialized] = useState(false);
  const [lastNodeCount, setLastNodeCount] = useState(0);
  const [lastEdgeCount, setLastEdgeCount] = useState(0);
  const [painPointsAdded, setPainPointsAdded] = useState(false);

  // Debug canvas state changes
  useEffect(() => {
    if (nodes.length !== lastNodeCount || edges.length !== lastEdgeCount) {
      console.log('[WorkflowCanvas] Canvas state changed:', {
        nodeCount: `${lastNodeCount} -> ${nodes.length}`,
        edgeCount: `${lastEdgeCount} -> ${edges.length}`,
        nodes: nodes.map(n => ({ id: n.id, type: n.type })),
        edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target }))
      });
      setLastNodeCount(nodes.length);
      setLastEdgeCount(edges.length);
      
      // Track what caused the change
      if (nodes.length === 0 && lastNodeCount > 0) {
        console.error('[WorkflowCanvas] CANVAS CLEARED! Nodes went from', lastNodeCount, 'to 0');
        console.trace('Canvas clear stack trace');
      }
    }
  }, [nodes, edges, lastNodeCount, lastEdgeCount]);

  // Initialize the canvas with the problem input node
  useEffect(() => {
    console.log('[WorkflowCanvas] Initialization effect triggered:', {
      currentStep,
      canvasInitialized,
      nodeCount: nodes.length
    });
    
    // Don't re-initialize if we already have nodes (prevent clearing)
    if (nodes.length > 0 && canvasInitialized) {
      console.log('[WorkflowCanvas] Canvas already has nodes, skipping initialization');
      return;
    }
    
    if (currentStep === 'problem_input' && !canvasInitialized) {
      console.log('[WorkflowCanvas] Setting up problem input node...');
      
      // Clear canvas first
      resetCanvas();
      
      // Create the interactive problem input node positioned in the left column
      const problemInputNode: Node = {
        id: 'problem-input',
        type: 'problem',
        position: { x: -250, y: 0 }, // Left column center
        data: { 
          id: 'problem-input',
          problem: coreProblem?.description || '',
          status: coreProblem?.is_validated ? 'valid' : 'editing',
          isDemo: false
        },
        draggable: false, // CoreProblemNode should never be draggable
      };

      // Create column label nodes
      const coreProblemLabelNode: Node = {
        id: 'core-problem-label',
        type: 'label',
        position: { x: -250, y: -120 }, // Centered above CoreProblemNode (x: -250)
        data: { 
          text: 'Core Problem',
          showRefresh: false
        },
        draggable: false,
        selectable: false,
      };

      const personasLabelNode: Node = {
        id: 'personas-label',
        type: 'label', 
        position: { x: 600, y: -420 }, // Centered above PersonaNodes column (x: 600)
        data: {
          text: 'Personas',
          showRefresh: true,
          onRefresh: () => {
            console.log('[WorkflowCanvas] Refreshing personas...');
            const workflowStore = useWorkflowStore.getState();
            if (workflowStore.coreProblem) {
              workflowStore.generatePersonas();
            }
          }
        },
        draggable: false,
        selectable: false,
      };

      // Create 5 PersonaNodes in skeleton state initially - positioned to barely peek from right edge
      const personaNodes: Node[] = Array.from({ length: 5 }, (_, index) => ({
        id: `persona-${index + 1}`,
        type: 'persona',
        position: { 
          x: 600, // Far right column - personas will barely peek into view
          y: -300 + (index * 150) // Vertical spacing of 150px between nodes
        },
        data: {
          id: `persona-${index + 1}`,
          name: '',
          industry: '',
          role: '',
          painDegree: 0,
          description: '',
          isLocked: false,
          isExpanded: false,
          isSkeleton: !coreProblem?.description, // Skeleton state when no problem
          onToggleLock: () => {
            // TODO: Implement persona locking
            console.log(`Toggle lock for persona ${index + 1}`);
          }
        },
        draggable: true,
      }));
      
      // Create edges connecting the problem node to each persona node
      // Initially solid (not animated) until persona generation starts
      const edges: Edge[] = personaNodes.map((personaNode, index) => ({
        id: `problem-to-persona-${index + 1}`,
        source: 'problem-input',
        target: personaNode.id,
        type: 'default',
        style: { 
          stroke: '#6B7280', 
          strokeWidth: 2,
          opacity: 0.7 
        },
        animated: false, // Start with solid edges
      }));
      
      console.log('[WorkflowCanvas] Adding initial nodes:', {
        labels: 2,
        problemNode: 1,
        personaNodes: personaNodes.length,
        edges: edges.length
      });
      
      addNodes([coreProblemLabelNode, personasLabelNode, problemInputNode, ...personaNodes]);
      addEdges(edges);
      
      setCanvasInitialized(true);
      
      // Center the view on the problem node with appropriate zoom to show persona column edge
      setTimeout(() => {
        console.log('[WorkflowCanvas] Centering view on problem node...');
        zoomTo(0.6); // Further reduced zoom to show more of the canvas width
      }, 100);
    }
  }, [currentStep, canvasInitialized, addNodes, zoomTo, resetCanvas, coreProblem, nodes.length]);

  // Update the problem node when core problem changes
  useEffect(() => {
    if (coreProblem && canvasInitialized) {
      console.log('[WorkflowCanvas] Updating problem node with validated problem');
      
      // Update the problem input node
      const canvasStore = useCanvasStore.getState();
      canvasStore.updateNode('problem-input', {
        data: {
          id: 'problem-input',
          problem: coreProblem.description,
          status: 'valid',
          isDemo: false
        },
        draggable: false, // CoreProblemNode should never be draggable
      });

      // Update persona nodes to remove skeleton state (they'll be populated by the personas effect)
      for (let i = 1; i <= 5; i++) {
        const nodeId = `persona-${i}`;
        canvasStore.updateNode(nodeId, {
          data: {
            id: nodeId,
            name: '',
            industry: '',
            role: '',
            painDegree: 0,
            description: '',
            isLocked: false,
            isExpanded: false,
            isSkeleton: false, // Remove skeleton state
            onToggleLock: () => {
              console.log(`Toggle lock for persona ${i}`);
            }
          }
        });
      }
    }
  }, [coreProblem, canvasInitialized]);

  // Handle persona generation state - animate edges and add pain points
  useEffect(() => {
    console.log('[WorkflowCanvas] Persona generation state changed:', {
      isGeneratingPersonas,
      painPointsAdded,
      canvasInitialized
    });

    if (isGeneratingPersonas && canvasInitialized && !painPointsAdded) {
      console.log('[WorkflowCanvas] Persona generation started - animating edges and adding pain points');
      
      const canvasStore = useCanvasStore.getState();
      
      // Animate the problem-to-persona edges
      for (let i = 1; i <= 5; i++) {
        canvasStore.updateEdge(`problem-to-persona-${i}`, {
          animated: true
        });
      }

      // Add Pain Points column label
      const painPointsLabelNode: Node = {
        id: 'pain-points-label',
        type: 'label',
        position: { x: 1450, y: -420 }, // Right of personas column
        data: {
          text: 'Pain Points',
          showRefresh: false
        },
        draggable: false,
        selectable: false,
      };

      // Create pain point skeleton nodes - only 3 total, card-sized like personas
      const painPointNodes: Node[] = [];
      const painPointEdges: Edge[] = [];

      // Create 3 pain points total, positioned vertically
      for (let painIndex = 0; painIndex < 3; painIndex++) {
        const painPointId = `pain-point-${painIndex + 1}`;
        
        painPointNodes.push({
          id: painPointId,
          type: 'pain',
          position: {
            x: 1450, // Pain points column
            y: -300 + (painIndex * 150) // Same vertical spacing as personas (150px)
          },
          data: {
            id: painPointId,
            description: '',
            severity: 'medium' as const,
            impactArea: '',
            isLocked: false,
            isSkeleton: true, // Start in skeleton state
            onToggleLock: () => {
              console.log(`Toggle lock for pain point ${painPointId}`);
            }
          },
          draggable: true,
        });

        // Create animated edges from each persona to each pain point
        // This creates a many-to-many relationship visualization
        for (let personaIndex = 0; personaIndex < 5; personaIndex++) {
          const personaNodeId = `persona-${personaIndex + 1}`;
          
          painPointEdges.push({
            id: `persona-${personaIndex + 1}-to-pain-${painIndex + 1}`,
            source: personaNodeId,
            target: painPointId,
            type: 'default',
            style: {
              stroke: '#F97316', // Orange color for pain point connections
              strokeWidth: 1.5, // Thinner for many connections
              opacity: 0.3 // Lower opacity since there are many edges
            },
            animated: true, // Animated edges for pain points
          });
        }
      }

      // Add all pain point nodes and edges
      console.log('[WorkflowCanvas] Adding pain point skeleton nodes:', {
        labelNode: 1,
        nodeCount: painPointNodes.length,
        edgeCount: painPointEdges.length
      });
      
      addNodes([painPointsLabelNode, ...painPointNodes]);
      addEdges(painPointEdges);
      
      setPainPointsAdded(true);
      
      // Adjust zoom to show all three columns
      setTimeout(() => {
        zoomTo(0.4); // Zoom out more to show all three columns
      }, 100);
    }
  }, [isGeneratingPersonas, canvasInitialized, painPointsAdded, addNodes, addEdges, updateEdge, zoomTo]);

  // Update PersonaNodes when personas are available
  useEffect(() => {
    console.log('[WorkflowCanvas] Personas effect triggered:', {
      personaCount: personas.length,
      canvasInitialized
    });
    
    if (personas.length > 0 && canvasInitialized) {
      console.log('[WorkflowCanvas] Updating persona nodes with data:', personas.length);
      
      const canvasStore = useCanvasStore.getState();
      
      // Update the first 5 persona nodes with actual data
      personas.slice(0, 5).forEach((persona, index) => {
        const nodeId = `persona-${index + 1}`;
        console.log('[WorkflowCanvas] Updating persona node:', nodeId, persona.name);
        
        canvasStore.updateNode(nodeId, {
          data: {
            id: nodeId,
            name: persona.name,
            industry: persona.demographics?.industry || 'Unknown',
            role: persona.demographics?.role || 'Unknown',
            painDegree: Math.floor(Math.random() * 5) + 1, // Random pain level 1-5, could be from API
            description: persona.description,
            isLocked: persona.is_locked,
            isExpanded: false,
            isSkeleton: false, // Ensure skeleton state is off
            onToggleLock: () => {
              const workflowStore = useWorkflowStore.getState();
              workflowStore.togglePersonaLock(persona.id);
            }
          }
        });
      });
    }
  }, [personas, canvasInitialized]);

  // Handle step changes and canvas adjustments
  useEffect(() => {
    console.log('[WorkflowCanvas] Step change detected:', currentStep, 'canvasInitialized:', canvasInitialized);
    
    if (currentStep !== 'problem_input' && canvasInitialized) {
      console.log('[WorkflowCanvas] Moving past problem input, updating canvas...');
      console.log('[WorkflowCanvas] Current step:', currentStep);
      
      if (currentStep === 'persona_discovery') {
        console.log('[WorkflowCanvas] Entering persona discovery, adjusting canvas view...');
        // Adjust the canvas view to show both problem and persona columns
        zoomTo(0.5); // Even more zoomed out to show full layout
      }
    }
  }, [currentStep, canvasInitialized, zoomTo]);

  return (
    <div className="relative w-full h-full">
      {/* React Flow Canvas */}
      <Canvas />

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 bg-gray-800 p-2 rounded text-xs text-gray-400 z-30">
          <div>Step: {currentStep}</div>
          <div>Problem: {coreProblem ? 'Validated' : 'Not validated'}</div>
          <div>Canvas Init: {canvasInitialized ? 'Yes' : 'No'}</div>
          <div>Nodes: {nodes.length}</div>
          <div>Edges: {edges.length}</div>
          <div>Personas: {personas.length}</div>
          <div>Generating: {isGeneratingPersonas ? 'Yes' : 'No'}</div>
          <div>Pain Points: {painPointsAdded ? 'Added' : 'Not added'}</div>
        </div>
      )}
    </div>
  );
}
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/hooks/useAuth.ts
```ts
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('[useAuth] Error getting session:', error);
          setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
          return;
        }
        
        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('[useAuth] Exception getting session:', error);
        setAuthState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Unknown error',
          loading: false 
        }));
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[useAuth] Auth state changed:', event, session?.user?.email);
        
        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
          error: null
        });
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { error: errorMessage };
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message }));
        return { error };
      }
      return { error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setAuthState(prev => ({ ...prev, error: errorMessage }));
      return { error: errorMessage };
    }
  };

  return {
    ...authState,
    signInWithEmail,
    signUpWithEmail,
    signOut
  };
} 
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/hooks/useKeyboardShortcuts.ts
```ts
import { useEffect } from 'react';
import { useWorkflowStore } from '@/stores/workflowStore';

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter to submit
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        const { currentStep, proceedToNextStep } = useWorkflowStore.getState();
        if (currentStep === 'problem_input') {
          proceedToNextStep();
        }
      }
      
      // Cmd/Ctrl + R to refresh (regenerate)
      if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
        e.preventDefault();
        // Add regeneration logic here
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/services/api/client.ts
```ts
import { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '../supabase/client'

export interface RequestConfig {
  maxRetries?: number
  retryDelay?: number
  timeout?: number
  onProgress?: (progress: number) => void
  signal?: AbortSignal
}

export interface EdgeFunctionResponse<T> {
  data?: T
  error?: {
    message: string
    code: string
    details?: any
  }
  metadata?: {
    duration: number
    tokens_used?: number
  }
}

export interface EdgeFunctionError {
  message: string
  code: string
  details?: any
  originalError?: any
}

class ApiClient {
  private supabase: SupabaseClient
  private defaultConfig: RequestConfig = {
    maxRetries: 3,
    retryDelay: 1000,
    timeout: 30000,
  }

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient
  }

  /**
   * Invokes a Supabase Edge Function with retry logic and error handling
   */
  async invokeEdgeFunction<T>(
    functionName: string,
    payload: any,
    config?: RequestConfig
  ): Promise<EdgeFunctionResponse<T>> {
    const finalConfig = { ...this.defaultConfig, ...config }
    const startTime = Date.now()
    
    let lastError: any
    let attempt = 0

    while (attempt <= (finalConfig.maxRetries || 3)) {
      try {
        // Create abort controller for timeout
        const { controller, timeout } = this.createAbortController(finalConfig.timeout)
        const signals = [controller.signal, finalConfig.signal].filter((signal): signal is AbortSignal => signal !== undefined)
        const combinedSignal = this.combineAbortSignals(signals)

        // Check if already aborted
        if (combinedSignal.aborted) {
          throw new Error('Request was cancelled')
        }

        // Add request interceptors
        const headers = await this.addRequestInterceptors()
        
        // Create a promise that rejects when the signal is aborted
        const requestPromise = this.supabase.functions.invoke(functionName, {
          body: payload,
          headers,
        })

        const abortPromise = new Promise<never>((_, reject) => {
          combinedSignal.addEventListener('abort', () => {
            reject(new Error('Request was cancelled'))
          })
        })

        // Race the request against the abort signal
        const response = await Promise.race([requestPromise, abortPromise])

        // Clear timeout
        if (timeout) clearTimeout(timeout)

        // Handle response
        if (response.error) {
          const transformedError = this.transformError(response.error)
          
          // Check if we should retry
          if (attempt < (finalConfig.maxRetries || 3) && await this.handleRetry(response.error, attempt, finalConfig)) {
            attempt++
            continue
          }
          
          return {
            error: transformedError,
            metadata: {
              duration: Date.now() - startTime,
            }
          }
        }

        // Success response
        const result: EdgeFunctionResponse<T> = {
          data: response.data,
          metadata: {
            duration: Date.now() - startTime,
            tokens_used: response.data?.metadata?.tokens_used,
          }
        }

        // Apply response interceptors
        return this.applyResponseInterceptors(result)

      } catch (error) {
        lastError = error
        
        // Check if we should retry
        if (attempt < (finalConfig.maxRetries || 3) && await this.handleRetry(error, attempt, finalConfig)) {
          attempt++
          continue
        }
        
        // Transform and return error
        const transformedError = this.transformError(error)
        return {
          error: transformedError,
          metadata: {
            duration: Date.now() - startTime,
          }
        }
      }
    }

    // Fallback error if all retries failed
    return {
      error: this.transformError(lastError),
      metadata: {
        duration: Date.now() - startTime,
      }
    }
  }

  /**
   * Creates an AbortController with optional timeout
   */
  createAbortController(timeout?: number): { controller: AbortController, timeout?: NodeJS.Timeout } {
    const controller = new AbortController()
    let timeoutId: NodeJS.Timeout | undefined

    if (timeout) {
      timeoutId = setTimeout(() => {
        controller.abort(new Error('Request timeout'))
      }, timeout)
    }

    return { controller, timeout: timeoutId }
  }

  /**
   * Handles retry logic with exponential backoff
   */
  async handleRetry(error: any, attempt: number, config: RequestConfig): Promise<boolean> {
    // Don't retry on certain error types
    if (
      error?.name === 'AbortError' ||
      error?.code === 'UNAUTHORIZED' ||
      error?.code === 'FORBIDDEN' ||
      error?.status === 401 ||
      error?.status === 403 ||
      error?.status === 404
    ) {
      return false
    }

    // Calculate delay with exponential backoff
    const baseDelay = config.retryDelay || 1000
    const delay = Math.min(baseDelay * Math.pow(2, attempt), 10000) // Max 10 seconds
    
    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.1 * delay
    const finalDelay = delay + jitter

    await new Promise(resolve => setTimeout(resolve, finalDelay))
    return true
  }

  /**
   * Transforms errors to consistent format
   */
  transformError(error: any): EdgeFunctionError {
    if (!error) {
      return {
        message: 'Unknown error occurred',
        code: 'UNKNOWN_ERROR'
      }
    }

    // Handle different error formats
    if (error.message && error.code) {
      return {
        message: error.message,
        code: error.code,
        details: error.details,
        originalError: error
      }
    }

    if (error.name === 'AbortError') {
      return {
        message: 'Request was cancelled',
        code: 'REQUEST_CANCELLED',
        originalError: error
      }
    }

    if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
      return {
        message: 'Request timed out',
        code: 'REQUEST_TIMEOUT',
        originalError: error
      }
    }

    // Network errors
    if (error.name === 'NetworkError' || !navigator.onLine) {
      return {
        message: 'Network connection error',
        code: 'NETWORK_ERROR',
        originalError: error
      }
    }

    // HTTP status errors
    if (error.status) {
      const statusMessages: Record<number, string> = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        429: 'Too Many Requests',
        500: 'Internal Server Error',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        504: 'Gateway Timeout'
      }

      return {
        message: statusMessages[error.status] || `HTTP ${error.status}`,
        code: `HTTP_${error.status}`,
        details: error.data || error.body,
        originalError: error
      }
    }

    // Fallback
    return {
      message: error.message || 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      details: error,
      originalError: error
    }
  }

  /**
   * Adds request interceptors for auth and logging
   */
  private async addRequestInterceptors(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Add auth token if available
    const { data: { session } } = await this.supabase.auth.getSession()
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    }

    // Add request ID for tracing
    headers['X-Request-ID'] = crypto.randomUUID()

    return headers
  }

  /**
   * Applies response interceptors for data transformation
   */
  private applyResponseInterceptors<T>(response: EdgeFunctionResponse<T>): EdgeFunctionResponse<T> {
    // Log successful requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        duration: response.metadata?.duration,
        tokens: response.metadata?.tokens_used,
        hasData: !!response.data,
        hasError: !!response.error
      })
    }

    return response
  }

  /**
   * Combines multiple abort signals
   */
  private combineAbortSignals(signals: AbortSignal[]): AbortSignal {
    if (signals.length === 1) return signals[0]
    
    const controller = new AbortController()
    
    signals.forEach(signal => {
      if (signal.aborted) {
        controller.abort(signal.reason)
        return
      }
      
      signal.addEventListener('abort', () => {
        controller.abort(signal.reason)
      }, { once: true })
    })
    
    return controller.signal
  }
}

// Export singleton instance
export const apiClient = new ApiClient(supabase)

// Export for testing or custom instances
export { ApiClient }

```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/services/api/export.ts
```ts
import { tauriAPI } from '@/services/tauri/api'
import type { 
  Project, 
  Persona, 
  Solution, 
  PainPoint,
  SolutionPainPointMapping 
} from '@/types/database.types'

// Extended types for export functionality
export interface CoreProblem {
  id: string
  project_id: string
  validated_problem: string
  created_at: string
  updated_at: string
}

export interface UserStory {
  id: string
  project_id: string
  persona_id: string
  title: string
  as_a: string
  i_want: string
  so_that: string
  acceptance_criteria: string[]
  technical_notes?: string
  created_at: string
  updated_at: string
}

export interface SystemArchitecture {
  id: string
  project_id: string
  layer: string
  technology: string
  justification: string
  created_at: string
  updated_at: string
}

export interface DesignToken {
  id: string
  project_id: string
  category: 'color' | 'typography' | 'spacing'
  name: string
  value: string
  description?: string
  created_at: string
  updated_at: string
}

export interface AtomicComponent {
  id: string
  project_id: string
  type: 'atom' | 'molecule' | 'organism'
  name: string
  description: string
  props: Record<string, any>
  created_at: string
  updated_at: string
}

export interface DataFlow {
  id: string
  project_id: string
  name: string
  description: string
  user_story_id: string
  created_at: string
  updated_at: string
}

export interface DataFlowStep {
  id: string
  data_flow_id: string
  sequence: number
  description: string
  actor: string
  action: string
  created_at: string
  updated_at: string
}

export interface DatabaseTable {
  id: string
  project_id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface DatabaseColumn {
  id: string
  table_id: string
  name: string
  type: string
  constraints: string[]
  description?: string
  created_at: string
  updated_at: string
}

export interface DatabaseRelationship {
  id: string
  from_table_id: string
  to_table_id: string
  relationship_type: 'one_to_one' | 'one_to_many' | 'many_to_many'
  description?: string
  created_at: string
  updated_at: string
}

export interface ExportRequest {
  projectId: string
  exportFormat: 'markdown'
  includeFiles: {
    productVision: boolean
    userEpics: boolean
    systemArchitecture: boolean
    designSystem: boolean
    dataFlow: boolean
    entityRelationshipDiagram: boolean
  }
}

export interface ExportResponse {
  files: ExportedFile[]
  metadata: {
    exportDate: Date
    projectName: string
    totalFiles: number
  }
}

export interface ExportedFile {
  filename: string
  content: string
  type: 'markdown'
}

interface ProjectData {
  project: Project
  coreProblem?: CoreProblem
  personas: Persona[]
  painPoints: PainPoint[]
  solutions: Solution[]
  solutionMappings: SolutionPainPointMapping[]
  userStories: UserStory[]
}

interface Section {
  title: string
  level: number
  anchor: string
}

interface Reference {
  source: string
  target: string
  text: string
}

class ExportService {
  /**
   * Main export method - generates all requested documents
   */
  async exportProject(request: ExportRequest): Promise<ExportResponse> {
    try {
      // Gather all project data
      const projectData = await this.gatherProjectData(request.projectId)
      const files: ExportedFile[] = []

      // Generate requested documents
      if (request.includeFiles.productVision) {
        files.push({
          filename: 'product_vision.md',
          content: this.generateProductVision(projectData),
          type: 'markdown'
        })
      }

      if (request.includeFiles.userEpics) {
        files.push({
          filename: 'user_epics.md',
          content: this.generateUserEpics(projectData.userStories, projectData.personas),
          type: 'markdown'
        })
      }

      if (request.includeFiles.systemArchitecture) {
        const architectureData = await this.getSystemArchitecture(request.projectId)
        files.push({
          filename: 'system_architecture.md',
          content: this.generateSystemArchitecture(architectureData),
          type: 'markdown'
        })
      }

      if (request.includeFiles.designSystem) {
        const designTokens = await this.getDesignTokens(request.projectId)
        const components = await this.getAtomicComponents(request.projectId)
        files.push({
          filename: 'design_system.md',
          content: this.generateDesignSystem(designTokens, components),
          type: 'markdown'
        })
      }

      if (request.includeFiles.dataFlow) {
        const dataFlows = await this.getDataFlows(request.projectId)
        const dataFlowSteps = await this.getDataFlowSteps(request.projectId)
        files.push({
          filename: 'data_flow.md',
          content: this.generateDataFlow(dataFlows, dataFlowSteps),
          type: 'markdown'
        })
      }

      if (request.includeFiles.entityRelationshipDiagram) {
        const tables = await this.getDatabaseTables(request.projectId)
        const columns = await this.getDatabaseColumns(request.projectId)
        const relationships = await this.getDatabaseRelationships(request.projectId)
        files.push({
          filename: 'entity_relationship_diagram.md',
          content: this.generateEntityRelationshipDiagram(tables, columns, relationships),
          type: 'markdown'
        })
      }

      return {
        files,
        metadata: {
          exportDate: new Date(),
          projectName: projectData.project.name,
          totalFiles: files.length
        }
      }
    } catch (error) {
      console.error('Export failed:', error)
      throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Generate Product Vision document
   */
  generateProductVision(projectData: ProjectData): string {
    const { project, coreProblem, personas, solutions, painPoints } = projectData
    
    let content = `# Product Vision - ${project.name}\n\n`
    content += `## Executive Summary\n\n`
    
    if (coreProblem) {
      content += `${coreProblem.validated_problem}\n\n`
    }
    
    content += `## Problem Statement\n\n`
    if (coreProblem) {
      content += `${coreProblem.validated_problem}\n\n`
    }
    
    content += `## Target Personas\n\n`
    personas.forEach(persona => {
      content += `### ${persona.name}\n`
      content += `${persona.description}\n\n`
      content += `**Goals:**\n`
      persona.goals.forEach(goal => content += `- ${goal}\n`)
      content += `\n**Frustrations:**\n`
      persona.frustrations.forEach(frustration => content += `- ${frustration}\n`)
      content += `\n`
    })
    
    content += `## Proposed Solution\n\n`
    solutions.forEach(solution => {
      content += `### ${solution.title}\n`
      content += `${solution.description}\n\n`
    })
    
    content += `## Key Features\n\n`
    solutions.forEach(solution => {
      content += `- **${solution.title}**: ${solution.description}\n`
    })
    
    content += `\n## Success Metrics\n\n`
    const highPainPoints = painPoints.filter(p => p.severity === 'high')
    highPainPoints.forEach(painPoint => {
      content += `- Reduce ${painPoint.title.toLowerCase()} incidents by addressing ${painPoint.description}\n`
    })
    
    return content
  }

  /**
   * Generate User Epics document
   */
  generateUserEpics(userStories: UserStory[], personas: Persona[]): string {
    let content = `# User Epics\n\n`
    content += `## Epic Overview\n\n`
    content += `This document contains all user stories organized by persona and feature area.\n\n`
    
    content += `## Detailed User Stories\n\n`
    
    userStories.forEach((story, index) => {
      const persona = personas.find(p => p.id === story.persona_id)
      content += `### Story ${index + 1}: ${story.title}\n\n`
      content += `**As a** ${story.as_a}\n`
      content += `**I want** ${story.i_want}\n`
      content += `**So that** ${story.so_that}\n\n`
      
      content += `**Persona:** ${persona?.name || 'Unknown'}\n\n`
      
      content += `**Acceptance Criteria:**\n`
      story.acceptance_criteria.forEach(criteria => {
        content += `- [ ] ${criteria}\n`
      })
      
      if (story.technical_notes) {
        content += `\n**Technical Notes:**\n${story.technical_notes}\n`
      }
      
      content += `\n---\n\n`
    })
    
    return content
  }

  /**
   * Generate System Architecture document
   */
  generateSystemArchitecture(architecture: SystemArchitecture[]): string {
    let content = `# System Architecture\n\n`
    content += `## Technology Stack\n\n`
    
    const headers = ['Layer', 'Technology', 'Justification']
    const rows = architecture.map(arch => [arch.layer, arch.technology, arch.justification])
    content += this.formatMarkdownTable(headers, rows)
    
    content += `\n## Architecture Diagram\n\n`
    content += this.generateMermaidDiagram('flow', architecture)
    
    content += `\n## Component Details\n\n`
    architecture.forEach(arch => {
      content += `### ${arch.layer}\n`
      content += `**Technology:** ${arch.technology}\n\n`
      content += `**Justification:** ${arch.justification}\n\n`
    })
    
    content += `## Integration Points\n\n`
    content += `Components communicate through well-defined interfaces and APIs as shown in the architecture diagram above.\n\n`
    
    return content
  }

  /**
   * Generate Design System document
   */
  generateDesignSystem(designTokens: DesignToken[], components: AtomicComponent[]): string {
    let content = `# Design System\n\n`
    content += `## Design Principles\n\n`
    content += `- Consistency: Maintain visual and functional consistency across all interfaces\n`
    content += `- Accessibility: Ensure all components meet WCAG 2.1 AA standards\n`
    content += `- Scalability: Design for growth and reusability\n`
    content += `- User-Centered: Prioritize user needs and usability\n\n`
    
    content += `## Design Tokens\n\n`
    
    const colorTokens = designTokens.filter(t => t.category === 'color')
    if (colorTokens.length > 0) {
      content += `### Colors\n\n`
      const headers = ['Name', 'Value', 'Description']
      const rows = colorTokens.map(token => [token.name, token.value, token.description || ''])
      content += this.formatMarkdownTable(headers, rows)
      content += `\n`
    }
    
    const typographyTokens = designTokens.filter(t => t.category === 'typography')
    if (typographyTokens.length > 0) {
      content += `### Typography\n\n`
      const headers = ['Name', 'Value', 'Description']
      const rows = typographyTokens.map(token => [token.name, token.value, token.description || ''])
      content += this.formatMarkdownTable(headers, rows)
      content += `\n`
    }
    
    const spacingTokens = designTokens.filter(t => t.category === 'spacing')
    if (spacingTokens.length > 0) {
      content += `### Spacing\n\n`
      const headers = ['Name', 'Value', 'Description']
      const rows = spacingTokens.map(token => [token.name, token.value, token.description || ''])
      content += this.formatMarkdownTable(headers, rows)
      content += `\n`
    }
    
    content += `## Component Library\n\n`
    
    const atoms = components.filter(c => c.type === 'atom')
    if (atoms.length > 0) {
      content += `### Atoms\n\n`
      atoms.forEach(component => {
        content += `#### ${component.name}\n`
        content += `${component.description}\n\n`
      })
    }
    
    const molecules = components.filter(c => c.type === 'molecule')
    if (molecules.length > 0) {
      content += `### Molecules\n\n`
      molecules.forEach(component => {
        content += `#### ${component.name}\n`
        content += `${component.description}\n\n`
      })
    }
    
    const organisms = components.filter(c => c.type === 'organism')
    if (organisms.length > 0) {
      content += `### Organisms\n\n`
      organisms.forEach(component => {
        content += `#### ${component.name}\n`
        content += `${component.description}\n\n`
      })
    }
    
    return content
  }

  /**
   * Generate Data Flow document
   */
  generateDataFlow(dataFlows: DataFlow[], dataFlowSteps: DataFlowStep[]): string {
    let content = `# Data Flow\n\n`
    content += `## Overview\n\n`
    content += `This document describes the data flows throughout the application, showing how information moves between different components and systems.\n\n`
    
    content += `## Detailed Flows\n\n`
    
    dataFlows.forEach(flow => {
      content += `### Flow: ${flow.name}\n\n`
      content += `${flow.description}\n\n`
      
      const steps = dataFlowSteps
        .filter(step => step.data_flow_id === flow.id)
        .sort((a, b) => a.sequence - b.sequence)
      
      if (steps.length > 0) {
        content += this.generateMermaidDiagram('sequence', { flow, steps })
        content += `\n**Steps:**\n`
        steps.forEach((step, index) => {
          content += `${index + 1}. **${step.actor}** ${step.action}: ${step.description}\n`
        })
        content += `\n`
      }
    })
    
    return content
  }

  /**
   * Generate Entity Relationship Diagram document
   */
  generateEntityRelationshipDiagram(
    tables: DatabaseTable[], 
    columns: DatabaseColumn[], 
    relationships: DatabaseRelationship[]
  ): string {
    let content = `# Entity Relationship Diagram\n\n`
    content += `## Database Schema Overview\n\n`
    content += `This document describes the database schema including all tables, columns, and relationships.\n\n`
    
    content += `## ERD Diagram\n\n`
    content += this.generateMermaidDiagram('erd', { tables, columns, relationships })
    
    content += `\n## Table Definitions\n\n`
    
    tables.forEach(table => {
      content += `### Table: ${table.name}\n\n`
      if (table.description) {
        content += `${table.description}\n\n`
      }
      
      const tableColumns = columns.filter(col => col.table_id === table.id)
      if (tableColumns.length > 0) {
        const headers = ['Column', 'Type', 'Constraints', 'Description']
        const rows = tableColumns.map(col => [
          col.name,
          col.type,
          col.constraints.join(', '),
          col.description || ''
        ])
        content += this.formatMarkdownTable(headers, rows)
        content += `\n`
      }
    })
    
    content += `## Relationships\n\n`
    relationships.forEach(rel => {
      const fromTable = tables.find(t => t.id === rel.from_table_id)
      const toTable = tables.find(t => t.id === rel.to_table_id)
      content += `- **${fromTable?.name}** ${rel.relationship_type.replace('_', ' ')} **${toTable?.name}**`
      if (rel.description) {
        content += `: ${rel.description}`
      }
      content += `\n`
    })
    
    return content
  }

  /**
   * Format data as a markdown table
   */
  formatMarkdownTable(headers: string[], rows: string[][]): string {
    let table = `| ${headers.join(' | ')} |\n`
    table += `| ${headers.map(() => '---').join(' | ')} |\n`
    rows.forEach(row => {
      table += `| ${row.join(' | ')} |\n`
    })
    return table
  }

  /**
   * Generate Mermaid diagrams based on type and data
   */
  generateMermaidDiagram(type: 'flow' | 'erd' | 'sequence', data: any): string {
    switch (type) {
      case 'flow':
        return this.generateFlowDiagram(data)
      case 'erd':
        return this.generateERDDiagram(data)
      case 'sequence':
        return this.generateSequenceDiagram(data)
      default:
        return '```mermaid\ngraph TD\n  A[Diagram not available]\n```\n'
    }
  }

  private generateFlowDiagram(architecture: SystemArchitecture[]): string {
    let diagram = '```mermaid\ngraph TD\n'
    architecture.forEach((arch, index) => {
      const nodeId = `${arch.layer.replace(/\s+/g, '')}`
      diagram += `  ${nodeId}["${arch.layer}<br/>${arch.technology}"]\n`
    })
    diagram += '```\n'
    return diagram
  }

  private generateERDDiagram(data: { tables: DatabaseTable[], relationships: DatabaseRelationship[] }): string {
    let diagram = '```mermaid\nerDiagram\n'
    data.tables.forEach(table => {
      diagram += `  ${table.name.toUpperCase()} {\n`
      diagram += `    string id PK\n`
      diagram += `    string name\n`
      diagram += `  }\n`
    })
    data.relationships.forEach(rel => {
      const fromTable = data.tables.find(t => t.id === rel.from_table_id)
      const toTable = data.tables.find(t => t.id === rel.to_table_id)
      if (fromTable && toTable) {
        const relType = rel.relationship_type === 'one_to_many' ? '||--o{' : '||--||'
        diagram += `  ${fromTable.name.toUpperCase()} ${relType} ${toTable.name.toUpperCase()} : ${rel.relationship_type}\n`
      }
    })
    diagram += '```\n'
    return diagram
  }

  private generateSequenceDiagram(data: { flow: DataFlow, steps: DataFlowStep[] }): string {
    let diagram = '```mermaid\nsequenceDiagram\n'
    const actors = new Set(data.steps.map(step => step.actor))
    actors.forEach(actor => {
      diagram += `  participant ${actor.replace(/\s+/g, '')}\n`
    })
    data.steps.forEach(step => {
      const actor = step.actor.replace(/\s+/g, '')
      diagram += `  ${actor}->>${actor}: ${step.description}\n`
    })
    diagram += '```\n'
    return diagram
  }

  /**
   * Create table of contents from sections
   */
  createTableOfContents(sections: Section[]): string {
    let toc = '## Table of Contents\n\n'
    sections.forEach(section => {
      const indent = '  '.repeat(section.level - 1)
      toc += `${indent}- [${section.title}](#${section.anchor})\n`
    })
    return toc + '\n'
  }

  /**
   * Add cross-references to content
   */
  addCrossReferences(content: string, references: Reference[]): string {
    let updatedContent = content
    references.forEach(ref => {
      const linkText = `[${ref.text}](#${ref.target})`
      updatedContent = updatedContent.replace(ref.source, linkText)
    })
    return updatedContent
  }

  // Data gathering methods (to be implemented with actual Tauri commands)
  private async gatherProjectData(projectId: string): Promise<ProjectData> {
    // TODO: Implement with actual Tauri API calls
    return {
      project: { id: projectId, name: 'Sample Project' } as Project,
      personas: [],
      painPoints: [],
      solutions: [],
      solutionMappings: [],
      userStories: []
    }
  }

  private async getSystemArchitecture(projectId: string): Promise<SystemArchitecture[]> {
    // TODO: Implement with actual Tauri API call
    return []
  }

  private async getDesignTokens(projectId: string): Promise<DesignToken[]> {
    // TODO: Implement with actual Tauri API call
    return []
  }

  private async getAtomicComponents(projectId: string): Promise<AtomicComponent[]> {
    // TODO: Implement with actual Tauri API call
    return []
  }

  private async getDataFlows(projectId: string): Promise<DataFlow[]> {
    // TODO: Implement with actual Tauri API call
    return []
  }

  private async getDataFlowSteps(projectId: string): Promise<DataFlowStep[]> {
    // TODO: Implement with actual Tauri API call
    return []
  }

  private async getDatabaseTables(projectId: string): Promise<DatabaseTable[]> {
    // TODO: Implement with actual Tauri API call
    return []
  }

  private async getDatabaseColumns(projectId: string): Promise<DatabaseColumn[]> {
    // TODO: Implement with actual Tauri API call
    return []
  }

  private async getDatabaseRelationships(projectId: string): Promise<DatabaseRelationship[]> {
    // TODO: Implement with actual Tauri API call
    return []
  }
}

export const exportAPI = new ExportService()

```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/services/api/personas.ts
```ts
import { apiClient } from './client'
import { invoke } from '@tauri-apps/api/core'
import type { EdgeFunctionResponse } from './client'
import type { Persona, CoreProblem } from '@/stores/workflowStore'

// Persona generation interfaces
export interface PersonaGenerationRequest {
  coreProblem: CoreProblem
  lockedPersonas: Persona[]
  projectId: string
  generationBatch: string
}

export interface PersonaGenerationResponse {
  personas: Persona[]
  generationMetadata: {
    diversityScore: number
    coverageAnalysis: string[]
    generationBatch: string
  }
}

export interface PersonaQualityMetrics {
  painRelevance: number
  uniqueness: number
  actionability: number
  specificity: number
}

interface CachedPersonaBatch {
  personas: Persona[]
  batchId: string
  projectId: string
  timestamp: string
  generationMetadata: PersonaGenerationResponse['generationMetadata']
}

interface StreamingPersonaUpdate {
  type: 'analyzing' | 'generating' | 'diversifying' | 'validating' | 'complete'
  message: string
  progress: number
  currentPersona?: Partial<Persona>
}

class PersonaGenerationService {
  private cache = new Map<string, CachedPersonaBatch>()
  private isOnline = navigator.onLine
  private streamingControllers = new Map<string, AbortController>()

  constructor() {
    // Set up online/offline detection
    window.addEventListener('online', () => {
      this.isOnline = true
    })
    
    window.addEventListener('offline', () => {
      this.isOnline = false
    })

    // Load cached data from localStorage on init
    this.loadFromStorage()
  }

  /**
   * Generates 5 diverse personas while respecting locked personas
   */
  async generatePersonas(request: PersonaGenerationRequest): Promise<PersonaGenerationResponse> {
    // Check cache first
    const cached = await this.getCachedPersonaBatch(request.projectId, request.generationBatch)
    if (cached && this.isCacheValid(cached)) {
      return {
        personas: cached.personas,
        generationMetadata: cached.generationMetadata
      }
    }

    // Validate locked personas diversity
    if (!this.ensurePersonaDiversity([], request.lockedPersonas)) {
      throw new Error('Locked personas lack sufficient diversity for generation')
    }

    try {
      const response = await this.performPersonaGeneration(request)
      
      // Cache successful results
      await this.cachePersonaBatch(response.personas, request.generationBatch, request.projectId, response.generationMetadata)

      // Save to local database via Tauri
      await this.savePersonasToDatabase(response.personas, request.projectId)

      return response
    } catch (error) {
      console.error('Persona generation failed:', error)
      throw error
    }
  }

  /**
   * Regenerates personas with new batch ID
   */
  async regeneratePersonas(request: PersonaGenerationRequest): Promise<PersonaGenerationResponse> {
    // Create new generation batch ID
    const newBatchId = crypto.randomUUID()
    const regenerationRequest = {
      ...request,
      generationBatch: newBatchId
    }

    // Clear cache for this project to force fresh generation
    this.clearProjectCache(request.projectId)

    return this.generatePersonas(regenerationRequest)
  }

  /**
   * Streaming persona generation with real-time updates
   */
  async generatePersonasStreaming(
    request: PersonaGenerationRequest,
    onUpdate: (update: StreamingPersonaUpdate) => void
  ): Promise<PersonaGenerationResponse> {
    const requestId = crypto.randomUUID()
    const controller = new AbortController()
    this.streamingControllers.set(requestId, controller)

    try {
      // Check cache first
      const cached = await this.getCachedPersonaBatch(request.projectId, request.generationBatch)
      if (cached && this.isCacheValid(cached)) {
        onUpdate({
          type: 'complete',
          message: 'Personas found in cache',
          progress: 100
        })
        return {
          personas: cached.personas,
          generationMetadata: cached.generationMetadata
        }
      }

      // Start streaming generation
      onUpdate({
        type: 'analyzing',
        message: 'Analyzing problem context for persona generation...',
        progress: 10
      })

      const response = await apiClient.invokeEdgeFunction<{
        personas: Persona[]
        generationMetadata: PersonaGenerationResponse['generationMetadata']
        stream_updates?: StreamingPersonaUpdate[]
      }>('generate-personas', {
        ...request,
        streaming: true
      }, {
        signal: controller.signal,
        onProgress: (progress: number) => {
          onUpdate({
            type: 'generating',
            message: 'Generating diverse personas...',
            progress: 10 + (progress * 0.7) // Map to 10-80%
          })
        }
      })

      if (response.error) {
        throw new Error(response.error.message)
      }

      const result = {
        personas: response.data!.personas,
        generationMetadata: response.data!.generationMetadata
      }

      // Process stream updates
      if (response.data!.stream_updates) {
        for (const update of response.data!.stream_updates) {
          onUpdate(update)
        }
      }

      onUpdate({
        type: 'complete',
        message: 'Persona generation complete',
        progress: 100
      })

      // Cache and save results
      await this.cachePersonaBatch(result.personas, request.generationBatch, request.projectId, result.generationMetadata)
      await this.savePersonasToDatabase(result.personas, request.projectId)

      return result

    } finally {
      this.streamingControllers.delete(requestId)
    }
  }

  /**
   * Scores persona quality based on problem relevance and other metrics
   */
  scorePersonaQuality(persona: Persona, problem: CoreProblem): PersonaQualityMetrics {
    const problemKeywords = this.extractKeywords(problem.description)
    const personaText = `${persona.name} ${persona.description} ${persona.goals.join(' ')} ${persona.frustrations.join(' ')}`
    const personaKeywords = this.extractKeywords(personaText)

    // Calculate pain relevance based on keyword overlap and semantic similarity
    const keywordOverlap = this.calculateKeywordOverlap(problemKeywords, personaKeywords)
    const painRelevance = Math.max(keywordOverlap, this.calculateSemanticRelevance(problem, persona))

    // Calculate uniqueness based on demographics and psychographics diversity
    const uniqueness = this.calculatePersonaUniqueness(persona)

    // Calculate actionability based on specificity of goals and frustrations
    const actionability = this.calculateActionability(persona)

    // Calculate specificity based on detail level in demographics and descriptions
    const specificity = this.calculateSpecificity(persona)

    return {
      painRelevance: Math.round(painRelevance * 100) / 100,
      uniqueness: Math.round(uniqueness * 100) / 100,
      actionability: Math.round(actionability * 100) / 100,
      specificity: Math.round(specificity * 100) / 100
    }
  }

  /**
   * Ensures persona diversity by analyzing demographics, psychographics, and goals
   */
  ensurePersonaDiversity(personas: Persona[], lockedPersonas: Persona[]): boolean {
    const allPersonas = [...personas, ...lockedPersonas]
    
    if (allPersonas.length === 0) return true
    if (allPersonas.length === 1) return true

    // Check demographic diversity
    const demographicDiversity = this.calculateDemographicDiversity(allPersonas)
    
    // Check psychographic diversity
    const psychographicDiversity = this.calculatePsychographicDiversity(allPersonas)
    
    // Check goal diversity
    const goalDiversity = this.calculateGoalDiversity(allPersonas)

    // Require minimum diversity scores
    const minDiversityThreshold = 0.6
    return (
      demographicDiversity >= minDiversityThreshold &&
      psychographicDiversity >= minDiversityThreshold &&
      goalDiversity >= minDiversityThreshold
    )
  }

  /**
   * Caches persona batch for reuse
   */
  async cachePersonaBatch(
    personas: Persona[], 
    batchId: string, 
    projectId: string,
    generationMetadata: PersonaGenerationResponse['generationMetadata']
  ): Promise<void> {
    const cacheKey = this.generateCacheKey(projectId, batchId)
    const cached: CachedPersonaBatch = {
      personas,
      batchId,
      projectId,
      timestamp: new Date().toISOString(),
      generationMetadata
    }

    this.cache.set(cacheKey, cached)
    await this.saveToStorage()
  }

  /**
   * Cancels streaming persona generation
   */
  cancelStreamingGeneration(requestId?: string): void {
    if (requestId && this.streamingControllers.has(requestId)) {
      this.streamingControllers.get(requestId)!.abort()
      this.streamingControllers.delete(requestId)
    } else {
      // Cancel all streaming requests
      for (const [id, controller] of this.streamingControllers) {
        controller.abort()
      }
      this.streamingControllers.clear()
    }
  }

  // Private helper methods

  private async performPersonaGeneration(request: PersonaGenerationRequest): Promise<PersonaGenerationResponse> {
    const response = await apiClient.invokeEdgeFunction<PersonaGenerationResponse>('generate-personas', request)

    if (response.error) {
      throw new Error(response.error.message)
    }

    return response.data!
  }

  private async getCachedPersonaBatch(projectId: string, batchId: string): Promise<CachedPersonaBatch | null> {
    const cacheKey = this.generateCacheKey(projectId, batchId)
    return this.cache.get(cacheKey) || null
  }

  private isCacheValid(cached: CachedPersonaBatch): boolean {
    const maxAge = 1000 * 60 * 60 * 24 // 24 hours
    const age = Date.now() - new Date(cached.timestamp).getTime()
    return age < maxAge
  }

  private generateCacheKey(projectId: string, batchId: string): string {
    return `personas_${projectId}_${batchId}`
  }

  private clearProjectCache(projectId: string): void {
    for (const [key, cached] of this.cache) {
      if (cached.projectId === projectId) {
        this.cache.delete(key)
      }
    }
    this.saveToStorage()
  }

  private async savePersonasToDatabase(personas: Persona[], projectId: string): Promise<void> {
    try {
      for (const persona of personas) {
        await invoke('save_persona', { persona, projectId })
      }
    } catch (error) {
      console.error('Failed to save personas to database:', error)
      throw error
    }
  }

  private extractKeywords(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['this', 'that', 'with', 'from', 'they', 'them', 'their', 'have', 'been', 'will'].includes(word))
  }

  private calculateKeywordOverlap(keywords1: string[], keywords2: string[]): number {
    const set1 = new Set(keywords1)
    const set2 = new Set(keywords2)
    const intersection = new Set([...set1].filter(x => set2.has(x)))
    const union = new Set([...set1, ...set2])
    
    return union.size > 0 ? intersection.size / union.size : 0
  }

  private calculateSemanticRelevance(problem: CoreProblem, persona: Persona): number {
    // Simple semantic relevance based on common themes
    const problemThemes = this.extractThemes(problem.description)
    const personaThemes = this.extractThemes(`${persona.description} ${persona.goals.join(' ')} ${persona.frustrations.join(' ')}`)
    
    let relevanceScore = 0
    for (const theme of problemThemes) {
      if (personaThemes.includes(theme)) {
        relevanceScore += 0.2
      }
    }
    
    return Math.min(relevanceScore, 1.0)
  }

  private extractThemes(text: string): string[] {
    const themes = []
    const lowerText = text.toLowerCase()
    
    // Technology themes
    if (/tech|software|app|digital|online|web|mobile/.test(lowerText)) themes.push('technology')
    if (/work|job|career|professional|business/.test(lowerText)) themes.push('work')
    if (/health|fitness|wellness|medical/.test(lowerText)) themes.push('health')
    if (/money|finance|budget|cost|expensive/.test(lowerText)) themes.push('finance')
    if (/time|busy|schedule|quick|fast/.test(lowerText)) themes.push('time')
    if (/family|kids|children|parent/.test(lowerText)) themes.push('family')
    if (/learn|education|study|skill/.test(lowerText)) themes.push('education')
    
    return themes
  }

  private calculatePersonaUniqueness(persona: Persona): number {
    // Score based on diversity of demographics and psychographics
    let uniquenessScore = 0.5 // Base score
    
    // Add points for specific demographics
    const demographics = Object.keys(persona.demographics)
    uniquenessScore += Math.min(demographics.length * 0.1, 0.3)
    
    // Add points for specific psychographics
    const psychographics = Object.keys(persona.psychographics)
    uniquenessScore += Math.min(psychographics.length * 0.1, 0.2)
    
    return Math.min(uniquenessScore, 1.0)
  }

  private calculateActionability(persona: Persona): number {
    // Score based on specificity and actionability of goals and frustrations
    let actionabilityScore = 0
    
    // Score goals
    const specificGoals = persona.goals.filter((goal: string) => goal.length > 20 && /\b(want|need|achieve|improve|get|find)\b/i.test(goal))
    actionabilityScore += Math.min(specificGoals.length * 0.25, 0.5)
    
    // Score frustrations
    const specificFrustrations = persona.frustrations.filter((frustration: string) => 
      frustration.length > 20 && /\b(difficult|hard|frustrating|annoying|time-consuming)\b/i.test(frustration)
    )
    actionabilityScore += Math.min(specificFrustrations.length * 0.25, 0.5)
    
    return Math.min(actionabilityScore, 1.0)
  }

  private calculateSpecificity(persona: Persona): number {
    // Score based on detail level in descriptions and data
    let specificityScore = 0
    
    // Score description length and detail
    if (persona.description.length > 100) specificityScore += 0.3
    if (persona.description.length > 200) specificityScore += 0.2
    
    // Score demographic specificity
    const demographicValues = Object.values(persona.demographics)
    const specificDemographics = demographicValues.filter(value => 
      typeof value === 'string' && value.length > 5
    )
    specificityScore += Math.min(specificDemographics.length * 0.1, 0.3)
    
    // Score psychographic specificity
    const psychographicValues = Object.values(persona.psychographics)
    const specificPsychographics = psychographicValues.filter(value => 
      typeof value === 'string' && value.length > 10
    )
    specificityScore += Math.min(specificPsychographics.length * 0.1, 0.2)
    
    return Math.min(specificityScore, 1.0)
  }

  private calculateDemographicDiversity(personas: Persona[]): number {
    if (personas.length <= 1) return 1.0
    
    const demographicFields = ['age', 'gender', 'location', 'occupation', 'income']
    let diversitySum = 0
    
    for (const field of demographicFields) {
      const values = personas
        .map(p => p.demographics[field])
        .filter(v => v !== undefined && v !== null)
      
      const uniqueValues = new Set(values)
      const diversity = values.length > 0 ? uniqueValues.size / values.length : 0
      diversitySum += diversity
    }
    
    return diversitySum / demographicFields.length
  }

  private calculatePsychographicDiversity(personas: Persona[]): number {
    if (personas.length <= 1) return 1.0
    
    const psychographicFields = ['personality', 'values', 'lifestyle', 'interests']
    let diversitySum = 0
    
    for (const field of psychographicFields) {
      const values = personas
        .map(p => p.psychographics[field])
        .filter(v => v !== undefined && v !== null)
      
      const uniqueValues = new Set(values)
      const diversity = values.length > 0 ? uniqueValues.size / values.length : 0
      diversitySum += diversity
    }
    
    return diversitySum / psychographicFields.length
  }

  private calculateGoalDiversity(personas: Persona[]): number {
    if (personas.length <= 1) return 1.0
    
    const allGoals = personas.flatMap(p => p.goals)
    const uniqueGoals = new Set(allGoals.map(goal => goal.toLowerCase().trim()))
    
    return allGoals.length > 0 ? uniqueGoals.size / allGoals.length : 0
  }

  private async saveToStorage(): Promise<void> {
    try {
      const cacheData = Array.from(this.cache.entries())
      localStorage.setItem('personaGenerationCache', JSON.stringify(cacheData))
    } catch (error) {
      console.warn('Failed to save persona cache to localStorage:', error)
    }
  }

  private loadFromStorage(): void {
    try {
      const cacheData = localStorage.getItem('personaGenerationCache')
      if (cacheData) {
        const parsed = JSON.parse(cacheData)
        this.cache = new Map(parsed)
      }
    } catch (error) {
      console.warn('Failed to load persona cache from localStorage:', error)
      this.cache = new Map()
    }
  }
}

// Export singleton instance
export const personaService = new PersonaGenerationService()

// Export individual methods for tree-shaking
export const {
  generatePersonas,
  regeneratePersonas,
  generatePersonasStreaming,
  scorePersonaQuality,
  ensurePersonaDiversity,
  cachePersonaBatch,
  cancelStreamingGeneration
} = personaService

```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/services/api/problem.ts
```ts
import { apiClient } from './client'
import { tauriAPI } from '../tauri/api'
import { invoke } from '@tauri-apps/api/core'
import type { EdgeFunctionResponse } from './client'

// Core types
export interface CoreProblem {
  id: string
  project_id: string
  original_input: string
  validated_statement: string
  confidence_score: number
  feedback: string
  suggestions: string[]
  validation_history: ProblemValidationAttempt[]
  created_at: string
  updated_at: string
}

export interface ProblemValidationRequest {
  problemInput: string
  projectId: string
  previousAttempts?: string[]
}

export interface ProblemValidationResponse {
  isValid: boolean
  validatedProblem?: string
  feedback: string
  suggestions?: string[]
  confidenceScore: number
  coreProblemId?: string
}

export interface StreamingValidationUpdate {
  type: 'thinking' | 'validating' | 'complete'
  message: string
  progress: number
}

export interface ProblemValidationAttempt {
  attempt_number: number
  input: string
  result: ProblemValidationResponse
  timestamp: string
}

export interface CachedValidation {
  problemInput: string
  result: ProblemValidationResponse
  timestamp: string
  projectId: string
}

export interface OfflineValidationRequest extends ProblemValidationRequest {
  id: string
  timestamp: string
  retryCount: number
}

class ProblemValidationService {
  private cache = new Map<string, CachedValidation>()
  private offlineQueue: OfflineValidationRequest[] = []
  private isOnline = navigator.onLine
  private streamingControllers = new Map<string, AbortController>()

  constructor() {
    // Set up online/offline detection
    window.addEventListener('online', () => {
      this.isOnline = true
      this.processOfflineQueue()
    })
    
    window.addEventListener('offline', () => {
      this.isOnline = false
    })

    // Load cached data and offline queue from localStorage on init
    this.loadFromStorage()
  }

  /**
   * Main validation method with fallback to offline queue
   */
  async validateProblem(request: ProblemValidationRequest): Promise<ProblemValidationResponse> {
    // Check cache first
    const cached = await this.getCachedValidation(request.problemInput)
    if (cached && this.isCacheValid(cached)) {
      return cached.result
    }

    // If offline, queue the request
    if (!this.isOnline) {
      await this.queueOfflineValidation(request)
      return {
        isValid: false,
        feedback: 'You are currently offline. This validation has been queued and will be processed when you reconnect.',
        suggestions: ['Check your internet connection', 'Your request will be automatically processed once online'],
        confidenceScore: 0
      }
    }

    try {
      const response = await this.performValidation(request)
      
      // Cache successful results
      if (response.isValid) {
        this.cacheValidation(request.problemInput, response, request.projectId)
      }

      // Save to local database via Tauri
      await this.saveProblemValidation(request, response)

      return response
    } catch (error) {
      // If network error and not already queued, add to offline queue
      if (this.isNetworkError(error)) {
        await this.queueOfflineValidation(request)
        return {
          isValid: false,
          feedback: 'Network error occurred. Your validation has been queued for retry.',
          suggestions: ['Check your internet connection', 'Request will be retried automatically'],
          confidenceScore: 0
        }
      }
      throw error
    }
  }

  /**
   * Streaming validation with real-time updates
   */
  async validateProblemStreaming(
    request: ProblemValidationRequest,
    onUpdate: (update: StreamingValidationUpdate) => void
  ): Promise<ProblemValidationResponse> {
    const requestId = crypto.randomUUID()
    const controller = new AbortController()
    this.streamingControllers.set(requestId, controller)

    try {
      // Check cache first
      const cached = await this.getCachedValidation(request.problemInput)
      if (cached && this.isCacheValid(cached)) {
        onUpdate({
          type: 'complete',
          message: 'Validation found in cache',
          progress: 100
        })
        return cached.result
      }

      // If offline, queue and return early
      if (!this.isOnline) {
        await this.queueOfflineValidation(request)
        onUpdate({
          type: 'complete',
          message: 'Queued for offline processing',
          progress: 100
        })
        return {
          isValid: false,
          feedback: 'You are currently offline. This validation has been queued.',
          suggestions: ['Check your internet connection'],
          confidenceScore: 0
        }
      }

      // Start streaming validation
      onUpdate({
        type: 'thinking',
        message: 'Analyzing problem statement...',
        progress: 10
      })

      const response = await apiClient.invokeEdgeFunction<{
        validation: ProblemValidationResponse
        stream_updates?: StreamingValidationUpdate[]
      }>('problem-validation', {
        ...request,
        streaming: true
      }, {
        signal: controller.signal,
        onProgress: (progress: number) => {
          onUpdate({
            type: 'validating',
            message: 'Processing validation...',
            progress: 10 + (progress * 0.8) // Map to 10-90%
          })
        }
      })

      if (response.error) {
        throw new Error(response.error.message)
      }

      const validationResult = response.data!.validation

      // Process any additional stream updates from edge function
      if (response.data!.stream_updates) {
        for (const update of response.data!.stream_updates) {
          onUpdate(update)
        }
      }

      onUpdate({
        type: 'complete',
        message: 'Validation complete',
        progress: 100
      })

      // Cache and save successful results
      if (validationResult.isValid) {
        this.cacheValidation(request.problemInput, validationResult, request.projectId)
      }
      await this.saveProblemValidation(request, validationResult)

      return validationResult

    } catch (error) {
      if (controller.signal.aborted) {
        onUpdate({
          type: 'complete',
          message: 'Validation cancelled',
          progress: 100
        })
        throw new Error('Validation was cancelled')
      }

      // Handle network errors
      if (this.isNetworkError(error)) {
        await this.queueOfflineValidation(request)
        onUpdate({
          type: 'complete',
          message: 'Queued for retry due to network error',
          progress: 100
        })
        return {
          isValid: false,
          feedback: 'Network error occurred. Your validation has been queued for retry.',
          suggestions: ['Check your internet connection'],
          confidenceScore: 0
        }
      }

      throw error
    } finally {
      this.streamingControllers.delete(requestId)
    }
  }

  /**
   * Cancel a streaming validation
   */
  cancelStreamingValidation(requestId?: string): void {
    if (requestId && this.streamingControllers.has(requestId)) {
      this.streamingControllers.get(requestId)!.abort()
      this.streamingControllers.delete(requestId)
    } else {
      // Cancel all streaming requests
      for (const [id, controller] of this.streamingControllers) {
        controller.abort()
      }
      this.streamingControllers.clear()
    }
  }

  /**
   * Get cached validation result
   */
  async getCachedValidation(problemInput: string): Promise<CachedValidation | null> {
    const cacheKey = this.generateCacheKey(problemInput)
    return this.cache.get(cacheKey) || null
  }

  /**
   * Queue validation for offline processing
   */
  async queueOfflineValidation(request: ProblemValidationRequest): Promise<void> {
    const queueItem: OfflineValidationRequest = {
      ...request,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      retryCount: 0
    }

    // Check if already queued
    const existingIndex = this.offlineQueue.findIndex(
      item => item.problemInput === request.problemInput && item.projectId === request.projectId
    )

    if (existingIndex >= 0) {
      this.offlineQueue[existingIndex] = queueItem
    } else {
      this.offlineQueue.push(queueItem)
    }

    await this.saveToStorage()
  }

  /**
   * Process all queued offline validations
   */
  async processOfflineQueue(): Promise<void> {
    if (!this.isOnline || this.offlineQueue.length === 0) {
      return
    }

    const itemsToProcess = [...this.offlineQueue]
    this.offlineQueue = []

    for (const item of itemsToProcess) {
      try {
        const request: ProblemValidationRequest = {
          problemInput: item.problemInput,
          projectId: item.projectId,
          previousAttempts: item.previousAttempts
        }

        const result = await this.performValidation(request)
        
        // Cache successful results
        if (result.isValid) {
          this.cacheValidation(request.problemInput, result, request.projectId)
        }

        // Save to local database
        await this.saveProblemValidation(request, result)

      } catch (error) {
        // Re-queue with incremented retry count if not max retries
        if (item.retryCount < 3) {
          this.offlineQueue.push({
            ...item,
            retryCount: item.retryCount + 1
          })
        }
      }
    }

    await this.saveToStorage()
  }

  /**
   * Get validation history for a project
   */
  async getValidationHistory(projectId: string): Promise<ProblemValidationAttempt[]> {
    try {
      return await invoke<ProblemValidationAttempt[]>('get_validation_history', { projectId })
    } catch (error) {
      console.error('Failed to get validation history:', error)
      return []
    }
  }

  /**
   * Clear validation cache
   */
  clearCache(): void {
    this.cache.clear()
    this.saveToStorage()
  }

  /**
   * Get offline queue status
   */
  getOfflineQueueStatus(): { count: number; items: OfflineValidationRequest[] } {
    return {
      count: this.offlineQueue.length,
      items: [...this.offlineQueue]
    }
  }

  // Private methods
  private async performValidation(request: ProblemValidationRequest): Promise<ProblemValidationResponse> {
    console.log('[ProblemValidationService] Calling edge function for:', request);
    
    try {
      // Try the edge function first
      const response = await apiClient.invokeEdgeFunction<any>('problem-validation', {
        problemInput: request.problemInput,
        projectId: request.projectId
      });

      console.log('[ProblemValidationService] Edge function response:', response);

      if (response.error) {
        console.error('[ProblemValidationService] Edge function error:', response.error);
        throw new Error(response.error.message);
      }

      // The edge function returns the full state, extract what we need
      const result = response.data;
      return {
        isValid: result.isValid || false,
        validatedProblem: result.validatedProblem,
        feedback: result.validationFeedback || '',
        suggestions: result.keyTerms || [],
        confidenceScore: 0.8,
        coreProblemId: result.coreProblemId
      };
    } catch (error) {
      console.warn('[ProblemValidationService] Edge function failed, falling back to local validation:', error);
      
      // Fallback to local validation if edge function fails
      return this.performLocalValidation(request);
    }
  }

  private async performLocalValidation(request: ProblemValidationRequest): Promise<ProblemValidationResponse> {
    const { problemInput } = request;
    
    // Simple validation logic
    const trimmed = problemInput.trim();
    
    if (trimmed.length < 10) {
      return {
        isValid: false,
        feedback: 'Problem statement is too short. Please provide more detail about the specific issue you want to solve.',
        suggestions: ['Describe the pain point in more detail', 'Explain who is affected by this problem', 'Add context about when this problem occurs'],
        confidenceScore: 0.2
      };
    }
    
    if (trimmed.length > 500) {
      return {
        isValid: false,
        feedback: 'Problem statement is too long. Try to focus on the core issue.',
        suggestions: ['Focus on the main problem', 'Remove unnecessary details', 'Break down into smaller, specific problems'],
        confidenceScore: 0.3
      };
    }
    
    // Check for vague terms
    const vagueTerms = ['something', 'somehow', 'better', 'improve', 'good', 'bad', 'issue', 'problem'];
    const hasVagueTerms = vagueTerms.some(term => trimmed.toLowerCase().includes(term));
    
    if (hasVagueTerms) {
      return {
        isValid: false,
        feedback: 'Problem statement is too vague. Be more specific about what exactly needs to be solved.',
        suggestions: ['Use specific examples', 'Quantify the impact', 'Describe the current situation vs desired outcome'],
        confidenceScore: 0.4
      };
    }
    
    // Check for solution-oriented language
    const solutionWords = ['build', 'create', 'make', 'develop', 'app', 'website', 'system'];
    const hasSolutionWords = solutionWords.some(word => trimmed.toLowerCase().includes(word));
    
    if (hasSolutionWords) {
      return {
        isValid: false,
        feedback: 'Focus on the problem, not the solution. Describe what people struggle with, not what you want to build.',
        suggestions: ['Describe the pain point people experience', 'Explain what is currently difficult or impossible', 'Focus on user needs rather than technical solutions'],
        confidenceScore: 0.5
      };
    }
    
    // If it passes basic checks, consider it valid
    return {
      isValid: true,
      validatedProblem: trimmed,
      feedback: 'Problem statement looks good! It\'s specific and focuses on a real issue.',
      suggestions: ['Consider who specifically faces this problem', 'Think about the impact and frequency'],
      confidenceScore: 0.8
    };
  }

  private cacheValidation(problemInput: string, result: ProblemValidationResponse, projectId: string): void {
    const cacheKey = this.generateCacheKey(problemInput)
    this.cache.set(cacheKey, {
      problemInput,
      result,
      timestamp: new Date().toISOString(),
      projectId
    })
    this.saveToStorage()
  }

  private generateCacheKey(problemInput: string): string {
    // First encode the string to handle Unicode characters
    try {
      // Convert to UTF-8 bytes then to base64
      const encoder = new TextEncoder();
      const data = encoder.encode(problemInput.toLowerCase().trim());
      const base64 = btoa(String.fromCharCode(...data));
      return base64.replace(/[^a-zA-Z0-9]/g, '');
    } catch (error) {
      // Fallback: use a simple hash if encoding fails
      console.warn('[ProblemValidationService] Cache key generation failed, using fallback', error);
      let hash = 0;
      const str = problemInput.toLowerCase().trim();
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return Math.abs(hash).toString(36);
    }
  }

  private isCacheValid(cached: CachedValidation): boolean {
    const cacheAge = Date.now() - new Date(cached.timestamp).getTime()
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours
    return cacheAge < maxAge
  }

  private async saveProblemValidation(
    request: ProblemValidationRequest,
    response: ProblemValidationResponse
  ): Promise<void> {
    try {
      await invoke<void>('save_problem_validation', {
        request,
        response,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Failed to save problem validation:', error)
    }
  }

  private isNetworkError(error: any): boolean {
    return (
      error instanceof TypeError ||
      error?.name === 'NetworkError' ||
      error?.code === 'NETWORK_ERROR' ||
      error?.message?.includes('fetch')
    )
  }

  private async saveToStorage(): Promise<void> {
    try {
      const data = {
        cache: Array.from(this.cache.entries()),
        offlineQueue: this.offlineQueue
      }
      localStorage.setItem('problemValidationService', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save to storage:', error)
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('problemValidationService')
      if (stored) {
        const data = JSON.parse(stored)
        this.cache = new Map(data.cache || [])
        this.offlineQueue = data.offlineQueue || []
      }
    } catch (error) {
      console.error('Failed to load from storage:', error)
    }
  }
}

// Export singleton instance
export const problemValidationService = new ProblemValidationService()

// Export individual methods for easier testing
export const {
  validateProblem,
  validateProblemStreaming,
  getCachedValidation,
  queueOfflineValidation,
  processOfflineQueue,
  getValidationHistory,
  clearCache,
  getOfflineQueueStatus,
  cancelStreamingValidation
} = problemValidationService

// Add this at the very bottom of the file, after the existing exports:

// Export a problemApi object that matches what the components expect
export const problemApi = {
    validateProblem: async (input: string): Promise<ProblemValidationResponse> => {
      // Get project ID from workflow store
      const { useWorkflowStore } = await import('@/stores/workflowStore');
      const projectId = useWorkflowStore.getState().projectId || crypto.randomUUID();
      
      console.log('[problemApi] Validating problem with direct fetch');
      console.log('[problemApi] Input:', input);
      console.log('[problemApi] Project ID:', projectId);
      
      // Get auth token
      const { supabase } = await import('@/services/supabase/client');
      const { data: { session } } = await supabase.auth.getSession();
      const authToken = session?.access_token;
      
      if (!authToken) {
        throw new Error('Not authenticated');
      }
      
      // Try direct fetch first to bypass Supabase client issues
      try {
        const response = await fetch('https://tyfmxjzcocjztocwemun.supabase.co/functions/v1/problem-validation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            'x-request-id': crypto.randomUUID()
          },
          body: JSON.stringify({
            problemInput: input,
            projectId: projectId
          })
        });
        
        console.log('[problemApi] Response status:', response.status);
        const data = await response.json();
        console.log('[problemApi] Response data:', data);
        
        if (!response.ok) {
          throw new Error(data.error?.message || `HTTP ${response.status}`);
        }
        
        // Transform the edge function response to match our interface
        return {
          isValid: data.isValid || false,
          validatedProblem: data.validatedProblem,
          feedback: data.validationFeedback || '',
          suggestions: data.keyTerms || [],
          confidenceScore: 0.8,
          coreProblemId: data.coreProblemId
        };
        
      } catch (error) {
        console.error('[problemApi] Direct fetch failed:', error);
        
        // Fallback to Supabase client
        console.log('[problemApi] Falling back to Supabase client');
        return problemValidationService.validateProblem({
          problemInput: input,
          projectId: projectId
        });
      }
    },
    
    generatePersonas: async (
      projectId: string,
      coreProblemId: string,
      lockedPersonaIds: string[]
    ): Promise<any[]> => {
      console.log('[problemApi] Generating personas with edge function');
      console.log('[problemApi] Project ID:', projectId);
      console.log('[problemApi] Core Problem ID:', coreProblemId);
      
      // Get the core problem text from the workflow store
      const { useWorkflowStore } = await import('@/stores/workflowStore');
      const coreProblem = useWorkflowStore.getState().coreProblem;
      const coreProblemText = coreProblem?.description || '';
      
      console.log('[problemApi] Core Problem Text:', coreProblemText);
      
      // Get auth token
      const { supabase } = await import('@/services/supabase/client');
      const { data: { session } } = await supabase.auth.getSession();
      const authToken = session?.access_token;
      
      if (!authToken) {
        throw new Error('Not authenticated');
      }
      
      try {
        const response = await fetch('https://tyfmxjzcocjztocwemun.supabase.co/functions/v1/generate-personas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            'x-request-id': crypto.randomUUID()
          },
          body: JSON.stringify({
            projectId: projectId,
            coreProblemId: coreProblemId,
            coreProblem: coreProblemText,  // Add the actual problem text
            lockedPersonaIds: lockedPersonaIds
          })
        });
        
        console.log('[problemApi] Personas response status:', response.status);
        const data = await response.json();
        console.log('[problemApi] Personas response data:', data);
        
        if (!response.ok) {
          throw new Error(data.error?.message || `HTTP ${response.status}`);
        }
        
        // Return the personas array from the edge function
        return data.personas || [];
        
      } catch (error) {
        console.error('[problemApi] Generate personas failed:', error);
        
        // Return mock personas for now
        console.log('[problemApi] Returning mock personas');
        return [
          {
            id: crypto.randomUUID(),
            name: 'Sarah Chen',
            industry: 'Technology',
            role: 'Product Manager',
            description: 'A tech-savvy product manager who values efficiency and data-driven decisions.',
            demographics: { industry: 'Technology', role: 'Product Manager' },
            psychographics: {},
            goals: ['Streamline product development', 'Improve team collaboration'],
            frustrations: ['Inefficient processes', 'Poor communication tools']
          },
          {
            id: crypto.randomUUID(),
            name: 'Marcus Rodriguez',
            industry: 'Healthcare',
            role: 'Operations Director',
            description: 'An experienced operations director focused on improving patient care and operational efficiency.',
            demographics: { industry: 'Healthcare', role: 'Operations Director' },
            psychographics: {},
            goals: ['Optimize patient flow', 'Reduce operational costs'],
            frustrations: ['Complex systems', 'Regulatory compliance burden']
          },
          {
            id: crypto.randomUUID(),
            name: 'Emily Watson',
            industry: 'Education',
            role: 'Administrator',
            description: 'A dedicated education administrator working to improve student outcomes and institutional efficiency.',
            demographics: { industry: 'Education', role: 'Administrator' },
            psychographics: {},
            goals: ['Enhance student experience', 'Streamline administrative processes'],
            frustrations: ['Outdated systems', 'Limited budget']
          }
        ];
      }
    },
    
    generatePainPoints: async (
      projectId: string,
      personaId: string,
      lockedPainPointIds: string[]
    ): Promise<any[]> => {
      // TODO: Implement when you have pain points service
      console.warn('generatePainPoints not implemented yet');
      return [];
    },
    
    generateSolutions: async (
      projectId: string,
      personaId: string,
      painPointIds: string[],
      lockedSolutionIds: string[]
    ): Promise<any[]> => {
      // This should call the solutions service
      try {
        const { solutionsService } = await import('./solutions');
        // TODO: Implement properly
        console.warn('generateSolutions not fully implemented yet');
        return [];
      } catch (error) {
        console.warn('generateSolutions not available yet:', error);
        return [];
      }
    }
  };
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/services/api/solutions.ts
```ts
import { apiClient } from './client'
import type { Solution, PainPoint, Persona, SolutionPainPointMapping } from '@/types/database.types'

export interface SolutionGenerationRequest {
  persona: Persona
  painPoints: PainPoint[]
  lockedSolutions: Solution[]
  projectId: string
  generationBatch: string
}

export interface SolutionGenerationResponse {
  solutions: Solution[]
  mappings: SolutionPainPointMapping[]
  analysisMetadata: {
    feasibilityScores: Record<string, number>
    complexityAnalysis: Record<string, string>
    implementationTimeEstimates: Record<string, string>
  }
}

export interface SolutionAnalysis {
  technicalFeasibility: number
  businessValue: number
  implementationComplexity: 'low' | 'medium' | 'high'
  estimatedEffort: string
}

export class SolutionsService {
  /**
   * Generates solutions based on selected persona and pain points
   */
  async generateSolutions(request: SolutionGenerationRequest): Promise<SolutionGenerationResponse> {
    const response = await apiClient.invokeEdgeFunction<SolutionGenerationResponse>(
      'generate-solutions',
      {
        persona: request.persona,
        painPoints: request.painPoints,
        lockedSolutions: request.lockedSolutions,
        projectId: request.projectId,
        generationBatch: request.generationBatch,
      }
    )

    if (response.error) {
      throw new Error(`Solution generation failed: ${response.error.message}`)
    }

    if (!response.data) {
      throw new Error('No solution data received')
    }

    return response.data
  }

  /**
   * Calculates relevance scores between solutions and pain points
   */
  calculateRelevanceScores(solution: Solution, painPoints: PainPoint[]): SolutionPainPointMapping[] {
    return painPoints.map(painPoint => {
      // Calculate relevance based on keywords, categories, and semantic similarity
      const relevanceScore = this.calculateRelevanceScore(solution, painPoint)
      
      return {
        id: `${solution.id}-${painPoint.id}`,
        solution_id: solution.id,
        pain_point_id: painPoint.id,
        relevance_score: relevanceScore,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    })
  }

  /**
   * Analyzes solution complexity and provides detailed metrics
   */
  analyzeSolutionComplexity(solution: Solution): SolutionAnalysis {
    // Analyze technical complexity based on solution description and requirements
    const technicalFeasibility = this.assessTechnicalFeasibility(solution)
    const businessValue = this.assessBusinessValue(solution)
    const implementationComplexity = this.assessImplementationComplexity(solution)
    const estimatedEffort = this.generateImplementationEstimate(solution, implementationComplexity)

    return {
      technicalFeasibility,
      businessValue,
      implementationComplexity,
      estimatedEffort,
    }
  }

  /**
   * Generates implementation time estimates based on solution complexity
   */
  generateImplementationEstimate(solution: Solution, complexity: string): string {
    const baseEstimates = {
      low: { min: 1, max: 4, unit: 'weeks' },
      medium: { min: 1, max: 3, unit: 'months' },
      high: { min: 3, max: 12, unit: 'months' },
    }

    const estimate = baseEstimates[complexity as keyof typeof baseEstimates]
    
    if (estimate.min === estimate.max) {
      return `${estimate.min} ${estimate.unit}`
    }
    
    return `${estimate.min}-${estimate.max} ${estimate.unit}`
  }

  /**
   * Ranks solutions by business value and relevance
   */
  rankSolutionsByValue(solutions: Solution[], mappings: SolutionPainPointMapping[]): Solution[] {
    return solutions
      .map(solution => {
        const solutionMappings = mappings.filter(m => m.solution_id === solution.id)
        const avgRelevanceScore = solutionMappings.length > 0
          ? solutionMappings.reduce((sum, m) => sum + m.relevance_score, 0) / solutionMappings.length
          : 0

        const analysis = this.analyzeSolutionComplexity(solution)
        
        // Composite score: business value + relevance - complexity penalty
        const complexityPenalty = analysis.implementationComplexity === 'high' ? 0.2 : 
                                 analysis.implementationComplexity === 'medium' ? 0.1 : 0
        
        const compositeScore = (analysis.businessValue * 0.4) + 
                              (avgRelevanceScore * 0.4) + 
                              (analysis.technicalFeasibility * 0.2) - 
                              complexityPenalty

        return { solution, compositeScore }
      })
      .sort((a, b) => b.compositeScore - a.compositeScore)
      .map(item => item.solution)
  }

  /**
   * Calculates relevance score between a solution and pain point
   */
  private calculateRelevanceScore(solution: Solution, painPoint: PainPoint): number {
    // This would typically use semantic similarity, keyword matching, etc.
    // For now, implementing a simple keyword-based approach
    const solutionText = `${solution.title} ${solution.description}`.toLowerCase()
    const painPointText = `${painPoint.title} ${painPoint.description}`.toLowerCase()
    
    // Simple keyword overlap scoring
    const solutionWords = new Set(solutionText.split(/\s+/).filter(w => w.length > 3))
    const painPointWords = new Set(painPointText.split(/\s+/).filter(w => w.length > 3))
    
    const intersection = new Set([...solutionWords].filter(w => painPointWords.has(w)))
    const union = new Set([...solutionWords, ...painPointWords])
    
    // Jaccard similarity with boost for exact matches
    const jaccardSimilarity = intersection.size / union.size
    const exactMatchBoost = solutionText.includes(painPointText) || painPointText.includes(solutionText) ? 0.2 : 0
    
    return Math.min(1.0, jaccardSimilarity + exactMatchBoost)
  }

  /**
   * Assesses technical feasibility of a solution
   */
  private assessTechnicalFeasibility(solution: Solution): number {
    // Analyze technical requirements, dependencies, and implementation complexity
    const description = solution.description?.toLowerCase() || ''
    
    // Simple heuristic based on keywords indicating complexity
    const complexityIndicators = [
      'ai', 'machine learning', 'blockchain', 'quantum',
      'real-time', 'distributed', 'microservices', 'scale'
    ]
    
    const simplicityIndicators = [
      'simple', 'basic', 'straightforward', 'minimal',
      'standard', 'conventional', 'existing'
    ]
    
    let score = 0.7 // Base feasibility score
    
    complexityIndicators.forEach(indicator => {
      if (description.includes(indicator)) score -= 0.1
    })
    
    simplicityIndicators.forEach(indicator => {
      if (description.includes(indicator)) score += 0.1
    })
    
    return Math.max(0.1, Math.min(1.0, score))
  }

  /**
   * Assesses business value of a solution
   */
  private assessBusinessValue(solution: Solution): number {
    const description = solution.description?.toLowerCase() || ''
    
    // Keywords indicating high business value
    const highValueIndicators = [
      'revenue', 'cost savings', 'efficiency', 'automation',
      'user experience', 'customer satisfaction', 'competitive advantage'
    ]
    
    const mediumValueIndicators = [
      'improvement', 'optimization', 'streamline', 'enhance',
      'productivity', 'quality', 'performance'
    ]
    
    let score = 0.5 // Base business value score
    
    highValueIndicators.forEach(indicator => {
      if (description.includes(indicator)) score += 0.15
    })
    
    mediumValueIndicators.forEach(indicator => {
      if (description.includes(indicator)) score += 0.1
    })
    
    return Math.max(0.1, Math.min(1.0, score))
  }

  /**
   * Assesses implementation complexity
   */
  private assessImplementationComplexity(solution: Solution): 'low' | 'medium' | 'high' {
    const description = solution.description?.toLowerCase() || ''
    
    const highComplexityIndicators = [
      'ai', 'machine learning', 'blockchain', 'distributed',
      'microservices', 'real-time', 'complex algorithm'
    ]
    
    const lowComplexityIndicators = [
      'simple', 'basic', 'straightforward', 'minimal',
      'configuration', 'existing tool', 'off-the-shelf'
    ]
    
    const highComplexityCount = highComplexityIndicators.filter(indicator => 
      description.includes(indicator)
    ).length
    
    const lowComplexityCount = lowComplexityIndicators.filter(indicator => 
      description.includes(indicator)
    ).length
    
    if (highComplexityCount > lowComplexityCount && highComplexityCount >= 2) {
      return 'high'
    } else if (lowComplexityCount > highComplexityCount && lowComplexityCount >= 2) {
      return 'low'
    } else {
      return 'medium'
    }
  }
}

// Export singleton instance
export const solutionsService = new SolutionsService()

```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/services/supabase/client.ts
```ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/services/supabase/database.ts
```ts
import { supabase } from './client';

export interface Workspace {
  id: string;
  user_id?: string;
  name: string;
  folder_path?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  workspace_id: string;
  name: string;
  status: string;
  current_step: string;
  langgraph_state?: any;
  created_at: string;
  updated_at: string;
}

export const databaseService = {
  // Workspace operations
  async createWorkspace(name: string, folderPath?: string): Promise<Workspace> {
    console.log('[databaseService] Creating workspace:', name);
    
    const { data, error } = await supabase
      .from('workspaces')
      .insert({
        name,
        folder_path: folderPath,
        is_active: true
      })
      .select()
      .single();
    
    if (error) {
      console.error('[databaseService] Error creating workspace:', error);
      throw error;
    }
    
    console.log('[databaseService] Workspace created:', data);
    return data;
  },

  async getWorkspaces(): Promise<Workspace[]> {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[databaseService] Error fetching workspaces:', error);
      throw error;
    }
    
    return data || [];
  },

  async getOrCreateDefaultWorkspace(): Promise<Workspace> {
    console.log('[databaseService] Getting or creating default workspace');
    
    // First try to get existing default workspace
    const { data: existing, error: fetchError } = await supabase
      .from('workspaces')
      .select('*')
      .eq('name', 'Default Workspace')
      .single();
    
    if (existing && !fetchError) {
      console.log('[databaseService] Found existing default workspace:', existing.id);
      return existing;
    }
    
    // Create default workspace if it doesn't exist
    console.log('[databaseService] Creating default workspace');
    return this.createWorkspace('Default Workspace', '/default');
  },

  // Project operations
  async createProject(workspaceId: string, name: string): Promise<Project> {
    console.log('[databaseService] Creating project:', name, 'in workspace:', workspaceId);
    
    const { data, error } = await supabase
      .from('projects')
      .insert({
        workspace_id: workspaceId,
        name,
        status: 'problem_input',
        current_step: 'problem_input'
      })
      .select()
      .single();
    
    if (error) {
      console.error('[databaseService] Error creating project:', error);
      throw error;
    }
    
    console.log('[databaseService] Project created:', data);
    return data;
  },

  async getProjects(workspaceId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[databaseService] Error fetching projects:', error);
      throw error;
    }
    
    return data || [];
  },

  async updateProjectStep(projectId: string, step: string): Promise<void> {
    console.log('[databaseService] Updating project step:', projectId, 'to:', step);
    
    const { error } = await supabase
      .from('projects')
      .update({
        current_step: step,
        status: step
      })
      .eq('id', projectId);
    
    if (error) {
      console.error('[databaseService] Error updating project step:', error);
      throw error;
    }
  },

  // Canvas state operations
  async saveCanvasState(projectId: string, nodes: any[], edges: any[], viewport?: any): Promise<void> {
    console.log('[databaseService] Saving canvas state for project:', projectId);
    
    const { error } = await supabase
      .from('canvas_states')
      .insert({
        project_id: projectId,
        nodes,
        edges,
        viewport
      });
    
    if (error) {
      console.error('[databaseService] Error saving canvas state:', error);
      throw error;
    }
  },

  async getLatestCanvasState(projectId: string): Promise<{ nodes: any[], edges: any[], viewport?: any } | null> {
    const { data, error } = await supabase
      .from('canvas_states')
      .select('nodes, edges, viewport')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return null;
      }
      console.error('[databaseService] Error fetching canvas state:', error);
      throw error;
    }
    
    return data;
  }
};

export default databaseService; 
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/services/tauri/api.ts
```ts
import { invoke } from '@tauri-apps/api/core'
import type { Workspace, CanvasState } from '@/types/database.types'

export const tauriAPI = {
  async getAppState() {
    return invoke<{ version: string; initialized: boolean }>('get_app_state')
  },

  async createWorkspace(workspace: Omit<Workspace, 'created_at' | 'updated_at'>) {
    return invoke<Workspace>('create_workspace', { workspace })
  },

  async listWorkspaces(userId: string) {
    return invoke<Workspace[]>('list_workspaces', { userId })
  },

  async saveCanvasState(canvasState: CanvasState) {
    return invoke<void>('save_canvas_state', { canvasState })
  },

  async analyzeProblem(problem: string) {
    return invoke<string>('analyze_problem', { problem })
  },
}
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/services/index.ts
```ts

```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/stores/canvasStore.ts
```ts
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { 
  Node, 
  Edge, 
  Viewport, 
  NodeChange, 
  EdgeChange, 
  Connection,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge
} from '@xyflow/react'
import { tauriAPI } from '@/services/tauri/api'
import type { CanvasState } from '@/types/database.types'

// Import other stores for integration
import { useWorkflowStore } from './workflowStore'
import { useUIStore } from './uiStore'

// Node types for different workflow elements
export type WorkflowNodeType = 
  | 'problem'
  | 'persona' 
  | 'painPoint'
  | 'solution'
  | 'userStory'

export interface WorkflowNodeData extends Record<string, unknown> {
  id: string
  title: string
  description: string
  type: WorkflowNodeType
  isLocked?: boolean
  isSelected?: boolean
  metadata?: Record<string, any>
}

export interface WorkflowNode extends Node {
  data: WorkflowNodeData
}

interface CanvasStoreState {
  // React Flow state
  nodes: Node[]
  edges: Edge[]
  viewport: Viewport
  
  // Canvas metadata
  canvasId: string | null
  projectId: string | null
  lastSaved: Date | null
  isDirty: boolean
  
  // UI state
  selectedNodeIds: Set<string>
  hoveredNodeId: string | null
  isAnimating: boolean
  
  // Layout
  layoutType: 'hierarchical' | 'force' | 'grid'
  nodeSpacing: { x: number; y: number }
}

interface CanvasActions {
  // Node operations
  addNode: (node: Node) => void
  addNodes: (nodes: Node[]) => void
  updateNode: (nodeId: string, updates: Partial<Node>) => void
  removeNode: (nodeId: string) => void
  onNodesChange: (changes: NodeChange[]) => void
  
  // Edge operations
  addEdge: (edge: Edge) => void
  addEdges: (edges: Edge[]) => void
  updateEdge: (edgeId: string, updates: Partial<Edge>) => void
  removeEdge: (edgeId: string) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  
  // Viewport
  setViewport: (viewport: Viewport) => void
  fitView: () => void
  zoomTo: (level: number) => void
  
  // Selection
  selectNode: (nodeId: string) => void
  selectNodes: (nodeIds: string[]) => void
  clearSelection: () => void
  setHoveredNode: (nodeId: string | null) => void
  
  // Layout
  applyLayout: (layoutType: 'hierarchical' | 'force' | 'grid') => void
  calculateNodePositions: (nodes: Node[]) => Node[]
  setNodeSpacing: (spacing: { x: number; y: number }) => void
  
  // Persistence
  saveCanvasState: () => Promise<void>
  loadCanvasState: (projectId: string) => Promise<void>
  markDirty: () => void
  markClean: () => void
  
  // Animation
  animateNodeAppearance: (nodes: Node[], staggerDelay?: number) => void
  animateTransition: (fromNodes: Node[], toNodes: Node[]) => void
  setAnimating: (isAnimating: boolean) => void
  
  // Workflow integration
  syncWithWorkflow: (workflowState: any) => void
  transformWorkflowToNodes: (data: any) => { nodes: Node[], edges: Edge[] }
  
  // Utilities
  getNodeById: (nodeId: string) => Node | undefined
  getEdgeById: (edgeId: string) => Edge | undefined
  getConnectedNodes: (nodeId: string) => Node[]
  
  // Reset
  resetCanvas: () => void
}

const initialViewport: Viewport = {
  x: 0,
  y: 0,
  zoom: 1
}

const initialState: CanvasStoreState = {
  nodes: [],
  edges: [],
  viewport: initialViewport,
  canvasId: null,
  projectId: null,
  lastSaved: null,
  isDirty: false,
  selectedNodeIds: new Set(),
  hoveredNodeId: null,
  isAnimating: false,
  layoutType: 'hierarchical',
  nodeSpacing: { x: 200, y: 150 }
}

// Debounce utility for auto-save
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T => {
  let timeout: NodeJS.Timeout
  return ((...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}

export const useCanvasStore = create<CanvasStoreState & CanvasActions>()(
  subscribeWithSelector((set, get) => {
    // Create debounced save function
    const debouncedSave = debounce(async () => {
      const state = get()
      if (state.isDirty && state.projectId) {
        await state.saveCanvasState()
      }
    }, 1000)

    return {
      ...initialState,

      // Node operations
      addNode: (node) => {
        set((state) => ({
          nodes: [...state.nodes, node],
          isDirty: true
        }))
        debouncedSave()
      },

      addNodes: (newNodes) => {
        set((state) => ({
          nodes: [...state.nodes, ...newNodes],
          isDirty: true
        }))
        debouncedSave()
      },

      updateNode: (nodeId, updates) => {
        set((state) => ({
          nodes: state.nodes.map(node => 
            node.id === nodeId ? { ...node, ...updates } : node
          ),
          isDirty: true
        }))
        debouncedSave()
      },

      removeNode: (nodeId) => {
        set((state) => ({
          nodes: state.nodes.filter(node => node.id !== nodeId),
          edges: state.edges.filter(edge => 
            edge.source !== nodeId && edge.target !== nodeId
          ),
          selectedNodeIds: new Set([...state.selectedNodeIds].filter(id => id !== nodeId)),
          isDirty: true
        }))
        debouncedSave()
      },

      onNodesChange: (changes) => {
        set((state) => ({
          nodes: applyNodeChanges(changes, state.nodes),
          isDirty: true
        }))
        debouncedSave()
      },

      // Edge operations
      addEdge: (edge) => {
        set((state) => ({
          edges: [...state.edges, edge],
          isDirty: true
        }))
        debouncedSave()
      },

      addEdges: (newEdges) => {
        set((state) => ({
          edges: [...state.edges, ...newEdges],
          isDirty: true
        }))
        debouncedSave()
      },

      updateEdge: (edgeId, updates) => {
        set((state) => ({
          edges: state.edges.map(edge => 
            edge.id === edgeId ? { ...edge, ...updates } : edge
          ),
          isDirty: true
        }))
        debouncedSave()
      },

      removeEdge: (edgeId) => {
        set((state) => ({
          edges: state.edges.filter(edge => edge.id !== edgeId),
          isDirty: true
        }))
        debouncedSave()
      },

      onEdgesChange: (changes) => {
        set((state) => ({
          edges: applyEdgeChanges(changes, state.edges),
          isDirty: true
        }))
        debouncedSave()
      },

      onConnect: (connection) => {
        set((state) => ({
          edges: addEdge(connection, state.edges),
          isDirty: true
        }))
        debouncedSave()
      },

      // Viewport
      setViewport: (viewport) => {
        set({ viewport, isDirty: true })
        debouncedSave()
      },

      fitView: () => {
        // This would typically be handled by React Flow's fitView function
        // We'll just mark as dirty for now
        set({ isDirty: true })
        debouncedSave()
      },

      zoomTo: (level) => {
        set((state) => ({ 
          viewport: { ...state.viewport, zoom: level },
          isDirty: true
        }))
        debouncedSave()
      },

      // Selection
      selectNode: (nodeId) => {
        set((state) => ({
          selectedNodeIds: new Set([nodeId])
        }))
        
        // Update node visual state
        get().updateNode(nodeId, {
          style: { 
            ...get().getNodeById(nodeId)?.style,
            border: '2px solid #3b82f6'
          }
        })
      },

      selectNodes: (nodeIds) => {
        set({
          selectedNodeIds: new Set(nodeIds)
        })
        
        // Update visual state for all selected nodes
        const currentNodes = get().nodes
        nodeIds.forEach(nodeId => {
          const node = currentNodes.find(n => n.id === nodeId)
          if (node) {
            get().updateNode(nodeId, {
              style: {
                ...node.style,
                border: '2px solid #3b82f6'
              }
            })
          }
        })
      },

      clearSelection: () => {
        const previousSelection = get().selectedNodeIds
        set({
          selectedNodeIds: new Set()
        })
        
        // Clear visual selection state
        previousSelection.forEach(nodeId => {
          const node = get().getNodeById(nodeId)
          if (node) {
            get().updateNode(nodeId, {
              style: {
                ...node.style,
                border: undefined
              }
            })
          }
        })
      },

      setHoveredNode: (nodeId) => {
        set({ hoveredNodeId: nodeId })
      },

      // Layout
      applyLayout: (layoutType) => {
        const state = get()
        const newNodes = state.calculateNodePositions(state.nodes)
        
        set({
          layoutType,
          nodes: newNodes,
          isDirty: true
        })
        debouncedSave()
        
        // Show notification
        const uiStore = useUIStore.getState()
        uiStore.showInfo(`Applied ${layoutType} layout`)
      },

      calculateNodePositions: (nodes) => {
        const state = get()
        const { layoutType, nodeSpacing } = state

        switch (layoutType) {
          case 'hierarchical':
            return calculateHierarchicalLayout(nodes, nodeSpacing)
          case 'force':
            return calculateForceLayout(nodes, nodeSpacing)
          case 'grid':
            return calculateGridLayout(nodes, nodeSpacing)
          default:
            return nodes
        }
      },

      setNodeSpacing: (spacing) => {
        set({ nodeSpacing: spacing })
      },

      // Persistence
      saveCanvasState: async () => {
        const state = get()
        if (!state.projectId) return

        const uiStore = useUIStore.getState()

        try {
          const canvasState: CanvasState = {
            id: state.canvasId || crypto.randomUUID(),
            project_id: state.projectId,
            nodes: state.nodes,
            edges: state.edges,
            viewport: state.viewport,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }

          await tauriAPI.saveCanvasState(canvasState)
          
          set({ 
            canvasId: canvasState.id,
            lastSaved: new Date(),
            isDirty: false
          })
          
          uiStore.showSuccess('Canvas saved')
        } catch (error) {
          console.error('Failed to save canvas state:', error)
          uiStore.showError('Failed to save canvas', error instanceof Error ? error.message : 'Unknown error')
        }
      },

      loadCanvasState: async (projectId) => {
        const uiStore = useUIStore.getState()
        
        try {
          // TODO: Implement loadCanvasState in tauriAPI
          // const canvasState = await tauriAPI.loadCanvasState(projectId)
          set({
            projectId,
            // nodes: canvasState.nodes,
            // edges: canvasState.edges,
            // viewport: canvasState.viewport,
            // canvasId: canvasState.id,
            lastSaved: new Date(),
            isDirty: false
          })
          
          uiStore.showSuccess('Canvas loaded')
        } catch (error) {
          console.error('Failed to load canvas state:', error)
          uiStore.showError('Failed to load canvas', error instanceof Error ? error.message : 'Unknown error')
          set({ projectId })
        }
      },

      markDirty: () => set({ isDirty: true }),
      markClean: () => set({ isDirty: false }),

      // Animation
      animateNodeAppearance: async (nodes, staggerDelay = 100) => {
        set({ isAnimating: true })
        
        // Add nodes with initial hidden state
        const hiddenNodes = nodes.map(node => ({
          ...node,
          style: { ...node.style, opacity: 0, transform: 'scale(0.8)' }
        }))
        
        get().addNodes(hiddenNodes)
        
        // Animate each node with stagger
        for (let i = 0; i < nodes.length; i++) {
          setTimeout(() => {
            get().updateNode(nodes[i].id, {
              style: { ...nodes[i].style, opacity: 1, transform: 'scale(1)' }
            })
            
            if (i === nodes.length - 1) {
              setTimeout(() => set({ isAnimating: false }), 300)
            }
          }, i * staggerDelay)
        }
      },

      animateTransition: async (fromNodes, toNodes) => {
        set({ isAnimating: true })
        
        // TODO: Implement smooth transition animation
        // For now, just replace nodes
        set({ 
          nodes: toNodes,
          isAnimating: false,
          isDirty: true
        })
        debouncedSave()
      },

      setAnimating: (isAnimating) => {
        set({ isAnimating })
      },

      // Workflow integration
      syncWithWorkflow: (workflowState) => {
        const { nodes, edges } = get().transformWorkflowToNodes(workflowState)
        const layoutedNodes = get().calculateNodePositions(nodes)
        
        // Use animation if enabled
        const uiStore = useUIStore.getState()
        if (uiStore.experimentalFeatures.advancedAnimations) {
          get().animateTransition(get().nodes, layoutedNodes)
        } else {
          set({
            nodes: layoutedNodes,
            edges,
            isDirty: true
          })
          debouncedSave()
        }
      },

      transformWorkflowToNodes: (data) => {
        const { currentStep, coreProblem, personas, painPoints, solutions, userStories } = data
        const nodes: Node[] = []
        const edges: Edge[] = []
        
        // IMPORTANT: This method is incomplete and was clearing the canvas
        // For now, just return the current nodes/edges to prevent clearing
        // The WorkflowCanvas component manages nodes directly
        console.warn('[canvasStore] transformWorkflowToNodes called - returning current nodes to prevent clearing')
        return { 
          nodes: get().nodes, 
          edges: get().edges 
        }
        
        // TODO: Implement proper transformation logic if needed
        // Transform data based on current workflow step
        switch (currentStep) {
          case 'problem_input':
            // Show problem node only
            if (coreProblem) {
              nodes.push(createWorkflowNode({
                id: 'problem',
                title: 'Core Problem',
                description: coreProblem.description,
                type: 'problem',
                position: { x: 400, y: 300 },
                isLocked: true,
              }))
            }
            break
            
          case 'persona_discovery':
            // Show problem and personas
            // ... add transformation logic
            break
            
          case 'pain_points':
            // Show problem, personas, and pain points
            // ... add transformation logic
            break
            
          case 'solution_generation':
            // Show everything up to solutions
            // ... add transformation logic
            break
            
          case 'user_stories':
            // Show full workflow
            // ... add transformation logic
            break
        }
        
        return { nodes, edges }
      },

      // Utilities
      getNodeById: (nodeId) => {
        return get().nodes.find(node => node.id === nodeId)
      },

      getEdgeById: (edgeId) => {
        return get().edges.find(edge => edge.id === edgeId)
      },

      getConnectedNodes: (nodeId) => {
        const state = get()
        const connectedEdges = state.edges.filter(
          edge => edge.source === nodeId || edge.target === nodeId
        )
        const connectedNodeIds = connectedEdges.flatMap(edge => 
          [edge.source, edge.target].filter(id => id !== nodeId)
        )
        return state.nodes.filter(node => connectedNodeIds.includes(node.id))
      },

      // Reset
      resetCanvas: () => {
        set({
          ...initialState,
          projectId: get().projectId // Keep project ID
        })
      }
    }
  })
)

// Helper function to create workflow nodes
function createWorkflowNode(config: {
  id: string
  title: string
  description: string
  type: WorkflowNodeType
  position: { x: number; y: number }
  isLocked?: boolean
  isSelected?: boolean
  metadata?: Record<string, any>
}): Node {
  return {
    id: config.id,
    type: config.type,
    position: config.position,
    data: {
      id: config.id,
      title: config.title,
      description: config.description,
      type: config.type,
      isLocked: config.isLocked,
      isSelected: config.isSelected,
      metadata: config.metadata
    },
    style: {
      opacity: config.isSelected ? 1 : 0.8,
      border: config.isLocked ? '2px solid #f59e0b' : undefined
    }
  }
}

// Layout algorithms
function calculateHierarchicalLayout(nodes: Node[], spacing: { x: number; y: number }): Node[] {
  const nodesByType = groupNodesByType(nodes)
  let yOffset = 0
  
  const layoutedNodes: Node[] = []
  
  // Order: problem -> personas -> painPoints -> solutions -> userStories
  const typeOrder: WorkflowNodeType[] = ['problem', 'persona', 'painPoint', 'solution', 'userStory']
  
  typeOrder.forEach(type => {
    const typeNodes = nodesByType[type] || []
    if (typeNodes.length === 0) return
    
    const totalWidth = (typeNodes.length - 1) * spacing.x
    const startX = -totalWidth / 2
    
    typeNodes.forEach((node, index) => {
      layoutedNodes.push({
        ...node,
        position: {
          x: startX + (index * spacing.x),
          y: yOffset
        }
      })
    })
    
    yOffset += spacing.y
  })
  
  return layoutedNodes
}

function calculateForceLayout(nodes: Node[], spacing: { x: number; y: number }): Node[] {
  // Simple force-directed layout simulation
  // In a real implementation, you'd use a proper force simulation library
  return nodes.map((node, index) => ({
    ...node,
    position: {
      x: Math.cos(index * 2 * Math.PI / nodes.length) * 300,
      y: Math.sin(index * 2 * Math.PI / nodes.length) * 300
    }
  }))
}

function calculateGridLayout(nodes: Node[], spacing: { x: number; y: number }): Node[] {
  const cols = Math.ceil(Math.sqrt(nodes.length))
  
  return nodes.map((node, index) => ({
    ...node,
    position: {
      x: (index % cols) * spacing.x,
      y: Math.floor(index / cols) * spacing.y
    }
  }))
}

function groupNodesByType(nodes: Node[]): Record<WorkflowNodeType, Node[]> {
  const groups: Record<WorkflowNodeType, Node[]> = {
    problem: [],
    persona: [],
    painPoint: [],
    solution: [],
    userStory: []
  }
  
  nodes.forEach(node => {
    const nodeData = node.data as unknown as WorkflowNodeData
    const nodeType = nodeData?.type
    if (nodeType && groups[nodeType]) {
      groups[nodeType].push(node)
    }
  })
  
  return groups
}

// Initialize store subscriptions after both stores are created
export function initializeCanvasSubscriptions() {
  // Subscribe to workflow changes for reactive updates
  useWorkflowStore.subscribe(
    (state) => state.currentStep,
    (currentStep) => {
      console.log(`Canvas reacting to workflow step change: ${currentStep}`)
      
      const canvasStore = useCanvasStore.getState()
      const workflowState = useWorkflowStore.getState()
      
      // React to step changes with appropriate layout
      switch (currentStep) {
        case 'persona_discovery':
          canvasStore.applyLayout('hierarchical')
          break
        case 'pain_points':
          canvasStore.applyLayout('hierarchical')
          break
        case 'solution_generation':
          canvasStore.applyLayout('force')
          break
        case 'user_stories':
          canvasStore.applyLayout('hierarchical')
          break
      }
      
      // Sync with current workflow state
      canvasStore.syncWithWorkflow(workflowState)
    }
  )

  useWorkflowStore.subscribe(
    (state) => state.activePersonaId,
    (activePersonaId) => {
      if (activePersonaId) {
        console.log(`Canvas reacting to persona selection: ${activePersonaId}`)
        
        const canvasStore = useCanvasStore.getState()
        
        // Clear previous selections
        canvasStore.clearSelection()
        
        // Select the active persona node
        canvasStore.selectNode(`persona-${activePersonaId}`)
        
        // Sync with workflow state
        const workflowState = useWorkflowStore.getState()
        canvasStore.syncWithWorkflow(workflowState)
      }
    }
  )

  useWorkflowStore.subscribe(
    (state) => state.selectedSolutionIds,
    (selectedSolutionIds) => {
      console.log(`Canvas reacting to solution selection changes`)
      
      const canvasStore = useCanvasStore.getState()
      
      // Update visual selection state for solutions
      const solutionNodeIds = Array.from(selectedSolutionIds).map(id => `solution-${id}`)
      canvasStore.selectNodes(solutionNodeIds)
      
      // Sync with workflow state
      const workflowState = useWorkflowStore.getState()
      canvasStore.syncWithWorkflow(workflowState)
    }
  )

  // Subscribe to project changes
  useCanvasStore.subscribe(
    (state) => state.projectId,
    (projectId, previousProjectId) => {
      if (projectId !== previousProjectId && projectId) {
        console.log(`Canvas reacting to project change: ${projectId}`)
        
        // Load canvas state for new project
        const canvasStore = useCanvasStore.getState()
        canvasStore.loadCanvasState(projectId)
      }
    }
  )

  // Subscribe to canvas changes for auto-save
  useCanvasStore.subscribe(
    (state) => state.isDirty,
    (isDirty) => {
      if (isDirty) {
        console.log('Canvas marked as dirty, auto-saving...')
      }
    }
  )
}

```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/stores/index.ts
```ts
// Store exports
export { default as useProjectStore } from './projectStore'
export { useWorkflowStore } from './workflowStore'
export { useCanvasStore } from './canvasStore'
export { useUIStore } from './uiStore'

/**
 * Store Integration Architecture
 * =============================
 * 
 * This application uses a multi-store architecture with clean separation of concerns
 * and efficient cross-store communication patterns.
 * 
 * Store Responsibilities:
 * 
 * 1. ProjectStore (projectStore.ts)
 *    - Source of truth for workspace and project management
 *    - Handles user authentication context
 *    - Manages project lifecycle and recent projects
 *    - Triggers workflow and canvas loading when projects change
 * 
 * 2. WorkflowStore (workflowStore.ts)
 *    - Source of truth for business workflow data
 *    - Manages problem validation, personas, pain points, solutions, user stories
 *    - Orchestrates the workflow progression through steps
 *    - Notifies canvas store for visual updates
 *    - Uses UI store for user feedback notifications
 * 
 * 3. CanvasStore (canvasStore.ts)
 *    - Source of truth for visual representation and layout
 *    - Manages React Flow nodes, edges, and viewport state
 *    - Subscribes to workflow changes for reactive updates
 *    - Handles animations and visual transitions
 *    - Responds to UI preference changes (grid, snap, animations)
 * 
 * 4. UIStore (uiStore.ts)
 *    - Source of truth for user interface preferences and temporary state
 *    - Manages notifications, modals, theme, and layout preferences
 *    - Provides centralized notification system for all stores
 *    - Handles feature flags and experimental features
 * 
 * Integration Patterns:
 * 
 * 1. Direct Method Calls (Immediate Updates)
 *    Example: workflowStore.selectPersona() calls canvasStore.selectNode()
 *    Usage: When one store needs to immediately update another store's state
 * 
 * 2. Subscription Pattern (Reactive Updates)
 *    Example: canvasStore subscribes to workflowStore.currentStep changes
 *    Usage: When a store needs to react to state changes in another store
 * 
 * 3. Notification Pattern (User Feedback)
 *    Example: All stores use uiStore.showSuccess() for user notifications
 *    Usage: Centralized user feedback system across all operations
 * 
 * 4. Lazy Loading Pattern (Avoiding Circular Dependencies)
 *    Example: uiStore uses dynamic imports to notify canvas store
 *    Usage: When circular dependencies would occur with direct imports
 * 
 * Key Integration Points:
 * 
 * Project Changes:
 * - projectStore.setActiveProject() → workflowStore.loadWorkflowState()
 * - projectStore.setActiveProject() → canvasStore.loadCanvasState()
 * - projectStore operations → uiStore notifications
 * 
 * Workflow Progression:
 * - workflowStore.setCurrentStep() → canvasStore.syncWithWorkflow()
 * - workflowStore.selectPersona() → canvasStore.selectNode()
 * - workflowStore operations → uiStore notifications
 * - workflowStore.toggleSolutionSelection() → canvasStore visual updates
 * 
 * Canvas Updates:
 * - canvasStore subscribes to workflowStore.currentStep for layout changes
 * - canvasStore subscribes to workflowStore.activePersonaId for selection
 * - canvasStore subscribes to workflowStore.selectedSolutionIds for multi-select
 * - canvasStore operations → uiStore notifications
 * 
 * UI Preferences:
 * - uiStore.toggleGrid() → canvasStore.markDirty() for re-render
 * - uiStore.toggleFeature('advancedAnimations') → canvasStore animation behavior
 * - uiStore provides centralized notification system for all stores
 * 
 * Data Flow Example (Persona Selection):
 * 1. User clicks persona in UI
 * 2. workflowStore.selectPersona(id) is called
 * 3. workflowStore updates activePersonaId
 * 4. workflowStore calls canvasStore.syncWithWorkflow() and canvasStore.selectNode()
 * 5. workflowStore calls uiStore.showSuccess() for feedback
 * 6. canvasStore subscription detects activePersonaId change
 * 7. canvasStore updates visual selection state
 * 8. UI reflects all changes with proper visual feedback
 * 
 * This architecture ensures:
 * - Clean separation of concerns
 * - Predictable data flow
 * - Centralized user feedback
 * - Reactive visual updates
 * - Maintainable code structure
 */ 
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/stores/projectStore.ts
```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { tauriAPI } from '@/services/tauri/api'
import type { Workspace, Project, User } from '@/types/database.types'

// Import other stores for integration
import { useWorkflowStore } from './workflowStore'
import { useCanvasStore } from './canvasStore'
import { useUIStore } from './uiStore'

interface ProjectStoreState {
  // User context
  currentUser: User | null
  
  // Workspace data
  workspaces: Workspace[]
  activeWorkspaceId: string | null
  
  // Project data
  projects: Project[]
  activeProjectId: string | null
  recentProjects: string[] // Project IDs
  
  // UI state
  isLoadingWorkspaces: boolean
  isLoadingProjects: boolean
  expandedWorkspaceIds: Set<string>
}

interface ProjectActions {
  // User management
  setCurrentUser: (user: User) => void
  
  // Workspace operations
  loadWorkspaces: () => Promise<void>
  createWorkspace: (name: string, folderPath?: string) => Promise<Workspace>
  updateWorkspace: (id: string, updates: Partial<Workspace>) => Promise<void>
  deleteWorkspace: (id: string) => Promise<void>
  setActiveWorkspace: (id: string) => void
  
  // Project operations
  loadProjects: (workspaceId: string) => Promise<void>
  createProject: (workspaceId: string, name: string) => Promise<Project>
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  duplicateProject: (id: string, newName: string) => Promise<Project>
  setActiveProject: (id: string) => void
  
  // Recent projects
  addToRecentProjects: (projectId: string) => void
  clearRecentProjects: () => void
  
  // UI state
  toggleWorkspaceExpanded: (workspaceId: string) => void
  
  // Import/Export
  exportProject: (projectId: string, format: 'markdown' | 'json') => Promise<string>
  importProject: (workspaceId: string, data: string, format: 'markdown' | 'json') => Promise<Project>
}

type ProjectStore = ProjectStoreState & ProjectActions

const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      workspaces: [],
      activeWorkspaceId: null,
      projects: [],
      activeProjectId: null,
      recentProjects: [],
      isLoadingWorkspaces: false,
      isLoadingProjects: false,
      expandedWorkspaceIds: new Set<string>(),

      // User management
      setCurrentUser: (user: User) => {
        set({ currentUser: user })
        
        // Load workspaces for the user
        get().loadWorkspaces()
        
        // Show welcome notification
        const uiStore = useUIStore.getState()
        uiStore.showSuccess(`Welcome back, ${user.email || 'User'}!`)
      },

      // Workspace operations
      loadWorkspaces: async () => {
        const { currentUser } = get()
        if (!currentUser?.id) return
        
        const uiStore = useUIStore.getState()
        
        set({ isLoadingWorkspaces: true })
        try {
          const workspaces = await tauriAPI.listWorkspaces(currentUser.id)
          set({ workspaces, isLoadingWorkspaces: false })
          
          if (workspaces.length === 0) {
            uiStore.showInfo('No workspaces found', 'Create your first workspace to get started')
          }
        } catch (error) {
          console.error('Failed to load workspaces:', error)
          uiStore.showError('Failed to load workspaces', error instanceof Error ? error.message : 'Unknown error')
          set({ isLoadingWorkspaces: false })
        }
      },

      createWorkspace: async (name: string, folderPath?: string) => {
        const uiStore = useUIStore.getState()
        
        try {
          const workspace = await tauriAPI.createWorkspace({ 
            id: crypto.randomUUID(),
            name, 
            folder_path: folderPath || null,
            user_id: get().currentUser?.id || '',
            is_active: true
          })
          
          set(state => ({
            workspaces: [...state.workspaces, workspace]
          }))
          
          uiStore.showSuccess('Workspace created', `Created workspace "${name}"`)
          return workspace
        } catch (error) {
          console.error('Failed to create workspace:', error)
          uiStore.showError('Failed to create workspace', error instanceof Error ? error.message : 'Unknown error')
          throw error
        }
      },

      updateWorkspace: async (id: string, updates: Partial<Workspace>) => {
        const uiStore = useUIStore.getState()
        
        try {
          // TODO: Implement updateWorkspace in Tauri API
          console.warn('updateWorkspace not yet implemented in Tauri API')
          throw new Error('updateWorkspace not yet implemented')
        } catch (error) {
          uiStore.showError('Failed to update workspace', error instanceof Error ? error.message : 'Unknown error')
          throw error
        }
      },

      deleteWorkspace: async (id: string) => {
        const uiStore = useUIStore.getState()
        
        try {
          // TODO: Implement deleteWorkspace in Tauri API
          console.warn('deleteWorkspace not yet implemented in Tauri API')
          throw new Error('deleteWorkspace not yet implemented')
        } catch (error) {
          uiStore.showError('Failed to delete workspace', error instanceof Error ? error.message : 'Unknown error')
          throw error
        }
      },

      setActiveWorkspace: (id: string) => {
        const previousWorkspaceId = get().activeWorkspaceId
        set({ activeWorkspaceId: id })
        
        // Load projects for the active workspace
        get().loadProjects(id)
        
        // Show notification if workspace changed
        if (previousWorkspaceId !== id) {
          const workspace = get().workspaces.find(w => w.id === id)
          const uiStore = useUIStore.getState()
          uiStore.showInfo('Workspace switched', workspace ? `Now viewing "${workspace.name}"` : undefined)
        }
      },

      // Project operations
      loadProjects: async (workspaceId: string) => {
        const uiStore = useUIStore.getState()
        
        set({ isLoadingProjects: true })
        try {
          // TODO: Implement getProjects in Tauri API
          console.warn('loadProjects not yet implemented in Tauri API')
          set({ isLoadingProjects: false, projects: [] })
          
          // For now, show placeholder message
          uiStore.showInfo('Projects loading not yet implemented')
        } catch (error) {
          console.error('Failed to load projects:', error)
          uiStore.showError('Failed to load projects', error instanceof Error ? error.message : 'Unknown error')
          set({ isLoadingProjects: false })
        }
      },

      createProject: async (workspaceId: string, name: string) => {
        const uiStore = useUIStore.getState()
        
        try {
          // TODO: Implement createProject in Tauri API
          console.warn('createProject not yet implemented in Tauri API')
          throw new Error('createProject not yet implemented')
        } catch (error) {
          uiStore.showError('Failed to create project', error instanceof Error ? error.message : 'Unknown error')
          throw error
        }
      },

      updateProject: async (id: string, updates: Partial<Project>) => {
        const uiStore = useUIStore.getState()
        
        try {
          // TODO: Implement updateProject in Tauri API
          console.warn('updateProject not yet implemented in Tauri API')
          throw new Error('updateProject not yet implemented')
        } catch (error) {
          uiStore.showError('Failed to update project', error instanceof Error ? error.message : 'Unknown error')
          throw error
        }
      },

      deleteProject: async (id: string) => {
        const uiStore = useUIStore.getState()
        
        try {
          // TODO: Implement deleteProject in Tauri API
          console.warn('deleteProject not yet implemented in Tauri API')
          throw new Error('deleteProject not yet implemented')
        } catch (error) {
          uiStore.showError('Failed to delete project', error instanceof Error ? error.message : 'Unknown error')
          throw error
        }
      },

      duplicateProject: async (id: string, newName: string) => {
        const uiStore = useUIStore.getState()
        
        try {
          // TODO: Implement duplicateProject in Tauri API
          console.warn('duplicateProject not yet implemented in Tauri API')
          throw new Error('duplicateProject not yet implemented')
        } catch (error) {
          uiStore.showError('Failed to duplicate project', error instanceof Error ? error.message : 'Unknown error')
          throw error
        }
      },

      setActiveProject: (id: string) => {
        const previousProjectId = get().activeProjectId
        set({ activeProjectId: id })
        get().addToRecentProjects(id)
        
        // Notify other stores about project switch
        if (previousProjectId !== id) {
          const workflowStore = useWorkflowStore.getState()
          const canvasStore = useCanvasStore.getState()
          const uiStore = useUIStore.getState()
          
          // Load workflow and canvas state for the new project
          workflowStore.loadWorkflowState(id)
          canvasStore.loadCanvasState(id)
          
          // Show notification
          const project = get().projects.find(p => p.id === id)
          uiStore.showSuccess('Project opened', project ? `Opened "${project.name}"` : undefined)
        }
      },

      // Recent projects management
      addToRecentProjects: (projectId: string) => {
        set(state => {
          const filtered = state.recentProjects.filter(id => id !== projectId)
          const updated = [projectId, ...filtered].slice(0, 10) // Max 10 recent projects
          return { recentProjects: updated }
        })
      },

      clearRecentProjects: () => {
        set({ recentProjects: [] })
        
        const uiStore = useUIStore.getState()
        uiStore.showInfo('Recent projects cleared')
      },

      // UI state
      toggleWorkspaceExpanded: (workspaceId: string) => {
        set(state => {
          const newExpanded = new Set(state.expandedWorkspaceIds)
          if (newExpanded.has(workspaceId)) {
            newExpanded.delete(workspaceId)
          } else {
            newExpanded.add(workspaceId)
          }
          return { expandedWorkspaceIds: newExpanded }
        })
      },

      // Import/Export
      exportProject: async (projectId: string, format: 'markdown' | 'json') => {
        const uiStore = useUIStore.getState()
        
        try {
          // TODO: Implement exportProject in Tauri API
          console.warn('exportProject not yet implemented in Tauri API')
          throw new Error('exportProject not yet implemented')
        } catch (error) {
          uiStore.showError('Failed to export project', error instanceof Error ? error.message : 'Unknown error')
          throw error
        }
      },

      importProject: async (workspaceId: string, data: string, format: 'markdown' | 'json') => {
        const uiStore = useUIStore.getState()
        
        try {
          // TODO: Implement importProject in Tauri API
          console.warn('importProject not yet implemented in Tauri API')
          throw new Error('importProject not yet implemented')
        } catch (error) {
          uiStore.showError('Failed to import project', error instanceof Error ? error.message : 'Unknown error')
          throw error
        }
      }
    }),
    {
      name: 'project-store',
      partialize: (state) => ({
        activeWorkspaceId: state.activeWorkspaceId,
        activeProjectId: state.activeProjectId,
        recentProjects: state.recentProjects,
        expandedWorkspaceIds: Array.from(state.expandedWorkspaceIds) // Convert Set to Array for serialization
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.expandedWorkspaceIds) {
          // Convert Array back to Set after rehydration
          state.expandedWorkspaceIds = new Set(state.expandedWorkspaceIds as unknown as string[])
        }
      }
    }
  )
)

export default useProjectStore

```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/stores/uiStore.ts
```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Import other stores for integration (lazy imports to avoid circular dependencies)
import type { useWorkflowStore } from './workflowStore'
import type { useCanvasStore } from './canvasStore'
import type useProjectStore from './projectStore'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  timestamp: Date
}

type ModalType = 
  | 'export' 
  | 'projectSettings' 
  | 'keyboardShortcuts'
  | 'about'
  | 'confirmDelete'
  | null

interface UIStoreState {
  // Theme (for future)
  theme: 'dark' // Only dark for now
  
  // Layout
  sidebarCollapsed: boolean
  sidebarWidth: number
  canvasControlsPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  showMinimap: boolean
  showProgressBar: boolean
  
  // Modals
  activeModal: ModalType | null
  modalProps: Record<string, any>
  
  // Notifications/Toasts
  notifications: Notification[]
  
  // Canvas preferences
  gridEnabled: boolean
  snapToGrid: boolean
  connectionLineType: 'straight' | 'bezier' | 'step'
  
  // Keyboard shortcuts
  shortcutsEnabled: boolean
  customShortcuts: Record<string, string>
  
  // Feature flags
  experimentalFeatures: {
    aiStreaming: boolean
    collaborationMode: boolean
    advancedAnimations: boolean
  }
}

interface UIActions {
  // Layout
  toggleSidebar: () => void
  setSidebarWidth: (width: number) => void
  setCanvasControlsPosition: (position: UIStoreState['canvasControlsPosition']) => void
  toggleMinimap: () => void
  toggleProgressBar: () => void
  
  // Modals
  openModal: (type: ModalType, props?: Record<string, any>) => void
  closeModal: () => void
  
  // Notifications
  showNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  dismissNotification: (id: string) => void
  clearAllNotifications: () => void
  
  // Canvas preferences
  toggleGrid: () => void
  toggleSnapToGrid: () => void
  setConnectionLineType: (type: 'straight' | 'bezier' | 'step') => void
  
  // Keyboard shortcuts
  toggleShortcuts: () => void
  updateShortcut: (action: string, keys: string) => void
  resetShortcuts: () => void
  
  // Feature flags
  toggleFeature: (feature: keyof UIStoreState['experimentalFeatures']) => void
  
  // Helpers
  showSuccess: (title: string, message?: string) => void
  showError: (title: string, message?: string) => void
  showWarning: (title: string, message?: string) => void
  showInfo: (title: string, message?: string) => void
}

type UIStore = UIStoreState & UIActions

const defaultShortcuts: Record<string, string> = {
  'save': 'Cmd+S',
  'undo': 'Cmd+Z',
  'redo': 'Cmd+Shift+Z',
  'copy': 'Cmd+C',
  'paste': 'Cmd+V',
  'delete': 'Delete',
  'selectAll': 'Cmd+A',
  'toggleSidebar': 'Cmd+B',
  'newProject': 'Cmd+N',
  'openProject': 'Cmd+O',
  'exportProject': 'Cmd+E'
}

let notificationTimeouts: Record<string, NodeJS.Timeout> = {}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'dark',
      
      // Layout
      sidebarCollapsed: false,
      sidebarWidth: 280,
      canvasControlsPosition: 'top-left',
      showMinimap: true,
      showProgressBar: true,
      
      // Modals
      activeModal: null,
      modalProps: {},
      
      // Notifications
      notifications: [],
      
      // Canvas preferences
      gridEnabled: true,
      snapToGrid: true,
      connectionLineType: 'bezier',
      
      // Keyboard shortcuts
      shortcutsEnabled: true,
      customShortcuts: { ...defaultShortcuts },
      
      // Feature flags
      experimentalFeatures: {
        aiStreaming: false,
        collaborationMode: false,
        advancedAnimations: true
      },

      // Layout actions
      toggleSidebar: () => set((state) => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),
      
      setSidebarWidth: (width: number) => set({ sidebarWidth: width }),
      
      setCanvasControlsPosition: (position) => set({ 
        canvasControlsPosition: position 
      }),
      
      toggleMinimap: () => set((state) => ({ 
        showMinimap: !state.showMinimap 
      })),
      
      toggleProgressBar: () => set((state) => ({ 
        showProgressBar: !state.showProgressBar 
      })),

      // Modal actions
      openModal: (type: ModalType, props = {}) => set({ 
        activeModal: type, 
        modalProps: props 
      }),
      
      closeModal: () => set({ 
        activeModal: null, 
        modalProps: {} 
      }),

      // Notification actions
      showNotification: (notification) => {
        const id = `notification-${Date.now()}-${Math.random()}`
        const newNotification: Notification = {
          ...notification,
          id,
          timestamp: new Date(),
          duration: notification.duration ?? 5000
        }

        set((state) => ({
          notifications: [...state.notifications, newNotification]
        }))

        // Auto-dismiss after duration
        if (newNotification.duration && newNotification.duration > 0) {
          notificationTimeouts[id] = setTimeout(() => {
            get().dismissNotification(id)
          }, newNotification.duration)
        }
      },
      
      dismissNotification: (id: string) => {
        // Clear timeout if exists
        if (notificationTimeouts[id]) {
          clearTimeout(notificationTimeouts[id])
          delete notificationTimeouts[id]
        }
        
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }))
      },
      
      clearAllNotifications: () => {
        // Clear all timeouts
        Object.values(notificationTimeouts).forEach(timeout => {
          clearTimeout(timeout)
        })
        notificationTimeouts = {}
        
        set({ notifications: [] })
      },

      // Canvas preference actions
      toggleGrid: () => {
        const newGridEnabled = !get().gridEnabled
        set({ gridEnabled: newGridEnabled })
        
        // Notify canvas store of grid preference change
        // Using dynamic import to avoid circular dependency
        import('./canvasStore').then(({ useCanvasStore }) => {
          const canvasStore = useCanvasStore.getState()
          if (canvasStore.markDirty) {
            canvasStore.markDirty() // Trigger canvas re-render with new grid setting
          }
        })
      },
      
      toggleSnapToGrid: () => {
        const newSnapToGrid = !get().snapToGrid
        set({ snapToGrid: newSnapToGrid })
        
        // Notify canvas store of snap preference change
        import('./canvasStore').then(({ useCanvasStore }) => {
          const canvasStore = useCanvasStore.getState()
          if (canvasStore.markDirty) {
            canvasStore.markDirty()
          }
        })
      },
      
      setConnectionLineType: (type) => {
        set({ connectionLineType: type })
        
        // Notify canvas store to update connection line styling
        import('./canvasStore').then(({ useCanvasStore }) => {
          const canvasStore = useCanvasStore.getState()
          if (canvasStore.markDirty) {
            canvasStore.markDirty()
          }
        })
      },

      // Keyboard shortcut actions
      toggleShortcuts: () => set((state) => ({ 
        shortcutsEnabled: !state.shortcutsEnabled 
      })),
      
      updateShortcut: (action: string, keys: string) => set((state) => ({
        customShortcuts: {
          ...state.customShortcuts,
          [action]: keys
        }
      })),
      
      resetShortcuts: () => set({ 
        customShortcuts: { ...defaultShortcuts } 
      }),

      // Feature flag actions
      toggleFeature: (feature) => {
        const currentValue = get().experimentalFeatures[feature]
        const newValue = !currentValue
        
        set((state) => ({
          experimentalFeatures: {
            ...state.experimentalFeatures,
            [feature]: newValue
          }
        }))
        
        // Show notification about feature toggle
        get().showInfo(
          `${feature.replace(/([A-Z])/g, ' $1').toLowerCase()} ${newValue ? 'enabled' : 'disabled'}`
        )
        
        // Handle specific feature toggles
        if (feature === 'advancedAnimations') {
          // Notify canvas store about animation preference change
          import('./canvasStore').then(({ useCanvasStore }) => {
            const canvasStore = useCanvasStore.getState()
            if (canvasStore.markDirty) {
              canvasStore.markDirty()
            }
          })
        }
      },

      // Helper notification methods
      showSuccess: (title: string, message?: string) => {
        get().showNotification({
          type: 'success',
          title,
          message,
          duration: 4000
        })
      },
      
      showError: (title: string, message?: string) => {
        get().showNotification({
          type: 'error',
          title,
          message,
          duration: 8000
        })
      },
      
      showWarning: (title: string, message?: string) => {
        get().showNotification({
          type: 'warning',
          title,
          message,
          duration: 6000
        })
      },
      
      showInfo: (title: string, message?: string) => {
        get().showNotification({
          type: 'info',
          title,
          message,
          duration: 5000
        })
      }
    }),
    {
      name: 'ui-store',
      // Only persist certain fields, not notifications or modal state
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        sidebarWidth: state.sidebarWidth,
        canvasControlsPosition: state.canvasControlsPosition,
        showMinimap: state.showMinimap,
        showProgressBar: state.showProgressBar,
        gridEnabled: state.gridEnabled,
        snapToGrid: state.snapToGrid,
        connectionLineType: state.connectionLineType,
        shortcutsEnabled: state.shortcutsEnabled,
        customShortcuts: state.customShortcuts,
        experimentalFeatures: state.experimentalFeatures
      })
    }
  )
)

// Export types for use in components
export type { Notification, ModalType, UIStoreState, UIActions }

```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/stores/workflowStore.ts
```ts
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { tauriAPI } from '@/services/tauri/api'
import type { WorkflowStep } from '@/types/workflow.types'

// Import other stores for integration
import { useCanvasStore } from './canvasStore'
import { useUIStore } from './uiStore'

// Import or define types (these should match your database schema)
export interface CoreProblem {
  id: string
  project_id: string
  description: string
  is_validated: boolean
  created_at: string
  updated_at: string
}

export interface Persona {
  id: string
  project_id: string
  name: string
  description: string
  demographics: Record<string, any>
  psychographics: Record<string, any>
  goals: string[]
  frustrations: string[]
  batch_id: string
  is_locked: boolean
  created_at: string
  updated_at: string
}

export interface PainPoint {
  id: string
  project_id: string
  persona_id: string
  title: string
  description: string
  severity: number
  frequency: number
  impact: string
  is_locked: boolean
  created_at: string
  updated_at: string
}

export interface Solution {
  id: string
  project_id: string
  title: string
  description: string
  feasibility_score: number
  impact_score: number
  effort_estimate: string
  is_locked: boolean
  created_at: string
  updated_at: string
}

export interface SolutionPainPointMapping {
  id: string
  solution_id: string
  pain_point_id: string
  addresses_directly: boolean
  impact_level: string
  created_at: string
}

export interface UserStory {
  id: string
  project_id: string
  solution_id: string
  persona_id: string
  title: string
  description: string
  acceptance_criteria: string[]
  priority: string
  effort_points: number
  created_at: string
  updated_at: string
}

interface WorkflowState {
  // Current workflow position
  currentStep: WorkflowStep
  projectId: string | null
  
  // Problem data
  coreProblem: CoreProblem | null
  problemInput: string
  isValidating: boolean
  
  // Personas data
  personas: Persona[]
  activePersonaId: string | null
  personaGenerationBatch: string | null
  
  // Pain points data
  painPoints: PainPoint[]
  
  // Solutions data
  solutions: Solution[]
  solutionMappings: SolutionPainPointMapping[]
  selectedSolutionIds: Set<string>
  
  // User stories data
  userStories: UserStory[]
  
  // Lock management
  lockedItems: {
    personas: Set<string>
    painPoints: Set<string>
    solutions: Set<string>
  }
  
  // Loading states
  isGeneratingPersonas: boolean
  isGeneratingPainPoints: boolean
  isGeneratingSolutions: boolean
  isGeneratingUserStories: boolean
}

interface WorkflowActions {
  // Navigation
  setCurrentStep: (step: WorkflowStep) => void
  canProceedToNextStep: () => boolean
  proceedToNextStep: () => void
  goToPreviousStep: () => void
  
  // Problem validation
  setProblemInput: (input: string) => void
  validateProblem: (input: string) => Promise<void>
  
  // Persona management
  generatePersonas: () => Promise<void>
  regeneratePersonas: () => Promise<void>
  selectPersona: (personaId: string) => Promise<void>
  togglePersonaLock: (personaId: string) => void
  
  // Pain point management
  generatePainPoints: () => Promise<void>
  regeneratePainPoints: () => Promise<void>
  togglePainPointLock: (painPointId: string) => void
  
  // Solution management
  generateSolutions: () => Promise<void>
  regenerateSolutions: () => Promise<void>
  toggleSolutionLock: (solutionId: string) => void
  toggleSolutionSelection: (solutionId: string) => void
  
  // User story management
  generateUserStories: () => Promise<void>
  updateUserStory: (storyId: string, updates: Partial<UserStory>) => void
  
  // State persistence
  saveWorkflowState: () => Promise<void>
  loadWorkflowState: (projectId: string) => Promise<void>
  
  // Reset
  resetWorkflow: () => void
  
  // Project management
  setProjectId: (projectId: string) => void
}

const initialState: WorkflowState = {
  currentStep: 'problem_input',
  projectId: null,
  coreProblem: null,
  problemInput: '',
  isValidating: false,
  personas: [],
  activePersonaId: null,
  personaGenerationBatch: null,
  painPoints: [],
  solutions: [],
  solutionMappings: [],
  selectedSolutionIds: new Set(),
  userStories: [],
  lockedItems: {
    personas: new Set(),
    painPoints: new Set(),
    solutions: new Set(),
  },
  isGeneratingPersonas: false,
  isGeneratingPainPoints: false,
  isGeneratingSolutions: false,
  isGeneratingUserStories: false,
}

export const useWorkflowStore = create<WorkflowState & WorkflowActions>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Navigation
    setCurrentStep: (step) => {
      set({ currentStep: step })
      
      // Notify canvas store of step change
      // NOTE: Don't call syncWithWorkflow here - WorkflowCanvas handles the nodes directly
      // const canvasStore = useCanvasStore.getState()
      // canvasStore.syncWithWorkflow(get())
      
      // Apply appropriate layout for the current step
      // NOTE: Don't apply layout here - WorkflowCanvas positions nodes correctly
      // const canvasStore = useCanvasStore.getState()
      // if (step === 'persona_discovery') {
      //   canvasStore.applyLayout('hierarchical')
      // }
    },

    canProceedToNextStep: () => {
      const state = get()
      switch (state.currentStep) {
        case 'problem_input':
          return state.coreProblem?.is_validated === true
        case 'persona_discovery':
          return state.activePersonaId !== null
        case 'pain_points':
          return state.painPoints.length > 0
        case 'solution_generation':
          return state.selectedSolutionIds.size > 0
        case 'user_stories':
          return state.userStories.length > 0
        default:
          return false
      }
    },

    proceedToNextStep: () => {
      const state = get()
      console.log('[workflowStore] proceedToNextStep called, canProceed:', state.canProceedToNextStep())
      console.log('[workflowStore] Current state:', { 
        currentStep: state.currentStep, 
        coreProblem: state.coreProblem,
        isValidated: state.coreProblem?.is_validated 
      })
      if (!state.canProceedToNextStep()) {
        console.log('[workflowStore] Cannot proceed to next step - conditions not met')
        return
      }

      const stepOrder: WorkflowStep[] = [
        'problem_input',
        'persona_discovery',
        'pain_points',
        'solution_generation',
        'user_stories',
        'architecture'
      ]

      const currentIndex = stepOrder.indexOf(state.currentStep)
      console.log('[workflowStore] Current step index:', currentIndex, 'out of', stepOrder.length - 1)
      if (currentIndex < stepOrder.length - 1) {
        const nextStep = stepOrder[currentIndex + 1]
        console.log('[workflowStore] Advancing from', state.currentStep, 'to', nextStep)
        set({ currentStep: nextStep })
        
        // Notify other stores and show progress
        // NOTE: Don't call syncWithWorkflow here - WorkflowCanvas handles the nodes directly
        // const canvasStore = useCanvasStore.getState()
        const uiStore = useUIStore.getState()
        
        // canvasStore.syncWithWorkflow(get())
        try {
          uiStore.showSuccess(`Advanced to ${nextStep.replace('_', ' ')}`)
        } catch (error) {
          console.warn('[workflowStore] UIStore showSuccess failed:', error)
        }
      } else {
        console.log('[workflowStore] Already at final step')
      }
    },

    goToPreviousStep: () => {
      const state = get()
      const stepOrder: WorkflowStep[] = [
        'problem_input',
        'persona_discovery',
        'pain_points',
        'solution_generation',
        'user_stories',
        'architecture'
      ]

      const currentIndex = stepOrder.indexOf(state.currentStep)
      if (currentIndex > 0) {
        const prevStep = stepOrder[currentIndex - 1]
        set({ currentStep: prevStep })
        
        // Notify canvas store
        const canvasStore = useCanvasStore.getState()
        canvasStore.syncWithWorkflow(get())
      }
    },

    // Problem validation
    setProblemInput: (problemText: string) => {
      set({
        coreProblem: {
          id: crypto.randomUUID(),
          project_id: get().projectId || '',
          description: problemText,
          is_validated: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      })
    },

    validateProblem: async (input) => {
      const uiStore = useUIStore.getState()
      
      set({ isValidating: true })
      try {
        // Call Tauri API to validate and analyze problem
        const analysis = await tauriAPI.analyzeProblem(input)
        // TODO: Parse analysis and create CoreProblem object
        const projectId = get().projectId || crypto.randomUUID()
        const coreProblem: CoreProblem = {
          id: crypto.randomUUID(),
          project_id: projectId,
          description: input,
          is_validated: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        
        // Ensure we have a project ID
        if (!get().projectId) {
          set({ projectId })
        }
        
        set({ coreProblem, problemInput: input })
        
        console.log('[workflowStore] Problem validated, coreProblem set:', coreProblem)
        
        // Note: Persona generation is now triggered directly from CoreProblemNode
        // This ensures it happens when the UI validation succeeds, not when this method completes
        console.log('[workflowStore] Problem validation completed - personas will be generated by CoreProblemNode')
        
        // Notify canvas and UI stores
        // NOTE: Don't call syncWithWorkflow here - WorkflowCanvas handles the nodes directly
        // const canvasStore = useCanvasStore.getState()
        // canvasStore.syncWithWorkflow(get())
        try {
          uiStore.showSuccess('Problem validated successfully')
        } catch (error) {
          console.warn('[workflowStore] UIStore showSuccess failed:', error)
        }
        
      } catch (error) {
        console.error('Problem validation failed:', error)
        try {
          uiStore.showError('Problem validation failed', error instanceof Error ? error.message : 'Unknown error')
        } catch (uiError) {
          console.warn('[workflowStore] UIStore showError failed:', uiError)
        }
      } finally {
        set({ isValidating: false })
      }
    },

    // Persona management
    generatePersonas: async () => {
      console.log('[workflowStore] generatePersonas called')
      const state = get()
      console.log('[workflowStore] generatePersonas state check:', {
        hasCoreProblem: !!state.coreProblem,
        coreProblem: state.coreProblem,
        hasProjectId: !!state.projectId,
        projectId: state.projectId
      })
      
      if (!state.coreProblem || !state.projectId) {
        console.log('[workflowStore] generatePersonas early return - missing coreProblem or projectId')
        return
      }

      console.log('[workflowStore] generatePersonas proceeding with generation...')
      const uiStore = useUIStore.getState()
      
      set({ isGeneratingPersonas: true })
              try {
          // Import personas API
          const { problemApi } = await import('@/services/api/problem')
          
          const batchId = crypto.randomUUID()
          
          // Get locked personas for preservation
          const lockedPersonas = state.personas.filter(p => state.lockedItems.personas.has(p.id))
          
          // Call the edge function to generate personas
          console.log('[workflowStore] Calling problemApi.generatePersonas with:', {
            projectId: state.projectId,
            coreProblemId: state.coreProblem.id,
            lockedPersonaIds: lockedPersonas.map(p => p.id)
          })
          const response = await problemApi.generatePersonas(
            state.projectId,
            state.coreProblem.id,
            lockedPersonas.map(p => p.id)
          )
          console.log('[workflowStore] problemApi.generatePersonas response:', response)
          
          // Transform the response to match our Persona interface
          const personas: Persona[] = response.map((persona: any) => ({
            id: persona.id || crypto.randomUUID(),
            project_id: state.projectId!,
            name: persona.name,
            description: persona.description,
            demographics: { 
              industry: persona.industry || 'Unknown',
              role: persona.role || 'Unknown',
              ...persona.demographics 
            },
            psychographics: persona.psychographics || {},
            goals: persona.goals || [],
            frustrations: persona.frustrations || [],
            batch_id: batchId,
            is_locked: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }))
          
          // Combine with locked personas
          const allPersonas = [...lockedPersonas, ...personas]
          
          set({ 
            personas: allPersonas,
            personaGenerationBatch: batchId
          })
        
        console.log('[workflowStore] Personas generated:', allPersonas.length)
        console.log('[workflowStore] Personas data:', allPersonas)
        
        // Notify canvas and UI stores
        // NOTE: Don't call syncWithWorkflow here - WorkflowCanvas handles the nodes directly
        // const canvasStore = useCanvasStore.getState()
        // canvasStore.syncWithWorkflow(get())
        try {
          uiStore.showSuccess(`Generated ${personas.length} new personas`)
        } catch (error) {
          console.warn('[workflowStore] UIStore showSuccess failed:', error)
        }
        
      } catch (error) {
        console.error('Persona generation failed:', error)
        uiStore.showError('Persona generation failed', error instanceof Error ? error.message : 'Unknown error')
      } finally {
        set({ isGeneratingPersonas: false })
      }
    },

    regeneratePersonas: async () => {
      const state = get()
      const unlockedPersonas = state.personas.filter(p => !state.lockedItems.personas.has(p.id))
      const uiStore = useUIStore.getState()
      
      set({ isGeneratingPersonas: true })
      try {
        // TODO: Call Tauri API to regenerate unlocked personas
        // const newPersonas = await tauriAPI.regeneratePersonas(unlockedPersonas.map(p => p.id))
        // Update only unlocked personas
        
        // Notify canvas store
        const canvasStore = useCanvasStore.getState()
        canvasStore.syncWithWorkflow(get())
        uiStore.showSuccess(`Regenerated ${unlockedPersonas.length} personas`)
        
      } catch (error) {
        console.error('Persona regeneration failed:', error)
        uiStore.showError('Persona regeneration failed', error instanceof Error ? error.message : 'Unknown error')
      } finally {
        set({ isGeneratingPersonas: false })
      }
    },

    selectPersona: async (personaId) => {
      set({ activePersonaId: personaId })
      
      // Notify canvas to update visual state
      const canvasStore = useCanvasStore.getState()
      canvasStore.syncWithWorkflow(get())
      canvasStore.selectNode(`persona-${personaId}`)
      
      // Show notification
      const uiStore = useUIStore.getState()
      const persona = get().personas.find(p => p.id === personaId)
      uiStore.showSuccess('Persona selected', persona ? `Selected ${persona.name}` : undefined)
    },

    togglePersonaLock: (personaId) => {
      set((state) => {
        const newLockedPersonas = new Set(state.lockedItems.personas)
        const isLocking = !newLockedPersonas.has(personaId)
        
        if (isLocking) {
          newLockedPersonas.add(personaId)
        } else {
          newLockedPersonas.delete(personaId)
        }
        
        return {
          lockedItems: {
            ...state.lockedItems,
            personas: newLockedPersonas
          }
        }
      })
      
      // Notify canvas and UI stores
      const canvasStore = useCanvasStore.getState()
      const uiStore = useUIStore.getState()
      
      canvasStore.syncWithWorkflow(get())
      
      const persona = get().personas.find(p => p.id === personaId)
      const isLocked = get().lockedItems.personas.has(personaId)
      uiStore.showInfo(
        `Persona ${isLocked ? 'locked' : 'unlocked'}`,
        persona ? persona.name : undefined
      )
    },

    // Pain point management
    generatePainPoints: async () => {
      const state = get()
      if (!state.activePersonaId) return

      const uiStore = useUIStore.getState()
      
      set({ isGeneratingPainPoints: true })
      try {
        // TODO: Call Tauri API to generate pain points
        // const painPoints = await tauriAPI.generatePainPoints(state.activePersonaId)
        set({ painPoints: [] }) // TODO: Set actual pain points from API
        
        // Notify canvas and UI stores
        const canvasStore = useCanvasStore.getState()
        canvasStore.syncWithWorkflow(get())
        uiStore.showSuccess('Pain points generated successfully')
        
      } catch (error) {
        console.error('Pain point generation failed:', error)
        uiStore.showError('Pain point generation failed', error instanceof Error ? error.message : 'Unknown error')
      } finally {
        set({ isGeneratingPainPoints: false })
      }
    },

    regeneratePainPoints: async () => {
      const state = get()
      const unlockedPainPoints = state.painPoints.filter(p => !state.lockedItems.painPoints.has(p.id))
      const uiStore = useUIStore.getState()
      
      set({ isGeneratingPainPoints: true })
      try {
        // TODO: Call Tauri API to regenerate unlocked pain points
        // const newPainPoints = await tauriAPI.regeneratePainPoints(unlockedPainPoints.map(p => p.id))
        
        // Notify canvas store
        const canvasStore = useCanvasStore.getState()
        canvasStore.syncWithWorkflow(get())
        uiStore.showSuccess(`Regenerated ${unlockedPainPoints.length} pain points`)
        
      } catch (error) {
        console.error('Pain point regeneration failed:', error)
        uiStore.showError('Pain point regeneration failed', error instanceof Error ? error.message : 'Unknown error')
      } finally {
        set({ isGeneratingPainPoints: false })
      }
    },

    togglePainPointLock: (painPointId) => {
      set((state) => {
        const newLockedPainPoints = new Set(state.lockedItems.painPoints)
        const isLocking = !newLockedPainPoints.has(painPointId)
        
        if (isLocking) {
          newLockedPainPoints.add(painPointId)
        } else {
          newLockedPainPoints.delete(painPointId)
        }
        
        return {
          lockedItems: {
            ...state.lockedItems,
            painPoints: newLockedPainPoints
          }
        }
      })
      
      // Notify canvas and UI stores
      const canvasStore = useCanvasStore.getState()
      const uiStore = useUIStore.getState()
      
      canvasStore.syncWithWorkflow(get())
      
      const painPoint = get().painPoints.find(p => p.id === painPointId)
      const isLocked = get().lockedItems.painPoints.has(painPointId)
      uiStore.showInfo(
        `Pain point ${isLocked ? 'locked' : 'unlocked'}`,
        painPoint ? painPoint.title : undefined
      )
    },

    // Solution management
    generateSolutions: async () => {
      const state = get()
      if (state.painPoints.length === 0) return

      const uiStore = useUIStore.getState()
      
      set({ isGeneratingSolutions: true })
      try {
        // TODO: Call Tauri API to generate solutions
        // const solutions = await tauriAPI.generateSolutions(state.painPoints.map(p => p.id))
        set({ solutions: [], solutionMappings: [] }) // TODO: Set actual data from API
        
        // Notify canvas and UI stores
        const canvasStore = useCanvasStore.getState()
        canvasStore.syncWithWorkflow(get())
        uiStore.showSuccess('Solutions generated successfully')
        
      } catch (error) {
        console.error('Solution generation failed:', error)
        uiStore.showError('Solution generation failed', error instanceof Error ? error.message : 'Unknown error')
      } finally {
        set({ isGeneratingSolutions: false })
      }
    },

    regenerateSolutions: async () => {
      const state = get()
      const unlockedSolutions = state.solutions.filter(s => !state.lockedItems.solutions.has(s.id))
      const uiStore = useUIStore.getState()
      
      set({ isGeneratingSolutions: true })
      try {
        // TODO: Call Tauri API to regenerate unlocked solutions
        // const newSolutions = await tauriAPI.regenerateSolutions(unlockedSolutions.map(s => s.id))
        
        // Notify canvas store
        const canvasStore = useCanvasStore.getState()
        canvasStore.syncWithWorkflow(get())
        uiStore.showSuccess(`Regenerated ${unlockedSolutions.length} solutions`)
        
      } catch (error) {
        console.error('Solution regeneration failed:', error)
        uiStore.showError('Solution regeneration failed', error instanceof Error ? error.message : 'Unknown error')
      } finally {
        set({ isGeneratingSolutions: false })
      }
    },

    toggleSolutionLock: (solutionId) => {
      set((state) => {
        const newLockedSolutions = new Set(state.lockedItems.solutions)
        const isLocking = !newLockedSolutions.has(solutionId)
        
        if (isLocking) {
          newLockedSolutions.add(solutionId)
        } else {
          newLockedSolutions.delete(solutionId)
        }
        
        return {
          lockedItems: {
            ...state.lockedItems,
            solutions: newLockedSolutions
          }
        }
      })
      
      // Notify canvas and UI stores
      const canvasStore = useCanvasStore.getState()
      const uiStore = useUIStore.getState()
      
      canvasStore.syncWithWorkflow(get())
      
      const solution = get().solutions.find(s => s.id === solutionId)
      const isLocked = get().lockedItems.solutions.has(solutionId)
      uiStore.showInfo(
        `Solution ${isLocked ? 'locked' : 'unlocked'}`,
        solution ? solution.title : undefined
      )
    },

    toggleSolutionSelection: (solutionId) => {
      set((state) => {
        const newSelectedSolutions = new Set(state.selectedSolutionIds)
        const isSelecting = !newSelectedSolutions.has(solutionId)
        
        if (isSelecting) {
          newSelectedSolutions.add(solutionId)
        } else {
          newSelectedSolutions.delete(solutionId)
        }
        
        return { selectedSolutionIds: newSelectedSolutions }
      })
      
      // Notify canvas and UI stores
      const canvasStore = useCanvasStore.getState()
      const uiStore = useUIStore.getState()
      
      canvasStore.syncWithWorkflow(get())
      canvasStore.selectNode(`solution-${solutionId}`)
      
      const solution = get().solutions.find(s => s.id === solutionId)
      const isSelected = get().selectedSolutionIds.has(solutionId)
      uiStore.showInfo(
        `Solution ${isSelected ? 'selected' : 'deselected'}`,
        solution ? solution.title : undefined
      )
    },

    // User story management
    generateUserStories: async () => {
      const state = get()
      if (state.selectedSolutionIds.size === 0) return

      const uiStore = useUIStore.getState()
      
      set({ isGeneratingUserStories: true })
      try {
        // TODO: Call Tauri API to generate user stories
        // const userStories = await tauriAPI.generateUserStories(Array.from(state.selectedSolutionIds))
        set({ userStories: [] }) // TODO: Set actual user stories from API
        
        // Notify canvas and UI stores
        const canvasStore = useCanvasStore.getState()
        canvasStore.syncWithWorkflow(get())
        uiStore.showSuccess('User stories generated successfully')
        
      } catch (error) {
        console.error('User story generation failed:', error)
        uiStore.showError('User story generation failed', error instanceof Error ? error.message : 'Unknown error')
      } finally {
        set({ isGeneratingUserStories: false })
      }
    },

    updateUserStory: (storyId, updates) => {
      set((state) => ({
        userStories: state.userStories.map(story =>
          story.id === storyId ? { ...story, ...updates } : story
        )
      }))
      
      // Notify canvas store
      const canvasStore = useCanvasStore.getState()
      canvasStore.syncWithWorkflow(get())
    },

    // State persistence
    saveWorkflowState: async () => {
      const state = get()
      if (!state.projectId) return

      const uiStore = useUIStore.getState()
      
      try {
        // TODO: Call Tauri API to save workflow state
        // await tauriAPI.saveWorkflowState(state.projectId, state)
        uiStore.showSuccess('Workflow saved')
      } catch (error) {
        console.error('Failed to save workflow state:', error)
        uiStore.showError('Failed to save workflow', error instanceof Error ? error.message : 'Unknown error')
      }
    },

    loadWorkflowState: async (projectId) => {
      const uiStore = useUIStore.getState()
      
      try {
        // TODO: Call Tauri API to load workflow state
        // const workflowState = await tauriAPI.loadWorkflowState(projectId)
        set({ projectId })
        
        // Notify canvas store
        const canvasStore = useCanvasStore.getState()
        canvasStore.syncWithWorkflow(get())
        
        uiStore.showSuccess('Workflow loaded')
      } catch (error) {
        console.error('Failed to load workflow state:', error)
        uiStore.showError('Failed to load workflow', error instanceof Error ? error.message : 'Unknown error')
      }
    },

    // Reset
    resetWorkflow: () => {
      set({
        ...initialState,
        projectId: get().projectId, // Keep project ID
      })
      
      // Notify canvas store
      const canvasStore = useCanvasStore.getState()
      canvasStore.resetCanvas()
    },
    
    // Project management
    setProjectId: (projectId: string) => {
      console.log('[workflowStore] Setting project ID:', projectId)
      set({ projectId })
    },
  }))
)

// Subscribe to state changes for side effects
useWorkflowStore.subscribe(
  (state) => state.currentStep,
  (currentStep, previousStep) => {
    console.log(`Workflow step changed: ${previousStep} -> ${currentStep}`)
    // TODO: Notify canvas store of step change
    // TODO: Auto-save state on step change
  }
)

useWorkflowStore.subscribe(
  (state) => state.activePersonaId,
  (activePersonaId) => {
    if (activePersonaId) {
      console.log(`Active persona changed: ${activePersonaId}`)
      // TODO: Update canvas visualization
    }
  }
)

```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/types/database.types.ts
```ts
// Types that match both SQLite and Supabase schemas
export interface User {
    id: string
    email: string
    created_at: string
    updated_at: string
  }
  
  export interface Workspace {
    id: string
    user_id: string
    name: string
    folder_path: string | null
    is_active: boolean
    created_at: string
    updated_at: string
  }
  
  export interface Project {
    id: string
    workspace_id: string
    name: string
    status: string
    current_step: string
    langgraph_state: Record<string, any> | null
    created_at: string
    updated_at: string
  }
  
  export interface CanvasState {
    id: string
    project_id: string
    nodes: any[]
    edges: any[]
    viewport: any | null
    created_at: string
    updated_at: string
  }

  export interface Persona {
    id: string
    project_id: string
    name: string
    description: string
    demographics: Record<string, any> | null
    behaviors: Record<string, any> | null
    goals: string[]
    frustrations: string[]
    is_selected: boolean
    created_at: string
    updated_at: string
  }

  export interface PainPoint {
    id: string
    project_id: string
    persona_id: string | null
    title: string
    description: string
    severity: 'low' | 'medium' | 'high'
    frequency: 'rare' | 'occasional' | 'frequent' | 'constant'
    category: string | null
    is_selected: boolean
    created_at: string
    updated_at: string
  }

  export interface Solution {
    id: string
    project_id: string
    title: string
    description: string
    category: string | null
    feasibility_score: number | null
    business_value: number | null
    implementation_complexity: 'low' | 'medium' | 'high' | null
    estimated_effort: string | null
    is_locked: boolean
    generation_batch: string | null
    created_at: string
    updated_at: string
  }

  export interface SolutionPainPointMapping {
    id: string
    solution_id: string
    pain_point_id: string
    relevance_score: number
    created_at: string
    updated_at: string
  }
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/types/index.ts
```ts
export * from './database.types';
export * from './workflow.types';
export * from './export.types';
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/types/workflow.types.ts
```ts
export type WorkflowStep = 
  | 'problem_input'
  | 'persona_discovery'
  | 'pain_points'
  | 'solution_generation'
  | 'user_stories'
  | 'architecture'
  | 'export';

export interface ValidationResult {
  isValid: boolean;
  validatedProblem?: string;
  feedback?: string;
  coreProblemId?: string;
}

export interface CoreProblem {
  id: string;
  projectId: string;
  originalInput: string;
  validatedProblem?: string;
  isValid: boolean;
  validationFeedback?: string;
  version: number;
  createdAt: string;
}

export interface Persona {
  id: string;
  coreProblemId: string;
  name: string;
  industry: string;
  role: string;
  painDegree: number;
  position: number;
  isLocked: boolean;
  isActive: boolean;
  generationBatch?: string;
  createdAt: string;
}

export interface PainPoint {
  id: string;
  personaId: string;
  description: string;
  severity?: string;
  impactArea?: string;
  position: number;
  isLocked: boolean;
  generationBatch?: string;
  createdAt: string;
}

export interface Solution {
  id: string;
  projectId: string;
  personaId: string;
  title: string;
  description: string;
  solutionType?: string;
  complexity?: string;
  position: number;
  isLocked: boolean;
  isSelected: boolean;
  generationBatch?: string;
  createdAt: string;
}

export interface SolutionPainPointMapping {
  id: string;
  solutionId: string;
  painPointId: string;
  relevanceScore: number;
}

export interface UserStory {
  id: string;
  projectId: string;
  title: string;
  asA: string;
  iWant: string;
  soThat: string;
  acceptanceCriteria: string[];
  priority?: string;
  complexityPoints?: number;
  position: number;
  isEdited: boolean;
  originalContent?: string;
  editedContent?: string;
  createdAt: string;
}
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/utils/animations.ts
```ts
import { Node, Edge } from '@xyflow/react';

export async function animateCanvasTransition(
  currentNodes: Node[],
  newNodes: Node[],
  setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void,
  setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void,
  newEdges: Edge[]
) {
  // Simple implementation for now
  setNodes(newNodes);
  
  // Add edges after a short delay
  setTimeout(() => {
    setEdges(newEdges);
  }, 300);
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/utils/cn.ts
```ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with proper precedence
 * Uses clsx for conditional classes and tailwind-merge to handle conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/utils/index.ts
```ts

```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/App.css
```css
.logo.vite:hover {
  filter: drop-shadow(0 0 2em #747bff);
}

.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafb);
}
:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;

  color: #0f0f0f;
  background-color: #f6f6f6;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

.container {
  margin: 0;
  padding-top: 10vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: 0.75s;
}

.logo.tauri:hover {
  filter: drop-shadow(0 0 2em #24c8db);
}

.row {
  display: flex;
  justify-content: center;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}

a:hover {
  color: #535bf2;
}

h1 {
  text-align: center;
}

input,
button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  color: #0f0f0f;
  background-color: #ffffff;
  transition: border-color 0.25s;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
}

button {
  cursor: pointer;
}

button:hover {
  border-color: #396cd8;
}
button:active {
  border-color: #396cd8;
  background-color: #e8e8e8;
}

input,
button {
  outline: none;
}

#greet-input {
  margin-right: 5px;
}

@media (prefers-color-scheme: dark) {
  :root {
    color: #f6f6f6;
    background-color: #2f2f2f;
  }

  a:hover {
    color: #24c8db;
  }

  input,
  button {
    color: #ffffff;
    background-color: #0f0f0f98;
  }
  button:active {
    background-color: #0f0f0f69;
  }
}

```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/App.tsx
```tsx
import React, { useEffect, useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { ConnectedSidebar } from '@/components/layout/Sidebar/ConnectedSidebar';
import { ConnectedProgressBar } from '@/components/layout/ProgressBar/ConnectedProgressBar';
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas';
import { AuthForm } from '@/components/auth/AuthForm';
import { AuthDebug } from '@/components/debug/AuthDebug';
import { useWorkflowStore } from '@/stores/workflowStore';
import { useUIStore } from '@/stores/uiStore';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/services/supabase/client';
import './App.css';

function App() {
  const { user, loading: authLoading } = useAuth();
  const { resetWorkflow, setProjectId } = useWorkflowStore();
  const [isInitializing, setIsInitializing] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initializeWorkspace = async () => {
      if (!user) return;
      
      try {
        setIsInitializing(true);
        console.log('[App] Starting workspace initialization for user:', user.id);
        
        // Create or get user record in our custom users table
        console.log('[App] Creating/getting user record...');
        let { data: existingUser, error: userCheckError } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single();
        
        if (userCheckError && userCheckError.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('[App] Error checking user:', userCheckError);
          throw new Error('Failed to check user record');
        }
        
        if (!existingUser) {
          console.log('[App] User record not found, creating new user record');
          // Create new user record
          const { data: newUser, error: createUserError } = await supabase
            .from('users')
            .insert({
              id: user.id,
              email: user.email!
            })
            .select()
            .single();
          
          if (createUserError) {
            console.error('[App] Failed to create user record:', createUserError);
            throw new Error('Failed to create user record');
          }
          
          console.log('[App] Created new user record:', newUser.id);
        } else {
          console.log('[App] Using existing user record:', existingUser.id);
        }
        
        // Create or get workspace
        console.log('[App] Creating/getting workspace...');
        let { data: existingWorkspace, error: wsCheckError } = await supabase
          .from('workspaces')
          .select('id')
          .eq('user_id', user.id)
          .eq('name', 'Default Workspace')
          .single();
        
        let workspaceId: string;
        
        if (wsCheckError && wsCheckError.code !== 'PGRST116') {
          console.error('[App] Error checking workspace:', wsCheckError);
          throw new Error('Failed to check workspace');
        }
        
        if (!existingWorkspace) {
          console.log('[App] Workspace not found, creating new workspace');
          // Create new workspace
          const { data: newWorkspace, error: createWsError } = await supabase
            .from('workspaces')
            .insert({
              user_id: user.id,
              name: 'Default Workspace',
              is_active: true
            })
            .select()
            .single();
          
          if (createWsError) {
            console.error('[App] Failed to create workspace:', createWsError);
            throw new Error('Failed to create workspace');
          }
          
          workspaceId = newWorkspace.id;
          console.log('[App] Created new workspace:', workspaceId);
        } else {
          workspaceId = existingWorkspace.id;
          console.log('[App] Using existing workspace:', workspaceId);
        }
        
        // Create a new project for this session
        const projectId = crypto.randomUUID();
        console.log('[App] Creating new project:', projectId);
        
        const { data: newProject, error: createProjectError } = await supabase
          .from('projects')
          .insert({
            id: projectId,
            workspace_id: workspaceId,
            name: `Project ${new Date().toLocaleDateString()}`,
            status: 'problem_input',
            current_step: 'problem_input'
          })
          .select()
          .single();
        
        if (createProjectError) {
          console.error('[App] Failed to create project:', createProjectError);
          throw new Error('Failed to create project');
        }
        
        console.log('[App] Created project:', newProject);
        
        // Set the project ID in the workflow store
        setProjectId(projectId);
        console.log('[App] Workspace initialization complete');
        
      } catch (error) {
        console.error('[App] Workspace initialization error:', error);
        setInitError(error instanceof Error ? error.message : 'Failed to initialize workspace');
      } finally {
        setIsInitializing(false);
      }
    };
    
    // Reset workflow when user changes
    if (user) {
      resetWorkflow();
      initializeWorkspace();
    }
  }, [user, resetWorkflow, setProjectId]);

  // Show auth loading state
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth form if not authenticated
  if (!user) {
    return <AuthForm />;
  }

  // Show workspace initialization loading
  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Initializing workspace...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (initError) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {initError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <div className="flex h-screen bg-gray-900">
        {/* Sidebar */}
        <ConnectedSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Progress Bar */}
          <ConnectedProgressBar />

          {/* Canvas */}
          <div className="flex-1 relative">
            <WorkflowCanvas />
          </div>
        </div>
        
        {/* Debug component for development */}
        <AuthDebug />
      </div>
    </ReactFlowProvider>
  );
}

export default App;
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/index.css
```css
@import "tailwindcss";
@import "./components/ExportModal/ExportModal.css";

/* Design Tokens as CSS Variables */
:root {
  /* Colors - Direct values for dark theme */
  --color-background: #111827; /* gray-900 */
  --color-surface: #1f2937; /* gray-800 */
  --color-surface-hover: #374151; /* gray-700 */
  --color-border: #374151; /* gray-700 */
  --color-text-primary: #ffffff; /* white */
  --color-text-secondary: #9ca3af; /* gray-400 */
  
  /* Accent colors (Gold) */
  --color-accent-500: #F59E0B; /* Main Accent Gold */
  --color-accent-600: #D97706;
  --color-accent-700: #B45309;
  
  /* Node colors */
  --color-node-problem: #6B7280;
  --color-node-persona: #14B8A6;
  --color-node-pain: #F97316;
  --color-node-solution: #3B82F6;
  
  /* Spacing */
  --space-xs: 0.25rem; /* 1 */
  --space-sm: 0.5rem; /* 2 */
  --space-md: 1rem; /* 4 */
  --space-lg: 1.5rem; /* 6 */
  --space-xl: 2rem; /* 8 */
  
  /* Border Radius */
  --radius-sm: 0.125rem;
  --radius-base: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  
  /* Transitions */
  --duration-fast: 150ms;
  --duration-base: 300ms;
  --duration-slow: 500ms;
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  background-color: var(--color-background);
  color: var(--color-text-primary);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  min-height: 100vh;
}

/* Utility classes for Tailwind v4 */
@layer base {
  /* Colors */
  .bg-gray-900 { background-color: #111827; }
  .bg-gray-800 { background-color: #1f2937; }
  .bg-gray-700 { background-color: #374151; }
  .bg-gray-600 { background-color: #4b5563; }
  .bg-gray-500 { background-color: #6b7280; }
  
  .text-white { color: #ffffff; }
  .text-gray-200 { color: #e5e7eb; }
  .text-gray-300 { color: #d1d5db; }
  .text-gray-400 { color: #9ca3af; }
  .text-gray-500 { color: #6b7280; }
  
  .border-gray-700 { border-color: #374151; }
  .border-gray-600 { border-color: #4b5563; }
  
  /* Layout */
  .flex { display: flex; }
  .flex-1 { flex: 1 1 0%; }
  .flex-col { flex-direction: column; }
  .flex-shrink-0 { flex-shrink: 0; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .gap-2 { gap: 0.5rem; }
  .gap-3 { gap: 0.75rem; }
  
  /* Spacing */
  .p-2 { padding: 0.5rem; }
  .p-3 { padding: 0.75rem; }
  .p-4 { padding: 1rem; }
  .p-6 { padding: 1.5rem; }
  .p-8 { padding: 2rem; }
  .px-4 { padding-left: 1rem; padding-right: 1rem; }
  .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
  .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
  .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
  .mt-2 { margin-top: 0.5rem; }
  .mt-4 { margin-top: 1rem; }
  .mb-6 { margin-bottom: 1.5rem; }
  .ml-4 { margin-left: 1rem; }
  .space-y-1 > * + * { margin-top: 0.25rem; }
  .space-y-2 > * + * { margin-top: 0.5rem; }
  
  /* Sizing */
  .h-screen { height: 100vh; }
  .h-20 { height: 5rem; }
  .h-32 { height: 8rem; }
  .w-full { width: 100%; }
  .w-80 { width: 20rem; }
  .min-h-screen { min-height: 100vh; }
  .max-w-2xl { max-width: 42rem; }
  
  /* Position */
  .relative { position: relative; }
  .absolute { position: absolute; }
  .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
  .top-0 { top: 0; }
  .left-0 { left: 0; }
  .top-4 { top: 1rem; }
  .right-4 { right: 1rem; }
  
  /* Display */
  .hidden { display: none; }
  .overflow-hidden { overflow: hidden; }
  .overflow-y-auto { overflow-y: auto; }
  
  /* Typography */
  .text-xs { font-size: 0.75rem; line-height: 1rem; }
  .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
  .text-base { font-size: 1rem; line-height: 1.5rem; }
  .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
  .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
  .text-2xl { font-size: 1.5rem; line-height: 2rem; }
  .font-medium { font-weight: 500; }
  .font-semibold { font-weight: 600; }
  .font-mono { font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace; }
  .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  
  /* Borders */
  .border { border-width: 1px; }
  .border-2 { border-width: 2px; }
  .border-4 { border-width: 4px; }
  .border-b { border-bottom-width: 1px; }
  .border-t { border-top-width: 1px; }
  .border-r { border-right-width: 1px; }
  .rounded { border-radius: 0.25rem; }
  .rounded-md { border-radius: 0.375rem; }
  .rounded-lg { border-radius: 0.5rem; }
  .rounded-xl { border-radius: 0.75rem; }
  .rounded-full { border-radius: 9999px; }
  
  /* Effects */
  .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
  .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
  .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
  .opacity-50 { opacity: 0.5; }
  
  /* Z-index */
  .z-10 { z-index: 10; }
  .z-20 { z-index: 20; }
  .z-30 { z-index: 30; }
  .z-50 { z-index: 50; }
  
  /* Cursor */
  .cursor-not-allowed { cursor: not-allowed; }
  .cursor-pointer { cursor: pointer; }
  .pointer-events-none { pointer-events: none; }
  .pointer-events-auto { pointer-events: auto; }
  
  /* Transitions */
  .transition-all { transition-property: all; }
  .transition-colors { transition-property: background-color, border-color, color, fill, stroke; }
  .duration-150 { transition-duration: 150ms; }
  .duration-200 { transition-duration: 200ms; }
  .duration-300 { transition-duration: 300ms; }
  .duration-fast { transition-duration: var(--duration-fast); }
  
  /* Custom colors */
  .bg-red-600 { background-color: #dc2626; }
  .bg-red-900\/30 { background-color: rgb(127 29 29 / 0.3); }
  .bg-blue-400 { background-color: #60a5fa; }
  .bg-blue-500 { background-color: #3b82f6; }
  .bg-blue-600 { background-color: #2563eb; }
  .bg-blue-700 { background-color: #1d4ed8; }
  .bg-green-500 { background-color: #10b981; }
  .bg-yellow-500 { background-color: #f59e0b; }
  .bg-accent-500 { background-color: var(--color-accent-500); }
  .bg-accent-600 { background-color: var(--color-accent-600); }
  .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }
  .from-gray-800 { --tw-gradient-from: #1f2937; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
  .to-gray-900 { --tw-gradient-to: #111827; }
  
  .text-red-400 { color: #f87171; }
  .text-blue-400 { color: #60a5fa; }
  .text-accent-500 { color: var(--color-accent-500); }
  .text-accent-600 { color: var(--color-accent-600); }
  
  .border-red-500 { border-color: #ef4444; }
  .border-red-700 { border-color: #b91c1c; }
  .border-green-500 { border-color: #10b981; }
  .border-blue-500 { border-color: #3b82f6; }
  .border-yellow-500 { border-color: #f59e0b; }
  .border-accent-500 { border-color: var(--color-accent-500); }
  .border-accent-600 { border-color: var(--color-accent-600); }
  
  /* Focus states */
  .focus\:border-blue-500:focus { border-color: #3b82f6; }
  .focus\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
  
  /* Hover states */
  .hover\:bg-gray-700:hover { background-color: #374151; }
  .hover\:bg-blue-700:hover { background-color: #1d4ed8; }
  .hover\:text-white:hover { color: #ffffff; }
  
  /* Disabled states */
  .disabled\:opacity-50:disabled { opacity: 0.5; }
  .disabled\:cursor-not-allowed:disabled { cursor: not-allowed; }
  
  /* Animations */
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  /* Gold flash animation for validation success */
  .animate-gold-flash {
    animation: goldFlash 0.8s ease-out;
  }
  
  @keyframes goldFlash {
    0% { box-shadow: 0 0 0 0 var(--color-accent-500); }
    25% { box-shadow: 0 0 20px 10px rgba(245, 158, 11, 0.4); }
    50% { box-shadow: 0 0 30px 15px rgba(245, 158, 11, 0.6); }
    75% { box-shadow: 0 0 20px 10px rgba(245, 158, 11, 0.4); }
    100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
  }
}

/* Component styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.2s;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* React Flow overrides */
.react-flow__renderer {
  background-color: var(--color-background) !important;
}

.react-flow__background {
  background-color: var(--color-background) !important;
}

.react-flow__node {
  background: transparent;
  border: 0;
}

.react-flow__handle {
  width: 12px;
  height: 12px;
  background: #4b5563;
  border: 2px solid #111827;
}

.react-flow__edge-path {
  stroke: #4b5563;
  stroke-width: 2;
}

/* Gradients for nodes */
.gradient-problem {
  background: linear-gradient(135deg, var(--color-gray-800), var(--color-gray-700));
  border: 1px solid var(--color-gray-600);
}

/* Skeleton shimmer animation */
.skeleton {
  animation: skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Enhanced shimmer animation for pain point skeletons */
.skeleton-shimmer {
  position: relative;
  overflow: hidden;
  background: linear-gradient(90deg, 
    rgba(75, 85, 99, 0.5) 0%, 
    rgba(107, 114, 128, 0.7) 50%, 
    rgba(75, 85, 99, 0.5) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.gradient-persona {
  background: linear-gradient(135deg, var(--color-gray-800), var(--color-gray-700));
  border: 1px solid var(--color-gray-600);
}

.gradient-pain {
  background: linear-gradient(135deg, #f97316, #ea580c);
}

.gradient-solution {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

/* Canvas node base styles */
.canvas-node {
  position: relative;
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.canvas-node:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Scrollbar styles */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1f2937;
}

::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Sidebar Component Styles - Following Design System */

/* Typography from Design System */
.heading-3 {
  font-size: 1.25rem; /* text-xl */
  font-weight: 600;
  line-height: 1.5;
  color: white;
}

.body-sm {
  font-size: 0.875rem; /* text-sm */
  font-weight: 400;
  line-height: 1.5;
  color: #9CA3AF; /* gray-400 */
}

/* Icons from Design System */
.icon {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

.icon-sm { 
  width: 14px; 
  height: 14px; 
}

/* Buttons from Design System */
.btn-icon {
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1F2937; /* gray-800 */
  color: #9CA3AF; /* gray-400 */
  border-radius: 0.5rem; /* radius-lg */
  border: 1px solid #374151; /* gray-700 */
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.btn-icon:hover {
  background: #374151; /* gray-700 */
  color: white;
  border-color: #4B5563; /* gray-600 */
}

.btn-icon--small {
  width: 32px;
  height: 32px;
}

/* Sidebar Structure from Design System (O2) */
.sidebar {
  width: 256px;
  height: 100vh;
  background: #1F2937; /* gray-800 */
  border-right: 1px solid #374151; /* gray-700 */
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  height: 64px;
  padding: 1rem;
  border-bottom: 1px solid #374151; /* gray-700 */
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #374151; /* gray-700 */
}

.sidebar-item {
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem; /* radius-md */
  color: #D1D5DB; /* gray-300 */
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 0.875rem;
}

.sidebar-item:hover {
  background: #374151; /* gray-700 */
  color: white;
}

.sidebar-item--active {
  background: #374151; /* gray-700 */
  color: white;
}

.sidebar-item--workspace {
  padding: 0.75rem;
  margin-bottom: 0.25rem;
}

/* Workspace Specific Styles */
.workspace-item {
  margin-bottom: 0.5rem;
}

.workspace-chevron {
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.workspace-chevron--expanded {
  transform: rotate(90deg);
}

.workspace-content {
  flex: 1;
  min-width: 0;
}

.workspace-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: inherit;
  margin: 0;
  line-height: 1.25;
}

.workspace-description {
  margin-top: 0.125rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.workspace-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #6B7280; /* gray-500 */
}

.workspace-meta-item {
  color: inherit;
}

.workspace-meta-separator {
  color: #4B5563; /* gray-600 */
}

/* Project List Styles */
.project-list {
  margin-left: 1.5rem;
  margin-top: 0.25rem;
  padding-left: 0.75rem;
  border-left: 1px solid #374151; /* gray-700 */
}

.project-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  margin-bottom: 0.125rem;
  border-radius: 0.375rem; /* radius-md */
  color: #9CA3AF; /* gray-400 */
  background: transparent;
  border: none;
  font-size: 0.875rem;
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  text-align: left;
}

.project-item:hover {
  background: rgba(55, 65, 81, 0.5); /* gray-700/50 */
  color: white;
}

.project-item--active {
  background: #374151; /* gray-700 */
  color: white;
}

.project-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Status Dots */
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  flex-shrink: 0;
}

.status-dot--draft {
  background-color: #6B7280; /* gray-500 */
}

.status-dot--progress {
  background-color: #F59E0B; /* yellow-500 */
}

.status-dot--completed {
  background-color: #10B981; /* green-500 */
}

/* Version Timeline Controls */
.timeline-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) var(--space-md);
  border-bottom: 1px solid var(--color-border);
  height: 40px;
}

.timeline-controls-left,
.timeline-controls-right {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.timeline-controls-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.timeline-controls-separator {
  width: 1px;
  height: 20px;
  background: var(--color-border);
  margin: 0 var(--space-sm);
}

/* Timeline Filters */
.timeline-filters {
  display: flex;
  gap: var(--space-sm);
  align-items: center;
  margin-left: var(--space-sm);
}

.timeline-filter {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  background: var(--color-gray-800);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-default);
  opacity: 0.6;
}

.timeline-filter--active {
  opacity: 1;
  background: var(--color-gray-700);
}

.timeline-filter-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
}

.timeline-filter-label {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.timeline-filter input[type="checkbox"] {
  display: none;
}

/* Preview Mode Indicator */
.preview-mode-indicator {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) var(--space-md);
  background: var(--color-accent-600);
  color: white;
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.preview-exit-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: var(--space-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-base);
  transition: background var(--duration-fast) var(--ease-default);
}

.preview-exit-btn:hover {
  background: rgba(0, 0, 0, 0.2);
}

/* Event Preview Tooltip */
.event-preview {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: var(--space-sm);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  box-shadow: var(--shadow-xl);
  min-width: 200px;
  max-width: 300px;
  z-index: 50;
}

.event-preview--below {
  bottom: auto;
  top: 100%;
  margin-bottom: 0;
  margin-top: var(--space-sm);
}

.event-preview-content h4 {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-xs) 0;
}

.event-preview-content p {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  margin: 0;
}

.event-preview-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-sm);
  padding-top: var(--space-sm);
  border-top: 1px solid var(--color-border);
  font-size: var(--text-xs);
  color: var(--color-gray-500);
}

.preview-changes,
.preview-count,
.preview-state {
  display: inline-block;
  padding: var(--space-xs) var(--space-sm);
  background: var(--color-gray-800);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  margin-top: var(--space-xs);
}

/* Event Batch Indicator */
.timeline-event-batch {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--color-primary-600);
  color: white;
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  padding: 2px 6px;
  border-radius: var(--radius-full);
  min-width: 20px;
  text-align: center;
}

/* Version Diff Styles */
.version-diff-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 50;
  display: flex;
  justify-content: flex-end;
}

.version-diff-panel {
  width: 600px;
  height: 100vh;
  background: var(--color-surface);
  border-left: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.3);
}

.version-diff-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
}

.version-diff-title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.version-diff-title h3 {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.version-diff-info {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  background: var(--color-gray-800);
  border-bottom: 1px solid var(--color-border);
}

.version-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.version-label {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.version-time {
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  font-weight: var(--font-medium);
}

.version-description {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.version-diff-tabs {
  display: flex;
  padding: 0 var(--space-lg);
  border-bottom: 1px solid var(--color-border);
}

.version-diff-tab {
  padding: var(--space-md) var(--space-lg);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-default);
}

.version-diff-tab:hover {
  color: var(--color-text-primary);
}

.version-diff-tab--active {
  color: var(--color-primary-500);
  border-bottom-color: var(--color-primary-500);
}

.version-diff-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-lg);
}

/* Diff Viewer */
.diff-viewer {
  min-height: 100%;
}

.diff-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}

.diff-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.diff-item {
  background: var(--color-gray-800);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  border: 1px solid transparent;
  transition: all var(--duration-fast) var(--ease-default);
}

.diff-item--added {
  border-color: var(--color-success-500);
}

.diff-item--removed {
  border-color: var(--color-error-500);
}

.diff-item--modified {
  border-color: var(--color-primary-500);
}

.diff-item-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.diff-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.diff-icon--added {
  color: var(--color-success-500);
}

.diff-icon--removed {
  color: var(--color-error-500);
}

.diff-icon--modified {
  color: var(--color-primary-500);
}

.diff-item-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
  flex: 1;
}

.diff-item-details {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.diff-item-changes {
  margin-top: var(--space-sm);
  padding-left: calc(16px + var(--space-sm));
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.diff-change {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
  padding: var(--space-xs) var(--space-sm);
  background: var(--color-gray-900);
  border-radius: var(--radius-base);
}

/* Enhanced Sidebar Styles */

/* Project Card */
.project-card {
  position: relative;
  padding: 1rem;
  background: rgba(31, 41, 55, 0.5); /* gray-800/50 */
  border: 1px solid #374151; /* gray-700 */
  border-radius: 0.5rem;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.project-card:hover {
  border-color: #4B5563; /* gray-600 */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.project-card:active {
  transform: translateY(0);
}

/* Line clamp utility */
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

/* Keyboard shortcuts */
kbd {
  display: inline-block;
  padding: 0.125rem 0.375rem;
  font-size: 0.75rem;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
  background: #374151; /* gray-700 */
  border: 1px solid #4B5563; /* gray-600 */
  border-radius: 0.25rem;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2), inset 0 0 0 2px #1F2937;
}

/* Sidebar scroll behavior */
.sidebar-content {
  scrollbar-width: thin;
  scrollbar-color: #4B5563 #1F2937;
}

.sidebar-content::-webkit-scrollbar {
  width: 6px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: #1F2937;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: #4B5563;
  border-radius: 3px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
  background: #6B7280;
}

/* Drag and drop styles */
.project-card.dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.project-card.drag-over {
  border-color: #3B82F6; /* blue-500 */
  background: rgba(59, 130, 246, 0.1);
}

/* Context menu */
.context-menu {
  animation: contextMenuFadeIn 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes contextMenuFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Multi-select styles */
.project-card.selected {
  background: rgba(59, 130, 246, 0.1);
  border-color: #3B82F6;
}

.project-card.focused {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}

/* Quick actions hover effects */
.quick-action-button {
  position: relative;
  overflow: hidden;
}

.quick-action-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.quick-action-button:hover::before {
  width: 300px;
  height: 300px;
}

/* Filter dropdown animations */
.filter-dropdown {
  animation: dropdownSlideIn 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes dropdownSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Workspace section styles */
.workspace-section {
  margin-bottom: 0.5rem;
}

.workspace-section:last-child {
  margin-bottom: 0;
}

/* Progress segment hover effects */
.project-card .progress-segment {
  position: relative;
  height: 4px;
  border-radius: 2px;
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.project-card .progress-segment::after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.25rem 0.5rem;
  background: #1F2937;
  border: 1px solid #374151;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 150ms;
}

.project-card .progress-segment:hover::after {
  opacity: 1;
}

/* Search input focus styles */
.search-input:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Smooth height transitions for expanding sections */
.expand-transition {
  transition: max-height 300ms cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

/* Fuse.js search highlighting */
mark {
  background: rgba(245, 158, 11, 0.3);
  color: #FCD34D;
  padding: 0 0.125rem;
  border-radius: 0.125rem;
}
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/main.tsx
```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeCanvasSubscriptions } from "./stores/canvasStore";

// Don't initialize canvas subscriptions - WorkflowCanvas manages nodes directly
// initializeCanvasSubscriptions();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/src/vite-env.d.ts
```ts
/// <reference types="vite/client" />

```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/supabase/functions/generate-pain-points/index.ts
```ts
// supabase/functions/generate-pain-points/index.ts
import { serve } from "std/http/server.ts"
import { createClient } from "@supabase/supabase-js"
import { StateGraph } from "@langchain/langgraph"
import { OpenAI } from "openai"

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

interface PainPointGenerationState {
  projectId: string
  personaId: string
  persona?: any
  coreProblem?: string
  lockedPainPointIds: string[]
  existingPainPoints?: any[]
  newPainPoints?: any[]
  generationBatch?: string
}

// Node: Load persona and problem context
async function loadContext(state: PainPointGenerationState) {
  // Get persona details
  const { data: persona } = await supabase
    .from('personas')
    .select(`
      *,
      core_problems!inner(
        validated_problem
      )
    `)
    .eq('id', state.personaId)
    .single()
  
  // Get existing pain points
  const { data: existingPainPoints } = await supabase
    .from('pain_points')
    .select('*')
    .eq('persona_id', state.personaId)
    .order('position')
  
  return {
    ...state,
    persona,
    coreProblem: persona.core_problems.validated_problem,
    existingPainPoints: existingPainPoints || [],
    generationBatch: crypto.randomUUID()
  }
}

// Node: Generate pain points specific to the persona
async function generatePainPoints(state: PainPointGenerationState) {
  const { persona, coreProblem, existingPainPoints, lockedPainPointIds } = state
  
  const lockedPainPoints = existingPainPoints?.filter(pp => 
    lockedPainPointIds.includes(pp.id)
  ) || []
  
  const painPointsToGenerate = 3 - lockedPainPoints.length
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `You are an expert at understanding user pain points in specific contexts.
        Generate pain points that are specific, actionable, and directly related to the persona's role and industry.`
      },
      {
        role: "user",
        content: `Core Problem: "${coreProblem}"
        
        Persona: ${persona.name}
        Industry: ${persona.industry}
        Role: ${persona.role}
        Pain Level: ${persona.pain_degree}/5
        
        ${lockedPainPoints.length > 0 ? `Keep these existing pain points: ${JSON.stringify(lockedPainPoints.map(pp => pp.description))}` : ''}
        
        Generate ${painPointsToGenerate} specific pain points this persona experiences.
        
        Return as JSON:
        {
          "painPoints": [
            {
              "description": "Specific pain point description",
              "severity": "Critical|High|Medium",
              "impactArea": "Operations|Productivity|Revenue|Customer Experience|Compliance"
            }
          ]
        }`
      }
    ],
    response_format: { type: "json_object" }
  })
  
  const { painPoints } = JSON.parse(completion.choices[0].message.content!)
  
  return {
    ...state,
    newPainPoints: painPoints
  }
}

// Node: Validate pain point relevance
async function validateRelevance(state: PainPointGenerationState) {
  const { newPainPoints, persona, coreProblem } = state
  
  // Ensure pain points are specific and relevant
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `Validate that pain points are specific and directly relevant to the persona and problem.`
      },
      {
        role: "user",
        content: `Validate these pain points:
        ${JSON.stringify(newPainPoints)}
        
        For persona: ${persona.name} (${persona.role} in ${persona.industry})
        Problem: ${coreProblem}
        
        If any are too generic or not relevant, provide improved versions.
        Return the validated/improved pain points in the same JSON format.`
      }
    ],
    response_format: { type: "json_object" }
  })
  
  const { painPoints } = JSON.parse(completion.choices[0].message.content!)
  
  return {
    ...state,
    newPainPoints: painPoints
  }
}

// Node: Save pain points to database
async function savePainPoints(state: PainPointGenerationState) {
  const { personaId, newPainPoints, lockedPainPointIds, generationBatch, projectId } = state
  
  // Delete non-locked pain points
  if (lockedPainPointIds.length > 0) {
    await supabase
      .from('pain_points')
      .delete()
      .eq('persona_id', personaId)
      .not('id', 'in', `(${lockedPainPointIds.join(',')})`)
  } else {
    await supabase
      .from('pain_points')
      .delete()
      .eq('persona_id', personaId)
  }
  
  // Insert new pain points
  const painPointsToInsert = newPainPoints!.map((painPoint, index) => ({
    persona_id: personaId,
    description: painPoint.description,
    severity: painPoint.severity,
    impact_area: painPoint.impactArea,
    position: index + lockedPainPointIds.length,
    is_locked: false,
    generation_batch: generationBatch
  }))
  
  const { data: insertedPainPoints, error } = await supabase
    .from('pain_points')
    .insert(painPointsToInsert)
    .select()
  
  if (error) throw error
  
  // Update persona to active
  await supabase
    .from('personas')
    .update({ is_active: true })
    .eq('id', personaId)
  
  // Deactivate other personas
  await supabase
    .from('personas')
    .update({ is_active: false })
    .eq('core_problem_id', state.persona!.core_problem_id)
    .neq('id', personaId)
  
  // Log event
  await supabase.from('langgraph_state_events').insert({
    project_id: projectId,
    event_type: 'pain_points_generated',
    event_data: {
      personaId,
      generationBatch,
      painPointCount: insertedPainPoints.length,
      lockedCount: lockedPainPointIds.length
    },
    sequence_number: await getNextSequenceNumber(projectId)
  })
  
  return {
    ...state,
    insertedPainPoints
  }
}

// Helper function
async function getNextSequenceNumber(projectId: string): Promise<number> {
  const { data } = await supabase
    .from('langgraph_state_events')
    .select('sequence_number')
    .eq('project_id', projectId)
    .order('sequence_number', { ascending: false })
    .limit(1)
    .single()
  
  return (data?.sequence_number || 0) + 1
}

// Create the workflow
const workflow = new StateGraph<PainPointGenerationState>({
  channels: {
    projectId: null,
    personaId: null,
    persona: null,
    coreProblem: null,
    lockedPainPointIds: null,
    existingPainPoints: null,
    newPainPoints: null,
    generationBatch: null,
    insertedPainPoints: null
  }
})

// Add nodes
workflow.addNode("loadContext", loadContext)
workflow.addNode("generatePainPoints", generatePainPoints)
workflow.addNode("validateRelevance", validateRelevance)
workflow.addNode("savePainPoints", savePainPoints)

// Define the flow
workflow.setEntryPoint("loadContext")
workflow.addEdge("loadContext", "generatePainPoints")
workflow.addEdge("generatePainPoints", "validateRelevance")
workflow.addEdge("validateRelevance", "savePainPoints")
workflow.setFinishPoint("savePainPoints")

const app = workflow.compile()

serve(async (req) => {
  try {
    const { projectId, personaId, lockedPainPointIds = [] } = await req.json()
    
    const startTime = Date.now()
    
    // Execute the workflow
    const result = await app.invoke({
      projectId,
      personaId,
      lockedPainPointIds
    })
    
    // Get all pain points
    const { data: allPainPoints } = await supabase
      .from('pain_points')
      .select('*')
      .eq('persona_id', personaId)
      .order('position')
    
    // Log execution
    await supabase.from('langgraph_execution_logs').insert({
      project_id: projectId,
      node_name: 'generate_pain_points_workflow',
      input_state: { projectId, personaId, lockedPainPointIds },
      output_state: { painPointCount: allPainPoints?.length },
      status: 'success',
      execution_time_ms: Date.now() - startTime
    })
    
    return new Response(JSON.stringify({ painPoints: allPainPoints }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error('Error in generate-pain-points:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/supabase/functions/generate-personas/index.ts
```ts
// supabase/functions/generate-personas/index.ts
import { serve } from "std/http/server.ts";
import { createClient } from "@supabase/supabase-js";
import { OpenAI } from "openai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-request-id',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    console.log('Generate personas function started')
    
    // Validate environment variables
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!openaiKey || !supabaseUrl || !supabaseServiceKey) {
      console.error('Missing required environment variables')
      return new Response(JSON.stringify({ 
        error: { message: 'Service configuration error', code: 'CONFIG_ERROR' }
      }), { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Validate request body
    const { projectId, coreProblemId, coreProblem, lockedPersonaIds = [] } = await req.json()
    
    if (!projectId || !coreProblemId || !coreProblem) {
      return new Response(JSON.stringify({ 
        error: { message: 'Missing required fields', code: 'INVALID_REQUEST' }
      }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }
    
    console.log('Generating personas for problem:', coreProblem.substring(0, 50) + '...')
    
    // Initialize OpenAI
    const openai = new OpenAI({ apiKey: openaiKey })
    
    // Generate personas
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a persona generator. Create diverse personas that would experience the given problem.`
        },
        {
          role: "user",
          content: `Problem: "${coreProblem}"
          
          Generate 5 diverse personas who would face this problem.
          
          Return as JSON:
          {
            "personas": [
              {
                "name": "Full Name",
                "industry": "Industry Name",
                "role": "Job Title",
                "description": "Brief description of who they are and why they face this problem",
                "painDegree": 1-5
              }
            ]
          }`
        }
      ],
      response_format: { type: "json_object" }
    })
    
    const result = JSON.parse(completion.choices[0].message.content!)
    const generationBatch = crypto.randomUUID()
    
    // Store personas in database
    const personasToInsert = result.personas.map((persona: any, index: number) => ({
      id: crypto.randomUUID(),
      core_problem_id: coreProblemId,
      name: persona.name,
      industry: persona.industry,
      role: persona.role,
      pain_degree: persona.painDegree || 3,
      position: index + 1,
      is_locked: false,
      is_active: false,
      generation_batch: generationBatch
    }))
    
    console.log('Inserting personas into database...')
    console.log('Core problem ID:', coreProblemId)
    console.log('Personas to insert:', personasToInsert.length)
    
    const { data: insertedPersonas, error: insertError } = await supabase
      .from('personas')
      .insert(personasToInsert)
      .select()
    
    if (insertError) {
      console.error('Error inserting personas:', insertError)
      console.error('Error details:', JSON.stringify(insertError, null, 2))
      
      // Check if it's a foreign key constraint error
      if (insertError.code === '23503') {
        // Try to verify if the core problem exists
        const { data: coreProblemCheck, error: checkError } = await supabase
          .from('core_problems')
          .select('id')
          .eq('id', coreProblemId)
          .single()
        
        if (checkError || !coreProblemCheck) {
          console.error('Core problem not found in database:', coreProblemId)
          return new Response(JSON.stringify({ 
            error: { 
              message: 'Core problem not found. Please validate the problem again.', 
              code: 'CORE_PROBLEM_NOT_FOUND',
              details: { coreProblemId }
            }
          }), { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          })
        }
      }
      
      throw new Error('Failed to store personas in database: ' + insertError.message)
    }
    
    console.log('Personas stored successfully:', insertedPersonas?.length)
    
    // Format response to match frontend expectations
    const formattedPersonas = insertedPersonas.map((persona: any) => ({
      id: persona.id,
      name: persona.name,
      industry: persona.industry,
      role: persona.role,
      description: result.personas.find((p: any) => p.name === persona.name)?.description || '',
      demographics: {
        industry: persona.industry,
        role: persona.role
      },
      psychographics: {},
      goals: [],
      frustrations: [],
      batch_id: persona.generation_batch,
      is_locked: persona.is_locked,
      created_at: persona.created_at,
      updated_at: persona.created_at
    }))
    
    return new Response(JSON.stringify(formattedPersonas), {
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      }
    })
    
  } catch (error) {
    console.error('Function error:', error)
    return new Response(JSON.stringify({ 
      error: {
        message: error.message || 'Internal server error',
        code: 'INTERNAL_ERROR'
      }
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      }
    })
  }
})
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/supabase/functions/generate-solutions/index.ts
```ts
// supabase/functions/generate-solutions/index.ts
import { serve } from "std/http/server.ts"
import { createClient } from "@supabase/supabase-js"
import { StateGraph } from "@langchain/langgraph"
import { OpenAI } from "openai"

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

interface SolutionGenerationState {
  projectId: string
  personaId: string
  persona?: any
  coreProblem?: string
  painPoints?: any[]
  lockedSolutionIds: string[]
  existingSolutions?: any[]
  newSolutions?: any[]
  solutionMappings?: any[]
  generationBatch?: string
}

// Node: Load context including persona and pain points
async function loadContext(state: SolutionGenerationState) {
  // Get persona with core problem
  const { data: persona } = await supabase
    .from('personas')
    .select(`
      *,
      core_problems!inner(
        validated_problem
      )
    `)
    .eq('id', state.personaId)
    .single()
  
  // Get pain points
  const { data: painPoints } = await supabase
    .from('pain_points')
    .select('*')
    .eq('persona_id', state.personaId)
    .order('position')
  
  // Get existing solutions
  const { data: existingSolutions } = await supabase
    .from('key_solutions')
    .select('*')
    .eq('persona_id', state.personaId)
    .order('position')
  
  return {
    ...state,
    persona,
    coreProblem: persona.core_problems.validated_problem,
    painPoints: painPoints || [],
    existingSolutions: existingSolutions || [],
    generationBatch: crypto.randomUUID()
  }
}

// Node: Generate solutions that address the pain points
async function generateSolutions(state: SolutionGenerationState) {
  const { persona, coreProblem, painPoints, existingSolutions, lockedSolutionIds } = state
  
  const lockedSolutions = existingSolutions?.filter(s => 
    lockedSolutionIds.includes(s.id)
  ) || []
  
  const solutionsToGenerate = 5 - lockedSolutions.length
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `You are an expert product strategist and solution architect.
        Generate innovative software solutions that directly address the identified pain points.
        Solutions should be specific, implementable, and valuable.`
      },
      {
        role: "user",
        content: `Core Problem: "${coreProblem}"
        
        Persona: ${persona.name} (${persona.role} in ${persona.industry})
        
        Pain Points:
        ${painPoints?.map((pp, i) => `${i + 1}. [${pp.severity}] ${pp.description}`).join('\n') || 'None'}
        
        ${lockedSolutions.length > 0 ? `Keep these existing solutions: ${JSON.stringify(lockedSolutions.map(s => s.title))}` : ''}
        
        Generate ${solutionsToGenerate} software solutions.
        
        Return as JSON:
        {
          "solutions": [
            {
              "title": "Solution title",
              "description": "How this solution works and what it accomplishes",
              "solutionType": "Feature|Integration|Automation|Analytics|Platform",
              "complexity": "Low|Medium|High",
              "addressedPainPoints": [0, 1, 2] // indices of pain points this solution addresses
            }
          ]
        }`
      }
    ],
    response_format: { type: "json_object" }
  })
  
  const { solutions } = JSON.parse(completion.choices[0].message.content!)
  
  return {
    ...state,
    newSolutions: solutions
  }
}

// Node: Calculate solution-pain point relevance scores
async function calculateRelevanceScores(state: SolutionGenerationState) {
  const { newSolutions, painPoints } = state
  
  const mappings: any[] = []
  
  for (const solution of newSolutions!) {
    for (const painPointIndex of solution.addressedPainPoints) {
      const painPoint = painPoints![painPointIndex]
      if (!painPoint) continue
      
      // Calculate relevance score using GPT-4
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: `Rate how well a solution addresses a specific pain point on a scale of 0.0 to 1.0.`
          },
          {
            role: "user",
            content: `Pain Point: ${painPoint.description}
            Solution: ${solution.title} - ${solution.description}
            
            Rate the relevance (0.0-1.0) and explain briefly.
            Return as JSON: { "score": 0.0-1.0, "reasoning": "brief explanation" }`
          }
        ],
        response_format: { type: "json_object" }
      })
      
      const { score } = JSON.parse(completion.choices[0].message.content!)
      
      mappings.push({
        solution,
        painPointId: painPoint.id,
        relevanceScore: score
      })
    }
  }
  
  return {
    ...state,
    solutionMappings: mappings
  }
}

// Node: Ensure solution diversity and coverage
async function ensureCoverage(state: SolutionGenerationState) {
  const { newSolutions, painPoints, solutionMappings } = state
  
  // Check if all pain points are addressed
  const addressedPainPointIds = new Set(solutionMappings!.map(m => m.painPointId))
  const unaddressedPainPoints = painPoints!.filter(pp => !addressedPainPointIds.has(pp.id))
  
  if (unaddressedPainPoints.length > 0) {
    // Generate additional solution for unaddressed pain points
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `Generate a solution that specifically addresses unaddressed pain points.`
        },
        {
          role: "user",
          content: `These pain points are not well addressed:
          ${unaddressedPainPoints.map(pp => pp.description).join('\n')}
          
          Generate one comprehensive solution that addresses these.
          Use the same JSON format as before.`
        }
      ],
      response_format: { type: "json_object" }
    })
    
    const { solutions } = JSON.parse(completion.choices[0].message.content!)
    
    // Add the new solution and its mappings
    newSolutions!.push(solutions[0])
    
    for (const pp of unaddressedPainPoints) {
      solutionMappings!.push({
        solution: solutions[0],
        painPointId: pp.id,
        relevanceScore: 0.8 // Default high relevance for targeted solution
      })
    }
  }
  
  return state
}

// Node: Save solutions and mappings to database
async function saveSolutions(state: SolutionGenerationState) {
  const { projectId, personaId, newSolutions, solutionMappings, lockedSolutionIds, generationBatch } = state
  
  // Delete non-locked solutions and their mappings
  if (lockedSolutionIds.length > 0) {
    const { data: solutionsToDelete } = await supabase
      .from('key_solutions')
      .select('id')
      .eq('persona_id', personaId)
      .not('id', 'in', `(${lockedSolutionIds.join(',')})`)
    
    if (solutionsToDelete && solutionsToDelete.length > 0) {
      const idsToDelete = solutionsToDelete.map(s => s.id)
      
      // Delete mappings first
      await supabase
        .from('solution_pain_point_mappings')
        .delete()
        .in('solution_id', idsToDelete)
      
      // Then delete solutions
      await supabase
        .from('key_solutions')
        .delete()
        .in('id', idsToDelete)
    }
  } else {
    // Delete all mappings for this persona's solutions
    const { data: allSolutions } = await supabase
      .from('key_solutions')
      .select('id')
      .eq('persona_id', personaId)
    
    if (allSolutions && allSolutions.length > 0) {
      await supabase
        .from('solution_pain_point_mappings')
        .delete()
        .in('solution_id', allSolutions.map(s => s.id))
    }
    
    // Delete all solutions
    await supabase
      .from('key_solutions')
      .delete()
      .eq('persona_id', personaId)
  }
  
  // Insert new solutions
  const solutionsToInsert = newSolutions!.map((solution, index) => ({
    project_id: projectId,
    persona_id: personaId,
    title: solution.title,
    description: solution.description,
    solution_type: solution.solutionType,
    complexity: solution.complexity,
    position: index + lockedSolutionIds.length,
    is_locked: false,
    is_selected: false,
    generation_batch: generationBatch
  }))
  
  const { data: insertedSolutions, error } = await supabase
    .from('key_solutions')
    .insert(solutionsToInsert)
    .select()
  
  if (error) throw error
  
  // Create solution ID map
  const solutionIdMap = new Map()
  insertedSolutions.forEach((sol, index) => {
    solutionIdMap.set(newSolutions![index], sol.id)
  })
  
  // Insert mappings
  const mappingsToInsert = solutionMappings!
    .filter(m => solutionIdMap.has(m.solution))
    .map(m => ({
      solution_id: solutionIdMap.get(m.solution),
      pain_point_id: m.painPointId,
      relevance_score: m.relevanceScore
    }))
  
  await supabase
    .from('solution_pain_point_mappings')
    .insert(mappingsToInsert)
  
  // Update project status
  await supabase
    .from('projects')
    .update({ 
      current_step: 'solution_discovery',
      status: 'solution_discovery'
    })
    .eq('id', projectId)
  
  // Log event
  await supabase.from('langgraph_state_events').insert({
    project_id: projectId,
    event_type: 'solutions_generated',
    event_data: {
      personaId,
      generationBatch,
      solutionCount: insertedSolutions.length,
      mappingCount: mappingsToInsert.length,
      lockedCount: lockedSolutionIds.length
    },
    sequence_number: await getNextSequenceNumber(projectId)
  })
  
  return {
    ...state,
    insertedSolutions,
    insertedMappings: mappingsToInsert
  }
}

// Helper function
async function getNextSequenceNumber(projectId: string): Promise<number> {
  const { data } = await supabase
    .from('langgraph_state_events')
    .select('sequence_number')
    .eq('project_id', projectId)
    .order('sequence_number', { ascending: false })
    .limit(1)
    .single()
  
  return (data?.sequence_number || 0) + 1
}

// Create the workflow
const workflow = new StateGraph<SolutionGenerationState>({
  channels: {
    projectId: null,
    personaId: null,
    persona: null,
    coreProblem: null,
    painPoints: null,
    lockedSolutionIds: null,
    existingSolutions: null,
    newSolutions: null,
    solutionMappings: null,
    generationBatch: null,
    insertedSolutions: null,
    insertedMappings: null
  }
})

// Add nodes
workflow.addNode("loadContext", loadContext)
workflow.addNode("generateSolutions", generateSolutions)
workflow.addNode("calculateRelevanceScores", calculateRelevanceScores)
workflow.addNode("ensureCoverage", ensureCoverage)
workflow.addNode("saveSolutions", saveSolutions)

// Define the flow
workflow.setEntryPoint("loadContext")
workflow.addEdge("loadContext", "generateSolutions")
workflow.addEdge("generateSolutions", "calculateRelevanceScores")
workflow.addEdge("calculateRelevanceScores", "ensureCoverage")
workflow.addEdge("ensureCoverage", "saveSolutions")
workflow.setFinishPoint("saveSolutions")

const app = workflow.compile()

serve(async (req) => {
  try {
    const { projectId, personaId, lockedSolutionIds = [] } = await req.json()
    
    const startTime = Date.now()
    
    // Execute the workflow
    const result = await app.invoke({
      projectId,
      personaId,
      lockedSolutionIds
    })
    
    // Get all solutions with mappings
    const { data: allSolutions } = await supabase
      .from('key_solutions')
      .select(`
        *,
        solution_pain_point_mappings(
          pain_point_id,
          relevance_score
        )
      `)
      .eq('persona_id', personaId)
      .order('position')
    
    // Log execution
    await supabase.from('langgraph_execution_logs').insert({
      project_id: projectId,
      node_name: 'generate_solutions_workflow',
      input_state: { projectId, personaId, lockedSolutionIds },
      output_state: { 
        solutionCount: allSolutions?.length,
        mappingCount: result.insertedMappings?.length
      },
      status: 'success',
      execution_time_ms: Date.now() - startTime
    })
    
    return new Response(JSON.stringify({ 
      solutions: allSolutions,
      mappings: result.insertedMappings
    }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error('Error in generate-solutions:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/supabase/functions/generate-system-design/index.ts
```ts
// supabase/functions/generate-architecture/index.ts
import { serve } from "std/http/server.ts"
import { createClient } from "@supabase/supabase-js"
import { StateGraph } from "@langchain/langgraph"
import { OpenAI } from "openai"

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

interface ArchitectureGenerationState {
  projectId: string
  userStories?: any[]
  solutions?: any[]
  coreProblem?: string
  techStack?: any[]
  databaseSchema?: any
  uiScreens?: any[]
  designSystem?: any
}

// Node: Load project context
async function loadContext(state: ArchitectureGenerationState) {
  // Get user stories
  const { data: userStories } = await supabase
    .from('user_stories')
    .select('*')
    .eq('project_id', state.projectId)
    .order('position')
  
  // Get selected solutions with core problem
  const { data: solutions } = await supabase
    .from('key_solutions')
    .select(`
      *,
      personas!inner(
        core_problems!inner(
          validated_problem
        )
      )
    `)
    .eq('project_id', state.projectId)
    .eq('is_selected', true)
  
  const coreProblem = solutions?.[0]?.personas?.core_problems?.validated_problem
  
  return {
    ...state,
    userStories,
    solutions,
    coreProblem
  }
}

// Node: Generate technology stack recommendations
async function generateTechStack(state: ArchitectureGenerationState) {
  const { userStories, solutions, coreProblem } = state
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `You are a senior solutions architect with expertise in modern web technologies.
        Recommend a technology stack based on the requirements.
        Prioritize proven, scalable technologies with good developer experience.`
      },
      {
        role: "user",
        content: `Core Problem: "${coreProblem}"
        
        Key Features (from solutions):
        ${solutions!.map(s => `- ${s.title}: ${s.description}`).join('\n')}
        
        User Stories Summary:
        ${userStories!.slice(0, 3).map(us => `- As ${us.as_a}, I want ${us.i_want}`).join('\n')}
        
        Recommend a modern tech stack.
        
        Return as JSON:
        {
          "techStack": [
            {
              "layer": "Frontend|Backend|Database|DevOps|Testing",
              "technology": "Technology name",
              "justification": "Why this technology fits the requirements"
            }
          ]
        }`
      }
    ],
    response_format: { type: "json_object" }
  })
  
  const { techStack } = JSON.parse(completion.choices[0].message.content!)
  
  return {
    ...state,
    techStack
  }
}

// Node: Generate database schema
async function generateDatabaseSchema(state: ArchitectureGenerationState) {
  const { userStories, solutions } = state
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `You are a database architect expert in data modeling.
        Design a normalized relational database schema.`
      },
      {
        role: "user",
        content: `Based on these user stories and features:
        ${userStories!.map(us => `- ${us.title}: As ${us.as_a}, I want ${us.i_want}`).join('\n')}
        
        Design the database schema.
        
        Return as JSON:
        {
          "tables": [
            {
              "tableName": "table_name",
              "columns": [
                {
                  "columnName": "id",
                  "dataType": "UUID",
                  "isPrimaryKey": true,
                  "isForeignKey": false,
                  "referencesTable": null,
                  "constraints": ["NOT NULL", "DEFAULT gen_random_uuid()"]
                }
              ]
            }
          ],
          "relationships": [
            {
              "fromTable": "table1",
              "toTable": "table2",
              "relationshipType": "one-to-many"
            }
          ]
        }`
      }
    ],
    response_format: { type: "json_object" }
  })
  
  const schema = JSON.parse(completion.choices[0].message.content!)
  
  return {
    ...state,
    databaseSchema: schema
  }
}

// Node: Generate UI screens and components
async function generateUIScreens(state: ArchitectureGenerationState) {
  const { userStories, techStack } = state
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `You are a UX architect designing application screens and components.
        Create a comprehensive list of screens and their components.`
      },
      {
        role: "user",
        content: `User Stories:
        ${userStories!.map(us => `- ${us.title}: ${us.i_want}`).join('\n')}
        
        Frontend Technology: ${techStack!.find(t => t.layer === 'Frontend')?.technology || 'React'}
        
        Design the UI screens and components.
        
        Return as JSON:
        {
          "screens": [
            {
              "screenName": "Dashboard",
              "description": "Main dashboard view",
              "routePath": "/dashboard",
              "components": [
                {
                  "componentName": "StatsCard",
                  "componentType": "molecule",
                  "dataDisplayed": "Key metrics",
                  "props": {
                    "title": "string",
                    "value": "number",
                    "trend": "number"
                  }
                }
              ]
            }
          ]
        }`
      }
    ],
    response_format: { type: "json_object" }
  })
  
  const { screens } = JSON.parse(completion.choices[0].message.content!)
  
  return {
    ...state,
    uiScreens: screens
  }
}

// Node: Generate design system
async function generateDesignSystem(state: ArchitectureGenerationState) {
  const { uiScreens } = state
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `You are a design system architect creating a cohesive visual language.
        Define design tokens and atomic components.`
      },
      {
        role: "user",
        content: `Based on these UI screens:
        ${uiScreens!.map(s => s.screenName).join(', ')}
        
        Create a minimal but complete design system.
        
        Return as JSON:
        {
          "designTokens": [
            {
              "category": "color|typography|spacing|shadow",
              "tokenName": "primary-500",
              "tokenValue": "#3B82F6"
            }
          ],
          "atomicComponents": [
            {
              "componentLevel": "atom|molecule|organism",
              "componentName": "Button",
              "description": "Primary action button",
              "props": {
                "variant": "primary|secondary|ghost",
                "size": "sm|md|lg"
              },
              "composedOf": []
            }
          ]
        }`
      }
    ],
    response_format: { type: "json_object" }
  })
  
  const designSystem = JSON.parse(completion.choices[0].message.content!)
  
  return {
    ...state,
    designSystem
  }
}

// Node: Save all architecture data
async function saveArchitecture(state: ArchitectureGenerationState) {
  const { projectId, techStack, databaseSchema, uiScreens, designSystem } = state
  
  // Clear existing architecture data
  await Promise.all([
    supabase.from('system_architecture').delete().eq('project_id', projectId),
    supabase.from('database_tables').delete().eq('project_id', projectId),
    supabase.from('database_relationships').delete().eq('project_id', projectId),
    supabase.from('ui_screens').delete().eq('project_id', projectId),
    supabase.from('design_tokens').delete().eq('project_id', projectId),
    supabase.from('atomic_components').delete().eq('project_id', projectId)
  ])
  
  // Save tech stack
  const techStackToInsert = techStack!.map(tech => ({
    project_id: projectId,
    layer: tech.layer,
    technology: tech.technology,
    justification: tech.justification,
    version: 1
  }))
  
  await supabase
    .from('system_architecture')
    .insert(techStackToInsert)
  
  // Save database schema
  for (const table of databaseSchema!.tables) {
    const { data: insertedTable } = await supabase
      .from('database_tables')
      .insert({
        project_id: projectId,
        table_name: table.tableName
      })
      .select()
      .single()
    
    const columnsToInsert = table.columns.map((col: any) => ({
      table_id: insertedTable.id,
      column_name: col.columnName,
      data_type: col.dataType,
      is_primary_key: col.isPrimaryKey,
      is_foreign_key: col.isForeignKey,
      references_table: col.referencesTable,
      constraints: col.constraints
    }))
    
    await supabase
      .from('database_columns')
      .insert(columnsToInsert)
  }
  
  // Save relationships
  const relationshipsToInsert = databaseSchema!.relationships.map((rel: any) => ({
    project_id: projectId,
    from_table: rel.fromTable,
    to_table: rel.toTable,
    relationship_type: rel.relationshipType
  }))
  
  if (relationshipsToInsert.length > 0) {
    await supabase
      .from('database_relationships')
      .insert(relationshipsToInsert)
  }
  
  // Save UI screens and components
  for (const screen of uiScreens!) {
    const { data: insertedScreen } = await supabase
      .from('ui_screens')
      .insert({
        project_id: projectId,
        screen_name: screen.screenName,
        description: screen.description,
        route_path: screen.routePath
      })
      .select()
      .single()
    
    if (screen.components && screen.components.length > 0) {
      const componentsToInsert = screen.components.map((comp: any) => ({
        screen_id: insertedScreen.id,
        component_name: comp.componentName,
        component_type: comp.componentType,
        data_displayed: comp.dataDisplayed,
        props: comp.props
      }))
      
      await supabase
        .from('ui_components')
        .insert(componentsToInsert)
    }
  }
  
  // Save design system
  const designTokensToInsert = designSystem!.designTokens.map((token: any) => ({
    project_id: projectId,
    token_category: token.category,
    token_name: token.tokenName,
    token_value: token.tokenValue
  }))
  
  await supabase
    .from('design_tokens')
    .insert(designTokensToInsert)
  
  const atomicComponentsToInsert = designSystem!.atomicComponents.map((comp: any) => ({
    project_id: projectId,
    component_level: comp.componentLevel,
    component_name: comp.componentName,
    description: comp.description,
    props: comp.props,
    composed_of: comp.composedOf
  }))
  
  await supabase
    .from('atomic_components')
    .insert(atomicComponentsToInsert)
  
  // Update project status
  await supabase
    .from('projects')
    .update({ 
      current_step: 'architecture',
      status: 'architecture_complete'
    })
    .eq('id', projectId)
  
  // Log event
  await supabase.from('langgraph_state_events').insert({
    project_id: projectId,
    event_type: 'architecture_generated',
    event_data: {
      techStackCount: techStack!.length,
      tableCount: databaseSchema!.tables.length,
      screenCount: uiScreens!.length,
      designTokenCount: designSystem!.designTokens.length
    },
    sequence_number: await getNextSequenceNumber(projectId)
  })
  
  return state
}

// Helper function
async function getNextSequenceNumber(projectId: string): Promise<number> {
  const { data } = await supabase
    .from('langgraph_state_events')
    .select('sequence_number')
    .eq('project_id', projectId)
    .order('sequence_number', { ascending: false })
    .limit(1)
    .single()
  
  return (data?.sequence_number || 0) + 1
}

// Create the workflow
const workflow = new StateGraph<ArchitectureGenerationState>({
  channels: {
    projectId: null,
    userStories: null,
    solutions: null,
    coreProblem: null,
    techStack: null,
    databaseSchema: null,
    uiScreens: null,
    designSystem: null
  }
})

// Add nodes
workflow.addNode("loadContext", loadContext)
workflow.addNode("generateTechStack", generateTechStack)
workflow.addNode("generateDatabaseSchema", generateDatabaseSchema)
workflow.addNode("generateUIScreens", generateUIScreens)
workflow.addNode("generateDesignSystem", generateDesignSystem)
workflow.addNode("saveArchitecture", saveArchitecture)

// Define the flow
workflow.setEntryPoint("loadContext")
workflow.addEdge("loadContext", "generateTechStack")
workflow.addEdge("generateTechStack", "generateDatabaseSchema")
workflow.addEdge("generateDatabaseSchema", "generateUIScreens")
workflow.addEdge("generateUIScreens", "generateDesignSystem")
workflow.addEdge("generateDesignSystem", "saveArchitecture")
workflow.setFinishPoint("saveArchitecture")

const app = workflow.compile()

serve(async (req) => {
  try {
    const { projectId } = await req.json()
    
    const startTime = Date.now()
    
    // Execute the workflow
    await app.invoke({ projectId })
    
    // Get all architecture data
    const [techStack, tables, screens, designTokens, atomicComponents, relationships] = await Promise.all([
      supabase.from('system_architecture').select('*').eq('project_id', projectId),
      supabase.from('database_tables').select(`
        *,
        database_columns(*)
      `).eq('project_id', projectId),
      supabase.from('ui_screens').select(`
        *,
        ui_components(*)
      `).eq('project_id', projectId),
      supabase.from('design_tokens').select('*').eq('project_id', projectId),
      supabase.from('atomic_components').select('*').eq('project_id', projectId),
      supabase.from('database_relationships').select('*').eq('project_id', projectId)
    ])
    
    // Log execution
    await supabase.from('langgraph_execution_logs').insert({
      project_id: projectId,
      node_name: 'generate_architecture_workflow',
      input_state: { projectId },
      output_state: { 
        techStackCount: techStack.data?.length,
        tableCount: tables.data?.length,
        screenCount: screens.data?.length,
        tokenCount: designTokens.data?.length
      },
      status: 'success',
      execution_time_ms: Date.now() - startTime
    })
    
    return new Response(JSON.stringify({ 
      techStack: techStack.data,
      databaseSchema: {
        tables: tables.data,
        relationships: relationships.data
      },
      uiScreens: screens.data,
      designSystem: {
        tokens: designTokens.data,
        components: atomicComponents.data
      }
    }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error('Error in generate-architecture:', error)
    
    // Log error
    await supabase.from('langgraph_execution_logs').insert({
      project_id: req.json().projectId,
      node_name: 'generate_architecture_workflow',
      input_state: { projectId: req.json().projectId },
      output_state: null,
      status: 'error',
      error_message: error.message,
      execution_time_ms: Date.now() - performance.now()
    })
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/supabase/functions/generate-user-stories/index.ts
```ts
// supabase/functions/generate-user-stories/index.ts
import { serve } from "std/http/server.ts"
import { createClient } from "@supabase/supabase-js"
import { StateGraph } from "@langchain/langgraph"
import { OpenAI } from "openai"

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

interface UserStoryGenerationState {
  projectId: string
  selectedSolutions?: any[]
  persona?: any
  coreProblem?: string
  userStories?: any[]
  dataFlows?: any[]
}

// Node: Load selected solutions and context
async function loadContext(state: UserStoryGenerationState) {
  // Get selected solutions with persona and pain point mappings
  const { data: selectedSolutions } = await supabase
    .from('key_solutions')
    .select(`
      *,
      personas!inner(
        *,
        core_problems!inner(
          validated_problem
        )
      ),
      solution_pain_point_mappings(
        pain_points!inner(
          description,
          severity
        )
      )
    `)
    .eq('project_id', state.projectId)
    .eq('is_selected', true)
    .order('position')
  
  if (!selectedSolutions || selectedSolutions.length === 0) {
    throw new Error('No solutions selected')
  }
  
  const persona = selectedSolutions[0].personas
  const coreProblem = persona.core_problems.validated_problem
  
  return {
    ...state,
    selectedSolutions,
    persona,
    coreProblem
  }
}

// Node: Generate user stories from selected solutions
async function generateUserStories(state: UserStoryGenerationState) {
  const { selectedSolutions, persona, coreProblem } = state
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `You are an expert agile product manager and user story writer.
        Create detailed user stories that implement the selected solutions.
        Each story should be specific, testable, and valuable.`
      },
      {
        role: "user",
        content: `Core Problem: "${coreProblem}"
        Persona: ${persona.name} (${persona.role} in ${persona.industry})
        
        Selected Solutions:
        ${selectedSolutions?.map((sol, i) => `${i + 1}. ${sol.title}: ${sol.description}`).join('\n') || 'None'}
        
        Generate 6 user stories that implement these solutions.
        
        Return as JSON:
        {
          "userStories": [
            {
              "title": "Story title",
              "asA": "Role/persona",
              "iWant": "Specific feature or capability",
              "soThat": "Business value or outcome",
              "acceptanceCriteria": [
                "Specific testable criterion 1",
                "Specific testable criterion 2",
                "Specific testable criterion 3"
              ],
              "priority": "High|Medium|Low",
              "complexityPoints": 1-13,
              "relatedSolutionIndices": [0, 1] // which solutions this story implements
            }
          ]
        }`
      }
    ],
    response_format: { type: "json_object" }
  })
  
  const { userStories } = JSON.parse(completion.choices[0].message.content!)
  
  return {
    ...state,
    userStories
  }
}

// Node: Generate data flows for each user story
async function generateDataFlows(state: UserStoryGenerationState) {
  const { userStories } = state
  const dataFlows: any[] = []
  
  for (const story of userStories!) {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a system architect expert at designing data flows.
          Create detailed data flow steps for implementing user stories.`
        },
        {
          role: "user",
          content: `User Story: As a ${story.asA}, I want ${story.iWant} so that ${story.soThat}
          
          Create a data flow showing how this feature works.
          
          Return as JSON:
          {
            "description": "Overall flow description",
            "steps": [
              {
                "stepNumber": 1,
                "action": "User action or system process",
                "source": "Component/Actor initiating",
                "target": "Component/System receiving",
                "dataPayload": "What data is transferred"
              }
            ]
          }`
        }
      ],
      response_format: { type: "json_object" }
    })
    
    const flow = JSON.parse(completion.choices[0].message.content!)
    dataFlows.push({
      userStory: story,
      ...flow
    })
  }
  
  return {
    ...state,
    dataFlows
  }
}

// Node: Ensure story coverage and quality
async function validateStories(state: UserStoryGenerationState) {
  const { userStories, selectedSolutions } = state
  
  // Check if all solutions are covered
  const coveredSolutionIndices = new Set(
    userStories!.flatMap(story => story.relatedSolutionIndices)
  )
  
  const uncoveredSolutions = selectedSolutions!.filter((_, index) => 
    !coveredSolutionIndices.has(index)
  )
  
  if (uncoveredSolutions.length > 0) {
    // Generate additional stories for uncovered solutions
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `Generate user stories for solutions that aren't covered yet.`
        },
        {
          role: "user",
          content: `These solutions need user stories:
          ${uncoveredSolutions.map(sol => `${sol.title}: ${sol.description}`).join('\n')}
          
          Generate stories in the same JSON format as before.`
        }
      ],
      response_format: { type: "json_object" }
    })
    
    const { userStories: additionalStories } = JSON.parse(completion.choices[0].message.content!)
    userStories!.push(...additionalStories)
  }
  
  return state
}

// Node: Save user stories and data flows
async function saveUserStories(state: UserStoryGenerationState) {
  const { projectId, userStories, dataFlows } = state
  
  // Delete existing user stories and related data
  const { data: existingStories } = await supabase
    .from('user_stories')
    .select('id')
    .eq('project_id', projectId)
  
  if (existingStories && existingStories.length > 0) {
    const storyIds = existingStories.map(s => s.id)
    
    // Delete data flow steps
    const { data: dataFlowIds } = await supabase
      .from('data_flows')
      .select('id')
      .in('user_story_id', storyIds)
    
    if (dataFlowIds && dataFlowIds.length > 0) {
      await supabase
        .from('data_flow_steps')
        .delete()
        .in('data_flow_id', dataFlowIds.map(df => df.id))
    }
    
    // Delete data flows
    await supabase
      .from('data_flows')
      .delete()
      .in('user_story_id', storyIds)
    
    // Delete user stories
    await supabase
      .from('user_stories')
      .delete()
      .eq('project_id', projectId)
  }
  
  // Insert new user stories
  const storiesToInsert = userStories!.map((story, index) => ({
    project_id: projectId,
    title: story.title,
    as_a: story.asA,
    i_want: story.iWant,
    so_that: story.soThat,
    acceptance_criteria: story.acceptanceCriteria,
    priority: story.priority,
    complexity_points: story.complexityPoints,
    position: index,
    is_edited: false
  }))
  
  const { data: insertedStories, error } = await supabase
    .from('user_stories')
    .insert(storiesToInsert)
    .select()
  
  if (error) throw error
  
  // Insert data flows and steps
  for (let i = 0; i < insertedStories.length; i++) {
    const story = insertedStories[i]
    const flow = dataFlows![i]
    
    // Insert data flow
    const { data: insertedFlow } = await supabase
      .from('data_flows')
      .insert({
        user_story_id: story.id,
        description: flow.description
      })
      .select()
      .single()
    
    // Insert data flow steps
    const stepsToInsert = flow.steps.map((step: any) => ({
      data_flow_id: insertedFlow.id,
      step_number: step.stepNumber,
      action: step.action,
      source: step.source,
      target: step.target,
      data_payload: step.dataPayload
    }))
    
    await supabase
      .from('data_flow_steps')
      .insert(stepsToInsert)
  }
  
  // Update project status
  await supabase
    .from('projects')
    .update({ 
      current_step: 'user_stories',
      status: 'user_stories'
    })
    .eq('id', projectId)
  
  // Log event
  await supabase.from('langgraph_state_events').insert({
    project_id: projectId,
    event_type: 'user_stories_generated',
    event_data: {
      storyCount: insertedStories.length,
      dataFlowCount: dataFlows!.length
    },
    sequence_number: await getNextSequenceNumber(projectId)
  })
  
  return {
    ...state,
    insertedStories
  }
}

// Helper function
async function getNextSequenceNumber(projectId: string): Promise<number> {
  const { data } = await supabase
    .from('langgraph_state_events')
    .select('sequence_number')
    .eq('project_id', projectId)
    .order('sequence_number', { ascending: false })
    .limit(1)
    .single()
  
  return (data?.sequence_number || 0) + 1
}

// Create the workflow
const workflow = new StateGraph<UserStoryGenerationState>({
  channels: {
    projectId: null,
    selectedSolutions: null,
    persona: null,
    coreProblem: null,
    userStories: null,
    dataFlows: null,
    insertedStories: null
  }
})

// Add nodes
workflow.addNode("loadContext", loadContext)
workflow.addNode("generateUserStories", generateUserStories)
workflow.addNode("generateDataFlows", generateDataFlows)
workflow.addNode("validateStories", validateStories)
workflow.addNode("saveUserStories", saveUserStories)

// Define the flow
workflow.setEntryPoint("loadContext")
workflow.addEdge("loadContext", "generateUserStories")
workflow.addEdge("generateUserStories", "generateDataFlows")
workflow.addEdge("generateDataFlows", "validateStories")
workflow.addEdge("validateStories", "saveUserStories")
workflow.setFinishPoint("saveUserStories")

const app = workflow.compile()

serve(async (req) => {
  try {
    const { projectId } = await req.json()
    
    const startTime = Date.now()
    
    // Execute the workflow
    const result = await app.invoke({ projectId })
    
    // Get all user stories with data flows
    const { data: allStories } = await supabase
      .from('user_stories')
      .select(`
        *,
        data_flows(
          *,
          data_flow_steps(*)
        )
      `)
      .eq('project_id', projectId)
      .order('position')
    
    // Log execution
    await supabase.from('langgraph_execution_logs').insert({
      project_id: projectId,
      node_name: 'generate_user_stories_workflow',
      input_state: { projectId },
      output_state: { 
        storyCount: allStories?.length
      },
      status: 'success',
      execution_time_ms: Date.now() - startTime
    })
    
    return new Response(JSON.stringify({ 
      userStories: allStories
    }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error('Error in generate-user-stories:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/supabase/functions/problem-validation/index.ts
```ts
// supabase/functions/validate-problem/index.ts
import { serve } from "std/http/server.ts"
import { createClient } from "@supabase/supabase-js"
import { OpenAI } from "openai"

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-request-id',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  }
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    console.log('Function started')
    
    // Validate environment variables
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!openaiKey || !supabaseUrl || !supabaseServiceKey) {
      console.error('Missing required environment variables')
      return new Response(JSON.stringify({ 
        error: { message: 'Service configuration error', code: 'CONFIG_ERROR' }
      }), { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }
    
    console.log('Environment variables validated')
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Validate request body
    let requestData
    try {
      requestData = await req.json()
      console.log('Request data parsed:', Object.keys(requestData))
    } catch (error) {
      console.error('Invalid JSON:', error)
      return new Response(JSON.stringify({ 
        error: { message: 'Invalid request format', code: 'INVALID_JSON' }
      }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    const { problemInput, projectId } = requestData
    if (!problemInput) {
      return new Response(JSON.stringify({ 
        error: { message: 'problemInput is required', code: 'MISSING_INPUT' }
      }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    console.log('Processing problem:', problemInput.substring(0, 50) + '...')

    // Initialize OpenAI
    const openai = new OpenAI({ apiKey: openaiKey })
    console.log('OpenAI client initialized')

    // Call OpenAI with timeout
    const completion = await Promise.race([
      openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a problem analyst. Analyze the problem and respond with JSON."
          },
          {
            role: "user", 
            content: `Analyze: "${problemInput}"\n\nRespond with: {"isValid": boolean, "feedback": "string", "keyTerms": ["term1", "term2"]}`
          }
        ],
        response_format: { type: "json_object" }
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('OpenAI request timeout')), 25000)
      )
    ])

    console.log('OpenAI response received')
    const analysis = JSON.parse(completion.choices[0].message.content!)
    
    // Store in database
    let coreProblemId = crypto.randomUUID()
    let actualProjectId = projectId
    
    if (projectId) {
      console.log('Storing core problem in database for project:', projectId)
      
      // Check if project exists
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .single()
      
      if (projectError || !project) {
        console.warn('Project not found:', projectError)
        
        // Try to create a default project if it doesn't exist
        // First check if we have any workspace
        const { data: workspaces, error: wsError } = await supabase
          .from('workspaces')
          .select('id')
          .limit(1)
        
        if (wsError || !workspaces || workspaces.length === 0) {
          console.warn('No workspace found, creating temporary project without workspace')
          // Create a project without workspace for now
          const { data: newProject, error: createError } = await supabase
            .from('projects')
            .insert({
              id: projectId,
              name: 'Untitled Project',
              status: 'problem_input',
              current_step: 'problem_input'
            })
            .select()
            .single()
          
          if (createError) {
            console.error('Failed to create project:', createError)
            // Continue without storing in database
          } else {
            console.log('Created new project:', newProject.id)
          }
        } else {
          // Create project with workspace
          const { data: newProject, error: createError } = await supabase
            .from('projects')
            .insert({
              id: projectId,
              workspace_id: workspaces[0].id,
              name: 'Untitled Project',
              status: 'problem_input',
              current_step: 'problem_input'
            })
            .select()
            .single()
          
          if (createError) {
            console.error('Failed to create project with workspace:', createError)
          } else {
            console.log('Created new project with workspace:', newProject.id)
          }
        }
      }
      
      // Now try to insert the core problem
      const { data: coreProblem, error: coreProblemError } = await supabase
        .from('core_problems')
        .insert({
          id: coreProblemId,
          project_id: actualProjectId,
          original_input: problemInput,
          validated_problem: analysis.isValid ? problemInput : null,
          is_valid: analysis.isValid,
          validation_feedback: analysis.feedback,
          version: 1
        })
        .select()
        .single()
      
      if (coreProblemError) {
        console.error('Error storing core problem:', coreProblemError)
        // If it's a unique constraint violation, try to get the existing one
        if (coreProblemError.code === '23505') {
          const { data: existingProblem } = await supabase
            .from('core_problems')
            .select('id')
            .eq('project_id', actualProjectId)
            .eq('version', 1)
            .single()
          
          if (existingProblem) {
            coreProblemId = existingProblem.id
            console.log('Using existing core problem:', coreProblemId)
          }
        }
      } else {
        console.log('Core problem stored successfully:', coreProblem.id)
        coreProblemId = coreProblem.id
      }
    }
    
    const result = {
      originalInput: problemInput,
      isValid: analysis.isValid,
      validationFeedback: analysis.feedback,
      validatedProblem: analysis.isValid ? problemInput : (analysis.suggestedRefinement || problemInput),
      keyTerms: analysis.keyTerms || [],
      projectId: actualProjectId || crypto.randomUUID(),
      coreProblemId: coreProblemId
    }

    console.log('Validation complete, isValid:', result.isValid)
    console.log('Returning coreProblemId:', result.coreProblemId)

    return new Response(JSON.stringify(result), {
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      }
    })

  } catch (error) {
    console.error('Function error:', error)
    console.error('Error stack:', error.stack)
    return new Response(JSON.stringify({ 
      error: {
        message: error.message || 'Internal server error',
        code: 'INTERNAL_ERROR'
      }
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      }
    })
  }
})
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/supabase/migrations/001_initial_schema.sql
```sql
-- Initial Schema Migration for Prob
-- PostgreSQL/Supabase Schema matching the SQLite structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (integrated with Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    folder_path TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'problem_input',
    current_step TEXT DEFAULT 'problem_input',
    langgraph_state JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Core problems table
CREATE TABLE IF NOT EXISTS core_problems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    original_input TEXT NOT NULL,
    validated_problem TEXT,
    is_valid BOOLEAN DEFAULT FALSE,
    validation_feedback TEXT,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, version)
);

-- Personas table
CREATE TABLE IF NOT EXISTS personas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    core_problem_id UUID REFERENCES core_problems(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    industry TEXT NOT NULL,
    role TEXT NOT NULL,
    pain_degree INTEGER CHECK (pain_degree >= 1 AND pain_degree <= 5),
    position INTEGER NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT FALSE,
    generation_batch TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pain points table
CREATE TABLE IF NOT EXISTS pain_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    persona_id UUID REFERENCES personas(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    severity TEXT,
    impact_area TEXT,
    position INTEGER NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    generation_batch TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Key solutions table
CREATE TABLE IF NOT EXISTS key_solutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    persona_id UUID REFERENCES personas(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    solution_type TEXT,
    complexity TEXT,
    position INTEGER NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    is_selected BOOLEAN DEFAULT FALSE,
    generation_batch TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Solution to pain point mappings
CREATE TABLE IF NOT EXISTS solution_pain_point_mappings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    solution_id UUID REFERENCES key_solutions(id) ON DELETE CASCADE,
    pain_point_id UUID REFERENCES pain_points(id) ON DELETE CASCADE,
    relevance_score DECIMAL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(solution_id, pain_point_id)
);

-- User stories table
CREATE TABLE IF NOT EXISTS user_stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    as_a TEXT NOT NULL,
    i_want TEXT NOT NULL,
    so_that TEXT NOT NULL,
    acceptance_criteria JSONB,
    priority TEXT,
    complexity_points INTEGER,
    position INTEGER NOT NULL,
    is_edited BOOLEAN DEFAULT FALSE,
    original_content TEXT,
    edited_content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System architecture table
CREATE TABLE IF NOT EXISTS system_architecture (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    layer TEXT NOT NULL,
    technology TEXT NOT NULL,
    justification TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data flows table
CREATE TABLE IF NOT EXISTS data_flows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_story_id UUID REFERENCES user_stories(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data flow steps table
CREATE TABLE IF NOT EXISTS data_flow_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    data_flow_id UUID REFERENCES data_flows(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    action TEXT NOT NULL,
    source TEXT NOT NULL,
    target TEXT NOT NULL,
    data_payload TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Database schema tables
CREATE TABLE IF NOT EXISTS database_tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    table_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS database_columns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_id UUID REFERENCES database_tables(id) ON DELETE CASCADE,
    column_name TEXT NOT NULL,
    data_type TEXT NOT NULL,
    is_primary_key BOOLEAN DEFAULT FALSE,
    is_foreign_key BOOLEAN DEFAULT FALSE,
    references_table TEXT,
    constraints JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS database_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    from_table TEXT NOT NULL,
    to_table TEXT NOT NULL,
    relationship_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- UI screens table
CREATE TABLE IF NOT EXISTS ui_screens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    screen_name TEXT NOT NULL,
    description TEXT,
    route_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- UI components table
CREATE TABLE IF NOT EXISTS ui_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    screen_id UUID REFERENCES ui_screens(id) ON DELETE CASCADE,
    component_name TEXT NOT NULL,
    component_type TEXT,
    data_displayed TEXT,
    props JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Design tokens table
CREATE TABLE IF NOT EXISTS design_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    token_category TEXT NOT NULL,
    token_name TEXT NOT NULL,
    token_value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Atomic components table
CREATE TABLE IF NOT EXISTS atomic_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    component_level TEXT NOT NULL,
    component_name TEXT NOT NULL,
    description TEXT,
    props JSONB,
    composed_of JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LangGraph execution logs
CREATE TABLE IF NOT EXISTS langgraph_execution_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    node_name TEXT NOT NULL,
    input_state JSONB,
    output_state JSONB,
    execution_time_ms INTEGER,
    status TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- React Flow states
CREATE TABLE IF NOT EXISTS react_flow_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    viewport JSONB,
    nodes JSONB NOT NULL,
    edges JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LangGraph state events
CREATE TABLE IF NOT EXISTS langgraph_state_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB NOT NULL,
    event_metadata JSONB,
    sequence_number INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

-- Canvas states
CREATE TABLE IF NOT EXISTS canvas_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    nodes JSONB NOT NULL,
    edges JSONB NOT NULL,
    viewport JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_workspace ON projects(workspace_id);
CREATE INDEX IF NOT EXISTS idx_core_problems_project ON core_problems(project_id);
CREATE INDEX IF NOT EXISTS idx_core_problems_version ON core_problems(project_id, version);
CREATE INDEX IF NOT EXISTS idx_canvas_states_project ON canvas_states(project_id);

CREATE INDEX IF NOT EXISTS idx_personas_core_problem ON personas(core_problem_id); 
CREATE INDEX IF NOT EXISTS idx_personas_locked ON personas(core_problem_id, is_locked);
CREATE INDEX IF NOT EXISTS idx_personas_active ON personas(core_problem_id, is_active);
CREATE INDEX IF NOT EXISTS idx_personas_batch ON personas(generation_batch);

CREATE INDEX IF NOT EXISTS idx_pain_points_persona ON pain_points(persona_id);
CREATE INDEX IF NOT EXISTS idx_pain_points_locked ON pain_points(persona_id, is_locked);
CREATE INDEX IF NOT EXISTS idx_pain_points_batch ON pain_points(generation_batch);

CREATE INDEX IF NOT EXISTS idx_solutions_project ON key_solutions(project_id);
CREATE INDEX IF NOT EXISTS idx_solutions_persona ON key_solutions(persona_id);
CREATE INDEX IF NOT EXISTS idx_solutions_selected ON key_solutions(project_id, is_selected);
CREATE INDEX IF NOT EXISTS idx_solutions_batch ON key_solutions(generation_batch);

CREATE INDEX IF NOT EXISTS idx_solution_pain_mappings ON solution_pain_point_mappings(solution_id, pain_point_id);

CREATE INDEX IF NOT EXISTS idx_user_stories_project ON user_stories(project_id);

CREATE INDEX IF NOT EXISTS idx_flow_states_project ON react_flow_states(project_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_state_events_project_seq ON langgraph_state_events(project_id, sequence_number);
CREATE INDEX IF NOT EXISTS idx_state_events_type ON langgraph_state_events(project_id, event_type);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pain_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE solution_pain_point_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE canvas_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE langgraph_state_events ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (can be expanded based on requirements)
CREATE POLICY "Users can view own data" ON users FOR ALL USING (auth.uid()::text = id::text);
CREATE POLICY "Users can manage own workspaces" ON workspaces FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can manage projects in own workspaces" ON projects FOR ALL USING (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id::text = auth.uid()::text)
);

-- Trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_canvas_states_updated_at BEFORE UPDATE ON canvas_states FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/supabase/migrations/002_fix_rls_policies.sql
```sql
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
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/supabase/import_map.json
```json
{
    "imports": {
        "std/": "https://deno.land/std@0.224.0/",
        "@supabase/supabase-js": "https://esm.sh/@supabase/supabase-js@2",
        "@langchain/langgraph": "https://esm.sh/@langchain/langgraph@0.0.25",
        "openai": "https://esm.sh/openai@4",
        "zod": "https://deno.land/x/zod@v3.23.8/mod.ts"
    }
}
```

File: /Users/hutch/Documents/projects/gauntlet/p3/prob/supabase/seed.sql
```sql
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
```
</file_contents>
