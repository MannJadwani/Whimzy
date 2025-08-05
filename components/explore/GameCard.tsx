"use client";

import React from 'react';
import { RetroButton } from '@/components/ui/RetroButton';

export interface GameData {
  id: string;
  title: string;
  description: string;
  author: string;
  thumbnail: string;
  gameType: '2D' | '3D';
  tags: string[];
  plays: number;
  likes: number;
  createdAt: string;
  gameCode?: string;
}

interface GameCardProps {
  game: GameData;
  onPreview: (game: GameData) => void;
  onRemix: (game: GameData) => void;
  className?: string;
}

export function GameCard({ game, onPreview, onRemix, className = "" }: GameCardProps) {
  return (
    <div className={`
      group relative bg-gray-900/80 backdrop-blur-sm border-2 border-purple-400/30 
      hover:border-cyan-400/60 rounded-lg overflow-hidden 
      transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1
      shadow-lg hover:shadow-purple-500/25
      flex flex-col w-full min-h-[400px]
      ${className}
    `}>
      {/* Thumbnail */}
      <div className="relative h-48 bg-gray-800 overflow-hidden">
        <img
          src={game.thumbnail}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Overlay with play button */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={() => onPreview(game)}
            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
          >
            <span className="text-white text-2xl ml-1">▶</span>
          </button>
        </div>

        {/* Game type badge */}
        <div className="absolute top-3 left-3">
          <span className={`
            px-2 py-1 text-xs font-mono font-bold rounded
            ${game.gameType === '2D' 
              ? 'bg-purple-500/80 text-purple-100' 
              : 'bg-cyan-500/80 text-cyan-100'
            }
          `}>
            {game.gameType}
          </span>
        </div>

        {/* Stats overlay */}
        <div className="absolute bottom-3 right-3 flex gap-2">
          <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-mono">
            ▶ {game.plays}
          </div>
          <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-mono">
            ❤ {game.likes}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-white font-mono font-bold text-lg mb-2 tracking-wide">
          {game.title}
        </h3>
        
        <p className="text-gray-300 text-sm font-mono leading-relaxed mb-3 line-clamp-2">
          {game.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-gray-400 text-xs font-mono">by</span>
          <span className="text-cyan-300 text-xs font-mono font-bold">{game.author}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {game.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs font-mono rounded border border-gray-600/30"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-auto">
          <RetroButton
            size="sm"
            variant="secondary"
            onClick={() => onPreview(game)}
            className="flex-1"
          >
            PREVIEW
          </RetroButton>
          <RetroButton
            size="sm"
            variant="accent"
            onClick={() => onRemix(game)}
            className="flex-1"
          >
            REMIX
          </RetroButton>
        </div>
      </div>

      {/* Pixel corner decorations */}
      <div className="absolute top-1 left-1 w-2 h-2 bg-purple-400 opacity-60" />
      <div className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 opacity-60" />
      <div className="absolute bottom-1 left-1 w-2 h-2 bg-cyan-400 opacity-60" />
      <div className="absolute bottom-1 right-1 w-2 h-2 bg-purple-400 opacity-60" />
    </div>
  );
}