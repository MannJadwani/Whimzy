"use client";

import React, { useState } from 'react';
import { PixelBackground } from '@/components/ui/PixelBackground';
import { RetroNavbar } from '@/components/ui/RetroNavbar';
import { RetroButton } from '@/components/ui/RetroButton';
import { useGames } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

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

// Mock data for demonstration - replace with actual user games
const MOCK_USER_GAMES: SavedGame[] = [
  {
    id: '1',
    title: 'My Space Adventure',
    description: 'A thrilling space exploration game with alien encounters',
    gameType: '2D',
    createdAt: '2024-02-15',
    lastModified: '2024-02-20',
    plays: 45,
    isPublic: true,
    thumbnail: '/assets/landing-images/retro_alien_arcade_blaster.png'
  },
  {
    id: '2',
    title: 'Pixel Warrior',
    description: 'A retro-style fighting game with epic battles',
    gameType: '2D',
    createdAt: '2024-02-10',
    lastModified: '2024-02-18',
    plays: 23,
    isPublic: false,
    thumbnail: '/assets/landing-images/samurai_bear_pixel_sword.png'
  },
  {
    id: '3',
    title: 'Magic Realm 3D',
    description: 'An immersive 3D fantasy world with magical creatures',
    gameType: '3D',
    createdAt: '2024-02-05',
    lastModified: '2024-02-12',
    plays: 67,
    isPublic: true,
    thumbnail: '/assets/landing-images/wizard_gameboy_pixel.png'
  }
];

const GameCard = ({ game, onEdit, onDelete, onToggleVisibility }: {
  game: SavedGame;
  onEdit: (game: SavedGame) => void;
  onDelete: (gameId: string) => void;
  onToggleVisibility: (gameId: string, isPublic: boolean) => void;
}) => (
  <div className="group relative bg-gray-900/80 backdrop-blur-sm border-2 border-purple-400/30 hover:border-cyan-400/60 rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 shadow-lg hover:shadow-purple-500/25 flex flex-col w-full min-h-[400px]">
    {/* Thumbnail */}
    <div className="relative h-48 bg-gray-800 overflow-hidden">
      {game.thumbnail ? (
        <img
          src={game.thumbnail}
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
        <span className={`px-2 py-1 text-xs font-mono font-bold rounded ${game.gameType === '2D' ? 'bg-purple-500/80 text-purple-100' : 'bg-cyan-500/80 text-cyan-100'}`}>
          {game.gameType}
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
        <div>Modified: {new Date(game.lastModified).toLocaleDateString()}</div>
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

export default function MyGamesPage() {
  const router = useRouter();
  const { setCurrentGame } = useGames();
  const [games, setGames] = useState<SavedGame[]>(MOCK_USER_GAMES);
  const [filter, setFilter] = useState<'all' | '2d' | '3d' | 'public' | 'private'>('all');

  const filteredGames = games.filter(game => {
    switch (filter) {
      case '2d':
        return game.gameType === '2D';
      case '3d':
        return game.gameType === '3D';
      case 'public':
        return game.isPublic;
      case 'private':
        return !game.isPublic;
      default:
        return true;
    }
  });

  const handleEdit = (game: SavedGame) => {
    // Convert to the format expected by the game builder
    const gameForBuilder = {
      id: game.id,
      title: game.title,
      description: game.description,
      gameType: game.gameType,
      gameCode: '', // This would be loaded from your backend
      isPublic: game.isPublic,
      createdAt: game.createdAt,
      views: 0,
      plays: game.plays
    };
    
    setCurrentGame(gameForBuilder);
    router.push('/builder');
  };

  const handleDelete = (gameId: string) => {
    if (confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
      setGames(games.filter(game => game.id !== gameId));
    }
  };

  const handleToggleVisibility = (gameId: string, isPublic: boolean) => {
    setGames(games.map(game => 
      game.id === gameId ? { ...game, isPublic } : game
    ));
  };

  const handleCreateNew = () => {
    router.push('/builder');
  };

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
              <div className="text-2xl font-mono font-bold text-yellow-300">{games.filter(g => g.gameType === '2D').length}/{games.filter(g => g.gameType === '3D').length}</div>
              <div className="text-gray-400 text-sm font-mono">2D / 3D</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { id: 'all', label: 'ALL GAMES' },
              { id: '2d', label: '2D GAMES' },
              { id: '3d', label: '3D GAMES' },
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

          {/* Games Grid */}
          {filteredGames.length > 0 ? (
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
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}