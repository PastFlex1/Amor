/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { LoveStory } from './types';
import { DEFAULT_LOVE_STORY } from './utils/defaultData';
import { generateShareUrl } from './utils/storage';
import { audioEngine } from './utils/audioEngine';
import { FloatingPetals } from './components/FloatingPetals';
import { HeaderBar } from './components/HeaderBar';
import { LoveBook } from './components/LoveBook';
import { EditorModal, TabType } from './components/EditorModal';
import { FutureTimelineModal } from './components/FutureTimelineModal';
import { saveStoryToCloud, loadStoryFromCloud, subscribeToStoryInCloud } from './utils/firebase';

export default function App() {
  const [story, setStory] = useState<LoveStory>(DEFAULT_LOVE_STORY);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorInitialTab, setEditorInitialTab] = useState<TabType>('book_months');
  const [editorInitialMonth, setEditorInitialMonth] = useState<number>(0);
  const [isFutureOpen, setIsFutureOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Real-time synchronization exclusively with Firebase Cloud Firestore
  useEffect(() => {
    // 1. Initial fetch from Firebase cloud
    loadStoryFromCloud().then((cloudStory) => {
      if (cloudStory) {
        setStory(cloudStory);
      } else {
        // First-time initialization in the cloud
        saveStoryToCloud(DEFAULT_LOVE_STORY);
      }
    });

    // 2. Real-time subscription so partner sees updates immediately across devices
    const unsubscribe = subscribeToStoryInCloud('main_story', (updatedStory) => {
      if (updatedStory) {
        setStory(updatedStory);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync state with audio engine
  const handleToggleAudio = async () => {
    const playing = audioEngine.toggle();
    setIsAudioPlaying(playing);
  };

  // Toggle fullscreen mode
  const handleToggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch {
      // Fallback state if browser limits native fullscreen
      setIsFullscreen((prev) => !prev);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Open editor focused on a specific tab and month
  const handleOpenEditor = (tab: TabType = 'book_months', monthIdx: number = 0) => {
    setEditorInitialTab(tab);
    setEditorInitialMonth(monthIdx);
    setIsEditorOpen(true);
  };

  // Delete a month's uploaded image directly
  const handleDeleteMonthImage = (monthId: string) => {
    const updatedMonths = story.months.map((m) => {
      if (m.id === monthId) {
        return { ...m, imageUrl: '' };
      }
      return m;
    });
    const updated = { ...story, months: updatedMonths };
    setStory(updated);
    saveStoryToCloud(updated);
    showToast('¡Foto eliminada! Se restauró la escena artística.');
  };

  // Delete future milestone photo or video directly
  const handleDeleteMilestoneMedia = (milestoneId: string) => {
    const updatedMilestones = (story.futureMilestones || []).map((m) => {
      if (m.id === milestoneId) {
        return { ...m, mediaType: 'none' as const, mediaUrl: '' };
      }
      return m;
    });
    const updated = { ...story, futureMilestones: updatedMilestones };
    setStory(updated);
    saveStoryToCloud(updated);
    showToast('¡Archivo multimedia eliminado de la meta!');
  };

  // Handle saving customized story with Firebase Cloud sync
  const handleSaveStory = async (updatedStory: LoveStory) => {
    setStory(updatedStory);
    showToast('¡Guardando en Firebase Cloud! ☁️');
    const cloudSaved = await saveStoryToCloud(updatedStory);
    if (cloudSaved) {
      showToast('¡Sincronizado con Firebase en la nube! ☁️✨');
    }
  };

  // Handle coupon redemption inside the book
  const handleRedeemCoupon = (couponId: string) => {
    const updatedCoupons = story.coupons.map((c) => {
      if (c.id === couponId) {
        return {
          ...c,
          redeemed: true,
          redeemedAt: new Date().toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })
        };
      }
      return c;
    });

    const updated = { ...story, coupons: updatedCoupons };
    setStory(updated);
    saveStoryToCloud(updated);
    showToast(`¡Vale canjeado para ${story.receiverName}! ❤️`);
  };

  const handleShare = () => {
    const url = generateShareUrl(story);
    navigator.clipboard.writeText(url).then(() => {
      showToast('¡Enlace del libro copiado al portapapeles!');
    }).catch(() => {
      prompt('Copia este enlace para enviar a Dayana:', url);
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isCustomized =
    story.receiverName !== 'Dayana Estefania Cuascota Cuascota';

  return (
    <div className="relative min-h-[100dvh] min-h-screen w-full overflow-x-hidden bg-[#FAF6F0] text-stone-800 font-sans-body selection:bg-rose-200 selection:text-rose-900 flex flex-col justify-between">
      {/* Interactive floating petals and click heart particles */}
      <FloatingPetals />

      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-stone-900/95 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-fadeIn border border-rose-500/30">
          <Sparkles className="w-4 h-4 text-rose-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar (hidden when in fullscreen to maximize book area) */}
      {!isFullscreen && (
        <HeaderBar
          partnerName={story.receiverName}
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={handleToggleAudio}
          onOpenEditor={() => handleOpenEditor('book_months', 0)}
          onOpenFuture={() => setIsFutureOpen(true)}
          onShare={handleShare}
          onToggleFullscreen={handleToggleFullscreen}
          isFullscreen={isFullscreen}
          isCustomized={isCustomized}
        />
      )}

      {/* Main Focus: Purely The Interactive Love Book */}
      <main className="flex-1 flex flex-col justify-center">
        <LoveBook
          story={story}
          onOpenEditor={handleOpenEditor}
          onDeleteMonthImage={handleDeleteMonthImage}
          onOpenFuture={() => setIsFutureOpen(true)}
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={handleToggleAudio}
          onRedeemCoupon={handleRedeemCoupon}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
        />
      </main>

      {/* Clean, discreet footer (hidden in fullscreen) */}
      {!isFullscreen && (
        <footer className="py-4 px-6 text-center text-xs text-stone-400 border-t border-rose-100/60 flex items-center justify-center gap-1.5">
          <span>Hecho con amor para</span>
          <span className="font-semibold text-rose-900">{story.receiverName}</span>
          <span>· 1 Año Juntos (12 Meses)</span>
        </footer>
      )}

      {/* Future Timeline Modal (Option B: Starlight Celestial Experience) */}
      {isFutureOpen && (
        <FutureTimelineModal
          milestones={story.futureMilestones || []}
          partnerName={story.receiverName}
          onClose={() => setIsFutureOpen(false)}
          onDeleteMedia={handleDeleteMilestoneMedia}
          onOpenEditor={() => {
            setIsFutureOpen(false);
            handleOpenEditor('future', 0);
          }}
        />
      )}

      {/* Editor Modal for full customization */}
      {isEditorOpen && (
        <EditorModal
          story={story}
          initialTab={editorInitialTab}
          initialMonthIndex={editorInitialMonth}
          onSave={handleSaveStory}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </div>
  );
}
