import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Routine {
  id: string;
  todoId: string;
  text: string;
  categoryId: string;
  startDate: string;
  frequency: "daily" | "weekly" | "monthly";
  completed: boolean;
}

interface RoutineStore {
  routines: Routine[];
  addRoutine: (routine: Routine) => void;
  loadRoutines: () => Promise<void>;
  saveRoutineData: (routines: Routine[]) => Promise<void>;
}

export const useRoutineStore = create<RoutineStore>((set) => ({
  routines: [],
  addRoutine: (routine) =>
    set((state) => ({ routines: [...state.routines, routine] })),
  loadRoutines: async () => {
    try {
      const data = await AsyncStorage.getItem("routines");
      if (data) {
        set({ routines: JSON.parse(data) });
      }
    } catch (error) {
      console.error("Failed to load routines:", error);
    }
  },
  saveRoutineData: async (routines) => {
    try {
      set({ routines });
      await AsyncStorage.setItem("routines", JSON.stringify(routines));
    } catch (error) {
      console.error("Error saving routines:", error);
    }
  },
}));
