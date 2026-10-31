import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { Repository } from '@/lib/db/repository';

export async function GET(
  req: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const lesson = await Repository.getLesson(session.id, params.lessonId);
  if (!lesson) {
    return NextResponse.json({ error: 'Lesson not found or unauthorized' }, { status: 404 });
  }

  return NextResponse.json({ lesson });
}
