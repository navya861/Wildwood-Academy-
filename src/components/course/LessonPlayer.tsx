'use client';

import React, { useState, useEffect } from 'react';
import { Lesson } from '@/lib/types';
import { CheckCircle2, Circle, Clock, BookOpen, Sparkles, ArrowLeft, ArrowRight, MessageSquare, Feather, Lightbulb } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import Link from 'next/link';

interface LessonPlayerProps {
  lesson: Lesson;
  courseTitle: string;
  courseId: string;
  prevLessonId?: string;
  nextLessonId?: string;
  onComplete?: (completed: boolean) => void;
}

export function LessonPlayer({
  lesson,
  courseTitle,
  courseId,
  prevLessonId,
  nextLessonId,
  onComplete,
}: LessonPlayerProps) {
  const [isCompleted, setIsCompleted] = useState(lesson.is_completed || false);
  const [startTime] = useState(Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [knowledgeCheckAnswer, setKnowledgeCheckAnswer] = useState<number | null>(null);

  const handleToggleComplete = async () => {
    setSubmitting(true);
    const durationSeconds = Math.max(30, Math.round((Date.now() - startTime) / 1000));
    const nextState = !isCompleted;

    try {
      const res = await fetch(`/api/courses/lessons/${lesson.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: courseId,
          completed: nextState,
          duration_seconds: durationSeconds,
        }),
      });

      if (res.ok) {
        setIsCompleted(nextState);
        if (onComplete) onComplete(nextState);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Breadcrumb & Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-forest-600/30">
        <div>
          <Link
            href={`/learning/${courseId}`}
            className="text-xs text-sage hover:text-lantern flex items-center gap-1.5 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to {courseTitle}
          </Link>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-parchment">
            {lesson.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="sage" className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{lesson.estimated_duration || 15} mins</span>
          </Badge>

          <Button
            onClick={handleToggleComplete}
            isLoading={submitting}
            variant={isCompleted ? 'secondary' : 'primary'}
            size="sm"
            className="gap-2"
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-moss-400" />
                <span>Completed</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4" />
                <span>Mark as Complete</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Learning Objectives Box */}
      {lesson.learning_objectives && lesson.learning_objectives.length > 0 && (
        <div className="p-5 rounded-2xl bg-forest-800/60 border border-forest-600/40 relative">
          <h3 className="font-serif text-sm font-semibold text-lantern flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-lantern" />
            Learning Objectives
          </h3>
          <ul className="space-y-2">
            {lesson.learning_objectives.map((obj, i) => (
              <li key={i} className="text-xs md:text-sm text-sage-light flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-lantern mt-1.5 shrink-0" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Core Lesson Teaching Content */}
      <article className="prose prose-invert max-w-none text-parchment/90 space-y-4 leading-relaxed font-sans text-sm md:text-base">
        {lesson.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-xl font-serif font-bold text-lantern pt-4 border-b border-forest-700/50 pb-2">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('#### ')) {
            return (
              <h4 key={idx} className="text-lg font-serif font-semibold text-sage-light pt-2">
                {paragraph.replace('#### ', '')}
              </h4>
            );
          }
          if (paragraph.startsWith('> ')) {
            return (
              <blockquote key={idx} className="border-l-4 border-lantern pl-4 italic text-sage my-4">
                {paragraph.replace('> ', '')}
              </blockquote>
            );
          }
          return <p key={idx}>{paragraph}</p>;
        })}
      </article>

      {/* Key Terms Glossary */}
      {lesson.key_terms && lesson.key_terms.length > 0 && (
        <div className="pt-6 border-t border-forest-700/40">
          <h3 className="font-serif text-lg font-bold text-parchment flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-lantern" />
            Key Terminology & Lore
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lesson.key_terms.map((term, i) => (
              <div key={i} className="p-4 rounded-xl bg-forest-800/50 border border-forest-600/30">
                <span className="font-serif font-semibold text-sm text-lantern block mb-1">
                  {term.term}
                </span>
                <p className="text-xs text-sage leading-relaxed">
                  {term.definition}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Examples & Worked Problems */}
      {lesson.examples && lesson.examples.length > 0 && (
        <div className="pt-6 border-t border-forest-700/40">
          <h3 className="font-serif text-lg font-bold text-parchment flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            Worked Examples & Demonstrations
          </h3>
          <div className="space-y-3">
            {lesson.examples.map((ex, i) => (
              <div key={i} className="p-4 rounded-xl bg-forest-800/40 border border-sage/20">
                <h4 className="font-semibold text-sm text-parchment mb-1">{ex.title}</h4>
                <p className="text-xs md:text-sm text-sage leading-relaxed">{ex.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Knowledge Check */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-forest-800/80 to-forest-900 border border-lantern/30">
        <h4 className="font-serif font-semibold text-parchment flex items-center gap-2 text-base mb-2">
          <Sparkles className="w-4 h-4 text-lantern" />
          Quick Knowledge Check
        </h4>
        <p className="text-xs md:text-sm text-sage mb-4">
          Which approach guarantees maximum retention when exploring these concepts?
        </p>
        <div className="space-y-2">
          {['Active recall and synthesizing personal notes in Scribe Corner', 'Skimming without reviewing key terminology', 'Memorizing definitions without understanding boundary constraints'].map((opt, i) => (
            <button
              key={i}
              onClick={() => setKnowledgeCheckAnswer(i)}
              className={`w-full text-left p-3 rounded-xl border text-xs md:text-sm transition-all ${
                knowledgeCheckAnswer === i
                  ? i === 0
                    ? 'border-moss bg-moss/20 text-moss-300 font-semibold'
                    : 'border-red-600/50 bg-red-950/30 text-red-300'
                  : 'border-forest-600/40 bg-forest-800/40 hover:bg-forest-700/50 text-sage-light'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {knowledgeCheckAnswer === 0 && (
          <p className="text-xs text-moss-300 mt-3 font-medium">
            Correct! Active recall grounds knowledge firmly into memory.
          </p>
        )}
      </div>

      {/* Interactive Action Shortcuts (Scribe & AI Tutor) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        <Link
          href={`/scribe?lesson_id=${lesson.id}`}
          className="flex items-center gap-3 p-4 rounded-xl bg-forest-800/50 border border-forest-600/40 hover:border-lantern/50 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-forest-700 flex items-center justify-center text-lantern group-hover:scale-105 transition-transform">
            <Feather className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-parchment group-hover:text-lantern transition-colors">
              Penn Notes in Scribe&apos;s Corner
            </h4>
            <p className="text-xs text-sage">Generate revision sheets or write personal takeaways.</p>
          </div>
        </Link>

        <Link
          href={`/tutor?lesson_id=${lesson.id}`}
          className="flex items-center gap-3 p-4 rounded-xl bg-forest-800/50 border border-forest-600/40 hover:border-lantern/50 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-forest-700 flex items-center justify-center text-lantern group-hover:scale-105 transition-transform">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-parchment group-hover:text-lantern transition-colors">
              Ask the Forest Guide
            </h4>
            <p className="text-xs text-sage">Discuss this lesson with your source-grounded AI tutor.</p>
          </div>
        </Link>
      </div>

      {/* Previous / Next Lesson Navigation Footer */}
      <div className="flex items-center justify-between pt-8 border-t border-forest-700/50">
        {prevLessonId ? (
          <Link href={`/learning/${courseId}/lesson/${prevLessonId}`}>
            <Button variant="secondary" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Lesson</span>
            </Button>
          </Link>
        ) : (
          <div />
        )}

        {nextLessonId ? (
          <Link href={`/learning/${courseId}/lesson/${nextLessonId}`}>
            <Button variant="primary" size="sm" className="gap-2">
              <span>Next Lesson</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        ) : (
          <Link href={`/learning/${courseId}`}>
            <Button variant="secondary" size="sm" className="gap-2">
              <span>Finish Course Outline</span>
              <CheckCircle2 className="w-4 h-4 text-moss-400" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
