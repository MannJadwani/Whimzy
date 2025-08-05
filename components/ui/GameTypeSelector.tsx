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
    description: 'Simple 2D games using HTML, CSS, and JavaScript',
    icon: '🎮',
    tech: 'HTML/CSS/JS',
    features: ['Quick to build', 'Lightweight', 'Great for beginners', 'Retro style']
  },
  {
    id: 'advanced-2d',
    title: 'Advanced 2D',
    description: 'Feature-rich 2D games with Phaser.js framework',
    icon: '🚀',
    tech: 'Phaser.js',
    features: ['Physics engine', 'Animations', 'Sound system', 'Advanced features']
  },
  {
    id: '3d',
    title: '3D Games',
    description: 'Immersive 3D experiences with Three.js',
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
            
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{option.icon}</span>
              <div>
                <h4 className="font-mono font-bold text-white text-sm">{option.title}</h4>
                <p className="text-xs text-gray-400 font-mono">{option.tech}</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-300 font-mono mb-3 leading-relaxed">
              {option.description}
            </p>
            
            <div className="space-y-1">
              {option.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                  <span className="text-xs text-gray-400 font-mono">{feature}</span>
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}