"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { RetroButton } from '@/components/ui/RetroButton';

export function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 left-4 z-50">
      {/* Main floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 rounded-lg shadow-lg shadow-purple-500/25 hover:shadow-cyan-500/25 flex items-center justify-center transition-all duration-300 transform hover:scale-105"
      >
        <span className="text-white font-mono text-xl font-bold">
          {isOpen ? '✕' : '☰'}
        </span>
      </button>

      {/* Navigation menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 bg-gray-900/95 backdrop-blur-sm border-2 border-purple-400/50 rounded-lg p-4 shadow-xl min-w-48">
          <div className="flex flex-col gap-3">
            {/* Logo/Title */}
            <div className="text-center mb-2">
              <h3 className="text-white font-mono font-bold text-lg tracking-wider">
                WHIMZY
              </h3>
              <div className="h-px bg-gradient-to-r from-purple-400 to-cyan-400 mt-1" />
            </div>

            {/* Navigation Links */}
            <Link href="/" onClick={() => setIsOpen(false)}>
              <RetroButton variant="secondary" size="sm" className="w-full">
                🏠 HOME
              </RetroButton>
            </Link>
            
            <Link href="/gallery" onClick={() => setIsOpen(false)}>
              <RetroButton variant="accent" size="sm" className="w-full">
                🎮 GALLERY
              </RetroButton>
            </Link>
            
            <Link href="/pricing" onClick={() => setIsOpen(false)}>
              <RetroButton variant="primary" size="sm" className="w-full">
                💎 PRICING
              </RetroButton>
            </Link>

            {/* Divider */}
            <div className="h-px bg-gray-700 my-1" />

            {/* Quick Actions */}
            <div className="text-xs text-gray-400 font-mono text-center">
              Quick Actions
            </div>
            <RetroButton variant="secondary" size="sm" className="w-full text-xs">
              💾 SAVE PROJECT
            </RetroButton>
            <RetroButton variant="accent" size="sm" className="w-full text-xs">
              📤 EXPORT GAME
            </RetroButton>
          </div>
        </div>
      )}
    </div>
  );
}