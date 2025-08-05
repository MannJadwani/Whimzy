"use client";

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PixelBackground } from '@/components/ui/PixelBackground';
import { RetroNavbar } from '@/components/ui/RetroNavbar';
import { PromptInput } from '@/components/ui/PromptInput';
import { SignInModal } from '@/components/ui/SignInModal';
import { GameType } from '@/components/ui/GameTypeSelector';
import { useState } from 'react';

export default function Builder() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string>('');
  const [pendingGameType, setPendingGameType] = useState<GameType>('2d');

  const handlePromptSubmit = useCallback(async (prompt: string, gameType: GameType) => {
    if (!session) {
      // Store the prompt and game type, then show signin modal
      setPendingPrompt(prompt);
      setPendingGameType(gameType);
      setShowSignInModal(true);
      return;
    }

    // Generate a new game ID and redirect to the dynamic route with parameters
    const newGameId = `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const params = new URLSearchParams();
    params.set('prompt', prompt);
    params.set('gameType', gameType);
    
    router.push(`/builder/${newGameId}?${params.toString()}`);
  }, [router, session]);

  const handleCloseModal = useCallback(() => {
    setShowSignInModal(false);
    setPendingPrompt('');
    setPendingGameType('2d');
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <PixelBackground />
      <RetroNavbar />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-20">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-mono font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                🎮 GAME BUILDER
              </span>
            </h1>
            <p className="text-gray-300 font-mono text-lg mb-2">
              Describe your dream game and watch AI bring it to life!
            </p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-400" />
              <span className="text-purple-200 font-mono text-sm tracking-widest font-bold">
                START CREATING
              </span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-400" />
            </div>
          </div>

          {/* Game Creation Form */}
          <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-purple-400/50 rounded-lg p-6">
            <PromptInput
              onSubmit={handlePromptSubmit}
              placeholder="Describe your game idea... (e.g., 'Make a space shooter with power-ups')"
              className="w-full"
            />
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm font-mono">
              AI will generate your game instantly • No coding required
            </p>
          </div>
        </div>
      </div>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={handleCloseModal}
        prompt={pendingPrompt}
        gameType={pendingGameType}
      />
    </div>
  );
} 