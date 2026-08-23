import { create } from "zustand";
import { ProfileStats } from "@/actions/profile";

interface ProfileState {
  email: string | null;
  stats: ProfileStats | null;
  isHydrated: boolean;

  setInitialData: (email: string, stats: ProfileStats) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  email: null,
  stats: null,
  isHydrated: false,

  setInitialData: (email, stats) => set({ email, stats, isHydrated: true }),
}));
