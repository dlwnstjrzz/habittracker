import AsyncStorage from "@react-native-async-storage/async-storage";

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

export interface StorageData {
  categories: Category[];
  todos: { [date: string]: Todo[] };
}

const STORAGE_KEY = "todos_v1";

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
};

export async function getCategories(): Promise<StorageData | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
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
