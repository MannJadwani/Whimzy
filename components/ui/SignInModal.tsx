"use client";

import React from 'react';
import { signIn } from 'next-auth/react';
import { RetroButton } from './RetroButton';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt?: string;
  gameType?: string;
}

export function SignInModal({ isOpen, onClose, prompt, gameType }: SignInModalProps) {
  if (!isOpen) return null;

  const handleSignIn = async () => {
    let callbackUrl = '/builder';
    
    if (prompt) {
      const params = new URLSearchParams();
      params.set('prompt', prompt);
      if (gameType) {
        params.set('gameType', gameType);
      }
      callbackUrl = `/builder?${params.toString()}`;
    }
    
    await signIn('google', { callbackUrl });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-gray-900/95 backdrop-blur-sm border-2 border-purple-400/50 rounded-lg overflow-hidden shadow-2xl shadow-purple-500/25 w-full max-w-md mx-auto my-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600/20 to-cyan-600/20 p-6 text-center border-b border-purple-400/30">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative">
            <h2 className="text-2xl font-mono font-bold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent mb-2">
              🎮 SIGN IN TO CREATE
            </h2>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-300" />
              <span className="text-purple-200 font-mono text-sm tracking-widest font-bold">
                BUILD YOUR GAME
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-300" />
            </div>
            <p className="text-gray-300 font-mono text-sm">
              Sign in to bring your game idea to life!
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {prompt && (
            <div className="mb-6 p-4 bg-gray-800/50 border border-purple-400/30 rounded-lg">
              <h3 className="text-cyan-300 font-mono font-bold text-sm mb-2">YOUR GAME IDEA:</h3>
              <p className="text-gray-300 font-mono text-sm leading-relaxed">
                "{prompt}"
              </p>
            </div>
          )}

          <div className="space-y-4">
            <RetroButton
              size="lg"
              variant="primary"
              onClick={handleSignIn}
              className="w-full flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="currentColor"/>
              </svg>
              SIGN IN WITH GOOGLE
            </RetroButton>

            <p className="text-gray-400 text-xs font-mono text-center">
              Free plan includes 5 AI messages per day
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800/50 p-4 text-center border-t border-gray-700">
          <p className="text-gray-400 text-xs font-mono">
            By signing in, you agree to our Terms of Service
          </p>
        </div>

        {/* Pixel corner decorations */}
        <div className="absolute top-1 left-1 w-2 h-2 bg-purple-400 opacity-60" />
        <div className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 opacity-60" />
        <div className="absolute bottom-1 left-1 w-2 h-2 bg-cyan-400 opacity-60" />
        <div className="absolute bottom-1 right-1 w-2 h-2 bg-purple-400 opacity-60" />
      </div>
    </div>
  );
}