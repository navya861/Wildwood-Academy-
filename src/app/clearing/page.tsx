'use client';

import React from 'react';
import { Sparkles, Flame, ShieldCheck } from 'lucide-react';
import { FireflyQuestGame } from '@/components/game/FireflyQuestGame';
import { Badge } from '@/components/ui/Card';

export default function EnchantedClearingPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="amber" className="gap-1 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-lantern" />
            Enchanted Clearing
          </Badge>
        </div>
        <h1 className="text-3xl font-serif font-bold text-parchment">
          Firefly Quest
        </h1>
        <p className="text-xs md:text-sm text-sage mt-1">
          Guide your wandering creature along the twilight trail. Answer questions drawn from your study scrolls to gather fireflies and earn server-validated Lore XP!
        </p>
      </div>

      <FireflyQuestGame />

      {/* Fair Play & Integrity Banner */}
      <div className="p-4 rounded-2xl bg-forest-900/60 border border-forest-700/40 flex items-center justify-between text-xs text-sage">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-moss-400 shrink-0" />
          <span>Scores and firefly rewards are strictly verified on the backend against active question sets.</span>
        </div>
      </div>
    </div>
  );
}
