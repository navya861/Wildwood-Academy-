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

  // Notice includeQuestions=true hides correct_answer from client
  const quiz = await Repository.getQuiz(session.id, params.id, true);
  if (!quiz) {
    return NextResponse.json({ error: 'Quiz not found or unauthorized' }, { status: 404 });
  }

  return NextResponse.json({ quiz });
}
