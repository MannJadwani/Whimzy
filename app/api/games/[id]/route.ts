import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/authOptions';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const gameId = params.id;

    // Fetch game with user and session info
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        gameSessions: {
          orderBy: { lastModified: 'desc' },
          take: 1
        },
        _count: {
          select: {
            gameLikes: true,
            gameSessions: true
          }
        }
      }
    });

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    // Check if game is public or user owns it
    const session = await getServerSession(authOptions);
    if (!game.isPublic && (!session?.user || game.user.id !== session.user.id)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Increment view count
    await prisma.game.update({
      where: { id: gameId },
      data: { views: { increment: 1 } }
    });

    // Track analytics
    if (session?.user) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email! }
      });

      if (user) {
        await prisma.analytics.create({
          data: {
            userId: user.id,
            gameId: gameId,
            eventType: 'GAME_PLAYED'
          }
        });
      }
    }

    return NextResponse.json({ game, success: true });

  } catch (error) {
    console.error('Game fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const gameId = params.id;
    const { title, description, gameCode, isPublic } = await request.json();

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user owns the game
    const existingGame = await prisma.game.findUnique({
      where: { id: gameId }
    });

    if (!existingGame || existingGame.userId !== user.id) {
      return NextResponse.json({ error: 'Game not found or access denied' }, { status: 403 });
    }

    // Update game
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(gameCode && { gameCode }),
        ...(typeof isPublic === 'boolean' && { isPublic }),
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json({ game: updatedGame, success: true });

  } catch (error) {
    console.error('Game update error:', error);
    return NextResponse.json(
      { error: 'Failed to update game' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const gameId = params.id;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user owns the game
    const existingGame = await prisma.game.findUnique({
      where: { id: gameId }
    });

    if (!existingGame || existingGame.userId !== user.id) {
      return NextResponse.json({ error: 'Game not found or access denied' }, { status: 403 });
    }

    // Delete game (this will cascade delete related records due to our schema)
    await prisma.game.delete({
      where: { id: gameId }
    });

    // Update user stats
    await prisma.user.update({
      where: { id: user.id },
      data: {
        gamesCreated: { decrement: 1 }
      }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Game deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete game' },
      { status: 500 }
    );
  }
}