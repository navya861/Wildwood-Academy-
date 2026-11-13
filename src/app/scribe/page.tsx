'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Feather, Plus, Sparkles, Save, Trash2, BookOpen, Search, Copy, Check, FileText, Layers, Edit3, Eye } from 'lucide-react';
import { Note, NoteFormat, StudyMaterial, Course } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Card';
import { FlashcardDeck } from '@/components/scribe/FlashcardDeck';

function FormattedNoteReader({ text }: { text: string }) {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-forest-900/50 rounded-2xl border border-forest-700/40 text-parchment space-y-4 max-h-[500px]">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-2" />;

        // H1 Heading
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={idx} className="text-xl sm:text-2xl font-serif font-black text-amber-300 pt-2 pb-1 border-b border-forest-700/50">
              {trimmed.replace('# ', '')}
            </h1>
          );
        }

        // H2 Heading
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-lg sm:text-xl font-serif font-bold text-parchment pt-3 pb-1 border-b border-forest-700/30">
              {trimmed.replace('## ', '')}
            </h2>
          );
        }

        // H3 Heading
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-sm sm:text-base font-serif font-bold text-amber-200/90 pt-2">
              {trimmed.replace('### ', '')}
            </h3>
          );
        }

        // Blockquote
        if (trimmed.startsWith('> ')) {
          return (
            <div key={idx} className="p-3 rounded-xl bg-forest-800/70 border-l-4 border-amber-400 text-xs text-sage italic">
              {trimmed.replace('> ', '')}
            </div>
          );
        }

        // Horizontal rule
        if (trimmed === '---' || trimmed === '***') {
          return <hr key={idx} className="border-forest-700/50 my-3" />;
        }

        // Bullet point
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const bulletContent = trimmed.replace(/^[-*]\s+/, '');
          return (
            <div key={idx} className="flex items-start gap-2 text-xs md:text-sm pl-2 leading-relaxed">
              <span className="text-amber-400 font-bold">•</span>
              <span
                dangerouslySetInnerHTML={{
                  __html: bulletContent
                    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-amber-200 font-semibold">$1</strong>')
                    .replace(/`([^`]+)`/g, '<code class="bg-forest-950 px-1.5 py-0.5 rounded text-amber-300 font-mono text-[11px]">$1</code>'),
                }}
              />
            </div>
          );
        }

        // Standard Paragraph
        return (
          <p
            key={idx}
            className="text-xs md:text-sm leading-relaxed text-parchment/90"
            dangerouslySetInnerHTML={{
              __html: trimmed
                .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-amber-200 font-semibold">$1</strong>')
                .replace(/`([^`]+)`/g, '<code class="bg-forest-950 px-1.5 py-0.5 rounded text-amber-300 font-mono text-[11px]">$1</code>'),
            }}
          />
        );
      })}
    </div>
  );
}

function ScribeContent() {
  const searchParams = useSearchParams();
  const filterLessonId = searchParams.get('lesson_id') || undefined;
  const filterCourseId = searchParams.get('course_id') || undefined;

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'reading' | 'edit'>('cards');
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

  const handleSelectNote = (n: Note) => {
    setSelectedNote(n);
    const content = n.user_edited_content || n.content;
    const isCards = n.note_format === 'flashcards' || /###\s+Card|\*\*Front:\*\*|Q:/i.test(content);
    setViewMode(isCards ? 'cards' : 'reading');
  };

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
          const first = nData.notes[0];
          setSelectedNote(first);
          const content = first.user_edited_content || first.content;
          const isCards = first.note_format === 'flashcards' || /###\s+Card|\*\*Front:\*\*|Q:/i.test(content);
          setViewMode(isCards ? 'cards' : 'reading');
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

  const handleAppendCard = (cardMarkdown: string) => {
    if (!selectedNote) return;
    const current = selectedNote.user_edited_content || selectedNote.content;
    const updated = current + cardMarkdown;
    const updatedNote = { ...selectedNote, user_edited_content: updated };
    setSelectedNote(updatedNote);
    setNotes(prev => prev.map(n => (n.id === selectedNote.id ? updatedNote : n)));
    fetch(`/api/notes/${selectedNote.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: selectedNote.title,
        user_edited_content: updated,
      }),
    }).catch(console.error);
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
        setViewMode(data.note.note_format === 'flashcards' ? 'cards' : 'reading');
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
        setViewMode('edit');
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
      const next = remaining[0] || null;
      setSelectedNote(next);
      if (next) {
        const isCards = next.note_format === 'flashcards' || /###\s+Card|\*\*Front:\*\*|Q:/i.test(next.user_edited_content || next.content);
        setViewMode(isCards ? 'cards' : 'reading');
      }
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
            Study with interactive flippable flashcards or examine structured exam preparation manuals.
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
          Synthesize AI Study Notes or Flashcards from Presentation Scrolls
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
              <option value="flashcards">🎴 Flashcard Q&amp;A Pairs (Interactive Deck)</option>
              <option value="detailed">📜 Detailed Explanatory Exam Notes</option>
              <option value="concise">📝 Concise Revision Bullets</option>
              <option value="beginner">☕ Beginner-Friendly Analogy</option>
              <option value="exam">⚡ Exam Cram Sheet</option>
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
              <span>Synthesize Scroll</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Two Column Workspace: Notes Sidebar + Active Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[660px]">
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
                const isFlashcards = n.note_format === 'flashcards';
                return (
                  <button
                    key={n.id}
                    onClick={() => handleSelectNote(n)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-lantern bg-forest-700/80 text-parchment shadow-sm'
                        : 'border-forest-600/30 bg-forest-800/40 hover:bg-forest-800/80 text-sage-light'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-serif font-semibold text-xs truncate flex items-center gap-1.5">
                        {isFlashcards ? (
                          <Sparkles className="w-3.5 h-3.5 text-lantern flex-shrink-0" />
                        ) : (
                          <Feather className="w-3.5 h-3.5 text-sage flex-shrink-0" />
                        )}
                        {n.title}
                      </span>
                      <Badge
                        variant={isFlashcards ? 'amber' : 'sage'}
                        className="text-[10px] uppercase font-mono px-1.5 py-0"
                      >
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

        {/* Right Column: Note View (Flashcards / Reading / Edit) */}
        <div className="lg:col-span-2 woodland-panel rounded-2xl p-5 flex flex-col justify-between border border-forest-600/40 overflow-hidden min-h-[580px]">
          {selectedNote ? (
            <div className="flex-1 flex flex-col gap-3 overflow-hidden">
              {/* Note Header Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-forest-700/40">
                <input
                  type="text"
                  value={selectedNote.title}
                  onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
                  className="bg-transparent font-serif text-lg md:text-xl font-bold text-parchment focus:outline-none focus:border-b focus:border-lantern flex-1 min-w-[200px]"
                />

                {/* Mode Selector & Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  {/* View Mode Toggle: Deck / Reading / Edit */}
                  <div className="flex items-center bg-forest-950/80 border border-forest-700/60 rounded-xl p-0.5">
                    <button
                      type="button"
                      onClick={() => setViewMode('cards')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-serif flex items-center gap-1.5 transition-all ${
                        viewMode === 'cards'
                          ? 'bg-forest-700 text-parchment shadow-sm border border-lantern/40 font-semibold'
                          : 'text-sage hover:text-parchment'
                      }`}
                      title="Interactive Flashcard Deck"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-lantern" />
                      <span>Deck</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('reading')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-serif flex items-center gap-1.5 transition-all ${
                        viewMode === 'reading'
                          ? 'bg-forest-700 text-parchment shadow-sm border border-lantern/40 font-semibold'
                          : 'text-sage hover:text-parchment'
                      }`}
                      title="Formatted Exam Study Guide"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Study View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('edit')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-serif flex items-center gap-1.5 transition-all ${
                        viewMode === 'edit'
                          ? 'bg-forest-700 text-parchment shadow-sm border border-lantern/40 font-semibold'
                          : 'text-sage hover:text-parchment'
                      }`}
                      title="Edit Raw Markdown"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <Button
                    onClick={handleCopy}
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-xs"
                    title="Copy note text"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-moss-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                  </Button>

                  <Button
                    onClick={handleSaveNote}
                    isLoading={saving}
                    variant="primary"
                    size="sm"
                    className="gap-1.5 shadow-lantern text-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </Button>

                  <button
                    onClick={() => handleDeleteNote(selectedNote.id)}
                    className="p-1.5 rounded-lg text-sage hover:text-red-300 hover:bg-red-950/40 transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Note Body: Interactive Flashcard Deck, Formatted Reader, or Markdown Editor */}
              {viewMode === 'cards' ? (
                <FlashcardDeck
                  content={selectedNote.user_edited_content || selectedNote.content}
                  noteTitle={selectedNote.title}
                  onEditMarkdown={() => setViewMode('edit')}
                  onAppendCard={handleAppendCard}
                />
              ) : viewMode === 'reading' ? (
                <FormattedNoteReader text={selectedNote.user_edited_content || selectedNote.content} />
              ) : (
                <div className="flex-1 flex flex-col">
                  <textarea
                    value={selectedNote.user_edited_content || selectedNote.content}
                    onChange={(e) => setSelectedNote({ ...selectedNote, user_edited_content: e.target.value })}
                    className="flex-1 w-full bg-forest-900/60 border border-forest-700/40 rounded-xl p-4 text-xs md:text-sm text-parchment font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-lantern resize-none min-h-[360px]"
                    placeholder="Penn your thoughts in Markdown (use ### Card 1, **Front:**, **Back:** for flashcards)..."
                  />
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-sage pt-2 border-t border-forest-700/30">
                <span>
                  Format: {selectedNote.note_format.toUpperCase()} · Mode: {viewMode === 'cards' ? 'Interactive Deck' : viewMode === 'reading' ? 'Study View' : 'Markdown Editor'}
                </span>
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
