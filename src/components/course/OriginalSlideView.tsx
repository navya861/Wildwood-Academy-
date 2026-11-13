'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SlideData } from '@/lib/types';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Download,
  Copy,
  Check,
  Sparkles,
  Layers,
  Lock,
  Globe,
  Server,
  Database,
  ArrowRight,
  Sun,
  Moon,
  ShieldAlert,
  Radio,
  FileCode,
  Smartphone,
  Cpu,
  Layers as LayersIcon,
  HelpCircle,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  GitBranch,
  Terminal,
  Activity,
  Zap,
  DollarSign,
  Briefcase,
  Users,
  Grid,
  Key,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface OriginalSlideViewProps {
  slides: SlideData[];
  presentation?: {
    material_id: string;
    title: string;
    original_filename: string;
    total_slides: number;
  };
  lessonTitle: string;
  onSwitchToNotes?: () => void;
}

export function OriginalSlideView({
  slides,
  presentation,
  lessonTitle,
  onSwitchToNotes,
}: OriginalSlideViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [theme, setTheme] = useState<'white' | 'dark'>('white');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);

  const totalSlides = slides?.length || 0;
  const currentSlide = slides?.[currentIndex] || slides?.[0];

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => Math.min(totalSlides - 1, prev + 1));
  }, [totalSlides]);

  // Keyboard navigation
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  const handleCopy = () => {
    if (!currentSlide) return;
    const text = `Slide ${currentSlide.slideNumber}: ${currentSlide.title}\n\n${(currentSlide.content || []).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!slides || slides.length === 0 || !currentSlide) {
    return (
      <div className="p-8 text-center text-xs text-sage italic">
        No presentation slides available.
      </div>
    );
  }

  const isDark = theme === 'dark';

  // Determine slide deck subject badge based on presentation title
  const deckBadge = useMemo(() => {
    const presTitle = (presentation?.original_filename || presentation?.title || lessonTitle || '').toLowerCase();
    if (presTitle.includes('day 1') || presTitle.includes('stack') || presTitle.includes('how software')) {
      return 'PM2-01 & PM2-02 · How Software Works & Meet the Stack';
    }
    if (presTitle.includes('day 2') || presTitle.includes('api') || presTitle.includes('integration')) {
      return 'PM2-03 & PM2-04 · APIs & System Integrations';
    }
    if (presTitle.includes('day 3') || presTitle.includes('database') || presTitle.includes('data modeling')) {
      return 'PM2-05 & PM2-06 · Databases & Data Modeling';
    }
    return 'HSB — Product Management II · Executive Study Deck';
  }, [presentation, lessonTitle]);

  // ================= SPECIFIC HIGH-FIDELITY SLIDE RENDERERS =================

  // SLIDE 1: TITLE BANNER SLIDE
  const renderSlide1 = () => (
    <div className="flex flex-col items-center justify-center text-center py-6 sm:py-10 space-y-4">
      <Badge variant="amber" className="text-xs uppercase tracking-widest font-mono px-3 py-1">
        Executive Product Architecture Deck
      </Badge>

      <h1 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-black max-w-3xl leading-tight ${
        isDark ? 'text-white' : 'text-slate-900'
      }`}>
        {currentSlide.title}
      </h1>

      <p className={`text-sm sm:text-base max-w-2xl font-sans leading-relaxed ${
        isDark ? 'text-slate-300' : 'text-slate-600'
      }`}>
        {currentSlide.keyTakeaway || 'A fast, high-level comprehensive tour for Product Managers — everything you need to know.'}
      </p>

      <div className={`mt-6 pt-6 border-t flex flex-wrap items-center justify-center gap-6 text-xs ${
        isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
      }`}>
        <span className="flex items-center gap-1.5 font-medium">
          <BookOpen className="w-4 h-4 text-amber-500" />
          Master Curriculum: Dr. Anand
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <Layers className="w-4 h-4 text-blue-500" />
          {totalSlides} Complete Slides Deck
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[11px] bg-slate-500/10 px-2 py-0.5 rounded">
          {deckBadge}
        </span>
      </div>
    </div>
  );

  // SLIDE 2: AGENDA / ROADMAP
  const renderSlide2 = () => {
    const items = [
      { num: '01', title: 'Architecture & Foundations', desc: 'How systems actually work — layers, plumbing & data flow' },
      { num: '02', title: 'Protocols & Protocols Under the Hood', desc: 'HTTP, TLS, TCP/IP, and state management' },
      { num: '03', title: 'Front-End & Back-End Ecosystem', desc: 'Frameworks, rendering pipelines, runtimes & ORMs' },
      { num: '04', title: 'APIs, Real-Time & Integrations', desc: 'REST, GraphQL, WebSockets, queues & contracts' },
      { num: '05', title: 'Databases & Infrastructure', desc: 'SQL vs NoSQL, scaling, cloud, and trade-offs' },
    ];

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => (
            <div
              key={item.num}
              className={`p-4 rounded-xl border transition-all ${
                isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-base font-black text-amber-500">{item.num}</span>
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                  isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
                }`}>Core Module</span>
              </div>
              <h4 className={`font-serif font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {item.title}
              </h4>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // SLIDE 3: THE BIG PICTURE
  const renderSlide3 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Layer 1: Client */}
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/90 border-blue-500/40' : 'bg-blue-50/60 border-blue-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-bold text-blue-500">LAYER 1</span>
            <Smartphone className="w-4 h-4 text-blue-500" />
          </div>
          <h4 className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>The Client (Front-End)</h4>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            What the user sees and taps. Mobile apps (iOS/Android) and Web browsers formulate requests and render responses.
          </p>
          <div className="mt-2 text-[10px] font-mono text-blue-600 dark:text-blue-400">
            React, Swift, Flutter, HTML/CSS
          </div>
        </div>

        {/* Layer 2: Network */}
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/90 border-cyan-500/40' : 'bg-cyan-50/60 border-cyan-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-bold text-cyan-500">LAYER 2</span>
            <Globe className="w-4 h-4 text-cyan-500" />
          </div>
          <h4 className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Public Network &amp; DNS</h4>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Fiber optics, cellular towers, and TCP/IP routing packets across continents with TLS encryption.
          </p>
          <div className="mt-2 text-[10px] font-mono text-cyan-600 dark:text-cyan-400">
            HTTP/HTTPS, DNS, CDNs
          </div>
        </div>

        {/* Layer 3: Server */}
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/90 border-indigo-500/40' : 'bg-indigo-50/60 border-indigo-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-bold text-indigo-500">LAYER 3</span>
            <Server className="w-4 h-4 text-indigo-500" />
          </div>
          <h4 className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Application Server</h4>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Where business logic runs. Validates identities, calculates prices, and orchestrates workflows.
          </p>
          <div className="mt-2 text-[10px] font-mono text-indigo-600 dark:text-indigo-400">
            Node.js, Python, Java, Go
          </div>
        </div>

        {/* Layer 4: Database */}
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/90 border-amber-500/40' : 'bg-amber-50/60 border-amber-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-bold text-amber-500">LAYER 4</span>
            <Database className="w-4 h-4 text-amber-500" />
          </div>
          <h4 className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Database &amp; Storage</h4>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            ACID-compliant storage enforcing schema rules and persisting state reliably across reboots.
          </p>
          <div className="mt-2 text-[10px] font-mono text-amber-600 dark:text-amber-400">
            PostgreSQL, MySQL, Redis
          </div>
        </div>
      </div>
    </div>
  );

  // SLIDE 4: WEB FUNDAMENTALS
  const renderSlide4 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Protocols */}
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-blue-500/20">
            <span className="font-bold text-xs text-blue-600 dark:text-blue-400">HTTP / REST</span>
            <Globe className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <p className={`text-xs mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            The language browsers and servers speak. Stateless request-response cycle.
          </p>
          <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
            <span className="p-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">GET (Read)</span>
            <span className="p-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">POST (Create)</span>
            <span className="p-1 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">PUT (Update)</span>
            <span className="p-1 rounded bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-bold">DELETE (Drop)</span>
          </div>
        </div>

        {/* HTTPS / TLS */}
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-500/20">
            <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">HTTPS / TLS</span>
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <p className={`text-xs mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            HTTP over cryptographic TLS encryption. Protects credentials and cards from packet sniffing.
          </p>
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-700 dark:text-emerald-300">
            🔒 Signaled by padlock icon in URL bar. Essential for modern web trust.
          </div>
        </div>

        {/* TCP/IP & DNS */}
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-indigo-500/20">
            <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">TCP/IP &amp; DNS</span>
            <Radio className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <p className={`text-xs mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            <strong>DNS:</strong> Phonebook converting domain names to IP addresses.
          </p>
          <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            <strong>TCP/IP:</strong> Chunks data into packets and guarantees reliable sequence delivery.
          </p>
        </div>
      </div>
    </div>
  );

  // SLIDE 5: STATE & SPEED (Cookies, Sessions, Caching)
  const renderSlide5 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cookies & Sessions */}
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
          <h4 className="font-bold text-xs uppercase font-mono text-amber-500 mb-2">Cookies, Sessions &amp; JWTs</h4>
          <p className={`text-xs leading-relaxed mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            HTTP is stateless. To remember users between requests, servers set an encrypted session cookie or issue a JSON Web Token (JWT).
          </p>
          <div className={`p-3 rounded-lg border text-xs space-y-1.5 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="font-mono text-[11px] text-amber-600 dark:text-amber-400">Cookie: session_id=abc123xyz</div>
            <p className="text-[11px] text-slate-500">Browser automatically attaches this cookie on every subsequent request.</p>
          </div>
        </div>

        {/* CDNs & Caching */}
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
          <h4 className="font-bold text-xs uppercase font-mono text-blue-500 mb-2">CDNs &amp; Edge Caching</h4>
          <p className={`text-xs leading-relaxed mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Content Delivery Networks (Cloudflare, Fastly) position proxy cache servers within 20km of users worldwide.
          </p>
          <div className={`p-3 rounded-lg border text-xs space-y-1.5 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="font-mono text-[11px] text-blue-600 dark:text-blue-400">Cache-Control: max-age=31536000</div>
            <p className="text-[11px] text-slate-500">Delivers static images &amp; JS bundles in under 30ms without hitting the origin database.</p>
          </div>
        </div>
      </div>
    </div>
  );

  // SLIDE 8: FRONT-END CONTINUED (CSS Frameworks, Rendering Strategies & Build Tools)
  const renderSlide8 = () => (
    <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Column 1: CSS Frameworks */}
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
          <span className="text-[10px] font-mono uppercase font-bold text-blue-600 dark:text-blue-400 block mb-2">
            CSS Frameworks · Pre-Built Kits
          </span>
          <div className="space-y-2 text-xs">
            <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="font-bold text-slate-900 dark:text-white">Tailwind CSS</div>
              <p className="text-[11px] text-slate-500">Utility-first, industry default for modern SaaS</p>
            </div>
            <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="font-bold text-slate-900 dark:text-white">Bootstrap</div>
              <p className="text-[11px] text-slate-500">Classic grid, rapid prototyping kits</p>
            </div>
            <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="font-bold text-slate-900 dark:text-white">Material UI &amp; Shadcn/UI</div>
              <p className="text-[11px] text-slate-500">Pre-built accessible UI primitives</p>
            </div>
          </div>
        </div>

        {/* Column 2: Rendering Strategy Table */}
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
          <span className="text-[10px] font-mono uppercase font-bold text-indigo-600 dark:text-indigo-400 block mb-2">
            Rendering Strategies · Where HTML Builds
          </span>
          <div className="space-y-2 text-xs">
            <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                <span>CSR (Client-Side)</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">Dashboards</span>
              </div>
              <p className="text-[11px] text-slate-500">Browser downloads JS bundle and executes UI locally</p>
            </div>
            <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                <span>SSR (Server-Side)</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">SEO / Public</span>
              </div>
              <p className="text-[11px] text-slate-500">Server pre-renders HTML per request for fast indexing</p>
            </div>
            <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                <span>SSG (Static)</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Blogs / Docs</span>
              </div>
              <p className="text-[11px] text-slate-500">Pages generated at build time; lightning fast CDN serving</p>
            </div>
          </div>
        </div>

        {/* Column 3: Build Pipeline & Accessibility */}
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
          <span className="text-[10px] font-mono uppercase font-bold text-amber-600 dark:text-amber-400 block mb-2">
            Build Pipeline &amp; Accessibility (a11y)
          </span>
          <div className="space-y-2 text-xs">
            <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="font-bold text-slate-900 dark:text-white">Bundlers &amp; Dependencies</div>
              <p className="text-[11px] text-slate-500">Vite / Webpack bundle code; npm / pnpm manage packages</p>
            </div>
            <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="font-bold text-slate-900 dark:text-white">Responsive Design</div>
              <p className="text-[11px] text-slate-500">Fluid layouts adapting seamlessly from mobile to 4K displays</p>
            </div>
            <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="font-bold text-slate-900 dark:text-white">Accessibility Standards</div>
              <p className="text-[11px] text-slate-500">Screen readers, keyboard navigation, and contrast compliance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // DAY 2 SLIDE 3: WHAT IS AN API? THE RESTAURANT ANALOGY
  const renderApiAnalogy = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className={`p-4 rounded-xl border text-center ${isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center font-bold text-base mb-2">
            1
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">The Customer</h4>
          <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 block mb-1">Frontend / Mobile App</span>
          <p className="text-xs text-slate-500">Reads the menu, chooses what they want, and places an order.</p>
        </div>

        <div className={`p-4 rounded-xl border text-center ${isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center font-bold text-base mb-2">
            2
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">The Menu</h4>
          <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 block mb-1">API Docs &amp; Endpoints</span>
          <p className="text-xs text-slate-500">Defines exact dishes (endpoints) and options (request parameters).</p>
        </div>

        <div className={`p-4 rounded-xl border text-center border-2 border-emerald-500/50 ${isDark ? 'bg-slate-800/90' : 'bg-emerald-50/50 shadow-sm'}`}>
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center font-bold text-base mb-2">
            3
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">The Waiter</h4>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 block mb-1">THE API ITSELF</span>
          <p className="text-xs text-slate-500">Takes the request to the kitchen, verifies it, and delivers the food back.</p>
        </div>

        <div className={`p-4 rounded-xl border text-center ${isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center font-bold text-base mb-2">
            4
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">The Kitchen</h4>
          <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 block mb-1">Backend Server &amp; DB</span>
          <p className="text-xs text-slate-500">Prepares the food behind closed doors. Customers never enter directly.</p>
        </div>
      </div>
    </div>
  );

  // DAY 3 SLIDE 4: SQL vs NoSQL COMPARISON MATRIX
  const renderSqlVsNoSql = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SQL Relational */}
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/90 border-blue-500/30' : 'bg-blue-50/50 border-blue-200 shadow-sm'}`}>
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-blue-500/20">
            <span className="font-bold text-sm text-blue-600 dark:text-blue-400">SQL (Relational)</span>
            <Badge variant="sage" className="text-[10px]">Strict Schema</Badge>
          </div>
          <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300 leading-relaxed">
            <li><strong>Structure:</strong> Pre-defined tables, typed columns &amp; foreign keys</li>
            <li><strong>Relationships:</strong> Powerful multi-table <code className="font-mono bg-blue-100 dark:bg-blue-950 px-1 rounded">JOIN</code> queries</li>
            <li><strong>Transactions:</strong> Strict <strong>ACID</strong> compliance (never corrupts balance)</li>
            <li><strong>Scaling:</strong> Primarily vertical (larger RAM / CPU instances)</li>
            <li><strong>Examples:</strong> PostgreSQL, MySQL, CockroachDB</li>
          </ul>
        </div>

        {/* NoSQL Non-Relational */}
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/90 border-amber-500/30' : 'bg-amber-50/50 border-amber-200 shadow-sm'}`}>
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-500/20">
            <span className="font-bold text-sm text-amber-600 dark:text-amber-400">NoSQL (Non-Relational)</span>
            <Badge variant="amber" className="text-[10px]">Dynamic Schema</Badge>
          </div>
          <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300 leading-relaxed">
            <li><strong>Structure:</strong> Flexible JSON documents or key-value pairs</li>
            <li><strong>Relationships:</strong> Embedded nested sub-documents (denormalized)</li>
            <li><strong>Transactions:</strong> Eventual consistency (BASE model)</li>
            <li><strong>Scaling:</strong> Horizontal sharding across commodity clusters</li>
            <li><strong>Examples:</strong> MongoDB, DynamoDB, Redis, Cassandra</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // GENERALIZED INTELLIGENT MULTI-COLUMN SLIDE RENDERER
  const renderGeneralSlide = () => {
    const rawLines = currentSlide.content || [];
    const lines = rawLines
      .map(l => l.replace(/^#####\s*/, '').replace(/^###\s*/, '').replace(/^##\s*/, '').trim())
      .filter(l => l.length > 0 && l !== currentSlide.title.trim() && !/PM2-\d+|HSB\s*—\s*Product/i.test(l));

    // Group items into logical cards
    return (
      <div className="max-h-[460px] overflow-y-auto pr-2 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {lines.map((line, idx) => {
            const hasColon = line.includes(':') || line.includes('—') || line.includes('–');
            if (hasColon) {
              const delimiter = line.includes(':') ? ':' : line.includes('—') ? '—' : '–';
              const [head, ...tail] = line.split(delimiter);
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border ${
                    isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-sm'
                  }`}
                >
                  <span className="font-bold text-xs text-blue-600 dark:text-blue-400 block mb-1">
                    {head.trim()}
                  </span>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {tail.join(delimiter).trim()}
                  </p>
                </div>
              );
            }

            // Short Heading
            if (line.length < 40 && !line.endsWith('.')) {
              return (
                <div key={idx} className="col-span-full pt-2 pb-1 border-b border-slate-200 dark:border-slate-800">
                  <h4 className={`font-serif font-bold text-sm tracking-wide ${isDark ? 'text-amber-400' : 'text-slate-900'}`}>
                    {line}
                  </h4>
                </div>
              );
            }

            // Standard Bullet Item
            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border ${
                  isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-sm'
                }`}
              >
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {line}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Determine active slide body renderer
  const renderActiveSlideBody = () => {
    const num = currentSlide.slideNumber;
    const title = currentSlide.title.toUpperCase();

    if (num === 1) return renderSlide1();
    if (num === 2 || title.includes('AGENDA') || title.includes('ROADMAP')) return renderSlide2();
    if (title.includes('THE BIG PICTURE')) return renderSlide3();
    if (title.includes('WEB FUNDAMENTALS')) return renderSlide4();
    if (title.includes('STATE & SPEED') || title.includes('COOKIES, SESSIONS')) return renderSlide5();
    if (title.includes('FRONT-END (CONTINUED)') || num === 8) return renderSlide8();
    if (title.includes('RESTAURANT ANALOGY') || (title.includes('WHAT IS AN API') && num === 3)) return renderApiAnalogy();
    if (title.includes('SQL VS NOSQL') || title.includes('CHOOSING YOUR DATABASE')) return renderSqlVsNoSql();

    return renderGeneralSlide();
  };

  const progressPercent = Math.round(((currentIndex + 1) / totalSlides) * 100);

  return (
    <div
      className={`space-y-4 ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-2xl p-4 md:p-8 overflow-y-auto flex flex-col justify-between'
          : 'relative'
      }`}
    >
      {/* ================= PRESENTATION TOOLBAR ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-forest-900/90 border border-forest-600/40 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-forest-800 border border-lantern/30 flex items-center justify-center text-lantern shrink-0 shadow-sm">
            <Layers className="w-4 h-4 text-lantern" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-parchment">
                {presentation?.original_filename || presentation?.title || lessonTitle || 'PowerPoint Presentation'}
              </span>
              <Badge variant="amber" className="text-[10px] py-0 px-2 font-mono">
                Slide {currentIndex + 1} of {totalSlides}
              </Badge>
            </div>
            <p className="text-xs text-sage mt-0.5">
              Whole Presentation Deck · {totalSlides} Slides in Deck · {progressPercent}% Explored
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          {/* Canvas Theme Switcher */}
          <div className="flex items-center bg-forest-950/80 rounded-xl p-0.5 border border-forest-600/50">
            <button
              onClick={() => setTheme('white')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
                theme === 'white'
                  ? 'bg-forest-700 text-amber-300 shadow-sm font-semibold'
                  : 'text-sage hover:text-parchment'
              }`}
              title="Light Presentation Canvas (PowerPoint White)"
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">White Canvas</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
                theme === 'dark'
                  ? 'bg-forest-700 text-amber-300 shadow-sm font-semibold'
                  : 'text-sage hover:text-parchment'
              }`}
              title="Dark Presentation Canvas"
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Dark Canvas</span>
            </button>
          </div>

          {/* Copy Text Button */}
          <Button
            onClick={handleCopy}
            variant="ghost"
            size="sm"
            className="gap-1 text-xs text-sage hover:text-parchment"
            title="Copy Slide Text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-moss-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </Button>

          {/* Download Original File */}
          {presentation?.material_id && (
            <a
              href={`/api/materials/${presentation.material_id}/file`}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-800 hover:bg-forest-700 border border-forest-600/50 text-xs font-medium text-parchment transition-colors shadow-sm"
              title="Download original PowerPoint file"
            >
              <Download className="w-3.5 h-3.5 text-lantern" />
              <span className="hidden sm:inline">Download PPTX</span>
            </a>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-xl bg-forest-800 hover:bg-forest-700 border border-forest-600/50 text-sage hover:text-parchment transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Presentation'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-forest-900/60 rounded-full h-1.5 overflow-hidden border border-forest-700/30">
        <div
          className="bg-gradient-to-r from-blue-500 via-indigo-400 to-amber-400 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ================= 16:9 ORIGINAL PRESENTATION SLIDE CANVAS ================= */}
      <div
        className={`w-full rounded-2xl border-2 transition-all duration-300 shadow-2xl relative overflow-hidden flex flex-col justify-between p-6 sm:p-8 ${
          isDark
            ? 'bg-slate-900 border-slate-700 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        } min-h-[500px] md:min-h-[540px] max-w-full`}
      >
        {/* Slide Header */}
        <div className="pb-3 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-mono uppercase font-bold tracking-widest px-2 py-0.5 rounded ${
                isDark ? 'bg-blue-950 text-blue-400 border border-blue-800' : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {deckBadge}
              </span>
              <span className="text-xs text-slate-400 font-mono">Slide #{currentSlide.slideNumber}</span>
            </div>
            <h2 className={`text-xl sm:text-2xl md:text-3xl font-serif font-black tracking-tight leading-snug ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {currentSlide.title}
            </h2>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
              isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
            }`}>
              {currentIndex + 1} / {totalSlides}
            </span>
          </div>
        </div>

        {/* Slide Main Body (Rich Presentation Layout - Constrained so it never overflows) */}
        <div className="py-4 my-auto w-full">
          {renderActiveSlideBody()}
        </div>

        {/* Slide Footer */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-sans">
          <span className="truncate max-w-[70%]">{deckBadge}</span>
          <span className="font-mono">Wildwood Academy Presentation Deck</span>
        </div>
      </div>

      {/* ================= SLIDE STEPPER & QUICK-JUMP FILMSTRIP ================= */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Stepper Buttons */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              variant="secondary"
              size="sm"
              className="gap-1.5 text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Slide</span>
            </Button>

            <Button
              onClick={handleNext}
              disabled={currentIndex === totalSlides - 1}
              variant="primary"
              size="sm"
              className="gap-1.5 text-xs shadow-lantern"
            >
              <span>Next Slide</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Keyboard hint */}
          <span className="text-xs text-sage italic hidden sm:inline">
            Tip: Use keyboard ← and → arrow keys to navigate slides smoothly
          </span>
        </div>

        {/* Slide Quick-Jump Filmstrip (All Slides in this Deck) */}
        <div className="p-3 rounded-2xl bg-forest-900/80 border border-forest-600/40 space-y-2">
          <div className="flex items-center justify-between text-xs text-sage px-1">
            <span className="font-serif font-bold text-parchment flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-lantern" />
              Deck Filmstrip · Jump to any slide
            </span>
            <span className="font-mono text-[11px]">
              Slide {currentIndex + 1} of {totalSlides}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {slides.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono shrink-0 transition-all ${
                  idx === currentIndex
                    ? 'bg-blue-600 text-white font-bold shadow-md ring-2 ring-blue-400/40'
                    : 'bg-forest-800/80 hover:bg-forest-700 text-sage hover:text-parchment border border-forest-700/60'
                }`}
                title={`Slide ${idx + 1}: ${s.title}`}
              >
                Slide {s.slideNumber}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
