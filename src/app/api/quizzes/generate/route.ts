import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { Repository } from '@/lib/db/repository';
import { AIService } from '@/lib/ai/ai-service';

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, lesson_id, course_id, material_id, difficulty = 'medium', question_count = 4 } = await req.json();

    let textForQuiz = '';
    let quizTitle = title || 'Trial of Knowledge';

    if (lesson_id) {
      const lesson = await Repository.getLesson(session.id, lesson_id);
      if (lesson) {
        textForQuiz = `${lesson.title}\n\n${lesson.content}`;
        quizTitle = `Trial: ${lesson.title}`;
      }
    } else if (material_id) {
      const material = await Repository.getMaterial(session.id, material_id);
      if (material?.extracted_text) {
        textForQuiz = material.extracted_text;
        quizTitle = `Trial: ${material.title}`;
      }
    } else if (course_id) {
      const course = await Repository.getCourse(session.id, course_id);
      if (course) {
        textForQuiz = `${course.title}\n${course.description}`;
        quizTitle = `Comprehensive Trial: ${course.title}`;
      }
    }

    if (!textForQuiz) {
      return NextResponse.json({ error: 'No content found to generate quiz questions from.' }, { status: 400 });
    }

    const generated = await AIService.generateQuiz(
      quizTitle,
      textForQuiz,
      difficulty,
      question_count
    );

    const quiz = await Repository.createQuiz(
      session.id,
      {
        title: generated.title || quizTitle,
        description: generated.description,
        difficulty,
        lesson_id,
        course_id,
        study_material_id: material_id,
        total_questions: (generated.questions || []).length,
        generation_status: 'completed',
      },
      (generated.questions || []).map((q: any, i: number) => ({
        question_text: q.question_text,
        question_type: q.question_type || 'multiple_choice',
        options: q.options || [],
        correct_answer: q.correct_answer,
        grading_criteria: q.grading_criteria || '',
        explanation: q.explanation || 'Review the lesson and reference materials.',
        order_index: i,
      }))
    );

    return NextResponse.json({ quiz });
  } catch (err: any) {
    console.error('Quiz generation error:', err);
    return NextResponse.json({ error: err.message || 'Quiz generation failed' }, { status: 500 });
  }
}
