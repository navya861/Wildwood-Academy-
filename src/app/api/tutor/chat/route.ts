import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { Repository } from '@/lib/db/repository';
import { AIService } from '@/lib/ai/ai-service';

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { message, conversation_id, context } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 });
    }

    let convId = conversation_id;
    let conversation;

    if (!convId) {
      // Create new conversation
      const title = message.slice(0, 36) + (message.length > 36 ? '...' : '');
      conversation = await Repository.createConversation(session.id, title, context);
      convId = conversation.id;
    } else {
      conversation = await Repository.getConversation(session.id, convId);
      if (!conversation) {
        return NextResponse.json({ error: 'Conversation not found or unauthorized' }, { status: 404 });
      }
    }

    // 1. Record user message
    await Repository.addMessage(session.id, convId, 'user', message);

    // 2. Perform RAG chunk retrieval (strictly isolated to this user)
    const retrievedChunks = await Repository.searchChunks(session.id, message, {
      materialId: context?.studyMaterialId || conversation.study_material_id,
      limit: 4,
    });

    // 3. Get profile learning preferences
    const profile = await Repository.getProfile(session.id);

    // 4. Get recent message history
    const history = (conversation.messages || []).slice(-6).map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    // 5. Query the Forest Guide AI
    const result = await AIService.tutorChat(
      message,
      history,
      retrievedChunks,
      profile?.learning_preferences
    );

    // 6. Record assistant response with citations
    const assistantMessage = await Repository.addMessage(
      session.id,
      convId,
      'assistant',
      result.text,
      result.citations
    );

    // Award XP for engaging in scholarly inquiry
    await Repository.awardXP(session.id, 10, 'Consulted the Forest Guide');

    return NextResponse.json({
      conversation_id: convId,
      message: assistantMessage,
      citations: result.citations,
    });
  } catch (err: any) {
    console.error('Tutor chat error:', err);
    return NextResponse.json({ error: err.message || 'Tutor inquiry failed' }, { status: 500 });
  }
}
