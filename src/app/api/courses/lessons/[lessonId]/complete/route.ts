import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { Repository } from '@/lib/db/repository';

export async function POST(
  req: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { course_id, completed = true, duration_seconds = 60 } = await req.json();

    const lesson = await Repository.getLesson(session.id, params.lessonId);
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const progress = await Repository.updateLessonProgress(
      session.id,
      params.lessonId,
      course_id || lesson.course_id,
      completed,
      duration_seconds
    );

    // Record study session duration
    if (duration_seconds > 0) {
      await Repository.recordStudySession(session.id, duration_seconds, {
        courseId: course_id || lesson.course_id,
        lessonId: params.lessonId,
      });
    }

    const profile = await Repository.getProfile(session.id);

    return NextResponse.json({
      success: true,
      progress,
      xp: profile?.xp,
      level: profile?.level,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Progress update failed' }, { status: 500 });
  }
}
