/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { LoveStory } from './types';
import { DEFAULT_LOVE_STORY } from './utils/defaultData';
import { generateShareUrl } from './utils/storage';
import { audioEngine } from './utils/audioEngine';
import { CosmicStarsBackground } from './components/CosmicStarsBackground';
import { IntroSpecialModal } from './components/IntroSpecialModal';
import { HeaderBar } from './components/HeaderBar';
import { HeroSection } from './components/HeroSection';
import { TimeTogetherCounter } from './components/TimeTogetherCounter';
import { InteractiveLoveLetter } from './components/InteractiveLoveLetter';
import { PhotoGallerySection } from './components/PhotoGallerySection';
import { LoveBook } from './components/LoveBook';
import { ReasonsWhyILoveYou } from './components/ReasonsWhyILoveYou';
import { LoveCouponsSection } from './components/LoveCouponsSection';
import { FinalSurpriseSection } from './components/FinalSurpriseSection';
import { FloatingAudioPlayer } from './components/FloatingAudioPlayer';
import { EditorModal, TabType } from './components/EditorModal';
import { FutureTimelineModal } from './components/FutureTimelineModal';
import { saveStoryToCloud, loadStoryFromCloud, subscribeToStoryInCloud } from './utils/firebase';

export default function App() {
  const [story, setStory] = useState<LoveStory>(DEFAULT_LOVE_STORY);
  const [showIntro, setShowIntro] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorInitialTab, setEditorInitialTab] = useState<TabType>('book_months');
  const [editorInitialMonth, setEditorInitialMonth] = useState<number>(0);
  const [isFutureOpen, setIsFutureOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Real-time synchronization exclusively with Firebase Cloud Firestore
  useEffect(() => {
    loadStoryFromCloud().then((cloudStory) => {
      if (cloudStory) {
        setStory(cloudStory);
      } else {
        saveStoryToCloud(DEFAULT_LOVE_STORY);
      }
    });

    const unsubscribe = subscribeToStoryInCloud('main_story', (updatedStory) => {
      if (updatedStory) {
        setStory(updatedStory);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle entering from the intro modal (starts ambient music)
  const handleEnterFromIntro = () => {
    setShowIntro(false);
    audioEngine.play().then((playing) => {
      if (playing) setIsAudioPlaying(true);
    });
  };

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

  // Handle coupon redemption
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
    navigator.clipboard
      .writeText(url)
      .then(() => {
        showToast('¡Enlace de la dedicatoria copiado al portapapeles!');
      })
      .catch(() => {
        prompt('Copia este enlace para compartir:', url);
      });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isCustomized =
    story.receiverName !== 'Dayana Estefania Cuascota Cuascota';

  return (
    <div className="relative min-h-[100dvh] min-h-screen w-full overflow-x-hidden bg-[#07030d] text-slate-100 font-sans-body selection:bg-pink-500/30 selection:text-pink-200 flex flex-col justify-between">
      {/* Intro Overlay: "Tengo algo especial para ti..." */}
      {showIntro && (
        <IntroSpecialModal
          partnerName={story.receiverName}
          onEnter={handleEnterFromIntro}
        />
      )}

      {/* Cosmic background with twinkling stars, drifting particles & floating glowing hearts */}
      <CosmicStarsBackground />

      {/* Floating Audio Player Widget (Always Accessible on bottom right) */}
      <FloatingAudioPlayer
        isPlaying={isAudioPlaying}
        onToggle={handleToggleAudio}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#16072b]/95 text-white px-5 py-3 rounded-2xl shadow-[0_0_25px_rgba(236,72,153,0.4)] flex items-center gap-2.5 text-xs font-semibold animate-fadeIn border border-pink-500/40 backdrop-blur-xl">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Navigation Bar (Hidden in Fullscreen) */}
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

      {/* Main Content Sections */}
      <main className="flex-1 flex flex-col space-y-12 sm:space-y-16">
        {/* Section 1: Hero Dedication */}
        <HeroSection
          story={story}
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={handleToggleAudio}
          onExploreClick={() => {
            const el = document.getElementById('libro');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Section Divider */}
        <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent mx-auto" />

        {/* Section 2: Real-time Love Counter (Days, Hours, Minutes, Seconds) */}
        <TimeTogetherCounter
          anniversaryDate={story.anniversaryDate}
          senderName={story.senderName}
          receiverName={story.receiverName}
        />

        {/* Section Divider */}
        <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-pink-500/40 to-transparent mx-auto" />

        {/* Section 3: Sealed Love Letter & Wax Stamp */}
        <InteractiveLoveLetter
          letter={story.letter}
          senderName={story.senderName}
          receiverName={story.receiverName}
        />

        {/* Section Divider */}
        <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent mx-auto" />

        {/* Section 4: Photo Gallery with Polaroid Frames & Touch Effects */}
        <PhotoGallerySection
          months={story.months}
          partnerName={story.receiverName}
        />

        {/* Section Divider */}
        <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-pink-500/40 to-transparent mx-auto" />

        {/* Section 5: The Interactive 12-Month Love Book */}
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

        {/* Section Divider */}
        <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent mx-auto" />

        {/* Section 6: Reasons Why I Love You */}
        <ReasonsWhyILoveYou
          reasons={story.reasons}
          partnerName={story.receiverName}
        />

        {/* Section Divider */}
        <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-pink-500/40 to-transparent mx-auto" />

        {/* Section 7: Love Coupons */}
        <LoveCouponsSection
          coupons={story.coupons}
          onRedeemCoupon={handleRedeemCoupon}
          partnerName={story.receiverName}
        />

        {/* Section Divider */}
        <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent mx-auto" />

        {/* Section 8: Final Surprise Button with Hearts, Stars & Romantic Decree */}
        <FinalSurpriseSection
          partnerName={story.receiverName}
          senderName={story.senderName}
        />
      </main>

      {/* Romantic Footer */}
      {!isFullscreen && (
        <footer className="py-8 px-6 text-center text-xs text-purple-300/70 border-t border-purple-500/20 flex flex-col sm:flex-row items-center justify-center gap-2 relative z-10 backdrop-blur-md bg-[#07020d]/80">
          <div className="flex items-center gap-1.5">
            <span>Hecho con todo mi amor para</span>
            <span className="font-semibold text-pink-300">
              {story.receiverName}
            </span>
          </div>
          <span className="hidden sm:inline">·</span>
          <span className="flex items-center gap-1 text-purple-200">
            <span>Nuestro pequeño universo infinito</span>
            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
          </span>
        </footer>
      )}

      {/* Future Timeline Modal */}
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
