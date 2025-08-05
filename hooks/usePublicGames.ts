"use client";

import { useState, useEffect, useCallback } from 'react';
import { DatabaseGame, GamesPagination } from './useUserGames';

export function usePublicGames() {
  const [games, setGames] = useState<DatabaseGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<GamesPagination>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  const fetchPublicGames = useCallback(async (
    page = 1, 
    filters?: { 
      gameType?: string;
      search?: string;
    }
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        public: 'true' // Get public games only
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
      console.error('Error fetching public games:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch games');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.limit]);

  const likeGame = useCallback(async (gameId: string) => {
    try {
      // TODO: Implement like API endpoint
      const response = await fetch(`/api/games/${gameId}/like`, {
        method: 'POST'
      });

      if (response.ok) {
        // Update local state optimistically
        setGames(prev => prev.map(game => 
          game.id === gameId 
            ? { ...game, likes: game.likes + 1 }
            : game
        ));
      }
    } catch (err) {
      console.error('Error liking game:', err);
    }
  }, []);

  const playGame = useCallback(async (gameId: string) => {
    try {
      // Track play count
      const response = await fetch(`/api/games/${gameId}`, {
        method: 'GET'
      });

      if (response.ok) {
        const data = await response.json();
        // Update local state with incremented play count
        setGames(prev => prev.map(game => 
          game.id === gameId 
            ? { ...game, plays: data.game.plays }
            : game
        ));
        return data.game;
      }
    } catch (err) {
      console.error('Error tracking game play:', err);
    }
  }, []);

  // Fetch games on mount
  useEffect(() => {
    fetchPublicGames();
  }, [fetchPublicGames]);

  return {
    games,
    isLoading,
    error,
    pagination,
    fetchPublicGames,
    likeGame,
    playGame,
    refetch: () => fetchPublicGames(pagination.page)
  };
}