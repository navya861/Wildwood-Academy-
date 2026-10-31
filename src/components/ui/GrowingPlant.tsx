'use client';

import React from 'react';

interface GrowingPlantProps {
  xp: number;
  level: number;
}

export function GrowingPlant({ xp, level }: GrowingPlantProps) {
  // Determine botanical growth stage
  let stage = 1;
  let stageName = 'Enchanted Seed';
  let nextThreshold = 100;
  let currentStageBase = 0;

  if (xp >= 1500) {
    stage = 5;
    stageName = 'Ancient Heartwood Tree';
    nextThreshold = 3000;
    currentStageBase = 1500;
  } else if (xp >= 700) {
    stage = 4;
    stageName = 'Moonlit Blossom';
    nextThreshold = 1500;
    currentStageBase = 700;
  } else if (xp >= 300) {
    stage = 3;
    stageName = 'Bioluminescent Fern';
    nextThreshold = 700;
    currentStageBase = 300;
  } else if (xp >= 100) {
    stage = 2;
    stageName = 'Sprouting Seedling';
    nextThreshold = 300;
    currentStageBase = 100;
  }

  const stageProgress = Math.min(100, Math.round(((xp - currentStageBase) / (nextThreshold - currentStageBase)) * 100));

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-b from-forest-800/80 to-forest-900/90 rounded-2xl border border-sage/20 shadow-forest relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-moss/20 rounded-full blur-3xl pointer-events-none" />

      {/* Botanical SVG Illustration */}
      <div className="w-48 h-48 relative flex items-center justify-center my-2">
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
          {/* Soil / Moss Mound */}
          <ellipse cx="100" cy="175" rx="65" ry="14" fill="#1A261E" stroke="#527B57" strokeWidth="2" />
          <path d="M 60 174 Q 100 168 140 174" stroke="#A7B99A" strokeWidth="2" strokeDasharray="3,3" fill="none" opacity="0.6" />

          {/* STAGE 1: Seed */}
          {stage === 1 && (
            <g className="animate-pulse">
              <ellipse cx="100" cy="170" rx="10" ry="7" fill="#DF9F3E" stroke="#F2BE64" strokeWidth="2" />
              <path d="M 100 163 Q 100 155 104 150" stroke="#8DB492" strokeWidth="3" strokeLinecap="round" fill="none" />
              <circle cx="104" cy="150" r="3" fill="#A7B99A" />
            </g>
          )}

          {/* STAGE 2: Sprout */}
          {stage === 2 && (
            <g>
              <path d="M 100 170 Q 98 140 100 120" stroke="#527B57" strokeWidth="5" strokeLinecap="round" fill="none" />
              {/* Left Leaf */}
              <path d="M 99 140 C 80 135 75 120 85 115 C 95 120 98 135 99 140" fill="#6B9870" stroke="#A7B99A" strokeWidth="1.5" />
              {/* Right Leaf */}
              <path d="M 100 130 C 120 125 125 110 115 105 C 105 110 102 125 100 130" fill="#8DB492" stroke="#FAF4E8" strokeWidth="1.5" />
              {/* Bud */}
              <circle cx="100" cy="118" r="4" fill="#F2BE64" className="animate-pulse" />
            </g>
          )}

          {/* STAGE 3: Fern */}
          {stage === 3 && (
            <g>
              {/* Stem */}
              <path d="M 100 170 Q 95 120 102 75" stroke="#446848" strokeWidth="6" strokeLinecap="round" fill="none" />
              {/* Fronds */}
              <path d="M 98 150 C 70 145 60 130 75 120 C 90 125 96 145 98 150" fill="#527B57" stroke="#A7B99A" strokeWidth="1.5" />
              <path d="M 100 140 C 130 135 140 120 125 110 C 110 115 104 135 100 140" fill="#6B9870" stroke="#A7B99A" strokeWidth="1.5" />
              <path d="M 97 115 C 75 105 70 90 85 85 C 95 90 97 105 97 115" fill="#8DB492" stroke="#FAF4E8" strokeWidth="1.5" />
              <path d="M 101 100 C 125 90 130 75 115 70 C 105 75 102 90 101 100" fill="#8DB492" stroke="#F2BE64" strokeWidth="1.5" />
              {/* Glowing Spore */}
              <circle cx="102" cy="73" r="5" fill="#FFD485" className="animate-pulse" />
            </g>
          )}

          {/* STAGE 4: Moonlit Blossom */}
          {stage === 4 && (
            <g>
              {/* Strong stem */}
              <path d="M 100 170 Q 94 110 100 65" stroke="#36533A" strokeWidth="7" strokeLinecap="round" fill="none" />
              {/* Side foliage */}
              <path d="M 98 140 C 65 130 55 110 75 100 C 90 110 97 130 98 140" fill="#527B57" stroke="#A7B99A" strokeWidth="2" />
              <path d="M 101 130 C 135 120 145 100 125 90 C 110 100 103 120 101 130" fill="#6B9870" stroke="#A7B99A" strokeWidth="2" />
              {/* Blossom Petals */}
              <g transform="translate(100, 62)">
                <ellipse cx="0" cy="-14" rx="7" ry="12" fill="#FAF4E8" stroke="#F2BE64" strokeWidth="1.5" />
                <ellipse cx="-13" cy="-4" rx="12" ry="7" fill="#FDF8ED" stroke="#F2BE64" strokeWidth="1.5" />
                <ellipse cx="13" cy="-4" rx="12" ry="7" fill="#FDF8ED" stroke="#F2BE64" strokeWidth="1.5" />
                <ellipse cx="-8" cy="10" rx="10" ry="7" fill="#F5EBD5" stroke="#F2BE64" strokeWidth="1.5" />
                <ellipse cx="8" cy="10" rx="10" ry="7" fill="#F5EBD5" stroke="#F2BE64" strokeWidth="1.5" />
                {/* Glowing Center */}
                <circle cx="0" cy="0" r="6" fill="#F2BE64" className="animate-pulse" />
              </g>
            </g>
          )}

          {/* STAGE 5: Ancient Heartwood */}
          {stage === 5 && (
            <g>
              {/* Ancient Trunk */}
              <path d="M 90 172 Q 95 120 85 85 Q 100 75 115 85 Q 105 120 110 172 Z" fill="#26372C" stroke="#527B57" strokeWidth="2" />
              {/* Canopy Foliage */}
              <circle cx="70" cy="75" r="28" fill="#36533A" stroke="#527B57" strokeWidth="2" />
              <circle cx="130" cy="75" r="28" fill="#446848" stroke="#527B57" strokeWidth="2" />
              <circle cx="100" cy="55" r="32" fill="#527B57" stroke="#A7B99A" strokeWidth="2" />
              <circle cx="100" cy="70" r="24" fill="#6B9870" opacity="0.8" />
              {/* Heartwood Rune Glow */}
              <circle cx="100" cy="115" r="5" fill="#F2BE64" className="animate-pulse" />
              <circle cx="85" cy="65" r="3" fill="#FFD485" className="animate-pulse" />
              <circle cx="115" cy="60" r="3" fill="#FFD485" className="animate-pulse" />
              <circle cx="100" cy="40" r="3" fill="#FFD485" className="animate-pulse" />
            </g>
          )}

          {/* Floating Fireflies */}
          <circle cx="55" cy="90" r="2.5" fill="#F2BE64" className="animate-pulse" />
          <circle cx="145" cy="105" r="2" fill="#FFD485" className="animate-pulse" />
        </svg>
      </div>

      {/* Plant Stage Info */}
      <div className="text-center mt-2 z-10">
        <h4 className="text-base font-semibold text-parchment font-serif">{stageName}</h4>
        <p className="text-xs text-sage mt-0.5">Circle {level} Growth · {xp} Total Lore XP</p>
      </div>

      {/* Progress to next botanical form */}
      <div className="w-full mt-4 z-10">
        <div className="flex justify-between text-[11px] text-sage/80 mb-1">
          <span>Current Growth</span>
          <span>{stageProgress}% to next form</span>
        </div>
        <div className="w-full bg-forest-900 h-2 rounded-full overflow-hidden border border-forest-600/50">
          <div
            className="bg-gradient-to-r from-moss via-sage to-lantern h-full transition-all duration-500 rounded-full"
            style={{ width: `${stageProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
