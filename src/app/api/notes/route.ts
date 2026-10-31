import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { Repository } from '@/lib/db/repository';

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const lessonId = searchParams.get('lesson_id') || undefined;
  const courseId = searchParams.get('course_id') || undefined;
  const materialId = searchParams.get('material_id') || undefined;

  const notes = await Repository.getNotes(session.id, {
    lessonId,
    courseId,
    materialId,
  });

  return NextResponse.json({ notes });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, content, lesson_id, course_id, study_material_id, note_format = 'detailed', tags = [] } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required for notes.' }, { status: 400 });
    }

    const note = await Repository.createNote(session.id, {
      title,
      content,
      user_edited_content: content,
      lesson_id,
      course_id,
      study_material_id,
      note_type: 'user_written',
      note_format,
      tags,
    });

    await Repository.awardXP(session.id, 15, 'Penned a note in the Scribe Corner');

    return NextResponse.json({ note });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save note' }, { status: 500 });
  }
}
