import React from 'react';
import Link from 'next/link';
import { Compass, Library, Bot, BookOpenCheck, Feather, Swords, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div className="max-w-6xl mx-auto py-8 md:py-16 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-6 relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-800/90 border border-lantern/40 text-lantern text-xs font-semibold shadow-lantern animate-float-gentle">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Full-Stack AI-Powered Learning Management System</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-serif font-extrabold text-parchment tracking-tight max-w-4xl mx-auto leading-tight">
          Where Ancient Wisdom Meets <span className="text-lantern underline decoration-lantern/40">Intelligent Lore</span>
        </h1>

        <p className="text-base md:text-lg text-sage max-w-2xl mx-auto leading-relaxed">
          Enshrine your study scrolls, PDFs, and notes into structured woodland courses. Learn with a source-grounded AI tutor, penn personalized revision notes, conquer trial quizzes, and watch your botanical knowledge grow.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/auth/signup">
            <Button variant="primary" size="lg" className="gap-2 shadow-lantern text-base px-8 py-3.5">
              <span>Enroll as an Apprentice Scholar</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="secondary" size="lg" className="text-base px-8 py-3.5">
              <span>Return to Academy Hall</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Core Academic Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        {/* 1. Woodland Library */}
        <div className="woodland-panel p-6 rounded-2xl hover-shimmer space-y-3">
          <div className="w-12 h-12 rounded-xl bg-forest-800 border border-lantern/30 flex items-center justify-center text-lantern shadow-sm">
            <Library className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-parchment">The Woodland Library</h3>
          <p className="text-xs md:text-sm text-sage leading-relaxed">
            Drag-and-drop PDFs, DOCX scrolls, Markdown files, and photographs of handwritten notes. Powered by private storage and real OCR text extraction.
          </p>
        </div>

        {/* 2. Course & Lesson Synthesis */}
        <div className="woodland-panel p-6 rounded-2xl hover-shimmer space-y-3">
          <div className="w-12 h-12 rounded-xl bg-forest-800 border border-lantern/30 flex items-center justify-center text-lantern shadow-sm">
            <BookOpenCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-parchment">Course & Lesson Synthesis</h3>
          <p className="text-xs md:text-sm text-sage leading-relaxed">
            Transform raw documents into structured modules with learning objectives, comprehensive teaching text, key terms glossary, and knowledge checks.
          </p>
        </div>

        {/* 3. The Forest Guide */}
        <div className="woodland-panel p-6 rounded-2xl hover-shimmer space-y-3">
          <div className="w-12 h-12 rounded-xl bg-forest-800 border border-lantern/30 flex items-center justify-center text-lantern shadow-sm">
            <Bot className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-parchment">The Forest Guide (AI Tutor)</h3>
          <p className="text-xs md:text-sm text-sage leading-relaxed">
            An adaptive conversational mentor that teaches using Socratic questioning, analogies, and verified citations directly grounded in your uploaded materials.
          </p>
        </div>

        {/* 4. Scribe's Corner */}
        <div className="woodland-panel p-6 rounded-2xl hover-shimmer space-y-3">
          <div className="w-12 h-12 rounded-xl bg-forest-800 border border-lantern/30 flex items-center justify-center text-lantern shadow-sm">
            <Feather className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-parchment">Scribe&apos;s Corner</h3>
          <p className="text-xs md:text-sm text-sage leading-relaxed">
            Generate concise revision notes, exam cram sheets, beginner guides, or flashcards. Edit them freely while your personal edits remain preserved.
          </p>
        </div>

        {/* 5. The Trial Grounds */}
        <div className="woodland-panel p-6 rounded-2xl hover-shimmer space-y-3">
          <div className="w-12 h-12 rounded-xl bg-forest-800 border border-lantern/30 flex items-center justify-center text-lantern shadow-sm">
            <Swords className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-parchment">The Trial Grounds</h3>
          <p className="text-xs md:text-sm text-sage leading-relaxed">
            Practice with multiple-choice, true/false, and short-answer quizzes. Graded strictly on the server to prevent answer leakage, with detailed explanations.
          </p>
        </div>

        {/* 6. Firefly Quest & Growth */}
        <div className="woodland-panel p-6 rounded-2xl hover-shimmer space-y-3">
          <div className="w-12 h-12 rounded-xl bg-forest-800 border border-lantern/30 flex items-center justify-center text-lantern shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-parchment">Firefly Quest & Growth</h3>
          <p className="text-xs md:text-sm text-sage leading-relaxed">
            Guide your woodland creature through an interactive educational mini-game. Earn validated XP to nurture your virtual enchanted plant through 5 botanical stages.
          </p>
        </div>
      </div>

      {/* Security & Reliability Banner */}
      <div className="p-8 rounded-3xl bg-forest-950/80 border border-forest-600/40 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-forest-800 border border-moss flex items-center justify-center text-moss-300 shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif text-base font-bold text-parchment">Private & Isolated Scholar Sanctum</h4>
            <p className="text-xs text-sage mt-0.5">
              Row Level Security (RLS), private encrypted storage, server-authenticated API endpoints, and persistent relational data storage.
            </p>
          </div>
        </div>

        <Link href="/auth/signup">
          <Button variant="primary" size="md" className="shrink-0">
            Open Scholar Account
          </Button>
        </Link>
      </div>
    </div>
  );
}
