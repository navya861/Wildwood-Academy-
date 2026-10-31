'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Compass, AlertCircle, ArrowRight, Lock, Mail, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [learningStyle, setLearningStyle] = useState<'socratic' | 'structured' | 'visual' | 'concise'>('socratic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          display_name: displayName,
          learning_preferences: {
            style: learningStyle,
            pace: 'moderate',
            tone: 'scholarly_whimsical',
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register account');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <div className="woodland-panel rounded-3xl p-8 border border-forest-600/50 shadow-forest space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-forest-800 border border-lantern/40 flex items-center justify-center text-lantern mx-auto shadow-lantern">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-parchment">
            Enroll in Wildwood Academy
          </h2>
          <p className="text-xs text-sage">
            Receive your scholar journal and enshrine your first study materials.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 flex items-center gap-2 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-sage mb-1.5">
              Scholar Name / Title
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-sage/60 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Alistair the Apprentice"
                className="w-full bg-forest-800 border border-forest-600/60 rounded-xl py-2.5 pl-10 pr-4 text-xs md:text-sm text-parchment placeholder-sage/40 focus:outline-none focus:ring-2 focus:ring-lantern"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-sage mb-1.5">
              Scholar Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-sage/60 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="apprentice@wildwood.edu"
                className="w-full bg-forest-800 border border-forest-600/60 rounded-xl py-2.5 pl-10 pr-4 text-xs md:text-sm text-parchment placeholder-sage/40 focus:outline-none focus:ring-2 focus:ring-lantern"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-sage mb-1.5">
              Passphrase (6+ characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-sage/60 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-forest-800 border border-forest-600/60 rounded-xl py-2.5 pl-10 pr-4 text-xs md:text-sm text-parchment placeholder-sage/40 focus:outline-none focus:ring-2 focus:ring-lantern"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-sage mb-1.5">
              Preferred Learning Style
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { key: 'socratic', label: 'Socratic Dialogue', desc: 'Questions & hints' },
                { key: 'structured', label: 'Structured Lessons', desc: 'Step-by-step logic' },
                { key: 'concise', label: 'Concise Bullet Points', desc: 'High-yield facts' },
                { key: 'visual', label: 'Analogies & Metaphor', desc: 'Storybook examples' },
              ].map((style) => (
                <button
                  key={style.key}
                  type="button"
                  onClick={() => setLearningStyle(style.key as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    learningStyle === style.key
                      ? 'border-lantern bg-lantern/15 text-parchment font-semibold shadow-sm'
                      : 'border-forest-600/40 bg-forest-800/40 text-sage hover:bg-forest-700/40'
                  }`}
                >
                  <span className="block text-xs font-bold text-lantern mb-0.5">{style.label}</span>
                  <span className="text-[11px] text-sage/80">{style.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            isLoading={loading}
            variant="primary"
            size="md"
            className="w-full gap-2 shadow-lantern mt-4"
          >
            <span>Begin Scholar Apprenticeship</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="pt-4 border-t border-forest-700/40 text-center text-xs text-sage">
          Already have a scholar journal?{' '}
          <Link href="/auth/login" className="text-lantern hover:underline font-semibold">
            Sign in to your hall
          </Link>
        </div>
      </div>
    </div>
  );
}
