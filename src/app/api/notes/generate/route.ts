import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { Repository } from '@/lib/db/repository';
import { AIService } from '@/lib/ai/ai-service';
import { NoteFormat } from '@/lib/types';

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, source_text, lesson_id, course_id, material_id, note_format = 'detailed' } = await req.json();

    let contentToSummarize = source_text;

    // If lesson_id provided, get lesson content
    if (!contentToSummarize && lesson_id) {
      const lesson = await Repository.getLesson(session.id, lesson_id);
      if (lesson) {
        contentToSummarize = `${lesson.title}\n\n${lesson.content}`;
      }
    }

    // If material_id provided, get material text
    if (!contentToSummarize && material_id) {
      const material = await Repository.getMaterial(session.id, material_id);
      if (material?.extracted_text) {
        contentToSummarize = material.extracted_text;
      }
    }

    if (!contentToSummarize) {
      return NextResponse.json({ error: 'No source text or lesson found to generate notes.' }, { status: 400 });
    }

    const noteTitle = title || `Scribe Notes: ${note_format.toUpperCase()}`;
    const generatedMarkdown = await AIService.generateNotes(
      noteTitle,
      contentToSummarize,
      note_format as NoteFormat
    );

    const note = await Repository.createNote(session.id, {
      title: noteTitle,
      content: generatedMarkdown,
      user_edited_content: generatedMarkdown,
      lesson_id,
      course_id,
      study_material_id: material_id,
      note_type: 'ai_generated',
      note_format: note_format as NoteFormat,
      tags: [note_format, 'ai_assisted'],
    });

    await Repository.awardXP(session.id, 25, 'Synthesized Notes in the Scribe Corner');

    return NextResponse.json({ note });
  } catch (err: any) {
    console.error('Note generation error:', err);
    return NextResponse.json({ error: err.message || 'Note generation failed' }, { status: 500 });
  }
}
