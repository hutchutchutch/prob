import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DemoCanvas } from '@/components/DemoCanvas';

interface AuthFormProps {
  onAuthSuccess?: () => void;
}

export function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const { signInWithEmail, signUpWithEmail, error, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      {/* Demo Canvas Background Animation */}
      <div className="absolute inset-0 z-0 opacity-50">
        <DemoCanvas showAuthForm={false} />
      </div>
      
      {/* Auth Form Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        {/* Glass Card */}
        <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl shadow-2xl p-8 flex flex-col items-center border border-gray-700/50">
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
        <div className="relative z-10 mt-12 flex flex-col items-center text-center">
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
    </div>
  );
} 