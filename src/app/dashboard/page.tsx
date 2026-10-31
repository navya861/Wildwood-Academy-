'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpenCheck,
  Library,
  Bot,
  Swords,
  Sparkles,
  ArrowRight,
  Clock,
  Award,
  Flame,
  CheckCircle2,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, Badge, ProgressBar } from '@/components/ui/Card';
import { GrowingPlant } from '@/components/ui/GrowingPlant';
import { Course, StudyMaterial, UserProfile } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [journal, setJournal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quickPrompt, setQuickPrompt] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [meRes, coursesRes, matRes, jourRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/courses'),
          fetch('/api/materials'),
          fetch('/api/progress'),
        ]);

        const meData = await meRes.json();
        if (!meData.authenticated) {
          router.push('/auth/login');
          return;
        }
        setProfile(meData.user);

        const coursesData = await coursesRes.json();
        setCourses(coursesData.courses || []);

        const matData = await matRes.json();
        setMaterials(matData.materials || []);

        const jourData = await jourRes.json();
        setJournal(jourData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handleQuickTutor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    router.push(`/tutor?q=${encodeURIComponent(quickPrompt)}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Sparkles className="w-8 h-8 text-lantern animate-spin" />
          <p className="text-xs text-sage font-mono">Opening your Academy journal...</p>
        </div>
      </div>
    );
  }

  const activeCourse = courses[0];
  const totalLessons = journal?.lessonsCount || 0;
  const completedLessons = journal?.completedLessonsCount || 0;
  const masteryPercent = journal?.averageQuizScore || 0;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome & Scholar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-forest-800/90 via-forest-800/60 to-forest-900 border border-forest-600/40 shadow-forest relative overflow-hidden">
        <div className="space-y-2 z-10">
          <Badge variant="amber" className="gap-1.5 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-lantern" />
            Circle {profile?.level || 1} Apprentice
          </Badge>
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-parchment">
            Welcome back, {profile?.display_name || 'Scholar'}
          </h1>
          <p className="text-xs md:text-sm text-sage max-w-xl">
            The lanterns are lit across the Academy groves. Your learning journey is saved and protected.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <Link href="/groves">
            <Button variant="primary" size="md" className="gap-2 shadow-lantern">
              <Library className="w-4 h-4" />
              <span>Upload Study Material</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="woodland" className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 rounded-xl bg-forest-800 border border-lantern/30 flex items-center justify-center text-lantern shrink-0">
            <BookOpenCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-sage block font-sans">Active Courses</span>
            <span className="text-lg md:text-xl font-serif font-bold text-parchment font-mono">
              {courses.length}
            </span>
          </div>
        </Card>

        <Card variant="woodland" className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 rounded-xl bg-forest-800 border border-moss/40 flex items-center justify-center text-moss-300 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-sage block font-sans">Completed Lessons</span>
            <span className="text-lg md:text-xl font-serif font-bold text-parchment font-mono">
              {completedLessons} / {totalLessons}
            </span>
          </div>
        </Card>

        <Card variant="woodland" className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 rounded-xl bg-forest-800 border border-lantern/30 flex items-center justify-center text-lantern shrink-0">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-sage block font-sans">Trial Mastery</span>
            <span className="text-lg md:text-xl font-serif font-bold text-parchment font-mono">
              {masteryPercent}%
            </span>
          </div>
        </Card>

        <Card variant="woodland" className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 rounded-xl bg-forest-800 border border-amber-600/40 flex items-center justify-center text-amber-300 shrink-0">
            <Flame className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <span className="text-[11px] text-sage block font-sans">Scholar Streak</span>
            <span className="text-lg md:text-xl font-serif font-bold text-parchment font-mono">
              {profile?.streak_days || 1} Days
            </span>
          </div>
        </Card>
      </div>

      {/* Main Grid: Continue Learning + Plant Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Continue Learning & Active Courses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Learning Featured Card */}
          {activeCourse ? (
            <div className="p-6 rounded-2xl bg-forest-800/70 border border-lantern/30 shadow-lantern space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <Badge variant="amber" className="gap-1 text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  Continue Learning
                </Badge>
                <span className="text-xs text-sage font-mono">
                  {activeCourse.estimated_hours} Hours Est.
                </span>
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-parchment">
                  {activeCourse.title}
                </h3>
                <p className="text-xs md:text-sm text-sage mt-1 line-clamp-2 leading-relaxed">
                  {activeCourse.description}
                </p>
              </div>

              <div className="space-y-1.5 pt-1">
                <ProgressBar value={activeCourse.progress || 0} showText color="lantern" />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-sage">
                  From: {activeCourse.source_material_title || 'Enshrined Scroll'}
                </span>
                <Link href={`/learning/${activeCourse.id}`}>
                  <Button variant="primary" size="sm" className="gap-1.5">
                    <span>Resume Course</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-forest-800/40 border border-dashed border-forest-600/50 space-y-3">
              <BookOpenCheck className="w-10 h-10 text-sage mx-auto" />
              <h3 className="font-serif text-base font-semibold text-parchment">
                No Active Courses Yet
              </h3>
              <p className="text-xs text-sage max-w-sm mx-auto">
                Enshrine a study document in the Woodland Library to generate your first structured learning path.
              </p>
              <Link href="/groves" className="inline-block pt-1">
                <Button variant="secondary" size="sm">
                  Visit Woodland Library
                </Button>
              </Link>
            </div>
          )}

          {/* Quick AI Tutor Inquiries Box */}
          <div className="p-5 rounded-2xl bg-forest-800/40 border border-forest-600/30 space-y-3">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-lantern" />
              <h3 className="font-serif text-sm font-semibold text-parchment">
                Ask the Forest Guide
              </h3>
            </div>
            <form onSubmit={handleQuickTutor} className="flex gap-2">
              <input
                type="text"
                value={quickPrompt}
                onChange={(e) => setQuickPrompt(e.target.value)}
                placeholder="Ask about a formula, theorem, or passage from your scrolls..."
                className="flex-1 bg-forest-900 border border-forest-600/50 rounded-xl px-4 py-2 text-xs md:text-sm text-parchment placeholder-sage/40 focus:outline-none focus:ring-1 focus:ring-lantern"
              />
              <Button type="submit" variant="primary" size="sm" className="gap-1">
                <span>Inquire</span>
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>

          {/* Recent Study Materials */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-parchment">
                Recent Library Scrolls
              </h3>
              <Link href="/groves" className="text-xs text-lantern hover:underline">
                View All Scrolls ({materials.length})
              </Link>
            </div>

            {materials.length === 0 ? (
              <p className="text-xs text-sage italic">No materials uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {materials.slice(0, 4).map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-xl bg-forest-800/50 border border-forest-600/30 hover-shimmer flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="font-semibold text-xs md:text-sm text-parchment truncate block">
                        {m.title}
                      </span>
                      <span className="text-[11px] text-sage font-mono">
                        {(m.file_size / 1024).toFixed(0)} KB · {m.metadata?.chunk_count || 1} chunks
                      </span>
                    </div>
                    <Badge variant={m.processing_status === 'completed' ? 'success' : 'warning'}>
                      {m.processing_status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Virtual Plant Growth Metaphor */}
        <div className="space-y-6">
          <GrowingPlant xp={profile?.xp || 0} level={profile?.level || 1} />

          {/* Mini-Game Callout */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-forest-800/90 to-forest-950 border border-lantern/30 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-lantern animate-bounce" />
              <h4 className="font-serif font-bold text-sm text-parchment">
                Firefly Quest
              </h4>
            </div>
            <p className="text-xs text-sage leading-relaxed">
              Step into the Enchanted Clearing. Guide your woodland creature by answering study questions and catch fireflies!
            </p>
            <Link href="/clearing">
              <Button variant="primary" size="sm" className="w-full gap-2 shadow-lantern">
                <span>Play Firefly Quest</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
