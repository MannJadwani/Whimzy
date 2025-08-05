"use client";

import React, { useRef, useEffect, useState } from 'react';
import { RetroButton } from '@/components/ui/RetroButton';

interface CodeRunnerProps {
  gameCode: string;
  title?: string;
  onSave?: () => void;
  onCopyCode?: () => void;
  onDownload?: () => void;
}

export function CodeRunner({ 
  gameCode, 
  title = "Game Preview",
  onSave,
  onCopyCode,
  onDownload
}: CodeRunnerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (iframeRef.current && gameCode) {
      try {
        const iframe = iframeRef.current;
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        
        if (doc) {
          // Clear previous content
          doc.open();
          doc.write(gameCode);
          doc.close();
          setIsLoading(false);
          setError(null);
        }
      } catch (err) {
        console.error('Error loading game code:', err);
        setError('Failed to load game preview');
        setIsLoading(false);
      }
    }
  }, [gameCode]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setError('Failed to load game preview');
    setIsLoading(false);
  };

  const handleFullscreenPlay = () => {
    // Open game in a new window for true fullscreen experience
    const newWindow = window.open('', '_blank', 'fullscreen=yes,scrollbars=no,menubar=no,toolbar=no,location=no,status=no');
    if (newWindow) {
      newWindow.document.write(gameCode);
      newWindow.document.close();
      newWindow.focus();
    }
  };



  return (
    <div className="h-full flex flex-col bg-gray-900/80 backdrop-blur-sm border-2 border-purple-400/50 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800/90 border-b border-purple-400/30">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
          <h3 className="text-white font-mono font-bold tracking-wider">{title}</h3>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <RetroButton size="sm" variant="primary" onClick={handleFullscreenPlay}>
            ▶️ PLAY FULLSCREEN
          </RetroButton>
          {onSave && (
            <RetroButton size="sm" variant="secondary" onClick={onSave}>
              SAVE
            </RetroButton>
          )}
          {onCopyCode && (
            <RetroButton size="sm" variant="accent" onClick={onCopyCode}>
              📋 COPY CODE
            </RetroButton>
          )}
          {onDownload && (
            <RetroButton size="sm" variant="primary" onClick={onDownload}>
              DOWNLOAD
            </RetroButton>
          )}
        </div>
      </div>

      {/* Game Preview */}
      <div className="flex-1 relative bg-gray-950 group cursor-pointer" onClick={handleFullscreenPlay}>
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100">
          <div className="bg-black/80 px-6 py-3 rounded-lg border border-purple-400/50">
            <div className="flex items-center gap-3 text-white font-mono">
              <span className="text-2xl">▶️</span>
              <span className="font-bold">Click to Play Fullscreen</span>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-20">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-300 font-mono text-sm">Loading game...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-20">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-3">
                <span className="text-red-400 text-xl">⚠</span>
              </div>
              <p className="text-red-300 font-mono text-sm">{error}</p>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          className="w-full h-full border-0 pointer-events-none"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          sandbox="allow-scripts allow-same-origin"
          title="Game Preview"
        />
      </div>

      {/* Footer Status */}
      <div className="px-4 py-2 bg-gray-800/90 border-t border-purple-400/30">
        <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
          <span>Status: {isLoading ? 'Loading...' : error ? 'Error' : 'Running'}</span>
          <span>Sandbox: Enabled</span>
        </div>
      </div>


    </div>
  );
}