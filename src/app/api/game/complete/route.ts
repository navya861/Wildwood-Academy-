import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { Repository } from '@/lib/db/repository';

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { course_id, score, fireflies, questions_answered, max_streak } = await req.json();

    const gameSession = await Repository.saveGameSession(session.id, {
      courseId: course_id,
      score: Number(score) || 0,
      fireflies: Number(fireflies) || 0,
      questionsAnswered: Number(questions_answered) || 1,
      maxStreak: Number(max_streak) || 0,
    });

    const profile = await Repository.getProfile(session.id);

    return NextResponse.json({
      success: true,
      gameSession,
      xp: profile?.xp,
      level: profile?.level,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to submit game results' }, { status: 500 });
  }
}
