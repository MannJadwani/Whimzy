"use client";

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="relative w-full h-full">
        {/* Outer ring */}
        <div className="absolute inset-0 border-2 border-purple-500/30 rounded-full" />
        
        {/* Spinning ring */}
        <div className="absolute inset-0 border-2 border-transparent border-t-purple-400 border-r-cyan-400 rounded-full animate-spin" />
        
        {/* Inner pixels */}
        <div className="absolute inset-2 flex items-center justify-center">
          <div className="w-1 h-1 bg-purple-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = "GENERATING..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900/90 border-2 border-purple-500/50 rounded-lg p-8 text-center backdrop-blur-sm">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-white font-mono text-lg tracking-wider">{message}</p>
        <div className="mt-4 flex justify-center space-x-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}