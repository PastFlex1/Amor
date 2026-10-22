import React from 'react';
import { Heart, Sparkles, ChevronDown, Play, Pause, BookOpen } from 'lucide-react';
import { LoveStory } from '../types';

interface HeroSectionProps {
  story: LoveStory;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  story,
  isAudioPlaying,
  onToggleAudio,
  onExploreClick
}) => {
  return (
    <section id="inicio" className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-16 overflow-hidden">
      {/* Background soft ambient gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-rose-200/40 via-amber-100/30 to-pink-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Typographic Hierarchy */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium tracking-widest uppercase text-rose-800/90">
            <span className="font-semibold text-rose-950">Para {story.receiverName}</span>
            <span aria-hidden="true">·</span>
            <span>1 Año Juntos (12 Meses)</span>
            <span aria-hidden="true">·</span>
            <span>Con Todo Mi Amor</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-title font-bold text-stone-900 tracking-tight leading-[1.15] text-balance">
            {story.heroHeadline}
          </h1>

          <p className="text-lg text-stone-600 font-sans-body max-w-xl leading-relaxed">
            {story.heroNote}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onExploreClick}
              type="button"
              className="px-6 py-3.5 text-sm font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2.5 group"
            >
              <BookOpen className="w-4 h-4 text-amber-200" />
              <span>Abrir Libro de Recuerdos (12 Meses)</span>
              <Heart className="w-4 h-4 fill-rose-300 text-rose-300 group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={onToggleAudio}
              type="button"
              className="px-5 py-3.5 text-sm font-medium text-stone-700 bg-white/90 hover:bg-white border border-stone-200/90 rounded-full shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2"
            >
              {isAudioPlaying ? (
                <>
                  <Pause className="w-4 h-4 text-rose-700" />
                  <span>Pausar Música</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-rose-700 fill-rose-700" />
                  <span>Música Romántica</span>
                </>
              )}
            </button>
          </div>

          {/* Date anchor */}
          <div className="pt-4 flex items-center gap-3 text-xs text-stone-500">
            <span className="inline-block w-8 h-[1px] bg-rose-300" />
            <span>Nuestra fecha especial: {new Date(story.anniversaryDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Right Column: Visual Artwork Frame (Romantic Polaroid & Book Cover Preview) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm">
            {/* Polaroid backing frame */}
            <div className="p-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-100 rotate-2 hover:rotate-0 transition-transform duration-500">
              {/* Artistic Romantic Landscape Canvas */}
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gradient-to-b from-rose-900 via-rose-950 to-stone-950 flex flex-col items-center justify-between p-6 text-center text-white">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <div className="relative z-10 w-full flex justify-between items-center text-rose-200/80 text-xs">
                  <span>12 Meses Inolvidables</span>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>

                {/* Silhouette & Heart Art */}
                <div className="relative z-10 my-auto flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-rose-500/20 border border-rose-400/30 flex items-center justify-center mb-4 backdrop-blur-sm animate-pulse-soft">
                    <Heart className="w-12 h-12 text-rose-400 fill-rose-500/80 filter drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]" />
                  </div>
                  <h3 className="text-xl font-serif-title font-semibold text-rose-100 px-2 leading-tight">
                    {story.receiverName}
                  </h3>
                  <p className="text-xs text-rose-300/80 font-editorial italic mt-1 text-balance">
                    «365 días amándote con el alma»
                  </p>
                </div>

                <div className="relative z-10 w-full pt-4 border-t border-rose-800/40 text-[11px] text-amber-200/90 font-medium">
                  <span>Haz clic abajo para leer el libro completo</span>
                </div>
              </div>

              {/* Bottom handwritten Polaroid note */}
              <div className="pt-3 pb-1 text-center">
                <span className="font-script text-2xl text-stone-700">
                  Para mi amor Dayana Estefania ❤️
                </span>
              </div>
            </div>

            {/* Decorative Wax Seal pin on top corner */}
            <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-rose-900 shadow-md flex items-center justify-center text-white border-2 border-amber-300/50 rotate-12">
              <span className="font-serif-title text-lg font-bold text-amber-200">
                D
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Down indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-xs text-stone-400">
        <span>Desliza para abrir el libro</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  );
};
