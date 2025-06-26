import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
// import { SearchParams } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-bg opacity-20"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className={`max-w-md w-full space-y-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Logo Section */}
          <div className="text-center space-y-4">
            <div className={`mx-auto h-20 w-20 glass rounded-2xl flex items-center justify-center float ${mounted ? 'animate-scale-in' : ''}`}>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center glow-purple">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-30 animate-pulse"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className={`text-4xl font-bold gradient-text ${mounted ? 'animate-slide-up stagger-1' : ''}`}>
                Platformatory Labs
              </h1>
              <p className={`text-lg text-white/80 ${mounted ? 'animate-slide-up stagger-2' : ''}`}>
                Next-Gen Profile Management
              </p>
            </div>
          </div>

          {/* Login Card */}
          <div className={`card space-y-6 ${mounted ? 'animate-slide-up stagger-3' : ''}`}>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">
                Welcome Back
              </h2>
              <p className="text-white/60">
                Sign in to access your profile dashboard
              </p>
            </div>

            {/* Login Button */}
            <div className="space-y-4">
              <button
                onClick={login}
                className="btn-primary w-full group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center space-x-3">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            {/* Features Preview */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-white/70">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Secure OAuth2 Authentication</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-white/70">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Real-time Profile Management</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-white/70">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Temporal Workflow Integration</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-white/70">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span>External API Synchronization</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`text-center space-y-4 ${mounted ? 'animate-slide-up stagger-4' : ''}`}>
            <div className="glass-dark rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-2">🚀 Demo Features</h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-white/70">
                <div>• Google OAuth2</div>
                <div>• Temporal Workflows</div>
                <div>• Real-time Updates</div>
                <div>• API Integration</div>
              </div>
            </div>
            
            <p className="text-xs text-white/50">
              Built with React, TypeScript, and Node.js
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"></div>
    </div>
  );
};

export default LoginPage; 