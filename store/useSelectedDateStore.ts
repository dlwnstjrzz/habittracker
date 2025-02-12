import { create } from "zustand";

interface SelectedDateStore {
  selectedDate: string;
  completedCount: number;
  setSelectedDate: (date: string) => void;
  setCompletedCount: (count: number) => void;
}

export const useSelectedDateStore = create<SelectedDateStore>((set) => ({
  selectedDate: new Date().toISOString().split("T")[0],
  completedCount: 0,
  setSelectedDate: (date) => set({ selectedDate: date }),
  setCompletedCount: (count) => set({ completedCount: count }),
}));
