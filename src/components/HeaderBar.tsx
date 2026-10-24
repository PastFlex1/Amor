import React from 'react';
import { Volume2, VolumeX, Edit3, Share2, Maximize2, Minimize2, Sparkles, Heart } from 'lucide-react';

interface HeaderBarProps {
  partnerName: string;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  onOpenEditor: () => void;
  onOpenFuture?: () => void;
  onShare: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
  isCustomized: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  partnerName,
  isAudioPlaying,
  onToggleAudio,
  onOpenEditor,
  onOpenFuture,
  onShare,
  onToggleFullscreen,
  isFullscreen,
  isCustomized
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-2 px-3 sm:px-8 py-2.5 sm:py-3.5 backdrop-blur-xl bg-[#090314]/85 border-b border-purple-500/25 text-white transition-all duration-300">
      {/* Brand & Dedication */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={() => scrollTo('inicio')}
          className="flex items-center gap-2 text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-700 to-pink-600 flex items-center justify-center shadow-[0_0_12px_rgba(236,72,153,0.6)] group-hover:scale-105 transition-transform">
            <Heart className="w-4 h-4 fill-white text-white" />
          </div>
          <span className="text-lg sm:text-2xl font-serif-title font-bold tracking-tight text-white group-hover:text-pink-300 transition-colors">
            Amour
          </span>
        </button>

        <span className="text-xs font-sans-body tracking-wider text-pink-300/80 font-medium hidden sm:inline border-l border-purple-500/30 pl-3 truncate max-w-[180px] md:max-w-[260px]">
          Para {partnerName}
        </span>
      </div>

      {/* Center Nav Links (Hidden on small mobile, visible on tablet/desktop) */}
      <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-slate-300">
        <button
          onClick={() => scrollTo('inicio')}
          className="hover:text-pink-300 transition-colors cursor-pointer"
        >
          Inicio
        </button>
        <button
          onClick={() => scrollTo('contador')}
          className="hover:text-pink-300 transition-colors cursor-pointer"
        >
          Contador
        </button>
        <button
          onClick={() => scrollTo('carta')}
          className="hover:text-pink-300 transition-colors cursor-pointer"
        >
          Carta
        </button>
        <button
          onClick={() => scrollTo('galeria')}
          className="hover:text-pink-300 transition-colors cursor-pointer"
        >
          Fotos
        </button>
        <button
          onClick={() => scrollTo('libro')}
          className="hover:text-pink-300 transition-colors cursor-pointer"
        >
          Libro 12 Meses
        </button>
        <button
          onClick={() => scrollTo('sorpresa')}
          className="text-pink-400 hover:text-pink-300 font-semibold transition-colors cursor-pointer flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>Sorpresa</span>
        </button>
      </nav>

      {/* Action Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Fullscreen Button */}
        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            type="button"
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-purple-500/30 transition-all cursor-pointer"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Ver en pantalla completa'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-pink-400" />
                <span className="hidden md:inline">Salir</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-pink-400" />
                <span className="hidden md:inline">Pantalla Completa</span>
              </>
            )}
          </button>
        )}

        {/* Audio Toggle */}
        <button
          onClick={onToggleAudio}
          type="button"
          aria-label={isAudioPlaying ? 'Pausar música romántica' : 'Reproducir música romántica'}
          className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            isAudioPlaying
              ? 'bg-pink-900/70 text-pink-200 border border-pink-400/50 shadow-[0_0_12px_rgba(236,72,153,0.4)]'
              : 'bg-purple-950/60 text-slate-300 hover:bg-purple-900/70 border border-purple-500/30'
          }`}
          title={isAudioPlaying ? 'Música activa (Piano)' : 'Música en pausa'}
        >
          {isAudioPlaying ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
              <span className="hidden lg:inline">Música On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden lg:inline">Música</span>
            </>
          )}
        </button>

        {/* Share Button */}
        <button
          onClick={onShare}
          type="button"
          className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-purple-200 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 rounded-full transition-all cursor-pointer"
          title="Compartir dedicatoria"
        >
          <Share2 className="w-3.5 h-3.5 text-pink-400" />
          <span className="hidden md:inline">Compartir</span>
        </button>

        {/* Editor Button */}
        <button
          onClick={onOpenEditor}
          type="button"
          className="flex items-center gap-1 px-3 sm:px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all cursor-pointer whitespace-nowrap"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isCustomized ? 'Editar' : 'Personalizar'}</span>
          <span className="sm:hidden">Editar</span>
        </button>
      </div>
    </header>
  );
};
