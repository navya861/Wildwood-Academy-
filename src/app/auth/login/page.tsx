'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Compass, AlertCircle, ArrowRight, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="woodland-panel rounded-3xl p-8 border border-forest-600/50 shadow-forest space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-forest-800 border border-lantern/40 flex items-center justify-center text-lantern mx-auto shadow-lantern">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-parchment">
            Enter the Academy
          </h2>
          <p className="text-xs text-sage">
            Sign in to access your private study archives and courses.
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
              Passphrase
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-sage/60 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-forest-800 border border-forest-600/60 rounded-xl py-2.5 pl-10 pr-4 text-xs md:text-sm text-parchment placeholder-sage/40 focus:outline-none focus:ring-2 focus:ring-lantern"
              />
            </div>
          </div>

          <Button
            type="submit"
            isLoading={loading}
            variant="primary"
            size="md"
            className="w-full gap-2 shadow-lantern mt-2"
          >
            <span>Open Scholar Journal</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="pt-4 border-t border-forest-700/40 text-center text-xs text-sage">
          Not yet enrolled in the Academy?{' '}
          <Link href="/auth/signup" className="text-lantern hover:underline font-semibold">
            Register as an Apprentice
          </Link>
        </div>
      </div>
    </div>
  );
}
