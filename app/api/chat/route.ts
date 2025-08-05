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