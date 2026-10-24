import React from 'react';
import { Heart, Sparkles, Stars, Volume2 } from 'lucide-react';

interface IntroSpecialModalProps {
  partnerName: string;
  onEnter: () => void;
}

export const IntroSpecialModal: React.FC<IntroSpecialModalProps> = ({
  partnerName,
  onEnter
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07030d]/95 backdrop-blur-2xl transition-all duration-700 animate-fadeIn overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-pink-600/20 blur-[120px] pointer-events-none" />

      {/* Decorative stars */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${(i % 3) + 1.5}px`,
              height: `${(i % 3) + 1.5}px`,
              left: `${(i * 19) % 96}%`,
              top: `${(i * 23) % 92}%`,
              animation: `twinkle ${2 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${(i * 0.4) % 3}s`
            }}
          />
        ))}
      </div>

      {/* Intro Card */}
      <div className="relative z-10 max-w-lg w-full text-center space-y-7 p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-purple-950/60 via-[#130728]/80 to-[#0c0419]/90 border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.25)] backdrop-blur-xl">
        {/* Glowing floating heart icon */}
        <div className="flex justify-center">
          <div className="relative group">
            <div className="absolute inset-0 rounded-full bg-pink-500/30 blur-xl animate-pulse" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-purple-900 to-pink-900 border border-pink-400/50 flex items-center justify-center shadow-lg shadow-purple-900/50">
              <Heart className="w-10 h-10 text-pink-300 fill-pink-400 filter drop-shadow-[0_0_8px_rgba(244,114,182,0.8)] animate-pulse-soft" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-amber-300 animate-bounce" />
          </div>
        </div>

        {/* Small dedication kicker */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/50 border border-purple-400/30 text-xs font-semibold text-pink-200 tracking-widest uppercase">
            <Stars className="w-3.5 h-3.5 text-pink-400" />
            <span>Una sorpresa para ti</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-title font-bold text-white tracking-tight leading-tight">
            Tengo algo especial para ti...
          </h1>

          <p className="font-script text-2xl sm:text-3xl text-pink-300 font-medium">
            {partnerName}
          </p>
        </div>

        {/* Romantic intro note */}
        <p className="text-slate-300 text-sm sm:text-base font-sans-body leading-relaxed max-w-sm mx-auto">
          He preparado este pequeño universo para recordarte lo hermosa que es nuestra historia y lo mucho que late mi corazón por ti cada segundo.
        </p>

        {/* Button to enter */}
        <div className="pt-2 flex flex-col items-center gap-3">
          <button
            onClick={onEnter}
            type="button"
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 rounded-full shadow-[0_0_25px_rgba(236,72,153,0.5)] hover:shadow-[0_0_35px_rgba(236,72,153,0.8)] transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer group"
          >
            <Sparkles className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
            <span>Entrar a nuestro universo</span>
            <Heart className="w-5 h-5 text-white fill-white group-hover:scale-125 transition-transform" />
          </button>

          <span className="text-[11px] text-purple-300/70 flex items-center gap-1.5 pt-1">
            <Volume2 className="w-3.5 h-3.5 text-pink-400" />
            <span>Música romántica incluida al entrar</span>
          </span>
        </div>
      </div>
    </div>
  );
};
