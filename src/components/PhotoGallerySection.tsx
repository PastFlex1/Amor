import React, { useState } from 'react';
import {
  Heart,
  Calendar,
  MapPin,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Camera
} from 'lucide-react';
import { MonthMemory, LoveStory } from '../types';

interface PhotoGallerySectionProps {
  months: MonthMemory[];
  partnerName: string;
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({
  months,
  partnerName
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [likesMap, setLikesMap] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    months.forEach((m, idx) => {
      map[m.id] = m.likesCount || 25 + idx * 4;
    });
    return map;
  });
  const [pulsingHeartId, setPulsingHeartId] = useState<string | null>(null);

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikesMap((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
    setPulsingHeartId(id);
    setTimeout(() => setPulsingHeartId(null), 800);
  };

  const currentPhoto = selectedIdx !== null ? months[selectedIdx] : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx(selectedIdx > 0 ? selectedIdx - 1 : months.length - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx(selectedIdx < months.length - 1 ? selectedIdx + 1 : 0);
    }
  };

  // Artistic fallback scenes if no user image uploaded
  const renderVisual = (month: MonthMemory) => {
    if (month.imageUrl) {
      return (
        <img
          src={month.imageUrl}
          alt={month.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      );
    }

    // Curated romantic visual themes
    const gradients: Record<string, string> = {
      cafe_date: 'from-amber-950 via-purple-950 to-stone-900',
      stargazing: 'from-purple-950 via-[#19082f] to-[#0a0314]',
      celebration_wine: 'from-pink-950 via-purple-950 to-stone-950',
      rose_sunset: 'from-rose-950 via-purple-950 to-[#120722]',
      sweet_moments: 'from-fuchsia-950 via-purple-900 to-pink-950',
      cozy_home: 'from-purple-950 via-indigo-950 to-stone-950',
      beach_walk: 'from-cyan-950 via-purple-950 to-pink-950',
      adventure: 'from-purple-950 via-pink-950 to-amber-950',
      deep_talks: 'from-violet-950 via-purple-950 to-black'
    };

    const gradient = gradients[month.presetStyle || ''] || 'from-purple-950 via-fuchsia-950 to-black';

    return (
      <div className={`w-full h-full bg-gradient-to-tr ${gradient} flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative z-10 w-12 h-12 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center mb-3">
          <Heart className="w-6 h-6 text-pink-400 fill-pink-400/60" />
        </div>
        <p className="relative z-10 font-serif-title font-bold text-white text-base leading-tight max-w-[200px]">
          {month.title}
        </p>
        <span className="relative z-10 text-[11px] text-pink-300/80 font-editorial italic mt-1">
          {month.monthLabel}
        </span>
      </div>
    );
  };

  return (
    <section id="galeria" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto relative z-10">
      {/* Header */}
      <div className="text-center space-y-3 mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs font-semibold tracking-widest uppercase text-pink-300">
          <Camera className="w-3.5 h-3.5 text-pink-400" />
          <span>Nuestra Galería de Fotos</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif-title font-bold text-white tracking-tight leading-tight text-balance">
          Momentos capturados para siempre
        </h2>
        <p className="text-slate-300 text-sm max-w-md mx-auto">
          Toca cualquier foto para revivir los detalles de cada recuerdo, verla en grande y dejarle un latido.
        </p>
      </div>

      {/* Responsive Grid with Polaroid / Elegant Frames */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {months.map((month, idx) => {
          // Soft playful polaroid tilt
          const tilts = ['sm:-rotate-1', 'sm:rotate-1.5', 'sm:-rotate-1.5', 'sm:rotate-1', 'sm:rotate-0', 'sm:-rotate-2'];
          const tiltClass = tilts[idx % tilts.length];

          return (
            <div
              key={month.id}
              onClick={() => setSelectedIdx(idx)}
              className={`group cursor-pointer rounded-2xl p-3.5 bg-gradient-to-b from-[#1b0a33]/90 via-[#130726]/90 to-[#0b0317]/95 border border-purple-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(236,72,153,0.35)] hover:border-pink-500/60 transition-all duration-300 transform hover:-translate-y-2 hover:rotate-0 ${tiltClass} flex flex-col justify-between`}
            >
              {/* Photo Area */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/50 border border-purple-500/20">
                {renderVisual(month)}

                {/* Ambient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Top badges */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono font-medium text-pink-300 border border-purple-500/30">
                  {month.monthLabel}
                </div>

                <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-slate-300 group-hover:text-pink-300 transition-colors">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Caption Area */}
              <div className="pt-3 pb-1 px-1 space-y-2">
                <div className="flex items-center justify-between text-xs text-purple-300/80">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-pink-400" />
                    <span>{new Date(month.date).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}</span>
                  </div>
                  {month.location && (
                    <div className="flex items-center gap-1 text-[11px] truncate max-w-[140px]">
                      <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                      <span className="truncate">{month.location}</span>
                    </div>
                  )}
                </div>

                <h3 className="font-serif-title font-bold text-white text-base leading-snug group-hover:text-pink-200 transition-colors line-clamp-1">
                  {month.title}
                </h3>

                <p className="text-slate-300 text-xs font-sans-body line-clamp-2 leading-relaxed">
                  {month.story}
                </p>

                {/* Bottom Bar: Like Reaction */}
                <div className="pt-2 border-t border-purple-500/20 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-purple-300/70 font-script text-base">
                    Para Dayana ♥
                  </span>

                  <button
                    onClick={(e) => handleLike(e, month.id)}
                    type="button"
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-950/70 hover:bg-pink-950/70 border border-purple-400/30 hover:border-pink-400/60 text-pink-300 transition-all cursor-pointer group/btn"
                    title="Enviar un corazón a esta foto"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-transform ${
                        pulsingHeartId === month.id
                          ? 'scale-150 fill-pink-500 text-pink-500'
                          : 'fill-pink-500/70 text-pink-400 group-hover/btn:scale-125'
                      }`}
                    />
                    <span className="font-mono text-[11px] font-bold">
                      {likesMap[month.id] || 0}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {currentPhoto && selectedIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn"
          onClick={() => setSelectedIdx(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[92vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#1b0a33] via-[#120625] to-[#07020e] border border-pink-500/40 shadow-[0_0_60px_rgba(236,72,153,0.35)] flex flex-col md:flex-row overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedIdx(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Visual Box */}
            <div className="relative md:w-1/2 aspect-[4/3] md:aspect-auto min-h-[260px] bg-black flex items-center justify-center">
              {renderVisual(currentPhoto)}

              {/* Prev / Next Buttons */}
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-purple-900/80 text-white transition-colors border border-purple-500/30"
                title="Foto anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-purple-900/80 text-white transition-colors border border-purple-500/30"
                title="Siguiente foto"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Story & Details Box */}
            <div className="p-6 sm:p-8 md:w-1/2 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-medium text-pink-300">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-900/60 border border-purple-500/30">
                    {currentPhoto.monthLabel}
                  </span>
                  <span>·</span>
                  <span>{new Date(currentPhoto.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif-title font-bold text-white tracking-tight">
                  {currentPhoto.title}
                </h3>

                {currentPhoto.location && (
                  <div className="flex items-center gap-1.5 text-xs text-purple-300/80">
                    <MapPin className="w-3.5 h-3.5 text-pink-400" />
                    <span>{currentPhoto.location}</span>
                  </div>
                )}

                <p className="text-slate-200 text-sm sm:text-base font-sans-body leading-relaxed pt-2">
                  {currentPhoto.story}
                </p>

                {currentPhoto.anecdote && (
                  <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 space-y-1">
                    <span className="font-semibold text-pink-300 uppercase tracking-wider text-[10px]">
                      Momento especial:
                    </span>
                    <p className="italic">«{currentPhoto.anecdote}»</p>
                  </div>
                )}

                {currentPhoto.quote && (
                  <p className="font-editorial italic text-pink-200 text-base border-l-2 border-pink-400 pl-3 pt-1">
                    {currentPhoto.quote}
                  </p>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-purple-500/20 flex items-center justify-between">
                <button
                  onClick={(e) => handleLike(e, currentPhoto.id)}
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-pink-900/50 hover:bg-pink-800/70 border border-pink-400/40 text-pink-200 text-xs font-bold transition-all"
                >
                  <Heart className="w-4 h-4 fill-pink-400 text-pink-400" />
                  <span>{likesMap[currentPhoto.id] || 0} Me gusta</span>
                </button>

                <div className="text-xs text-slate-400">
                  {selectedIdx + 1} de {months.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
