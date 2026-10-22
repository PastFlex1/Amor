import React, { useEffect, useState } from 'react';

interface ClickHeart {
  id: number;
  x: number;
  y: number;
}

export const FloatingPetals: React.FC = () => {
  const [clickHearts, setClickHearts] = useState<ClickHeart[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Don't trigger if clicking interactive inputs or buttons to avoid distraction
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
        return;
      }

      const newHeart: ClickHeart = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY
      };

      setClickHearts((prev) => [...prev.slice(-12), newHeart]);

      setTimeout(() => {
        setClickHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, 1400);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {/* Subtle floating ambient petals */}
      <div className="absolute inset-0 opacity-40">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-tr from-rose-300 to-rose-100 blur-[1px]"
            style={{
              width: `${12 + (i % 3) * 6}px`,
              height: `${16 + (i % 3) * 8}px`,
              borderRadius: '50% 20% 50% 50%',
              left: `${(i * 11) % 95}%`,
              top: `${(i * 17) % 90}%`,
              animation: `float-slow ${8 + i * 1.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.7}s`,
              transform: `rotate(${i * 35}deg)`
            }}
          />
        ))}
      </div>

      {/* Interactive hearts spawned upon user click */}
      {clickHearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute text-rose-500 pointer-events-none"
          style={{
            left: heart.x - 12,
            top: heart.y - 12,
            animation: 'floatUpAndFade 1.4s ease-out forwards'
          }}
        >
          <svg
            className="w-6 h-6 fill-current filter drop-shadow-[0_2px_4px_rgba(225,29,72,0.3)]"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}

      <style>{`
        @keyframes floatUpAndFade {
          0% {
            opacity: 1;
            transform: translateY(0) scale(0.6) rotate(0deg);
          }
          50% {
            opacity: 0.9;
            transform: translateY(-40px) scale(1.1) rotate(-8deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-90px) scale(1.4) rotate(12deg);
          }
        }
      `}</style>
    </div>
  );
};
