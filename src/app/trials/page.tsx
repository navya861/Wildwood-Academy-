'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Swords, Sparkles, Award, Play, History, ArrowRight, ShieldCheck } from 'lucide-react';
import { Quiz, QuizAttempt, StudyMaterial, Course } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card, Badge, ProgressBar } from '@/components/ui/Card';

function TrialsContent() {
  const searchParams = useSearchParams();
  const initialCourseId = searchParams.get('course_id') || undefined;

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Generator form
  const [difficulty, setDifficulty] = useState<'beginner' | 'medium' | 'advanced'>('medium');
  const [questionCount, setQuestionCount] = useState(4);
  const [selectedSourceType, setSelectedSourceType] = useState<'course' | 'material'>('material');
  const [selectedSourceId, setSelectedSourceId] = useState<string>('');

  const loadData = async () => {
    try {
      const [qRes, aRes, mRes, cRes] = await Promise.all([
        fetch('/api/quizzes'),
        fetch('/api/quizzes/attempts'),
        fetch('/api/materials'),
        fetch('/api/courses'),
      ]);

      const qData = await qRes.json();
      const aData = await aRes.json();
      const mData = await mRes.json();
      const cData = await cRes.json();

      if (qData.quizzes) setQuizzes(qData.quizzes);
      if (aData.attempts) setAttempts(aData.attempts);
      if (mData.materials) {
        const completed = mData.materials.filter((m: any) => m.processing_status === 'completed');
        setMaterials(completed);
        if (completed[0]) setSelectedSourceId(completed[0].id);
      }
      if (cData.courses) setCourses(cData.courses);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerateQuiz = async () => {
    if (!selectedSourceId) return;
    setGenerating(true);
    try {
      const payload: any = {
        difficulty,
        question_count: questionCount,
      };

      if (selectedSourceType === 'material') {
        payload.material_id = selectedSourceId;
      } else {
        payload.course_id = selectedSourceId;
      }

      const res = await fetch('/api/quizzes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.quiz) {
        setQuizzes(prev => [data.quiz, ...prev]);
      } else {
        alert(data.error || 'Failed to synthesize quiz');
      }
    } catch (e: any) {
      alert(e.message || 'Generation error');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="amber" className="gap-1 text-xs">
            <Swords className="w-3.5 h-3.5" />
            The Trial Grounds
          </Badge>
        </div>
        <h1 className="text-3xl font-serif font-bold text-parchment">
          Scholar Trials &amp; Examinations
        </h1>
        <p className="text-xs md:text-sm text-sage mt-1">
          Measure understanding through rigorous quizzes. Graded strictly on the server to prevent answer leakage.
        </p>
      </div>

      {/* Quiz Synthesizer Form Card */}
      <div className="p-6 rounded-2xl bg-forest-800/60 border border-forest-600/40 space-y-4 shadow-forest">
        <h3 className="font-serif text-sm font-semibold text-lantern flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-lantern" />
          Synthesize New Trial Examination
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] text-sage mb-1">Source Type</label>
            <select
              value={selectedSourceType}
              onChange={(e) => {
                setSelectedSourceType(e.target.value as any);
                if (e.target.value === 'material' && materials[0]) setSelectedSourceId(materials[0].id);
                if (e.target.value === 'course' && courses[0]) setSelectedSourceId(courses[0].id);
              }}
              className="w-full bg-forest-900 border border-forest-600/50 rounded-xl px-3 py-2 text-xs text-parchment focus:outline-none focus:ring-1 focus:ring-lantern"
            >
              <option value="material">Study Scroll</option>
              <option value="course">Learning Path Course</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-sage mb-1">Select Archive</label>
            <select
              value={selectedSourceId}
              onChange={(e) => setSelectedSourceId(e.target.value)}
              className="w-full bg-forest-900 border border-forest-600/50 rounded-xl px-3 py-2 text-xs text-parchment focus:outline-none focus:ring-1 focus:ring-lantern truncate"
            >
              {selectedSourceType === 'material'
                ? materials.map(m => <option key={m.id} value={m.id}>Scroll: {m.title}</option>)
                : courses.map(c => <option key={c.id} value={c.id}>Course: {c.title}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-sage mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full bg-forest-900 border border-forest-600/50 rounded-xl px-3 py-2 text-xs text-parchment focus:outline-none focus:ring-1 focus:ring-lantern capitalize"
            >
              <option value="beginner">Beginner</option>
              <option value="medium">Medium</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-sage mb-1">Question Count</label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
              className="w-full bg-forest-900 border border-forest-600/50 rounded-xl px-3 py-2 text-xs text-parchment focus:outline-none focus:ring-1 focus:ring-lantern"
            >
              <option value="3">3 Questions (Quick Sprint)</option>
              <option value="5">5 Questions (Standard Trial)</option>
              <option value="10">10 Questions (Mastery Exam)</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleGenerateQuiz}
              isLoading={generating}
              disabled={!selectedSourceId}
              variant="primary"
              size="sm"
              className="w-full gap-2 shadow-lantern"
            >
              <Swords className="w-4 h-4" />
              <span>Forge Trial</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Available Quizzes Grid */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl font-bold text-parchment">
          Available Quizzes ({quizzes.length})
        </h2>

        {loading ? (
          <div className="p-8 text-center text-xs text-sage animate-pulse">
            Inspecting the trial grounds...
          </div>
        ) : quizzes.length === 0 ? (
          <div className="p-8 text-center woodland-panel rounded-2xl border-dashed">
            <p className="text-xs text-sage italic">
              No trial quizzes forged yet. Use the synthesizer above to create one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((q) => (
              <div
                key={q.id}
                className="woodland-panel p-5 rounded-2xl hover-shimmer flex flex-col justify-between border border-forest-600/40 relative"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="amber" className="capitalize text-[11px]">
                      {q.difficulty}
                    </Badge>
                    <span className="text-xs text-sage font-mono">
                      {q.total_questions} Questions
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-parchment line-clamp-1">
                    {q.title}
                  </h3>
                  {q.description && (
                    <p className="text-xs text-sage line-clamp-2 leading-relaxed">
                      {q.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-forest-700/30 flex items-center justify-between mt-3">
                  <div className="text-xs text-sage">
                    {q.best_score !== undefined ? (
                      <span>Best Score: <strong className="text-lantern">{q.best_score}%</strong> ({q.attempts_count} attempts)</span>
                    ) : (
                      <span className="italic">Untested</span>
                    )}
                  </div>

                  <Link href={`/trials/${q.id}`}>
                    <Button variant="primary" size="sm" className="gap-1.5 shadow-lantern">
                      <span>Begin Trial</span>
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Trial Attempts History */}
      {attempts.length > 0 && (
        <div className="space-y-4 pt-4">
          <h2 className="font-serif text-xl font-bold text-parchment flex items-center gap-2">
            <History className="w-5 h-5 text-lantern" />
            <span>Past Trial Attempts</span>
          </h2>

          <div className="woodland-panel rounded-2xl overflow-hidden divide-y divide-forest-700/30">
            {attempts.slice(0, 5).map((att) => (
              <div key={att.id} className="p-4 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-semibold text-parchment block">
                    Score: {att.score} / {att.max_score} ({att.percentage}%)
                  </span>
                  <span className="text-sage text-[11px]">
                    Completed {new Date(att.completed_at).toLocaleDateString()} at {new Date(att.completed_at).toLocaleTimeString()}
                  </span>
                </div>

                <Badge variant={att.percentage >= 70 ? 'success' : 'warning'}>
                  {att.percentage >= 70 ? 'Passed' : 'Needs Review'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrialsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-sage">Entering Trial Grounds...</div>}>
      <TrialsContent />
    </Suspense>
  );
}
