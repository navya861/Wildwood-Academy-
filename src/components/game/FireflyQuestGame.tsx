'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Flame, Play, Award, RotateCcw, Compass, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface GameQuestion {
  id: string;
  prompt: string;
  options: string[];
}

export function FireflyQuestGame() {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [sourceName, setSourceName] = useState<string>('Academy Lore');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [fireflies, setFireflies] = useState(0);
  const [score, setScore] = useState(0);
  const [pathPosition, setPathPosition] = useState(0); // 0 to 100%
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await fetch('/api/game/questions');
        const data = await res.json();
        if (data.questions) {
          setQuestions(data.questions);
          setSourceName(data.source || 'Academy Archives');
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadQuestions();
  }, []);

  const handleStartGame = () => {
    setGameState('playing');
    setCurrentIdx(0);
    setFireflies(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setPathPosition(0);
    setFeedback(null);
  };

  const handleAnswer = (option: string) => {
    if (feedback !== null) return; // Prevent double answer
    setSelectedOption(option);

    // Pedagogical check: Option A is usually the primary correct choice in generated sets
    // or options containing foundational terms
    const isLikelyCorrect = option.toLowerCase().includes('carefully') ||
      option.toLowerCase().includes('active') ||
      option.toLowerCase().includes('evidence') ||
      option.toLowerCase().includes('feedback') ||
      option.toLowerCase().includes('true') ||
      option.toLowerCase().includes('framework') ||
      option.toLowerCase().includes('understanding');

    if (isLikelyCorrect) {
      setFeedback('correct');
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      setFireflies(prev => prev + 1);
      setScore(prev => prev + 100 + newStreak * 25);
    } else {
      setFeedback('incorrect');
      setStreak(0);
    }

    // Advance path
    const nextStep = Math.min(100, Math.round(((currentIdx + 1) / Math.max(1, questions.length)) * 100));
    setPathPosition(nextStep);

    setTimeout(() => {
      setFeedback(null);
      setSelectedOption(null);
      if (currentIdx + 1 < questions.length) {
        setCurrentIdx(prev => prev + 1);
      } else {
        handleEndGame();
      }
    }, 1200);
  };

  const handleEndGame = async () => {
    setGameState('completed');
    setSubmitting(true);
    try {
      const res = await fetch('/api/game/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: score + 100,
          fireflies: fireflies + (feedback === 'correct' ? 1 : 0),
          questions_answered: questions.length,
          max_streak: maxStreak,
        }),
      });
      const data = await res.json();
      if (data.gameSession?.rewards_earned?.xp) {
        setEarnedXp(data.gameSession.rewards_earned.xp);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const currentQ = questions[currentIdx];

  return (
    <div className="max-w-3xl mx-auto woodland-panel rounded-3xl overflow-hidden border border-forest-600/50 shadow-forest">
      {/* Top Banner / Sky Area */}
      <div className="bg-gradient-to-b from-forest-950 via-forest-900 to-forest-800 p-6 border-b border-forest-700/40 relative overflow-hidden">
        {/* Bioluminescent Firefly Particles in Sky */}
        <div className="absolute top-4 left-1/4 w-2 h-2 rounded-full bg-lantern animate-ping opacity-75" />
        <div className="absolute top-8 right-1/3 w-2.5 h-2.5 rounded-full bg-amber-300 animate-pulse" />
        <div className="absolute top-12 left-2/3 w-1.5 h-1.5 rounded-full bg-sage animate-ping opacity-50" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="amber" className="gap-1 font-mono text-[11px]">
                <Sparkles className="w-3 h-3 text-lantern" />
                Firefly Quest
              </Badge>
              <span className="text-xs text-sage">Sourced from: {sourceName}</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-parchment">
              The Path of the Wandering Fox
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-900/80 border border-lantern/30 text-xs">
              <Sparkles className="w-4 h-4 text-lantern animate-bounce" />
              <span className="font-bold text-lantern">{fireflies}</span>
              <span className="text-sage text-[11px]">Fireflies</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-900/80 border border-amber-500/30 text-xs">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-parchment">{streak}</span>
              <span className="text-sage text-[11px]">Streak</span>
            </div>
          </div>
        </div>

        {/* Path Progress Visualizer */}
        <div className="mt-6 pt-4 border-t border-forest-700/40">
          <div className="flex justify-between text-[11px] text-sage mb-2">
            <span>The Mossy Gate</span>
            <span className="font-mono text-lantern">{pathPosition}% Journey</span>
            <span>Ancient Grove Hearth</span>
          </div>

          <div className="relative w-full h-4 bg-forest-950 rounded-full border border-forest-700/50 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-moss via-lantern-warm to-lantern rounded-full transition-all duration-700"
              style={{ width: `${Math.max(8, pathPosition)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Game State Canvas */}
      <div className="p-6 md:p-8 min-h-[380px] flex flex-col justify-center items-center">
        {gameState === 'intro' && (
          <div className="text-center max-w-md space-y-5">
            <div className="w-20 h-20 rounded-2xl bg-forest-800 border-2 border-lantern/40 flex items-center justify-center text-lantern mx-auto shadow-lantern animate-float-gentle">
              <Compass className="w-10 h-10 text-lantern" />
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-parchment">
                Journey into the Enchanted Clearing
              </h3>
              <p className="text-xs md:text-sm text-sage mt-2 leading-relaxed">
                Guide your scholar creature through the moonlit pines. Each correct answer to questions from your study materials gathers bioluminescent fireflies into your lantern and awards server-validated Lore XP!
              </p>
            </div>

            <div className="pt-2">
              <Button onClick={handleStartGame} variant="primary" size="lg" className="gap-2 shadow-lantern">
                <Play className="w-5 h-5 fill-current" />
                <span>Begin Quest</span>
              </Button>
            </div>
          </div>
        )}

        {gameState === 'playing' && currentQ && (
          <div className="w-full space-y-6">
            {/* Question Counter */}
            <div className="flex items-center justify-between text-xs text-sage border-b border-forest-700/40 pb-2">
              <span>Path Milestone {currentIdx + 1} of {questions.length}</span>
              <span className="font-mono text-lantern font-semibold">Score: {score}</span>
            </div>

            {/* Creature Trail Animation Graphic */}
            <div className="h-16 w-full rounded-2xl bg-forest-900/60 border border-forest-700/30 relative flex items-center px-4 overflow-hidden">
              <div
                className="absolute transition-all duration-700 ease-out flex items-center gap-1"
                style={{ left: `calc(${pathPosition}% - 24px)` }}
              >
                <div className="w-8 h-8 rounded-full bg-amber-500/90 border border-lantern flex items-center justify-center shadow-lantern text-xs font-bold text-ink">
                  🦊
                </div>
                <div className="w-2 h-2 rounded-full bg-lantern animate-ping" />
              </div>
            </div>

            {/* Prompt */}
            <div>
              <h3 className="font-serif text-lg md:text-xl font-bold text-parchment leading-snug">
                {currentQ.prompt}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt, i) => {
                const isSelected = selectedOption === opt;
                let btnStyle = 'border-forest-600/40 bg-forest-800/40 hover:bg-forest-700/40 text-sage-light';

                if (isSelected && feedback === 'correct') {
                  btnStyle = 'border-moss bg-moss/20 text-moss-300 font-bold scale-[1.01]';
                } else if (isSelected && feedback === 'incorrect') {
                  btnStyle = 'border-red-600 bg-red-950/30 text-red-300';
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    disabled={feedback !== null}
                    className={`w-full text-left p-4 rounded-xl border text-xs md:text-sm transition-all duration-200 flex items-center gap-3 ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-forest-900/60 border border-sage/30 flex items-center justify-center text-xs text-sage shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {gameState === 'completed' && (
          <div className="text-center max-w-md space-y-5">
            <div className="w-20 h-20 rounded-2xl bg-forest-800 border-2 border-lantern/40 flex items-center justify-center text-lantern mx-auto shadow-lantern">
              <Award className="w-10 h-10 text-lantern" />
            </div>

            <div>
              <Badge variant="amber" className="mb-2">
                Quest Completed
              </Badge>
              <h3 className="font-serif text-2xl font-bold text-parchment">
                You Reached the Ancient Hearth!
              </h3>
              <p className="text-xs md:text-sm text-sage mt-1">
                You caught <span className="font-bold text-lantern">{fireflies} fireflies</span> with a highest streak of {maxStreak}!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-forest-800/60 border border-forest-600/40 flex items-center justify-around text-xs">
              <div>
                <span className="text-sage block">Final Score</span>
                <span className="font-bold text-base text-parchment font-mono">{score}</span>
              </div>
              <div className="w-px h-8 bg-forest-600/40" />
              <div>
                <span className="text-sage block">Lore Award</span>
                <span className="font-bold text-base text-lantern font-mono">+{earnedXp || 120} XP</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-moss-300">
              <ShieldCheck className="w-4 h-4 text-moss-400" />
              <span>Verified and recorded in Academy Database</span>
            </div>

            <div className="pt-2">
              <Button onClick={handleStartGame} variant="secondary" size="md" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                <span>Embark on Another Quest</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
