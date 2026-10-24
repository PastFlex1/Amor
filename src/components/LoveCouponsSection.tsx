import React from 'react';
import {
  UtensilsCrossed,
  Sparkles,
  Film,
  Compass,
  HeartHandshake,
  CheckCircle2,
  Gift
} from 'lucide-react';
import { LoveCoupon } from '../types';

interface LoveCouponsSectionProps {
  coupons: LoveCoupon[];
  onRedeemCoupon: (couponId: string) => void;
  partnerName: string;
}

export const LoveCouponsSection: React.FC<LoveCouponsSectionProps> = ({
  coupons,
  onRedeemCoupon,
  partnerName
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'Film':
        return <Film className="w-5 h-5" />;
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5" />;
      default:
        return <Gift className="w-5 h-5" />;
    }
  };

  return (
    <section id="vales" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto relative z-10">
      {/* Header */}
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs font-semibold tracking-widest uppercase text-pink-300">
          <Gift className="w-3.5 h-3.5 text-pink-400" />
          <span>Regalos Especiales</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif-title font-bold text-white tracking-tight leading-tight text-balance">
          Vales de amor canjeables para {partnerName}
        </h2>
        <p className="text-slate-300 text-sm max-w-md mx-auto">
          Promesas y detalles que puedes hacer válidos cuando tú lo decidas. Solo presiona "Canjear".
        </p>
      </div>

      {/* Grid of Coupon Tickets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className={`relative rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between overflow-hidden backdrop-blur-md ${
              coupon.redeemed
                ? 'bg-[#100720]/60 border-purple-900/40 opacity-75'
                : 'bg-gradient-to-b from-[#1b0a33]/90 via-[#130726]/90 to-[#0b0317]/95 border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:border-pink-500/60 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]'
            }`}
          >
            {/* Ticket Notches at left & right */}
            <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[#07030d] border border-purple-500/40" />
            <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[#07030d] border border-purple-500/40" />

            <div className="space-y-3 pl-2 pr-2">
              <div className="flex items-center justify-between">
                <div
                  className={`p-2.5 rounded-xl ${
                    coupon.redeemed
                      ? 'bg-purple-950/60 text-slate-500'
                      : 'bg-gradient-to-tr from-purple-800 to-pink-700 text-white shadow-md'
                  }`}
                >
                  {getIcon(coupon.iconName)}
                </div>

                <span className="text-[11px] font-mono text-pink-300/80 uppercase tracking-wider">
                  CUPÓN VÁLIDO
                </span>
              </div>

              <h3 className="font-serif-title text-xl font-bold text-white">
                {coupon.title}
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed font-sans-body">
                {coupon.description}
              </p>
            </div>

            {/* Bottom Redeem Bar */}
            <div className="mt-6 pt-4 border-t border-dashed border-purple-500/30 pl-2 pr-2 flex items-center justify-between">
              {coupon.redeemed ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Canjeado {coupon.redeemedAt ? `el ${coupon.redeemedAt}` : 'con amor'}</span>
                </div>
              ) : (
                <button
                  onClick={() => onRedeemCoupon(coupon.id)}
                  type="button"
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all cursor-pointer"
                >
                  Canjear este vale
                </button>
              )}

              <span className="font-script text-pink-300 text-lg">
                Para ti con amor ♥
              </span>
            </div>

            {/* Redeemed Stamp Watermark */}
            {coupon.redeemed && (
              <div className="absolute top-4 right-8 rotate-12 pointer-events-none border-2 border-emerald-400 text-emerald-300 px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-widest bg-emerald-950/60">
                ✓ Canjeado
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
