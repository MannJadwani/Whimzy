"use client";

import React from 'react';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { RetroButton } from './RetroButton';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!isOpen || !session?.user) return null;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
    onClose();
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="absolute top-16 right-4 bg-gray-900/95 backdrop-blur-sm border-2 border-purple-400/50 rounded-lg overflow-hidden shadow-2xl shadow-purple-500/25 w-80 max-w-[calc(100vw-2rem)] sm:w-72">
        
        {/* Dropdown arrow */}
        <div className="absolute -top-2 right-6 w-4 h-4 bg-gray-900 border-l-2 border-t-2 border-purple-400/50 transform rotate-45" />
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header with profile info */}
        <div className="relative bg-gradient-to-r from-purple-600/20 to-cyan-600/20 p-6 text-center border-b border-purple-400/30">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative">
            {/* Profile Image */}
            <div className="w-20 h-20 mx-auto mb-4 relative">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'Profile'}
                  width={80}
                  height={80}
                  className="rounded-full border-2 border-purple-400/50"
                  priority
                />
              ) : (
                <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center border-2 border-purple-400/50">
                  <span className="text-2xl">👤</span>
                </div>
              )}
              {/* Online indicator */}
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900" />
            </div>

            <h2 className="text-xl font-mono font-bold text-white mb-1">
              {session.user.name || 'Anonymous Player'}
            </h2>
            <p className="text-gray-300 font-mono text-sm">
              {session.user.email}
            </p>
            
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-300" />
              <span className="text-purple-200 font-mono text-xs tracking-widest font-bold">
                PLAYER PROFILE
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-300" />
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-6 space-y-3">
          <RetroButton
            size="lg"
            variant="secondary"
            onClick={() => handleNavigate('/my-games')}
            className="w-full flex items-center justify-center gap-3"
          >
            <span className="text-lg">📁</span>
            MY GAMES
          </RetroButton>

          <RetroButton
            size="lg"
            variant="secondary"
            onClick={() => handleNavigate('/settings')}
            className="w-full flex items-center justify-center gap-3"
          >
            <span className="text-lg">⚙️</span>
            SETTINGS
          </RetroButton>

          <RetroButton
            size="lg"
            variant="secondary"
            onClick={() => handleNavigate('/pricing')}
            className="w-full flex items-center justify-center gap-3"
          >
            <span className="text-lg">💎</span>
            UPGRADE
          </RetroButton>

          {/* Divider */}
          <div className="h-px bg-gray-700 my-4" />

          <RetroButton
            size="lg"
            variant="accent"
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-3"
          >
            <span className="text-lg">🚪</span>
            SIGN OUT
          </RetroButton>
        </div>

        {/* Footer Stats */}
        <div className="bg-gray-800/50 p-4 border-t border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-mono font-bold text-cyan-300">5</div>
              <div className="text-xs text-gray-400 font-mono">Messages</div>
            </div>
            <div>
              <div className="text-lg font-mono font-bold text-purple-300">3</div>
              <div className="text-xs text-gray-400 font-mono">Games</div>
            </div>
            <div>
              <div className="text-lg font-mono font-bold text-green-300">FREE</div>
              <div className="text-xs text-gray-400 font-mono">Plan</div>
            </div>
          </div>
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