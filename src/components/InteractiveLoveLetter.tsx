import React, { useState } from 'react';
import { Mail, Heart, Check, Sparkles, X, ChevronUp, Lock } from 'lucide-react';
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
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setHasOpenedOnce(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <section id="carta" className="py-20 px-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 mb-12">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase text-rose-800">
          <span>Confidencial · Solo Para Tus Ojos</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif-title font-bold text-stone-900 tracking-tight text-balance">
          Una carta escrita desde el alma
        </h2>
        <p className="text-stone-600 text-sm max-w-md mx-auto">
          Toca el sello de cera para romper el lacrado y descubrir las palabras guardadas especialmente para ti.
        </p>
      </div>

      {/* Interactive Envelope & Letter Container */}
      <div className="flex flex-col items-center justify-center">
        {!isOpen ? (
          /* Sealed Envelope View */
          <div
            onClick={handleOpen}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpen(); }}
            className="group relative cursor-pointer w-full max-w-lg aspect-[1.5/1] bg-[#F7EBE1] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 flex flex-col justify-between border border-amber-200/80 overflow-hidden transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
          >
            {/* Envelope Flap Lines & Shadows */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#ECD7C7]/50 via-transparent to-[#E3C6B0]/30 pointer-events-none" />
            
            {/* Top diagonal folds */}
            <div className="absolute top-0 left-0 right-0 h-1/2 border-b border-amber-300/40 pointer-events-none" />

            {/* Recipient unboxed line */}
            <div className="relative z-10 flex justify-between items-start">
              <span className="text-xs font-serif-title italic text-stone-500">
                Correspondencia Privada
              </span>
              <span className="text-xs text-rose-800/70 font-mono">
                ♥ No. 01
              </span>
            </div>

            {/* Center: Addressed To in Calligraphy font */}
            <div className="relative z-10 text-center my-auto space-y-1">
              <p className="text-xs uppercase tracking-widest text-stone-500">Dedicado a:</p>
              <h3 className="font-script text-4xl sm:text-5xl text-rose-950 font-bold tracking-wide">
                {receiverName}
              </h3>
              <p className="text-xs text-stone-600 font-editorial italic">
                De parte de {senderName}
              </p>
            </div>

            {/* Bottom Wax Seal Button */}
            <div className="relative z-20 flex justify-center -mb-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                  letter.waxColor === 'gold'
                    ? 'bg-amber-600 border-2 border-amber-400 text-amber-100'
                    : letter.waxColor === 'rose'
                    ? 'bg-rose-600 border-2 border-rose-400 text-rose-100'
                    : 'bg-rose-950 border-2 border-rose-800 text-rose-200'
                }`}
              >
                <div className="flex flex-col items-center">
                  <Heart className="w-5 h-5 fill-current" />
                  <span className="text-[9px] font-bold tracking-widest uppercase">Abrir</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 text-center mt-2">
              <span className="text-xs text-stone-400 group-hover:text-rose-700 transition-colors">
                Haz clic en el sello para leer la carta
              </span>
            </div>
          </div>
        ) : (
          /* Opened Parchment Letter View */
          <div className="w-full max-w-2xl bg-[#FFFDF9] rounded-2xl shadow-2xl border border-amber-200/90 p-8 sm:p-12 relative transition-all duration-500 animate-fadeIn">
            {/* Subtle paper texture overlay */}
            <div className="absolute top-0 right-0 p-4">
              <button
                onClick={handleClose}
                type="button"
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
                title="Cerrar y guardar carta en el sobre"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Decorative Header */}
            <div className="border-b border-rose-100 pb-6 mb-8 text-center">
              <div className="w-8 h-8 mx-auto mb-2 text-rose-700">
                <Heart className="w-full h-full fill-rose-100 text-rose-700" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif-title font-bold text-stone-900 tracking-tight">
                {letter.title}
              </h3>
              <p className="text-xs text-rose-800/80 font-editorial italic mt-1">
                Dedicatoria para {receiverName}
              </p>
            </div>

            {/* Letter Body Paragraphs */}
            <div className="space-y-6 text-stone-700 font-editorial text-lg sm:text-xl leading-relaxed">
              {letter.paragraphs.map((p, index) => (
                <p key={index} className="indent-4 sm:indent-8">
                  {p}
                </p>
              ))}
            </div>

            {/* Signature Area */}
            <div className="mt-12 pt-8 border-t border-rose-100 flex flex-col items-end">
              <p className="font-script text-3xl sm:text-4xl text-rose-950 font-semibold">
                {letter.signature}
              </p>
              <p className="text-sm font-sans-body text-stone-500 mt-2">
                — {senderName}
              </p>
            </div>

            {/* Close / Fold Back Action */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleClose}
                type="button"
                className="px-5 py-2 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors flex items-center gap-2"
              >
                <ChevronUp className="w-4 h-4" />
                <span>Volver a guardar en el sobre</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
