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
  frequency?: {
    type: "daily" | "weekly" | "monthly";
    days?: number[];
    dates?: number[];
  };
}

export interface StorageData {
  categories: Category[];
  todos: { [date: string]: Todo[] };
  routines: Routine[];
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
    // 기존 데이터를 파싱
    // const parsedData = JSON.parse(data);
    // console.log("parsedData", parsedData);
    // // routines 배열이 없다면 추가
    // if (!parsedData.routines) {
    //   parsedData.routines = [];
    //   // 업데이트된 데이터 저장
    //   await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsedData));
    // }

    // return parsedData;
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
export async function createRoutine(todo: Todo): Promise<void> {
  const data = await getCategories();
  if (!data) return;

  const routine: Routine = {
    id: nanoid(),
    todoId: todo.id,
    text: todo.text,
    categoryId: todo.categoryId,
    startDate: todo.date,
  };

  data.routines.push(routine);
  await saveCategories(data);
}

// 할일 목록 조회 시 루틴 자동 추가
export async function getTodosByDate(date: string): Promise<Todo[]> {
  const data = await getCategories();
  if (!data) return [];

  const todos = data.todos[date] || [];
  const routineTodos = data.routines
    .filter((routine) => {
      const startDate = new Date(routine.startDate);
      const targetDate = new Date(date);
      return targetDate >= startDate;
    })
    .map((routine) => ({
      id: `${routine.id}-${date}`,
      text: routine.text,
      completed: false,
      date,
      categoryId: routine.categoryId,
      isRoutine: true,
    }));

  return [...todos, ...routineTodos];
}
