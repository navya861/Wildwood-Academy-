'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { QuizPlayer } from '@/components/quiz/QuizPlayer';
import { Quiz } from '@/lib/types';
import { ArrowLeft, Sparkles, Swords } from 'lucide-react';

export default function QuizArenaPage() {
  const params = useParams();
  const quizId = params.quizId as string;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const res = await fetch(`/api/quizzes/${quizId}`);
        const data = await res.json();
        if (data.quiz) setQuiz(data.quiz);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Sparkles className="w-8 h-8 text-lantern animate-spin" />
          <p className="text-xs text-sage font-mono">Summoning the trial questions...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="p-8 text-center woodland-panel rounded-2xl max-w-md mx-auto space-y-3">
        <h3 className="font-serif text-lg font-bold text-parchment">Trial Not Found</h3>
        <p className="text-xs text-sage">This trial examination does not exist or has ended.</p>
        <Link href="/trials" className="text-xs text-lantern underline block">
          Return to Trial Grounds
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Link
        href="/trials"
        className="text-xs text-sage hover:text-lantern flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Trial Grounds
      </Link>

      <div className="text-center space-y-1">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-parchment">
          {quiz.title}
        </h1>
        <p className="text-xs text-sage">
          Answer each prompt thoughtfully. Explanations will be revealed upon submission.
        </p>
      </div>

      <QuizPlayer quiz={quiz} />
    </div>
  );
}
