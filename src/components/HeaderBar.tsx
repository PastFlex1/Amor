import React from 'react';
import { Volume2, VolumeX, Edit3, Share2, Maximize2, Minimize2, Sparkles } from 'lucide-react';

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
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-2 px-3 sm:px-8 py-2.5 sm:py-3.5 backdrop-blur-md bg-[#FAF6F0]/90 border-b border-rose-100/80 transition-all duration-300">
      {/* Title / Brand */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <span className="text-lg sm:text-2xl font-serif-title font-bold tracking-tight text-rose-950">
          Amour
        </span>
        <span className="text-xs font-sans-body tracking-wider text-rose-800 font-medium hidden sm:inline border-l border-rose-200 pl-3 truncate max-w-[200px] md:max-w-[280px]">
          Para {partnerName}
        </span>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Fullscreen Button */}
        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            type="button"
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              isFullscreen
                ? 'bg-rose-950 text-amber-200 border border-amber-300/40 shadow-sm'
                : 'bg-white hover:bg-rose-50 text-stone-700 border border-rose-200'
            }`}
            title={isFullscreen ? 'Salir de pantalla completa' : 'Ver libro en pantalla completa'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden md:inline">Salir</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-rose-700" />
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
          className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
            isAudioPlaying
              ? 'bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
          title={isAudioPlaying ? 'Música activa (Piano)' : 'Música en pausa'}
        >
          {isAudioPlaying ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span className="hidden lg:inline">Música On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden lg:inline">Música</span>
            </>
          )}
        </button>

        {/* Nuestro Futuro Button */}
        {onOpenFuture && (
          <button
            onClick={onOpenFuture}
            type="button"
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300/80 rounded-full shadow-2xs hover:shadow transition-all group cursor-pointer"
            title="Explorar nuestro futuro juntos por años y meses"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Futuro ✨</span>
          </button>
        )}

        {/* Share Button */}
        <button
          onClick={onShare}
          type="button"
          className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-full transition-all cursor-pointer"
          title="Compartir enlace con Dayana"
        >
          <Share2 className="w-3.5 h-3.5 text-rose-700" />
          <span className="hidden md:inline">Compartir</span>
        </button>

        {/* Editor Button */}
        <button
          onClick={onOpenEditor}
          type="button"
          className="flex items-center gap-1 px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded-full shadow-xs hover:shadow transition-all whitespace-nowrap cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isCustomized ? 'Editar' : 'Personalizar'}</span>
          <span className="sm:hidden">Editar</span>
        </button>
      </div>
    </header>
  );
};
