"use client";

import React, { useState, useCallback } from 'react';
import { CodeRunner } from '@/components/gameBuilder/CodeRunner';
import { ChatInterface } from '@/components/gameBuilder/ChatInterface';
import { FloatingNav } from '@/components/gameBuilder/FloatingNav';
import { PixelBackground } from '@/components/ui/PixelBackground';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { useGames, useAppState } from '@/context/AppContext';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
}

export function GameBuilderPage() {
  const { currentGame } = useGames();
  const { isLoading } = useAppState();
  
  // Sample game code for demonstration
  const [gameCode, setGameCode] = useState(`
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
  `);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to Whimzy Game Builder! Your game preview is ready.',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'ai',
      content: 'Hi! I\'ve created a basic game template for you. You can ask me to modify it in any way - change colors, add features, or completely redesign it. What would you like to do?',
      timestamp: new Date()
    }
  ]);

  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleSendMessage = useCallback(async (message: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsChatLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I understand you want to: "${message}". I'm working on updating your game now! The changes will appear in the preview shortly.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsChatLoading(false);

      // TODO: Integrate with actual AI game generation logic
      console.log('User requested:', message);
    }, 2000);
  }, []);

  const handleSave = useCallback(() => {
    console.log('Saving game...');
    // TODO: Implement save functionality
  }, []);

  const handleExport = useCallback(() => {
    console.log('Exporting game...');
    // TODO: Implement export functionality
  }, []);

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

  return (
    <div className="h-screen relative overflow-hidden">
      <PixelBackground />
      <FloatingNav />
      
      {isLoading && <LoadingOverlay message="LOADING GAME BUILDER..." />}
      
             <div className="relative z-10 h-full flex flex-col sm:flex-row">
         {/* Code Runner - Top on mobile, left on desktop */}
         <div className="flex-1 p-2 sm:p-3 lg:p-4 h-1/2 md:h-full">
           <CodeRunner
             gameCode={gameCode}
             title={currentGame?.title || "Game Preview"}
             onSave={handleSave}
             onExport={handleExport}
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