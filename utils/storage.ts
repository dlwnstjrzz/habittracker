import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  categoryId: string;
  createdAt: string;
}

export interface Category {
  id: string;
  title: string;
  todos: Todo[];
}

const STORAGE_KEY = "todos_v1";

// 초기 카테고리 데이터
export const initialCategories: Category[] = [
  {
    id: "startup",
    title: "창업",
    todos: [],
  },
  {
    id: "exercise",
    title: "운동",
    todos: [],
  },
  {
    id: "growth",
    title: "자기계발",
    todos: [],
  },
];

export async function getCategories(): Promise<Category[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) {
      // 저장된 데이터가 없으면 초기 카테고리 반환
      await saveCategories(initialCategories);
      return initialCategories;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading categories:", error);
    return initialCategories; // 에러 시에도 초기 카테고리 반환
  }
}

export async function saveCategories(categories: Category[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error("Error saving categories:", error);
  }
}

// 모든 키-값 쌍 확인
export async function logAllStorage() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    console.log("==== AsyncStorage Contents ====");
    items.forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
  } catch (error) {
    console.error("Error logging storage:", error);
  }
}

// 특정 키의 값만 확인
export async function logTodos() {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    console.log("==== Todos Data ====");
    console.log(JSON.parse(data || "[]"));
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
