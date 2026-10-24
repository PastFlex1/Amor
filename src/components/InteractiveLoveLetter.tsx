import React, { useState } from 'react';
import { Mail, Heart, Sparkles, X, ChevronUp, Lock } from 'lucide-react';
import { LoveStory } from '../types';

interface InteractiveLoveLetterProps {
  letter: LoveStory['letter'];
  senderName: string;
  receiverName: string;
}

export const InteractiveLoveLetter: React.FC<InteractiveLoveLetterProps> = ({
  letter,
  senderName,
  receiverName
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <section id="carta" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto relative z-10">
      {/* Header */}
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs font-semibold tracking-widest uppercase text-pink-300">
          <Mail className="w-3.5 h-3.5 text-pink-400" />
          <span>Confidencial · Solo Para Tus Ojos</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif-title font-bold text-white tracking-tight leading-tight text-balance">
          Una carta escrita desde el fondo de mi alma
        </h2>
        <p className="text-slate-300 text-sm max-w-md mx-auto">
          Toca el sobre lacrado para romper el sello y descubrir las palabras sinceras que guardo para ti.
        </p>
      </div>

      {/* Interactive Envelope & Letter Container */}
      <div className="flex flex-col items-center justify-center">
        {!isOpen ? (
          /* Sealed Cosmic Envelope View */
          <div
            onClick={handleOpen}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleOpen();
            }}
            className="group relative cursor-pointer w-full max-w-lg aspect-[1.55/1] rounded-2xl bg-gradient-to-b from-[#210c42] via-[#16072c] to-[#0d031c] border-2 border-purple-500/40 shadow-[0_0_35px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(236,72,153,0.45)] hover:border-pink-500/60 transition-all duration-500 p-8 flex flex-col justify-between overflow-hidden transform hover:-translate-y-1.5 focus:outline-none"
          >
            {/* Top envelope diagonal flap styling */}
            <div className="absolute top-0 left-0 right-0 h-1/2 border-b border-purple-400/20 bg-gradient-to-b from-purple-900/30 to-transparent pointer-events-none" />

            {/* Glowing Corner Accents */}
            <div className="absolute top-3 left-3 text-pink-400/70 text-xs">✦</div>
            <div className="absolute top-3 right-3 text-pink-400/70 text-xs">✦</div>
            <div className="absolute bottom-3 left-3 text-pink-400/70 text-xs">✦</div>
            <div className="absolute bottom-3 right-3 text-pink-400/70 text-xs">✦</div>

            {/* Top Bar inside envelope */}
            <div className="relative z-10 flex justify-between items-start text-xs text-purple-300">
              <span className="font-serif-title italic text-pink-200">
                Correspondencia Privada
              </span>
              <span className="font-mono text-pink-400 font-semibold">
                ♥ No. 01 · Universo
              </span>
            </div>

            {/* Center: Recipient in Calligraphy font */}
            <div className="relative z-10 text-center my-auto space-y-1">
              <p className="text-[11px] uppercase tracking-widest text-purple-300/80 font-medium">
                Dedicado con amor a:
              </p>
              <h3 className="font-script text-4xl sm:text-5xl text-white font-bold tracking-wide group-hover:text-pink-200 transition-colors">
                {receiverName}
              </h3>
              <p className="text-xs text-purple-300 font-editorial italic">
                De parte de {senderName}
              </p>
            </div>

            {/* Center Wax Seal Button */}
            <div className="relative z-20 flex justify-center -mb-5">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-tr from-pink-700 via-rose-600 to-pink-500 border-2 border-pink-300 shadow-[0_0_20px_rgba(244,63,94,0.6)] group-hover:shadow-[0_0_30px_rgba(244,63,94,0.9)] transition-all transform group-hover:scale-110">
                <div className="flex flex-col items-center">
                  <Heart className="w-6 h-6 fill-white text-white filter drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
                  <span className="text-[8px] font-bold tracking-widest uppercase text-white mt-0.5">
                    Abrir
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-10 text-center mt-3">
              <span className="text-xs text-purple-300/80 group-hover:text-pink-300 transition-colors">
                Toca el sello para abrir la carta ✨
              </span>
            </div>
          </div>
        ) : (
          /* Opened Love Letter View */
          <div className="w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#190833] via-[#120625] to-[#090213] border-2 border-pink-500/40 shadow-[0_0_60px_rgba(168,85,247,0.35)] p-8 sm:p-12 relative transition-all duration-500 animate-fadeIn backdrop-blur-2xl">
            {/* Close button */}
            <div className="absolute top-4 right-4">
              <button
                onClick={handleClose}
                type="button"
                className="p-2 text-slate-400 hover:text-white rounded-full bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 transition-colors"
                title="Guardar carta en el sobre"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Decorative Header */}
            <div className="border-b border-purple-500/30 pb-6 mb-8 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                <Heart className="w-5 h-5 fill-pink-400" />
              </div>
              <h3 className="text-2xl sm:text-4xl font-serif-title font-bold text-white tracking-tight">
                {letter.title}
              </h3>
              <p className="text-xs text-pink-300/80 font-editorial italic">
                Especialmente para {receiverName}
              </p>
            </div>

            {/* Letter Body Paragraphs in white / silver text */}
            <div className="space-y-6 text-slate-100 font-editorial text-lg sm:text-xl leading-relaxed">
              {letter.paragraphs.map((p, index) => (
                <p key={index} className="indent-4 sm:indent-8">
                  {p}
                </p>
              ))}
            </div>

            {/* Signature Area */}
            <div className="mt-12 pt-8 border-t border-purple-500/30 flex flex-col items-end">
              <p className="font-script text-3xl sm:text-4xl text-pink-300 font-semibold">
                {letter.signature}
              </p>
              <p className="text-sm font-sans-body text-purple-300/80 mt-2">
                — {senderName}
              </p>
            </div>

            {/* Close / Fold Back Action */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleClose}
                type="button"
                className="px-6 py-2.5 text-xs font-semibold text-white bg-purple-900/60 hover:bg-purple-800/80 border border-purple-400/30 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <ChevronUp className="w-4 h-4 text-pink-400" />
                <span>Volver a guardar en el sobre</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
