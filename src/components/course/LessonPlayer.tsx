'use client';

import React, { useState, useEffect } from 'react';
import { Lesson } from '@/lib/types';
import { CheckCircle2, Circle, Clock, BookOpen, Sparkles, ArrowLeft, ArrowRight, MessageSquare, Feather, Lightbulb, Swords, Presentation } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { SlideDeckViewer } from './SlideDeckViewer';
import { OriginalSlideView } from './OriginalSlideView';
import { LessonContentRenderer } from './LessonContentRenderer';
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
  const [studyMode, setStudyMode] = useState<'notes' | 'slides'>('slides');

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

  const hasSlides = !!(lesson.slides && lesson.slides.length > 0);

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

      {/* Mode Selector (When presentation slides exist, default to Original Slide Deck) */}
      {hasSlides && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-2xl bg-forest-900/80 border border-forest-600/40 shadow-md">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setStudyMode('slides')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-serif font-semibold transition-all ${
                studyMode === 'slides'
                  ? 'bg-forest-700 text-lantern border border-lantern/40 shadow-sm font-bold'
                  : 'text-sage hover:text-parchment hover:bg-forest-800'
              }`}
            >
              <Presentation className="w-4 h-4 text-lantern" />
              <span>Original Slide Presentation ({lesson.slides!.length} Slides)</span>
            </button>
            <button
              onClick={() => setStudyMode('notes')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-serif font-semibold transition-all ${
                studyMode === 'notes'
                  ? 'bg-forest-700 text-lantern border border-lantern/40 shadow-sm font-bold'
                  : 'text-sage hover:text-parchment hover:bg-forest-800'
              }`}
            >
              <BookOpen className="w-4 h-4 text-lantern" />
              <span>Full Study Notes &amp; Exam Guide</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-sage px-2">
            <span className="font-mono text-[11px] bg-forest-950/80 px-2 py-0.5 rounded border border-forest-700/50">
              {studyMode === 'slides' ? '📽️ Slide Deck (Default)' : '📖 Study Notes Mode'}
            </span>
          </div>
        </div>
      )}

      {/* Main Study Workspace */}
      {hasSlides && studyMode === 'slides' ? (
        <div className="space-y-4">
          <OriginalSlideView
            slides={lesson.slides!}
            presentation={lesson.presentation}
            lessonTitle={lesson.title}
            onSwitchToNotes={() => setStudyMode('notes')}
          />

          {/* Quick link banner to open full study notes */}
          <div className="p-4 rounded-2xl bg-forest-900/80 border border-forest-700/50 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-800 border border-lantern/30 flex items-center justify-center text-lantern shrink-0">
                <BookOpen className="w-5 h-5 text-lantern" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-parchment">
                  Want in-depth explanations and exam notes?
                </h4>
                <p className="text-xs text-sage">
                  Explore full narrative paragraphs, status codes cheat sheets, and high-frequency exam questions.
                </p>
              </div>
            </div>
            <Button
              onClick={() => setStudyMode('notes')}
              variant="secondary"
              size="sm"
              className="gap-2 shrink-0 text-lantern hover:text-lantern-light"
            >
              <BookOpen className="w-4 h-4" />
              <span>Open Study Notes</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Core Lesson Teaching Content (Full Pedagogical Textbook) */}
          <div className="woodland-panel rounded-3xl p-6 md:p-10 border border-forest-600/40 shadow-xl bg-forest-900/60 backdrop-blur-md">
            <LessonContentRenderer content={lesson.content} />
          </div>

          {/* Quick link to Slide Presentation Stage when slides exist */}
          {hasSlides && (
            <div className="p-4 rounded-2xl bg-forest-900/80 border border-forest-700/50 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-forest-800 border border-lantern/30 flex items-center justify-center text-lantern shrink-0">
                  <Presentation className="w-5 h-5 text-lantern" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-parchment">
                    Return to Original PowerPoint Slides
                  </h4>
                  <p className="text-xs text-sage">
                    Step through all {lesson.slides!.length} slides in 16:9 widescreen presentation mode.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setStudyMode('slides')}
                variant="primary"
                size="sm"
                className="gap-2 shrink-0 shadow-lantern"
              >
                <Presentation className="w-4 h-4" />
                <span>Open Slide Stage</span>
              </Button>
            </div>
          )}
        </div>
      )}

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

      {/* Interactive Action Shortcuts (Scribe, AI Tutor & Trial Grounds) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <Link
          href={`/trials?lesson_id=${lesson.id}`}
          className="flex items-center gap-3 p-4 rounded-xl bg-forest-800/50 border border-forest-600/40 hover:border-lantern/50 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-forest-700 flex items-center justify-center text-lantern group-hover:scale-105 transition-transform">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-parchment group-hover:text-lantern transition-colors">
              Grounded Lesson Quiz
            </h4>
            <p className="text-xs text-sage">Test lore directly derived from this material.</p>
          </div>
        </Link>

        <Link
          href={`/scribe?lesson_id=${lesson.id}`}
          className="flex items-center gap-3 p-4 rounded-xl bg-forest-800/50 border border-forest-600/40 hover:border-lantern/50 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-forest-700 flex items-center justify-center text-lantern group-hover:scale-105 transition-transform">
            <Feather className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-parchment group-hover:text-lantern transition-colors">
              Penn Notes in Scribe
            </h4>
            <p className="text-xs text-sage">Generate revision sheets or personal takeaways.</p>
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
              Ask Forest Guide
            </h4>
            <p className="text-xs text-sage">Discuss this lesson with your AI tutor.</p>
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
