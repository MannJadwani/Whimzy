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

    const { message, gameCode, chatHistory } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Create a context-aware prompt for game development
    const systemPrompt = `You are a helpful AI assistant specialized in creating and modifying HTML5 games. You help users create, update, and improve their games based on their requests.

Current game code:
\`\`\`html
${gameCode || 'No game code provided yet'}
\`\`\`

Guidelines:
1. When creating games, provide complete HTML files with embedded CSS and JavaScript
2. Use modern JavaScript features and HTML5 canvas when appropriate
3. Make games interactive and fun
4. Include proper styling and animations
5. Keep code clean and well-commented
6. For modifications, explain what you're changing and why
7. Always respond in a friendly, encouraging tone
8. If asked to create a new game, provide a complete working example

User's request: ${message}`;

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

    const aiResponse = response.text;

    return NextResponse.json({ 
      response: aiResponse,
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