import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Heart, Gift, Stars, X, Send, Award } from 'lucide-react';

interface FinalSurpriseSectionProps {
  partnerName: string;
  senderName: string;
}

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  vRot: number;
  shape: 'heart' | 'star' | 'circle';
  opacity: number;
}

export const FinalSurpriseSection: React.FC<FinalSurpriseSectionProps> = ({
  partnerName,
  senderName
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [hugCount, setHugCount] = useState(0);
  const [hugBurst, setHugBurst] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Confetti / Starburst engine
  const triggerConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#f472b6', '#ec4899', '#c084fc', '#a855f7', '#fb7185', '#fbbf24', '#ffffff'];
    const shapes: Array<'heart' | 'star' | 'circle'> = ['heart', 'star', 'circle'];

    const particles: ConfettiParticle[] = [];
    const count = 120;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 9;
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.45,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 8 + Math.random() * 12,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 8,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        opacity: 1
      });
    }

    const drawHeart = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(0, topCurveHeight);
      c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 1.5, 0, size);
      c.bezierCurveTo(0, (size + topCurveHeight) / 1.5, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      c.closePath();
      c.fill();
    };

    const drawStar = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      for (let i = 0; i < 5; i++) {
        c.lineTo(Math.cos(((18 + i * 72) * Math.PI) / 180) * size, -Math.sin(((18 + i * 72) * Math.PI) / 180) * size);
        c.lineTo(Math.cos(((54 + i * 72) * Math.PI) / 180) * (size / 2), -Math.sin(((54 + i * 72) * Math.PI) / 180) * (size / 2));
      }
      c.closePath();
      c.fill();
    };

    let start = Date.now();
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = Date.now() - start;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18; // gravity
        p.vx *= 0.985;
        p.rotation += p.vRot;
        p.opacity = Math.max(0, 1 - elapsed / 3500);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        if (p.shape === 'heart') {
          drawHeart(ctx, p.size);
        } else if (p.shape === 'star') {
          drawStar(ctx, p.size * 0.7);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      if (elapsed < 3500) {
        animationFrameRef.current = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(render);
  };

  const handleOpenSurprise = () => {
    setIsRevealed(true);
    setTimeout(() => {
      triggerConfetti();
    }, 150);
  };

  const handleSendHug = () => {
    setHugCount((prev) => prev + 1);
    setHugBurst(true);
    triggerConfetti();
    setTimeout(() => setHugBurst(false), 1200);
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <section id="sorpresa" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto relative z-10">
      {/* Canvas for heart & star explosions */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      />

      {/* Main Container */}
      <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-b from-purple-950/70 via-[#16082c]/80 to-[#0c0419]/90 border border-purple-500/40 shadow-[0_0_40px_rgba(168,85,247,0.25)] backdrop-blur-xl text-center overflow-hidden">
        {/* Ambient subtle glow lights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-pink-500/20 blur-3xl pointer-events-none" />

        {/* Header Kicker */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/60 border border-pink-500/40 text-xs font-semibold text-pink-300 uppercase tracking-widest mb-6">
          <Gift className="w-4 h-4 text-pink-400" />
          <span>El Detalle Final</span>
          <Sparkles className="w-4 h-4 text-amber-300" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-serif-title font-bold text-white tracking-tight leading-tight mb-4 text-balance">
          Una sorpresa guardada solo para ti
        </h2>

        <p className="text-slate-300 text-sm sm:text-base font-sans-body max-w-lg mx-auto mb-8 leading-relaxed">
          Presiona el botón para desbloquear un mensaje lleno de magia, estrellas y todo el amor que vive en mi pecho.
        </p>

        {/* Big Glow Button */}
        <div className="flex justify-center">
          <button
            onClick={handleOpenSurprise}
            type="button"
            className="group relative px-8 sm:px-12 py-4 sm:py-5 rounded-full text-base sm:text-lg font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 shadow-[0_0_35px_rgba(236,72,153,0.55)] hover:shadow-[0_0_50px_rgba(236,72,153,0.85)] transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-amber-200 group-hover:rotate-45 transition-transform" />
            <span>Revelar Mi Sorpresa Especial</span>
            <Heart className="w-5 h-5 text-pink-200 fill-pink-300 group-hover:scale-125 transition-transform" />
          </button>
        </div>
      </div>

      {/* Revealed Modal with Stars & Romantic Decree */}
      {isRevealed && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn overflow-y-auto"
          onClick={() => setIsRevealed(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full my-8 p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#1e0a3c] via-[#140628] to-[#090214] border-2 border-pink-500/50 shadow-[0_0_60px_rgba(236,72,153,0.4)] backdrop-blur-2xl text-center space-y-6 animate-scaleUp"
          >
            {/* Close button */}
            <button
              onClick={() => setIsRevealed(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 transition-colors"
              title="Cerrar sorpresa"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-900 to-pink-900 border border-pink-400/60 flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.6)] animate-pulse-soft">
                <Heart className="w-10 h-10 text-pink-300 fill-pink-400 filter drop-shadow-[0_0_10px_rgba(244,114,182,0.9)]" />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase text-pink-300">
                <Stars className="w-4 h-4 text-amber-300" />
                <span>Promesa de Amor Infinito</span>
                <Stars className="w-4 h-4 text-amber-300" />
              </div>

              <h3 className="text-2xl sm:text-4xl font-serif-title font-bold text-white tracking-tight">
                Para el Gran Amor de Mi Vida
              </h3>

              <p className="font-script text-3xl sm:text-4xl text-pink-300">
                {partnerName}
              </p>
            </div>

            {/* Heartfelt Message */}
            <div className="space-y-4 text-slate-200 font-editorial text-lg sm:text-xl leading-relaxed text-balance border-t border-b border-purple-500/30 py-6">
              <p>
                «Dayana, si volviera a nacer mil veces en mil universos distintos, en todos y cada uno de ellos te buscaría a ti. No existe casualidad más perfecta ni regalo más sagrado que haber coincidido contigo.»
              </p>
              <p>
                «Gracias por iluminar mis días con tu risa, por darme paz cuando el mundo es un caos y por enseñarme lo que significa amar de verdad. Prometo elegirte, cuidarte y hacerte sonreír hoy, mañana y en toda la eternidad.»
              </p>
              <p className="text-pink-300 font-semibold font-script text-2xl sm:text-3xl">
                ¡Te amo con todo mi corazón y mi alma!
              </p>
            </div>

            {/* Sender signature */}
            <div className="text-right pr-4">
              <p className="font-script text-3xl text-pink-200">
                Siempre tuyo,
              </p>
              <p className="text-xs uppercase tracking-widest text-purple-300/80">
                {senderName}
              </p>
            </div>

            {/* Interactive Actions */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleSendHug}
                type="button"
                className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-purple-900/80 hover:bg-purple-800 border border-purple-400/40 shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                <span>Enviar abrazo virtual {hugCount > 0 ? `(${hugCount})` : ''}</span>
              </button>

              <button
                onClick={triggerConfetti}
                type="button"
                className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-pink-900/80 hover:bg-pink-800 border border-pink-400/40 shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>¡Lanzar más estrellas!</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
