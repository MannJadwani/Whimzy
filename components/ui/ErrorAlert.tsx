"use client";

import React from 'react';
import { RetroButton } from './RetroButton';

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorAlert({ 
  message, 
  onRetry, 
  onDismiss, 
  className = "" 
}: ErrorAlertProps) {
  return (
    <div className={`
      bg-red-900/80 border-2 border-red-500/50 rounded-lg p-6 
      backdrop-blur-sm max-w-md mx-auto
      ${className}
    `}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-6 h-6 bg-red-500 flex items-center justify-center font-mono font-bold text-white text-sm">
          !
        </div>
        <h3 className="font-mono font-bold text-red-300 tracking-wide">
          ERROR
        </h3>
      </div>
      
      <p className="text-red-100 font-mono text-sm mb-6 leading-relaxed">
        {message}
      </p>
      
      <div className="flex gap-3">
        {onRetry && (
          <RetroButton 
            variant="accent" 
            size="sm" 
            onClick={onRetry}
            className="flex-1"
          >
            RETRY
          </RetroButton>
        )}
        {onDismiss && (
          <RetroButton 
            variant="secondary" 
            size="sm" 
            onClick={onDismiss}
            className="flex-1"
          >
            DISMISS
          </RetroButton>
        )}
      </div>
    </div>
  );
}