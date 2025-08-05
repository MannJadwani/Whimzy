"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from "next-auth/react";
import { RetroButton } from './RetroButton';
import { ProfileModal } from './ProfileModal';
import { useUser } from '@/context/AppContext';

export function RetroNavbar() {
  const { data: session } = useSession();
  const { user } = useUser();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <nav className="relative z-50 bg-gray-900/90 backdrop-blur-sm border-b-2 border-purple-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 absolute top-0 left-0 right-0">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center font-mono font-bold text-gray-900 text-sm transition-transform group-hover:scale-110">
              W
            </div>
            <span className="font-mono font-bold text-xl text-white tracking-wider group-hover:text-purple-300 transition-colors">
              WHIMZY
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-300 hover:text-green-400 font-mono text-sm tracking-wide transition-colors"
            >
              HOME
            </Link>
            <Link 
              href="/gallery" 
              className="text-gray-300 hover:text-cyan-400 font-mono text-sm tracking-wide transition-colors"
            >
              GALLERY
            </Link>
            <Link 
              href="/pricing" 
              className="text-gray-300 hover:text-purple-400 font-mono text-sm tracking-wide transition-colors"
            >
              PRICING
            </Link>
            <Link 
              href="/my-games" 
              className="text-gray-300 hover:text-yellow-400 font-mono text-sm tracking-wide transition-colors"
            >
              MY GAMES
            </Link>
            <Link 
              href="/settings" 
              className="text-gray-300 hover:text-orange-400 font-mono text-sm tracking-wide transition-colors"
            >
              SETTINGS
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {session?.user ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center space-x-2 hover:bg-gray-800/50 rounded-lg p-2 transition-colors"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-purple-400"
                      priority
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center border-2 border-purple-400">
                      <span className="text-sm">👤</span>
                    </div>
                  )}
                  <span className="hidden sm:block text-gray-300 font-mono text-sm">
                    {session.user.name || session.user.email}
                  </span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            ) : (
              <RetroButton 
                variant="primary" 
                size="sm"
                onClick={handleSignIn}
              >
                SIGN IN
              </RetroButton>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation (TODO: Implement mobile menu) */}
      <div className="md:hidden">
        {/* Mobile menu button and dropdown will go here */}
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </nav>
  );
}