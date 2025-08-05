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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const isPublic = searchParams.get('public') === 'true';
    const gameType = searchParams.get('gameType');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = isPublic ? 
      { isPublic: true } : 
      { userId: user.id };

    if (gameType) {
      where.gameType = gameType;
    }

    // Fetch games
    const [games, totalCount] = await Promise.all([
      prisma.game.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          _count: {
            select: {
              gameLikes: true,
              gameSessions: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.game.count({ where })
    ]);

    return NextResponse.json({
      games,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      success: true
    });

  } catch (error) {
    console.error('Games fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
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

    const { title, description, gameCode, gameType, isPublic = false } = await request.json();

    if (!title || !gameCode) {
      return NextResponse.json({ error: 'Title and game code are required' }, { status: 400 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create game
    const game = await prisma.game.create({
      data: {
        userId: user.id,
        title,
        description,
        prompt: description || title, // Use description as prompt if provided
        gameType: gameType || 'TWO_D',
        gameCode,
        isPublic
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

    // Update user stats
    await prisma.user.update({
      where: { id: user.id },
      data: {
        gamesCreated: { increment: 1 }
      }
    });

    return NextResponse.json({ game, success: true });

  } catch (error) {
    console.error('Game creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    );
  }
}