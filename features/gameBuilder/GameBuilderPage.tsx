"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CodeRunner } from '@/components/gameBuilder/CodeRunner';
import { ChatInterface } from '@/components/gameBuilder/ChatInterface';
import { FloatingNav } from '@/components/gameBuilder/FloatingNav';
import { PixelBackground } from '@/components/ui/PixelBackground';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { useGames, useAppState } from '@/context/AppContext';
import { useGameGeneration } from '@/hooks/useGameGeneration';
import { useGameSession } from '@/hooks/useGameSession';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
}

interface GameBuilderPageProps {
  gameId?: string;
}

export function GameBuilderPage({ gameId }: GameBuilderPageProps) {
  const { currentGame } = useGames();
  const { isLoading } = useAppState();
  const { generateGame } = useGameGeneration();
  const searchParams = useSearchParams();
  const [hasProcessedPrompt, setHasProcessedPrompt] = useState(false);
  
  // Use game session hook if gameId is provided
  const gameSession = useGameSession(gameId || '');
  const isSessionLoading = gameSession.isLoading;
  
  // Use session data or fallback for game code
  const gameCode = gameSession.session?.gameCode || `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Whimzy Game</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background: linear-gradient(45deg, #1a1a2e, #16213e);
            color: #fff;
            font-family: 'Courier New', monospace;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .game-container {
            text-align: center;
            border: 2px solid #8b5cf6;
            border-radius: 10px;
            padding: 30px;
            background: rgba(139, 92, 246, 0.1);
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
        }
        .pixel-character {
            font-size: 48px;
            animation: bounce 2s infinite;
        }
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
        .game-title {
            color: #8b5cf6;
            margin-bottom: 20px;
            text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
        }
        .start-button {
            background: linear-gradient(45deg, #8b5cf6, #06b6d4);
            border: none;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-family: inherit;
            font-weight: bold;
            margin-top: 20px;
            transition: transform 0.2s;
        }
        .start-button:hover {
            transform: scale(1.05);
        }
    </style>
</head>
<body>
    <div class="game-container">
        <h1 class="game-title">🎮 WHIMZY GAME 🎮</h1>
        <div class="pixel-character">🤖</div>
        <p>Your AI-generated game will appear here!</p>
        <button class="start-button" onclick="alert('Game started! Chat with AI to modify it.')">START GAME</button>
    </div>
</body>
</html>
  `;

  // Use session messages
  const messages = gameSession.session?.messages || [];
  const sessionTitle = gameSession.session?.title || `Game ${gameId}`;

  // Handle prompt from URL (from landing page signin flow)
  useEffect(() => {
    const promptFromUrl = searchParams.get('prompt');
    if (promptFromUrl && promptFromUrl.trim() && !hasProcessedPrompt && !isSessionLoading && gameSession.session) {
      setHasProcessedPrompt(true);
      
      // Add the user's original prompt to chat using session
      gameSession.addMessage({
        type: 'user',
        content: promptFromUrl
      });
      
      // Generate game based on the prompt
      generateGame(promptFromUrl).then((game) => {
        // Update the session with the generated game code
        if (game?.gameCode) {
          gameSession.updateGameCode(game.gameCode);
        }
        
        // Add AI response using session
        gameSession.addMessage({
          type: 'ai',
          content: `Great! I've created a game based on your idea: "${promptFromUrl}". You can see the game above and ask me to make any changes or improvements!`
        });
      }).catch((error) => {
        console.error('Error generating game from prompt:', error);
        gameSession.addMessage({
          type: 'ai',
          content: `I encountered an error while creating your game. Let me try a different approach. Can you describe your game idea again?`
        });
      });
      
      // Clear the prompt from URL to avoid re-triggering
      if (typeof window !== 'undefined' && window.history.replaceState) {
        const url = new URL(window.location.href);
        url.searchParams.delete('prompt');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [searchParams, generateGame, hasProcessedPrompt, isSessionLoading, gameSession]);

  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!gameSession.session) return;

    // Add user message using session
    gameSession.addMessage({
      type: 'user',
      content: message
    });
    
    setIsChatLoading(true);

    try {
      // Send message to Gemini API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          gameCode,
          chatHistory: messages.slice(-10) // Send last 10 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      // Add AI response using session
      gameSession.addMessage({
        type: 'ai',
        content: data.response
      });

      // If the response contains game code, update the game
      let codeMatch = data.response.match(/```html\n([\s\S]*?)\n```/);
      if (!codeMatch) {
        // Try without language specifier
        codeMatch = data.response.match(/```\n([\s\S]*?)\n```/);
      }
      if (!codeMatch) {
        // Try with different HTML patterns
        codeMatch = data.response.match(/```html([\s\S]*?)```/);
      }
      
      if (codeMatch && codeMatch[1]) {
        const cleanCode = codeMatch[1].trim();
        if (cleanCode.includes('<html') || cleanCode.includes('<!DOCTYPE')) {
          gameSession.updateGameCode(cleanCode);
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      gameSession.addMessage({
        type: 'ai',
        content: 'Sorry, I encountered an error processing your request. Please try again.'
      });
    } finally {
      setIsChatLoading(false);
    }
  }, [gameSession, gameCode, messages]);

  const handleSave = useCallback(() => {
    console.log('Saving game...');
    // TODO: Implement save functionality
  }, []);

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(gameCode);
      // You could add a toast notification here if you have one
      console.log('Game code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy code:', err);
      // Fallback: select and copy manually
      const textArea = document.createElement('textarea');
      textArea.value = gameCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }, [gameCode]);

  const handleDownload = useCallback(() => {
    console.log('Downloading game...');
    // Create download link for the HTML file
    const blob = new Blob([gameCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'whimzy-game.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [gameCode]);

  // Show loading if session is still loading
  if (isSessionLoading) {
    return (
      <div className="h-screen relative overflow-hidden bg-gray-900 flex items-center justify-center">
        <PixelBackground />
        <div className="text-white font-mono text-center">
          <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-4" />
          Loading game session...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen relative overflow-hidden">
      <PixelBackground />
      <FloatingNav gameCode={gameCode} onCopyCode={handleCopyCode} />
      
      {isLoading && <LoadingOverlay message="LOADING GAME BUILDER..." />}
      
             <div className="relative z-10 h-full flex flex-col sm:flex-row">
         {/* Code Runner - Top on mobile, left on desktop */}
         <div className="flex-1 p-2 sm:p-3 lg:p-4 h-1/2 md:h-full">
           <CodeRunner
             gameCode={gameCode}
             title={currentGame?.title || "Game Preview"}
             onSave={handleSave}
             onCopyCode={handleCopyCode}
             onDownload={handleDownload}
           />
         </div>
         
         {/* Chat Interface - Bottom on mobile, right on desktop */}
         <div className="w-full md:w-80 lg:w-96 xl:w-[28rem] p-2 sm:p-3 lg:p-4 h-1/2 md:h-full flex-1">
           <ChatInterface
             messages={messages}
             onSendMessage={handleSendMessage}
             isLoading={isChatLoading}
           />
         </div>
       </div>
    </div>
  );
}