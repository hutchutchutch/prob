import React, { useState } from 'react';
import { useLangGraph, AppState } from '../hooks/useLangGraph';
import { Button } from './common/Button';
import { Input } from './common/Input';

export function LangGraphDemo() {
  const [problemStatement, setProblemStatement] = useState('');
  const [projectId, setProjectId] = useState('');
  
  const {
    isRunning,
    currentState,
    error,
    progress,
    runProblemToSolutionWorkflow,
    runStep,
    validateProblem,
    generatePersonas,
    generateSolutions,
    testConnection,
    healthCheck,
    reset,
    isWorkflowComplete,
    hasErrors,
    workflowProgress
  } = useLangGraph({
    onStepComplete: (step, state) => {
      console.log(`Step completed: ${step}`, state);
    },
    onError: (error) => {
      console.error('Workflow error:', error);
    },
    onProgress: (progress) => {
      console.log('Progress:', progress);
    }
  });

  const handleRunFullWorkflow = async () => {
    if (!problemStatement.trim()) {
      alert('Please enter a problem statement');
      return;
    }
    
    await runProblemToSolutionWorkflow(problemStatement, projectId || undefined);
  };

  const handleValidateOnly = async () => {
    if (!problemStatement.trim()) {
      alert('Please enter a problem statement');
      return;
    }
    
    try {
      const result = await validateProblem(problemStatement);
      console.log('Validation result:', result);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleTestConnection = async () => {
    const isConnected = await testConnection();
    alert(`Connection test: ${isConnected ? 'SUCCESS' : 'FAILED'}`);
  };

  const handleHealthCheck = async () => {
    const health = await healthCheck();
    console.log('Health check:', health);
    const status = Object.values(health).every(v => v) ? 'ALL SYSTEMS HEALTHY' : 'SOME SYSTEMS DOWN';
    alert(`Health check: ${status}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">LangGraph Orchestrator Demo</h1>
      
      {/* Connection Status */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">System Status</h2>
        <div className="space-x-2">
          <Button onClick={handleTestConnection} variant="secondary">
            Test Connection
          </Button>
          <Button onClick={handleHealthCheck} variant="secondary">
            Health Check
          </Button>
        </div>
      </div>

      {/* Input Form */}
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Problem Input</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Problem Statement</label>
            <textarea
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              className="w-full p-2 border rounded"
              rows={4}
              placeholder="Describe the problem you want to solve..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Project ID (optional)</label>
            <Input
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="Enter project ID for database saving"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Actions</h2>
        <div className="space-x-2 space-y-2">
          <Button 
            onClick={handleRunFullWorkflow} 
            disabled={isRunning || !problemStatement.trim()}
            className="mr-2"
          >
            {isRunning ? 'Running...' : 'Run Full Workflow'}
          </Button>
          <Button 
            onClick={handleValidateOnly}
            disabled={isRunning || !problemStatement.trim()}
            variant="secondary"
            className="mr-2"
          >
            Validate Problem Only
          </Button>
          <Button 
            onClick={reset}
            variant="secondary"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Progress Display */}
      {(isRunning || workflowProgress.progressPercentage > 0) && (
        <div className="mb-6 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Progress</h2>
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Current Step: {progress.currentStep}</span>
              <span>{workflowProgress.progressPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${workflowProgress.progressPercentage}%` }}
              />
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Completed: {workflowProgress.completedSteps.join(', ')}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 border border-red-300 rounded-lg bg-red-50">
          <h2 className="text-xl font-semibold mb-2 text-red-800">Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {currentState && (
        <div className="mb-6 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          
          {/* Workflow Status */}
          <div className="mb-4">
            <div className="flex items-center space-x-4 text-sm">
              <span className={`px-2 py-1 rounded ${
                isWorkflowComplete ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {isWorkflowComplete ? 'Complete' : 'In Progress'}
              </span>
              {hasErrors && (
                <span className="px-2 py-1 rounded bg-red-100 text-red-800">
                  Has Errors
                </span>
              )}
            </div>
          </div>

          {/* Problem Validation */}
          {currentState.validatedProblem && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Problem Validation</h3>
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>Valid:</strong> {currentState.validatedProblem.is_valid ? 'Yes' : 'No'}</p>
                <p><strong>Problem:</strong> {currentState.validatedProblem.validated_problem}</p>
                <p><strong>Feedback:</strong> {currentState.validatedProblem.feedback}</p>
              </div>
            </div>
          )}

          {/* Personas */}
          {currentState.personas && currentState.personas.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Personas ({currentState.personas.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentState.personas.map((persona, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <h4 className="font-medium">{persona.name}</h4>
                    <p className="text-sm text-gray-600">{persona.role}</p>
                    <p className="text-sm">{persona.demographics}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Solutions */}
          {currentState.solutions && currentState.solutions.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Solutions ({currentState.solutions.length})</h3>
              <div className="space-y-3">
                {currentState.solutions.map((solution, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <h4 className="font-medium">{solution.name}</h4>
                    <p className="text-sm text-gray-600 mb-1">{solution.description}</p>
                    <p className="text-sm"><strong>Complexity:</strong> {solution.complexity}/10</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw State (for debugging) */}
          <details className="mt-4">
            <summary className="cursor-pointer font-medium">Raw State (Debug)</summary>
            <pre className="mt-2 p-3 bg-gray-900 text-green-400 rounded text-xs overflow-auto">
              {JSON.stringify(currentState, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
} 