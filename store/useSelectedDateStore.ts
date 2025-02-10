import { create } from "zustand";

interface SelectedDateStore {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export const useSelectedDateStore = create<SelectedDateStore>((set) => ({
  selectedDate: new Date().toISOString().split("T")[0],
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
