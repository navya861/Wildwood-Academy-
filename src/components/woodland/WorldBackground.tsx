'use client';

import React from 'react';

export function WorldBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ================= SVG ENCHANTED WOODLAND WORLD ================= */}
      <svg
        viewBox="0 0 1920 1080"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Sky Gradient */}
          <linearGradient id="worldSkyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#05120C" />
            <stop offset="35%" stopColor="#0A2016" />
            <stop offset="70%" stopColor="#0F2E20" />
            <stop offset="100%" stopColor="#153E2C" />
          </linearGradient>

          {/* Distant Mountains & Castle Mist */}
          <linearGradient id="mistLayerGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#527B57" stopOpacity="0" />
            <stop offset="30%" stopColor="#7EAA83" stopOpacity="0.12" />
            <stop offset="65%" stopColor="#A7B99A" stopOpacity="0.09" />
            <stop offset="100%" stopColor="#527B57" stopOpacity="0" />
          </linearGradient>

          {/* Sunbeams / Moonlight Starlight Rays */}
          <linearGradient id="rayGrad" x1="0" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#F2BE64" stopOpacity="0.16" />
            <stop offset="45%" stopColor="#8DB492" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#173F30" stopOpacity="0" />
          </linearGradient>

          {/* Castle Stone Gradient */}
          <linearGradient id="castleStone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A2D23" />
            <stop offset="50%" stopColor="#14241C" />
            <stop offset="100%" stopColor="#0E1A14" />
          </linearGradient>

          {/* Castle Roof Spire Gradient */}
          <linearGradient id="spireGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3E6144" />
            <stop offset="50%" stopColor="#2D4732" />
            <stop offset="100%" stopColor="#1B2D20" />
          </linearGradient>

          {/* Window Warm Amber Glow */}
          <radialGradient id="amberGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF8E0" />
            <stop offset="35%" stopColor="#F7C86A" />
            <stop offset="75%" stopColor="#D48E28" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#B36512" stopOpacity="0" />
          </radialGradient>

          {/* Dragonfly Wing Iridescence */}
          <linearGradient id="dragonflyWingGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E0FFFF" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#7FFFD4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#F2BE64" stopOpacity="0.3" />
          </linearGradient>

          {/* Dragonfly Body Glow */}
          <linearGradient id="dragonflyBodyGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38E5B0" />
            <stop offset="50%" stopColor="#48D1CC" />
            <stop offset="100%" stopColor="#2E8B57" />
          </linearGradient>

          {/* Firefly Light Aura */}
          <radialGradient id="fireflyHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#F6D178" />
            <stop offset="70%" stopColor="#8EE3B8" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#527B57" stopOpacity="0" />
          </radialGradient>

          {/* Animation Keyframes */}
          <style>{`
            @keyframes dfWingFlutter {
              0%, 100% { transform: scaleX(1) scaleY(1); }
              50% { transform: scaleX(0.25) scaleY(0.9); }
            }
            @keyframes dfHover1 {
              0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
              25% { transform: translate(35px, -20px) rotate(4deg); }
              50% { transform: translate(70px, -5px) rotate(-2deg); }
              75% { transform: translate(30px, 15px) rotate(3deg); }
            }
            @keyframes dfHover2 {
              0%, 100% { transform: translate(0px, 0px) rotate(-10deg); }
              30% { transform: translate(-45px, -25px) rotate(-14deg); }
              70% { transform: translate(-20px, 20px) rotate(-5deg); }
            }
            @keyframes fairyHoverWorld {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-12px); }
            }
            @keyframes smokeDriftWorld {
              0% { opacity: 0.6; transform: translateY(0) scale(1); }
              50% { opacity: 0.3; transform: translateY(-25px) translateX(10px) scale(1.4); }
              100% { opacity: 0; transform: translateY(-50px) translateX(20px) scale(1.8); }
            }
            @keyframes pulseWindow {
              0%, 100% { opacity: 0.8; }
              50% { opacity: 1; }
            }
            @keyframes mistDrift {
              0%, 100% { transform: translateX(0); }
              50% { transform: translateX(40px); }
            }

            .df-wing-l { animation: dfWingFlutter 0.1s ease-in-out infinite alternate; transform-origin: center right; }
            .df-wing-r { animation: dfWingFlutter 0.1s ease-in-out infinite alternate; transform-origin: center left; }
            .df-anim-1 { animation: dfHover1 12s ease-in-out infinite; }
            .df-anim-2 { animation: dfHover2 15s ease-in-out infinite 3s; }
            .df-anim-3 { animation: dfHover1 14s ease-in-out infinite 6s; }
            .fairy-hover { animation: fairyHoverWorld 4.5s ease-in-out infinite; }
            .smoke-1 { animation: smokeDriftWorld 5s ease-out infinite; }
            .smoke-2 { animation: smokeDriftWorld 5s ease-out infinite 2.5s; }
            .glow-window { animation: pulseWindow 4s ease-in-out infinite; }
            .mist-drift { animation: mistDrift 16s ease-in-out infinite; }
          `}</style>
        </defs>

        {/* 1. SKY BASE */}
        <rect width="1920" height="1080" fill="url(#worldSkyGrad)" />

        {/* 2. ATMOSPHERIC GOD RAYS / SUNLIGHT FILTERING */}
        <g opacity="0.65">
          <polygon points="200,0 450,0 750,1080 400,1080" fill="url(#rayGrad)" />
          <polygon points="700,0 950,0 1300,1080 950,1080" fill="url(#rayGrad)" opacity="0.5" />
          <polygon points="1200,0 1450,0 1850,1080 1500,1080" fill="url(#rayGrad)" opacity="0.7" />
        </g>

        {/* 3. DISTANT MOUNTAIN SILHOUETTES */}
        <path
          d="M0 650 Q300 520 600 580 T1200 540 T1800 570 Q1880 580 1920 600 L1920 1080 L0 1080 Z"
          fill="#081A12"
          opacity="0.85"
        />

        {/* 4. THE FAIRYTALE WOODLAND CASTLE (High in the distant misty mountains) */}
        <g id="enchantedCastle" transform="translate(280, 260)" opacity="0.75">
          {/* Castle Mountain Crag Base */}
          <polygon points="120,380 40,480 340,480 280,380" fill="#0A1811" />

          {/* Main Central Citadel Keep */}
          <rect x="130" y="240" width="120" height="150" fill="url(#castleStone)" rx="2" />
          {/* Crenellations / Battlement parapet */}
          <polygon points="125,240 125,230 140,230 140,240 155,240 155,230 170,230 170,240 185,240 185,230 200,230 200,240 215,240 215,230 230,230 230,240 245,240 245,230 255,230 255,240" fill="#14241C" />

          {/* Left Tower */}
          <rect x="80" y="210" width="55" height="180" fill="url(#castleStone)" rx="2" />
          {/* Left Tower Conical Spire Roof */}
          <polygon points="70,210 107,90 145,210" fill="url(#spireGrad)" />
          {/* Left Tower Glowing Window */}
          <rect x="98" y="235" width="18" height="28" rx="9" fill="url(#amberGlow)" className="glow-window" />
          {/* Flagpole and Fluttering Pennant */}
          <line x1="107" y1="90" x2="107" y2="65" stroke="#2D4732" strokeWidth="2" />
          <polygon points="107,65 135,74 107,83" fill="#F2BE64" opacity="0.9" />

          {/* Right Tower */}
          <rect x="245" y="210" width="55" height="180" fill="url(#castleStone)" rx="2" />
          {/* Right Tower Conical Spire Roof */}
          <polygon points="235,210 272,90 310,210" fill="url(#spireGrad)" />
          {/* Right Tower Glowing Window */}
          <rect x="263" y="235" width="18" height="28" rx="9" fill="url(#amberGlow)" className="glow-window" />
          {/* Right Pennant */}
          <line x1="272" y1="90" x2="272" y2="65" stroke="#2D4732" strokeWidth="2" />
          <polygon points="272,65 300,74 272,83" fill="#8DB492" opacity="0.9" />

          {/* High Central Watchtower Spire */}
          <rect x="165" y="150" width="50" height="95" fill="url(#castleStone)" />
          <polygon points="155,150 190,40 225,150" fill="url(#spireGrad)" />
          {/* Central Cathedral Rose Window */}
          <circle cx="190" cy="180" r="14" fill="url(#amberGlow)" className="glow-window" />
          {/* Golden Academy Banner on Highest Spire */}
          <line x1="190" y1="40" x2="190" y2="10" stroke="#F2BE64" strokeWidth="2.5" />
          <polygon points="190,10 230,22 190,34" fill="#F2BE64" />

          {/* Grand Castle Arched Gate */}
          <path d="M165 390 L165 320 Q190 295 215 320 L215 390 Z" fill="#060E0A" stroke="#223629" strokeWidth="2" />
          <circle cx="190" cy="335" r="22" fill="url(#amberGlow)" opacity="0.6" />
        </g>

        {/* 5. DISTANT CASTLE MIST */}
        <ellipse cx="480" cy="650" rx="400" ry="45" fill="url(#mistLayerGrad)" className="mist-drift" />

        {/* 6. MIDGROUND FOREST CANOPY & ROLLING WOODLAND GROUND */}
        <path
          d="M0 720 Q480 640 960 690 T1920 680 L1920 1080 L0 1080 Z"
          fill="#0C2519"
        />

        {/* 7. COZY WOODLAND STUDY HUT (Right side of landscape) */}
        <g id="woodlandHut" transform="translate(1420, 620)" opacity="0.85">
          {/* Foundation */}
          <rect x="60" y="210" width="220" height="30" rx="4" fill="#2E3C33" />
          {/* Timber Log Walls */}
          <rect x="70" y="110" width="200" height="105" rx="4" fill="#3D291A" />
          <line x1="70" y1="130" x2="270" y2="130" stroke="#24170E" strokeWidth="2.5" />
          <line x1="70" y1="150" x2="270" y2="150" stroke="#24170E" strokeWidth="2.5" />
          <line x1="70" y1="170" x2="270" y2="170" stroke="#24170E" strokeWidth="2.5" />
          <line x1="70" y1="190" x2="270" y2="190" stroke="#24170E" strokeWidth="2.5" />

          {/* Stone Chimney on left */}
          <rect x="90" y="10" width="30" height="70" fill="#424D46" rx="2" />
          <rect x="86" y="8" width="38" height="8" fill="#58665E" rx="2" />
          {/* Curling Chimney Smoke */}
          <circle cx="105" cy="-5" r="8" fill="#CAD8CE" className="smoke-1" opacity="0.5" />
          <circle cx="112" cy="-20" r="12" fill="#CAD8CE" className="smoke-2" opacity="0.35" />
          <circle cx="120" cy="-38" r="16" fill="#CAD8CE" className="smoke-1" opacity="0.2" />

          {/* Moss-Covered Thatch Fairytale Roof */}
          <polygon points="40,118 170,0 300,118" fill="#476C4C" stroke="#223625" strokeWidth="3" />
          {/* Overhanging thatch scallop */}
          <path
            d="M 35 118 Q 60 128 90 120 Q 130 130 170 120 Q 210 130 250 120 Q 285 128 305 118 L 295 108 L 45 108 Z"
            fill="#649169"
          />

          {/* Glowing Cozy Window */}
          <rect x="195" y="130" width="50" height="58" rx="4" fill="#1C140D" />
          <rect x="198" y="133" width="44" height="52" rx="3" fill="url(#amberGlow)" className="glow-window" />
          <line x1="220" y1="133" x2="220" y2="185" stroke="#3D291A" strokeWidth="2.5" />
          <line x1="198" y1="159" x2="242" y2="159" stroke="#3D291A" strokeWidth="2.5" />

          {/* Arched Wooden Study Door */}
          <path d="M 100 215 L 100 145 Q 128 120 156 145 L 156 215 Z" fill="#24170E" />
          <circle cx="145" cy="178" r="3" fill="#F2BE64" />

          {/* Hanging Scholar Lantern */}
          <line x1="168" y1="140" x2="168" y2="152" stroke="#1A1A1A" strokeWidth="2" />
          <rect x="163" y="152" width="10" height="14" rx="2" fill="#FFF4D0" />
          <circle cx="168" cy="159" r="28" fill="url(#fireflyHalo)" opacity="0.8" />

          {/* Wild Mushrooms at base */}
          <path d="M 60 216 Q 68 200 76 216 Z" fill="#D64545" />
          <path d="M 78 217 Q 84 204 90 217 Z" fill="#52B788" />
        </g>

        {/* 8. WOODLAND ELVES (Wise forest scholars with pointed ears & robes) */}
        {/* Elf 1: Under ancient oak on left edge, holding a lantern staff */}
        <g id="elfScholar1" transform="translate(180, 680)" opacity="0.8">
          {/* Flowing scholar robe */}
          <path d="M 30 180 L 15 280 L 55 280 L 40 180 Z" fill="#0F241A" />
          <path d="M 20 185 Q 35 170 50 185 L 52 240 L 18 240 Z" fill="#173F30" />
          {/* Head & Pointed Elf Ears */}
          <circle cx="35" cy="155" r="9" fill="#E8D9B8" />
          {/* Pointed ear left & right */}
          <polygon points="26,155 16,145 28,150" fill="#E8D9B8" />
          <polygon points="44,155 54,145 42,150" fill="#E8D9B8" />
          {/* Flowing golden hair */}
          <path d="M 25 152 Q 35 142 45 152 Q 40 175 25 175 Z" fill="#F2BE64" />
          {/* Staff & Lantern */}
          <line x1="58" y1="130" x2="58" y2="280" stroke="#3D291A" strokeWidth="3" />
          <circle cx="58" cy="130" r="16" fill="url(#fireflyHalo)" opacity="0.9" />
          <circle cx="58" cy="130" r="4" fill="#FFFFFF" />
        </g>

        {/* Elf 2: Scholar reading a scroll on path near the center */}
        <g id="elfScholar2" transform="translate(1080, 720)" opacity="0.75">
          <path d="M 25 140 L 10 220 L 45 220 L 32 140 Z" fill="#143124" />
          <circle cx="28" cy="120" r="8" fill="#E8D9B8" />
          {/* Pointed ear */}
          <polygon points="34,120 44,112 36,116" fill="#E8D9B8" />
          {/* Reading scroll glow */}
          <rect x="18" y="132" width="20" height="12" rx="2" fill="#FDF8ED" />
          <circle cx="28" cy="138" r="14" fill="url(#fireflyHalo)" opacity="0.75" />
        </g>

        {/* 9. ENCHANTED SHIMMERING DRAGONFLIES (Hovering & Darting) */}
        {/* Dragonfly 1: High in the canopy, center-left */}
        <g id="dragonfly1" className="df-anim-1" transform="translate(680, 320)">
          {/* Glowing Aura */}
          <circle cx="0" cy="0" r="22" fill="url(#fireflyHalo)" opacity="0.65" />
          {/* Slender Iridescent Body */}
          <ellipse cx="0" cy="0" rx="3.5" ry="16" fill="url(#dragonflyBodyGrad)" />
          {/* Head & Eyes */}
          <circle cx="0" cy="-16" r="4" fill="#2ECC71" />
          <circle cx="-2" cy="-17" r="1.5" fill="#FFFFFF" />
          <circle cx="2" cy="-17" r="1.5" fill="#FFFFFF" />
          {/* Tail Segments */}
          <line x1="0" y1="16" x2="0" y2="34" stroke="#2ECC71" strokeWidth="2.5" />
          <circle cx="0" cy="34" r="1.5" fill="#F2BE64" />
          {/* Forewings & Hindwings Left */}
          <g className="df-wing-l">
            <ellipse cx="-18" cy="-8" rx="22" ry="5.5" fill="url(#dragonflyWingGrad)" transform="rotate(-15 -18 -8)" />
            <ellipse cx="-16" cy="2" rx="18" ry="4.5" fill="url(#dragonflyWingGrad)" transform="rotate(-5 -16 2)" />
          </g>
          {/* Forewings & Hindwings Right */}
          <g className="df-wing-r">
            <ellipse cx="18" cy="-8" rx="22" ry="5.5" fill="url(#dragonflyWingGrad)" transform="rotate(15 18 -8)" />
            <ellipse cx="16" cy="2" rx="18" ry="4.5" fill="url(#dragonflyWingGrad)" transform="rotate(5 16 2)" />
          </g>
        </g>

        {/* Dragonfly 2: Hovering above the castle ridge */}
        <g id="dragonfly2" className="df-anim-2" transform="translate(520, 210)">
          <circle cx="0" cy="0" r="18" fill="url(#fireflyHalo)" opacity="0.6" />
          <ellipse cx="0" cy="0" rx="3" ry="14" fill="url(#dragonflyBodyGrad)" />
          <circle cx="0" cy="-14" r="3.5" fill="#38E5B0" />
          <line x1="0" y1="14" x2="0" y2="28" stroke="#38E5B0" strokeWidth="2" />
          <g className="df-wing-l">
            <ellipse cx="-15" cy="-6" rx="18" ry="4.5" fill="url(#dragonflyWingGrad)" transform="rotate(-18 -15 -6)" />
            <ellipse cx="-13" cy="2" rx="15" ry="3.8" fill="url(#dragonflyWingGrad)" transform="rotate(-6 -13 2)" />
          </g>
          <g className="df-wing-r">
            <ellipse cx="15" cy="-6" rx="18" ry="4.5" fill="url(#dragonflyWingGrad)" transform="rotate(18 15 -6)" />
            <ellipse cx="13" cy="2" rx="15" ry="3.8" fill="url(#dragonflyWingGrad)" transform="rotate(6 13 2)" />
          </g>
        </g>

        {/* Dragonfly 3: Near the woodland hut */}
        <g id="dragonfly3" className="df-anim-3" transform="translate(1360, 540)">
          <circle cx="0" cy="0" r="20" fill="url(#fireflyHalo)" opacity="0.7" />
          <ellipse cx="0" cy="0" rx="3.2" ry="15" fill="url(#dragonflyBodyGrad)" />
          <circle cx="0" cy="-15" r="3.5" fill="#2ECC71" />
          <line x1="0" y1="15" x2="0" y2="30" stroke="#2ECC71" strokeWidth="2" />
          <g className="df-wing-l">
            <ellipse cx="-16" cy="-7" rx="20" ry="5" fill="url(#dragonflyWingGrad)" transform="rotate(-15 -16 -7)" />
            <ellipse cx="-14" cy="2" rx="16" ry="4" fill="url(#dragonflyWingGrad)" transform="rotate(-5 -14 2)" />
          </g>
          <g className="df-wing-r">
            <ellipse cx="16" cy="-7" rx="20" ry="5" fill="url(#dragonflyWingGrad)" transform="rotate(15 16 -7)" />
            <ellipse cx="14" cy="2" rx="16" ry="4" fill="url(#dragonflyWingGrad)" transform="rotate(5 14 2)" />
          </g>
        </g>

        {/* 10. FOREGROUND TALL TREES FRAMING THE SCREEN */}
        {/* Left ancient trunk and leafy branches */}
        <path d="M-60 1080 L-10 400 Q40 550 10 1080 Z" fill="#0B1A13" />
        <path d="M-30 450 Q80 380 180 430 Q240 450 300 400 Q240 520 120 520 Q20 540 -30 480 Z" fill="#0F281D" />

        {/* Right ancient trunk and canopy branches */}
        <path d="M1980 1080 L1930 380 Q1880 540 1910 1080 Z" fill="#0B1A13" />
        <path d="M1950 420 Q1820 360 1720 410 Q1660 440 1590 390 Q1680 500 1790 500 Q1890 520 1950 460 Z" fill="#0F281D" />

        {/* 11. SCATTERED GOLDEN FIREFLIES */}
        <circle cx="420" cy="780" r="3" fill="#FFFFFF" />
        <circle cx="420" cy="780" r="16" fill="url(#fireflyHalo)" />

        <circle cx="780" cy="620" r="2.8" fill="#FFFBE6" />
        <circle cx="780" cy="620" r="14" fill="url(#fireflyHalo)" />

        <circle cx="1220" cy="580" r="3.2" fill="#FFFFFF" />
        <circle cx="1220" cy="580" r="18" fill="url(#fireflyHalo)" />

        <circle cx="1680" cy="720" r="2.6" fill="#FFFFFF" />
        <circle cx="1680" cy="720" r="15" fill="url(#fireflyHalo)" />
      </svg>
    </div>
  );
}
