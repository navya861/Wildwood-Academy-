'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  RotateCw,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Layers,
  Plus,
  BookOpen,
  Award,
  Check,
  Eye,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export interface FlashcardItem {
  id: number;
  title: string;
  category?: string;
  question: string;
  answer: string;
}

interface FlashcardDeckProps {
  content: string;
  noteTitle: string;
  onEditMarkdown?: () => void;
  onAppendCard?: (cardMarkdown: string) => void;
}

export function parseFlashcards(text: string): FlashcardItem[] {
  if (!text) return [];
  const cards: FlashcardItem[] = [];

  // Format 1: ### Card [X]: [Title]
  const cardBlocks = text.split(/(?=###\s+(?:Card|\d+))/i).filter(b => b.trim());
  if (cardBlocks.length > 1 || (cardBlocks.length === 1 && /###\s+(?:Card|\d+)/i.test(cardBlocks[0]))) {
    for (let i = 0; i < cardBlocks.length; i++) {
      const block = cardBlocks[i];
      const titleMatch = block.match(/###\s+(?:Card\s*\d*[:.-]?\s*)?([^\n]+)/i);
      const title = titleMatch ? titleMatch[1].trim() : `Card ${i + 1}`;

      const catMatch = block.match(/\*\*(?:Category|Topic):\*\*\s*([^\n]+)/i);
      const category = catMatch ? catMatch[1].trim() : undefined;

      const qMatch = block.match(
        /\*\*(?:Question|Front|Prompt|Q):\*\*\s*([\s\S]*?)(?=\*\*(?:Answer|Back|Explanation|A):\*\*|$)/i
      );
      const aMatch = block.match(
        /\*\*(?:Answer|Back|Explanation|A):\*\*\s*([\s\S]*?)(?=(?:###|$))/i
      );

      if (qMatch && aMatch) {
        cards.push({
          id: cards.length + 1,
          title,
          category,
          question: qMatch[1].trim(),
          answer: aMatch[1].trim(),
        });
      }
    }
  }

  // Format 2: Q: / A: pairs (e.g. Q: ... A: ...)
  if (cards.length === 0) {
    const qaRegex =
      /(?:^|\n)(?:\*\*Q(?:\d+)?:\*\*|Q(?:\d+)?:)\s*([\s\S]*?)\n(?:\*\*A(?:\d+)?:\*\*|A(?:\d+)?:)\s*([\s\S]*?)(?=(?:\n(?:\*\*Q|Q\d?:))|$)/gi;
    let match;
    let idx = 1;
    while ((match = qaRegex.exec(text)) !== null) {
      cards.push({
        id: idx,
        title: `Card ${idx}`,
        question: match[1].trim(),
        answer: match[2].trim(),
      });
      idx++;
    }
  }

  // Format 3: Fallback from bold bullet points: - **Term:** Definition or 1. **Term:** Definition
  if (cards.length === 0) {
    const bulletRegex =
      /(?:^|\n)\s*(?:[-*]|\d+\.)\s*\*\*([^*]+)\*\*[:\s]+([\s\S]*?)(?=(?:\n\s*(?:[-*]|\d+\.)\s*\*\*)|(?:\n###)|$)/gi;
    let match;
    let idx = 1;
    while ((match = bulletRegex.exec(text)) !== null) {
      const term = match[1].trim();
      const def = match[2].trim();
      if (term.length > 2 && def.length > 5) {
        cards.push({
          id: idx,
          title: term,
          category: 'Key Concept',
          question: `What is ${term} and why is it significant?`,
          answer: def,
        });
        idx++;
      }
    }
  }

  return cards;
}

export function FlashcardDeck({
  content,
  noteTitle,
  onEditMarkdown,
  onAppendCard,
}: FlashcardDeckProps) {
  const initialCards = useMemo(() => parseFlashcards(content), [content]);

  const [cards, setCards] = useState<FlashcardItem[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<number>>(new Set());
  const [reviewIds, setReviewIds] = useState<Set<number>>(new Set());
  const [isShuffled, setIsShuffled] = useState(false);

  // Sync if content changes
  useEffect(() => {
    const parsed = parseFlashcards(content);
    setCards(parsed);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [content]);

  const totalCards = cards.length;
  const currentCard = cards[currentIndex] || cards[0];

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
    setIsFlipped(false);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => Math.min(totalCards - 1, prev + 1));
    setIsFlipped(false);
  }, [totalCards]);

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handlePrev, handleNext]);

  const handleMarkMastered = () => {
    if (!currentCard) return;
    setMasteredIds(prev => {
      const next = new Set(prev);
      next.add(currentCard.id);
      return next;
    });
    setReviewIds(prev => {
      const next = new Set(prev);
      next.delete(currentCard.id);
      return next;
    });
    if (currentIndex < totalCards - 1) {
      handleNext();
    }
  };

  const handleMarkReview = () => {
    if (!currentCard) return;
    setReviewIds(prev => {
      const next = new Set(prev);
      next.add(currentCard.id);
      return next;
    });
    setMasteredIds(prev => {
      const next = new Set(prev);
      next.delete(currentCard.id);
      return next;
    });
    if (currentIndex < totalCards - 1) {
      handleNext();
    }
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsShuffled(true);
  };

  const handleResetDeck = () => {
    setCards(initialCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredIds(new Set());
    setReviewIds(new Set());
    setIsShuffled(false);
  };

  const handleAddNewCardTemplate = () => {
    if (onAppendCard) {
      const newCardNum = totalCards + 1;
      const template = `\n\n### Card ${newCardNum}: Custom Flashcard\n**Category:** Personal Study\n**Front:** Enter your question or key concept prompt here...\n**Back:** Enter the detailed explanation, formula, or answer here...`;
      onAppendCard(template);
    }
  };

  if (!cards || cards.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-forest-900/50 rounded-2xl border border-forest-700/40">
        <Layers className="w-12 h-12 text-sage/40 mb-3" />
        <h3 className="font-serif text-lg font-bold text-parchment">No Flashcards Detected</h3>
        <p className="text-xs text-sage mt-1 max-w-md">
          This note does not have question-answer flashcard pairs yet. You can format it using{' '}
          <code className="text-lantern font-mono">### Card 1</code> and{' '}
          <code className="text-lantern font-mono">**Front:** / **Back:**</code>, or switch to the Markdown editor.
        </p>
        <div className="flex items-center gap-3 mt-4">
          <Button onClick={handleAddNewCardTemplate} variant="primary" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            <span>Add First Flashcard</span>
          </Button>
          {onEditMarkdown && (
            <Button onClick={onEditMarkdown} variant="secondary" size="sm" className="gap-2">
              <FileText className="w-4 h-4" />
              <span>Edit Raw Markdown</span>
            </Button>
          )}
        </div>
      </div>
    );
  }

  const isCurrentMastered = currentCard ? masteredIds.has(currentCard.id) : false;
  const isCurrentReview = currentCard ? reviewIds.has(currentCard.id) : false;
  const progressPercent = Math.round(((currentIndex + 1) / totalCards) * 100);
  const masteryPercent = Math.round((masteredIds.size / totalCards) * 100);

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-hidden select-none">
      {/* Deck Header & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-forest-700/40">
        <div className="flex items-center gap-2">
          <Badge variant="amber" className="gap-1 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-lantern" />
            Card {currentIndex + 1} of {totalCards}
          </Badge>
          {currentCard.category && (
            <Badge variant="sage" className="text-[11px] uppercase tracking-wider font-mono">
              {currentCard.category}
            </Badge>
          )}
          {isCurrentMastered && (
            <Badge variant="success" className="gap-1 text-[11px]">
              <Check className="w-3 h-3" /> Mastered
            </Badge>
          )}
          {isCurrentReview && (
            <Badge variant="amber" className="text-[11px]">
              Needs Review
            </Badge>
          )}
        </div>

        {/* Quick Deck Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
              isShuffled
                ? 'bg-amber-500/20 text-lantern border border-amber-500/40'
                : 'text-sage hover:text-parchment hover:bg-forest-800'
            }`}
            title="Shuffle Deck"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Shuffle</span>
          </button>

          <button
            onClick={handleResetDeck}
            className="p-1.5 rounded-lg text-xs text-sage hover:text-parchment hover:bg-forest-800 transition-colors flex items-center gap-1"
            title="Reset Deck Progress"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {onAppendCard && (
            <button
              onClick={handleAddNewCardTemplate}
              className="p-1.5 rounded-lg text-xs text-lantern hover:bg-forest-800 transition-colors flex items-center gap-1"
              title="Add New Card"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Card</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-forest-950/70 h-2 rounded-full overflow-hidden border border-forest-700/50">
        <div
          className="bg-gradient-to-r from-forest-500 via-sage to-lantern h-full transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main 3D Flippable Flashcard Container */}
      <div
        className="flex-1 w-full max-w-2xl mx-auto flex flex-col justify-center my-1"
        style={{ perspective: '1200px' }}
      >
        <div
          onClick={handleFlip}
          style={{
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className="relative w-full h-[280px] sm:h-[320px] cursor-pointer group"
        >
          {/* ================= FRONT SIDE (QUESTION) ================= */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-forest-800 via-forest-850 to-forest-900 border-2 border-forest-600/70 group-hover:border-lantern/70 p-6 flex flex-col justify-between shadow-2xl transition-all overflow-hidden"
          >
            {/* Background Accent watermark */}
            <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none">
              <HelpCircle className="w-48 h-48 text-lantern" />
            </div>

            {/* Front Header */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Question Prompt
                </span>
                <span className="text-xs text-sage/70 font-mono">#{currentCard.id}</span>
              </div>
              <span className="text-[11px] text-sage/70 flex items-center gap-1">
                <RotateCw className="w-3 h-3 text-lantern" /> Click to reveal
              </span>
            </div>

            {/* Front Question Body */}
            <div className="my-auto py-2 z-10 text-center">
              <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-parchment leading-snug">
                {currentCard.question}
              </h2>
            </div>

            {/* Front Footer */}
            <div className="flex items-center justify-between text-[11px] text-sage/60 border-t border-forest-700/40 pt-2 z-10">
              <span>Card {currentIndex + 1} of {totalCards}</span>
              <span className="text-lantern/80 font-mono text-[10px]">Press [Space] to flip</span>
            </div>
          </div>

          {/* ================= BACK SIDE (ANSWER) ================= */}
          <div
            style={{
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-forest-900 via-forest-950 to-amber-950/40 border-2 border-lantern/70 p-6 flex flex-col justify-between shadow-2xl transition-all overflow-hidden"
          >
            {/* Background Accent watermark */}
            <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none">
              <CheckCircle2 className="w-48 h-48 text-emerald-400" />
            </div>

            {/* Back Header */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Answer &amp; Insight
                </span>
                <span className="text-xs text-sage/70 font-mono">#{currentCard.id}</span>
              </div>
              <span className="text-[11px] text-sage/70 flex items-center gap-1">
                <RotateCw className="w-3 h-3 text-lantern" /> Click to flip back
              </span>
            </div>

            {/* Back Answer Body */}
            <div className="my-auto py-2 z-10 overflow-y-auto max-h-[190px] pr-2 scrollbar-thin">
              <div className="text-xs sm:text-sm text-parchment/95 leading-relaxed space-y-2 font-sans whitespace-pre-line text-left">
                {currentCard.answer}
              </div>
            </div>

            {/* Back Footer */}
            <div className="flex items-center justify-between text-[11px] text-sage/60 border-t border-forest-700/40 pt-2 z-10">
              <span>{isCurrentMastered ? '🌿 Marked Mastered' : isCurrentReview ? '🌱 Marked For Review' : 'Active Recall'}</span>
              <span className="text-lantern/80 font-mono text-[10px]">Press [Space] to flip back</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation & Mastery Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        {/* Step Buttons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            variant="secondary"
            size="sm"
            className="gap-1 text-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <Button
            onClick={handleFlip}
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-lantern hover:text-lantern-light hover:bg-forest-800"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Flip Card</span>
          </Button>

          <Button
            onClick={handleNext}
            disabled={currentIndex === totalCards - 1}
            variant="secondary"
            size="sm"
            className="gap-1 text-xs"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Self-Assessment Mastery Actions */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleMarkReview}
            variant="ghost"
            size="sm"
            className={`gap-1.5 text-xs transition-all ${
              isCurrentReview
                ? 'bg-amber-500/20 text-lantern border border-amber-500/40'
                : 'text-sage hover:text-amber-300 hover:bg-forest-800'
            }`}
          >
            <span>🌱 Need Practice</span>
          </Button>

          <Button
            onClick={handleMarkMastered}
            variant="primary"
            size="sm"
            className={`gap-1.5 text-xs shadow-lantern transition-all ${
              isCurrentMastered ? 'bg-emerald-700 border-emerald-500 text-white' : ''
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>🌿 Mastered!</span>
          </Button>
        </div>
      </div>

      {/* Card Selector Strip & Mastery Tally */}
      <div className="pt-2 border-t border-forest-700/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-sage">
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-400">
            <Check className="w-3 h-3" /> {masteredIds.size} Mastered
          </span>
          <span>·</span>
          <span className="flex items-center gap-1 text-amber-300">
            🌱 {reviewIds.size} Need Review
          </span>
          <span>·</span>
          <span>{totalCards - masteredIds.size} Remaining</span>
        </div>

        {/* Horizontal Mini Card Quick-Jump Strip */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full py-1">
          {cards.map((c, i) => {
            const isMastered = masteredIds.has(c.id);
            const isReview = reviewIds.has(c.id);
            const isCurrent = i === currentIndex;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setCurrentIndex(i);
                  setIsFlipped(false);
                }}
                className={`w-7 h-7 rounded-lg text-[11px] font-mono flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'border-2 border-lantern bg-forest-700 text-parchment font-bold shadow-sm'
                    : isMastered
                    ? 'border border-emerald-500/50 bg-emerald-950/40 text-emerald-300'
                    : isReview
                    ? 'border border-amber-500/50 bg-amber-950/40 text-amber-300'
                    : 'border border-forest-700/60 bg-forest-900/60 text-sage hover:bg-forest-800'
                }`}
                title={`Jump to Card ${i + 1}: ${c.title}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
