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
  isLevelingUp: boolean; // 레벨업 진행 중 상태
  canLevelUp: boolean; // 레벨업 가능 상태 추가
  feedCharacter: () => void;
  startLevelUp: () => void; // 레벨업 시작 함수 추가
  evolve: () => void;
  hatchEgg: () => void;
  completeLevelUp: () => void;
  resetCharacter: () => void; // 캐릭터 초기화 함수 추가
}

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set, get) => ({
      stage: 1,
      experience: 0,
      level: 1,
      currentExperience: 0,
      needExperience: 3,
      lastFedDate: null,
      feedCount: 0,
      isEvolutionReady: false,
      isLevelingUp: false,
      canLevelUp: false,
      feedCharacter: () => {
        const {
          stage,
          experience,
          lastFedDate,
          feedCount,
          currentExperience,
          needExperience,
          isLevelingUp,
        } = get();

        // 레벨업 진행 중이면 무시
        if (isLevelingUp) return;

        const today = new Date().toISOString().split("T")[0];

        // 날짜가 바뀌면 feedCount 초기화
        if (lastFedDate !== today) {
          set({ lastFedDate: today, feedCount: 0 });
        }

        if (feedCount < 300) {
          // 경험치 1 증가
          const newExperience = experience + 1;
          const newCurrentExperience = currentExperience + 1;

          // 레벨업 가능 상태 체크
          const shouldEnableLevelUp = newCurrentExperience >= needExperience;

          set({
            experience: newExperience,
            currentExperience: newCurrentExperience,
            feedCount: feedCount + 1,
            lastFedDate: today,
            canLevelUp: shouldEnableLevelUp, // 레벨업 가능 상태 설정
          });

          // 진화 조건 체크 (경험치 기반)
          if (
            (stage === 1 && newExperience >= 3) ||
            (stage === 2 && newExperience >= 9) ||
            (stage === 3 && newExperience >= 21)
          ) {
            set({ isEvolutionReady: true });
          }
        }
      },
      startLevelUp: () => {
        const { canLevelUp } = get();
        // 레벨업 가능 상태일 때만 레벨업 시작
        if (canLevelUp) {
          set({ isLevelingUp: true });
        }
      },
      completeLevelUp: () => {
        const { level, needExperience } = get();

        // 레벨 증가, 경험치 초기화, 필요 경험치 업데이트
        const newLevel = level + 1;
        const newNeedExperience = newLevel < 12 ? 3 : 5;

        set({
          level: newLevel,
          currentExperience: 0,
          needExperience: newNeedExperience,
          isLevelingUp: false,
          canLevelUp: false, // 레벨업 후 canLevelUp 초기화
        });
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
          isLevelingUp: false,
          canLevelUp: false,
        });
      },
    }),
    {
      name: "character-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
