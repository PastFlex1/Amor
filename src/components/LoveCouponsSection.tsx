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
    <section id="vales" className="py-20 px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 mb-12">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase text-rose-800">
          <span>Regalos Especiales</span>
          <span aria-hidden="true">·</span>
          <span>Sin Fecha de Caducidad</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif-title font-bold text-stone-900 tracking-tight text-balance">
          Vales de amor canjeables para {partnerName}
        </h2>
        <p className="text-stone-600 text-sm max-w-md mx-auto">
          Promesas y detalles que puedes hacer válidos cuando tú lo decidas. Solo presiona "Canjear".
        </p>
      </div>

      {/* Grid of Coupon Tickets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className={`relative rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
              coupon.redeemed
                ? 'bg-stone-50 border-stone-200 opacity-80'
                : 'bg-white border-rose-200/90 shadow-sm hover:shadow-md'
            }`}
          >
            {/* Ticket Notches at left & right */}
            <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FAF6F0] border border-rose-200/80" />
            <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FAF6F0] border border-rose-200/80" />

            <div className="space-y-3 pl-2 pr-2">
              <div className="flex items-center justify-between">
                <div
                  className={`p-2.5 rounded-xl ${
                    coupon.redeemed
                      ? 'bg-stone-200 text-stone-500'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {getIcon(coupon.iconName)}
                </div>

                <span className="text-xs font-mono text-stone-400">
                  CUPÓN VALIDO
                </span>
              </div>

              <h3 className="font-serif-title text-xl font-bold text-stone-900">
                {coupon.title}
              </h3>

              <p className="text-stone-600 text-sm leading-relaxed font-sans-body">
                {coupon.description}
              </p>
            </div>

            {/* Bottom Redeem Bar */}
            <div className="mt-6 pt-4 border-t border-dashed border-rose-200 pl-2 pr-2 flex items-center justify-between">
              {coupon.redeemed ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Canjeado {coupon.redeemedAt ? `el ${coupon.redeemedAt}` : 'con amor'}</span>
                </div>
              ) : (
                <button
                  onClick={() => onRedeemCoupon(coupon.id)}
                  type="button"
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded-full shadow-sm hover:shadow transition-all"
                >
                  Canjear este vale
                </button>
              )}

              <span className="text-[11px] font-script text-rose-800 text-base">
                Para ti con amor ♥
              </span>
            </div>

            {/* Redeemed Stamp Watermark */}
            {coupon.redeemed && (
              <div className="absolute top-3 right-8 rotate-12 pointer-events-none border-2 border-emerald-600 text-emerald-700 px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-widest opacity-80">
                ✓ Canjeado
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
