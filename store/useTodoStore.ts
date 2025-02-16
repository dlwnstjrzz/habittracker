import { create } from "zustand";
import { getCategories, saveCategories } from "@/utils/storage";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  categoryId: string;
}

interface Category {
  id: string;
  title: string;
  color: string;
}

interface TodoStore {
  categories: Category[];
  todos: { [date: string]: Todo[] };
  setCategories: (categories: Category[]) => void;
  setTodos: (todos: { [date: string]: Todo[] }) => void;
  loadData: () => Promise<void>;
  saveTodoData: (data: {
    categories: Category[];
    todos: { [date: string]: Todo[] };
  }) => Promise<void>;
  getTodosByDate: (date: string) => Todo[];
  getCompletedCountByDate: (date: string) => number;
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  categories: [],
  todos: {},
  setCategories: (categories) => set({ categories }),
  setTodos: (todos) => set({ todos }),
  loadData: async () => {
    const data = await getCategories();
    console.log("useTodoStore data", data);
    if (data) {
      set({ categories: data.categories, todos: data.todos });
    }
  },
  saveTodoData: async (data) => {
    await saveCategories(data);
    set({ categories: data.categories, todos: data.todos });
  },
  getTodosByDate: (date: string) => get().todos[date] || [],
  getCompletedCountByDate: (date: string) =>
    get().todos[date]?.filter((todo) => todo.completed).length || 0,
}));
