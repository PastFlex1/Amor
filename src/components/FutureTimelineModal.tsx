import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Calendar,
  MapPin,
  Heart,
  Video,
  Image as ImageIcon,
  Edit3,
  Plus,
  Compass,
  Home,
  Clock,
  Star,
  Maximize2,
  ChevronRight,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { FutureMilestone } from '../types';

interface FutureTimelineModalProps {
  milestones: FutureMilestone[];
  partnerName: string;
  onClose: () => void;
  onOpenEditor: () => void;
  onDeleteMedia?: (milestoneId: string) => void;
}

export const FutureTimelineModal: React.FC<FutureTimelineModalProps> = ({
  milestones,
  partnerName,
  onClose,
  onOpenEditor,
  onDeleteMedia
}) => {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  // Extract unique sorted years
  const years = Array.from(
    new Set(milestones.map((m) => m.year).filter((y) => Boolean(y)))
  ).sort((a, b) => a - b);

  // Filtered milestones sorted chronologically
  const filteredMilestones = milestones
    .filter((m) => {
      if (selectedYear === 'all') return true;
      return m.year === Number(selectedYear);
    })
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return (a.targetDate || '').localeCompare(b.targetDate || '');
    });

  // Helper for YouTube embed
  const getYouTubeEmbedUrl = (url?: string): string | null => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0` : null;
  };

  const getCategoryBadge = (category?: FutureMilestone['category']) => {
    switch (category) {
      case 'viaje':
        return { label: 'Viaje Soñado', icon: <Compass className="w-3 h-3" />, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'hogar':
        return { label: 'Nuestro Hogar', icon: <Home className="w-3 h-3" />, color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'celebracion':
        return { label: 'Celebración', icon: <Sparkles className="w-3 h-3" />, color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case 'metas':
        return { label: 'Metas Juntos', icon: <Star className="w-3 h-3" />, color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' };
      case 'amor':
      default:
        return { label: 'Promesa de Amor', icon: <Heart className="w-3 h-3" />, color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
    }
  };

  // Render media content (video or photo)
  const renderMedia = (m: FutureMilestone) => {
    if (m.mediaType === 'video' && m.mediaUrl) {
      const ytEmbed = getYouTubeEmbedUrl(m.mediaUrl);
      if (ytEmbed) {
        return (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-rose-500/20 bg-black/60">
            <iframe
              src={ytEmbed}
              title={m.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        );
      }

      return (
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-rose-500/20 bg-black/70 group">
          <video
            src={m.mediaUrl}
            controls
            preload="metadata"
            className="w-full h-full object-cover"
          >
            Tu navegador no soporta reproducción de video.
          </video>
          <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-stone-900/80 text-[10px] text-rose-200 border border-rose-400/30 flex items-center gap-1 pointer-events-none">
            <Video className="w-3 h-3 text-rose-400" />
            <span>Video</span>
          </div>
        </div>
      );
    }

    if (m.mediaType === 'image' && m.mediaUrl) {
      return (
        <div
          onClick={() => setLightboxImage({ url: m.mediaUrl!, title: m.title })}
          className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-rose-500/20 bg-stone-900 cursor-pointer group"
        >
          <img
            src={m.mediaUrl}
            alt={m.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
            <span className="text-xs text-white font-medium flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-rose-300" /> Clic para ampliar
            </span>
          </div>
          <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-stone-900/80 text-[10px] text-amber-200 border border-amber-400/30 flex items-center gap-1">
            <ImageIcon className="w-3 h-3 text-amber-300" />
            <span>Foto</span>
          </div>
        </div>
      );
    }

    // Fallback abstract romantic artwork
    return (
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-inner border border-rose-500/20 bg-gradient-to-br from-rose-950/60 via-stone-900 to-purple-950/40 p-6 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-400/30 flex items-center justify-center text-rose-300 mb-2">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <p className="font-serif-title text-rose-100 text-sm font-semibold">{m.title}</p>
        <span className="text-[11px] text-rose-300/70 italic font-editorial mt-1">
          Un sueño esperando ser vivido
        </span>
      </div>
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#090206]/95 backdrop-blur-xl flex flex-col overflow-y-auto animate-fadeIn select-none"
    >
      {/* Ambient Starlight Background */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(225,29,72,0.25),rgba(255,255,255,0))]" />
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_80%_70%,rgba(217,119,6,0.2),transparent_50%)]" />

      {/* Top Floating Control Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-4 backdrop-blur-md bg-[#090206]/85 border-b border-rose-900/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-900/40">
            <Sparkles className="w-5 h-5 text-amber-100" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-serif-title font-bold text-amber-100 flex items-center gap-2">
              Nuestro Futuro Juntos
              <span className="text-[10px] font-sans-body px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-widest hidden sm:inline">
                Cápsula de Sueños
              </span>
            </h2>
            <p className="text-xs text-rose-300/70 font-sans-body">
              Proyectando nuestros años y meses de amor para {partnerName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              onClose();
              onOpenEditor();
            }}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-900/80 hover:bg-rose-800 text-amber-100 border border-rose-400/40 text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Editar / Agregar Sueño</span>
            <span className="sm:hidden">Editar</span>
          </button>

          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 flex items-center justify-center border border-white/10 transition-all cursor-pointer"
            title="Cerrar vista del futuro"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
        {/* Hero Banner */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-200 text-xs font-medium">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-spin-slow" />
            <span>El próximo capítulo de nuestra historia de amor</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif-title font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-rose-100 to-rose-300">
            Lo que el Destino nos Reserva
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 font-editorial italic leading-relaxed">
            «Porque amarte en el presente es maravilloso, pero imaginar cada año y cada mes a tu lado es la promesa más dulce que puedo hacerte, Dayana.»
          </p>
        </div>

        {/* Year Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          <button
            onClick={() => setSelectedYear('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedYear === 'all'
                ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-lg shadow-rose-900/50 border border-amber-300/40'
                : 'bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10'
            }`}
          >
            Todos los Años ({milestones.length})
          </button>
          {years.map((year) => {
            const count = milestones.filter((m) => m.year === year).length;
            return (
              <button
                key={year}
                onClick={() => setSelectedYear(String(year))}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedYear === String(year)
                    ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-lg shadow-rose-900/50 border border-amber-300/40'
                    : 'bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10'
                }`}
              >
                Año {year} ({count})
              </button>
            );
          })}
        </div>

        {/* Timeline Line & Milestones */}
        <div className="relative">
          {/* Vertical central glowing line on desktop */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-rose-500 via-amber-400 to-rose-700 opacity-40 shadow-[0_0_12px_rgba(244,63,94,0.6)]" />

          {/* Cards Grid / Flow */}
          <div className="space-y-12">
            {filteredMilestones.map((milestone, idx) => {
              const isEven = idx % 2 === 0;
              const badge = getCategoryBadge(milestone.category);

              return (
                <div
                  key={milestone.id}
                  className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-12 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Central Timeline Pin on Desktop */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-8 w-10 h-10 rounded-full bg-[#18050E] border-2 border-amber-400 text-amber-300 items-center justify-center shadow-lg shadow-amber-500/20 z-20">
                    <Calendar className="w-4 h-4 text-amber-300" />
                  </div>

                  {/* Card Content */}
                  <div className="w-full md:w-[calc(50%-2rem)] bg-gradient-to-b from-white/10 to-white/5 border border-white/10 hover:border-rose-400/50 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md transition-all duration-300 hover:shadow-rose-900/20 group">
                    {/* Header info */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      {/* Year & Month Highlight Badge */}
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-rose-950 to-stone-900 border border-rose-400/40 text-amber-200 text-xs font-bold tracking-wide">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>
                          {milestone.year} · {milestone.month}
                        </span>
                      </div>

                      {/* Category Badge */}
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold border ${badge.color}`}
                      >
                        {badge.icon}
                        <span>{badge.label}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-serif-title font-bold text-white mb-2 group-hover:text-amber-200 transition-colors">
                      {milestone.title}
                    </h3>

                    {/* Location */}
                    {milestone.location && (
                      <div className="flex items-center gap-1.5 text-xs text-rose-300/80 mb-4 font-sans-body">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>{milestone.location}</span>
                      </div>
                    )}

                    {/* Media section (Video or Photo) */}
                    <div className="mb-4">
                      {renderMedia(milestone)}
                    </div>

                    {/* Story / Narrative */}
                    <p className="text-stone-300 text-xs sm:text-sm font-sans-body leading-relaxed mb-4">
                      {milestone.story}
                    </p>

                    {/* Romantic Quote or Promise */}
                    {milestone.quote && (
                      <div className="pt-3 border-t border-white/10 flex items-start gap-2 text-amber-200/90 text-xs font-editorial italic">
                        <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5 fill-rose-500/50" />
                        <span>{milestone.quote}</span>
                      </div>
                    )}

                    {/* Card Actions: Edit & Delete Media */}
                    <div className="pt-3 mt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenEditor();
                        }}
                        className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 hover:text-white border border-white/10 text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Editar historia, textos o medios de este sueño"
                      >
                        <Edit3 className="w-3 h-3 text-amber-300" />
                        <span>Editar este sueño</span>
                      </button>

                      {milestone.mediaType !== 'none' && milestone.mediaUrl && onDeleteMedia && (
                        <button
                          type="button"
                          onClick={() => onDeleteMedia(milestone.id)}
                          className="px-2.5 py-1 rounded-full bg-red-950/70 hover:bg-red-900 text-red-200 border border-red-500/40 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Eliminar foto o video de este sueño"
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                          <span>Eliminar {milestone.mediaType === 'video' ? 'Video' : 'Foto'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Empty Spacer on Desktop to balance opposite side */}
                  <div className="hidden md:block w-full md:w-[calc(50%-2rem)]" />
                </div>
              );
            })}
          </div>

          {/* Bottom Call to Action Card: Add another future dream */}
          <div className="mt-16 text-center max-w-md mx-auto">
            <button
              onClick={() => {
                onClose();
                onOpenEditor();
              }}
              type="button"
              className="w-full p-6 rounded-3xl border-2 border-dashed border-rose-500/40 hover:border-amber-400 bg-white/5 hover:bg-white/10 text-stone-200 transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-amber-300" />
              </div>
              <span className="font-serif-title font-bold text-amber-100 text-base">
                ¿Qué otro sueño quieres escribir con Dayana?
              </span>
              <span className="text-xs text-stone-400 font-sans-body">
                Haz clic para agregar un nuevo año, mes, promesa, foto o video
              </span>
            </button>
          </div>
        </div>
      </main>

      {/* Lightbox Modal for Images */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-stone-900 border border-white/20 rounded-3xl overflow-hidden shadow-2xl relative"
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="max-h-[80vh] w-auto object-contain"
              />
            </div>
            <div className="p-4 bg-stone-950 text-center">
              <p className="text-amber-100 font-serif-title text-base">{lightboxImage.title}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
