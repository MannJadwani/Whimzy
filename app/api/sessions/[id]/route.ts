import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/authOptions';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionId = params.id;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch session with chat history
    const gameSession = await prisma.gameSession.findUnique({
      where: { id: sessionId },
      include: {
        game: {
          select: {
            id: true,
            title: true,
            gameType: true,
            userId: true
          }
        },
        chatHistory: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!gameSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Check access rights
    if (gameSession.userId !== user.id && gameSession.game.userId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ session: gameSession, success: true });

  } catch (error) {
    console.error('Session fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session' },
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

    const sessionId = params.id;
    const { currentGameCode, isActive } = await request.json();

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user owns the session
    const existingSession = await prisma.gameSession.findUnique({
      where: { id: sessionId }
    });

    if (!existingSession || existingSession.userId !== user.id) {
      return NextResponse.json({ error: 'Session not found or access denied' }, { status: 403 });
    }

    // Update session
    const updatedSession = await prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        ...(currentGameCode && { currentGameCode }),
        ...(typeof isActive === 'boolean' && { isActive }),
        lastModified: new Date()
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

    return NextResponse.json({ session: updatedSession, success: true });

  } catch (error) {
    console.error('Session update error:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
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

    const sessionId = params.id;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user owns the session
    const existingSession = await prisma.gameSession.findUnique({
      where: { id: sessionId }
    });

    if (!existingSession || existingSession.userId !== user.id) {
      return NextResponse.json({ error: 'Session not found or access denied' }, { status: 403 });
    }

    // Delete session (this will cascade delete chat history)
    await prisma.gameSession.delete({
      where: { id: sessionId }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Session deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}