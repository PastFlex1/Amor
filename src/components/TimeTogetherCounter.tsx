import React, { useState, useEffect } from 'react';
import { Clock, Heart, Sun, Activity, Sparkles, Calendar } from 'lucide-react';

interface TimeTogetherCounterProps {
  anniversaryDate: string;
  senderName: string;
  receiverName: string;
}

interface TimeBreakdown {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  heartbeats: number;
  sunrises: number;
}

export const TimeTogetherCounter: React.FC<TimeTogetherCounterProps> = ({
  anniversaryDate,
  senderName,
  receiverName
}) => {
  const [time, setTime] = useState<TimeBreakdown>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
    totalHours: 0,
    heartbeats: 0,
    sunrises: 0
  });

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(anniversaryDate).getTime();
      const now = Date.now();
      const diffMs = Math.max(0, now - start);

      const totalSeconds = Math.floor(diffMs / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      const totalDays = Math.floor(totalHours / 24);

      // Calendar breakdown
      const startDate = new Date(anniversaryDate);
      const currentDate = new Date();

      let years = currentDate.getFullYear() - startDate.getFullYear();
      let months = currentDate.getMonth() - startDate.getMonth();
      let days = currentDate.getDate() - startDate.getDate();

      if (days < 0) {
        months -= 1;
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      // Heartbeats approximation (~72 bpm)
      const heartbeats = totalMinutes * 72;
      const sunrises = totalDays;

      setTime({
        years: Math.max(0, years),
        months: Math.max(0, months),
        days: Math.max(0, days),
        hours,
        minutes,
        seconds,
        totalDays,
        totalHours,
        heartbeats,
        sunrises
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [anniversaryDate]);

  return (
    <section id="contador" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto relative z-10">
      {/* Header */}
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs font-semibold tracking-widest uppercase text-pink-300">
          <Clock className="w-3.5 h-3.5 text-pink-400" />
          <span>Nuestro Tiempo Juntos</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif-title font-bold text-white tracking-tight leading-tight text-balance">
          Cada segundo a tu lado es un regalo
        </h2>
        <p className="text-slate-300 text-sm max-w-lg mx-auto">
          Desde aquel primer instante juntos, el reloj no hace más que confirmar que amarte es lo mejor que me ha pasado.
        </p>
      </div>

      {/* Main Counter Units (Years, Months, Days, Hours, Minutes, Seconds) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-10">
        {[
          { label: 'Años', value: time.years },
          { label: 'Meses', value: time.months },
          { label: 'Días', value: time.days },
          { label: 'Horas', value: time.hours },
          { label: 'Minutos', value: time.minutes },
          { label: 'Segundos', value: time.seconds }
        ].map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-b from-[#1c0b38]/80 via-[#130728]/80 to-[#0a0316]/90 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:border-pink-500/60 hover:shadow-[0_0_25px_rgba(236,72,153,0.3)] transition-all duration-300 backdrop-blur-md group"
          >
            <span className="font-mono tabular-nums text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-300 via-purple-100 to-white bg-clip-text text-transparent group-hover:scale-105 transition-transform">
              {String(item.value).padStart(2, '0')}
            </span>
            <span className="text-[11px] font-semibold text-pink-300/90 mt-1 uppercase tracking-wider">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Romantic Metrics Strips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Days */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/80 via-[#1e0a3c]/80 to-pink-950/40 border border-purple-500/30 shadow-md backdrop-blur-md flex items-start gap-4">
          <div className="p-3 bg-pink-500/20 border border-pink-400/30 rounded-xl text-pink-300 shrink-0">
            <Heart className="w-5 h-5 fill-pink-400 text-pink-400 animate-pulse" />
          </div>
          <div>
            <span className="font-mono tabular-nums text-2xl font-bold text-white">
              {time.totalDays.toLocaleString('es-ES')}
            </span>
            <p className="text-xs text-pink-300 font-semibold uppercase tracking-wider mt-0.5">
              Días de Amor Compartidos
            </p>
            <p className="text-xs text-slate-300 mt-1">
              Más de {time.totalHours.toLocaleString('es-ES')} horas eligiéndonos mutuamente.
            </p>
          </div>
        </div>

        {/* Heartbeats */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#16072b]/80 via-[#1c0a36]/80 to-[#0e041c]/90 border border-purple-500/30 shadow-md backdrop-blur-md flex items-start gap-4">
          <div className="p-3 bg-purple-500/20 border border-purple-400/30 rounded-xl text-purple-300 shrink-0">
            <Activity className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <span className="font-mono tabular-nums text-2xl font-bold text-white">
              ~{(time.heartbeats / 1000000).toFixed(2)}M
            </span>
            <p className="text-xs text-purple-300 font-semibold uppercase tracking-wider mt-0.5">
              Latidos por Ti
            </p>
            <p className="text-xs text-slate-300 mt-1">
              Aproximadamente {time.heartbeats.toLocaleString('es-ES')} latidos dedicados a Dayana.
            </p>
          </div>
        </div>

        {/* Sunrises */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#16072b]/80 via-[#1c0a36]/80 to-[#0e041c]/90 border border-purple-500/30 shadow-md backdrop-blur-md flex items-start gap-4">
          <div className="p-3 bg-amber-500/20 border border-amber-400/30 rounded-xl text-amber-300 shrink-0">
            <Sun className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <span className="font-mono tabular-nums text-2xl font-bold text-white">
              {time.sunrises.toLocaleString('es-ES')}
            </span>
            <p className="text-xs text-amber-300 font-semibold uppercase tracking-wider mt-0.5">
              Amaneceres Juntos
            </p>
            <p className="text-xs text-slate-300 mt-1">
              Despertando sabiendo que eres lo más lindo de mi universo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
