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
  // Set of revealed reason IDs
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
    <section id="razones" className="py-20 px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 mb-12">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase text-rose-800">
          <span>Infinitos Motivos</span>
          <span aria-hidden="true">·</span>
          <span>Elegirte Siempre</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif-title font-bold text-stone-900 tracking-tight text-balance">
          Razones por las que me enamoro de ti cada día
        </h2>
        <p className="text-stone-600 text-sm max-w-md mx-auto">
          Toca cada tarjeta para descubrir lo que despiertas en mi corazón.
        </p>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 pt-3">
          <button
            onClick={revealAll}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-rose-200 text-rose-900 hover:bg-rose-50 transition-colors"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-rose-200 text-rose-900 hover:bg-rose-50 transition-colors"
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
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleReason(reason.id); }}
              className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 border flex flex-col justify-between min-h-[190px] focus:outline-none focus:ring-2 focus:ring-rose-400 ${
                isRevealed
                  ? 'bg-white border-rose-200 shadow-md transform -translate-y-0.5'
                  : 'bg-rose-50/70 hover:bg-rose-100/70 border-rose-100 shadow-sm'
              }`}
            >
              <div className="space-y-3">
                {/* Card Top Indicator */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-rose-800/80 font-medium tabular-nums">
                    Razón #{String(index + 1).padStart(2, '0')}
                  </span>
                  <div className={`p-1.5 rounded-full ${isRevealed ? 'bg-rose-100 text-rose-700' : 'bg-white text-rose-400'}`}>
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>

                <h3 className="font-serif-title text-xl font-bold text-stone-900">
                  {reason.title}
                </h3>

                {isRevealed ? (
                  <p className="text-stone-700 text-sm font-editorial leading-relaxed animate-fadeIn">
                    {reason.description}
                  </p>
                ) : (
                  <p className="text-stone-400 text-xs italic font-editorial">
                    (Toca para leer esta razón...)
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-rose-100/60 flex items-center justify-between text-[11px] text-rose-800/70">
                <span>{partnerName}</span>
                <span>{isRevealed ? 'Guardada ♥' : 'Descubrir'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
