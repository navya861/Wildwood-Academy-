'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpenCheck, Clock, Award, ArrowRight, Library, Sparkles } from 'lucide-react';
import { Course } from '@/lib/types';
import { Card, Badge, ProgressBar } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function LearningPathsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (data.courses) setCourses(data.courses);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="amber" className="gap-1 text-xs">
              <BookOpenCheck className="w-3.5 h-3.5" />
              Curriculum Paths
            </Badge>
          </div>
          <h1 className="text-3xl font-serif font-bold text-parchment">
            Enchanted Learning Paths
          </h1>
          <p className="text-xs md:text-sm text-sage mt-1">
            Explore structured courses synthesized by the Master Instructor from your uploaded materials.
          </p>
        </div>

        <Link href="/groves">
          <Button variant="secondary" size="sm" className="gap-2">
            <Library className="w-4 h-4" />
            <span>Generate New from Scrolls</span>
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-sage animate-pulse">
          Walking the academic path...
        </div>
      ) : courses.length === 0 ? (
        <div className="p-12 text-center woodland-panel rounded-3xl border-dashed space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-forest-800 border border-lantern/30 flex items-center justify-center text-lantern mx-auto">
            <BookOpenCheck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-parchment">
              No Courses Synthesized Yet
            </h3>
            <p className="text-xs md:text-sm text-sage max-w-md mx-auto mt-1">
              Visit the Woodland Library, upload a study scroll, and click &ldquo;Synthesize Course&rdquo; to begin.
            </p>
          </div>
          <Link href="/groves">
            <Button variant="primary" size="md">
              Go to Woodland Library
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((c) => (
            <Card
              key={c.id}
              variant="woodland"
              className="flex flex-col justify-between p-6 rounded-2xl hover-shimmer border border-forest-600/40 relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="sage" className="capitalize">
                    {c.level || 'Intermediate'}
                  </Badge>
                  <span className="flex items-center gap-1 text-xs text-sage font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    {c.estimated_hours}h
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-bold text-parchment line-clamp-1">
                    {c.title}
                  </h3>
                  <p className="text-xs text-sage mt-1 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 space-y-3">
                <ProgressBar value={c.progress || 0} showText color="lantern" />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-sage truncate max-w-[180px]">
                    Scroll: {c.source_material_title || 'Enshrined Document'}
                  </span>
                  <Link href={`/learning/${c.id}`}>
                    <Button variant="primary" size="sm" className="gap-1.5 shadow-lantern">
                      <span>View Outline</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
