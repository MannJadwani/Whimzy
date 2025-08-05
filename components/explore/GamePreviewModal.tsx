"use client";

import React, { useRef, useEffect } from 'react';
import { GameData } from './GameCard';
import { RetroButton } from '@/components/ui/RetroButton';

interface GamePreviewModalProps {
  game: GameData | null;
  isOpen: boolean;
  onClose: () => void;
  onRemix: (game: GameData) => void;
}

export function GamePreviewModal({ game, isOpen, onClose, onRemix }: GamePreviewModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isOpen && game && iframeRef.current) {
      // Load game code into iframe
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (doc && game.gameCode) {
        doc.open();
        doc.write(game.gameCode);
        doc.close();
      }
    }
  }, [isOpen, game]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !game) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900/95 backdrop-blur-sm border-2 border-purple-400/50 rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-400/30">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
            <div>
              <h2 className="text-white font-mono font-bold text-xl tracking-wider">
                {game.title}
              </h2>
              <p className="text-gray-400 font-mono text-sm">
                by {game.author} • {game.gameType} Game
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <RetroButton
              size="sm"
              variant="accent"
              onClick={() => onRemix(game)}
            >
              🔧 REMIX
            </RetroButton>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-red-500/20 hover:bg-red-500/40 rounded border border-red-400/30 hover:border-red-400/60 transition-colors duration-200 flex items-center justify-center"
            >
              <span className="text-red-400 font-mono font-bold">✕</span>
            </button>
          </div>
        </div>

        {/* Game Content */}
        <div className="flex-1 flex">
          {/* Game Preview */}
          <div className="flex-1 bg-gray-950 relative">
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
              title={`Preview: ${game.title}`}
            />
          </div>

          {/* Game Info Sidebar */}
          <div className="w-80 p-4 bg-gray-800/50 border-l border-purple-400/30 overflow-y-auto">
            <div className="space-y-4">
              {/* Description */}
              <div>
                <h3 className="text-cyan-300 font-mono font-bold text-sm mb-2 tracking-wider">
                  DESCRIPTION
                </h3>
                <p className="text-gray-300 font-mono text-sm leading-relaxed">
                  {game.description}
                </p>
              </div>

              {/* Stats */}
              <div>
                <h3 className="text-cyan-300 font-mono font-bold text-sm mb-2 tracking-wider">
                  STATS
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                  <div className="bg-purple-900/30 p-2 rounded border border-purple-400/30">
                    <div className="text-purple-300">Plays</div>
                    <div className="text-white font-bold">{game.plays}</div>
                  </div>
                  <div className="bg-pink-900/30 p-2 rounded border border-pink-400/30">
                    <div className="text-pink-300">Likes</div>
                    <div className="text-white font-bold">{game.likes}</div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-cyan-300 font-mono font-bold text-sm mb-2 tracking-wider">
                  TAGS
                </h3>
                <div className="flex flex-wrap gap-1">
                  {game.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs font-mono rounded border border-gray-600/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Created Date */}
              <div>
                <h3 className="text-cyan-300 font-mono font-bold text-sm mb-2 tracking-wider">
                  CREATED
                </h3>
                <p className="text-gray-300 font-mono text-sm">
                  {new Date(game.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4">
                <RetroButton
                  size="md"
                  variant="accent"
                  onClick={() => onRemix(game)}
                  className="w-full"
                >
                  🔧 REMIX THIS GAME
                </RetroButton>
                <RetroButton
                  size="md"
                  variant="secondary"
                  onClick={() => {/* TODO: Implement download */}}
                  className="w-full"
                >
                  📥 DOWNLOAD
                </RetroButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}