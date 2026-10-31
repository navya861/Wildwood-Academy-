import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { Repository } from '@/lib/db/repository';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const conversation = await Repository.getConversation(session.id, params.id);
  if (!conversation) {
    return NextResponse.json({ error: 'Conversation not found or unauthorized' }, { status: 404 });
  }

  return NextResponse.json({ conversation });
}
