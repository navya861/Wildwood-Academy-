'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, BookOpen, Feather, Compass } from 'lucide-react';

interface WoodlandSceneProps {
  variant?: 'hero' | 'compact' | 'header';
  title?: string;
  subtitle?: string;
  showExploreButtons?: boolean;
}

export function WoodlandScene({
  variant = 'hero',
  title,
  subtitle,
  showExploreButtons = false,
}: WoodlandSceneProps) {
  const [activeFairy, setActiveFairy] = useState<number | null>(null);

  const isCompact = variant === 'compact';
  const isHeader = variant === 'header';

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-forest-600/40 shadow-2xl bg-gradient-to-b from-[#0A1F17] via-[#102D22] to-[#173F30] ${
        isCompact ? 'min-h-[260px]' : isHeader ? 'min-h-[300px]' : 'min-h-[460px] md:min-h-[520px]'
      }`}
    >
      {/* ================= SVG WOODLAND ARTWORK ================= */}
      <svg
        viewBox="0 0 1200 600"
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Ambient sky gradients */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#081812" />
            <stop offset="45%" stopColor="#112C22" />
            <stop offset="85%" stopColor="#1B4535" />
            <stop offset="100%" stopColor="#255844" />
          </linearGradient>

          {/* Golden Sunbeams & Canopy Light */}
          <linearGradient id="sunbeamGrad" x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor="#F2BE64" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#F2BE64" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#527B57" stopOpacity="0" />
          </linearGradient>

          {/* Atmospheric Mist Gradients */}
          <linearGradient id="mistGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#527B57" stopOpacity="0" />
            <stop offset="35%" stopColor="#8DB492" stopOpacity="0.18" />
            <stop offset="65%" stopColor="#A7B99A" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#527B57" stopOpacity="0" />
          </linearGradient>

          {/* Cottage Moss Roof Gradient */}
          <linearGradient id="mossRoofGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3C5C40" />
            <stop offset="40%" stopColor="#527B57" />
            <stop offset="80%" stopColor="#6E9A73" />
            <stop offset="100%" stopColor="#36533A" />
          </linearGradient>

          {/* Cottage Timber Log Gradient */}
          <linearGradient id="logWallGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4A3423" />
            <stop offset="30%" stopColor="#5D432D" />
            <stop offset="70%" stopColor="#3A281A" />
            <stop offset="100%" stopColor="#261A11" />
          </linearGradient>

          {/* Cozy Window & Lantern Glow */}
          <radialGradient id="windowGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF2D1" />
            <stop offset="35%" stopColor="#F7C86A" />
            <stop offset="70%" stopColor="#E29A33" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#B36512" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="lanternHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFBE6" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#F2BE64" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#E29A33" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F2BE64" stopOpacity="0" />
          </radialGradient>

          {/* Firefly Light Aura */}
          <radialGradient id="fireflyAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#F6D178" />
            <stop offset="70%" stopColor="#A8D68B" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#527B57" stopOpacity="0" />
          </radialGradient>

          {/* Pixie Fairy Glow */}
          <radialGradient id="pixieGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#FFEFBE" />
            <stop offset="75%" stopColor="#8EE3B8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8EE3B8" stopOpacity="0" />
          </radialGradient>

          {/* Fairy Wing Translucency */}
          <linearGradient id="fairyWingGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#C4F4DC" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#FFDE8A" stopOpacity="0.25" />
          </linearGradient>

          {/* Winding Cobblestone / Dirt Path */}
          <linearGradient id="pathGrad" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#304134" />
            <stop offset="40%" stopColor="#4A5644" />
            <stop offset="70%" stopColor="#616752" />
            <stop offset="100%" stopColor="#3A4638" />
          </linearGradient>

          {/* Animated styles */}
          <style>{`
            @keyframes fairyHover {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-10px) rotate(2deg); }
            }
            @keyframes wingFlutter {
              0%, 100% { transform: scaleX(1) scaleY(1); }
              50% { transform: scaleX(0.4) scaleY(0.9); }
            }
            @keyframes fireflyPulse {
              0%, 100% { opacity: 0.35; transform: scale(0.85) translate(0px, 0px); }
              50% { opacity: 1; transform: scale(1.25) translate(4px, -6px); }
            }
            @keyframes fireflyPulseAlt {
              0%, 100% { opacity: 0.9; transform: scale(1.2) translate(-3px, 2px); }
              50% { opacity: 0.25; transform: scale(0.7) translate(5px, -8px); }
            }
            @keyframes smokeDrift {
              0% { opacity: 0.7; transform: translateY(0) scale(1); }
              50% { opacity: 0.4; transform: translateY(-18px) translateX(6px) scale(1.3); }
              100% { opacity: 0; transform: translateY(-38px) translateX(12px) scale(1.7); }
            }
            @keyframes windowPulse {
              0%, 100% { opacity: 0.88; }
              50% { opacity: 1; }
            }
            @keyframes sunbeamShift {
              0%, 100% { opacity: 0.65; }
              50% { opacity: 0.95; }
            }
            .fairy-hover-1 { animation: fairyHover 4.2s ease-in-out infinite; transform-origin: 320px 310px; }
            .fairy-hover-2 { animation: fairyHover 3.6s ease-in-out infinite 1.2s; transform-origin: 860px 240px; }
            .fairy-hover-3 { animation: fairyHover 4.8s ease-in-out infinite 0.7s; transform-origin: 640px 180px; }
            .wing-l { animation: wingFlutter 0.18s ease-in-out infinite alternate; transform-origin: center right; }
            .wing-r { animation: wingFlutter 0.18s ease-in-out infinite alternate; transform-origin: center left; }
            .firefly-p1 { animation: fireflyPulse 3.8s ease-in-out infinite; }
            .firefly-p2 { animation: fireflyPulseAlt 4.4s ease-in-out infinite 1.1s; }
            .firefly-p3 { animation: fireflyPulse 3.2s ease-in-out infinite 0.5s; }
            .firefly-p4 { animation: fireflyPulseAlt 4.9s ease-in-out infinite 2s; }
            .smoke-p1 { animation: smokeDrift 4.5s ease-out infinite; }
            .smoke-p2 { animation: smokeDrift 4.5s ease-out infinite 2.2s; }
            .window-glow { animation: windowPulse 4s ease-in-out infinite; }
            .sunbeam { animation: sunbeamShift 7s ease-in-out infinite; }
          `}</style>
        </defs>

        {/* 1. SKY / FOREST BACKGROUND BASE */}
        <rect width="1200" height="600" fill="url(#skyGrad)" />

        {/* 2. ATMOSPHERIC SUNBEAMS / GOD RAYS FILTERING THROUGH CANOPY */}
        <g className="sunbeam" opacity="0.8">
          <polygon points="120,0 260,0 440,600 240,600" fill="url(#sunbeamGrad)" />
          <polygon points="380,0 520,0 740,600 560,600" fill="url(#sunbeamGrad)" opacity="0.7" />
          <polygon points="760,0 890,0 1080,600 920,600" fill="url(#sunbeamGrad)" opacity="0.85" />
          <polygon points="980,0 1100,0 1200,500 1140,600" fill="url(#sunbeamGrad)" opacity="0.5" />
        </g>

        {/* 3. DISTANT MOUNTAIN / DEEP FOREST SILHOUETTES */}
        <path
          d="M0 320 Q180 260 360 290 T720 270 T1080 290 Q1160 300 1200 310 L1200 600 L0 600 Z"
          fill="#0C2018"
          opacity="0.9"
        />

        {/* 4. TALL BACKGROUND PINE & OAK TREES (LAYER 1 - Deep Forest) */}
        <g fill="#0E271D" opacity="0.95">
          {/* Left tall pines */}
          <polygon points="60,340 45,220 30,220 50,150 40,150 55,90 70,150 60,150 80,220 65,220" />
          <polygon points="120,360 105,240 90,240 110,170 100,170 118,110 135,170 125,170 145,240 130,240" />
          <polygon points="190,380 175,260 160,260 180,190 170,190 188,130 205,190 195,190 215,260 200,260" />

          {/* Right tall pines */}
          <polygon points="990,370 975,250 960,250 980,180 970,180 988,115 1005,180 995,180 1015,250 1000,250" />
          <polygon points="1060,350 1045,230 1030,230 1050,160 1040,160 1058,95 1075,160 1065,160 1085,230 1070,230" />
          <polygon points="1140,360 1125,240 1110,240 1130,170 1120,170 1138,105 1155,170 1145,170 1165,240 1150,240" />

          {/* Center distant trees behind hut */}
          <circle cx="480" cy="270" r="65" fill="#113124" />
          <circle cx="560" cy="250" r="75" fill="#133628" />
          <circle cx="650" cy="265" r="70" fill="#113124" />
          <circle cx="730" cy="280" r="60" fill="#0F2B20" />
        </g>

        {/* 5. ATMOSPHERIC DRIFTING MIST LAYER */}
        <ellipse cx="600" cy="380" rx="550" ry="45" fill="url(#mistGrad)" />
        <ellipse cx="300" cy="420" rx="350" ry="30" fill="url(#mistGrad)" />
        <ellipse cx="900" cy="400" rx="320" ry="25" fill="url(#mistGrad)" />

        {/* 6. MIDGROUND CANOPY & ROLLING FOREST GROUND */}
        <path
          d="M0 430 Q220 380 460 410 Q700 440 940 405 Q1080 390 1200 420 L1200 600 L0 600 Z"
          fill="#153B2D"
        />

        {/* 7. WINDING COBBLESTONE & DIRT PATH TO THE HUT */}
        <path
          d="M 520 600 Q 560 520 545 470 Q 535 435 550 415 L 585 415 Q 575 440 595 480 Q 625 540 680 600 Z"
          fill="url(#pathGrad)"
          opacity="0.95"
        />
        {/* Cobblestones along path */}
        <g fill="#455447" opacity="0.6">
          <ellipse cx="565" cy="560" rx="14" ry="7" />
          <ellipse cx="610" cy="575" rx="16" ry="8" />
          <ellipse cx="550" cy="510" rx="11" ry="6" />
          <ellipse cx="580" cy="495" rx="12" ry="5" />
          <ellipse cx="545" cy="455" rx="9" ry="4" />
          <ellipse cx="568" cy="435" rx="8" ry="4" />
        </g>

        {/* 8. THE WOODLAND STUDY HUT (Prominent Centerpiece) */}
        <g id="woodlandHut" transform="translate(430, 240)">
          {/* Stone Foundation */}
          <rect x="70" y="170" width="180" height="25" rx="4" fill="#3D4B42" />
          <path d="M65 192 L255 192 L260 200 L60 200 Z" fill="#28342C" />

          {/* Wooden Timber Log Walls */}
          <rect x="75" y="85" width="170" height="95" rx="3" fill="url(#logWallGrad)" />
          {/* Log siding lines */}
          <line x1="75" y1="102" x2="245" y2="102" stroke="#2B1D13" strokeWidth="2" opacity="0.75" />
          <line x1="75" y1="120" x2="245" y2="120" stroke="#2B1D13" strokeWidth="2" opacity="0.75" />
          <line x1="75" y1="138" x2="245" y2="138" stroke="#2B1D13" strokeWidth="2" opacity="0.75" />
          <line x1="75" y1="156" x2="245" y2="156" stroke="#2B1D13" strokeWidth="2" opacity="0.75" />

          {/* Stone Chimney on left roof */}
          <rect x="92" y="5" width="26" height="55" fill="#4B564E" rx="2" />
          <rect x="89" y="3" width="32" height="7" fill="#626F66" rx="2" />
          {/* Chimney Smoke Curling Gently Upwards */}
          <g>
            <circle cx="105" cy="-8" r="7" fill="#CAD8CE" className="smoke-p1" opacity="0.6" />
            <circle cx="111" cy="-20" r="11" fill="#CAD8CE" className="smoke-p2" opacity="0.4" />
            <circle cx="118" cy="-35" r="15" fill="#CAD8CE" className="smoke-p1" opacity="0.25" />
          </g>

          {/* Moss-Covered Fairytale Thatch Roof */}
          <polygon
            points="50,92 160,-5 270,92"
            fill="url(#mossRoofGrad)"
            stroke="#263E2B"
            strokeWidth="3"
          />
          {/* Overhanging thatch & moss patches */}
          <path
            d="M 45 92 Q 60 100 80 94 Q 105 102 135 93 Q 160 104 190 94 Q 220 102 245 93 Q 265 101 275 92 L 265 84 L 55 84 Z"
            fill="#6E9A73"
          />
          {/* Roof dormer window with warm glow */}
          <polygon points="142,35 160,18 178,35" fill="#3D291A" />
          <rect x="145" y="34" width="30" height="20" rx="3" fill="#1C140D" />
          <circle cx="160" cy="44" r="8" fill="url(#windowGlow)" className="window-glow" />

          {/* Cozy Glowing Main Window (Right) */}
          <g transform="translate(182, 105)">
            {/* Wooden frame */}
            <rect x="-3" y="-3" width="46" height="52" rx="4" fill="#2E1F14" />
            {/* Window glass with warm amber light */}
            <rect x="0" y="0" width="40" height="46" rx="3" fill="url(#windowGlow)" className="window-glow" />
            {/* Window panes */}
            <line x1="20" y1="0" x2="20" y2="46" stroke="#4A3423" strokeWidth="2.5" />
            <line x1="0" y1="23" x2="40" y2="23" stroke="#4A3423" strokeWidth="2.5" />
            {/* Flowing window bloom */}
            <circle cx="20" cy="23" r="32" fill="url(#lanternHalo)" opacity="0.4" pointerEvents="none" />
          </g>

          {/* Arched Wooden Study Door (Center-Left) */}
          <g transform="translate(100, 102)">
            <path
              d="M 0 78 L 0 24 Q 0 0 24 0 Q 48 0 48 24 L 48 78 Z"
              fill="#2A1B10"
              stroke="#1C120B"
              strokeWidth="2"
            />
            {/* Door plank lines */}
            <path d="M 12 78 L 12 6 Q 24 2 24 2" stroke="#1C120B" strokeWidth="1.5" fill="none" />
            <path d="M 24 78 L 24 2" stroke="#1C120B" strokeWidth="1.5" />
            <path d="M 36 78 L 36 6 Q 24 2 24 2" stroke="#1C120B" strokeWidth="1.5" fill="none" />
            {/* Golden Door Handle & Knocker */}
            <circle cx="40" cy="45" r="3" fill="#F2BE64" />
            <circle cx="24" cy="28" r="4" fill="none" stroke="#F2BE64" strokeWidth="1.5" />
          </g>

          {/* Hanging Scholar Lantern Beside Door */}
          <g transform="translate(156, 108)">
            {/* Bracket */}
            <path d="M -8 4 L 4 4 L 4 10" stroke="#1A1A1A" strokeWidth="2" fill="none" />
            {/* Lantern Cap */}
            <polygon points="0,10 8,10 10,13 -2,13" fill="#2E2419" />
            {/* Lantern Glass & Core Light */}
            <rect x="0" y="13" width="8" height="12" rx="1" fill="#FFF2D1" />
            <circle cx="4" cy="19" r="24" fill="url(#lanternHalo)" opacity="0.85" className="firefly-p1" />
            {/* Lantern Base */}
            <polygon points="-1,25 9,25 7,27 1,27" fill="#2E2419" />
          </g>

          {/* Cottage Flower Vines & Ivy Climbing Walls */}
          <path
            d="M 72 175 Q 68 140 76 110 Q 72 90 75 75"
            stroke="#4A754E"
            strokeWidth="3"
            fill="none"
          />
          {/* Ivy leaves & blossoms */}
          <circle cx="71" cy="160" r="3.5" fill="#6EA373" />
          <circle cx="77" cy="142" r="4" fill="#527B57" />
          <circle cx="73" cy="120" r="3" fill="#8DB492" />
          <circle cx="76" cy="100" r="3.5" fill="#F2BE64" />
          <circle cx="78" cy="82" r="3" fill="#FFB7B2" />

          {/* Wild Woodland Mushrooms at Cottage Footing */}
          <g transform="translate(68, 178)">
            {/* Red & white fairytale amanita mushroom */}
            <path d="M 0 10 Q 7 -3 14 10 Z" fill="#D64545" />
            <rect x="5" y="10" width="4" height="7" fill="#EADCC2" rx="1" />
            <circle cx="4" cy="4" r="1" fill="#FFFFFF" />
            <circle cx="10" cy="5" r="1.2" fill="#FFFFFF" />
            <circle cx="7" cy="2" r="1" fill="#FFFFFF" />

            {/* Glowing magic moss mushrooms */}
            <path d="M 17 12 Q 22 2 27 12 Z" fill="#69C289" opacity="0.9" />
            <rect x="21" y="12" width="2.5" height="5" fill="#EADCC2" rx="1" />
            <circle cx="22" cy="7" r="8" fill="url(#fireflyAura)" opacity="0.5" className="firefly-p2" />
          </g>
        </g>

        {/* 9. FOREGROUND FOLIAGE, FERNS & ENCHANTED PLANTS */}
        <g fill="#184333">
          {/* Left large forest trees framing view */}
          <path d="M-40 600 L-20 200 Q20 300 0 600 Z" fill="#1C140D" />
          <path
            d="M-50 260 Q40 210 120 250 Q160 270 210 240 Q170 310 90 320 Q20 340 -50 300 Z"
            fill="#123526"
          />
          <path
            d="M-20 180 Q80 130 180 170 Q240 190 290 160 Q230 240 140 240 Q40 250 -20 210 Z"
            fill="#1A4735"
          />

          {/* Right large framing tree & canopy */}
          <path d="M1240 600 L1210 190 Q1170 320 1200 600 Z" fill="#1C140D" />
          <path
            d="M1250 240 Q1140 190 1050 230 Q990 260 920 220 Q980 300 1080 300 Q1160 320 1250 280 Z"
            fill="#123526"
          />
          <path
            d="M1220 150 Q1110 100 1000 140 Q940 160 880 130 Q950 210 1050 210 Q1140 220 1220 180 Z"
            fill="#1A4735"
          />

          {/* Foreground ferns at base */}
          <path
            d="M 40 600 Q 110 520 190 530 Q 150 560 90 600 Z"
            fill="#1A4A36"
          />
          <path
            d="M 120 600 Q 190 500 280 520 Q 220 570 170 600 Z"
            fill="#235A42"
          />
          <path
            d="M 980 600 Q 1040 510 1140 530 Q 1080 570 1020 600 Z"
            fill="#1A4A36"
          />
          <path
            d="M 870 600 Q 940 520 1030 540 Q 980 575 920 600 Z"
            fill="#235A42"
          />
        </g>

        {/* 10. TINY HOVERING PIXIE FAIRIES (3 Delicate Woodland Fairies) */}
        {/* Fairy 1: Near the study hut porch with lantern */}
        <g className="fairy-hover-1" id="fairy1" style={{ cursor: 'pointer' }} pointerEvents="auto">
          {/* Fairy Aura Glow */}
          <circle cx="370" cy="360" r="28" fill="url(#pixieGlow)" opacity="0.75" />
          {/* Wings Left & Right with Flutter */}
          <g transform="translate(370, 358)">
            <ellipse cx="-12" cy="-6" rx="14" ry="7" fill="url(#fairyWingGrad)" className="wing-l" transform="rotate(-20)" />
            <ellipse cx="-10" cy="5" rx="10" ry="5" fill="url(#fairyWingGrad)" className="wing-l" transform="rotate(15)" />
            <ellipse cx="12" cy="-6" rx="14" ry="7" fill="url(#fairyWingGrad)" className="wing-r" transform="rotate(20)" />
            <ellipse cx="10" cy="5" rx="10" ry="5" fill="url(#fairyWingGrad)" className="wing-r" transform="rotate(-15)" />
            {/* Tiny delicate fairy silhouette */}
            <circle cx="0" cy="-6" r="3" fill="#FFFBE6" />
            <path d="M -2 -3 L 2 -3 L 3 6 L -3 6 Z" fill="#FFEFBE" />
            <circle cx="0" cy="8" r="1.5" fill="#FFFBE6" />
          </g>
          {/* Fairy Sparkle Trail */}
          <circle cx="362" cy="374" r="1.5" fill="#F2BE64" opacity="0.8" />
          <circle cx="356" cy="382" r="1" fill="#FFFFFF" opacity="0.6" />
        </g>

        {/* Fairy 2: Hovering over the winding flower path */}
        <g className="fairy-hover-2" id="fairy2" pointerEvents="auto">
          <circle cx="820" cy="380" r="26" fill="url(#pixieGlow)" opacity="0.7" />
          <g transform="translate(820, 378)">
            <ellipse cx="-11" cy="-5" rx="13" ry="6" fill="url(#fairyWingGrad)" className="wing-l" transform="rotate(-25)" />
            <ellipse cx="11" cy="-5" rx="13" ry="6" fill="url(#fairyWingGrad)" className="wing-r" transform="rotate(25)" />
            <circle cx="0" cy="-5" r="2.8" fill="#FFFBE6" />
            <path d="M -2 -2 L 2 -2 L 2.5 5 L -2.5 5 Z" fill="#FFEFBE" />
          </g>
          <circle cx="828" cy="392" r="1.5" fill="#F2BE64" opacity="0.8" />
          <circle cx="835" cy="400" r="1" fill="#8EE3B8" opacity="0.7" />
        </g>

        {/* Fairy 3: Up in the enchanted mossy branches */}
        <g className="fairy-hover-3" id="fairy3" pointerEvents="auto">
          <circle cx="680" cy="180" r="24" fill="url(#pixieGlow)" opacity="0.65" />
          <g transform="translate(680, 178)">
            <ellipse cx="-10" cy="-5" rx="12" ry="5.5" fill="url(#fairyWingGrad)" className="wing-l" transform="rotate(-20)" />
            <ellipse cx="10" cy="-5" rx="12" ry="5.5" fill="url(#fairyWingGrad)" className="wing-r" transform="rotate(20)" />
            <circle cx="0" cy="-5" r="2.5" fill="#FFFBE6" />
            <path d="M -1.8 -2 L 1.8 -2 L 2 4.5 L -2 4.5 Z" fill="#FFEFBE" />
          </g>
          <circle cx="673" cy="192" r="1.2" fill="#F2BE64" opacity="0.8" />
        </g>

        {/* 11. MAGICAL PULSING FIREFLIES (Scattered warm golden-green glows) */}
        {/* Firefly cluster 1 (Left forest) */}
        <g className="firefly-p1">
          <circle cx="160" cy="420" r="3.2" fill="#FFFFFF" />
          <circle cx="160" cy="420" r="16" fill="url(#fireflyAura)" />
        </g>
        <g className="firefly-p2">
          <circle cx="240" cy="360" r="2.6" fill="#FFF9D2" />
          <circle cx="240" cy="360" r="14" fill="url(#fireflyAura)" />
        </g>
        <g className="firefly-p3">
          <circle cx="290" cy="480" r="3" fill="#FFFFFF" />
          <circle cx="290" cy="480" r="15" fill="url(#fireflyAura)" />
        </g>

        {/* Firefly cluster 2 (Near the cottage path) */}
        <g className="firefly-p4">
          <circle cx="490" cy="460" r="3.5" fill="#FFFFFF" />
          <circle cx="490" cy="460" r="18" fill="url(#fireflyAura)" />
        </g>
        <g className="firefly-p1">
          <circle cx="640" cy="480" r="2.8" fill="#FFF4C0" />
          <circle cx="640" cy="480" r="15" fill="url(#fireflyAura)" />
        </g>
        <g className="firefly-p2">
          <circle cx="710" cy="430" r="3.2" fill="#FFFFFF" />
          <circle cx="710" cy="430" r="16" fill="url(#fireflyAura)" />
        </g>

        {/* Firefly cluster 3 (Right forest canopy) */}
        <g className="firefly-p3">
          <circle cx="940" cy="330" r="2.8" fill="#FFFFFF" />
          <circle cx="940" cy="330" r="15" fill="url(#fireflyAura)" />
        </g>
        <g className="firefly-p4">
          <circle cx="1020" cy="440" r="3.4" fill="#FFF8C8" />
          <circle cx="1020" cy="440" r="17" fill="url(#fireflyAura)" />
        </g>
        <g className="firefly-p1">
          <circle cx="1110" cy="370" r="2.5" fill="#FFFFFF" />
          <circle cx="1110" cy="370" r="13" fill="url(#fireflyAura)" />
        </g>
      </svg>

      {/* ================= OVERLAY CONTENT (Text, badges & CTAs) ================= */}
      <div className="relative z-10 flex flex-col justify-end p-6 md:p-10 min-h-full">
        {/* Top Floating Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900/85 backdrop-blur-md border border-lantern/40 text-lantern text-xs font-semibold shadow-lantern animate-float-gentle">
            <Sparkles className="w-3.5 h-3.5 text-lantern" />
            <span>Wildwood Academy · Scholar&apos;s Grove</span>
          </span>
        </div>

        {/* Scene Title & Storybook Narrative */}
        <div className="max-w-2xl bg-forest-900/60 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-forest-600/30">
          <h2 className="text-2xl md:text-4xl font-serif font-extrabold text-parchment leading-tight drop-shadow-md">
            {title || 'The Enchanted Woodland Study Cottage'}
          </h2>
          <p className="mt-2 text-xs md:text-sm text-sage-light leading-relaxed drop-shadow">
            {subtitle ||
              'Step across the winding cobblestone path into the study cottage. Warm lanterns illuminate ancient scrolls, fairies hover in the canopy, and fireflies dance among the pines.'}
          </p>

          {/* Optional Action Shortcuts */}
          {showExploreButtons && (
            <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-forest-600/30">
              <Link
                href="/groves"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 border border-forest-600/50 hover:border-lantern/50 text-xs font-medium text-parchment transition-all hover:scale-[1.02]"
              >
                <BookOpen className="w-3.5 h-3.5 text-lantern" />
                <span>Woodland Library</span>
              </Link>
              <Link
                href="/tutor"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 border border-forest-600/50 hover:border-lantern/50 text-xs font-medium text-parchment transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-3.5 h-3.5 text-lantern" />
                <span>Forest Guide Tutor</span>
              </Link>
              <Link
                href="/scribe"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 border border-forest-600/50 hover:border-lantern/50 text-xs font-medium text-parchment transition-all hover:scale-[1.02]"
              >
                <Feather className="w-3.5 h-3.5 text-lantern" />
                <span>Scribe&apos;s Corner</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
