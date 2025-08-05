"use client";

import React, { useState } from 'react';
import { PixelBackground } from '@/components/ui/PixelBackground';
import { RetroNavbar } from '@/components/ui/RetroNavbar';
import { RetroButton } from '@/components/ui/RetroButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useGames } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { useUserGames, DatabaseGame } from '@/hooks/useUserGames';
import { useSession } from 'next-auth/react';

interface SavedGame {
  id: string;
  title: string;
  description: string;
  gameType: '2D' | '3D';
  createdAt: string;
  lastModified: string;
  plays: number;
  isPublic: boolean;
  thumbnail?: string;
}

// Database-backed games are now loaded via useUserGames hook

const GameCard = ({ game, onEdit, onDelete, onToggleVisibility }: {
  game: DatabaseGame;
  onEdit: (game: DatabaseGame) => void;
  onDelete: (gameId: string) => void;
  onToggleVisibility: (gameId: string, isPublic: boolean) => void;
}) => {
  const getGameTypeDisplay = (type: string) => {
    switch (type) {
      case 'THREE_D': return '3D';
      case 'ADVANCED_TWO_D': return 'ADV 2D';
      default: return '2D';
    }
  };

  return (
  <div className="group relative bg-gray-900/80 backdrop-blur-sm border-2 border-purple-400/30 hover:border-cyan-400/60 rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 shadow-lg hover:shadow-purple-500/25 flex flex-col w-full min-h-[400px]">
    {/* Thumbnail */}
    <div className="relative h-48 bg-gray-800 overflow-hidden">
      {game.thumbnailUrl ? (
        <img
          src={game.thumbnailUrl}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-cyan-600">
          <span className="text-6xl">🎮</span>
        </div>
      )}
      
      {/* Game type badge */}
      <div className="absolute top-3 left-3">
        <span className={`px-2 py-1 text-xs font-mono font-bold rounded ${game.gameType === 'TWO_D' ? 'bg-purple-500/80 text-purple-100' : 'bg-cyan-500/80 text-cyan-100'}`}>
          {getGameTypeDisplay(game.gameType)}
        </span>
      </div>

      {/* Visibility badge */}
      <div className="absolute top-3 right-3">
        <span className={`px-2 py-1 text-xs font-mono font-bold rounded ${game.isPublic ? 'bg-green-500/80 text-green-100' : 'bg-gray-500/80 text-gray-100'}`}>
          {game.isPublic ? 'PUBLIC' : 'PRIVATE'}
        </span>
      </div>

      {/* Stats overlay */}
      <div className="absolute bottom-3 right-3">
        <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-mono">
          ▶ {game.plays} plays
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="p-4 flex-1 flex flex-col">
      <h3 className="text-white font-mono font-bold text-lg mb-2 tracking-wide">
        {game.title}
      </h3>
      
      <p className="text-gray-300 text-sm font-mono leading-relaxed mb-3 line-clamp-2 flex-1">
        {game.description}
      </p>

      <div className="text-gray-400 text-xs font-mono mb-4 space-y-1">
        <div>Created: {new Date(game.createdAt).toLocaleDateString()}</div>
        <div>Modified: {new Date(game.updatedAt).toLocaleDateString()}</div>
        <div>Views: {game.views} • Likes: {game.likes}</div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2">
        <RetroButton
          size="sm"
          variant="primary"
          onClick={() => onEdit(game)}
          className="text-xs"
        >
          EDIT
        </RetroButton>
        <RetroButton
          size="sm"
          variant="secondary"
          onClick={() => onToggleVisibility(game.id, !game.isPublic)}
          className="text-xs"
        >
          {game.isPublic ? 'HIDE' : 'PUBLISH'}
        </RetroButton>
      </div>
      
      <RetroButton
        size="sm"
        variant="accent"
        onClick={() => onDelete(game.id)}
        className="text-xs mt-2"
      >
        DELETE
      </RetroButton>
    </div>

    {/* Pixel corner decorations */}
    <div className="absolute top-1 left-1 w-2 h-2 bg-purple-400 opacity-60" />
    <div className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 opacity-60" />
    <div className="absolute bottom-1 left-1 w-2 h-2 bg-cyan-400 opacity-60" />
    <div className="absolute bottom-1 right-1 w-2 h-2 bg-purple-400 opacity-60" />
  </div>
);
};

export default function MyGamesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { setCurrentGame } = useGames();
  const { games, isLoading, error, updateGame, deleteGame, refetch } = useUserGames();
  const [filter, setFilter] = useState<'all' | 'TWO_D' | 'THREE_D' | 'public' | 'private'>('all');

  const filteredGames = games.filter(game => {
    switch (filter) {
      case 'TWO_D':
        return game.gameType === 'TWO_D';
      case 'THREE_D':
        return game.gameType === 'THREE_D';
      case 'public':
        return game.isPublic;
      case 'private':
        return !game.isPublic;
      default:
        return true;
    }
  });

  const handleEdit = (game: DatabaseGame) => {
    // Convert to the format expected by the game builder
    const gameForBuilder = {
      id: game.id,
      title: game.title,
      description: game.description || '',
      prompt: game.prompt,
      gameType: (game.gameType === 'THREE_D' ? '3D' : '2D') as '2D' | '3D',
      gameCode: game.gameCode || '',
      isPublic: game.isPublic,
      createdAt: game.createdAt,
      views: game.views,
      plays: game.plays
    };
    
    setCurrentGame(gameForBuilder);
    router.push(`/builder/${game.id}`);
  };

  const handleDelete = async (gameId: string) => {
    if (confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
      try {
        await deleteGame(gameId);
      } catch (error) {
        alert('Failed to delete game. Please try again.');
      }
    }
  };

  const handleToggleVisibility = async (gameId: string, isPublic: boolean) => {
    try {
      await updateGame(gameId, { isPublic });
    } catch (error) {
      alert('Failed to update game visibility. Please try again.');
    }
  };

  const handleCreateNew = () => {
    router.push('/builder');
  };

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <PixelBackground />
        <LoadingSpinner />
      </div>
    );
  }

  // Redirect to signin if not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="min-h-screen relative">
      <PixelBackground />
      <RetroNavbar />
      
      <div className="relative z-10 pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent font-mono tracking-wider drop-shadow-2xl">
              MY GAMES
            </h1>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-purple-300" />
              <span className="text-purple-200 font-mono text-lg tracking-widest font-bold">
                CREATE • MANAGE • SHARE
              </span>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-cyan-300" />
            </div>
            <p className="text-gray-300 font-mono text-lg max-w-2xl mx-auto mb-8">
              Manage your game creations, edit existing projects, and share your masterpieces with the world!
            </p>
            
            {/* Create New Game Button */}
            <RetroButton
              size="lg"
              variant="accent"
              onClick={handleCreateNew}
              className="mb-8"
            >
              + CREATE NEW GAME
            </RetroButton>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
            <div className="bg-gray-900/60 backdrop-blur-sm border border-purple-400/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-mono font-bold text-cyan-300">{games.length}</div>
              <div className="text-gray-400 text-sm font-mono">Total Games</div>
            </div>
            <div className="bg-gray-900/60 backdrop-blur-sm border border-purple-400/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-mono font-bold text-purple-300">{games.filter(g => g.isPublic).length}</div>
              <div className="text-gray-400 text-sm font-mono">Published</div>
            </div>
            <div className="bg-gray-900/60 backdrop-blur-sm border border-purple-400/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-mono font-bold text-green-300">{games.reduce((sum, g) => sum + g.plays, 0)}</div>
              <div className="text-gray-400 text-sm font-mono">Total Plays</div>
            </div>
            <div className="bg-gray-900/60 backdrop-blur-sm border border-purple-400/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-mono font-bold text-yellow-300">{games.filter(g => g.gameType === 'TWO_D').length}/{games.filter(g => g.gameType === 'THREE_D').length}</div>
              <div className="text-gray-400 text-sm font-mono">2D / 3D</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { id: 'all', label: 'ALL GAMES' },
              { id: 'TWO_D', label: '2D GAMES' },
              { id: 'THREE_D', label: '3D GAMES' },
              { id: 'public', label: 'PUBLIC' },
              { id: 'private', label: 'PRIVATE' }
            ].map((filterOption) => (
              <RetroButton
                key={filterOption.id}
                size="sm"
                variant={filter === filterOption.id ? "primary" : "secondary"}
                onClick={() => setFilter(filterOption.id as any)}
              >
                {filterOption.label}
              </RetroButton>
            ))}
          </div>

          {/* Error state */}
          {error && (
            <div className="text-center py-8 mb-8">
              <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-red-300 font-mono font-bold mb-2">Error Loading Games</h3>
                <p className="text-red-200 text-sm mb-4">{error}</p>
                <RetroButton size="sm" variant="primary" onClick={refetch}>
                  RETRY
                </RetroButton>
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="text-center py-16">
              <LoadingSpinner />
              <p className="text-gray-400 font-mono mt-4">Loading your games...</p>
            </div>
          )}

          {/* Games Grid */}
          {!isLoading && !error && filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleVisibility={handleToggleVisibility}
                />
              ))}
            </div>
          ) : !isLoading && !error ? (
            /* Empty state */
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-800/50 rounded-lg flex items-center justify-center mx-auto mb-6">
                <span className="text-gray-400 text-4xl">🎮</span>
              </div>
              <h3 className="text-xl font-mono font-bold text-gray-300 mb-2">
                {filter === 'all' ? 'No games created yet' : 'No games match your filter'}
              </h3>
              <p className="text-gray-500 font-mono mb-6">
                {filter === 'all' 
                  ? 'Start creating your first game!' 
                  : 'Try adjusting your filters or create a new game.'
                }
              </p>
              {filter === 'all' && (
                <RetroButton
                  size="lg"
                  variant="primary"
                  onClick={handleCreateNew}
                >
                  CREATE YOUR FIRST GAME
                </RetroButton>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}