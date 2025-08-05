"use client";

import React from 'react';

export type GameType = '2d' | 'advanced-2d' | '3d';

export interface GameTypeOption {
  id: GameType;
  title: string;
  description: string;
  icon: string;
  tech: string;
  features: string[];
}

const gameTypeOptions: GameTypeOption[] = [
  {
    id: '2d',
    title: '2D Classic',
    description: '',
    icon: '🎮',
    tech: 'HTML/CSS/JS',
    features: ['Quick to build', 'Lightweight', 'Great for beginners', 'Retro style']
  },
  {
    id: 'advanced-2d',
    title: 'Advanced 2D',
    description: '',
    icon: '🚀',
    tech: 'Phaser.js',
    features: ['Physics engine', 'Animations', 'Sound system', 'Advanced features']
  },
  {
    id: '3d',
    title: '3D Games',
    description: '',
    icon: '🌐',
    tech: 'Three.js',
    features: ['3D graphics', 'WebGL powered', 'Realistic physics', 'Modern visuals']
  }
];

interface GameTypeSelectorProps {
  selectedType: GameType;
  onTypeChange: (type: GameType) => void;
  className?: string;
}

export function GameTypeSelector({ selectedType, onTypeChange, className = '' }: GameTypeSelectorProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-mono font-bold text-white mb-2">Choose Game Type</h3>
        <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {gameTypeOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onTypeChange(option.id)}
            className={`relative p-4 rounded-lg border-2 transition-all duration-300 text-left ${
              selectedType === option.id
                ? 'border-purple-400 bg-purple-400/20 shadow-lg shadow-purple-400/25'
                : 'border-gray-600 bg-gray-800/50 hover:border-purple-400/50 hover:bg-gray-700/50'
            }`}
          >
            {/* Selection indicator */}
            {selectedType === option.id && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
            )}
            
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">{option.icon}</span>
              <h4 className="font-mono font-bold text-white text-lg">{option.title}</h4>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}