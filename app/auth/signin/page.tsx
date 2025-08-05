"use client";

import React, { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PixelBackground } from '@/components/ui/PixelBackground';
import { RetroButton } from '@/components/ui/RetroButton';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSignIn = async (provider: string) => {
    setIsLoading(provider);
    try {
      await signIn(provider, { callbackUrl });
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <PixelBackground />
      
      {/* Back to Home Link */}
      <Link 
        href="/"
        className="absolute top-6 left-6 z-50 flex items-center space-x-2 group"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center font-mono font-bold text-gray-900 text-sm transition-transform group-hover:scale-110">
          W
        </div>
        <span className="font-mono font-bold text-xl text-white tracking-wider group-hover:text-purple-300 transition-colors">
          WHIMZY
        </span>
      </Link>

      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        {/* Main Auth Card */}
        <div className="bg-gray-900/90 backdrop-blur-sm border-2 border-purple-400/50 rounded-lg overflow-hidden shadow-2xl shadow-purple-500/25">
          
          {/* Header */}
          <div className="relative bg-gradient-to-r from-purple-600/20 to-cyan-600/20 p-8 text-center border-b border-purple-400/30">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative">
              <h1 className="text-4xl font-mono font-bold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent mb-2">
                WELCOME BACK
              </h1>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-300" />
                <span className="text-purple-200 font-mono text-sm tracking-widest font-bold">
                  PLAYER LOGIN
                </span>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-300" />
              </div>
              <p className="text-gray-300 font-mono text-sm">
                Choose your authentication method to enter the game
              </p>
            </div>
          </div>

          {/* Auth Options */}
          <div className="p-8 space-y-4">
            
            {/* Google Sign In */}
            <RetroButton
              size="lg"
              variant="primary"
              onClick={() => handleSignIn('google')}
              disabled={isLoading === 'google'}
              className="w-full flex items-center justify-center gap-3 text-base"
            >
              {isLoading === 'google' ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="currentColor"/>
                </svg>
              )}
              SIGN IN WITH GOOGLE
            </RetroButton>



          </div>

          {/* Footer */}
          <div className="bg-gray-800/50 p-6 text-center border-t border-gray-700">
            <p className="text-gray-400 text-xs font-mono mb-2">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
            <div className="flex justify-center space-x-6 text-xs font-mono">
              <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-purple-400 hover:text-purple-300 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

        </div>

        {/* Floating Game Elements */}
        <div className="absolute -top-8 -left-8 w-16 h-16 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 rounded animate-pulse" />
        </div>
        <div className="absolute -top-4 -right-12 w-12 h-12 opacity-30">
          <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full animate-bounce" />
        </div>
        <div className="absolute -bottom-8 -right-8 w-20 h-20 opacity-15">
          <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-400 transform rotate-45 animate-spin" 
               style={{ animationDuration: '8s' }} />
        </div>
        <div className="absolute -bottom-4 -left-12 w-14 h-14 opacity-25">
          <div className="w-full h-full bg-gradient-to-br from-green-400 to-teal-400 rounded-lg animate-pulse" />
        </div>

        {/* Pixel corner decorations */}
        <div className="absolute top-2 left-2 w-3 h-3 bg-purple-400 opacity-60" />
        <div className="absolute top-2 right-2 w-3 h-3 bg-cyan-400 opacity-60" />
        <div className="absolute bottom-2 left-2 w-3 h-3 bg-cyan-400 opacity-60" />
        <div className="absolute bottom-2 right-2 w-3 h-3 bg-purple-400 opacity-60" />
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 opacity-40 animate-ping" />
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-cyan-400 opacity-60 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-pink-400 opacity-50 animate-bounce" />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-yellow-400 opacity-40 animate-pulse" />
      </div>
    </div>
  );
}