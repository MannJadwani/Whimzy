"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types for our application state
export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  subscription?: 'FREE' | 'PRO';
}

export interface Game {
  id: string;
  title: string;
  description?: string;
  prompt: string;
  gameType: '2D' | '3D';
  gameCode?: string;
  isPublic: boolean;
  createdAt: string;
  views: number;
  plays: number;
}

export interface PromptHistory {
  id: string;
  prompt: string;
  timestamp: string;
  gameId?: string;
}

export interface AppState {
  user: User | null;
  currentGame: Game | null;
  games: Game[];
  promptHistory: PromptHistory[];
  isLoading: boolean;
  error: string | null;
}

// Action types
type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_CURRENT_GAME'; payload: Game | null }
  | { type: 'ADD_GAME'; payload: Game }
  | { type: 'UPDATE_GAME'; payload: Partial<Game> & { id: string } }
  | { type: 'SET_GAMES'; payload: Game[] }
  | { type: 'ADD_PROMPT_HISTORY'; payload: PromptHistory }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: AppState = {
  user: null,
  currentGame: null,
  games: [],
  promptHistory: [],
  isLoading: false,
  error: null,
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_CURRENT_GAME':
      return { ...state, currentGame: action.payload };
    
    case 'ADD_GAME':
      return { 
        ...state, 
        games: [action.payload, ...state.games],
        currentGame: action.payload 
      };
    
    case 'UPDATE_GAME':
      const updatedGames = state.games.map(game =>
        game.id === action.payload.id ? { ...game, ...action.payload } : game
      );
      const updatedCurrentGame = state.currentGame?.id === action.payload.id
        ? { ...state.currentGame, ...action.payload }
        : state.currentGame;
      
      return {
        ...state,
        games: updatedGames,
        currentGame: updatedCurrentGame,
      };
    
    case 'SET_GAMES':
      return { ...state, games: action.payload };
    
    case 'ADD_PROMPT_HISTORY':
      return {
        ...state,
        promptHistory: [action.payload, ...state.promptHistory.slice(0, 49)] // Keep last 50
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
}

// Context creation
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider component
export function AppContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
}

// Additional custom hooks for specific functionality
export function useUser() {
  const { state, dispatch } = useAppContext();
  
  const setUser = (user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  return { user: state.user, setUser };
}

export function useGames() {
  const { state, dispatch } = useAppContext();

  const addGame = (game: Game) => {
    dispatch({ type: 'ADD_GAME', payload: game });
  };

  const updateGame = (gameUpdate: Partial<Game> & { id: string }) => {
    dispatch({ type: 'UPDATE_GAME', payload: gameUpdate });
  };

  const setCurrentGame = (game: Game | null) => {
    dispatch({ type: 'SET_CURRENT_GAME', payload: game });
  };

  const setGames = (games: Game[]) => {
    dispatch({ type: 'SET_GAMES', payload: games });
  };

  return {
    games: state.games,
    currentGame: state.currentGame,
    addGame,
    updateGame,
    setCurrentGame,
    setGames,
  };
}

export function usePromptHistory() {
  const { state, dispatch } = useAppContext();

  const addPromptToHistory = (prompt: string, gameId?: string) => {
    const historyItem: PromptHistory = {
      id: Math.random().toString(36).substr(2, 9),
      prompt,
      timestamp: new Date().toISOString(),
      gameId,
    };
    dispatch({ type: 'ADD_PROMPT_HISTORY', payload: historyItem });
  };

  return {
    promptHistory: state.promptHistory,
    addPromptToHistory,
  };
}

export function useAppState() {
  const { state, dispatch } = useAppContext();

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return {
    isLoading: state.isLoading,
    error: state.error,
    setLoading,
    setError,
    clearError,
  };
}