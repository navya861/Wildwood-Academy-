'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Course } from '@/lib/types';
import { BookOpenCheck, Clock, CheckCircle2, Circle, ArrowLeft, ArrowRight, Swords, Feather, Bot, Trash2, Presentation, Layers } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge, ProgressBar } from '@/components/ui/Card';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourse() {
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        const data = await res.json();
        if (data.course) setCourse(data.course);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [courseId]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you wish to banish this course?')) return;
    try {
      await fetch(`/api/courses/${courseId}`, { method: 'DELETE' });
      router.push('/learning');
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-sage animate-pulse">
        Unrolling presentation scrolls...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-12 text-center woodland-panel rounded-3xl space-y-4 max-w-md mx-auto">
        <h3 className="font-serif text-lg font-bold text-parchment">Course Not Found</h3>
        <p className="text-xs text-sage">This path may have been archived or removed.</p>
        <Link href="/learning">
          <Button variant="secondary" size="sm">
            Back to Learning Paths
          </Button>
        </Link>
      </div>
    );
  }

  const allLessons = course.modules?.flatMap(m => m.lessons || []) || [];
  const firstUnfinishedLesson = allLessons.find(l => !l.is_completed) || allLessons[0];
  const totalSlides = firstUnfinishedLesson?.slides?.length || (firstUnfinishedLesson as any)?.presentation?.total_slides || 18;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header & Breadcrumb */}
      <div>
        <Link
          href="/learning"
          className="text-xs text-sage hover:text-lantern flex items-center gap-1.5 transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to All Presentation Decks
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="amber" className="capitalize flex items-center gap-1 font-mono text-[10px]">
                <Presentation className="w-3 h-3 text-lantern" />
                <span>Whole PPT Deck · {totalSlides} Slides</span>
              </Badge>
              <span className="text-xs text-sage font-mono">
                {course.estimated_hours} Hours Estimated
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-parchment">
              {course.title}
            </h1>
            <p className="text-xs md:text-sm text-sage max-w-2xl leading-relaxed">
              {course.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {firstUnfinishedLesson && (
              <Link href={`/learning/${course.id}/lesson/${firstUnfinishedLesson.id}`}>
                <Button variant="primary" size="md" className="gap-2 shadow-lantern text-xs">
                  <Presentation className="w-4 h-4 text-lantern" />
                  <span>Launch Whole PPT ({totalSlides} Slides)</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}

            <button
              onClick={handleDelete}
              className="p-2.5 rounded-xl bg-forest-800 hover:bg-red-950/60 text-sage hover:text-red-300 border border-forest-600/40 transition-colors"
              title="Delete Course"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <div className="p-5 rounded-2xl bg-forest-800/60 border border-forest-600/40 space-y-2">
        <div className="flex items-center justify-between text-xs text-sage">
          <span className="font-semibold text-parchment">Presentation Exploration Progress</span>
          <span className="font-mono text-lantern">{course.progress || 0}% Complete</span>
        </div>
        <ProgressBar value={course.progress || 0} color="lantern" />
      </div>

      {/* Course Actions Bar (Quiz & Tutor) */}
      <div className="flex flex-wrap items-center gap-3">
        <Link href={`/trials?course_id=${course.id}`}>
          <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
            <Swords className="w-4 h-4 text-lantern" />
            <span>Generate Trial Quiz</span>
          </Button>
        </Link>
        <Link href={`/scribe?course_id=${course.id}`}>
          <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
            <Feather className="w-4 h-4 text-sage" />
            <span>Open Scribe Notes &amp; Flashcards</span>
          </Button>
        </Link>
        <Link href={`/tutor?course_id=${course.id}`}>
          <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
            <Bot className="w-4 h-4 text-lantern" />
            <span>Ask Tutor About This Deck</span>
          </Button>
        </Link>
      </div>

      {/* Modules & Whole Deck Outline */}
      <div className="space-y-6 pt-2">
        <h2 className="font-serif text-2xl font-bold text-parchment">
          Presentation Deck &amp; Study Guide
        </h2>

        {course.modules?.map((mod, modIdx) => (
          <div
            key={mod.id}
            className="woodland-panel rounded-2xl overflow-hidden border border-forest-600/40"
          >
            {/* Module Header */}
            <div className="p-5 bg-forest-800/80 border-b border-forest-600/40">
              <span className="text-[11px] font-mono text-lantern uppercase tracking-wider block">
                Primary Module
              </span>
              <h3 className="font-serif text-lg font-bold text-parchment mt-0.5">
                {mod.title}
              </h3>
              {mod.description && (
                <p className="text-xs text-sage mt-1 leading-relaxed">{mod.description}</p>
              )}
            </div>

            {/* Lessons List */}
            <div className="divide-y divide-forest-700/30">
              {mod.lessons?.map((les) => (
                <div
                  key={les.id}
                  className="p-5 hover:bg-forest-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    {les.is_completed ? (
                      <CheckCircle2 className="w-5 h-5 text-moss-400 shrink-0 mt-0.5 sm:mt-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-sage/40 shrink-0 mt-0.5 sm:mt-0" />
                    )}

                    <div className="min-w-0">
                      <Link
                        href={`/learning/${course.id}/lesson/${les.id}`}
                        className="text-sm font-serif font-bold text-parchment hover:text-lantern transition-colors truncate block"
                      >
                        {les.title}
                      </Link>
                      <span className="text-xs text-sage font-mono block mt-0.5">
                        {les.slides?.length || totalSlides} Original Slides in Deck · Complete Exam Study Notes Included
                      </span>
                    </div>
                  </div>

                  <Link href={`/learning/${course.id}/lesson/${les.id}`}>
                    <Button variant="primary" size="sm" className="gap-2 shrink-0 shadow-lantern text-xs">
                      <Presentation className="w-3.5 h-3.5" />
                      <span>{les.is_completed ? 'Reopen Deck' : 'Open Deck (All Slides)'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
