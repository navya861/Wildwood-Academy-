'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Feather, Plus, Sparkles, Save, Trash2, BookOpen, Search, Copy, Check } from 'lucide-react';
import { Note, NoteFormat, StudyMaterial, Course } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Card';

function ScribeContent() {
  const searchParams = useSearchParams();
  const filterLessonId = searchParams.get('lesson_id') || undefined;
  const filterCourseId = searchParams.get('course_id') || undefined;

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // New Note / Generator State
  const [genFormat, setGenFormat] = useState<NoteFormat>('detailed');
  const [genSourceType, setGenSourceType] = useState<'material' | 'course'>('material');
  const [genSourceId, setGenSourceId] = useState<string>('');

  const loadNotesAndSources = async () => {
    try {
      const [nRes, mRes, cRes] = await Promise.all([
        fetch(`/api/notes${filterLessonId ? `?lesson_id=${filterLessonId}` : ''}`),
        fetch('/api/materials'),
        fetch('/api/courses'),
      ]);

      const nData = await nRes.json();
      const mData = await mRes.json();
      const cData = await cRes.json();

      if (nData.notes) {
        setNotes(nData.notes);
        if (nData.notes.length > 0 && !selectedNote) {
          setSelectedNote(nData.notes[0]);
        }
      }
      if (mData.materials) {
        setMaterials(mData.materials.filter((m: any) => m.processing_status === 'completed'));
        if (mData.materials[0]) setGenSourceId(mData.materials[0].id);
      }
      if (cData.courses) setCourses(cData.courses);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotesAndSources();
  }, [filterLessonId, filterCourseId]);

  const handleSaveNote = async () => {
    if (!selectedNote) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/notes/${selectedNote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedNote.title,
          user_edited_content: selectedNote.user_edited_content,
        }),
      });
      const data = await res.json();
      if (data.note) {
        setNotes(prev => prev.map(n => n.id === data.note.id ? data.note : n));
        setSelectedNote(data.note);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateNotes = async () => {
    if (!genSourceId) return;
    setGenerating(true);
    try {
      const payload: any = { note_format: genFormat };
      if (genSourceType === 'material') {
        payload.material_id = genSourceId;
      } else {
        payload.course_id = genSourceId;
      }

      const res = await fetch('/api/notes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.note) {
        setNotes(prev => [data.note, ...prev]);
        setSelectedNote(data.note);
      } else {
        alert(data.error || 'Failed to generate note');
      }
    } catch (e: any) {
      alert(e.message || 'Generation error');
    } finally {
      setGenerating(false);
    }
  };

  const handleCreateEmptyNote = async () => {
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Untitled Scholar Note',
          content: 'Penn your insights here...',
          note_format: 'detailed',
        }),
      });
      const data = await res.json();
      if (data.note) {
        setNotes(prev => [data.note, ...prev]);
        setSelectedNote(data.note);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm('Discard this scroll of notes?')) return;
    try {
      await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      const remaining = notes.filter(n => n.id !== id);
      setNotes(remaining);
      setSelectedNote(remaining[0] || null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopy = () => {
    if (!selectedNote) return;
    navigator.clipboard.writeText(selectedNote.user_edited_content || selectedNote.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (n.user_edited_content || n.content).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="amber" className="gap-1 text-xs">
              <Feather className="w-3.5 h-3.5" />
              Scribe&apos;s Corner
            </Badge>
          </div>
          <h1 className="text-3xl font-serif font-bold text-parchment">
            Scholar&apos;s Notes &amp; Flashcards
          </h1>
          <p className="text-xs md:text-sm text-sage mt-1">
            Generate customized study guides or penn your own thoughts. Personal edits are always preserved.
          </p>
        </div>

        <Button onClick={handleCreateEmptyNote} variant="secondary" size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" />
          <span>New Blank Note</span>
        </Button>
      </div>

      {/* Generator Tool Palette */}
      <div className="p-5 rounded-2xl bg-forest-800/60 border border-forest-600/40 space-y-4">
        <h3 className="font-serif text-sm font-semibold text-lantern flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-lantern" />
          Synthesize AI Study Notes from Lore
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Note Format */}
          <div>
            <label className="block text-[11px] text-sage mb-1">Format</label>
            <select
              value={genFormat}
              onChange={(e) => setGenFormat(e.target.value as NoteFormat)}
              className="w-full bg-forest-900 border border-forest-600/50 rounded-xl px-3 py-2 text-xs text-parchment focus:outline-none focus:ring-1 focus:ring-lantern"
            >
              <option value="detailed">Detailed Explanatory</option>
              <option value="concise">Concise Revision Bullets</option>
              <option value="beginner">Beginner-Friendly Analogy</option>
              <option value="exam">Exam Cram Sheet</option>
              <option value="flashcards">Flashcard Q&amp;A Pairs</option>
            </select>
          </div>

          {/* Source Selection */}
          <div>
            <label className="block text-[11px] text-sage mb-1">Source Material</label>
            <select
              value={genSourceId}
              onChange={(e) => setGenSourceId(e.target.value)}
              className="w-full bg-forest-900 border border-forest-600/50 rounded-xl px-3 py-2 text-xs text-parchment focus:outline-none focus:ring-1 focus:ring-lantern truncate"
            >
              {materials.map(m => (
                <option key={m.id} value={m.id}>Scroll: {m.title}</option>
              ))}
            </select>
          </div>

          {/* Action */}
          <div className="flex items-end">
            <Button
              onClick={handleGenerateNotes}
              isLoading={generating}
              disabled={!genSourceId}
              variant="primary"
              size="sm"
              className="w-full gap-2 shadow-lantern"
            >
              <Sparkles className="w-4 h-4" />
              <span>Synthesize Notes</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Two Column Workspace: Notes Sidebar + Active Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[640px]">
        {/* Left Column: Notes List */}
        <div className="woodland-panel rounded-2xl p-4 flex flex-col gap-3 overflow-hidden border border-forest-600/40">
          <div className="relative">
            <Search className="w-4 h-4 text-sage/50 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter notes..."
              className="w-full bg-forest-800 border border-forest-600/50 rounded-xl pl-9 pr-3 py-2 text-xs text-parchment placeholder-sage/40 focus:outline-none focus:ring-1 focus:ring-lantern"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredNotes.length === 0 ? (
              <p className="text-xs text-sage italic text-center py-8">No notes found.</p>
            ) : (
              filteredNotes.map((n) => {
                const isSelected = selectedNote?.id === n.id;
                return (
                  <button
                    key={n.id}
                    onClick={() => setSelectedNote(n)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-lantern bg-forest-700/80 text-parchment shadow-sm'
                        : 'border-forest-600/30 bg-forest-800/40 hover:bg-forest-800/80 text-sage-light'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-serif font-semibold text-xs truncate">{n.title}</span>
                      <Badge variant="sage" className="text-[10px] uppercase font-mono px-1.5 py-0">
                        {n.note_format}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-sage/70 line-clamp-2 mt-1 font-sans">
                      {n.user_edited_content || n.content}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Note Editor & Parchment View */}
        <div className="lg:col-span-2 woodland-panel rounded-2xl p-6 flex flex-col justify-between border border-forest-600/40 overflow-hidden">
          {selectedNote ? (
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              {/* Note Header Controls */}
              <div className="flex items-center justify-between gap-4 pb-3 border-b border-forest-700/40">
                <input
                  type="text"
                  value={selectedNote.title}
                  onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
                  className="bg-transparent font-serif text-xl font-bold text-parchment focus:outline-none focus:border-b focus:border-lantern flex-1"
                />

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleCopy}
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-xs"
                    title="Copy note text"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-moss-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </Button>

                  <Button
                    onClick={handleSaveNote}
                    isLoading={saving}
                    variant="primary"
                    size="sm"
                    className="gap-1.5 shadow-lantern"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </Button>

                  <button
                    onClick={() => handleDeleteNote(selectedNote.id)}
                    className="p-2 rounded-lg text-sage hover:text-red-300 hover:bg-red-950/40 transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Note Editor Area */}
              <div className="flex-1 flex flex-col">
                <textarea
                  value={selectedNote.user_edited_content || selectedNote.content}
                  onChange={(e) => setSelectedNote({ ...selectedNote, user_edited_content: e.target.value })}
                  className="flex-1 w-full bg-forest-900/60 border border-forest-700/40 rounded-xl p-4 text-xs md:text-sm text-parchment font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-lantern resize-none"
                  placeholder="Penn your thoughts in Markdown..."
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-sage pt-2">
                <span>Format: {selectedNote.note_format.toUpperCase()} · Preserves student revisions</span>
                <span>Last updated: {new Date(selectedNote.updated_at).toLocaleTimeString()}</span>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-sage">
              <Feather className="w-12 h-12 text-sage/40 mb-3" />
              <h3 className="font-serif text-lg font-bold text-parchment">No Note Selected</h3>
              <p className="text-xs text-sage mt-1">Select a note from the left scroll or synthesize a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ScribePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-sage">Entering the Scribe&apos;s Corner...</div>}>
      <ScribeContent />
    </Suspense>
  );
}
