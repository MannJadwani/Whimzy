"use client";

import { useState, useEffect, useCallback } from 'react';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
}

interface GameSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  gameCode: string;
  createdAt: Date;
  lastModified: Date;
}

const DEFAULT_GAME_CODE = `
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
            display: inline-block;
        }
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(-5px);
            }
        }
        .game-title {
            font-size: 24px;
            margin: 20px 0;
            color: #a855f7;
            text-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
        }
    </style>
</head>
<body>
    <div class="game-container">
        <div class="pixel-character">🎮</div>
        <h1 class="game-title">Welcome to Whimzy!</h1>
        <p>Your awesome game will appear here!</p>
    </div>
</body>
</html>
`;

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 'system-1',
    type: 'system',
    content: 'Welcome to Whimzy Game Builder! Your game preview is ready.',
    timestamp: new Date()
  },
  {
    id: 'ai-1',
    type: 'ai',
    content: 'Hi! I\'ve created a basic game template for you. You can ask me to modify it in any way - change colors, add features, or completely redesign it. What would you like to do?',
    timestamp: new Date()
  }
];

export function useGameSession(gameId: string) {
  const [session, setSession] = useState<GameSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load or create game session
  useEffect(() => {
    if (!gameId) return;

    setIsLoading(true);
    
    // Try to load existing session from localStorage
    const savedSession = localStorage.getItem(`game-session-${gameId}`);
    
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        // Convert timestamp strings back to Date objects
        parsed.messages = parsed.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        parsed.createdAt = new Date(parsed.createdAt);
        parsed.lastModified = new Date(parsed.lastModified);
        
        setSession(parsed);
      } catch (error) {
        console.error('Error loading game session:', error);
        createNewSession();
      }
    } else {
      createNewSession();
    }
    
    setIsLoading(false);

    function createNewSession() {
      const newSession: GameSession = {
        id: gameId,
        title: `Game ${gameId.split('-')[1]}`, // Extract timestamp for title
        messages: [...DEFAULT_MESSAGES],
        gameCode: DEFAULT_GAME_CODE,
        createdAt: new Date(),
        lastModified: new Date()
      };
      setSession(newSession);
    }
  }, [gameId]);

  // Save session to localStorage whenever it changes
  useEffect(() => {
    if (session && !isLoading) {
      localStorage.setItem(`game-session-${session.id}`, JSON.stringify(session));
    }
  }, [session, isLoading]);

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    if (!session) return;

    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    setSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: [...prev.messages, newMessage],
        lastModified: new Date()
      };
    });
  }, [session]);

  const updateGameCode = useCallback((newCode: string) => {
    if (!session) return;

    setSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        gameCode: newCode,
        lastModified: new Date()
      };
    });
  }, [session]);

  const updateTitle = useCallback((newTitle: string) => {
    if (!session) return;

    setSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        title: newTitle,
        lastModified: new Date()
      };
    });
  }, [session]);

  const clearSession = useCallback(() => {
    if (!session) return;
    
    localStorage.removeItem(`game-session-${session.id}`);
    setSession(null);
  }, [session]);

  return {
    session,
    isLoading,
    addMessage,
    updateGameCode,
    updateTitle,
    clearSession
  };
}