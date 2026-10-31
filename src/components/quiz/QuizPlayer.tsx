'use client';

import React, { useState } from 'react';
import { Quiz, QuizAttempt } from '@/lib/types';
import { Swords, CheckCircle, XCircle, Clock, Award, RotateCcw, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';

interface QuizPlayerProps {
  quiz: Quiz;
  onAttemptCompleted?: (attempt: QuizAttempt) => void;
}

export function QuizPlayer({ quiz, onAttemptCompleted }: QuizPlayerProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [startTime] = useState(new Date().toISOString());
  const [submitting, setSubmitting] = useState(false);
  const [attemptResult, setAttemptResult] = useState<QuizAttempt | null>(null);

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentIdx];

  const handleSelectOption = (questionId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/quizzes/${quiz.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submitted_answers: answers,
          started_at: startTime,
        }),
      });

      const data = await res.json();
      if (res.ok && data.attempt) {
        setAttemptResult(data.attempt);
        if (onAttemptCompleted) onAttemptCompleted(data.attempt);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentIdx(0);
    setAttemptResult(null);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 text-center woodland-panel rounded-2xl max-w-xl mx-auto">
        <Swords className="w-12 h-12 text-sage mx-auto mb-3" />
        <h3 className="font-serif text-lg font-semibold text-parchment">No Questions Found</h3>
        <p className="text-xs text-sage mt-1">This trial has no questions configured yet.</p>
      </div>
    );
  }

  // RESULT SCREEN AFTER SUBMISSION
  if (attemptResult) {
    const isPassing = attemptResult.percentage >= 70;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="p-8 woodland-panel rounded-2xl text-center space-y-4 border border-lantern/40 shadow-lantern">
          <div className="w-16 h-16 rounded-2xl bg-forest-800 border border-lantern/40 flex items-center justify-center text-lantern mx-auto shadow-md">
            <Award className="w-8 h-8 text-lantern" />
          </div>

          <div>
            <Badge variant={isPassing ? 'success' : 'warning'} className="mb-2">
              {isPassing ? 'Trial Mastered' : 'Trial Concluded'}
            </Badge>
            <h2 className="text-3xl font-serif font-bold text-parchment">
              Score: {attemptResult.score} / {attemptResult.max_score}
            </h2>
            <p className="text-sm text-sage mt-1">
              Comprehension Rating: <span className="font-semibold text-lantern">{attemptResult.percentage}%</span>
            </p>
          </div>

          <div className="max-w-xs mx-auto">
            <ProgressBar value={attemptResult.percentage} color={isPassing ? 'lantern' : 'moss'} />
          </div>

          <div className="pt-2">
            <Button onClick={handleRetry} variant="secondary" size="sm" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              <span>Retry Trial</span>
            </Button>
          </div>
        </div>

        {/* Detailed Question Review & Explanations */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-parchment">
            Scholar&apos;s Review & Explanations
          </h3>

          {attemptResult.feedback.map((item, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border ${
                item.is_correct
                  ? 'bg-moss-700/20 border-moss/40 text-parchment'
                  : 'bg-red-950/20 border-red-800/40 text-parchment'
              }`}
            >
              <div className="flex items-start gap-3">
                {item.is_correct ? (
                  <CheckCircle className="w-5 h-5 text-moss-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                )}

                <div className="flex-1 space-y-2">
                  <h4 className="font-semibold text-sm text-parchment">
                    {idx + 1}. {item.question_text}
                  </h4>

                  <div className="text-xs space-y-1">
                    <p className="text-sage">
                      Your Answer: <span className={item.is_correct ? 'text-moss-300 font-semibold' : 'text-red-300 font-semibold'}>{item.submitted || '(Blank)'}</span>
                    </p>
                    {!item.is_correct && (
                      <p className="text-sage">
                        Correct Lore: <span className="text-lantern font-semibold">{item.correct}</span>
                      </p>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-forest-900/60 border border-forest-700/40 text-xs text-sage leading-relaxed mt-2">
                    <span className="font-semibold text-lantern block mb-1">Pedagogical Explanation:</span>
                    {item.explanation}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ACTIVE QUIZ QUESTION SCREEN
  const selectedAnswer = answers[currentQuestion.id] || '';
  const isAnswered = Boolean(selectedAnswer.trim());
  const isLastQuestion = currentIdx === questions.length - 1;

  return (
    <div className="max-w-2xl mx-auto woodland-panel rounded-2xl p-6 md:p-8 space-y-6 border border-forest-600/40">
      {/* Top Question Indicator & Progress */}
      <div>
        <div className="flex items-center justify-between text-xs text-sage mb-2">
          <span className="font-mono">
            Question {currentIdx + 1} of {questions.length}
          </span>
          <Badge variant="amber" className="capitalize">
            {quiz.difficulty} Difficulty
          </Badge>
        </div>
        <ProgressBar value={((currentIdx + 1) / questions.length) * 100} color="lantern" />
      </div>

      {/* Question Prompt */}
      <div className="py-2">
        <h3 className="text-lg md:text-xl font-serif font-bold text-parchment leading-snug">
          {currentQuestion.question_text}
        </h3>
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {currentQuestion.question_type === 'multiple_choice' || currentQuestion.question_type === 'true_false' ? (
          (currentQuestion.options || ['True', 'False']).map((opt, i) => {
            const isSelected = selectedAnswer === opt;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectOption(currentQuestion.id, opt)}
                className={`w-full text-left p-4 rounded-xl border text-xs md:text-sm transition-all duration-200 flex items-center gap-3 ${
                  isSelected
                    ? 'border-lantern bg-lantern/15 text-parchment font-semibold shadow-lantern'
                    : 'border-forest-600/40 bg-forest-800/40 hover:bg-forest-700/40 text-sage-light'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-xs ${
                    isSelected ? 'border-lantern bg-lantern text-ink font-bold' : 'border-sage/40'
                  }`}
                >
                  {isSelected && '✓'}
                </div>
                <span>{opt}</span>
              </button>
            );
          })
        ) : (
          <div>
            <textarea
              rows={3}
              value={selectedAnswer}
              onChange={(e) => handleSelectOption(currentQuestion.id, e.target.value)}
              placeholder="Type your scholarly answer here..."
              className="w-full bg-forest-800 border border-forest-600/50 rounded-xl p-3 text-xs md:text-sm text-parchment placeholder-sage/40 focus:outline-none focus:ring-2 focus:ring-lantern"
            />
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-forest-700/40">
        <Button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          variant="ghost"
          size="sm"
          className="gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>

        {isLastQuestion ? (
          <Button
            onClick={handleSubmit}
            isLoading={submitting}
            variant="primary"
            size="md"
            className="gap-2"
          >
            <span>Submit for Grading</span>
            <Award className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            variant="primary"
            size="sm"
            className="gap-1.5"
          >
            <span>Next Question</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
