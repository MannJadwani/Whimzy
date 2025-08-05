import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/authOptions';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');
    const isActive = searchParams.get('active') === 'true';

    // Build where clause
    const where: any = { userId: user.id };
    if (gameId) where.gameId = gameId;
    if (typeof isActive === 'boolean') where.isActive = isActive;

    // Fetch sessions
    const sessions = await prisma.gameSession.findMany({
      where,
      include: {
        game: {
          select: {
            id: true,
            title: true,
            gameType: true
          }
        },
        chatHistory: {
          orderBy: { createdAt: 'desc' },
          take: 5 // Get last 5 messages for preview
        }
      },
      orderBy: { lastModified: 'desc' }
    });

    return NextResponse.json({ sessions, success: true });

  } catch (error) {
    console.error('Sessions fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { gameId, gameCode } = await request.json();

    if (!gameId) {
      return NextResponse.json({ error: 'Game ID is required' }, { status: 400 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if game exists and user has access
    const game = await prisma.game.findUnique({
      where: { id: gameId }
    });

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    if (!game.isPublic && game.userId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Create new game session
    const gameSession = await prisma.gameSession.create({
      data: {
        gameId,
        userId: user.id,
        currentGameCode: gameCode || game.gameCode,
        isActive: true
      },
      include: {
        game: {
          select: {
            id: true,
            title: true,
            gameType: true
          }
        }
      }
    });

    return NextResponse.json({ session: gameSession, success: true });

  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}