'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface FileUploadZoneProps {
  onUploadSuccess: (material: any) => void;
}

export function FileUploadZone({ onUploadSuccess }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Validation
    const validExtensions = ['.pdf', '.docx', '.txt', '.md', '.markdown', '.png', '.jpg', '.jpeg', '.webp'];
    const fileNameLower = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileNameLower.endsWith(ext));

    if (!isValid) {
      setErrorMessage(`Unsupported format. Wildwood Academy accepts PDF, DOCX, TXT, Markdown, and PNG/JPEG/WebP images.`);
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('Scroll exceeds maximum allowed size of 25MB.');
      return;
    }

    setErrorMessage(null);
    setIsUploading(true);
    setProgressStatus('Preserving file in secure archives...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name.replace(/\.[^/.]+$/, ''));

      setProgressStatus('Extracting lore, parsing text, and generating chunks...');

      const response = await fetch('/api/materials/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Document processing failed');
      }

      setProgressStatus('Study material enshrined successfully!');
      setTimeout(() => {
        setIsUploading(false);
        setProgressStatus(null);
        onUploadSuccess(data.material);
      }, 800);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to process document');
      setIsUploading(false);
      setProgressStatus(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
          isDragging
            ? 'border-lantern bg-forest-800/80 shadow-lantern'
            : 'border-sage/30 hover:border-lantern/60 bg-forest-900/60 hover:bg-forest-800/40'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFiles(e.target.files)}
          accept=".pdf,.docx,.txt,.md,.markdown,.png,.jpg,.jpeg,.webp"
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-forest-800 border border-lantern/30 flex items-center justify-center text-lantern shadow-lantern">
            {isUploading ? (
              <Loader2 className="w-7 h-7 animate-spin text-lantern" />
            ) : (
              <UploadCloud className="w-7 h-7 text-lantern" />
            )}
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold text-parchment">
              Deposit Study Scrolls in the Library
            </h3>
            <p className="text-sm text-sage mt-1">
              Drag & drop your files here, or <span className="text-lantern underline">browse parchment</span>
            </p>
            <p className="text-xs text-sage/60 mt-2 font-mono">
              Accepts PDF, DOCX, TXT, Markdown, and Scanned Notes (OCR) · Up to 25MB
            </p>
          </div>

          {progressStatus && (
            <div className="flex items-center gap-2 mt-2 px-4 py-2 rounded-xl bg-forest-800/90 border border-lantern/40 text-xs text-lantern animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{progressStatus}</span>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center gap-2 mt-2 px-4 py-2 rounded-xl bg-red-950/60 border border-red-700/50 text-xs text-red-200">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
