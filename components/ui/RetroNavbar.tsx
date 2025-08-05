"use client";

import React from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";
import { RetroButton } from './RetroButton';
import { useUser } from '@/context/AppContext';

export function RetroNavbar() {
  const { data: session } = useSession();
  const { user } = useUser();

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
              href="/dashboard" 
              className="text-gray-300 hover:text-pink-400 font-mono text-sm tracking-wide transition-colors"
            >
              DASHBOARD
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {session?.user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2">
                  {session.user.image && (
                    <img 
                      src={session.user.image} 
                      alt="Profile" 
                      className="w-8 h-8 rounded border-2 border-purple-400"
                    />
                  )}
                  <span className="text-gray-300 font-mono text-sm">
                    {session.user.name || session.user.email}
                  </span>
                </div>
                <RetroButton 
                  variant="secondary" 
                  size="sm"
                  onClick={() => signOut()}
                >
                  SIGN OUT
                </RetroButton>
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
    </nav>
  );
}