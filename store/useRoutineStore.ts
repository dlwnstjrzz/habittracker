import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { nanoid } from "nanoid";

interface Routine {
  id: string;
  text: string;
  categoryId: string;
  startDate: string;
  endDate?: string;
  completedDates: { [date: string]: boolean };
  frequency: {
    type: "daily" | "weekly" | "monthly";
    days?: number[]; // weekly인 경우 요일 (0-6, 0:일요일)
    dates?: number[]; // monthly인 경우 날짜들
  };
  lastCompletedDate?: string; // 마지막으로 완료한 날짜 (YYYY-MM-DD)
}

interface RoutineState {
  routines: Routine[];

  // 루틴 추가
  addRoutine: (routine: Routine) => void;

  // 할일에서 루틴 생성 (기존 할일 삭제 포함)
  createRoutineFromTodo: (todo: {
    id: string;
    text: string;
    categoryId: string;
    date: string;
  }) => Routine;

  // 루틴 삭제
  deleteRoutine: (routineId: string) => void;

  // 루틴 완료 상태 토글 (날짜별)
  toggleRoutineCompletion: (routineId: string, date: string) => void;

  // 특정 날짜에 표시할 루틴 가져오기
  getRoutinesForDate: (date: string) => Routine[];

  // 루틴 수정
  updateRoutine: (routineId: string, updates: Partial<Routine>) => void;
}

export const useRoutineStore = create<RoutineState>()(
  persist(
    (set, get) => ({
      routines: [],

      addRoutine: (routine) =>
        set((state) => ({
          routines: [...state.routines, routine],
        })),

      createRoutineFromTodo: (todo) => {
        const routine: Routine = {
          id: nanoid(),
          text: todo.text,
          categoryId: todo.categoryId,
          startDate: todo.date,
          completedDates: {}, // 빈 객체로 초기화
          frequency: {
            type: "daily",
          },
        };

        set((state) => ({
          routines: [...state.routines, routine],
        }));

        return routine;
      },

      deleteRoutine: (routineId) =>
        set((state) => ({
          routines: state.routines.filter((r) => r.id !== routineId),
        })),

      toggleRoutineCompletion: (routineId, date) =>
        set((state) => {
          const updatedRoutines = state.routines.map((routine) => {
            if (routine.id === routineId) {
              // completedDates가 없으면 빈 객체로 초기화
              const completedDates = routine.completedDates || {};

              // 해당 날짜의 완료 상태 토글
              const currentCompletedState = completedDates[date] || false;
              const newCompletedDates = {
                ...completedDates,
                [date]: !currentCompletedState,
              };

              // 마지막 완료 날짜 업데이트
              const lastCompletedDate = !currentCompletedState
                ? date
                : routine.lastCompletedDate;

              return {
                ...routine,
                completedDates: newCompletedDates,
                lastCompletedDate,
              };
            }
            return routine;
          });

          return { routines: updatedRoutines };
        }),

      getRoutinesForDate: (date) => {
        const { routines } = get();
        const targetDate = new Date(date);
        const dayOfWeek = targetDate.getDay(); // 0-6 (일-토)
        const dayOfMonth = targetDate.getDate(); // 1-31

        return routines
          .filter((routine) => {
            // 시작일 이후인지 확인
            const startDate = new Date(routine.startDate);
            if (targetDate < startDate) return false;

            // 종료일 이전인지 확인 (종료일이 있는 경우)
            if (routine.endDate) {
              const endDate = new Date(routine.endDate);
              if (targetDate > endDate) return false;
            }

            // 주기에 따른 필터링
            const { type, days, dates } = routine.frequency;

            if (type === "daily") {
              return true; // 매일 표시
            }

            if (type === "weekly" && days) {
              return days.includes(dayOfWeek); // 해당 요일에만 표시
            }

            if (type === "monthly" && dates) {
              return dates.includes(dayOfMonth); // 해당 날짜에만 표시
            }

            return false;
          })
          .map((routine) => {
            // completedDates가 없으면 빈 객체로 초기화
            const completedDates = routine.completedDates || {};

            return {
              ...routine,
              // 현재 날짜의 완료 상태를 completed 속성으로 제공
              completed: completedDates[date] || false,
              // completedDates가 없는 경우 빈 객체로 설정
              completedDates: completedDates,
            };
          });
      },

      updateRoutine: (routineId, updates) =>
        set((state) => ({
          routines: state.routines.map((routine) =>
            routine.id === routineId ? { ...routine, ...updates } : routine
          ),
        })),
    }),
    {
      name: "routine-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // 기존 데이터 마이그레이션
      onRehydrateStorage: () => (state) => {
        if (state && state.routines) {
          // 기존 루틴 데이터 마이그레이션
          const migratedRoutines = state.routines.map((routine) => {
            // completedDates가 없는 경우 초기화
            if (!routine.completedDates) {
              // @ts-ignore - 기존 데이터 마이그레이션을 위한 임시 타입 무시
              const isCompleted = routine.completed || false;
              const lastDate = routine.lastCompletedDate || routine.startDate;

              return {
                ...routine,
                completedDates: isCompleted ? { [lastDate]: true } : {},
              };
            }
            return routine;
          });

          // 마이그레이션된 데이터로 상태 업데이트
          if (migratedRoutines.length > 0) {
            state.routines = migratedRoutines;
          }
        }
      },
    }
  )
);
