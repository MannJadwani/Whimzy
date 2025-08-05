"use client";

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { PromptInput } from '@/components/ui/PromptInput';
import { PixelBackground } from '@/components/ui/PixelBackground';
import { FloatingImages } from '@/components/ui/FloatingImages';
import { RetroNavbar } from '@/components/ui/RetroNavbar';
import { SignInModal } from '@/components/ui/SignInModal';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { useAppState } from '@/context/AppContext';
import { useGameGeneration } from '@/hooks/useGameGeneration';
import { GameType } from '@/components/ui/GameTypeSelector';



export function LandingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { isLoading, error, clearError } = useAppState();
  const { generateGame } = useGameGeneration();
  
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
    
    try {
      const game = await generateGame(prompt, gameType);
      
      console.log('Generated game:', game);
      
      // Navigate to builder with the generated game
      router.push('/builder');
      
    } catch (error) {
      // Error handling is done in the hook
      console.error('Game generation failed:', error);
    }
  }, [generateGame, router, session]);

  const handleCloseModal = useCallback(() => {
    setShowSignInModal(false);
    setPendingPrompt('');
    setPendingGameType('2d');
  }, []);



  return (
    <div className="min-h-screen relative overflow-hidden">
      <PixelBackground />
      <FloatingImages />
      <RetroNavbar />
      
      {isLoading && <LoadingOverlay message="GENERATING YOUR GAME..." />}
      
      <div className="relative z-10 container mx-auto px-4 py-4 ">
        <div className="flex flex-col items-center justify-center min-h-screen max-w-6xl mx-auto">
          
          {/* Main Title */}
          <div className="text-center mb-16">
            <h1 className="text-7xl text-white md:text-9xl font-bold mb-6 bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent font-mono tracking-wider drop-shadow-2xl">
              WHIMZY
            </h1>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-purple-300 shadow-lg shadow-purple-400/50" />
              <span className="text-purple-200 font-mono text-xl tracking-widest font-bold text-white">AI GAME BUILDER</span>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-cyan-300 shadow-lg shadow-cyan-400/50" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 font-mono tracking-wide drop-shadow-lg">
              WHAT GAME DO YOU WANT TO BUILD?
            </h2>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="w-full max-w-2xl mb-8">
              <ErrorAlert 
                message={error}
                onRetry={() => clearError()}
                onDismiss={() => clearError()}
              />
            </div>
          )}

          {/* Main Input Section - Centered and Prominent */}
          <div className="w-full max-w-3xl mb-20">
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border-2 border-purple-400/70 rounded-xl p-8 shadow-2xl shadow-purple-400/40 hover:shadow-cyan-400/30 transition-all duration-500">
              <PromptInput 
                onSubmit={handlePromptSubmit}
                placeholder="Describe your dream game... (e.g., 'Create a 2D platformer with a ninja in a cyberpunk city')"
              />
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-6 text-sm text-white font-mono">
              <span className="flex items-center gap-2 bg-purple-900/30 px-3 py-2 rounded-lg border border-purple-400/30">
                <div className="w-3 h-3 bg-purple-300 animate-pulse rounded-full shadow-lg shadow-purple-400/50" />
                2D & 3D GAMES
              </span>
              <span className="flex items-center gap-2 bg-cyan-900/30 px-3 py-2 rounded-lg border border-cyan-400/30">
                <div className="w-3 h-3 bg-cyan-300 animate-pulse rounded-full shadow-lg shadow-cyan-400/50" />
                POWERED BY AI
              </span>
              <span className="flex items-center gap-2 bg-pink-900/30 px-3 py-2 rounded-lg border border-pink-400/30">
                <div className="w-3 h-3 bg-pink-300 animate-pulse rounded-full shadow-lg shadow-pink-400/50" />
                NO CODE REQUIRED
              </span>
            </div>
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