// Shared TypeScript models and interfaces for the Premium Gym Website

export interface GymService {
  id: string;
  title: string;
  description: string;
  iconName: string; // mapped to Lucide icons
  badge: string;
  bgGradient: string;
  imageUrl?: string;
}

export interface MembershipTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isFeatured: boolean;
  accentColor: string; // e.g. gold, neon, cyan
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  result: string; // e.g. "Lost 15kg & built core strength"
  quote: string;
  rating: number;
  avatarUrl: string;
}
