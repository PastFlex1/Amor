import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
  Bookmark,
  Music,
  MapPin,
  Calendar,
  Maximize2,
  Minimize2,
  BookOpen,
  Volume2,
  VolumeX,
  Edit3,
  Trash2,
  X
} from 'lucide-react';
import { LoveStory, MonthMemory } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { TabType } from './EditorModal';

interface LoveBookProps {
  story: LoveStory;
  onOpenEditor: (tab?: TabType, monthIdx?: number) => void;
  onDeleteMonthImage?: (monthId: string) => void;
  onOpenFuture?: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  onLikeMonth?: (monthId: string) => void;
  onRedeemCoupon?: (couponId: string) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const LoveBook: React.FC<LoveBookProps> = ({
  story,
  onOpenEditor,
  onDeleteMonthImage,
  onOpenFuture,
  isAudioPlaying,
  onToggleAudio,
  onLikeMonth,
  onRedeemCoupon,
  isFullscreen: propIsFullscreen,
  onToggleFullscreen
}) => {
  // Page index:
  // 0: Portada (Libro cerrado)
  // 1: Prólogo & Índice de 12 Meses (Libro abierto en 2 páginas)
  // 2 to 13: Mes 1 al Mes 12 (12 pliegos abiertos en 2 páginas)
  // 14: Carta de Amor Sellada (Libro abierto en 2 páginas)
  // 15: Contraportada & Epílogo (Libro cerrado)
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [targetPage, setTargetPage] = useState<number>(0);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [coverTransition, setCoverTransition] = useState<
    'open-front' | 'close-front' | 'close-back' | 'open-back' | null
  >(null);
  const [selectedPhoto, setSelectedPhoto] = useState<MonthMemory | null>(null);
  const [internalFullscreen, setInternalFullscreen] = useState(false);
  const isFs = propIsFullscreen !== undefined ? propIsFullscreen : internalFullscreen;

  const isCover = currentPage === 0 && coverTransition === null;
  const isBackCover = currentPage === 15 && coverTransition === null;
  const isBookOpen = (!isCover && !isBackCover) || coverTransition !== null;

  const [monthLikes, setMonthLikes] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    story.months.forEach((m) => {
      initial[m.id] = m.likesCount || 20 + m.monthNumber * 3;
    });
    return initial;
  });
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const totalPages = 16;
  const bookContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const toggleFullscreen = () => {
    if (onToggleFullscreen) {
      onToggleFullscreen();
    } else {
      try {
        if (!isFs) {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
          }
          setInternalFullscreen(true);
        } else {
          if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          }
          setInternalFullscreen(false);
        }
      } catch {
        setInternalFullscreen((p) => !p);
      }
    }
  };

  const [mobileFacet, setMobileFacet] = useState<'left' | 'right'>('left');

  // Turn page with physical 3D center-spine leaf flip and cover opening swing
  const goToPage = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= totalPages || nextIndex === currentPage || isFlipping) return;
    setMobileFacet('left');

    // Transition 1: Opening from closed Front Cover (0 -> 1 or direct to any chapter)
    if (currentPage === 0) {
      setCoverTransition('open-front');
      setTargetPage(nextIndex);
      setIsFlipping(true);
      audioEngine.playPageFlip();
      setTimeout(() => {
        setCurrentPage(nextIndex);
        setCoverTransition(null);
        setIsFlipping(false);
      }, 850);
      return;
    }

    // Transition 2: Closing back to Front Cover (1 -> 0 or any chapter -> 0)
    if (nextIndex === 0) {
      setCoverTransition('close-front');
      setTargetPage(0);
      setIsFlipping(true);
      audioEngine.playPageFlip();
      setTimeout(() => {
        setCurrentPage(0);
        setCoverTransition(null);
        setIsFlipping(false);
      }, 850);
      return;
    }

    // Transition 3: Closing to Back Cover (14 -> 15 or any chapter -> 15)
    if (nextIndex === 15) {
      setCoverTransition('close-back');
      setTargetPage(15);
      setIsFlipping(true);
      audioEngine.playPageFlip();
      setTimeout(() => {
        setCurrentPage(15);
        setCoverTransition(null);
        setIsFlipping(false);
      }, 850);
      return;
    }

    // Transition 4: Reopening from Back Cover (15 -> 14 or 15 -> 1)
    if (currentPage === 15) {
      setCoverTransition(nextIndex === 1 ? 'open-front' : 'open-back');
      setTargetPage(nextIndex);
      setIsFlipping(true);
      audioEngine.playPageFlip();
      setTimeout(() => {
        setCurrentPage(nextIndex);
        setCoverTransition(null);
        setIsFlipping(false);
      }, 850);
      return;
    }

    // Normal internal page turn inside the open book (between pages 1 and 14)
    const dir = nextIndex > currentPage ? 'next' : 'prev';
    setFlipDirection(dir);
    setTargetPage(nextIndex);
    setIsFlipping(true);
    audioEngine.playPageFlip();

    // 700ms animation completion for realistic paper turning inside the open book
    setTimeout(() => {
      setCurrentPage(nextIndex);
      setIsFlipping(false);
    }, 700);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      goToPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0 && !isFlipping) {
      goToPage(currentPage - 1);
    }
  };

  // Keyboard navigation & ESC handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrev();
      } else if (e.key === 'Escape' && isFs) {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isFs, isFlipping]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 45) {
      // Swiped Left (Forward)
      if (typeof window !== 'undefined' && window.innerWidth < 1024 && currentPage >= 1 && currentPage <= 14 && mobileFacet === 'left') {
        setMobileFacet('right');
      } else {
        handleNext();
        setMobileFacet('left');
      }
    } else if (diff < -45) {
      // Swiped Right (Backward)
      if (typeof window !== 'undefined' && window.innerWidth < 1024 && currentPage >= 1 && currentPage <= 14 && mobileFacet === 'right') {
        setMobileFacet('left');
      } else {
        handlePrev();
        setMobileFacet('right');
      }
    }
    touchStartX.current = null;
  };

  // Like animation for month
  const handleLike = (monthId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMonthLikes((prev) => ({
      ...prev,
      [monthId]: (prev[monthId] || 0) + 1
    }));
    const rect = e.currentTarget.getBoundingClientRect();
    const newHeart = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    setFloatingHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1200);

    if (onLikeMonth) {
      onLikeMonth(monthId);
    }
  };

  // Visual artwork preset renderer
  const renderVisualArtwork = (month: MonthMemory) => {
    if (month.imageUrl) {
      return (
        <img
          src={month.imageUrl}
          alt={month.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
      );
    }

    switch (month.presetStyle) {
      case 'cafe_date':
        return (
          <div className="w-full h-full bg-gradient-to-br from-amber-950 via-stone-900 to-amber-800 flex flex-col items-center justify-center p-6 text-center text-amber-100">
            <span className="text-3xl mb-2 drop-shadow">☕</span>
            <span className="font-serif-title text-lg font-bold tracking-wide">Aroma & Café</span>
            <span className="text-xs text-amber-200/80 font-editorial italic mt-1 max-w-[200px]">
              Donde las horas se detuvieron al mirarte
            </span>
          </div>
        );
      case 'stargazing':
        return (
          <div className="w-full h-full bg-gradient-to-b from-[#0B0C1C] via-[#1E112A] to-[#3B1536] flex flex-col items-center justify-center p-6 text-center text-rose-100 relative overflow-hidden">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]" />
            <span className="text-3xl mb-2 relative z-10 drop-shadow">✨</span>
            <span className="font-serif-title text-lg font-bold tracking-wide relative z-10">Bajo las Estrellas</span>
            <span className="text-xs text-rose-200/80 font-editorial italic mt-1 max-w-[200px] relative z-10">
              Un millón de luces y solo brillabas tú
            </span>
          </div>
        );
      case 'beach_walk':
        return (
          <div className="w-full h-full bg-gradient-to-br from-rose-950 via-stone-900 to-cyan-950 flex flex-col items-center justify-center p-6 text-center text-rose-100">
            <span className="text-3xl mb-2 drop-shadow">🌊</span>
            <span className="font-serif-title text-lg font-bold tracking-wide">Orilla del Mar</span>
            <span className="text-xs text-cyan-200/80 font-editorial italic mt-1 max-w-[200px]">
              Olas, brisa y tus huellas junto a las mías
            </span>
          </div>
        );
      case 'celebration_wine':
        return (
          <div className="w-full h-full bg-gradient-to-br from-rose-950 via-rose-900 to-amber-900 flex flex-col items-center justify-center p-6 text-center text-amber-100">
            <span className="text-3xl mb-2 drop-shadow">🥂</span>
            <span className="font-serif-title text-lg font-bold tracking-wide">Brindis de Amor</span>
            <span className="text-xs text-amber-200/80 font-editorial italic mt-1 max-w-[200px]">
              Por cada segundo que nos regaló la vida
            </span>
          </div>
        );
      case 'rainy_day':
        return (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-950 to-stone-900 flex flex-col items-center justify-center p-6 text-center text-blue-100">
            <span className="text-3xl mb-2 drop-shadow">🌧️</span>
            <span className="font-serif-title text-lg font-bold tracking-wide">Tarde Lluviosa</span>
            <span className="text-xs text-blue-200/80 font-editorial italic mt-1 max-w-[200px]">
              Cobijas, café caliente y tu respiración en paz
            </span>
          </div>
        );
      case 'sweet_moments':
        return (
          <div className="w-full h-full bg-gradient-to-br from-rose-900 via-pink-950 to-stone-900 flex flex-col items-center justify-center p-6 text-center text-pink-100">
            <span className="text-3xl mb-2 drop-shadow">💌</span>
            <span className="font-serif-title text-lg font-bold tracking-wide">Dulces Detalles</span>
            <span className="text-xs text-pink-200/80 font-editorial italic mt-1 max-w-[200px]">
              Pequeños gestos que llenan el corazón
            </span>
          </div>
        );
      case 'cozy_home':
        return (
          <div className="w-full h-full bg-gradient-to-br from-amber-950 via-stone-900 to-stone-950 flex flex-col items-center justify-center p-6 text-center text-amber-100">
            <span className="text-3xl mb-2 drop-shadow">🏡</span>
            <span className="font-serif-title text-lg font-bold tracking-wide">Nuestro Refugio</span>
            <span className="text-xs text-amber-200/80 font-editorial italic mt-1 max-w-[200px]">
              El hogar que construimos en cada abrazo
            </span>
          </div>
        );
      default:
        return (
          <div className="w-full h-full bg-gradient-to-br from-rose-950 via-stone-900 to-rose-900 flex flex-col items-center justify-center p-6 text-center text-rose-100">
            <span className="text-3xl mb-2 drop-shadow">🌹</span>
            <span className="font-serif-title text-lg font-bold tracking-wide">Amor Eterno</span>
            <span className="text-xs text-rose-200/80 font-editorial italic mt-1 max-w-[200px]">
              Dayana Estefania en cada latido
            </span>
          </div>
        );
    }
  };

  // -------------------------------------------------------------
  // LEFT PAGE RENDERER (Páginas interiores 1 a 14)
  // -------------------------------------------------------------
  const renderLeftPage = (idx: number) => {
    // Prólogo (Page 1)
    if (idx === 1) {
      return (
        <div className="w-full h-full overflow-y-auto p-4 sm:p-7 lg:p-10 border-r border-stone-200/70 flex flex-col justify-between bg-[#FDFBF7] shadow-[inset_-12px_0_15px_-10px_rgba(0,0,0,0.04)] select-none">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-rose-800 uppercase">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Prólogo de Nuestra Historia</span>
            </div>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif-title font-bold text-stone-900">
              Para ti, mi adorada Dayana
            </h3>

            <div className="space-y-2.5 sm:space-y-3 text-stone-700 font-editorial text-sm sm:text-base lg:text-lg leading-relaxed pt-1 sm:pt-2">
              <p>
                «Un año no es solamente el transcurso de doce hojas de un calendario; para mí ha sido la bendición de encontrar en ti a mi mejor amiga, mi mayor confidente y el amor más puro que jamás imaginé.»
              </p>
              <p>
                «En este librito quise guardar la esencia de cada uno de nuestros doce meses. Cada risa, cada café, cada tarde de lluvia y cada abrazo que selló nuestro destino.»
              </p>
            </div>

            <div className="pt-3 sm:pt-4 border-t border-rose-100">
              <span className="font-script text-xl sm:text-2xl text-rose-900 block">
                Siempre tuyo con amor infinito.
              </span>
            </div>

            {/* Mobile CTA to see 12-Month Index */}
            <div className="lg:hidden pt-2">
              <button
                type="button"
                onClick={() => setMobileFacet('right')}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all cursor-pointer"
              >
                <span>Ver Índice de los 12 Meses</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-200" />
              </button>
            </div>
          </div>

          <div className="text-center pt-4 sm:pt-6 text-xs text-stone-400 font-mono">
            ~ Página I ~
          </div>
        </div>
      );
    }

    // Months (Pages 2 to 13): Polaroid Visual & Quote
    if (idx >= 2 && idx <= 13) {
      const monthIndex = idx - 2;
      const month = story.months[monthIndex] || story.months[0];
      const likes = monthLikes[month.id] || 25;

      return (
        <div className="w-full h-full overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#FDFBF7] border-r border-stone-200/70 flex flex-col justify-between relative shadow-[inset_-12px_0_15px_-10px_rgba(0,0,0,0.03)] select-none">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-rose-100/50">
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-rose-900 text-white text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase shadow-xs">
              {month.monthLabel}
            </span>
            <span className="text-[11px] sm:text-xs text-stone-500 font-mono">
              {new Date(month.date).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
            </span>
          </div>

          {/* Polaroid Visual */}
          <div className="my-auto py-2 flex flex-col items-center w-full">
            {/* Quick Actions Bar above Polaroid */}
            <div className="flex items-center justify-between w-full max-w-[260px] sm:max-w-[300px] mb-1 px-1">
              <span className="text-[10px] text-stone-400 font-mono">Foto del recuerdo</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onOpenEditor && onOpenEditor('book_months', monthIndex)}
                  className="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-rose-100 border border-stone-200 text-stone-700 hover:text-rose-900 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Cambiar o subir foto de este mes"
                >
                  <Edit3 className="w-2.5 h-2.5 text-rose-700" />
                  <span>{month.imageUrl ? 'Cambiar' : 'Subir'}</span>
                </button>
                {month.imageUrl && onDeleteMonthImage && (
                  <button
                    type="button"
                    onClick={() => onDeleteMonthImage(month.id)}
                    className="px-2 py-0.5 rounded-md bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Eliminar foto de este mes y volver a la ilustración"
                  >
                    <Trash2 className="w-2.5 h-2.5 text-red-600" />
                    <span>Eliminar</span>
                  </button>
                )}
              </div>
            </div>

            <div className="w-full max-w-[260px] sm:max-w-[300px] bg-white p-2.5 sm:p-3 pb-3 sm:pb-4 rounded-xl shadow-md border border-stone-200/90 rotate-[-1deg] hover:rotate-0 transition-transform duration-300 relative group">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] shadow-sm z-10 border border-white">
                ♥
              </div>

              <div
                onClick={() => setSelectedPhoto(month)}
                className="aspect-[4/3] rounded-lg overflow-hidden cursor-pointer relative bg-stone-900"
                title="Clic para ampliar foto"
              >
                {renderVisualArtwork(month)}
                <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-transparent transition-colors" />
                <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="pt-2 text-center">
                <p className="font-script text-lg sm:text-xl text-stone-700 leading-tight">
                  {month.location || 'Momentos de amor'}
                </p>
              </div>
            </div>

            {month.quote && (
              <p className="text-xs sm:text-sm font-editorial italic text-stone-600 text-center mt-2.5 max-w-xs px-2 leading-snug">
                {month.quote}
              </p>
            )}

            {/* Mobile CTA to read story */}
            <div className="lg:hidden w-full max-w-[260px] sm:max-w-[300px] pt-3">
              <button
                type="button"
                onClick={() => setMobileFacet('right')}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 hover:from-rose-800 hover:to-rose-900 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all cursor-pointer"
              >
                <span>Leer relato de este mes</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-300" />
              </button>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-2.5 border-t border-rose-100 flex items-center justify-between text-xs">
            <button
              onClick={(e) => handleLike(month.id, e)}
              className="relative px-3 py-1 rounded-full bg-white hover:bg-rose-50 border border-rose-200 text-rose-800 font-semibold flex items-center gap-1.5 transition-all shadow-2xs group"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 group-hover:scale-125 transition-transform" />
              <span className="text-[11px] sm:text-xs">Me enamoró ({likes})</span>

              {floatingHearts.map((h) => (
                <span
                  key={h.id}
                  className="absolute pointer-events-none text-rose-500 font-bold animate-ping text-xs"
                  style={{ left: h.x, top: h.y }}
                >
                  ❤️
                </span>
              ))}
            </button>

            {month.songRecommendation && (
              <span className="text-[11px] text-stone-500 flex items-center gap-1 truncate max-w-[140px] sm:max-w-[170px]" title={month.songRecommendation}>
                <Music className="w-3 h-3 text-rose-700 shrink-0" />
                <span className="truncate">{month.songRecommendation}</span>
              </span>
            )}
          </div>
        </div>
      );
    }

    // Carta Solemne Parte 1 (Page 14)
    if (idx === 14) {
      return (
        <div className="w-full h-full overflow-y-auto p-4 sm:p-7 lg:p-10 bg-[#FAF5EC] border-r border-stone-200/70 flex flex-col justify-between shadow-[inset_-12px_0_15px_-10px_rgba(0,0,0,0.04)] select-none">
          <div className="space-y-3 sm:space-y-4">
            <span className="text-xs font-semibold tracking-widest text-rose-800 uppercase block">
              Carta Solemne de Aniversario
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif-title font-bold text-stone-900">
              {story.letter.title}
            </h3>
            <p className="text-xs text-stone-500">
              Para {story.receiverName}
            </p>
            <div className="space-y-2.5 sm:space-y-3 font-editorial text-stone-800 text-sm sm:text-base lg:text-lg leading-relaxed pt-1 sm:pt-2">
              <p>«{story.letter.paragraphs[0] || ''}»</p>
              {story.letter.paragraphs[1] && <p>«{story.letter.paragraphs[1]}»</p>}
            </div>

            {/* Mobile CTA to read letter part 2 and signature */}
            <div className="lg:hidden pt-3">
              <button
                type="button"
                onClick={() => setMobileFacet('right')}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all cursor-pointer"
              >
                <span>Leer Parte II y Firma</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-200" />
              </button>
            </div>
          </div>
          <div className="text-center pt-4 text-xs text-stone-400 font-mono">
            ~ Carta Parte I ~
          </div>
        </div>
      );
    }

    return null;
  };

  // -------------------------------------------------------------
  // RIGHT PAGE RENDERER (Páginas interiores 1 a 14)
  // -------------------------------------------------------------
  const renderRightPage = (idx: number) => {
    // Índice de los 12 Meses (Page 1)
    if (idx === 1) {
      return (
        <div className="w-full h-full overflow-y-auto p-4 sm:p-7 lg:p-10 flex flex-col justify-between bg-[#FCF8F2] shadow-[inset_12px_0_15px_-10px_rgba(0,0,0,0.04)] select-none">
          <div className="space-y-3 sm:space-y-4">
            {/* Mobile Back to Prologue */}
            <div className="lg:hidden pb-1.5 border-b border-rose-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMobileFacet('left')}
                className="text-xs text-rose-800 hover:text-rose-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Volver al Prólogo</span>
              </button>
              <span className="text-[10px] font-mono text-stone-400">Pág. II</span>
            </div>

            <div className="text-center pb-2 border-b border-rose-200/60">
              <h4 className="font-serif-title text-lg sm:text-xl font-bold text-stone-900">
                Índice de los 12 Meses
              </h4>
              <span className="text-xs text-stone-500 font-editorial italic">
                Haz clic en cualquier mes para ir directo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {story.months.map((m, mIdx) => (
                <button
                  key={m.id}
                  onClick={() => goToPage(mIdx + 2)}
                  className="p-2.5 rounded-xl bg-white/90 hover:bg-rose-50 border border-rose-100 hover:border-rose-300 text-left transition-all flex items-center justify-between group shadow-2xs"
                >
                  <div className="truncate mr-2">
                    <span className="font-semibold text-rose-900 block text-xs">
                      Mes {m.monthNumber}
                    </span>
                    <span className="text-[11px] text-stone-600 truncate block">
                      {m.title}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-rose-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>

            {onOpenFuture && (
              <button
                type="button"
                onClick={onOpenFuture}
                className="w-full mt-1.5 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-amber-100/90 via-rose-100/90 to-amber-100/90 hover:from-amber-200 hover:to-rose-200 border border-amber-300 text-stone-900 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer group"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700 group-hover:rotate-12 transition-transform" />
                <span>Explorar la Cápsula del Futuro (Años, Fotos & Videos) ✨</span>
              </button>
            )}
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-stone-500 border-t border-rose-100">
            <button
              onClick={handlePrev}
              className="hover:text-rose-800 flex items-center gap-1 font-medium cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Cerrar Portada
            </button>
            <span className="font-mono text-stone-400">~ Página II ~</span>
            <button
              onClick={handleNext}
              className="hover:text-rose-800 flex items-center gap-1 font-semibold text-rose-900 cursor-pointer"
            >
              Mes 1 <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      );
    }

    // Months (Pages 2 to 13): Literary Narrative & Anecdote
    if (idx >= 2 && idx <= 13) {
      const monthIndex = idx - 2;
      const month = story.months[monthIndex] || story.months[0];

      return (
        <div className="w-full h-full overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#FCF8F2] flex flex-col justify-between shadow-[inset_12px_0_15px_-10px_rgba(0,0,0,0.03)] select-none">
          <div className="space-y-3 sm:space-y-4">
            {/* Mobile Back to Photo */}
            <div className="lg:hidden pb-1.5 border-b border-rose-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMobileFacet('left')}
                className="text-xs text-rose-800 hover:text-rose-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Ver foto del recuerdo</span>
              </button>
              <span className="text-[10px] font-mono text-stone-400">Relato Mes {month.monthNumber}</span>
            </div>

            {/* Location & date + Direct Edit Button */}
            <div className="flex items-center justify-between border-b border-rose-100/60 pb-2">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-rose-800 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-600" />
                  <span>{new Date(month.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </span>
                {month.location && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 text-stone-500">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span className="truncate max-w-[140px] sm:max-w-none">{month.location}</span>
                    </span>
                  </>
                )}
              </div>

              {onOpenEditor && (
                <button
                  type="button"
                  onClick={() => onOpenEditor('book_months', monthIndex)}
                  className="px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 text-[10px] sm:text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-2xs shrink-0"
                  title="Editar el relato, título o fecha de este mes"
                >
                  <Edit3 className="w-3 h-3 text-rose-700" />
                  <span>Editar</span>
                </button>
              )}
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif-title font-bold text-stone-900 tracking-tight leading-snug">
              {month.title}
            </h3>

            {/* Story */}
            <div className="prose text-stone-700 font-editorial text-sm sm:text-base lg:text-lg leading-relaxed space-y-2.5 pt-1">
              <p>{month.story}</p>
            </div>

            {/* Anecdote Box */}
            {month.anecdote && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-stone-800 space-y-1 mt-2.5 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>El detalle que nunca olvidaré:</span>
                </div>
                <p className="text-xs sm:text-sm font-sans-body text-stone-700 italic">
                  «{month.anecdote}»
                </p>
              </div>
            )}
          </div>

          {/* Bottom */}
          <div className="pt-4 sm:pt-6 border-t border-rose-100 flex items-center justify-between text-xs text-stone-500">
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && window.innerWidth < 1024 && mobileFacet === 'right') {
                  setMobileFacet('left');
                } else {
                  handlePrev();
                }
              }}
              className="hover:text-rose-900 flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{typeof window !== 'undefined' && window.innerWidth < 1024 ? 'Ver Foto' : 'Anterior'}</span>
            </button>

            <div className="font-mono text-stone-400 text-[11px] sm:text-xs">
              ~ Mes {month.monthNumber} de 12 ~
            </div>

            <button
              onClick={() => {
                handleNext();
                setMobileFacet('left');
              }}
              className="hover:text-rose-900 flex items-center gap-1 font-semibold text-rose-900 transition-colors cursor-pointer"
            >
              <span>{monthIndex === 11 ? 'Carta Final' : `Mes ${month.monthNumber + 1}`}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    }

    // Carta Solemne Parte 2 (Page 14)
    if (idx === 14) {
      return (
        <div className="w-full h-full overflow-y-auto p-4 sm:p-7 lg:p-10 bg-[#FAF5EC] flex flex-col justify-between shadow-[inset_12px_0_15px_-10px_rgba(0,0,0,0.04)] select-none">
          <div className="space-y-3 sm:space-y-4">
            {/* Mobile Back to Letter Part 1 */}
            <div className="lg:hidden pb-1.5 border-b border-rose-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMobileFacet('left')}
                className="text-xs text-rose-800 hover:text-rose-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Leer Parte I</span>
              </button>
              <span className="text-[10px] font-mono text-stone-400">Epílogo</span>
            </div>

            <div className="space-y-2.5 sm:space-y-3 font-editorial text-stone-800 text-sm sm:text-base lg:text-lg leading-relaxed pt-1 sm:pt-2">
              {story.letter.paragraphs.slice(2).map((para, pIdx) => (
                <p key={pIdx}>«{para}»</p>
              ))}
            </div>

            <div className="pt-4 sm:pt-6 text-right space-y-1 border-t border-rose-100">
              <span className="font-script text-2xl sm:text-3xl text-rose-900 block">
                {story.letter.signature}
              </span>
              <span className="text-xs text-stone-500 font-sans-body">
                — {story.senderName}
              </span>
            </div>
          </div>

          <div className="pt-4 sm:pt-6 border-t border-rose-200/60 flex items-center justify-between text-xs text-stone-500">
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && window.innerWidth < 1024 && mobileFacet === 'right') {
                  setMobileFacet('left');
                } else {
                  handlePrev();
                }
              }}
              className="hover:text-rose-900 flex items-center gap-1 font-medium cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> {typeof window !== 'undefined' && window.innerWidth < 1024 ? 'Parte I' : 'Mes 12'}
            </button>
            <span className="font-mono text-stone-400">~ Epílogo ~</span>
            <button
              onClick={handleNext}
              className="hover:text-rose-900 flex items-center gap-1 font-semibold text-rose-900 cursor-pointer"
            >
              Cerrar Libro <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  // -------------------------------------------------------------
  // GUARDAS DEL LIBRO (Vintage marbled endpaper for inside covers)
  // -------------------------------------------------------------
  const renderEndpaper = (side: 'front' | 'back' = 'front') => (
    <div className="w-full h-full bg-gradient-to-br from-[#F5ECE1] via-[#EFE5D6] to-[#E5D7C3] p-8 flex flex-col items-center justify-center text-center select-none border-r border-amber-900/10 relative overflow-hidden shadow-inner">
      <div className="absolute inset-4 sm:inset-6 border border-amber-800/15 rounded-xl pointer-events-none" />
      <div className="w-16 h-16 rounded-full bg-amber-900/5 border border-amber-800/20 flex items-center justify-center mb-3">
        <Heart className="w-6 h-6 text-rose-900/40" />
      </div>
      <span className="font-serif-title text-sm tracking-widest text-amber-950/70 uppercase">
        Amour · {side === 'front' ? 'Guardas del Libro' : 'Colofón del Primer Año'}
      </span>
      <span className="font-editorial italic text-xs text-stone-500 mt-1 max-w-[220px]">
        {side === 'front'
          ? 'Para mi amada Dayana Estefania Cuascota Cuascota'
          : 'Dedicado con amor eterno que nunca terminará'}
      </span>
    </div>
  );

  // -------------------------------------------------------------
  // PORTADA FACE RENDERER (Used in closed cover & flipping leaf)
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // PORTADA FACE RENDERER (Used in closed cover & flipping leaf)
  // -------------------------------------------------------------
  const renderCoverFace = (isInsideLeaf = false) => (
    <div className="w-full h-full min-h-[480px] sm:min-h-[580px] lg:min-h-[640px] rounded-2xl bg-gradient-to-br from-[#4A0E17] via-[#350A11] to-[#1F050A] text-white p-5 sm:p-8 lg:p-12 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-inner select-none">
      {/* Gold filigree borders */}
      <div className="absolute inset-3 sm:inset-6 border-2 border-amber-300/40 rounded-xl pointer-events-none" />
      <div className="absolute inset-5 sm:inset-8 border border-amber-300/20 rounded-lg pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 space-y-1.5 sm:space-y-2 pt-2 sm:pt-4">
        <span className="text-amber-300/90 tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[10px] sm:text-xs font-medium">
          Edición de Amor Eterno · 365 Días
        </span>
        <div className="h-[1px] w-20 sm:w-24 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent mx-auto" />
      </div>

      {/* Center Title & Crest */}
      <div className="relative z-10 my-auto py-4 sm:py-8 space-y-4 sm:space-y-6 max-w-md">
        <div className="w-18 h-18 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-br from-rose-600 via-rose-800 to-rose-950 shadow-2xl border-4 border-amber-400/50 flex items-center justify-center relative animate-pulse-soft">
          <span className="font-serif-title text-3xl sm:text-4xl font-bold text-amber-200 drop-shadow-md">
            D
          </span>
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 absolute -top-1 -right-1" />
        </div>

        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif-title font-bold text-amber-100 tracking-tight drop-shadow-lg leading-tight">
            Nuestro Primer Año
          </h1>
          <p className="text-sm sm:text-base lg:text-lg font-editorial italic text-amber-200/90">
            Doce meses recordando cada instante inolvidable
          </p>
        </div>

        <div className="p-3 sm:p-4 bg-black/25 backdrop-blur-sm rounded-2xl border border-amber-300/30">
          <span className="text-[10px] sm:text-xs text-amber-200/70 tracking-widest uppercase block mb-0.5 sm:mb-1">
            Dedicado con todo mi corazón para:
          </span>
          <span className="text-lg sm:text-2xl font-serif-title font-bold text-white tracking-wide">
            {story.receiverName}
          </span>
        </div>
      </div>

      {/* Bottom Action: Open the book! */}
      <div className="relative z-10 pb-2 sm:pb-4 space-y-2 sm:space-y-3">
        {!isInsideLeaf && (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button
              onClick={() => goToPage(1)}
              type="button"
              className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-serif-title font-bold text-xs sm:text-base shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <span>Abrir Libro de Recuerdos</span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-stone-950" />
            </button>

            <button
              onClick={toggleFullscreen}
              type="button"
              className="px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-amber-300/40 text-amber-200 font-serif-title text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {isFs ? <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              <span>{isFs ? 'Ventana' : 'Pantalla Completa'}</span>
            </button>
          </div>
        )}
        <p className="text-[10px] sm:text-[11px] text-amber-200/60 font-sans-body">
          {isInsideLeaf ? 'Abriendo historia de amor...' : 'Haz clic para abrir el libro y comenzar a leer'}
        </p>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // CONTRAPORTADA FACE RENDERER (Used in closed back & flipping leaf)
  // -------------------------------------------------------------
  const renderBackCoverFace = (isInsideLeaf = false) => {
    const start = new Date(story.anniversaryDate).getTime();
    const daysTogether = Math.max(1, Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24)));

    return (
      <div className="w-full h-full min-h-[480px] sm:min-h-[580px] lg:min-h-[640px] rounded-2xl bg-gradient-to-br from-[#2D0B14] via-[#1F060E] to-[#120207] text-white p-4 sm:p-7 lg:p-10 flex flex-col justify-between text-center relative overflow-hidden shadow-inner select-none">
        <div className="space-y-3 sm:space-y-4 max-w-md mx-auto pt-2 sm:pt-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center mx-auto text-rose-400 animate-pulse-soft">
            <Heart className="w-6 h-6 sm:w-7 sm:h-7 fill-rose-500 text-rose-500" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif-title font-bold text-amber-100">
              Gracias por este Primer Año, Dayana
            </h3>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-white/10 border border-amber-300/30 text-amber-200 text-[11px] sm:text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{daysTogether} días · 12 meses de amor puro</span>
            </div>
          </div>

          <p className="text-stone-300 text-xs sm:text-sm font-editorial italic leading-relaxed max-w-sm mx-auto">
            «365 días amándote, y este es apenas el primer tomo de la historia más hermosa que jamás se ha escrito. Te amo con cada latido de mi corazón, Dayana Estefania.»
          </p>

          {/* Vales de amor de Dayana */}
          <div className="space-y-2 pt-2 text-left">
            <span className="text-[11px] text-amber-200/80 uppercase tracking-widest font-semibold block text-center">
              Vales de amor para que canjees cuando quieras:
            </span>
            <div className="grid grid-cols-1 gap-2">
              {story.coupons.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => !isInsideLeaf && onRedeemCoupon && onRedeemCoupon(c.id)}
                  disabled={c.redeemed || isInsideLeaf}
                  className={`p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between text-left ${
                    c.redeemed
                      ? 'bg-white/5 border-white/10 text-stone-400 line-through'
                      : 'bg-white/10 hover:bg-white/20 border-amber-300/30 text-amber-100 shadow-2xs hover:scale-[1.01]'
                  }`}
                >
                  <span className="truncate pr-2 font-medium">{c.title}</span>
                  <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${c.redeemed ? 'bg-stone-800 text-stone-400' : 'bg-rose-900 text-amber-200'}`}>
                    {c.redeemed ? 'Canjeado ✓' : 'Canjear ♥'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {!isInsideLeaf && (
            <div className="pt-3 flex flex-col items-center justify-center gap-2.5">
              {onOpenFuture && (
                <button
                  onClick={onOpenFuture}
                  type="button"
                  className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-rose-950/60 border border-amber-300/40 cursor-pointer animate-pulse-soft"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>✨ Ver Nuestro Futuro Juntos (Años, Fotos & Videos) ➔</span>
                </button>
              )}

              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  onClick={() => goToPage(1)}
                  type="button"
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 text-xs font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Reabrir Libro</span>
                </button>

                <button
                  onClick={() => goToPage(0)}
                  type="button"
                  className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-amber-300/40 text-amber-200 text-xs font-semibold transition-all cursor-pointer"
                >
                  Ir a la Portada
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-rose-900/60 text-xs text-rose-300/60 flex items-center justify-between">
          {!isInsideLeaf ? (
            <button
              onClick={() => goToPage(14)}
              className="hover:text-amber-200 flex items-center gap-1 font-medium cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Carta de Amor
            </button>
          ) : (
            <span />
          )}
          <span className="font-editorial italic">Fin del Tomo I · Siempre Tuyos</span>
        </div>
      </div>
    );
  };

  return (
    <section
      id="libro"
      className={`transition-all duration-300 ${
        isFs
          ? 'fixed inset-0 z-50 bg-[#160408]/98 backdrop-blur-2xl flex flex-col justify-between p-2 sm:p-6 overflow-y-auto'
          : 'relative py-4 sm:py-8 px-2 sm:px-6 max-w-6xl mx-auto overflow-hidden'
      }`}
    >
      {/* Decorative ambient background glows */}
      {!isFs && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-rose-200/30 via-amber-100/30 to-pink-100/20 rounded-full blur-3xl pointer-events-none" />
      )}

      {/* Header Banner (only when NOT in fullscreen) */}
      {!isFs && (
        <div className="text-center space-y-2 sm:space-y-3 mb-4 sm:mb-8 px-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-purple-950/70 border border-purple-500/40 text-pink-300 text-[11px] sm:text-xs font-semibold tracking-wider uppercase shadow-xs">
            <BookOpen className="w-3.5 h-3.5 text-pink-400" />
            <span>Libro Conmemorativo · 1 Año Juntos</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif-title font-bold text-white tracking-tight leading-tight">
            Nuestra Historia en 12 Capítulos
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm lg:text-base max-w-2xl mx-auto font-sans-body">
            Pasa las páginas mes a mes para revivir cada uno de los momentos más hermosos que vivimos juntos,
            <span className="font-semibold text-pink-300 block sm:inline"> Dayana Estefania Cuascota Cuascota</span>.
          </p>
        </div>
      )}

      {/* Fullscreen Top Control Bar (when in fullscreen) */}
      {isFs && (
        <div className="flex items-center justify-between gap-2 sm:gap-4 pb-3 sm:pb-4 border-b border-purple-900/60 max-w-6xl w-full mx-auto text-white shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5 truncate mr-2">
            <span className="font-serif-title text-base sm:text-xl font-bold text-pink-200 truncate">
              Amour · Primer Año
            </span>
            <span className="text-xs text-purple-300 font-editorial italic hidden sm:inline">
              Para {story.receiverName}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onToggleAudio}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-purple-900/60 hover:bg-purple-800/80 border border-purple-500/30 text-xs text-pink-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isAudioPlaying ? <Volume2 className="w-3.5 h-3.5 text-pink-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
              <span className="hidden sm:inline">{isAudioPlaying ? 'Música On' : 'Música'}</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-pink-900/40 hover:bg-pink-800/60 border border-pink-400/50 text-pink-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              title="Salir de pantalla completa (ESC)"
            >
              <Minimize2 className="w-3.5 h-3.5 text-pink-300" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick Month Navigation Ribbon */}
      <div className={`flex items-center justify-start sm:justify-center overflow-x-auto py-2 px-1 sm:px-2 no-scrollbar max-w-full ${isFs ? 'my-2 sm:my-3 shrink-0' : 'mb-4 sm:mb-8'}`}>
        <div className="inline-flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-[#140628]/95 backdrop-blur-xl rounded-2xl border border-purple-500/40 shadow-lg shrink-0">
          <button
            onClick={() => goToPage(0)}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-medium transition-all shrink-0 cursor-pointer ${
              currentPage === 0
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm font-semibold'
                : 'text-purple-200 hover:bg-purple-900/60'
            }`}
          >
            Portada
          </button>

          <button
            onClick={() => goToPage(1)}
            className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-medium transition-all shrink-0 cursor-pointer ${
              currentPage === 1
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm font-semibold'
                : 'text-purple-200 hover:bg-purple-900/60'
            }`}
          >
            Índice
          </button>

          <div className="h-3.5 sm:h-4 w-[1px] bg-purple-500/40 mx-0.5 sm:mx-1" />

          {story.months.map((m, idx) => {
            const pageNum = idx + 2;
            const isActive = currentPage === pageNum;
            return (
              <button
                key={m.id}
                onClick={() => goToPage(pageNum)}
                title={m.title}
                className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-medium transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm font-semibold scale-105'
                    : 'text-purple-200 hover:bg-purple-900/60'
                }`}
              >
                <span>M{m.monthNumber}</span>
              </button>
            );
          })}

          <div className="h-3.5 sm:h-4 w-[1px] bg-rose-200 mx-0.5 sm:mx-1" />

          <button
            onClick={() => goToPage(14)}
            className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-medium transition-all shrink-0 cursor-pointer ${
              currentPage === 14
                ? 'bg-rose-900 text-white shadow-xs font-semibold'
                : 'text-stone-600 hover:bg-rose-50'
            }`}
          >
            Carta
          </button>

          <button
            onClick={() => goToPage(15)}
            className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-medium transition-all shrink-0 cursor-pointer ${
              currentPage === 15
                ? 'bg-rose-900 text-white shadow-xs font-semibold'
                : 'text-stone-600 hover:bg-rose-50'
            }`}
          >
            Final
          </button>

          <div className="h-3.5 sm:h-4 w-[1px] bg-rose-200 mx-0.5 sm:mx-1" />

          {/* Fullscreen button */}
          <button
            onClick={toggleFullscreen}
            type="button"
            className="px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-900 transition-all shrink-0 flex items-center gap-1 cursor-pointer"
            title={isFs ? 'Salir de pantalla completa' : 'Ver libro en pantalla completa'}
          >
            {isFs ? <Minimize2 className="w-3.5 h-3.5 text-rose-800" /> : <Maximize2 className="w-3.5 h-3.5 text-rose-800" />}
            <span className="hidden md:inline">{isFs ? 'Salir' : 'Pantalla Completa'}</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* CASE 1: PORTADA CERRADA (UN SOLO LIBRO COMPLETO, NO PARTIDO) */}
      {/* ============================================================== */}
      {isCover && (
        <div className="relative mx-auto w-full max-w-md sm:max-w-xl transition-all duration-500 my-auto">
          {/* Closed Hardcover Book Shell */}
          <div className="relative rounded-3xl bg-[#2D0B14] p-2.5 sm:p-5 shadow-[0_20px_50px_-15px_rgba(45,11,20,0.65)] border-2 sm:border-4 border-[#3D141F] border-l-[8px] sm:border-l-[12px] border-l-[#1E040B]">
            {/* Gold Corner Ornaments */}
            <div className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 border-t-2 border-r-2 border-amber-300/60 rounded-tr-lg pointer-events-none z-30" />
            <div className="absolute bottom-2 right-2 w-7 h-7 sm:w-8 sm:h-8 border-b-2 border-r-2 border-amber-300/60 rounded-br-lg pointer-events-none z-30" />

            {/* Single Unified Closed Front Cover Face */}
            {renderCoverFace(false)}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CASE 2: CONTRAPORTADA CERRADA (UN SOLO LIBRO, NO PARTIDO) */}
      {/* ============================================================== */}
      {isBackCover && (
        <div className="relative mx-auto w-full max-w-md sm:max-w-xl transition-all duration-500 my-auto">
          {/* Closed Back Hardcover Book Shell */}
          <div className="relative rounded-3xl bg-[#2D0B14] p-2.5 sm:p-5 shadow-[0_20px_50px_-15px_rgba(45,11,20,0.65)] border-2 sm:border-4 border-[#3D141F] border-r-[8px] sm:border-r-[12px] border-r-[#1E040B]">
            {/* Gold Corner Ornaments */}
            <div className="absolute top-2 left-2 w-7 h-7 sm:w-8 sm:h-8 border-t-2 border-l-2 border-amber-300/60 rounded-tl-lg pointer-events-none z-30" />
            <div className="absolute bottom-2 left-2 w-7 h-7 sm:w-8 sm:h-8 border-b-2 border-l-2 border-amber-300/60 rounded-bl-lg pointer-events-none z-30" />

            {/* Single Unified Closed Back Cover Face */}
            {renderBackCoverFace(false)}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CASE 3: LIBRO ABIERTO EN 2 PÁGINAS Y TRANSICIONES FÍSICAS 3D */}
      {/* ============================================================== */}
      {isBookOpen && (
        <div
          ref={bookContainerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={`relative mx-auto w-full perspective-book transition-all duration-300 ${isFs ? 'max-w-6xl my-auto' : 'max-w-5xl'}`}
        >
          {/* Real Open Book Shell */}
          <div className="relative rounded-3xl bg-[#2D0B14] p-2.5 sm:p-5 shadow-[0_20px_50px_-15px_rgba(45,11,20,0.55)] border-2 sm:border-4 border-[#3D141F] transition-all">
            {/* Gold Brass Corner Ornaments */}
            <div className="absolute top-2 left-2 w-7 h-7 sm:w-8 sm:h-8 border-t-2 border-l-2 border-amber-300/60 rounded-tl-lg pointer-events-none z-30" />
            <div className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 border-t-2 border-r-2 border-amber-300/60 rounded-tr-lg pointer-events-none z-30" />
            <div className="absolute bottom-2 left-2 w-7 h-7 sm:w-8 sm:h-8 border-b-2 border-l-2 border-amber-300/60 rounded-bl-lg pointer-events-none z-30" />
            <div className="absolute bottom-2 right-2 w-7 h-7 sm:w-8 sm:h-8 border-b-2 border-r-2 border-amber-300/60 rounded-br-lg pointer-events-none z-30" />

            {/* Center Spine Crease */}
            <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-stone-300/80 z-20 pointer-events-none" />

            {/* Book Pages Stage with 3D Center-Spine Flip Leaf & Cover Opening Swing */}
            <div className="min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] rounded-2xl bg-[#FCF8F2] text-stone-800 overflow-hidden relative shadow-inner transform-style-3d">
              {/* DESKTOP VIEW: Two pages open side-by-side */}
              <div className="hidden lg:flex w-full h-full absolute inset-0">
                {/* 1. BASE LEFT PAGE */}
                <div className="w-1/2 h-full absolute top-0 bottom-0 left-0 z-10">
                  {coverTransition === 'open-front' || coverTransition === 'close-front'
                    ? renderEndpaper('front')
                    : coverTransition === 'close-back' || coverTransition === 'open-back'
                    ? renderLeftPage(coverTransition === 'close-back' ? currentPage : targetPage)
                    : renderLeftPage(isFlipping && flipDirection === 'prev' ? targetPage : currentPage)}
                </div>

                {/* 2. BASE RIGHT PAGE */}
                <div className="w-1/2 h-full absolute top-0 bottom-0 right-0 z-10">
                  {coverTransition === 'open-front' || coverTransition === 'open-back'
                    ? renderRightPage(targetPage)
                    : coverTransition === 'close-front'
                    ? renderRightPage(currentPage)
                    : coverTransition === 'close-back'
                    ? renderEndpaper('back')
                    : renderRightPage(isFlipping && flipDirection === 'next' ? targetPage : currentPage)}
                </div>
              </div>

              {/* 3. THE 3D FLIPPING LEAF (Turns from center spine to left or right on desktop!) */}
              {isFlipping && (
                <>
                  {/* Case A: OPENING FRONT COVER (0 -> 1 or >0) */}
                  {coverTransition === 'open-front' && (
                    <div className="hidden lg:block w-1/2 h-full absolute top-0 bottom-0 left-1/2 z-30 animate-flip-cover-open transform-style-3d">
                      {/* Front Face: The luxurious Front Cover */}
                      <div className="w-full h-full absolute inset-0 backface-hidden shadow-2xl">
                        {renderCoverFace(true)}
                      </div>
                      {/* Back Face: Page 1 Left (Prólogo) */}
                      <div className="w-full h-full absolute inset-0 backface-hidden [transform:rotateY(180deg)] shadow-2xl">
                        {renderLeftPage(targetPage)}
                      </div>
                      <div className="absolute inset-0 pointer-events-none animate-flip-shadow-cover bg-gradient-to-r from-stone-900/40 via-transparent to-stone-900/20" />
                    </div>
                  )}

                  {/* Case B: CLOSING BACK TO FRONT COVER (1 -> 0) */}
                  {coverTransition === 'close-front' && (
                    <div className="hidden lg:block w-1/2 h-full absolute top-0 bottom-0 left-1/2 z-30 animate-flip-cover-close transform-style-3d">
                      {/* Front Face: Front Cover */}
                      <div className="w-full h-full absolute inset-0 backface-hidden shadow-2xl">
                        {renderCoverFace(true)}
                      </div>
                      {/* Back Face: Page 1 Left (Prólogo) */}
                      <div className="w-full h-full absolute inset-0 backface-hidden [transform:rotateY(180deg)] shadow-2xl">
                        {renderLeftPage(currentPage)}
                      </div>
                      <div className="absolute inset-0 pointer-events-none animate-flip-shadow-cover bg-gradient-to-l from-stone-900/40 via-transparent to-stone-900/20" />
                    </div>
                  )}

                  {/* Case C: CLOSING TO BACK COVER (14 -> 15) */}
                  {coverTransition === 'close-back' && (
                    <div className="hidden lg:block w-1/2 h-full absolute top-0 bottom-0 left-1/2 z-30 animate-flip-cover-open transform-style-3d">
                      {/* Front Face: Right page (Carta Parte 2) */}
                      <div className="w-full h-full absolute inset-0 backface-hidden shadow-2xl">
                        {renderRightPage(currentPage)}
                      </div>
                      {/* Back Face: Back Cover */}
                      <div className="w-full h-full absolute inset-0 backface-hidden [transform:rotateY(180deg)] shadow-2xl">
                        {renderBackCoverFace(true)}
                      </div>
                      <div className="absolute inset-0 pointer-events-none animate-flip-shadow-cover bg-gradient-to-r from-stone-900/40 via-transparent to-stone-900/20" />
                    </div>
                  )}

                  {/* Case D: REOPENING FROM BACK COVER (15 -> 14 or 15 -> 1) */}
                  {coverTransition === 'open-back' && (
                    <div className="hidden lg:block w-1/2 h-full absolute top-0 bottom-0 left-1/2 z-30 animate-flip-cover-close transform-style-3d">
                      {/* Front Face: Right page (Carta Parte 2) */}
                      <div className="w-full h-full absolute inset-0 backface-hidden shadow-2xl">
                        {renderRightPage(targetPage)}
                      </div>
                      {/* Back Face: Back Cover */}
                      <div className="w-full h-full absolute inset-0 backface-hidden [transform:rotateY(180deg)] shadow-2xl">
                        {renderBackCoverFace(true)}
                      </div>
                      <div className="absolute inset-0 pointer-events-none animate-flip-shadow-cover bg-gradient-to-l from-stone-900/40 via-transparent to-stone-900/20" />
                    </div>
                  )}

                  {/* Case E: Normal NEXT internal page turn */}
                  {coverTransition === null && flipDirection === 'next' && (
                    <div className="hidden lg:block w-1/2 h-full absolute top-0 bottom-0 left-1/2 z-30 animate-flip-leaf-next transform-style-3d">
                      {/* Front Face of the flipping leaf */}
                      <div className="w-full h-full absolute inset-0 backface-hidden shadow-2xl">
                        {renderRightPage(currentPage)}
                      </div>
                      {/* Back Face of the flipping leaf */}
                      <div className="w-full h-full absolute inset-0 backface-hidden [transform:rotateY(180deg)] shadow-2xl">
                        {renderLeftPage(targetPage)}
                      </div>
                      {/* Shadow overlay over paper bend */}
                      <div className="absolute inset-0 pointer-events-none animate-flip-shadow bg-gradient-to-r from-stone-900/30 via-transparent to-stone-900/10" />
                    </div>
                  )}

                  {/* Case F: Normal PREV internal page turn */}
                  {coverTransition === null && flipDirection === 'prev' && (
                    <div className="hidden lg:block w-1/2 h-full absolute top-0 bottom-0 left-0 z-30 animate-flip-leaf-prev transform-style-3d">
                      {/* Front Face of the flipping leaf */}
                      <div className="w-full h-full absolute inset-0 backface-hidden shadow-2xl">
                        {renderLeftPage(currentPage)}
                      </div>
                      {/* Back Face of the flipping leaf */}
                      <div className="w-full h-full absolute inset-0 backface-hidden [transform:rotateY(-180deg)] shadow-2xl">
                        {renderRightPage(targetPage)}
                      </div>
                      {/* Shadow overlay over paper bend */}
                      <div className="absolute inset-0 pointer-events-none animate-flip-shadow bg-gradient-to-l from-stone-900/30 via-transparent to-stone-900/10" />
                    </div>
                  )}
                </>
              )}

              {/* MOBILE & TABLET VIEW (< lg): Single responsive page with facet switch */}
              <div className="flex lg:hidden flex-col w-full h-full relative z-20">
                {/* Mobile Facet Tab Header (Foto vs Relato) */}
                <div className="sticky top-0 z-30 flex items-center justify-between px-3 py-2 bg-[#FAF5EB]/95 backdrop-blur-md border-b border-rose-200/80 shadow-2xs shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-rose-950 uppercase tracking-wider">
                      {currentPage === 1
                        ? 'Capítulo 0'
                        : currentPage <= 13
                        ? `Mes ${currentPage - 1}`
                        : 'Epílogo'}
                    </span>
                  </div>

                  <div className="inline-flex items-center p-0.5 rounded-full bg-stone-200/80 border border-stone-300/70 text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setMobileFacet('left')}
                      className={`px-2.5 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                        mobileFacet === 'left'
                          ? 'bg-rose-900 text-white shadow-xs font-bold'
                          : 'text-stone-600 hover:text-rose-900'
                      }`}
                    >
                      {currentPage === 1 ? '📜 Prólogo' : currentPage === 14 ? '📜 Parte 1' : '📸 Foto'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileFacet('right')}
                      className={`px-2.5 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                        mobileFacet === 'right'
                          ? 'bg-rose-900 text-white shadow-xs font-bold'
                          : 'text-stone-600 hover:text-rose-900'
                      }`}
                    >
                      {currentPage === 1 ? '📑 Índice' : currentPage === 14 ? '✍️ Parte 2' : '📖 Relato'}
                    </button>
                  </div>
                </div>

                {/* Mobile Page Content with vertical scroll */}
                <div className="flex-1 w-full overflow-y-auto">
                  {coverTransition === 'open-front' || coverTransition === 'open-back'
                    ? (mobileFacet === 'left' ? renderLeftPage(targetPage) : renderRightPage(targetPage))
                    : coverTransition === 'close-front' || coverTransition === 'close-back'
                    ? (mobileFacet === 'left' ? renderLeftPage(currentPage) : renderRightPage(currentPage))
                    : (mobileFacet === 'left' ? renderLeftPage(currentPage) : renderRightPage(currentPage))}
                </div>
              </div>
            </div>
          </div>

          {/* Clean Side Arrow Controls outside the open book container */}
          <button
            onClick={handlePrev}
            aria-label="Página anterior"
            className="flex absolute -left-2.5 sm:-left-6 lg:-left-7 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-sm text-stone-800 shadow-xl border border-rose-200 items-center justify-center hover:bg-rose-50 hover:scale-105 active:scale-95 transition-all z-30 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-rose-900" />
          </button>

          <button
            onClick={handleNext}
            aria-label="Página siguiente"
            className="flex absolute -right-2.5 sm:-right-6 lg:-right-7 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-sm text-stone-800 shadow-xl border border-rose-200 items-center justify-center hover:bg-rose-50 hover:scale-105 active:scale-95 transition-all z-30 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-rose-900" />
          </button>
        </div>
      )}

      {/* Progress and status under book */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto text-xs px-4 ${isFs ? 'mt-4 text-stone-400 shrink-0' : 'mt-6 text-stone-500'}`}>
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${isFs ? 'text-rose-300' : 'text-rose-950'}`}>Estado:</span>
          <span>
            {isCover
              ? 'Portada (Libro Cerrado)'
              : isBackCover
              ? 'Contraportada (Libro Cerrado)'
              : currentPage === 1
              ? 'Índice de Capítulos'
              : currentPage <= 13
              ? `Mes ${currentPage - 1} de 12 (Abierto)`
              : 'Carta de Amor (Abierto)'}
          </span>
          <span className={isFs ? 'text-stone-500' : 'text-stone-400'}>({Math.round((currentPage / (totalPages - 1)) * 100)}%)</span>
        </div>

        {/* Music Quick Control & Fullscreen Hint */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleAudio}
            className={`flex items-center gap-1.5 transition-colors ${isFs ? 'text-rose-300 hover:text-white' : 'hover:text-rose-900'}`}
          >
            {isAudioPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span>Música Romántica: Sonando</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                <span>Música Romántica: En pausa</span>
              </>
            )}
          </button>

          {!isFs && (
            <button
              onClick={toggleFullscreen}
              className="text-rose-800 hover:text-rose-950 font-semibold flex items-center gap-1 transition-colors"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Pantalla Completa</span>
            </button>
          )}
        </div>
      </div>

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-rose-200 animate-fadeIn"
          >
            <div className="relative aspect-[4/3] bg-stone-900">
              {renderVisualArtwork(selectedPhoto)}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-2">
              <span className="text-xs font-semibold text-rose-800 uppercase tracking-wide">
                {selectedPhoto.monthLabel}
              </span>
              <h4 className="text-xl font-serif-title font-bold text-stone-900">
                {selectedPhoto.title}
              </h4>
              <p className="text-sm font-editorial text-stone-600">
                {selectedPhoto.story}
              </p>
            </div>

            {/* Action Bar for Photo Lightbox: Edit or Delete Photo */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {selectedPhoto.imageUrl && onDeleteMonthImage && (
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteMonthImage(selectedPhoto.id);
                      setSelectedPhoto(null);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    title="Eliminar esta foto del libro y volver a la ilustración"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    <span>Eliminar Foto</span>
                  </button>
                )}

                {onOpenEditor && (
                  <button
                    type="button"
                    onClick={() => {
                      const mIdx = story.months.findIndex((m) => m.id === selectedPhoto.id);
                      setSelectedPhoto(null);
                      onOpenEditor('book_months', mIdx >= 0 ? mIdx : 0);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 border border-stone-300 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-rose-700" />
                    <span>Editar Contenido / Cambiar Foto</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="px-4 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
