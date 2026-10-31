'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LessonPlayer } from '@/components/course/LessonPlayer';
import { Course, Lesson } from '@/lib/types';
import { Sparkles } from 'lucide-react';

export default function LessonViewPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cRes, lRes] = await Promise.all([
          fetch(`/api/courses/${courseId}`),
          fetch(`/api/courses/lessons/${lessonId}`),
        ]);

        const cData = await cRes.json();
        const lData = await lRes.json();

        if (cData.course) setCourse(cData.course);
        if (lData.lesson) setLesson(lData.lesson);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [courseId, lessonId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Sparkles className="w-8 h-8 text-lantern animate-spin" />
          <p className="text-xs text-sage font-mono">Lighting the scholar lantern...</p>
        </div>
      </div>
    );
  }

  if (!lesson || !course) {
    return (
      <div className="p-8 text-center woodland-panel rounded-2xl max-w-md mx-auto">
        <h3 className="font-serif text-lg font-bold text-parchment">Lesson Not Found</h3>
        <p className="text-xs text-sage mt-1">This lesson scroll could not be located.</p>
      </div>
    );
  }

  // Find previous and next lessons in course
  const allLessons = course.modules?.flatMap(m => m.lessons || []) || [];
  const currentIdx = allLessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : undefined;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : undefined;

  return (
    <LessonPlayer
      lesson={lesson}
      courseTitle={course.title}
      courseId={course.id}
      prevLessonId={prevLesson?.id}
      nextLessonId={nextLesson?.id}
    />
  );
}
