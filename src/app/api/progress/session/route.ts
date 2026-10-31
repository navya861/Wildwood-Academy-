import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { Repository } from '@/lib/db/repository';

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { duration_seconds, course_id, lesson_id, subject_id } = await req.json();

    if (!duration_seconds || duration_seconds < 10) {
      return NextResponse.json({ error: 'Invalid study session duration' }, { status: 400 });
    }

    const recorded = await Repository.recordStudySession(session.id, duration_seconds, {
      courseId: course_id,
      lessonId: lesson_id,
      subjectId: subject_id,
    });

    const profile = await Repository.getProfile(session.id);

    return NextResponse.json({
      success: true,
      session: recorded,
      xp: profile?.xp,
      level: profile?.level,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Session log failed' }, { status: 500 });
  }
}
