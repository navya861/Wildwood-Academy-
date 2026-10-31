'use client';

import React, { useEffect, useState } from 'react';
import { Sprout, Award, Flame, Clock, CheckCircle2, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import { GrowingPlant } from '@/components/ui/GrowingPlant';
import { Card, Badge, ProgressBar } from '@/components/ui/Card';
import { Achievement, UserProfile } from '@/lib/types';

export default function GrowthJournalPage() {
  const [journal, setJournal] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJournal() {
      try {
        const [pRes, jRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/progress'),
        ]);

        const pData = await pRes.json();
        const jData = await jRes.json();

        if (pData.user) setProfile(pData.user);
        setJournal(jData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadJournal();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-sage animate-pulse">
        Opening your scholar growth journal...
      </div>
    );
  }

  const studyMinutes = Math.round((journal?.totalStudyTimeSeconds || 0) / 60);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="amber" className="gap-1 text-xs">
            <Sprout className="w-3.5 h-3.5" />
            Scholar Growth Journal
          </Badge>
        </div>
        <h1 className="text-3xl font-serif font-bold text-parchment">
          The Living Chronicle of Wisdom
        </h1>
        <p className="text-xs md:text-sm text-sage mt-1">
          Track verified learning milestones, study session endurance, weak topics, and your botanical growth.
        </p>
      </div>

      {/* Top Botanical & Lore Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <GrowingPlant xp={profile?.xp || 0} level={profile?.level || 1} />
        </div>

        <div className="md:col-span-2 space-y-4 flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-4">
            <Card variant="woodland" className="p-4 space-y-1">
              <span className="text-xs text-sage flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-lantern" />
                Study Endurance
              </span>
              <p className="text-2xl font-serif font-bold text-parchment font-mono">
                {studyMinutes} mins
              </p>
              <span className="text-[11px] text-sage/70 block">Measured focused study</span>
            </Card>

            <Card variant="woodland" className="p-4 space-y-1">
              <span className="text-xs text-sage flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-moss-300" />
                Lesson Progress
              </span>
              <p className="text-2xl font-serif font-bold text-parchment font-mono">
                {journal?.completedLessonsCount || 0} / {journal?.lessonsCount || 0}
              </p>
              <span className="text-[11px] text-sage/70 block">Lessons mastered</span>
            </Card>

            <Card variant="woodland" className="p-4 space-y-1">
              <span className="text-xs text-sage flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-lantern" />
                Trial Accuracy
              </span>
              <p className="text-2xl font-serif font-bold text-parchment font-mono">
                {journal?.averageQuizScore || 0}%
              </p>
              <span className="text-[11px] text-sage/70 block">Across {journal?.quizAttemptsCount || 0} attempts</span>
            </Card>

            <Card variant="woodland" className="p-4 space-y-1">
              <span className="text-xs text-sage flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Active Streak
              </span>
              <p className="text-2xl font-serif font-bold text-parchment font-mono">
                {profile?.streak_days || 1} Days
              </p>
              <span className="text-[11px] text-sage/70 block">Daily scholar habit</span>
            </Card>
          </div>

          {/* Topics Needing Targeted Revision */}
          <div className="p-5 rounded-2xl bg-forest-800/60 border border-forest-600/40 space-y-2">
            <h4 className="font-serif text-sm font-semibold text-lantern flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-lantern" />
              Topics Needing Targeted Revision
            </h4>
            {journal?.weakTopics && journal.weakTopics.length > 0 ? (
              <ul className="space-y-1.5 pt-1">
                {journal.weakTopics.map((item: any, i: number) => (
                  <li key={i} className="text-xs text-sage flex items-center justify-between p-2 rounded-lg bg-forest-900/60 border border-forest-700/30">
                    <span className="truncate max-w-sm">&ldquo;{item.topic}...&rdquo;</span>
                    <Badge variant="warning" className="shrink-0 text-[10px]">
                      Missed {item.missedCount}x
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-sage italic pt-1">
                No weak topics flagged. Complete more trials to generate targeted revision recommendations!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Unlocked Achievements */}
      <div className="space-y-4 pt-4">
        <h2 className="font-serif text-2xl font-bold text-parchment flex items-center gap-2">
          <Award className="w-6 h-6 text-lantern" />
          <span>Earned Woodland Accolades</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {journal?.achievements && journal.achievements.map((ach: Achievement) => (
            <div
              key={ach.id}
              className="p-5 rounded-2xl bg-forest-800/70 border border-lantern/30 shadow-sm flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-forest-700 border border-lantern/40 flex items-center justify-center text-lantern shrink-0 shadow-lantern">
                <Award className="w-5 h-5" />
              </div>
              <div className="space-y-1 min-w-0">
                <span className="font-serif font-bold text-sm text-parchment truncate block">
                  {ach.title}
                </span>
                <p className="text-xs text-sage leading-relaxed">
                  {ach.description}
                </p>
                <span className="text-[10px] font-mono text-lantern block font-semibold pt-1">
                  +{ach.xp_reward} Lore XP · Earned {new Date(ach.earned_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
