import React, { useState } from 'react';
import { Calendar, MapPin, Sparkles, X, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { MemoryItem } from '../types';

interface TimelineMemoriesProps {
  memories: MemoryItem[];
  onOpenEditor: () => void;
}

export const TimelineMemories: React.FC<TimelineMemoriesProps> = ({
  memories,
  onOpenEditor
}) => {
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);

  // Artistic SVG presets for zero-broken image resilience
  const renderMemoryVisual = (memory: MemoryItem) => {
    if (memory.imageUrl) {
      return (
        <img
          src={memory.imageUrl}
          alt={memory.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      );
    }

    // Curated romantic CSS/SVG visual scenes based on presetStyle
    switch (memory.presetStyle) {
      case 'cafe_date':
        return (
          <div className="w-full h-full bg-gradient-to-tr from-amber-900 via-stone-800 to-amber-700 flex flex-col items-center justify-center p-6 text-white text-center">
            <span className="text-3xl mb-2">☕</span>
            <p className="font-serif-title font-semibold text-amber-100 text-lg">Cita y Café</p>
            <span className="text-xs text-amber-200/70 mt-1 font-editorial italic">Conversaciones infinitas</span>
          </div>
        );
      case 'stargazing':
        return (
          <div className="w-full h-full bg-gradient-to-b from-[#090A1A] via-[#1E112A] to-[#3B1536] flex flex-col items-center justify-center p-6 text-white text-center">
            <span className="text-3xl mb-2">✨</span>
            <p className="font-serif-title font-semibold text-rose-100 text-lg">Noche Estrellada</p>
            <span className="text-xs text-rose-200/70 mt-1 font-editorial italic">Bajo un mismo cielo</span>
          </div>
        );
      case 'beach_walk':
        return (
          <div className="w-full h-full bg-gradient-to-tr from-rose-900 via-stone-900 to-cyan-950 flex flex-col items-center justify-center p-6 text-white text-center">
            <span className="text-3xl mb-2">🌊</span>
            <p className="font-serif-title font-semibold text-rose-100 text-lg">Junto al Mar</p>
            <span className="text-xs text-rose-200/70 mt-1 font-editorial italic">Huellas sobre la arena</span>
          </div>
        );
      case 'celebration_wine':
        return (
          <div className="w-full h-full bg-gradient-to-tr from-rose-950 via-rose-900 to-amber-900 flex flex-col items-center justify-center p-6 text-white text-center">
            <span className="text-3xl mb-2">🥂</span>
            <p className="font-serif-title font-semibold text-amber-100 text-lg">Brindis de Amor</p>
            <span className="text-xs text-amber-200/70 mt-1 font-editorial italic">Celebrando cada día</span>
          </div>
        );
      default:
        return (
          <div className="w-full h-full bg-gradient-to-tr from-rose-900 via-rose-950 to-stone-950 flex flex-col items-center justify-center p-6 text-white text-center">
            <span className="text-3xl mb-2">🌹</span>
            <p className="font-serif-title font-semibold text-rose-100 text-lg">Momento Inolvidable</p>
            <span className="text-xs text-rose-200/70 mt-1 font-editorial italic">Guardado en el corazón</span>
          </div>
        );
    }
  };

  return (
    <section id="recuerdos" className="py-20 px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 mb-16">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase text-rose-800">
          <span>Álbum de Nuestra Historia</span>
          <span aria-hidden="true">·</span>
          <span>Momentos Inolvidables</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif-title font-bold text-stone-900 tracking-tight text-balance">
          Capítulos grabados en nuestra memoria
        </h2>
        <p className="text-stone-600 text-sm max-w-lg mx-auto">
          Cada foto y cada recuerdo es una página más del libro más hermoso que estamos escribiendo juntos.
        </p>
      </div>

      {/* Grid of Memory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {memories.map((memory, index) => (
          <div
            key={memory.id}
            onClick={() => setSelectedMemory(memory)}
            className="group cursor-pointer bg-white rounded-2xl border border-rose-100/90 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
          >
            {/* Visual media banner */}
            <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
              {renderMemoryVisual(memory)}
              
              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

              {/* Number tag top right */}
              <div className="absolute top-4 right-4 bg-stone-900/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[11px] font-mono tabular-nums">
                #{String(index + 1).padStart(2, '0')}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                {/* Clean unboxed metadata with separators */}
                <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                  <span className="flex items-center gap-1 text-rose-800">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(memory.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </span>
                  {memory.location && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 text-stone-500">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{memory.location}</span>
                      </span>
                    </>
                  )}
                </div>

                <h3 className="text-xl font-serif-title font-bold text-stone-900 group-hover:text-rose-900 transition-colors">
                  {memory.title}
                </h3>

                <p className="text-stone-600 text-sm font-sans-body line-clamp-3 leading-relaxed">
                  {memory.description}
                </p>
              </div>

              <div className="pt-2 border-t border-rose-50 flex items-center justify-between text-xs font-semibold text-rose-900">
                <span>Ver recuerdo completo</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal for Selected Memory */}
      {selectedMemory && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedMemory(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-rose-200 animate-fadeIn"
          >
            {/* Visual Box */}
            <div className="relative aspect-[16/10] bg-stone-900">
              {renderMemoryVisual(selectedMemory)}
              <button
                onClick={() => setSelectedMemory(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Text details */}
            <div className="p-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-medium text-rose-800">
                <span>{new Date(selectedMemory.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                {selectedMemory.location && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{selectedMemory.location}</span>
                  </>
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif-title font-bold text-stone-900">
                {selectedMemory.title}
              </h3>

              <p className="text-stone-700 text-base font-editorial leading-relaxed">
                {selectedMemory.description}
              </p>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setSelectedMemory(null)}
                  className="px-5 py-2 text-xs font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded-full transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
