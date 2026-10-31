'use client';

import React, { useEffect, useState } from 'react';
import { Library, Download, Trash2, BookOpenCheck, Sparkles, FileText, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { FileUploadZone } from '@/components/library/FileUploadZone';
import { StudyMaterial } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';

export default function WoodlandLibraryPage() {
  const router = useRouter();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  const loadMaterials = async () => {
    try {
      const res = await fetch('/api/materials');
      const data = await res.json();
      if (data.materials) {
        setMaterials(data.materials);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleUploadSuccess = (newMaterial: StudyMaterial) => {
    setMaterials(prev => [newMaterial, ...prev]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you wish to banish this study material from the archives?')) return;
    try {
      await fetch(`/api/materials/${id}`, { method: 'DELETE' });
      setMaterials(prev => prev.filter(m => m.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerateCourse = async (materialId: string) => {
    setGeneratingId(materialId);
    try {
      const res = await fetch('/api/courses/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ material_id: materialId }),
      });

      const data = await res.json();
      if (res.ok && data.course) {
        router.push(`/learning/${data.course.id}`);
      } else {
        alert(data.error || 'Failed to generate course');
      }
    } catch (e: any) {
      alert(e.message || 'Generation error');
    } finally {
      setGeneratingId(null);
    }
  };

  const filteredMaterials = materials.filter(m =>
    m.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    m.original_filename.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="amber" className="gap-1 text-xs">
            <Library className="w-3.5 h-3.5" />
            Study Archives
          </Badge>
        </div>
        <h1 className="text-3xl font-serif font-bold text-parchment">
          The Woodland Library
        </h1>
        <p className="text-xs md:text-sm text-sage mt-1">
          Enshrine documents, lecture slides, books, and scanned handwritten notes into private storage.
        </p>
      </div>

      {/* Upload Zone */}
      <FileUploadZone onUploadSuccess={handleUploadSuccess} />

      {/* Materials List & Filter */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="font-serif text-xl font-bold text-parchment flex items-center gap-2">
            <span>Enshrined Study Scrolls</span>
            <span className="text-xs font-mono font-normal text-sage">({materials.length})</span>
          </h2>

          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search scrolls by title or filename..."
            className="bg-forest-800 border border-forest-600/50 rounded-xl px-4 py-2 text-xs text-parchment placeholder-sage/40 focus:outline-none focus:ring-1 focus:ring-lantern w-full sm:w-64"
          />
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-sage animate-pulse">
            Inspecting library archives...
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="p-8 text-center woodland-panel rounded-2xl border-dashed">
            <p className="text-xs text-sage italic">
              {filterQuery ? 'No scrolls match your search.' : 'Your library is currently empty. Upload your first document above!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredMaterials.map((mat) => (
              <div
                key={mat.id}
                className="woodland-panel p-5 rounded-2xl hover-shimmer flex flex-col md:flex-row md:items-center justify-between gap-4 border border-forest-600/40"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-forest-800 border border-lantern/30 flex items-center justify-center text-lantern shrink-0 shadow-sm mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <h3 className="font-semibold text-sm md:text-base text-parchment truncate">
                      {mat.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-sage font-mono">
                      <span>{mat.original_filename}</span>
                      <span>·</span>
                      <span>{(mat.file_size / 1024).toFixed(0)} KB</span>
                      <span>·</span>
                      <span>{mat.metadata?.page_count || 1} pages</span>
                      <span>·</span>
                      <span>{mat.metadata?.chunk_count || 1} chunks</span>
                      {mat.metadata?.ocr_applied && (
                        <span className="text-lantern font-semibold">(OCR Applied)</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                  <Badge
                    variant={
                      mat.processing_status === 'completed'
                        ? 'success'
                        : mat.processing_status === 'failed'
                        ? 'danger'
                        : 'warning'
                    }
                  >
                    {mat.processing_status}
                  </Badge>

                  {/* Generate Course Button */}
                  {mat.processing_status === 'completed' && (
                    <Button
                      onClick={() => handleGenerateCourse(mat.id)}
                      isLoading={generatingId === mat.id}
                      variant="primary"
                      size="sm"
                      className="gap-1.5"
                    >
                      <BookOpenCheck className="w-4 h-4" />
                      <span>Synthesize Course</span>
                    </Button>
                  )}

                  {/* Download Original File */}
                  <a
                    href={`/api/materials/${mat.id}/file`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-forest-800 hover:bg-forest-700 text-sage hover:text-parchment border border-forest-600/40 transition-colors"
                    title="Download Original File"
                  >
                    <Download className="w-4 h-4" />
                  </a>

                  {/* Delete Material */}
                  <button
                    onClick={() => handleDelete(mat.id)}
                    className="p-2 rounded-lg bg-forest-800 hover:bg-red-950/60 text-sage hover:text-red-300 border border-forest-600/40 hover:border-red-800 transition-colors"
                    title="Delete Material"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
