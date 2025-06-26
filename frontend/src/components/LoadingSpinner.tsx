import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Main Spinner */}
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-white/20 rounded-full animate-spin">
          <div className="w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
        </div>
        
        {/* Inner ring */}
        <div className="absolute inset-2 w-12 h-12 border-4 border-white/10 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}>
          <div className="w-12 h-12 border-4 border-transparent border-t-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        
        {/* Center dot */}
        <div className="absolute inset-6 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full pulse-glow"></div>
      </div>

      {/* Loading text */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold gradient-text animate-fade-in">
          Loading Platformatory Labs
        </h3>
        <div className="flex space-x-1 justify-center">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner; 