import { create } from 'zustand';
import { WeeklyMetrics, WeeklyReview } from '@/actions/weekly-review';

interface ReviewStore {
  reviews: Record<string, WeeklyReview>; // keyed by startDate
  metrics: Record<string, WeeklyMetrics>; // keyed by startDate
  reflections: Record<string, Record<string, string>>; // keyed by startDate
  setReviewData: (startDate: string, review: WeeklyReview | null, metrics: WeeklyMetrics, reflection: Record<string, string>) => void;
}

export const useReviewStore = create<ReviewStore>((set) => ({
  reviews: {},
  metrics: {},
  reflections: {},
  setReviewData: (startDate, review, metrics, reflection) => 
    set((state) => ({ 
      reviews: { ...state.reviews, [startDate]: review as WeeklyReview },
      metrics: { ...state.metrics, [startDate]: metrics },
      reflections: { ...state.reflections, [startDate]: reflection }
    })),
}));
