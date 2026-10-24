import React from 'react';
import { Heart, Sparkles, ChevronDown, Play, Pause, Camera, Mail } from 'lucide-react';
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
    <section id="inicio" className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 py-16 overflow-hidden z-10">
      <div className="relative z-10 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Typographic Hierarchy */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6">
          <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/70 border border-purple-500/30 text-xs font-semibold tracking-widest uppercase text-pink-300">
            <span className="text-white">Para {story.receiverName}</span>
            <span aria-hidden="true">·</span>
            <span>Nuestro Amor Eterno</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-title font-bold text-white tracking-tight leading-[1.15] text-balance">
            {story.heroHeadline}
          </h1>

          <p className="text-lg text-slate-300 font-sans-body max-w-xl leading-relaxed">
            {story.heroNote}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => {
                const el = document.getElementById('carta');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              type="button"
              className="px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 rounded-full shadow-[0_0_25px_rgba(236,72,153,0.4)] hover:shadow-[0_0_35px_rgba(236,72,153,0.7)] transition-all duration-300 flex items-center gap-2.5 cursor-pointer group transform hover:scale-105"
            >
              <Mail className="w-4 h-4 text-pink-200" />
              <span>Abrir Carta de Amor</span>
              <Heart className="w-4 h-4 fill-white text-white group-hover:scale-125 transition-transform" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('galeria');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              type="button"
              className="px-5 py-3.5 text-sm font-medium text-purple-200 bg-purple-950/70 hover:bg-purple-900/90 border border-purple-500/40 rounded-full shadow-sm hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-pink-400" />
              <span>Nuestras Fotos</span>
            </button>

            <button
              onClick={onToggleAudio}
              type="button"
              className="px-5 py-3.5 text-sm font-medium text-slate-200 bg-black/50 hover:bg-black/70 border border-purple-500/30 rounded-full transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              {isAudioPlaying ? (
                <>
                  <Pause className="w-4 h-4 text-pink-400" />
                  <span>Pausar Música</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-pink-400 fill-pink-400" />
                  <span>Música Romántica</span>
                </>
              )}
            </button>
          </div>

          {/* Date anchor */}
          <div className="pt-4 flex items-center gap-3 text-xs text-purple-300/80">
            <span className="inline-block w-8 h-[1px] bg-pink-500/50" />
            <span>
              Nuestra fecha especial:{' '}
              <strong className="text-pink-300">
                {new Date(story.anniversaryDate).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </strong>
            </span>
          </div>
        </div>

        {/* Right Column: Visual Artwork Frame (Romantic Polaroid & Cosmic Artwork) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm">
            {/* Polaroid backing frame in cosmic dark style */}
            <div className="p-4 bg-gradient-to-b from-[#1c0b38] via-[#120726] to-[#090214] backdrop-blur-xl rounded-3xl shadow-[0_0_40px_rgba(168,85,247,0.3)] border border-purple-500/40 rotate-2 hover:rotate-0 transition-transform duration-500">
              {/* Artistic Romantic Landscape Canvas */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-b from-purple-900/60 via-purple-950 to-black flex flex-col items-center justify-between p-6 text-center text-white border border-purple-500/20">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

                <div className="relative z-10 w-full flex justify-between items-center text-pink-300/90 text-xs">
                  <span>Nuestro Universo</span>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>

                {/* Silhouette & Heart Art */}
                <div className="relative z-10 my-auto flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-pink-500/20 border border-pink-400/50 flex items-center justify-center mb-4 backdrop-blur-sm shadow-[0_0_25px_rgba(236,72,153,0.6)] animate-pulse-soft">
                    <Heart className="w-12 h-12 text-pink-400 fill-pink-500/80 filter drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
                  </div>
                  <h3 className="text-xl font-serif-title font-bold text-white px-2 leading-tight">
                    {story.receiverName}
                  </h3>
                  <p className="text-xs text-pink-300 font-editorial italic mt-1 text-balance">
                    «365 días amándote con el alma»
                  </p>
                </div>

                <div className="relative z-10 w-full pt-4 border-t border-purple-500/30 text-[11px] text-pink-200/90 font-medium">
                  <span>Dedicado para ti con todo mi amor</span>
                </div>
              </div>

              {/* Bottom handwritten Polaroid note */}
              <div className="pt-3 pb-1 text-center">
                <span className="font-script text-2xl text-pink-300">
                  Para mi amor Dayana Estefania 💖
                </span>
              </div>
            </div>

            {/* Decorative Wax Seal pin on top corner */}
            <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-gradient-to-tr from-purple-700 to-pink-600 shadow-lg shadow-purple-900/60 flex items-center justify-center text-white border-2 border-pink-300/80 rotate-12">
              <span className="font-serif-title text-lg font-bold text-white">
                D
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Down indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-xs text-purple-300/60">
        <span>Desliza para ver más</span>
        <ChevronDown className="w-4 h-4 animate-bounce text-pink-400" />
      </div>
    </section>
  );
};
