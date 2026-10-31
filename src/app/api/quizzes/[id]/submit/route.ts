import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { Repository } from '@/lib/db/repository';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { submitted_answers, started_at } = await req.json();

    if (!submitted_answers || typeof submitted_answers !== 'object') {
      return NextResponse.json({ error: 'Missing submitted answers' }, { status: 400 });
    }

    // Server-side grading execution
    const attempt = await Repository.gradeQuizSubmission(
      session.id,
      params.id,
      submitted_answers,
      started_at || new Date().toISOString()
    );

    const profile = await Repository.getProfile(session.id);

    return NextResponse.json({
      success: true,
      attempt,
      xp: profile?.xp,
      level: profile?.level,
    });
  } catch (err: any) {
    console.error('Quiz submission grading error:', err);
    return NextResponse.json({ error: err.message || 'Grading failed' }, { status: 500 });
  }
}
