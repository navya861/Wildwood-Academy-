'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  type: 'star' | 'dust' | 'diamond';
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  spin: number;
  angle: number;
  shrink: number;
}

export function GlitterCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Respect user accessibility and mobile/touch devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReducedMotion) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];
    const MAX_PARTICLES = 140;

    // Rich enchanted woodland stardust palette:
    // Warm golds, lantern amber, soft mint, pale sage, and bright white starlight
    const palette = [
      '#F2BE64', // Warm lantern gold
      '#FFD97D', // Bright gold
      '#FFF3D1', // Pale starlight parchment
      '#8DB492', // Enchanted forest mint
      '#A7B99A', // Soft sage
      '#C5D3BC', // Pale lichen
      '#FFFFFF', // Starlight sparkle
      '#FFE082', // Pixie dust yellow
    ];

    let lastX = -1;
    let lastY = -1;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const spawnParticle = (x: number, y: number, speedFactor = 1) => {
      if (particles.length >= MAX_PARTICLES) {
        // Reuse or replace oldest faded particle
        particles.shift();
      }

      const pTypeRoll = Math.random();
      const type: 'star' | 'dust' | 'diamond' =
        pTypeRoll < 0.25 ? 'star' : pTypeRoll < 0.6 ? 'diamond' : 'dust';

      const color = palette[Math.floor(Math.random() * palette.length)];
      const baseSize =
        type === 'star'
          ? Math.random() * 3.2 + 2.4
          : type === 'diamond'
          ? Math.random() * 2.6 + 1.6
          : Math.random() * 2.0 + 1.0;

      // Gentle drift and natural gravity
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 0.9 + 0.3) * speedFactor;

      particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        size: baseSize,
        color,
        type,
        vx: Math.cos(angle) * speed * 0.7,
        vy: Math.sin(angle) * speed * 0.5 + 0.35, // gentle downward drift
        alpha: Math.random() * 0.3 + 0.7,
        decay: Math.random() * 0.02 + 0.015,
        spin: (Math.random() - 0.5) * 0.12,
        angle: Math.random() * Math.PI * 2,
        shrink: Math.random() * 0.025 + 0.015,
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX;
      const currentY = e.clientY;

      if (lastX === -1 || lastY === -1) {
        lastX = currentX;
        lastY = currentY;
        spawnParticle(currentX, currentY);
        return;
      }

      const dx = currentX - lastX;
      const dy = currentY - lastY;
      const dist = Math.hypot(dx, dy);

      // Smooth interpolation between mouse points to prevent disconnected dots on fast moves
      const steps = Math.min(Math.max(Math.floor(dist / 6), 1), 6);
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const px = lastX + dx * t;
        const py = lastY + dy * t;
        // Spawn 1-2 particles per interpolated step
        spawnParticle(px, py, Math.min(dist / 20, 1.5));
        if (Math.random() > 0.4) {
          spawnParticle(px, py, 0.8);
        }
      }

      lastX = currentX;
      lastY = currentY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Draw 4-pointed star
    const drawStar = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      for (let i = 0; i < 4; i++) {
        c.lineTo(Math.cos(((i * 90) * Math.PI) / 180) * size, Math.sin(((i * 90) * Math.PI) / 180) * size);
        c.lineTo(
          Math.cos(((i * 90 + 45) * Math.PI) / 180) * (size * 0.28),
          Math.sin(((i * 90 + 45) * Math.PI) / 180) * (size * 0.28)
        );
      }
      c.closePath();
      c.fill();
    };

    // Draw diamond
    const drawDiamond = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      c.moveTo(0, -size);
      c.lineTo(size * 0.5, 0);
      c.lineTo(0, size);
      c.lineTo(-size * 0.5, 0);
      c.closePath();
      c.fill();
    };

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.size = Math.max(0, p.size * (1 - p.shrink));
        p.angle += p.spin;

        if (p.alpha <= 0 || p.size <= 0.2) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.type === 'star' ? 8 : 4;

        if (p.type === 'star') {
          drawStar(ctx, p.size);
        } else if (p.type === 'diamond') {
          drawDiamond(ctx, p.size);
        } else {
          // Circular stardust speck
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300"
      aria-hidden="true"
    />
  );
}
