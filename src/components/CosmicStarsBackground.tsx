import React, { useEffect, useState, useMemo } from 'react';

interface ClickParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDuration: number;
  delay: number;
  color: string;
}

interface DriftingHeart {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  color: string;
}

export const CosmicStarsBackground: React.FC = () => {
  const [clickParticles, setClickParticles] = useState<ClickParticle[]>([]);

  // Generate deterministic stars on mount
  const stars = useMemo<Star[]>(() => {
    const starList: Star[] = [];
    const colors = ['#ffffff', '#fce7f3', '#f3e8ff', '#e0e7ff', '#fbcfe8', '#ddd6fe'];
    for (let i = 0; i < 90; i++) {
      starList.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() < 0.6 ? 1.5 : Math.random() < 0.85 ? 2.5 : 3.5,
        opacity: 0.3 + Math.random() * 0.7,
        twinkleDuration: 2.5 + Math.random() * 4,
        delay: Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    return starList;
  }, []);

  // Generate slowly floating hearts
  const driftingHearts = useMemo<DriftingHeart[]>(() => {
    const hearts: DriftingHeart[] = [];
    const heartColors = [
      'rgba(236, 72, 153, 0.45)', // pink
      'rgba(168, 85, 247, 0.45)', // purple
      'rgba(244, 114, 182, 0.4)', // rose
      'rgba(192, 132, 252, 0.4)'  // violet
    ];
    for (let i = 0; i < 14; i++) {
      hearts.push({
        id: i,
        left: 5 + Math.random() * 90,
        size: 14 + Math.random() * 18,
        duration: 14 + Math.random() * 12,
        delay: Math.random() * 10,
        opacity: 0.3 + Math.random() * 0.4,
        color: heartColors[i % heartColors.length]
      });
    }
    return hearts;
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.getAttribute('role') === 'dialog')
      ) {
        return;
      }

      const colors = ['#f472b6', '#ec4899', '#c084fc', '#a855f7', '#ffffff'];
      const newItems: ClickParticle[] = Array.from({ length: 3 }).map((_, idx) => ({
        id: Date.now() + Math.random() + idx,
        x: clientX + (Math.random() * 24 - 12),
        y: clientY + (Math.random() * 24 - 12),
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 16 + Math.random() * 12
      }));

      setClickParticles((prev) => [...prev.slice(-15), ...newItems]);

      setTimeout(() => {
        setClickParticles((prev) =>
          prev.filter((p) => !newItems.some((n) => n.id === p.id))
        );
      }, 1400);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Deep Cosmic Universe Gradient Base */}
      <div className="absolute inset-0 bg-[#07030d] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(88,28,135,0.4),rgba(7,3,13,0.95))]" />

      {/* Ambient glowing nebula orbs (Purple & Soft Pink) */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-900/20 blur-[130px]" />
      <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] rounded-full bg-fuchsia-950/25 blur-[140px]" />
      <div className="absolute -bottom-40 left-1/3 w-[650px] h-[650px] rounded-full bg-pink-950/20 blur-[140px]" />

      {/* Twinkling Stars */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              boxShadow:
                star.size > 2
                  ? `0 0 8px ${star.color}, 0 0 16px rgba(168,85,247,0.4)`
                  : 'none',
              animation: `twinkle ${star.twinkleDuration}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}
      </div>

      {/* Floating Gentle Cosmic Hearts */}
      <div className="absolute inset-0">
        {driftingHearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute"
            style={{
              left: `${heart.left}%`,
              bottom: '-40px',
              animation: `float-heart-drift ${heart.duration}s linear infinite`,
              animationDelay: `${heart.delay}s`
            }}
          >
            <svg
              width={heart.size}
              height={heart.size}
              viewBox="0 0 24 24"
              fill={heart.color}
              style={{
                filter: `drop-shadow(0 0 8px ${heart.color})`
              }}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        ))}
      </div>

      {/* Click / Tap Spawning Hearts with sparkles */}
      {clickParticles.map((p) => (
        <div
          key={p.id}
          className="absolute pointer-events-none"
          style={{
            left: p.x - p.size / 2,
            top: p.y - p.size / 2,
            animation: 'cosmicHeartBurst 1.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards'
          }}
        >
          <svg
            width={p.size}
            height={p.size}
            viewBox="0 0 24 24"
            fill={p.color}
            style={{
              filter: `drop-shadow(0 0 10px ${p.color})`
            }}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}

      <style>{`
        @keyframes cosmicHeartBurst {
          0% {
            opacity: 1;
            transform: translateY(0) scale(0.6) rotate(0deg);
          }
          60% {
            opacity: 0.9;
            transform: translateY(-45px) scale(1.15) rotate(-12deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-90px) scale(1.4) rotate(16deg);
          }
        }
      `}</style>
    </div>
  );
};
