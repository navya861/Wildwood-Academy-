'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { GlitterCursor } from '../ui/GlitterCursor';
import { UserProfile } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Library, BookOpenCheck, Bot, Swords } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/auth/login');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const isAuthPage = pathname?.startsWith('/auth') || pathname === '/';

  return (
    <div className="min-h-screen bg-forest-900 text-parchment flex flex-col relative selection:bg-lantern/30 selection:text-lantern-glow">
      {/* Pixie Trail Particle Glitter Effect */}
      <GlitterCursor />

      {/* Top Navbar */}
      <Navbar user={user} onLogout={user ? handleLogout : undefined} />

      {/* Main Workspace Area */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {!isAuthPage && <Sidebar />}

        <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (for small screens) */}
      {!isAuthPage && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-forest-900/95 backdrop-blur-md border-t border-forest-600/40 z-40 flex items-center justify-around px-2">
          <Link
            href="/dashboard"
            className={`flex flex-col items-center gap-1 py-1 px-3 text-xs ${
              pathname === '/dashboard' ? 'text-lantern' : 'text-sage'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Hall</span>
          </Link>
          <Link
            href="/groves"
            className={`flex flex-col items-center gap-1 py-1 px-3 text-xs ${
              pathname === '/groves' ? 'text-lantern' : 'text-sage'
            }`}
          >
            <Library className="w-5 h-5" />
            <span>Library</span>
          </Link>
          <Link
            href="/learning"
            className={`flex flex-col items-center gap-1 py-1 px-3 text-xs ${
              pathname?.startsWith('/learning') ? 'text-lantern' : 'text-sage'
            }`}
          >
            <BookOpenCheck className="w-5 h-5" />
            <span>Courses</span>
          </Link>
          <Link
            href="/tutor"
            className={`flex flex-col items-center gap-1 py-1 px-3 text-xs ${
              pathname === '/tutor' ? 'text-lantern' : 'text-sage'
            }`}
          >
            <Bot className="w-5 h-5" />
            <span>Tutor</span>
          </Link>
          <Link
            href="/trials"
            className={`flex flex-col items-center gap-1 py-1 px-3 text-xs ${
              pathname?.startsWith('/trials') ? 'text-lantern' : 'text-sage'
            }`}
          >
            <Swords className="w-5 h-5" />
            <span>Trials</span>
          </Link>
        </div>
      )}
    </div>
  );
}
