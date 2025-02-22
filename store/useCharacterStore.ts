import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface CharacterState {
  stage: number; // 1: 알, 2: 1단계 루미, 3: 2단계 루미, 4: 3단계 루미
  experience: number; // 진화를 위한 경험치
  level: number;
  currentExperience: number; // 현재 레벨의 경험치
  needExperience: number; // 레벨업을 위한 필요 경험치
  lastFedDate: string | null;
  feedCount: number;
  isEvolutionReady: boolean;
  feedCharacter: () => void;
  evolve: () => void;
  hatchEgg: () => void;
}

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set, get) => ({
      stage: 1,
      experience: 0,
      level: 1,
      currentExperience: 0, // 초기값 0
      needExperience: 3,
      lastFedDate: null,
      feedCount: 0,
      isEvolutionReady: false,
      feedCharacter: () => {
        const {
          stage,
          experience,
          lastFedDate,
          feedCount,
          level,
          currentExperience,
        } = get();
        const today = new Date().toISOString().split("T")[0];

        // 날짜가 바뀌면 feedCount 초기화
        if (lastFedDate !== today) {
          set({ lastFedDate: today, feedCount: 0 });
        }

        if (feedCount < 300) {
          const newState = {
            experience: experience + 1,
            currentExperience: currentExperience + 1,
            feedCount: feedCount + 1,
            lastFedDate: today,
            stage,
            level,
            needExperience: level < 12 ? 3 : 5,
            isEvolutionReady: false,
          };

          // 레벨업 체크 (feedCount가 3이 되면 레벨업)
          if (feedCount >= 2) {
            // 2에서 체크하는 이유는 현재 증가된 feedCount까지 포함해서 3이 되기 때문
            newState.level = level + 1;
            newState.feedCount = 0;
            newState.currentExperience = 0; // 레벨업하면 현재 경험치 초기화
            newState.needExperience = newState.level < 12 ? 3 : 5;
          }

          // 진화 조건 체크 (experience 기반)
          if (
            (stage === 1 && experience + 1 >= 3) ||
            (stage === 2 && experience + 1 >= 9) ||
            (stage === 3 && experience + 1 >= 21)
          ) {
            newState.isEvolutionReady = true;
          }

          set(newState);
        }
      },
      evolve: () => {
        const { stage, isEvolutionReady } = get();
        if (isEvolutionReady) {
          set({
            stage: stage + 1,
            experience: 0,
            isEvolutionReady: false,
          });
        }
      },
      hatchEgg: () => {
        set({ stage: 2, experience: 0, isEvolutionReady: false });
      },
      resetCharacter: () => {
        set({
          stage: 1,
          experience: 0,
          level: 1,
          currentExperience: 0,
          needExperience: 3,
          lastFedDate: null,
          feedCount: 0,
          isEvolutionReady: false,
        });
      },
    }),
    {
      name: "character-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
