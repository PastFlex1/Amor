import React, { useState, useEffect } from 'react';
import { Clock, Heart, Sun, Activity } from 'lucide-react';

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

      // Calendar components approximation
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

      // Heartbeats estimation (~72 beats per minute)
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
    <section id="contador" className="py-20 px-6 max-w-5xl mx-auto">
      {/* Header with clean unboxed text */}
      <div className="text-center space-y-3 mb-12">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase text-rose-800">
          <span>Nuestro Tiempo Juntos</span>
          <span aria-hidden="true">·</span>
          <span>Cada Latido Cuenta</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif-title font-bold text-stone-900 tracking-tight text-balance">
          El tiempo que hemos compartido amándonos
        </h2>
        <p className="text-stone-600 text-sm max-w-lg mx-auto">
          Desde el instante en que comenzó nuestra historia, cada día ha sido un regalo irrepetible.
        </p>
      </div>

      {/* Main Counter Grid (Tabular Numerals) */}
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
            className="flex flex-col items-center justify-center p-5 bg-white/90 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <span className="font-mono tabular-nums text-3xl sm:text-4xl font-bold text-rose-950 tracking-tight">
              {String(item.value).padStart(2, '0')}
            </span>
            <span className="text-xs font-medium text-rose-800/80 mt-1 uppercase tracking-wider">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Love Milestones Strip (Single Level Elevation) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-gradient-to-br from-rose-950 to-stone-950 text-white rounded-2xl shadow-sm flex items-start gap-4">
          <div className="p-3 bg-white/10 rounded-xl text-rose-300 shrink-0">
            <Heart className="w-5 h-5 fill-rose-400 text-rose-400" />
          </div>
          <div>
            <span className="font-mono tabular-nums text-2xl font-bold text-rose-100">
              {time.totalDays.toLocaleString('es-ES')}
            </span>
            <p className="text-xs text-rose-200/80 font-medium uppercase tracking-wider mt-0.5">
              Días de Amor Compartidos
            </p>
            <p className="text-xs text-rose-300/60 mt-1">
              Más de {time.totalHours.toLocaleString('es-ES')} horas eligiéndonos mutuamente.
            </p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-rose-100/90 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-rose-50 rounded-xl text-rose-800 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="font-mono tabular-nums text-2xl font-bold text-stone-900">
              ~{(time.heartbeats / 1000000).toFixed(2)}M
            </span>
            <p className="text-xs text-stone-500 font-medium uppercase tracking-wider mt-0.5">
              Latidos por Ti
            </p>
            <p className="text-xs text-stone-600 mt-1">
              Aproximadamente {time.heartbeats.toLocaleString('es-ES')} latidos dedicados a ti.
            </p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-rose-100/90 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-700 shrink-0">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <span className="font-mono tabular-nums text-2xl font-bold text-stone-900">
              {time.sunrises.toLocaleString('es-ES')}
            </span>
            <p className="text-xs text-stone-500 font-medium uppercase tracking-wider mt-0.5">
              Amaneceres Juntos
            </p>
            <p className="text-xs text-stone-600 mt-1">
              Despertando sabiendo que eres lo más lindo de mi vida.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
