import React, { useState } from 'react';
import { Heart, Sparkles, Shuffle, Eye, EyeOff } from 'lucide-react';
import { LoveReason } from '../types';

interface ReasonsWhyILoveYouProps {
  reasons: LoveReason[];
  partnerName: string;
}

export const ReasonsWhyILoveYou: React.FC<ReasonsWhyILoveYouProps> = ({
  reasons,
  partnerName
}) => {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set([reasons[0]?.id || '']));
  const [shuffledReasons, setShuffledReasons] = useState<LoveReason[]>(reasons);

  const toggleReason = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const revealAll = () => {
    if (revealedIds.size === reasons.length) {
      setRevealedIds(new Set());
    } else {
      setRevealedIds(new Set(reasons.map((r) => r.id)));
    }
  };

  const handleShuffle = () => {
    const copy = [...shuffledReasons];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setShuffledReasons(copy);
  };

  return (
    <section id="razones" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto relative z-10">
      {/* Header */}
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs font-semibold tracking-widest uppercase text-pink-300">
          <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
          <span>Infinitos Motivos</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif-title font-bold text-white tracking-tight leading-tight text-balance">
          Razones por las que me enamoro de ti cada día
        </h2>
        <p className="text-slate-300 text-sm max-w-md mx-auto">
          Toca cada tarjeta para descubrir lo que despiertas en mi corazón.
        </p>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 pt-3">
          <button
            onClick={revealAll}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-950/70 border border-purple-500/30 text-pink-200 hover:bg-purple-900 transition-colors cursor-pointer"
          >
            {revealedIds.size === reasons.length ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Ocultar todas</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Revelar todas</span>
              </>
            )}
          </button>

          <button
            onClick={handleShuffle}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-950/70 border border-purple-500/30 text-pink-200 hover:bg-purple-900 transition-colors cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Mezclar</span>
          </button>
        </div>
      </div>

      {/* Grid of Reason Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {shuffledReasons.map((reason, index) => {
          const isRevealed = revealedIds.has(reason.id);

          return (
            <div
              key={reason.id}
              onClick={() => toggleReason(reason.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') toggleReason(reason.id);
              }}
              className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 border flex flex-col justify-between min-h-[190px] backdrop-blur-md ${
                isRevealed
                  ? 'bg-gradient-to-b from-[#1f0b3c]/90 via-[#150729]/90 to-[#0c0318]/95 border-pink-500/50 shadow-[0_0_25px_rgba(236,72,153,0.25)] transform -translate-y-1'
                  : 'bg-purple-950/40 hover:bg-purple-900/40 border-purple-500/25 shadow-sm'
              }`}
            >
              <div className="space-y-3">
                {/* Top Indicator */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-pink-300/80 font-medium tabular-nums">
                    Razón #{String(index + 1).padStart(2, '0')}
                  </span>
                  <div
                    className={`p-1.5 rounded-full ${
                      isRevealed
                        ? 'bg-pink-500/20 text-pink-300 border border-pink-400/30'
                        : 'bg-purple-900/40 text-purple-400'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>

                <h3 className="font-serif-title text-xl font-bold text-white">
                  {reason.title}
                </h3>

                {isRevealed ? (
                  <p className="text-slate-200 text-sm font-sans-body leading-relaxed animate-fadeIn">
                    {reason.description}
                  </p>
                ) : (
                  <p className="text-purple-300/60 text-xs italic font-editorial">
                    (Toca para leer esta razón...)
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-purple-500/20 flex items-center justify-between text-[11px] text-purple-300/80">
                <span className="font-script text-base text-pink-300">{partnerName}</span>
                <span>{isRevealed ? 'Guardada ♥' : 'Descubrir'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
