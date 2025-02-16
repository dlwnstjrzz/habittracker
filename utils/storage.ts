import AsyncStorage from "@react-native-async-storage/async-storage";
import { nanoid } from "nanoid";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  categoryId: string;
}

export interface Category {
  id: string;
  title: string;
  color: string;
}

export interface Routine {
  id: string;
  todoId: string;
  text: string;
  categoryId: string;
  startDate: string;
  endDate?: string;
  frequency: "daily" | "weekly" | "monthly";
}

export interface StorageData {
  categories: Category[];
  todos: { [date: string]: Todo[] };
  routines: Routine[];
}

const STORAGE_KEY = "todos_v1";
const ROUTINES_KEY = "routines";

// 초기 카테고리 데이터
export const initialCategories: Category[] = [
  {
    id: "startup",
    title: "창업",
    color: "blue",
  },
  {
    id: "exercise",
    title: "운동",
    color: "green",
  },
  {
    id: "growth",
    title: "자기계발",
    color: "purple",
  },
];

// 초기 데이터
const initialData: StorageData = {
  categories: initialCategories,
  todos: {},
  routines: [],
};

export async function getCategories(): Promise<StorageData | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    console.log("data", data);
    if (!data) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error getting categories:", error);
    return null;
  }
}

export async function saveCategories(data: StorageData): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving categories:", error);
  }
}

export async function logAllStorage() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    console.log("==== All Storage ====");
    items.forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
  } catch (error) {
    console.error("Error logging storage:", error);
  }
}

export async function logTodos() {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    console.log("==== Todos Data ====");
    console.log(JSON.parse(data || "null"));
  } catch (error) {
    console.error("Error logging todos:", error);
  }
}

export async function clearStorage() {
  try {
    await AsyncStorage.clear();
    console.log("Storage cleared");
  } catch (error) {
    console.error("Error clearing storage:", error);
  }
}

// 특정 날짜의 완료된 할일 개수를 가져오는 함수 추가
export async function getCompletedTodosCount(date: string): Promise<number> {
  const data = await getCategories();
  if (!data || !data.todos[date]) return 0;

  return data.todos[date].filter((todo) => todo.completed).length;
}

// 루틴 저장 함수
export async function saveRoutine(routine: Routine): Promise<void> {
  try {
    const data = await AsyncStorage.getItem(ROUTINES_KEY);
    const routines = data ? JSON.parse(data) : [];
    routines.push(routine);
    await AsyncStorage.setItem(ROUTINES_KEY, JSON.stringify(routines));
    console.log("routines", routines);
  } catch (error) {
    console.error("Error saving routine:", error);
  }
}

// 루틴 불러오기 함수
export async function loadRoutines(): Promise<Routine[]> {
  try {
    const data = await AsyncStorage.getItem(ROUTINES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading routines:", error);
    return [];
  }
}
