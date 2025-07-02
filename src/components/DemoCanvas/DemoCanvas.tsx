import React, { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  BackgroundVariant,
  NodeTypes,
  EdgeTypes,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './DemoCanvas.css';

import { DemoAnimationController } from './DemoAnimationController';
import { CoreProblemNode } from '../canvas/nodes/CoreProblemNode';
import { PersonaNode } from '../canvas/nodes/PersonaNode';
import { useAuth } from '@/hooks/useAuth';

interface DemoCanvasProps {
  className?: string;
  showControls?: boolean;
  onPhaseChange?: (phase: string) => void;
  onProgressUpdate?: (progress: number) => void;
  showAuthForm?: boolean;
  onAuthSuccess?: () => void;
}

const nodeTypes: NodeTypes = {
  coreProblem: CoreProblemNode,
  persona: PersonaNode,
};

const DemoCanvasContent: React.FC<DemoCanvasProps> = ({
  className = '',
  showControls = false,
  onPhaseChange,
  onProgressUpdate,
  showAuthForm = true,
  onAuthSuccess,
}) => {
  const { signInWithEmail, signUpWithEmail, error, loading } = useAuth();
  const [currentPhase, setCurrentPhase] = useState('');
  const [progress, setProgress] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handlePhaseChange = useCallback((phase: string) => {
    setCurrentPhase(phase);
    onPhaseChange?.(phase);
  }, [onPhaseChange]);

  const handleProgressUpdate = useCallback((progress: number) => {
    setProgress(progress);
    onProgressUpdate?.(progress);
  }, [onProgressUpdate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    if (!validateEmail(email)) {
      setLocalError('Please enter a valid email address.');
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

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const displayError = localError || error;

  const defaultViewport = { x: 0, y: 0, zoom: 1.0 };
  
  return (
    <div className={`flex w-full h-full ${className}`}>
      {/* Left Side - Demo Canvas (60%) */}
      <div className="relative w-3/5 h-full bg-gray-900">
        <ReactFlow
          defaultNodes={[]}
          defaultEdges={[]}
          nodeTypes={nodeTypes}
          defaultViewport={defaultViewport}
          minZoom={0.5}
          maxZoom={1.5}
          fitView
          proOptions={{ hideAttribution: true }}
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
          panOnDrag={true}
          zoomOnScroll={true}
          zoomOnPinch={true}
          zoomOnDoubleClick={true}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={12}
            size={1}
            color="#374151"
          />
          
          <DemoAnimationController
            onPhaseChange={handlePhaseChange}
            onProgressUpdate={handleProgressUpdate}
          />
        </ReactFlow>
        
        {/* Overlay gradient for depth */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-gray-900/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-gray-900/40" />
        </div>
        
        {/* Phase indicator - Hidden */}
        <div className="absolute top-6 left-6 hidden">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg px-4 py-3">
            <span className="text-white text-sm font-medium">
              {currentPhase || 'Initializing...'}
            </span>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-full p-3">
            <div className="relative h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-accent-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>


      </div>

      {/* Right Side - Auth Form (40%) */}
      {showAuthForm && (
        <div className="w-2/5 h-full bg-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-l from-gray-900 via-gray-900/95 to-transparent pointer-events-none" />
          
          {/* Glass Card */}
          <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl shadow-2xl p-8 flex flex-col items-center border border-gray-700/50 mx-8">
            {/* Logo */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent-500/20 mb-6 shadow-lg backdrop-blur-sm">
              <svg className="w-6 h-6 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            
            {/* Title */}
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              Prob
            </h2>
            
            {/* Form */}
            <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit}>
              <div className="w-full flex flex-col gap-3">
                <input
                  placeholder="Email"
                  type="email"
                  value={email}
                  className="w-full px-5 py-3 rounded-xl bg-gray-800/50 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:bg-gray-800/70 transition-all duration-300 backdrop-blur-sm border border-gray-700/30"
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                <input
                  placeholder="Password"
                  type="password"
                  value={password}
                  className="w-full px-5 py-3 rounded-xl bg-gray-800/50 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:bg-gray-800/70 transition-all duration-300 backdrop-blur-sm border border-gray-700/30"
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                {displayError && (
                  <div className="text-sm text-red-400 text-left px-1">
                    {displayError}
                  </div>
                )}
              </div>
              
              <hr className="opacity-10 border-gray-600" />

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent-500/20 hover:bg-accent-500/30 text-white font-medium px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 mb-3 text-sm backdrop-blur-sm border border-accent-500/30 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-600/40"
                >
                  {loading ? 'Please wait...' : (isSignUp ? 'Sign up' : 'Sign in')}
                </button>
                
                <div className="w-full text-center mt-4">
                  <span className="text-xs text-gray-400">
                    {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="underline text-accent-500 hover:text-accent-400 transition-colors duration-200"
                      disabled={loading}
                    >
                      {isSignUp ? 'Sign in' : 'Sign up, it\'s free!'}
                    </button>
                  </span>
                </div>
              </div>
            </form>
          </div>
          
          {/* User count and avatars */}
          <div className="relative z-10 mt-12 flex flex-col items-center text-center px-8">
            <p className="text-gray-400 text-sm mb-2">
              Join <span className="font-medium text-white">thousands</span> of teams
              discovering problems that matter.
            </p>
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 border-2 border-gray-900"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-gray-900"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 border-2 border-gray-900"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-accent-500 border-2 border-gray-900"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const DemoCanvas: React.FC<DemoCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <DemoCanvasContent {...props} />
    </ReactFlowProvider>
  );
};