import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { Repository } from '@/lib/db/repository';

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const conversations = await Repository.getConversations(session.id);
  return NextResponse.json({ conversations });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, context } = await req.json();
    const conv = await Repository.createConversation(session.id, title || 'Woodland Inquiries', context);
    return NextResponse.json({ conversation: conv });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create conversation' }, { status: 500 });
  }
}
