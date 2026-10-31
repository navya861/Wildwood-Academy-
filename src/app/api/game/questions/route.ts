import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { Repository } from '@/lib/db/repository';

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get('course_id') || undefined;

  // 1. Try to find questions from an existing quiz in this course or general quizzes
  const quizzes = await Repository.getQuizzes(session.id);
  const relevantQuiz = courseId ? quizzes.find(q => q.course_id === courseId) : quizzes[0];

  if (relevantQuiz) {
    const fullQuiz = await Repository.getQuiz(session.id, relevantQuiz.id, true);
    if (fullQuiz?.questions && fullQuiz.questions.length >= 3) {
      return NextResponse.json({
        questions: fullQuiz.questions.map(q => ({
          id: q.id,
          prompt: q.question_text,
          options: q.options && q.options.length > 0 ? q.options : ['True', 'False'],
        })),
        source: relevantQuiz.title,
      });
    }
  }

  // 2. Default woodland questions if no quiz has been created yet
  return NextResponse.json({
    questions: [
      {
        id: 'q1',
        prompt: 'What constitutes the foundational basis of structured scholarship in the woodland groves?',
        options: [
          'Carefully reviewing foundational definitions and assumptions',
          'Relying solely on folklore without empirical notes',
          'Skipping revision and guessing on trial grounds',
          'Ignoring source document citations',
        ],
      },
      {
        id: 'q2',
        prompt: 'How does an interconnected system respond when one component is modified?',
        options: [
          'Feedback loops alter the equilibrium of the entire system',
          'Components have zero effect on one another',
          'The whole system ceases to exist instantly',
          'Only external observers notice any change',
        ],
      },
      {
        id: 'q3',
        prompt: 'Which practice yields the greatest retention during active study?',
        options: [
          'Active recall and self-explanation through trial quizzes',
          'Passive skimming without taking notes',
          'Leaving questions unanswered',
          'Memorizing without contextual understanding',
        ],
      },
      {
        id: 'q4',
        prompt: 'In analytical writing, why are primary source citations critical?',
        options: [
          'They ground claims in verifiable evidence and prevent hallucination',
          'They make the scroll look longer and heavier',
          'They are purely decorative traditions with no utility',
          'They replace the need for critical thinking',
        ],
      },
    ],
    source: 'Academy Lore & Foundations',
  });
}
