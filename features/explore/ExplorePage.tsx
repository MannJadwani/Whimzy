"use client";

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { GameCard, GameData } from '@/components/explore/GameCard';
import { GamePreviewModal } from '@/components/explore/GamePreviewModal';
import { PixelBackground } from '@/components/ui/PixelBackground';
import { RetroNavbar } from '@/components/ui/RetroNavbar';
import { RetroButton } from '@/components/ui/RetroButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useGames } from '@/context/AppContext';
import { usePublicGames } from '@/hooks/usePublicGames';
import { DatabaseGame } from '@/hooks/useUserGames';

// Hardcoded sample games data
const SAMPLE_GAMES: GameData[] = [
  {
    id: '1',
    title: 'Neon Runner',
    description: 'A fast-paced cyberpunk platformer where you run through neon-lit cityscapes while avoiding obstacles and collecting power-ups.',
    author: 'CyberDev',
    thumbnail: '/assets/landing-images/cyberpunk_ninja_pixel_art.png',
    gameType: '2D',
    tags: ['platformer', 'cyberpunk', 'action'],
    plays: 1247,
    likes: 89,
    createdAt: '2024-01-15',
    gameCode: `
<!DOCTYPE html>
<html><head><title>Neon Runner</title><style>
body { margin: 0; background: linear-gradient(45deg, #1a1a2e, #16213e); color: #fff; font-family: monospace; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
.game { text-align: center; border: 2px solid #8b5cf6; border-radius: 10px; padding: 30px; background: rgba(139, 92, 246, 0.1); }
.player { font-size: 48px; animation: run 1s infinite; }
@keyframes run { 0%, 100% { transform: translateX(-5px); } 50% { transform: translateX(5px); } }
</style></head><body>
<div class="game"><h1 style="color: #8b5cf6;">🏃‍♂️ NEON RUNNER 🏃‍♂️</h1><div class="player">🥷</div><p>A cyberpunk platformer adventure!</p></div>
</body></html>`
  },
  {
    id: '2',
    title: 'Magic Quest',
    description: 'Embark on a magical journey as a wizard apprentice. Cast spells, solve puzzles, and defeat dark creatures in this enchanting RPG.',
    author: 'WizardMaster',
    thumbnail: '/assets/landing-images/wizard_gameboy_pixel.png',
    gameType: '2D',
    tags: ['rpg', 'fantasy', 'magic'],
    plays: 892,
    likes: 156,
    createdAt: '2024-01-20',
    gameCode: `
<!DOCTYPE html>
<html><head><title>Magic Quest</title><style>
body { margin: 0; background: linear-gradient(135deg, #2d1b69, #11998e); color: #fff; font-family: monospace; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
.game { text-align: center; border: 2px solid #06b6d4; border-radius: 10px; padding: 30px; background: rgba(6, 182, 212, 0.1); }
.wizard { font-size: 48px; animation: cast 2s infinite; }
@keyframes cast { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
</style></head><body>
<div class="game"><h1 style="color: #06b6d4;">🧙‍♂️ MAGIC QUEST 🧙‍♂️</h1><div class="wizard">🔮</div><p>Cast spells and explore magical realms!</p></div>
</body></html>`
  },
  {
    id: '3',
    title: 'Space Defender',
    description: 'Protect Earth from alien invasion! Command your spaceship through asteroid fields and engage in epic space battles.',
    author: 'SpaceAce',
    thumbnail: '/assets/landing-images/retro_alien_arcade_blaster.png',
    gameType: '3D',
    tags: ['shooter', 'space', 'action'],
    plays: 2156,
    likes: 234,
    createdAt: '2024-01-25',
    gameCode: `
<!DOCTYPE html>
<html><head><title>Space Defender</title><style>
body { margin: 0; background: radial-gradient(circle, #0f0f23, #000); color: #fff; font-family: monospace; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
.game { text-align: center; border: 2px solid #22d3ee; border-radius: 10px; padding: 30px; background: rgba(34, 211, 238, 0.1); }
.ship { font-size: 48px; animation: hover 3s ease-in-out infinite; }
@keyframes hover { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
</style></head><body>
<div class="game"><h1 style="color: #22d3ee;">🚀 SPACE DEFENDER 🚀</h1><div class="ship">👽</div><p>Defend Earth from alien invasion!</p></div>
</body></html>`
  },
  {
    id: '4',
    title: 'Forest Adventure',
    description: 'Guide an elven archer through mystical forests. Hunt monsters, discover treasures, and unlock ancient secrets.',
    author: 'NatureLover',
    thumbnail: '/assets/landing-images/elf_archer_rpg_pixel_forest.png',
    gameType: '2D',
    tags: ['adventure', 'fantasy', 'archery'],
    plays: 756,
    likes: 98,
    createdAt: '2024-02-01',
    gameCode: `
<!DOCTYPE html>
<html><head><title>Forest Adventure</title><style>
body { margin: 0; background: linear-gradient(45deg, #065f46, #047857); color: #fff; font-family: monospace; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
.game { text-align: center; border: 2px solid #10b981; border-radius: 10px; padding: 30px; background: rgba(16, 185, 129, 0.1); }
.archer { font-size: 48px; animation: aim 2s ease-in-out infinite; }
@keyframes aim { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
</style></head><body>
<div class="game"><h1 style="color: #10b981;">🏹 FOREST ADVENTURE 🏹</h1><div class="archer">🧝‍♀️</div><p>Explore mystical forests and hunt monsters!</p></div>
</body></html>`
  },
  {
    id: '5',
    title: 'Robot Factory',
    description: 'Build and program cute robots in this simulation game. Design assembly lines and create the perfect robotic workforce.',
    author: 'TechBuilder',
    thumbnail: '/assets/landing-images/cute_robot_retro_futuristic.png',
    gameType: '3D',
    tags: ['simulation', 'robots', 'building'],
    plays: 1034,
    likes: 187,
    createdAt: '2024-02-05',
    gameCode: `
<!DOCTYPE html>
<html><head><title>Robot Factory</title><style>
body { margin: 0; background: linear-gradient(135deg, #374151, #1f2937); color: #fff; font-family: monospace; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
.game { text-align: center; border: 2px solid #f59e0b; border-radius: 10px; padding: 30px; background: rgba(245, 158, 11, 0.1); }
.robot { font-size: 48px; animation: work 1.5s ease-in-out infinite; }
@keyframes work { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-5px) rotate(10deg); } }
</style></head><body>
<div class="game"><h1 style="color: #f59e0b;">🤖 ROBOT FACTORY 🤖</h1><div class="robot">⚙️</div><p>Build and program amazing robots!</p></div>
</body></html>`
  },
  {
    id: '6',
    title: 'Wild West Showdown',
    description: 'Saddle up, partner! Engage in duels, explore frontier towns, and become the fastest gun in the Old West.',
    author: 'CowboyDev',
    thumbnail: '/assets/landing-images/robotic_cowboy_arcade_style.png',
    gameType: '2D',
    tags: ['western', 'action', 'duels'],
    plays: 643,
    likes: 74,
    createdAt: '2024-02-10',
    gameCode: `
<!DOCTYPE html>
<html><head><title>Wild West Showdown</title><style>
body { margin: 0; background: linear-gradient(45deg, #8b4513, #d2691e); color: #fff; font-family: monospace; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
.game { text-align: center; border: 2px solid #dc2626; border-radius: 10px; padding: 30px; background: rgba(220, 38, 38, 0.1); }
.cowboy { font-size: 48px; animation: draw 2s ease-in-out infinite; }
@keyframes draw { 0%, 80%, 100% { transform: translateX(0); } 90% { transform: translateX(10px); } }
</style></head><body>
<div class="game"><h1 style="color: #dc2626;">🤠 WILD WEST SHOWDOWN 🤠</h1><div class="cowboy">🔫</div><p>Fast draws and frontier justice!</p></div>
</body></html>`
  }
];

// Convert DatabaseGame to GameData format for compatibility
const convertToGameData = (dbGame: DatabaseGame): GameData => ({
  id: dbGame.id,
  title: dbGame.title,
  description: dbGame.description || '',
  author: dbGame.user.name || 'Anonymous',
  thumbnail: dbGame.thumbnailUrl || '',
  gameType: dbGame.gameType === 'THREE_D' ? '3D' : '2D',
  tags: [], // Could be derived from description or stored separately
  plays: dbGame.plays,
  likes: dbGame.likes,
  createdAt: dbGame.createdAt,
  gameCode: dbGame.gameCode || ''
});

export function ExplorePage() {
  const router = useRouter();
  const { setCurrentGame } = useGames();
  const { games: dbGames, isLoading, error, playGame, refetch } = usePublicGames();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [previewGame, setPreviewGame] = useState<GameData | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Convert database games to GameData format and add fallback sample games if empty
  const games = dbGames.length > 0 ? dbGames.map(convertToGameData) : SAMPLE_GAMES;

  const filteredGames = games.filter(game => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === '2d') return game.gameType === '2D';
    if (selectedFilter === '3d') return game.gameType === '3D';
    return game.tags.includes(selectedFilter);
  });

  const handlePreview = useCallback((game: GameData) => {
    setPreviewGame(game);
    setIsPreviewOpen(true);
  }, []);

  const handleRemix = useCallback(async (game: GameData) => {
    // Track play count when remixing
    await playGame(game.id);
    
    // Create a new game based on the selected game
    const remixedGame = {
      id: `remix-${game.id}-${Date.now()}`,
      title: `${game.title} (Remix)`,
      description: `Remixed version of ${game.title}`,
      prompt: `Create a game similar to: ${game.description}`,
      gameType: game.gameType,
      gameCode: game.gameCode,
      isPublic: false,
      createdAt: new Date().toISOString(),
      views: 0,
      plays: 0
    };

    setCurrentGame(remixedGame);
    router.push('/builder');
  }, [router, setCurrentGame, playGame]);

  const handleClosePreview = useCallback(() => {
    setIsPreviewOpen(false);
    setPreviewGame(null);
  }, []);

  return (
    <div className="min-h-screen relative">
      <PixelBackground />
      <RetroNavbar />
      
      <div className="relative z-10 pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent font-mono tracking-wider drop-shadow-2xl">
              GAME GALLERY
            </h1>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-purple-300" />
              <span className="text-purple-200 font-mono text-lg tracking-widest font-bold">
                EXPLORE • PLAY • REMIX
              </span>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-cyan-300" />
            </div>
            <p className="text-gray-300 font-mono text-lg max-w-2xl mx-auto">
              Discover amazing games created by our community. Preview, play, and remix them to create your own masterpieces!
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { id: 'all', label: 'ALL GAMES' },
              { id: '2d', label: '2D GAMES' },
              { id: '3d', label: '3D GAMES' },
              { id: 'action', label: 'ACTION' },
              { id: 'rpg', label: 'RPG' },
              { id: 'simulation', label: 'SIMULATION' }
            ].map((filter) => (
              <RetroButton
                key={filter.id}
                size="sm"
                variant={selectedFilter === filter.id ? "primary" : "secondary"}
                onClick={() => setSelectedFilter(filter.id)}
              >
                {filter.label}
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
              <p className="text-gray-400 font-mono mt-4">Loading amazing games...</p>
            </div>
          )}

          {/* Games Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 auto-rows-fr">
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onPreview={handlePreview}
                  onRemix={handleRemix}
                  className="h-full"
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && filteredGames.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-800/50 rounded-lg flex items-center justify-center mx-auto mb-6">
                <span className="text-gray-400 text-4xl">🎮</span>
              </div>
              <h3 className="text-xl font-mono font-bold text-gray-300 mb-2">
                No games found
              </h3>
              <p className="text-gray-500 font-mono">
                Try adjusting your filters or check back later for new games!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <GamePreviewModal
        game={previewGame}
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        onRemix={handleRemix}
      />
    </div>
  );
}