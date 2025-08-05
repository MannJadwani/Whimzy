import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/authOptions';
import { prisma } from '@/lib/prisma';
// import { ChatRole } from '@prisma/client';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, gameCode, chatHistory, gameId, sessionId } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get or create game session
    let gameSession;
    if (sessionId) {
      gameSession = await prisma.gameSession.findUnique({
        where: { id: sessionId },
        include: { game: true }
      });
    }

    if (!gameSession && gameId) {
      // Find existing session for this game or create new one
      gameSession = await prisma.gameSession.findFirst({
        where: {
          gameId,
          userId: user.id,
          isActive: true
        },
        include: { game: true }
      });

      if (!gameSession) {
        gameSession = await prisma.gameSession.create({
          data: {
            gameId,
            userId: user.id,
            currentGameCode: gameCode,
            isActive: true
          },
          include: { game: true }
        });
      }
    }

    // Create a context-aware prompt for iterative game development
    const systemPrompt = `You are a helpful AI game development assistant that modifies and improves existing games. You will receive the current game code and a user request for changes. Your job is to:

1. Analyze the current game code to understand its structure and mechanics
2. Implement the requested changes or improvements
3. Provide both updated code AND a planning explanation

Current Game Code:
\`\`\`html
${gameCode || '<!-- No game code yet - this will be a new game creation -->'}
\`\`\`

User's Request: ${message}

Please respond with:
1. A brief explanation of your planning approach and what you're changing
2. The complete updated HTML game code in a code block

Guidelines:
- Keep the existing game structure and improve upon it
- Maintain backward compatibility where possible
- Explain your technical decisions briefly
- Ensure the game remains playable and fun
- If this is a new game request, create a complete game from scratch
- Always provide the full HTML code, ready to run

Format your response like this:
[Your planning explanation here]

\`\`\`html
[Complete updated game code here]
\`\`\``;

    // Build conversation history
    const conversationHistory = chatHistory?.map((msg: any) => 
      `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n\n') || '';

    const fullPrompt = conversationHistory 
      ? `${conversationHistory}\n\nUser: ${systemPrompt}`
      : systemPrompt;

    // Generate response using new API
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: fullPrompt,
    });

    const aiResponse = response.text || '';

    // Save user message to chat history if we have a session
    if (gameSession) {
      await prisma.chatHistory.create({
        data: {
          gameSessionId: gameSession.id,
          message,
          response: aiResponse,
          gameCodeSnapshot: gameCode,
          role: 'USER'
        }
      });

      // Save AI response to chat history
      await prisma.chatHistory.create({
        data: {
          gameSessionId: gameSession.id,
          message: aiResponse,
          response: '',
          gameCodeSnapshot: gameCode,
          role: 'ASSISTANT'
        }
      });

      // Update session with latest game code and timestamp
      await prisma.gameSession.update({
        where: { id: gameSession.id },
        data: {
          currentGameCode: gameCode,
          lastModified: new Date()
        }
      });

      // Track analytics
      await prisma.analytics.create({
        data: {
          userId: user.id,
          gameId: gameSession.gameId,
          eventType: 'CHAT_MESSAGE_SENT',
          metadata: {
            messageLength: message.length,
            responseLength: aiResponse.length
          }
        }
      });
    }

    return NextResponse.json({ 
      response: aiResponse,
      sessionId: gameSession?.id,
      success: true 
    });

  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}