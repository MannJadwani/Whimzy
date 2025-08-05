"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export interface DatabaseGame {
  id: string;
  title: string;
  description?: string;
  prompt: string;
  gameType: 'TWO_D' | 'THREE_D' | 'ADVANCED_TWO_D';
  gameCode?: string;
  thumbnailUrl?: string;
  isPublic: boolean;
  isFeatured: boolean;
  views: number;
  plays: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
  lastPlayedAt?: string;
  user: {
    id: string;
    name?: string;
    image?: string;
  };
  _count?: {
    gameLikes: number;
    gameSessions: number;
  };
}

export interface GamesPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export function useUserGames() {
  const { data: session, status } = useSession();
  const [games, setGames] = useState<DatabaseGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<GamesPagination>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  const fetchUserGames = useCallback(async (page = 1, filters?: { gameType?: string }) => {
    if (status === 'loading') return;
    if (!session?.user) {
      setGames([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        public: 'false' // Get user's own games
      });

      if (filters?.gameType && filters.gameType !== 'all') {
        params.append('gameType', filters.gameType.toUpperCase());
      }

      const response = await fetch(`/api/games?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }

      const data = await response.json();
      
      setGames(data.games || []);
      setPagination(data.pagination);
      
    } catch (err) {
      console.error('Error fetching user games:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch games');
    } finally {
      setIsLoading(false);
    }
  }, [session, status, pagination.limit]);

  const updateGame = useCallback(async (gameId: string, updates: Partial<DatabaseGame>) => {
    try {
      const response = await fetch(`/api/games/${gameId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Failed to update game');
      }

      const data = await response.json();
      
      // Update local state
      setGames(prev => prev.map(game => 
        game.id === gameId ? data.game : game
      ));

      return data.game;
    } catch (err) {
      console.error('Error updating game:', err);
      throw err;
    }
  }, []);

  const deleteGame = useCallback(async (gameId: string) => {
    try {
      const response = await fetch(`/api/games/${gameId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete game');
      }

      // Remove from local state
      setGames(prev => prev.filter(game => game.id !== gameId));
      
    } catch (err) {
      console.error('Error deleting game:', err);
      throw err;
    }
  }, []);

  // Fetch games on mount and when session changes
  useEffect(() => {
    fetchUserGames();
  }, [fetchUserGames]);

  return {
    games,
    isLoading,
    error,
    pagination,
    fetchUserGames,
    updateGame,
    deleteGame,
    refetch: () => fetchUserGames(pagination.page)
  };
}