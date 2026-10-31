'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, BookOpen, Quote, RefreshCw, User, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { AIMessage, StudyMaterial } from '@/lib/types';

interface TutorChatProps {
  initialMaterialId?: string;
  initialLessonId?: string;
}

export function TutorChat({ initialMaterialId, initialLessonId }: TutorChatProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(initialMaterialId || '');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Load study materials for context dropdown
    async function loadMaterials() {
      try {
        const res = await fetch('/api/materials');
        const data = await res.json();
        if (data.materials) setMaterials(data.materials);
      } catch (e) {
        console.error(e);
      }
    }
    loadMaterials();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: AIMessage = {
      id: `temp-${Date.now()}`,
      conversation_id: conversationId || '',
      user_id: '',
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversation_id: conversationId,
          context: {
            studyMaterialId: selectedMaterialId || undefined,
            lessonId: initialLessonId,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to consult guide');

      if (data.conversation_id && !conversationId) {
        setConversationId(data.conversation_id);
      }

      setMessages(prev => [...prev, data.message]);
    } catch (e: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          conversation_id: '',
          user_id: '',
          role: 'assistant',
          content: `🌿 The woodland mist is thick: ${e.message || 'Unable to connect to the Forest Guide'}. Please ensure your API credentials are configured in Settings or try again.`,
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const starterPrompts = [
    'Explain the core concept using a simple analogy.',
    'Break this topic into three step-by-step principles.',
    'Ask me a question to test my understanding of the material.',
    'What are the most common misconceptions here?',
  ];

  return (
    <div className="flex flex-col h-[750px] max-w-4xl mx-auto woodland-panel rounded-2xl overflow-hidden border border-forest-600/40">
      {/* Header with Context Picker */}
      <div className="p-4 bg-forest-900/90 border-b border-forest-600/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-700/80 border border-lantern/40 flex items-center justify-center text-lantern shadow-lantern">
            <Bot className="w-5 h-5 text-lantern" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-base text-parchment">
              The Forest Guide
            </h2>
            <p className="text-xs text-sage">
              Source-Grounded AI Tutor & Mentor
            </p>
          </div>
        </div>

        {/* Source Context Selector */}
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-sage shrink-0" />
          <select
            value={selectedMaterialId}
            onChange={(e) => setSelectedMaterialId(e.target.value)}
            className="bg-forest-800 border border-forest-600/50 rounded-lg text-xs text-parchment py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-lantern max-w-[220px] truncate"
          >
            <option value="">All Woodland Archives</option>
            {materials.map(m => (
              <option key={m.id} value={m.id}>
                Scroll: {m.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-forest-800 border border-lantern/30 flex items-center justify-center text-lantern shadow-lantern">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="max-w-md">
              <h3 className="font-serif text-lg font-semibold text-parchment">
                Consult the Forest Guide
              </h3>
              <p className="text-xs text-sage mt-1 leading-relaxed">
                I can explain complex theorems step-by-step, generate practice checks, and cite exact passages from your archived materials.
              </p>
            </div>

            {/* Quick Starters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full pt-2">
              {starterPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p)}
                  className="text-left p-3 rounded-xl bg-forest-800/60 hover:bg-forest-700/60 border border-forest-600/30 hover:border-lantern/40 text-xs text-sage-light transition-all"
                >
                  &ldquo;{p}&rdquo;
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, idx) => (
          <div
            key={m.id || idx}
            className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-forest-700 border border-lantern/30 flex items-center justify-center text-lantern shrink-0 shadow-sm mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-lantern text-ink font-medium shadow-md'
                  : 'bg-forest-800/90 text-parchment/95 border border-forest-600/40 shadow-forest'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>

              {/* Citations Box for grounded RAG */}
              {m.source_citations && m.source_citations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-forest-600/30 space-y-1.5">
                  <span className="text-[11px] font-semibold text-lantern flex items-center gap-1">
                    <Quote className="w-3 h-3" />
                    Verified Archive References:
                  </span>
                  {m.source_citations.map((c, i) => (
                    <div key={i} className="p-2 rounded bg-forest-900/60 text-[11px] text-sage">
                      <span className="font-semibold text-sage-light block">{c.title} (Page {c.page || 1})</span>
                      <span className="italic opacity-90">&ldquo;{c.quote}&rdquo;</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-forest-800 border border-sage/40 flex items-center justify-center text-parchment shrink-0 shadow-sm mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-forest-700 border border-lantern/30 flex items-center justify-center text-lantern shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-forest-800/90 rounded-2xl p-4 border border-forest-600/40 flex items-center gap-2 text-xs text-sage animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-lantern" />
              <span>The Guide is consulting ancient leaves and archives...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="p-4 bg-forest-900/90 border-t border-forest-600/40">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your study scrolls..."
            className="flex-1 bg-forest-800 border border-forest-600/50 rounded-xl px-4 py-2.5 text-xs md:text-sm text-parchment placeholder-sage/50 focus:outline-none focus:ring-2 focus:ring-lantern"
            disabled={loading}
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!input.trim() || loading}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
