'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, User, Bot, Database, HardDrive, ShieldAlert, CheckCircle2, AlertTriangle, Save, Trash2, RefreshCw } from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card, Badge } from '@/components/ui/Card';

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Form fields
  const [displayName, setDisplayName] = useState('');
  const [learningStyle, setLearningStyle] = useState<'socratic' | 'structured' | 'visual' | 'concise'>('socratic');
  const [learningTone, setLearningTone] = useState<'scholarly_whimsical' | 'academic' | 'friendly'>('scholarly_whimsical');

  const loadData = async () => {
    try {
      const [pRes, dRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/status/diagnostics'),
      ]);

      const pData = await pRes.json();
      const dData = await dRes.json();

      if (pData.user) {
        setProfile(pData.user);
        setDisplayName(pData.user.display_name || '');
        if (pData.user.learning_preferences) {
          setLearningStyle(pData.user.learning_preferences.style || 'socratic');
          setLearningTone(pData.user.learning_preferences.tone || 'scholarly_whimsical');
        }
      }
      setDiagnostics(dData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: displayName,
          learning_preferences: {
            style: learningStyle,
            tone: learningTone,
            pace: 'moderate',
          },
        }),
      });

      const data = await res.json();
      if (data.profile) {
        setProfile(data.profile);
        alert('Scholar settings updated successfully!');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    try {
      await fetch('/api/auth/delete-account', { method: 'POST' });
      router.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-sage animate-pulse">
        Loading academy settings and diagnostics...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="amber" className="gap-1 text-xs">
            <Settings className="w-3.5 h-3.5" />
            Academy Settings
          </Badge>
        </div>
        <h1 className="text-3xl font-serif font-bold text-parchment">
          Scholar Profile &amp; Backend Lore
        </h1>
        <p className="text-xs md:text-sm text-sage mt-1">
          Customize your learning preferences, verify backend service health, and manage your account.
        </p>
      </div>

      {/* Backend & AI Diagnostics Panel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-parchment flex items-center gap-2">
            <Database className="w-5 h-5 text-lantern" />
            <span>Infrastructure Diagnostics</span>
          </h2>
          <Button onClick={loadData} variant="ghost" size="sm" className="gap-1 text-xs">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Diagnostics</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Database Diagnostic */}
          <div className="woodland-panel p-5 rounded-2xl border border-forest-600/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-parchment">PostgreSQL / Supabase</span>
              <Badge variant={diagnostics?.database?.healthy ? 'success' : 'danger'}>
                {diagnostics?.database?.mode}
              </Badge>
            </div>
            <p className="text-xs text-sage leading-relaxed">
              {diagnostics?.database?.details}
            </p>
          </div>

          {/* Storage Diagnostic */}
          <div className="woodland-panel p-5 rounded-2xl border border-forest-600/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-parchment">Study Storage</span>
              <Badge variant={diagnostics?.storage?.healthy ? 'success' : 'danger'}>
                {diagnostics?.storage?.mode}
              </Badge>
            </div>
            <p className="text-xs text-sage leading-relaxed font-mono">
              {diagnostics?.storage?.storagePath}
            </p>
          </div>

          {/* AI Provider Diagnostic */}
          <div className="woodland-panel p-5 rounded-2xl border border-forest-600/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-parchment">AI Synthesis Model</span>
              <Badge variant={diagnostics?.ai?.isConfigured ? 'success' : 'amber'}>
                {diagnostics?.ai?.activeProvider}
              </Badge>
            </div>
            <p className="text-xs text-sage leading-relaxed">
              {diagnostics?.ai?.setupInstruction}
            </p>
          </div>
        </div>
      </div>

      {/* Profile & Preferences Form */}
      <form onSubmit={handleUpdateProfile} className="woodland-panel p-6 rounded-2xl border border-forest-600/40 space-y-6">
        <h2 className="font-serif text-xl font-bold text-parchment flex items-center gap-2">
          <User className="w-5 h-5 text-lantern" />
          <span>Scholar Profile &amp; Preferences</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-sage mb-1.5">
              Scholar Name / Title
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-forest-800 border border-forest-600/50 rounded-xl px-4 py-2 text-xs md:text-sm text-parchment focus:outline-none focus:ring-1 focus:ring-lantern"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-sage mb-1.5">
              Registered Scholar Email
            </label>
            <input
              type="text"
              disabled
              value={profile?.email || ''}
              className="w-full bg-forest-900/60 border border-forest-700/40 rounded-xl px-4 py-2 text-xs md:text-sm text-sage/70 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-sage mb-1.5">
              AI Tutor Pedagogy Style
            </label>
            <select
              value={learningStyle}
              onChange={(e) => setLearningStyle(e.target.value as any)}
              className="w-full bg-forest-800 border border-forest-600/50 rounded-xl px-4 py-2 text-xs md:text-sm text-parchment focus:outline-none focus:ring-1 focus:ring-lantern"
            >
              <option value="socratic">Socratic (Questions &amp; Hints First)</option>
              <option value="structured">Structured (Step-by-Step Logic)</option>
              <option value="concise">Concise (High-Yield Bullets)</option>
              <option value="visual">Visual &amp; Analogy Driven</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-sage mb-1.5">
              Forest Guide Persona Tone
            </label>
            <select
              value={learningTone}
              onChange={(e) => setLearningTone(e.target.value as any)}
              className="w-full bg-forest-800 border border-forest-600/50 rounded-xl px-4 py-2 text-xs md:text-sm text-parchment focus:outline-none focus:ring-1 focus:ring-lantern"
            >
              <option value="scholarly_whimsical">Scholarly &amp; Enchanted</option>
              <option value="academic">Formal Academic Rigor</option>
              <option value="friendly">Warm &amp; Encouraging Companion</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" isLoading={saving} variant="primary" size="md" className="gap-2 shadow-lantern">
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </Button>
        </div>
      </form>

      {/* Danger Zone: Account Deletion */}
      <div className="p-6 rounded-2xl bg-red-950/20 border border-red-900/40 space-y-4">
        <h3 className="font-serif text-lg font-bold text-red-300 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-400" />
          <span>Banish Scholar Account &amp; Archives</span>
        </h3>
        <p className="text-xs text-red-200/80 leading-relaxed">
          Permanently removes your scholar profile, all uploaded study scrolls, document chunks, course outlines, notes, quiz attempts, and game sessions. This operation cannot be reversed.
        </p>

        <div className="pt-2">
          <Button
            onClick={handleDeleteAccount}
            variant="danger"
            size="sm"
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>{deleteConfirm ? 'Confirm Permanent Account Deletion' : 'Delete Scholar Account'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
