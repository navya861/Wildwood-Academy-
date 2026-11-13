'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SlideData } from '@/lib/types';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Download,
  BookOpen,
  Presentation,
  MessageSquare,
  Feather,
  Copy,
  Check,
  Sparkles,
  Layers,
  HelpCircle,
  RotateCw,
  FileText,
  Building2,
  Database,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import Link from 'next/link';

interface SlideDeckViewerProps {
  slides: SlideData[];
  presentation?: {
    material_id: string;
    title: string;
    original_filename: string;
    total_slides: number;
  };
  lessonTitle: string;
}

export function SlideDeckViewer({
  slides,
  presentation,
  lessonTitle,
}: SlideDeckViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [studyMode, setStudyMode] = useState<'stage' | 'flashcard' | 'guide'>('stage');
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalSlides = slides.length;
  const currentSlide = slides[currentIndex] || slides[0];

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
    setIsFlipped(false);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => Math.min(totalSlides - 1, prev + 1));
    setIsFlipped(false);
  }, [totalSlides]);

  // Keyboard navigation (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === ' ' && studyMode === 'flashcard') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, studyMode]);

  const handleCopySlide = () => {
    if (!currentSlide) return;
    const textToCopy = `Slide ${currentSlide.slideNumber}: ${currentSlide.title}\n\n${currentSlide.content.join('\n')}${
      currentSlide.notes ? `\n\nSpeaker Notes: ${currentSlide.notes}` : ''
    }`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  // Detect special slide types for high-fidelity presentation rendering
  const isRoadmapSlide =
    /roadmap|what we will cover|agenda|session outline/i.test(currentSlide.title) ||
    currentSlide.content.some(l => /^\d{2}$/.test(l.trim()));

  const isComparisonSlide =
    /sql vs nosql|comparison|choosing your database|relational vs/i.test(currentSlide.title) ||
    currentSlide.content.some(l => /sql \(relational\)|nosql/i.test(l));

  const isCaseStudySlide =
    /case study|case studies|india context|swiggy|flipkart|phonepe|zerodha/i.test(currentSlide.title);

  // Render roadmap cards when numbered steps are present
  const renderRoadmapCards = () => {
    const lines = currentSlide.content.filter(l => l.trim() !== currentSlide.title.trim());
    const steps: { num: string; title: string; subtitle?: string }[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (/^\d{2}$/.test(line)) {
        const stepNum = line;
        const stepTitle = lines[i + 1]?.trim() || '';
        const stepSub = lines[i + 2]?.trim();
        const hasSub = stepSub && !/^\d{2}$/.test(stepSub);
        steps.push({ num: stepNum, title: stepTitle, subtitle: hasSub ? stepSub : undefined });
        if (hasSub) i += 2;
        else i += 1;
      }
    }

    if (steps.length === 0) return null;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 my-4">
        {steps.map((st, i) => (
          <div
            key={i}
            className="p-3.5 rounded-xl bg-forest-900/80 border border-forest-600/40 hover:border-lantern/50 transition-all flex items-start gap-3"
          >
            <span className="font-mono text-xs font-bold px-2 py-1 rounded-lg bg-lantern/20 text-lantern border border-lantern/30 shrink-0">
              {st.num}
            </span>
            <div>
              <h5 className="font-serif font-semibold text-sm text-parchment leading-tight">
                {st.title}
              </h5>
              {st.subtitle && (
                <p className="text-xs text-sage mt-0.5 leading-snug">
                  {st.subtitle}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render comparison tables when comparison slide is active
  const renderComparisonCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {/* SQL Relational Column */}
        <div className="p-4 rounded-2xl bg-forest-900/90 border border-moss-400/40 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-forest-700/50">
            <span className="font-serif font-bold text-base text-moss-300">
              SQL (Relational)
            </span>
            <Badge variant="sage" className="text-[10px]">
              Fixed Schema
            </Badge>
          </div>
          <ul className="text-xs text-parchment/90 space-y-2 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-lantern mt-0.5 font-bold">•</span>
              <span><strong>Scaling:</strong> Vertical (requires bigger server)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lantern mt-0.5 font-bold">•</span>
              <span><strong>Relationships:</strong> <code className="bg-forest-800 px-1 rounded text-lantern">JOIN</code> queries across tables</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lantern mt-0.5 font-bold">•</span>
              <span><strong>Transactions:</strong> Strict <strong>ACID</strong> compliance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lantern mt-0.5 font-bold">•</span>
              <span><strong>Best For:</strong> Financial transactions, banking, reporting</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lantern mt-0.5 font-bold">•</span>
              <span><strong>Examples:</strong> PostgreSQL, MySQL, CockroachDB</span>
            </li>
          </ul>
        </div>

        {/* NoSQL Non-Relational Column */}
        <div className="p-4 rounded-2xl bg-forest-900/90 border border-lantern/40 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-forest-700/50">
            <span className="font-serif font-bold text-base text-lantern">
              NoSQL (Non-Relational)
            </span>
            <Badge variant="amber" className="text-[10px]">
              Flexible Schema
            </Badge>
          </div>
          <ul className="text-xs text-parchment/90 space-y-2 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-lantern mt-0.5 font-bold">•</span>
              <span><strong>Scaling:</strong> Horizontal (add more commodity servers)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lantern mt-0.5 font-bold">•</span>
              <span><strong>Relationships:</strong> Embedded / denormalized documents</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lantern mt-0.5 font-bold">•</span>
              <span><strong>Transactions:</strong> Eventual consistency (BASE model)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lantern mt-0.5 font-bold">•</span>
              <span><strong>Best For:</strong> Real-time feeds, IoT sensors, high volume</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lantern mt-0.5 font-bold">•</span>
              <span><strong>Examples:</strong> MongoDB, Amazon DynamoDB, Redis</span>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  const progressPercent = Math.round(((currentIndex + 1) / totalSlides) * 100);

  return (
    <div
      className={`space-y-4 ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[#081811]/95 backdrop-blur-xl p-4 md:p-8 overflow-y-auto flex flex-col justify-between'
          : 'relative'
      }`}
    >
      {/* ================= PRESENTATION TOP BAR ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-forest-900/85 border border-forest-600/40 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-800 border border-lantern/30 flex items-center justify-center text-lantern shrink-0 shadow-sm">
            <Presentation className="w-5 h-5 text-lantern" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-parchment">
                {presentation?.original_filename || presentation?.title || 'PowerPoint Presentation'}
              </span>
              <Badge variant="amber" className="text-[10px] py-0 px-2 font-mono">
                {presentation?.total_slides || totalSlides} Slides Total
              </Badge>
            </div>
            <p className="text-xs text-sage mt-0.5">
              Interactive Deck · Slide {currentIndex + 1} of {totalSlides} (Original Slide #{currentSlide.slideNumber}) · {progressPercent}% complete
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Study Mode Selector */}
          <div className="flex rounded-xl bg-forest-950/80 p-1 border border-forest-600/40 text-xs">
            <button
              onClick={() => setStudyMode('stage')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                studyMode === 'stage'
                  ? 'bg-forest-700 text-lantern shadow-sm font-semibold'
                  : 'text-sage hover:text-parchment'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Slide Stage</span>
            </button>
            <button
              onClick={() => {
                setStudyMode('flashcard');
                setIsFlipped(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                studyMode === 'flashcard'
                  ? 'bg-forest-700 text-lantern shadow-sm font-semibold'
                  : 'text-sage hover:text-parchment'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Flashcard Recall</span>
            </button>
            <button
              onClick={() => setStudyMode('guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                studyMode === 'guide'
                  ? 'bg-forest-700 text-lantern shadow-sm font-semibold'
                  : 'text-sage hover:text-parchment'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Study Notes</span>
            </button>
          </div>

          {/* Download Original File Button */}
          {presentation?.material_id && (
            <a
              href={`/api/materials/${presentation.material_id}/file`}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-800 hover:bg-forest-700 border border-forest-600/50 text-xs font-medium text-parchment transition-colors shadow-sm"
              title="Download original presentation file"
            >
              <Download className="w-3.5 h-3.5 text-lantern" />
              <span className="hidden sm:inline">Download PPTX</span>
            </a>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-xl bg-forest-800 hover:bg-forest-700 border border-forest-600/50 text-sage hover:text-parchment transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Presentation Stage'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-forest-900/60 rounded-full h-1.5 overflow-hidden border border-forest-700/30">
        <div
          className="bg-gradient-to-r from-moss to-lantern h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ================= 1. PRESENTATION STAGE MODE ================= */}
      {studyMode === 'stage' && (
        <div className="space-y-4">
          {/* Main 16:9 Slide Canvas */}
          <div className="woodland-panel rounded-3xl p-6 md:p-10 border-2 border-forest-600/50 shadow-2xl relative overflow-hidden bg-gradient-to-br from-[#0F2A1E] via-[#143528] to-[#0A1B14] min-h-[440px] md:min-h-[500px] flex flex-col justify-between">
            {/* Top Slide Meta Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-forest-600/40 relative z-10">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-xl bg-forest-900/90 border border-lantern/40 text-lantern font-mono text-xs font-bold shadow-sm">
                  Slide {currentIndex + 1} of {totalSlides} (Slide #{currentSlide.slideNumber})
                </span>
                <span className="text-xs text-sage font-sans hidden sm:inline">
                  Navigate with Left / Right arrow keys
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySlide}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-forest-800/80 hover:bg-forest-700 text-xs text-sage hover:text-parchment border border-forest-600/40 transition-colors"
                  title="Copy Slide Content"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-moss-400" />
                      <span className="text-moss-300">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Slide Content Body */}
            <div className="py-6 space-y-4 relative z-10 my-auto max-w-4xl">
              {/* Slide Title */}
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider text-lantern font-semibold">
                  Presentation Slide
                </span>
                <h2 className="text-2xl md:text-4xl font-serif font-extrabold text-parchment tracking-tight leading-tight">
                  {currentSlide.title}
                </h2>
              </div>

              {/* Specialized Interactive Slide Component Renderers */}
              {isRoadmapSlide ? (
                renderRoadmapCards()
              ) : isComparisonSlide ? (
                renderComparisonCards()
              ) : (
                /* Standard Bullet & Paragraph Rendering with Clean Formatting */
                <div className="space-y-3 font-sans text-sm md:text-base leading-relaxed text-parchment/95">
                  {currentSlide.content
                    .filter(line => line.trim() !== currentSlide.title.trim())
                    .map((line, idx) => {
                      const trimmed = line.trim();
                      if (!trimmed) return null;

                      // Bullet Item
                      if (/^[-•*]\s|^\d+\.?\s/.test(trimmed)) {
                        return (
                          <div key={idx} className="flex items-start gap-3 pl-2 text-parchment">
                            <span className="w-2 h-2 rounded-full bg-lantern mt-2 shrink-0 shadow-lantern" />
                            <span className="leading-relaxed">
                              {trimmed.replace(/^[-•*]\s*|^\d+\.?\s*/, '')}
                            </span>
                          </div>
                        );
                      }

                      // Section Header / Highlight
                      if (trimmed.length < 50 && !trimmed.endsWith('.')) {
                        return (
                          <h4 key={idx} className="font-serif font-bold text-lantern pt-3 text-base md:text-lg border-b border-forest-700/30 pb-1">
                            {trimmed}
                          </h4>
                        );
                      }

                      // Case study highlight callout
                      if (/swiggy|flipkart|amazon|phonepe|zerodha/i.test(trimmed)) {
                        return (
                          <div key={idx} className="p-4 rounded-xl bg-forest-900/80 border border-amber-600/30 flex items-start gap-3 text-xs md:text-sm my-2">
                            <Building2 className="w-5 h-5 text-lantern shrink-0 mt-0.5" />
                            <div className="leading-relaxed text-parchment">
                              {trimmed}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <p key={idx} className="leading-relaxed text-parchment/90">
                          {trimmed}
                        </p>
                      );
                    })}
                </div>
              )}

              {/* Instructor Speaker Notes Callout */}
              {currentSlide.notes && (
                <div className="mt-6 p-4 rounded-2xl bg-forest-950/80 border border-amber-600/30 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-lantern flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-serif text-xs font-semibold text-lantern uppercase tracking-wider block">
                      Instructor Speaker Notes
                    </span>
                    <p className="text-xs text-sage-light leading-relaxed mt-0.5">
                      {currentSlide.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Slide Navigation Stepper Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-forest-600/40 relative z-10">
              <Button
                variant="secondary"
                size="md"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="gap-2 px-5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Slide</span>
              </Button>

              {/* Slide Counter Stepper */}
              <div className="text-xs font-mono text-sage font-medium">
                Slide <span className="text-lantern font-bold">{currentIndex + 1}</span> of {totalSlides}
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                disabled={currentIndex === totalSlides - 1}
                className="gap-2 px-5 shadow-lantern"
              >
                <span>Next Slide</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Interactive Slide Thumbnail Drawer */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-semibold text-sage flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-lantern" />
                <span>Jump to Slide ({slides.length} slides)</span>
              </span>
              <span className="text-[11px] text-sage/70 font-mono">
                Click any card to study
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {slides.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between h-20 ${
                    idx === currentIndex
                      ? 'bg-forest-700/90 border-lantern shadow-lantern text-parchment ring-1 ring-lantern'
                      : 'bg-forest-900/60 hover:bg-forest-800/80 border-forest-600/30 text-sage hover:text-parchment'
                  }`}
                >
                  <span className="font-mono text-[10px] text-lantern font-bold">
                    Slide {s.slideNumber}
                  </span>
                  <p className="text-xs font-medium line-clamp-2 leading-tight">
                    {s.title}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. INTERACTIVE FLASHCARD RECALL MODE ================= */}
      {studyMode === 'flashcard' && (
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h3 className="font-serif text-lg font-bold text-parchment">
              Active Recall Flashcard Mode
            </h3>
            <p className="text-xs text-sage">
              Test your recall of Slide {currentSlide.slideNumber}. Click the card or press Spacebar to flip!
            </p>
          </div>

          {/* 3D Flip Flashcard */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer max-w-xl mx-auto min-h-[320px] rounded-3xl p-8 woodland-panel border-2 border-lantern/40 hover:border-lantern shadow-2xl flex flex-col justify-between text-center transition-all duration-300 hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between">
              <Badge variant="amber" className="text-xs font-mono">
                Slide {currentSlide.slideNumber} of {totalSlides}
              </Badge>
              <span className="text-xs text-sage flex items-center gap-1 font-mono">
                <RotateCw className="w-3.5 h-3.5 text-lantern" />
                <span>Click to Flip</span>
              </span>
            </div>

            {!isFlipped ? (
              /* Flashcard Front (Prompt / Topic) */
              <div className="space-y-4 my-auto py-8">
                <span className="text-xs font-mono uppercase tracking-widest text-sage">
                  Question / Concept Prompt
                </span>
                <h3 className="text-2xl md:text-3xl font-serif font-extrabold text-parchment leading-snug">
                  What are the core ideas and principles behind &ldquo;{currentSlide.title}&rdquo;?
                </h3>
                <p className="text-xs text-sage-light italic">
                  Think of the key definitions, mechanisms, or real-world examples before flipping.
                </p>
              </div>
            ) : (
              /* Flashcard Back (Answer & Notes) */
              <div className="space-y-4 my-auto py-4 text-left">
                <span className="text-xs font-mono uppercase tracking-widest text-moss-300 block text-center">
                  Key Answers & Takeaways
                </span>
                <div className="space-y-2 text-xs md:text-sm text-parchment">
                  {currentSlide.content
                    .filter(l => l.trim() !== currentSlide.title.trim())
                    .slice(0, 5)
                    .map((l, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-lantern mt-0.5">•</span>
                        <span>{l}</span>
                      </div>
                    ))}
                </div>
                {currentSlide.notes && (
                  <div className="p-3 rounded-xl bg-forest-900/80 border border-amber-600/30 text-xs text-sage mt-2">
                    <strong className="text-lantern">Notes:</strong> {currentSlide.notes}
                  </div>
                )}
              </div>
            )}

            <div className="text-[11px] text-sage/70 font-mono">
              {isFlipped ? 'Great work! Step to the next card below.' : 'Click anywhere on the card to reveal answers.'}
            </div>
          </div>

          {/* Flashcard Stepper Controls */}
          <div className="flex items-center justify-center gap-4 max-w-sm mx-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Card</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleNext}
              disabled={currentIndex === totalSlides - 1}
              className="gap-2 shadow-lantern"
            >
              <span>Next Card</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ================= 3. POLISHED STUDY NOTES GUIDE MODE ================= */}
      {studyMode === 'guide' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-forest-900/80 border border-forest-600/40">
            <h3 className="font-serif text-lg font-bold text-parchment flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-lantern" />
              Executive Study Guide & Lecture Notes
            </h3>
            <p className="text-xs text-sage leading-relaxed">
              Read through all {totalSlides} presentation slides with formatted headings, tables, case studies, and instructor commentary.
            </p>
          </div>

          <div className="space-y-4">
            {slides.map(s => (
              <div
                key={s.slideNumber}
                className="woodland-panel rounded-2xl p-6 border border-forest-600/40 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-forest-700/40">
                  <span className="font-mono text-xs font-bold text-lantern">
                    Slide {s.slideNumber} of {totalSlides}
                  </span>
                  <Badge variant="sage" className="text-[10px]">
                    Deck Material
                  </Badge>
                </div>

                <h4 className="font-serif text-lg font-bold text-parchment">
                  {s.title}
                </h4>

                <div className="space-y-2 text-xs md:text-sm text-sage-light leading-relaxed">
                  {s.content
                    .filter(l => l.trim() !== s.title.trim())
                    .map((l, i) => {
                      const trimmed = l.trim();
                      if (/^\d{2}$/.test(trimmed)) {
                        return (
                          <span key={i} className="inline-block px-2 py-0.5 rounded bg-lantern/20 text-lantern font-mono text-[11px] font-bold mr-2">
                            Step {trimmed}
                          </span>
                        );
                      }
                      return (
                        <p key={i} className="leading-relaxed">
                          {trimmed}
                        </p>
                      );
                    })}
                </div>

                {s.notes && (
                  <div className="p-3 rounded-xl bg-forest-900/70 border border-amber-600/25 text-xs text-sage-light">
                    <span className="font-semibold text-lantern block mb-0.5">
                      Instructor Speaker Notes:
                    </span>
                    {s.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SLIDE STUDY ACTIONS FOOTER ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <Link
          href={`/tutor?q=${encodeURIComponent(
            `Explain the core concepts and real-world application of Slide ${currentSlide.slideNumber}: "${currentSlide.title}" from my study deck.`
          )}`}
          className="flex items-center gap-3 p-3.5 rounded-xl bg-forest-900/70 hover:bg-forest-800/80 border border-forest-600/40 hover:border-lantern/50 transition-all group shadow-sm"
        >
          <div className="w-9 h-9 rounded-lg bg-forest-800 flex items-center justify-center text-lantern group-hover:scale-105 transition-transform">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-parchment group-hover:text-lantern transition-colors block">
              Ask AI Tutor about Slide {currentSlide.slideNumber}
            </span>
            <span className="text-[11px] text-sage">
              Get an in-depth breakdown of this slide from the Forest Guide.
            </span>
          </div>
        </Link>

        <Link
          href={`/scribe?title=${encodeURIComponent(
            `Revision Notes on Slide ${currentSlide.slideNumber}: ${currentSlide.title}`
          )}`}
          className="flex items-center gap-3 p-3.5 rounded-xl bg-forest-900/70 hover:bg-forest-800/80 border border-forest-600/40 hover:border-lantern/50 transition-all group shadow-sm"
        >
          <div className="w-9 h-9 rounded-lg bg-forest-800 flex items-center justify-center text-lantern group-hover:scale-105 transition-transform">
            <Feather className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-parchment group-hover:text-lantern transition-colors block">
              Penn Notes for Slide {currentSlide.slideNumber}
            </span>
            <span className="text-[11px] text-sage">
              Write personal takeaways or generate revision cards in Scribe.
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
