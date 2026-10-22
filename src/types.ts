export interface MonthMemory {
  id: string;
  monthNumber: number; // 1 to 12
  monthLabel: string; // e.g. "Mes 1 · Octubre"
  title: string;
  date: string;
  location?: string;
  story: string;
  anecdote?: string; // "El momento o detalle que nunca olvidaré"
  quote?: string; // Poetic line
  songRecommendation?: string; // Musical memory
  imageUrl?: string;
  presetStyle?:
    | 'rose_sunset'
    | 'cafe_date'
    | 'stargazing'
    | 'beach_walk'
    | 'celebration_wine'
    | 'rainy_day'
    | 'adventure'
    | 'cozy_home'
    | 'sweet_moments'
    | 'deep_talks';
  likesCount?: number;
}

export interface MemoryItem {
  id: string;
  date: string;
  title: string;
  description: string;
  location?: string;
  imageUrl?: string;
  presetStyle?: 'rose_sunset' | 'cafe_date' | 'stargazing' | 'beach_walk' | 'celebration_wine';
}

export interface LoveReason {
  id: string;
  title: string;
  description: string;
}

export interface LoveCoupon {
  id: string;
  title: string;
  description: string;
  iconName: string;
  redeemed: boolean;
  redeemedAt?: string;
}

export interface FutureMilestone {
  id: string;
  year: number; // e.g. 2025, 2026, 2027, 2030
  month: string; // e.g. "Enero", "Febrero", "Junio", "Diciembre"
  targetDate?: string; // e.g. "2026-06-15"
  title: string;
  story: string; // The future narrative / promise / dream
  location?: string; // Dream location (e.g. "París", "Nuestra propia casa")
  quote?: string; // Special romantic quote or vow
  category?: 'viaje' | 'hogar' | 'metas' | 'celebracion' | 'amor' | 'familia';
  mediaType: 'image' | 'video' | 'none';
  mediaUrl?: string; // Image URL/base64, or Video URL (MP4, YouTube, Vimeo, base64)
}

export interface LoveStory {
  senderName: string;
  receiverName: string;
  anniversaryDate: string; // ISO string e.g. "2023-10-18T19:30"
  heroKicker: string;
  heroHeadline: string;
  heroNote: string;
  months: MonthMemory[]; // 12 months of memories
  letter: {
    title: string;
    paragraphs: string[];
    signature: string;
    waxColor: 'burgundy' | 'rose' | 'gold';
  };
  memories: MemoryItem[];
  reasons: LoveReason[];
  coupons: LoveCoupon[];
  futureMilestones?: FutureMilestone[]; // Future timeline organized by years & months
  soundtrack: {
    enabled: boolean;
    tune: 'canon' | 'lullaby' | 'romanticWaltz' | 'gentleRiver';
    volume: number;
  };
}
