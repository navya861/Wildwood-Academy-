'use client';

import React from 'react';
import { BookOpen, GraduationCap, Lightbulb, AlertTriangle, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

interface LessonContentRendererProps {
  content: string;
}

export function LessonContentRenderer({ content }: LessonContentRendererProps) {
  if (!content) return null;

  // Split content into major blocks separated by double newlines or table blocks
  const rawBlocks = content.split(/\n\n+/);

  // Helper to parse inline markdown (bold, italic, code)
  const renderInline = (text: string): React.ReactNode => {
    // Regex splits on **bold**, `code`, *italic*
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-parchment font-sans">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded-md bg-forest-950/80 border border-forest-700/60 text-amber-300 font-mono text-xs"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={i} className="italic text-sage-light">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  // Helper to check if block is a markdown table
  const isTableBlock = (block: string) => {
    const lines = block.trim().split('\n');
    return lines.length >= 2 && lines[0].includes('|') && lines[1].includes('|') && lines[1].includes('-');
  };

  const renderTable = (block: string, key: number) => {
    const lines = block.trim().split('\n').filter(l => l.includes('|'));
    if (lines.length < 2) return null;

    const parseRow = (line: string) =>
      line
        .split('|')
        .slice(1, -1)
        .map(cell => cell.trim());

    const headers = parseRow(lines[0]);
    // Skip delimiter line (index 1)
    const rows = lines.slice(2).map(parseRow);

    return (
      <div key={key} className="my-6 overflow-x-auto rounded-2xl border border-forest-600/50 shadow-lg bg-forest-900/70">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-forest-700/80 bg-forest-950/90 text-lantern font-serif">
              {headers.map((h, i) => (
                <th key={i} className="py-3 px-4 font-bold tracking-wide">
                  {renderInline(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-700/40 font-sans text-parchment/90">
            {rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className={rIdx % 2 === 0 ? 'bg-forest-900/40 hover:bg-forest-800/50' : 'bg-forest-900/80 hover:bg-forest-800/50'}
              >
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="py-2.5 px-4 leading-relaxed">
                    {renderInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <article className="space-y-5 leading-relaxed font-sans text-sm md:text-base text-parchment/90">
      {rawBlocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Divider
        if (/^---$|^\*\*\*$/.test(trimmed)) {
          return (
            <hr key={idx} className="my-6 border-t border-forest-700/50" />
          );
        }

        // Table Block
        if (isTableBlock(trimmed)) {
          return renderTable(trimmed, idx);
        }

        // H1 Title
        if (trimmed.startsWith('# ')) {
          return (
            <h1
              key={idx}
              className="text-2xl sm:text-3xl font-serif font-extrabold text-parchment pt-4 pb-2 border-b border-forest-700/50 flex items-center gap-2"
            >
              <span>{renderInline(trimmed.replace(/^#\s*/, ''))}</span>
            </h1>
          );
        }

        // H2 Section Header
        if (trimmed.startsWith('## ')) {
          return (
            <h2
              key={idx}
              className="text-xl sm:text-2xl font-serif font-bold text-lantern pt-4 pb-1 border-b border-forest-700/40"
            >
              {renderInline(trimmed.replace(/^##\s*/, ''))}
            </h2>
          );
        }

        // H3 Sub-Header
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-lg sm:text-xl font-serif font-bold text-lantern-light pt-2">
              {renderInline(trimmed.replace(/^###\s*/, ''))}
            </h3>
          );
        }

        // H4 Sub-Header
        if (trimmed.startsWith('#### ') || trimmed.startsWith('##### ')) {
          return (
            <h4 key={idx} className="text-base font-serif font-semibold text-sage-light pt-1">
              {renderInline(trimmed.replace(/^#{4,5}\s*/, ''))}
            </h4>
          );
        }

        // Callout / Blockquote
        if (trimmed.startsWith('> ')) {
          const quoteText = trimmed.replace(/^>\s*/, '');
          const isExam = /🎓|Exam|Cram|Test|Revision/i.test(quoteText);
          const isWarning = /⚠️|Warning|Caution|Pitfall/i.test(quoteText);
          const isInsight = /💡|Insight|Key Tenet|Rule/i.test(quoteText);

          return (
            <div
              key={idx}
              className={`my-4 p-4 rounded-2xl border flex items-start gap-3 shadow-md ${
                isExam
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-100'
                  : isWarning
                  ? 'bg-red-950/40 border-red-500/50 text-red-100'
                  : isInsight
                  ? 'bg-forest-900/90 border-moss-400/50 text-moss-200'
                  : 'bg-forest-900/60 border-forest-700/50 text-sage-light'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isExam ? (
                  <GraduationCap className="w-5 h-5 text-lantern" />
                ) : isWarning ? (
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                ) : isInsight ? (
                  <Lightbulb className="w-5 h-5 text-amber-300" />
                ) : (
                  <Sparkles className="w-5 h-5 text-sage" />
                )}
              </div>
              <div className="text-xs sm:text-sm leading-relaxed space-y-1">
                {renderInline(quoteText)}
              </div>
            </div>
          );
        }

        // Bullet / Numbered Lists
        const lines = trimmed.split('\n');
        const isList = lines.every(l => /^[-•*]\s|^\d+\.?\s/.test(l.trim()));
        if (isList) {
          return (
            <div key={idx} className="my-3 space-y-2 pl-1">
              {lines.map((l, lIdx) => {
                const lineTrim = l.trim();
                const isNumbered = /^\d+\.?\s/.test(lineTrim);
                const numMatch = lineTrim.match(/^(\d+)\.?\s/);
                const num = numMatch ? numMatch[1] : `${lIdx + 1}`;
                const text = lineTrim.replace(/^[-•*]\s*|^\d+\.?\s*/, '');

                return (
                  <div key={lIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-parchment/90">
                    {isNumbered ? (
                      <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-forest-950/90 border border-lantern/40 text-lantern shrink-0 mt-0.5">
                        {num}
                      </span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-lantern/80 mt-1.5 shrink-0 shadow-sm" />
                    )}
                    <div className="leading-relaxed flex-1">
                      {renderInline(text)}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }

        // Standard Paragraph with Mixed Content
        return (
          <p key={idx} className="leading-relaxed text-parchment/90 text-sm sm:text-base">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </article>
  );
}
