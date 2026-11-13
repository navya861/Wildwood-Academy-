'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Library,
  BookOpenCheck,
  Bot,
  Feather,
  Swords,
  Sprout,
  Sparkles,
  Settings,
} from 'lucide-react';
import { clsx } from 'clsx';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Academy Hall', sub: 'Dashboard', icon: LayoutDashboard },
  { href: '/groves', label: 'Woodland Library', sub: 'Materials & Uploads', icon: Library },
  { href: '/learning', label: 'Learning Paths', sub: 'Courses & Lessons', icon: BookOpenCheck },
  { href: '/tutor', label: 'The Forest Guide', sub: 'AI Tutor & RAG', icon: Bot },
  { href: '/scribe', label: "Scribe's Corner", sub: 'Study Notes & Cards', icon: Feather },
  { href: '/trials', label: 'The Trial Grounds', sub: 'Quizzes & Grading', icon: Swords },
  { href: '/journal', label: 'Growth Journal', sub: 'Progress & Plant', icon: Sprout },
  { href: '/clearing', label: 'Enchanted Clearing', sub: 'Firefly Quest Game', icon: Sparkles },
  { href: '/settings', label: 'Academy Settings', sub: 'Profile & Lore', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 hidden lg:flex flex-col border-r border-forest-600/30 bg-[#0D241B]/75 backdrop-blur-md p-4 shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="text-xs uppercase font-mono tracking-wider text-sage/70 px-3 py-2">
        Academic Groves
      </div>

      <nav className="space-y-1.5 flex-1 mt-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group relative',
                isActive
                  ? 'bg-forest-700/80 text-parchment font-semibold border border-lantern/30 shadow-sm'
                  : 'text-sage hover:text-parchment hover:bg-forest-800/50'
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-lantern rounded-r-full shadow-lantern" />
              )}
              <Icon
                className={clsx(
                  'w-5 h-5 shrink-0 transition-transform group-hover:scale-110',
                  isActive ? 'text-lantern' : 'text-sage group-hover:text-lantern'
                )}
              />
              <div className="flex flex-col min-w-0">
                <span className="truncate leading-tight">{item.label}</span>
                <span className="text-[11px] text-sage/60 truncate font-sans">
                  {item.sub}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Decorative Woodland Accent Box */}
      <div className="mt-auto pt-4 border-t border-forest-600/20">
        <div className="p-3 rounded-xl bg-forest-800/40 border border-forest-600/30 text-xs text-sage/90">
          <p className="font-serif text-parchment font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-lantern" />
            Woodland Wisdom
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-sage/80 italic">
            &ldquo;Knowledge gathered in the groves flourishes when shared with the guide.&rdquo;
          </p>
        </div>
      </div>
    </aside>
  );
}
