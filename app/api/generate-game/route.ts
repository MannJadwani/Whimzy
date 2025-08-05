import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/authOptions';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, gameType = '2d' } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Create specialized prompts based on game type
    const getGameGenerationPrompt = (gameType: string, prompt: string) => {
      const baseRequirements = [
        'Create a COMPLETE HTML file with embedded CSS and JavaScript',
        'The game should be immediately playable and interactive',
        'Include proper game mechanics (controls, scoring, win/lose conditions)',
        'Add visual feedback and animations',
        'Use retro/arcade styling that fits a gaming platform',
        'Make it responsive and mobile-friendly',
        'Include clear instructions for the player',
        'The game should be fun and engaging'
      ];

      switch (gameType) {
        case '3d':
          return `You are a specialized 3D HTML5 game generator using Three.js. Create a complete, playable 3D game based on this description: "${prompt}"

Requirements:
${baseRequirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}
9. Use Three.js for 3D graphics and WebGL rendering
10. Include proper 3D camera controls and movement
11. Add realistic lighting and materials
12. Use 3D physics if appropriate (basic collision detection)
13. Include CDN links for Three.js library
14. Create immersive 3D environments and models
15. Add sound effects using Web Audio API if possible

Game Description: ${prompt}

Please provide ONLY the complete HTML code with Three.js for the 3D game, no explanations or markdown formatting. Include Three.js from CDN and ensure the code is ready to run immediately.`;

        case 'advanced-2d':
          return `You are a specialized 2D HTML5 game generator using Phaser.js framework. Create a complete, playable advanced 2D game based on this description: "${prompt}"

Requirements:
${baseRequirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}
9. Use Phaser.js framework for advanced 2D game features
10. Include physics engine (Arcade or Matter.js physics)
11. Add sprite animations and tweening
12. Implement scene management and game states
13. Include CDN links for Phaser.js library
14. Add particle effects and advanced visual features
15. Include sound management system
16. Use tilemaps or sprite atlases if appropriate

Game Description: ${prompt}

Please provide ONLY the complete HTML code with Phaser.js for the advanced 2D game, no explanations or markdown formatting. Include Phaser.js from CDN and ensure the code is ready to run immediately.`;

        case '2d':
        default:
          return `You are a specialized HTML5 game generator for classic 2D games. Create a complete, playable 2D game based on this description: "${prompt}"

Requirements:
${baseRequirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}
9. Use HTML5 Canvas for 2D graphics rendering
10. Implement smooth animations using requestAnimationFrame
11. Add simple physics and collision detection
12. Use vanilla JavaScript (no external frameworks)
13. Include keyboard and/or mouse controls
14. Add sound effects using Web Audio API if possible
15. Keep code clean, well-commented, and optimized

Game Description: ${prompt}

Please provide ONLY the complete HTML code for the classic 2D game, no explanations or markdown formatting. Use only HTML, CSS, and vanilla JavaScript. The code should be ready to run immediately.`;
      }
    };

    const gameGenerationPrompt = getGameGenerationPrompt(gameType, prompt);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: gameGenerationPrompt,
    });

    let gameCode = response.text;

    // Clean up the response to ensure it's pure HTML
    gameCode = gameCode.replace(/```html/g, '').replace(/```/g, '').trim();

    return NextResponse.json({ 
      gameCode,
      success: true 
    });

  } catch (error) {
    console.error('Game generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate game', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}