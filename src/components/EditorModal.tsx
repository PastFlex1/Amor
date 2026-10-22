import React, { useState } from 'react';
import {
  X,
  Save,
  Share2,
  Download,
  Plus,
  Trash2,
  Calendar,
  Heart,
  Upload,
  Sparkles,
  Copy,
  Check,
  BookOpen,
  MapPin,
  Music,
  Video,
  Film,
  Image as ImageIcon,
  Compass,
  Home,
  Star,
  Clock
} from 'lucide-react';
import { LoveStory, MonthMemory, MemoryItem, LoveReason, LoveCoupon, FutureMilestone } from '../types';
import { generateShareUrl, exportStoryAsJson } from '../utils/storage';
import { DEFAULT_LOVE_STORY, DEFAULT_MONTHS, DEFAULT_FUTURE_MILESTONES } from '../utils/defaultData';
import { uploadMediaToFirebase } from '../utils/firebase';

export type TabType = 'general' | 'book_months' | 'letter' | 'reasons' | 'coupons' | 'future' | 'share';

export interface EditorModalProps {
  story: LoveStory;
  initialTab?: TabType;
  initialMonthIndex?: number;
  onSave: (updatedStory: LoveStory) => void;
  onClose: () => void;
}

export const EditorModal: React.FC<EditorModalProps> = ({
  story,
  initialTab = 'book_months',
  initialMonthIndex = 0,
  onSave,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(initialMonthIndex);
  const [formData, setFormData] = useState<LoveStory>(() => {
    const cloned = JSON.parse(JSON.stringify(story));
    if (!Array.isArray(cloned.months) || cloned.months.length < 12) {
      cloned.months = JSON.parse(JSON.stringify(DEFAULT_MONTHS));
    }
    if (!Array.isArray(cloned.futureMilestones) || cloned.futureMilestones.length === 0) {
      cloned.futureMilestones = JSON.parse(JSON.stringify(DEFAULT_FUTURE_MILESTONES));
    }
    return cloned;
  });
  const [copiedLink, setCopiedLink] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // General field updates
  const handleInputChange = (field: keyof LoveStory, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // MonthMemory updates
  const handleMonthChange = (index: number, field: keyof MonthMemory, value: unknown) => {
    const updated = [...formData.months];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, months: updated }));
  };

  const handleMonthImageUpload = async (index: number, file: File) => {
    setUploadProgress('Subiendo foto a Firebase Cloud Storage...');
    try {
      const downloadUrl = await uploadMediaToFirebase(file, 'months', (percent) => {
        setUploadProgress(`Subiendo a la nube: ${percent}%`);
      });
      handleMonthChange(index, 'imageUrl', downloadUrl);
    } catch (err) {
      console.error('Error subiendo foto a Firebase Storage:', err);
      alert('No se pudo subir la foto a Firebase Storage en la nube. Verifica tu conexión a internet.');
    } finally {
      setTimeout(() => setUploadProgress(null), 1200);
    }
  };

  // Letter updates
  const handleLetterChange = (field: keyof LoveStory['letter'], value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      letter: { ...prev.letter, [field]: value }
    }));
  };

  const handleParagraphChange = (index: number, text: string) => {
    const updated = [...formData.letter.paragraphs];
    updated[index] = text;
    handleLetterChange('paragraphs', updated);
  };

  const handleAddParagraph = () => {
    handleLetterChange('paragraphs', [...formData.letter.paragraphs, 'Nuevo párrafo con tus palabras sinceras...']);
  };

  const handleRemoveParagraph = (index: number) => {
    if (formData.letter.paragraphs.length <= 1) return;
    const updated = formData.letter.paragraphs.filter((_, i) => i !== index);
    handleLetterChange('paragraphs', updated);
  };

  // Reasons updates
  const handleReasonChange = (index: number, field: keyof LoveReason, value: string) => {
    const updated = [...formData.reasons];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, reasons: updated }));
  };

  const handleAddReason = () => {
    const newR: LoveReason = {
      id: `reas-${Date.now()}`,
      title: 'Nueva razón para amarte',
      description: 'Escribe aquí por qué esa persona es única...'
    };
    setFormData((prev) => ({ ...prev, reasons: [...prev.reasons, newR] }));
  };

  const handleRemoveReason = (index: number) => {
    const updated = formData.reasons.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, reasons: updated }));
  };

  // Coupons updates
  const handleCouponChange = (index: number, field: keyof LoveCoupon, value: unknown) => {
    const updated = [...formData.coupons];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, coupons: updated }));
  };

  // Future Milestone handlers
  const handleMilestoneChange = (index: number, field: keyof FutureMilestone, value: unknown) => {
    const updated = [...(formData.futureMilestones || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, futureMilestones: updated }));
  };

  const handleAddMilestone = () => {
    const nextYear = new Date().getFullYear() + 1;
    const newMilestone: FutureMilestone = {
      id: `fut-${Date.now()}`,
      year: nextYear,
      month: 'Enero',
      title: 'Nuevo Sueño o Promesa',
      story: 'Escribe aquí con amor todo lo que imaginas vivir en este año y mes...',
      location: 'Un lugar especial',
      quote: '«Una promesa que vivirá por siempre en nuestro corazón.»',
      category: 'viaje',
      mediaType: 'none',
      mediaUrl: ''
    };
    setFormData((prev) => ({
      ...prev,
      futureMilestones: [...(prev.futureMilestones || []), newMilestone]
    }));
  };

  const handleRemoveMilestone = (index: number) => {
    const updated = (formData.futureMilestones || []).filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, futureMilestones: updated }));
  };

  const handleMilestoneMediaUpload = async (index: number, file: File, type: 'image' | 'video') => {
    setUploadProgress(`Subiendo ${type === 'video' ? 'video' : 'foto'} a Firebase Cloud Storage...`);
    try {
      const downloadUrl = await uploadMediaToFirebase(file, 'future', (percent) => {
        setUploadProgress(`Subiendo a la nube: ${percent}%`);
      });
      const updated = [...(formData.futureMilestones || [])];
      updated[index] = {
        ...updated[index],
        mediaType: type,
        mediaUrl: downloadUrl
      };
      setFormData((prev) => ({ ...prev, futureMilestones: updated }));
    } catch (err) {
      console.error('Error subiendo multimedia a Firebase Storage:', err);
      alert(`No se pudo subir el archivo multimedia a Firebase Storage. Verifica tu conexión a internet.`);
    } finally {
      setTimeout(() => setUploadProgress(null), 1200);
    }
  };

  // Copy share URL
  const handleCopyShareLink = async () => {
    const url = generateShareUrl(formData);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      prompt('Copia este enlace para enviar a tu pareja:', url);
    }
  };

  const handleSaveAndApply = () => {
    onSave(formData);
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      onClose();
    }, 600);
  };

  const handleResetDefaults = () => {
    if (confirm('¿Deseas restablecer todos los textos y los 12 meses a los valores originales para Dayana Estefania?')) {
      setFormData(JSON.parse(JSON.stringify(DEFAULT_LOVE_STORY)));
    }
  };

  const activeMonth = formData.months[selectedMonthIdx] || formData.months[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6"
    >
      <div className="bg-[#FAF6F0] rounded-2xl sm:rounded-3xl max-w-4xl w-full h-[96dvh] sm:h-[92vh] flex flex-col shadow-2xl border border-rose-200 overflow-hidden animate-fadeIn">
        {/* Modal Top Bar */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 bg-white border-b border-rose-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-rose-100 rounded-xl text-rose-800">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-rose-900" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif-title font-bold text-stone-900 leading-tight">
                Personalizar el Libro de Amor (1 Año)
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-500 line-clamp-1">
                Edita los 12 meses, nombres, fechas, cartas y detalles para {formData.receiverName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Uploading progress banner */}
        {uploadProgress && (
          <div className="bg-gradient-to-r from-amber-500 to-rose-500 text-white font-semibold px-4 py-2 text-xs flex items-center justify-center gap-2 shadow-inner animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>{uploadProgress}</span>
          </div>
        )}

        {/* Tab Controls */}
        <div className="px-6 py-2.5 bg-rose-50/70 border-b border-rose-100 flex items-center gap-2 overflow-x-auto shrink-0 no-scrollbar">
          {[
            { id: 'book_months', label: '📖 1. Los 12 Meses del Libro' },
            { id: 'general', label: '💑 2. Nombres y Fecha' },
            { id: 'letter', label: '💌 3. Carta de Amor' },
            { id: 'reasons', label: '💖 4. Razones para Amarte' },
            { id: 'coupons', label: '🎟️ 5. Vales de Amor' },
            { id: 'future', label: '🔮 6. Nuestro Futuro (Años y Meses)' },
            { id: 'share', label: '✨ 7. Compartir Regalo' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              type="button"
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-rose-900 text-white shadow-sm'
                  : 'bg-white/80 text-stone-600 hover:bg-white hover:text-rose-950'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* TAB: 12 MONTHS OF THE BOOK */}
          {activeTab === 'book_months' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Recuerdos Mes a Mes (1 Año Completo)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Selecciona un mes para modificar su historia, foto, anécdota y canción.
                  </p>
                </div>
                <span className="text-xs font-semibold text-rose-900 bg-rose-100 px-3 py-1 rounded-full self-start">
                  Editando: Mes {selectedMonthIdx + 1} de 12
                </span>
              </div>

              {/* Month Selector Pills (1 to 12) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
                {formData.months.map((m, idx) => (
                  <button
                    key={m.id || idx}
                    type="button"
                    onClick={() => setSelectedMonthIdx(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
                      selectedMonthIdx === idx
                        ? 'bg-rose-900 text-white shadow-sm font-bold scale-105'
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-rose-50'
                    }`}
                  >
                    <span>Mes {idx + 1}</span>
                  </button>
                ))}
              </div>

              {/* Current Month Form */}
              <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-rose-50 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
                    Capítulo {selectedMonthIdx + 1}: {activeMonth.monthLabel}
                  </span>
                  <input
                    type="text"
                    value={activeMonth.monthLabel}
                    onChange={(e) => handleMonthChange(selectedMonthIdx, 'monthLabel', e.target.value)}
                    className="px-3 py-1 rounded-lg border border-stone-200 text-xs text-stone-700 font-semibold"
                    placeholder="Ej. Mes 1 · Octubre"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Título del Recuerdo
                  </label>
                  <input
                    type="text"
                    value={activeMonth.title}
                    onChange={(e) => handleMonthChange(selectedMonthIdx, 'title', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none text-stone-900 text-sm font-semibold"
                    placeholder="Ej. El primer café y la mirada que lo cambió todo"
                  />
                </div>

                {/* Date & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Fecha del Mes
                    </label>
                    <input
                      type="date"
                      value={activeMonth.date}
                      onChange={(e) => handleMonthChange(selectedMonthIdx, 'date', e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:border-rose-500 text-xs text-stone-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Lugar o Escenario
                    </label>
                    <input
                      type="text"
                      value={activeMonth.location || ''}
                      onChange={(e) => handleMonthChange(selectedMonthIdx, 'location', e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:border-rose-500 text-xs text-stone-900 bg-white"
                      placeholder="Ej. Aquella cafetería del centro"
                    />
                  </div>
                </div>

                {/* Story narrative */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Historia / Lo que vivimos este mes (Relato del libro)
                  </label>
                  <textarea
                    rows={4}
                    value={activeMonth.story}
                    onChange={(e) => handleMonthChange(selectedMonthIdx, 'story', e.target.value)}
                    className="w-full p-4 rounded-xl border border-stone-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none text-stone-900 text-sm leading-relaxed"
                    placeholder="Escribe la historia o anécdota que recuerdas con tanto cariño de este mes..."
                  />
                </div>

                {/* Anecdote ("El detalle que nunca olvidaré") */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>El detalle o confidencia que nunca olvidaré:</span>
                  </label>
                  <input
                    type="text"
                    value={activeMonth.anecdote || ''}
                    onChange={(e) => handleMonthChange(selectedMonthIdx, 'anecdote', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50/50 text-stone-900 text-xs font-medium focus:border-amber-500 outline-none"
                    placeholder="Ej. Cuando se te derramó un poquito de azúcar y te sonrojaste..."
                  />
                </div>

                {/* Quote & Song */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Frase Romántica Destacada
                    </label>
                    <input
                      type="text"
                      value={activeMonth.quote || ''}
                      onChange={(e) => handleMonthChange(selectedMonthIdx, 'quote', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800"
                      placeholder="«Hay miradas que se quedan a vivir en el alma...»"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1">
                      <Music className="w-3.5 h-3.5 text-rose-700" />
                      <span>Canción de este mes</span>
                    </label>
                    <input
                      type="text"
                      value={activeMonth.songRecommendation || ''}
                      onChange={(e) => handleMonthChange(selectedMonthIdx, 'songRecommendation', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800"
                      placeholder="Ej. Yellow - Coldplay"
                    />
                  </div>
                </div>

                {/* Visual Image / Artwork */}
                <div className="pt-2 border-t border-rose-50">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    Foto o Escena Visual del Mes
                  </label>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Preview box */}
                    {/* Preview box with delete button overlay */}
                    <div className="w-28 h-20 rounded-xl overflow-hidden bg-stone-100 border border-stone-300 shrink-0 flex items-center justify-center relative group">
                      {activeMonth.imageUrl ? (
                        <>
                          <img
                            src={activeMonth.imageUrl}
                            alt="Foto del mes"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleMonthChange(selectedMonthIdx, 'imageUrl', undefined)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-red-600/90 hover:bg-red-700 text-white shadow-md transition-all cursor-pointer"
                            title="Eliminar esta foto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-stone-400 font-medium">Ilustración</span>
                      )}
                    </div>

                    {/* Upload, URL input or clear */}
                    <div className="space-y-2.5 flex-1 w-full">
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="cursor-pointer px-4 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0">
                          <Upload className="w-3.5 h-3.5 text-stone-600" />
                          <span>Subir foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleMonthImageUpload(selectedMonthIdx, f);
                            }}
                          />
                        </label>

                        <div className="flex-1 min-w-[200px]">
                          <input
                            type="url"
                            value={activeMonth.imageUrl || ''}
                            onChange={(e) => handleMonthChange(selectedMonthIdx, 'imageUrl', e.target.value || undefined)}
                            placeholder="O pega enlace web de la foto..."
                            className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-800"
                          />
                        </div>

                        {activeMonth.imageUrl && (
                          <button
                            type="button"
                            onClick={() => handleMonthChange(selectedMonthIdx, 'imageUrl', undefined)}
                            className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer shrink-0"
                            title="Eliminar foto subida y volver a la escena artística"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-600" />
                            <span>Eliminar Foto</span>
                          </button>
                        )}
                      </div>

                      {/* Preset Style selector */}
                      <div>
                        <span className="text-[11px] text-stone-500 block mb-1">
                          O elige estilo de ilustración:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { id: 'cafe_date', label: '☕ Café' },
                            { id: 'stargazing', label: '✨ Estrellas' },
                            { id: 'beach_walk', label: '🌊 Playa' },
                            { id: 'celebration_wine', label: '🥂 Brindis' },
                            { id: 'rainy_day', label: '🌧️ Lluvia' },
                            { id: 'sweet_moments', label: '💌 Detalles' },
                            { id: 'cozy_home', label: '🏡 Hogar' },
                            { id: 'rose_sunset', label: '🌅 Atardecer' }
                          ].map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                handleMonthChange(selectedMonthIdx, 'presetStyle', p.id);
                                handleMonthChange(selectedMonthIdx, 'imageUrl', undefined);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                                activeMonth.presetStyle === p.id && !activeMonth.imageUrl
                                  ? 'bg-rose-900 text-white border-rose-900'
                                  : 'bg-white text-stone-600 border-stone-200 hover:bg-rose-50'
                              }`}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prev / Next Month Buttons */}
                <div className="pt-4 flex items-center justify-between border-t border-rose-50 text-xs">
                  <button
                    type="button"
                    disabled={selectedMonthIdx === 0}
                    onClick={() => setSelectedMonthIdx((p) => p - 1)}
                    className="text-stone-600 hover:text-rose-900 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                  >
                    ← Editar Mes Anterior
                  </button>
                  <button
                    type="button"
                    disabled={selectedMonthIdx === 11}
                    onClick={() => setSelectedMonthIdx((p) => p + 1)}
                    className="text-rose-900 hover:text-rose-700 font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Editar Siguiente Mes →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GENERAL INFO (NAMES & DATE) */}
          {activeTab === 'general' && (
            <div className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Tu Nombre (Remitente)
                  </label>
                  <input
                    type="text"
                    value={formData.senderName}
                    onChange={(e) => handleInputChange('senderName', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none text-stone-900 bg-white"
                    placeholder="Ej. Mateo o Alex"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Nombre de tu Pareja (Destinataria)
                  </label>
                  <input
                    type="text"
                    value={formData.receiverName}
                    onChange={(e) => handleInputChange('receiverName', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-rose-400 focus:border-rose-600 focus:ring-2 focus:ring-rose-200 outline-none text-stone-900 bg-white font-semibold"
                    placeholder="Dayana Estefania Cuascota Cuascota"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-rose-800" />
                  <span>Fecha de Aniversario / Inicio de la Relación</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.anniversaryDate.substring(0, 16)}
                  onChange={(e) => handleInputChange('anniversaryDate', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none text-stone-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Frase Principal de la Portada
                </label>
                <input
                  type="text"
                  value={formData.heroHeadline}
                  onChange={(e) => handleInputChange('heroHeadline', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none text-stone-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Mensaje o Nota de Apertura
                </label>
                <textarea
                  rows={3}
                  value={formData.heroNote}
                  onChange={(e) => handleInputChange('heroNote', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none text-stone-900 bg-white text-sm"
                />
              </div>
            </div>
          )}

          {/* TAB 3: LETTER */}
          {activeTab === 'letter' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Título de la Carta
                </label>
                <input
                  type="text"
                  value={formData.letter.title}
                  onChange={(e) => handleLetterChange('title', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none text-stone-900 bg-white font-serif-title text-base"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Párrafos de la Carta ({formData.letter.paragraphs.length})
                  </label>
                  <button
                    onClick={handleAddParagraph}
                    type="button"
                    className="text-xs font-semibold text-rose-900 hover:text-rose-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir párrafo</span>
                  </button>
                </div>

                {formData.letter.paragraphs.map((p, idx) => (
                  <div key={idx} className="relative">
                    <textarea
                      rows={3}
                      value={p}
                      onChange={(e) => handleParagraphChange(idx, e.target.value)}
                      className="w-full p-3 pr-10 rounded-xl border border-stone-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none text-stone-900 bg-white text-sm"
                      placeholder={`Párrafo ${idx + 1}...`}
                    />
                    {formData.letter.paragraphs.length > 1 && (
                      <button
                        onClick={() => handleRemoveParagraph(idx)}
                        type="button"
                        className="absolute top-3 right-3 text-stone-400 hover:text-rose-700 p-1"
                        title="Eliminar este párrafo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Firma / Despedida
                </label>
                <input
                  type="text"
                  value={formData.letter.signature}
                  onChange={(e) => handleLetterChange('signature', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none text-stone-900 bg-white"
                />
              </div>
            </div>
          )}

          {/* TAB 4: REASONS */}
          {activeTab === 'reasons' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Razones por las que te amo ({formData.reasons.length})
                  </h3>
                  <p className="text-xs text-stone-500">
                    Motivos especiales dedicados a {formData.receiverName}
                  </p>
                </div>

                <button
                  onClick={handleAddReason}
                  type="button"
                  className="px-4 py-2 bg-rose-900 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:bg-rose-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir Razón</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.reasons.map((r, idx) => (
                  <div key={r.id} className="p-4 bg-white rounded-2xl border border-rose-100 shadow-sm space-y-3">
                    <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                      <span>Razón #{idx + 1}</span>
                      <button
                        onClick={() => handleRemoveReason(idx)}
                        className="text-stone-400 hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={r.title}
                      onChange={(e) => handleReasonChange(idx, 'title', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-bold text-stone-900"
                      placeholder="Título de la razón..."
                    />

                    <textarea
                      rows={2}
                      value={r.description}
                      onChange={(e) => handleReasonChange(idx, 'description', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-700 resize-none"
                      placeholder="Descripción emotiva..."
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Vales de Amor Canjeables
                </h3>
                <p className="text-xs text-stone-500">
                  Cupones interactivos para que {formData.receiverName} los canjee cuando desee.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.coupons.map((coupon, idx) => (
                  <div key={coupon.id} className="p-4 bg-white rounded-2xl border border-rose-100 shadow-sm space-y-2">
                    <span className="text-[11px] font-mono text-rose-800">Cupón #{idx + 1}</span>
                    <input
                      type="text"
                      value={coupon.title}
                      onChange={(e) => handleCouponChange(idx, 'title', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-bold text-stone-900"
                    />
                    <textarea
                      rows={2}
                      value={coupon.description}
                      onChange={(e) => handleCouponChange(idx, 'description', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-700 resize-none"
                    />
                    <div className="flex items-center gap-2 pt-1 text-xs">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${coupon.redeemed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                        {coupon.redeemed ? 'Canjeado' : 'Disponible'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: FUTURE & DREAMS (YEARS & MONTHS) */}
          {activeTab === 'future' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-rose-100 shadow-sm">
                <div>
                  <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-rose-600" />
                    <span>Línea del Futuro: Años, Meses, Fotos y Videos</span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Relata los sueños, viajes, promesas y metas que vivirás junto a {formData.receiverName}.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-800 to-rose-900 hover:from-rose-700 hover:to-rose-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Nuevo Sueño</span>
                </button>
              </div>

              {(!formData.futureMilestones || formData.futureMilestones.length === 0) ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-rose-200">
                  <p className="text-sm text-stone-500 mb-3">Aún no hay sueños guardados para el futuro.</p>
                  <button
                    onClick={handleAddMilestone}
                    className="px-4 py-2 bg-rose-900 text-white rounded-full text-xs font-semibold"
                  >
                    Crear el Primer Sueño
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {formData.futureMilestones.map((milestone, idx) => (
                    <div
                      key={milestone.id}
                      className="p-5 sm:p-6 bg-white rounded-2xl border border-rose-100 shadow-sm space-y-4 relative group"
                    >
                      {/* Top Bar of Card */}
                      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-stone-900">
                            {milestone.year} · {milestone.month} — {milestone.title || 'Sin título'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveMilestone(idx)}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar este hito del futuro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Main Fields Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Year */}
                        <div>
                          <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                            Año Proyectado:
                          </label>
                          <input
                            type="number"
                            min="2024"
                            max="2099"
                            value={milestone.year}
                            onChange={(e) => handleMilestoneChange(idx, 'year', parseInt(e.target.value) || 2025)}
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-800"
                          />
                        </div>

                        {/* Month */}
                        <div>
                          <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                            Mes del Año:
                          </label>
                          <input
                            type="text"
                            value={milestone.month}
                            onChange={(e) => handleMilestoneChange(idx, 'month', e.target.value)}
                            placeholder="Ej: Junio, Diciembre..."
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-800"
                          />
                        </div>

                        {/* Category */}
                        <div>
                          <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                            Categoría:
                          </label>
                          <select
                            value={milestone.category || 'viaje'}
                            onChange={(e) => handleMilestoneChange(idx, 'category', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-800 bg-white"
                          >
                            <option value="viaje">✈️ Viaje Soñado</option>
                            <option value="hogar">🏡 Nuestro Hogar</option>
                            <option value="celebracion">🥂 Celebración Especial</option>
                            <option value="metas">🌟 Metas Juntos</option>
                            <option value="amor">💍 Promesa de Amor</option>
                          </select>
                        </div>
                      </div>

                      {/* Title & Location */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                            Título del Sueño o Meta:
                          </label>
                          <input
                            type="text"
                            value={milestone.title}
                            onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)}
                            placeholder="Ej: Nuestro primer gran viaje al mar..."
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-bold text-stone-900"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                            Lugar o Destino Soñado:
                          </label>
                          <div className="relative">
                            <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                            <input
                              type="text"
                              value={milestone.location || ''}
                              onChange={(e) => handleMilestoneChange(idx, 'location', e.target.value)}
                              placeholder="Ej: París, Nuestra propia casa, La playa..."
                              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-800"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Story narrative */}
                      <div>
                        <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                          Relato del Futuro (Lo que sueñan vivir y cómo lo imaginas):
                        </label>
                        <textarea
                          rows={3}
                          value={milestone.story}
                          onChange={(e) => handleMilestoneChange(idx, 'story', e.target.value)}
                          placeholder="Describe con cariño cómo imaginas este momento con Dayana..."
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-800 resize-none leading-relaxed"
                        />
                      </div>

                      {/* Quote / Vow */}
                      <div>
                        <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                          Frase o Promesa de Amor (Opcional):
                        </label>
                        <input
                          type="text"
                          value={milestone.quote || ''}
                          onChange={(e) => handleMilestoneChange(idx, 'quote', e.target.value)}
                          placeholder="Ej: «Cualquier lugar del mundo es perfecto si voy de tu mano.»"
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs italic text-amber-900"
                        />
                      </div>

                      {/* Multimedia Controls: Photo & Video */}
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="text-[11px] font-bold text-stone-700 flex items-center gap-1.5">
                            <span>Multimedia Adjunta (Fotos o Videos):</span>
                          </label>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMilestoneChange(idx, 'mediaType', 'none')}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                                milestone.mediaType === 'none'
                                  ? 'bg-stone-800 text-white'
                                  : 'bg-white text-stone-600 border border-stone-200'
                              }`}
                            >
                              Sin Archivo
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMilestoneChange(idx, 'mediaType', 'image')}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-all ${
                                milestone.mediaType === 'image'
                                  ? 'bg-rose-900 text-white'
                                  : 'bg-white text-stone-600 border border-stone-200'
                              }`}
                            >
                              <ImageIcon className="w-3 h-3" />
                              <span>Foto</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMilestoneChange(idx, 'mediaType', 'video')}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-all ${
                                milestone.mediaType === 'video'
                                  ? 'bg-rose-900 text-white'
                                  : 'bg-white text-stone-600 border border-stone-200'
                              }`}
                            >
                              <Video className="w-3 h-3" />
                              <span>Video</span>
                            </button>
                          </div>
                        </div>

                        {/* Image Controls */}
                        {milestone.mediaType === 'image' && (
                          <div className="space-y-2">
                            <div className="flex flex-col sm:flex-row items-center gap-2">
                              <label className="w-full sm:w-auto px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg text-xs font-semibold text-stone-700 flex items-center justify-center gap-1.5 cursor-pointer shrink-0">
                                <Upload className="w-3.5 h-3.5 text-stone-500" />
                                <span>Subir Foto del Dispositivo</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleMilestoneMediaUpload(idx, file, 'image');
                                  }}
                                />
                              </label>
                              <span className="text-[11px] text-stone-400">o pega enlace web:</span>
                              <input
                                type="url"
                                value={milestone.mediaUrl || ''}
                                onChange={(e) => handleMilestoneChange(idx, 'mediaUrl', e.target.value)}
                                placeholder="https://ejemplo.com/foto.jpg"
                                className="flex-1 w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-700"
                              />
                            </div>
                            {milestone.mediaUrl && (
                              <div className="flex items-center gap-3 mt-2">
                                <div className="relative w-28 h-20 rounded-lg overflow-hidden border border-stone-200">
                                  <img
                                    src={milestone.mediaUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleMilestoneChange(idx, 'mediaUrl', '');
                                    handleMilestoneChange(idx, 'mediaType', 'none');
                                  }}
                                  className="px-3.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                                  title="Eliminar esta foto"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                  <span>Eliminar Foto</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Video Controls */}
                        {milestone.mediaType === 'video' && (
                          <div className="space-y-2">
                            <div className="flex flex-col sm:flex-row items-center gap-2">
                              <label className="w-full sm:w-auto px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg text-xs font-semibold text-stone-700 flex items-center justify-center gap-1.5 cursor-pointer shrink-0">
                                <Upload className="w-3.5 h-3.5 text-rose-700" />
                                <span>Subir Archivo de Video (.mp4, .webm)</span>
                                <input
                                  type="file"
                                  accept="video/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleMilestoneMediaUpload(idx, file, 'video');
                                  }}
                                />
                              </label>
                              <span className="text-[11px] text-stone-400">o enlace:</span>
                              <input
                                type="url"
                                value={milestone.mediaUrl || ''}
                                onChange={(e) => handleMilestoneChange(idx, 'mediaUrl', e.target.value)}
                                placeholder="Enlace YouTube (https://youtu.be/...) o video MP4 directo"
                                className="flex-1 w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-700"
                              />
                            </div>
                            <p className="text-[10px] text-stone-500 italic">
                              💡 Puedes pegar enlaces de YouTube o videos directos MP4/WebM, o subir un video desde tu equipo.
                            </p>
                            {milestone.mediaUrl && (
                              <div className="flex items-center justify-between gap-3 mt-2 p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                                <div className="text-[11px] text-emerald-800 flex items-center gap-1.5 font-medium truncate">
                                  <Video className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span className="truncate">Video adjunto configurado</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleMilestoneChange(idx, 'mediaUrl', '');
                                    handleMilestoneChange(idx, 'mediaType', 'none');
                                  }}
                                  className="px-3 py-1 rounded-md bg-red-100 hover:bg-red-200 text-red-800 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                                  title="Eliminar este video"
                                >
                                  <Trash2 className="w-3 h-3 text-red-600" />
                                  <span>Eliminar Video</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={handleAddMilestone}
                      className="px-5 py-2.5 rounded-full bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-900 border border-stone-300 hover:border-rose-300 text-xs font-semibold flex items-center gap-2 mx-auto transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-rose-700" />
                      <span>+ Agregar Otro Sueño del Futuro</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: SHARE & EXPORT */}
          {activeTab === 'share' && (
            <div className="space-y-6 max-w-xl">
              <div className="p-5 bg-white rounded-2xl border border-rose-100 shadow-sm space-y-3">
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-rose-900" />
                  <span>Enlace Mágico para Compartir con Dayana</span>
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Este enlace codifica la historia completa y el libro de 12 meses. Puedes enviárselo por WhatsApp o mensaje y ella lo abrirá exactamente como lo diseñaste.
                </p>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handleCopyShareLink}
                    type="button"
                    className="px-4 py-2 rounded-xl bg-rose-900 hover:bg-rose-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
                  </button>

                  <button
                    onClick={() => exportStoryAsJson(formData)}
                    type="button"
                    className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors border border-stone-200"
                  >
                    <Download className="w-4 h-4 text-stone-500" />
                    <span>Descargar Backup (JSON)</span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="text-xs text-stone-400 hover:text-stone-600 underline"
                >
                  Restablecer valores originales para Dayana Estefania
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 bg-white border-t border-rose-100 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            type="button"
            className="px-4 sm:px-5 py-2 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-medium transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={handleSaveAndApply}
            type="button"
            className="px-4 sm:px-6 py-2.5 rounded-full bg-rose-900 hover:bg-rose-800 text-white text-xs font-semibold flex items-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <Save className="w-4 h-4 shrink-0" />
            <span>{saveToast ? '¡Guardado con éxito!' : 'Guardar y Aplicar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
