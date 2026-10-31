'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Flame, Compass, User, LogOut } from 'lucide-react';
import { UserProfile } from '@/lib/types';

interface NavbarProps {
  user?: UserProfile | null;
  onLogout?: () => void;
}

export function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <header className="h-16 border-b border-forest-600/30 bg-forest-900/90 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-forest-700/80 border border-lantern/40 flex items-center justify-center text-lantern shadow-lantern group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-lantern" />
          </div>
          <div>
            <span className="font-serif text-lg font-bold text-parchment tracking-wide group-hover:text-lantern transition-colors">
              Wildwood
            </span>
            <span className="text-xs uppercase tracking-widest text-sage block -mt-1 font-mono">
              Academy
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            {/* Streak Counter */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-800/80 border border-amber-600/30 text-amber-300 text-xs font-semibold">
              <Flame className="w-4 h-4 text-lantern fill-lantern animate-pulse" />
              <span>{user.streak_days || 1} Day Streak</span>
            </div>

            {/* Level & XP Capsule */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-forest-800/90 border border-sage/30 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-lantern" />
              <span className="font-bold text-parchment">Circle {user.level || 1}</span>
              <span className="text-sage font-mono text-[11px]">{user.xp || 0} XP</span>
            </div>

            {/* Scholar Avatar & Name */}
            <Link
              href="/settings"
              className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full hover:bg-forest-800 border border-transparent hover:border-forest-600/50 transition-all text-xs"
            >
              <div className="w-7 h-7 rounded-full bg-forest-700 border border-lantern/40 flex items-center justify-center text-parchment font-bold text-xs">
                {user.display_name?.charAt(0).toUpperCase() || 'S'}
              </div>
              <span className="hidden md:inline font-medium text-parchment">
                {user.display_name}
              </span>
            </Link>

            {/* Logout button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-sage hover:text-parchment hover:bg-forest-800 transition-colors"
                title="Depart Academy (Sign Out)"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-xs font-semibold text-parchment hover:text-lantern px-3 py-1.5 rounded-lg transition-colors"
            >
              Enter Academy
            </Link>
            <Link
              href="/auth/signup"
              className="text-xs font-semibold bg-lantern text-ink hover:bg-lantern-glow px-4 py-1.5 rounded-lg transition-all shadow-lantern"
            >
              Register Scholar
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
