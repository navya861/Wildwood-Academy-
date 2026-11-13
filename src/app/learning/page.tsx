'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpenCheck, Clock, Award, ArrowRight, Library, Sparkles, Layers, Presentation } from 'lucide-react';
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
            Enchanted Learning Paths &amp; Presentation Decks
          </h1>
          <p className="text-xs md:text-sm text-sage mt-1">
            Study complete PowerPoint decks as whole presentations with all slides and structured exam notes.
          </p>
        </div>

        <Link href="/groves">
          <Button variant="secondary" size="sm" className="gap-2">
            <Library className="w-4 h-4" />
            <span>Upload New PPTX</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => (
            <Card
              key={c.id}
              variant="woodland"
              className="flex flex-col justify-between p-6 rounded-2xl hover-shimmer border border-forest-600/40 relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="amber" className="flex items-center gap-1 font-mono text-[10px]">
                    <Presentation className="w-3 h-3 text-lantern" />
                    <span>Whole PPT Deck</span>
                  </Badge>
                  <span className="flex items-center gap-1 text-xs text-sage font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    {c.estimated_hours}h
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-lg md:text-xl font-bold text-parchment line-clamp-2 leading-snug">
                    {c.title}
                  </h3>
                  <p className="text-xs text-sage mt-2 line-clamp-3 leading-relaxed">
                    {c.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 space-y-3 border-t border-forest-700/40 mt-4">
                <ProgressBar value={c.progress || 0} showText color="lantern" />

                <div className="flex items-center justify-between pt-1">
                  <Link href={`/learning/${c.id}`} className="w-full">
                    <Button variant="primary" size="sm" className="w-full gap-2 shadow-lantern text-xs justify-center">
                      <Presentation className="w-4 h-4" />
                      <span>Open Whole PPT Deck</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-auto" />
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
