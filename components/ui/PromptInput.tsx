"use client";

import React, { useState, useCallback } from 'react';
import { usePromptHistory, useAppState } from '@/context/AppContext';
import { GameTypeSelector, GameType } from './GameTypeSelector';

interface PromptInputProps {
  onSubmit: (prompt: string, gameType: GameType) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showGameTypeSelector?: boolean;
}

export function PromptInput({ 
  onSubmit, 
  placeholder = "Describe your dream game...", 
  disabled = false,
  className = "",
  showGameTypeSelector = true
}: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [gameType, setGameType] = useState<GameType>('2d');
  const { addPromptToHistory } = usePromptHistory();
  const { isLoading } = useAppState();

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim() || disabled || isLoading) return;

    // Add to history and trigger submission
    addPromptToHistory(prompt.trim());
    onSubmit(prompt.trim(), gameType);
    
    // Clear the input
    setPrompt('');
  }, [prompt, gameType, disabled, isLoading, addPromptToHistory, onSubmit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  }, [handleSubmit]);

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      {/* Game Type Selector */}
      {showGameTypeSelector && (
        <div className="mb-6">
          <GameTypeSelector
            selectedType={gameType}
            onTypeChange={setGameType}
          />
        </div>
      )}
      
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          rows={4}
          className={`
            w-full px-6 py-4 
            bg-gray-800/90 border-2 border-purple-400/70 
            rounded-lg text-white placeholder-gray-300
            focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30
            focus:shadow-lg focus:shadow-cyan-400/20
            resize-none transition-all duration-300
            font-mono text-lg
            ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            backdrop-blur-sm
          `}
        />
        
        {/* Character count */}
        <div className="absolute bottom-2 right-3 text-xs text-gray-400">
          {prompt.length}/500
        </div>
      </div>
      
      <button
        type="submit"
        disabled={!prompt.trim() || disabled || isLoading}
        className={`
          mt-4 w-full py-4 px-6
          bg-gradient-to-r from-purple-500 to-cyan-500
          hover:from-purple-400 hover:to-cyan-400
          text-white font-bold text-lg
          rounded-lg transition-all duration-300
          transform hover:scale-[1.02] active:scale-[0.98]
          shadow-xl shadow-purple-500/40 hover:shadow-cyan-500/40
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          font-mono tracking-wide
          ${isLoading ? 'animate-pulse' : ''}
        `}
      >
        {isLoading ? 'GENERATING...' : 'BUILD GAME'}
      </button>
      
      <p className="mt-2 text-xs text-gray-400 text-center font-mono">
        Press Cmd/Ctrl + Enter to submit
      </p>
    </form>
  );
}