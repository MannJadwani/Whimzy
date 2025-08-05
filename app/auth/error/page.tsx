"use client";

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PixelBackground } from '@/components/ui/PixelBackground';
import { RetroButton } from '@/components/ui/RetroButton';
import Link from 'next/link';

const ERROR_MESSAGES: { [key: string]: string } = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The sign in link is no longer valid. It may have been used already or it may have expired.',
  Default: 'An unexpected error occurred during authentication.',
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error') || 'Default';
  
  const errorMessage = ERROR_MESSAGES[error] || ERROR_MESSAGES.Default;

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
        {/* Error Card */}
        <div className="bg-gray-900/90 backdrop-blur-sm border-2 border-red-400/50 rounded-lg overflow-hidden shadow-2xl shadow-red-500/25">
          
          {/* Header */}
          <div className="relative bg-gradient-to-r from-red-600/20 to-orange-600/20 p-8 text-center border-b border-red-400/30">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative">
              {/* Error Icon */}
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-4xl">⚠️</span>
              </div>
              
              <h1 className="text-3xl font-mono font-bold bg-gradient-to-r from-red-300 to-orange-300 bg-clip-text text-transparent mb-2">
                AUTHENTICATION ERROR
              </h1>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-300" />
                <span className="text-red-200 font-mono text-sm tracking-widest font-bold">
                  ACCESS DENIED
                </span>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-orange-300" />
              </div>
            </div>
          </div>

          {/* Error Content */}
          <div className="p-8 text-center">
            <p className="text-gray-300 font-mono text-sm leading-relaxed mb-6">
              {errorMessage}
            </p>

            {/* Error Code */}
            <div className="bg-gray-800/50 border border-red-400/30 rounded p-3 mb-6">
              <span className="text-red-400 font-mono text-xs">ERROR CODE: {error.toUpperCase()}</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <RetroButton
                size="lg"
                variant="primary"
                onClick={() => router.push('/auth/signin')}
                className="w-full"
              >
                TRY AGAIN
              </RetroButton>
              
              <RetroButton
                size="lg"
                variant="secondary"
                onClick={() => router.push('/')}
                className="w-full"
              >
                RETURN HOME
              </RetroButton>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-800/50 p-6 text-center border-t border-gray-700">
            <p className="text-gray-400 text-xs font-mono mb-2">
              If this problem persists, please contact support
            </p>
            <div className="flex justify-center space-x-6 text-xs font-mono">
              <Link href="/support" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Get Help
              </Link>
              <Link href="/contact" className="text-purple-400 hover:text-purple-300 transition-colors">
                Contact Support
              </Link>
            </div>
          </div>

        </div>

        {/* Floating Error Elements */}
        <div className="absolute -top-8 -left-8 w-16 h-16 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-red-400 to-orange-400 rounded animate-pulse" />
        </div>
        <div className="absolute -top-4 -right-12 w-12 h-12 opacity-30">
          <div className="w-full h-full bg-gradient-to-br from-red-500 to-pink-500 rounded-full animate-bounce" />
        </div>
        <div className="absolute -bottom-8 -right-8 w-20 h-20 opacity-15">
          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-400 transform rotate-45 animate-spin" 
               style={{ animationDuration: '8s' }} />
        </div>

        {/* Pixel corner decorations */}
        <div className="absolute top-2 left-2 w-3 h-3 bg-red-400 opacity-60" />
        <div className="absolute top-2 right-2 w-3 h-3 bg-orange-400 opacity-60" />
        <div className="absolute bottom-2 left-2 w-3 h-3 bg-orange-400 opacity-60" />
        <div className="absolute bottom-2 right-2 w-3 h-3 bg-red-400 opacity-60" />
      </div>
    </div>
  );
}