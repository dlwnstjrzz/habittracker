import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface CharacterState {
  stage: number; // 1: 알, 2: 1단계 루미, 3: 2단계 루미, 4: 3단계 루미
  experience: number;
  lastFedDate: string | null;
  feedCount: number; // 하루 경험치 획득 횟수 추가
  isEvolutionReady: boolean; // 진화 가능 상태
  feedCharacter: () => void;
  evolve: () => void; // 진화 함수 추가
  hatchEgg: () => void;
}

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set, get) => ({
      stage: 1,
      experience: 0,
      lastFedDate: null,
      feedCount: 0,
      isEvolutionReady: false,
      feedCharacter: () => {
        const { stage, experience, lastFedDate, feedCount } = get();
        const today = new Date().toISOString().split("T")[0];

        // 날짜가 바뀌면 feedCount 초기화
        if (lastFedDate !== today) {
          set({ lastFedDate: today, feedCount: 0 });
        }

        // 하루 3번까지만 경험치 획득 가능
        if (feedCount < 300) {
          const newState = {
            experience: experience + 1,
            feedCount: feedCount + 1,
            lastFedDate: today,
            stage,
            isEvolutionReady: false,
          };

          // 경험치가 다 차면 진화 대기 상태로 변경
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
