import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { Repository } from '@/lib/db/repository';

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const quizId = searchParams.get('quiz_id') || undefined;

  const attempts = await Repository.getQuizAttempts(session.id, quizId);
  return NextResponse.json({ attempts });
}
