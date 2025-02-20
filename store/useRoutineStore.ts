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
  loadRoutines: () => Promise<Routine[]>;
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
        const routines = JSON.parse(data);
        set({ routines });
        return routines;
      }
      return [];
    } catch (error) {
      console.error("Failed to load routines:", error);
      return [];
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
