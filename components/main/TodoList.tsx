import { View, Pressable, TextInput } from "react-native";
import { CustomText } from "@/components/common/CustomText";
import Category from "./Category";
import { useState, useEffect, useRef } from "react";
import {
  getCategories,
  saveCategories,
  logTodos,
  logAllStorage,
} from "@/utils/storage";
import { Plus, FolderPlus } from "lucide-react-native";
import { CreateCategoryModal } from "./CreateCategoryModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface CategoryType {
  id: string;
  title: string;
  todos: Todo[];
}

export default function TodoList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [newTodoText, setNewTodoText] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const createCategoryRef = useRef<BottomSheetModal>(null);

  // 초기 데이터 로드
  useEffect(() => {
    loadCategories();
    logAllStorage();
  }, []);

  const loadCategories = async () => {
    const savedCategories = await getCategories();
    setCategories(savedCategories);
  };

  const handleCreateTodo = async (categoryId: string, newTodo: Todo) => {
    const updatedCategories = categories.map((category) =>
      category.id === categoryId
        ? { ...category, todos: [...category.todos, newTodo] }
        : category
    );

    setCategories(updatedCategories);
    await saveCategories(updatedCategories);
  };

  const handleTodoToggle = async (categoryId: string, todoId: string) => {
    const updatedCategories = categories.map((category) =>
      category.id === categoryId
        ? {
            ...category,
            todos: category.todos.map((todo) =>
              todo.id === todoId
                ? { ...todo, completed: !todo.completed }
                : todo
            ),
          }
        : category
    );

    setCategories(updatedCategories);
    await saveCategories(updatedCategories);
  };

  const handleEditTodo = async (
    categoryId: string,
    todoId: string,
    newText: string
  ) => {
    const updatedCategories = categories.map((category) =>
      category.id === categoryId
        ? {
            ...category,
            todos: category.todos.map((todo) =>
              todo.id === todoId ? { ...todo, text: newText } : todo
            ),
          }
        : category
    );

    setCategories(updatedCategories);
    await saveCategories(updatedCategories);
  };

  const handleDeleteTodo = async (categoryId: string, todoId: string) => {
    const updatedCategories = categories.map((category) =>
      category.id === categoryId
        ? {
            ...category,
            todos: category.todos.filter((todo) => todo.id !== todoId),
          }
        : category
    );

    setCategories(updatedCategories);
    await saveCategories(updatedCategories);
  };

  const handleCreateCategory = async (title: string, color: string) => {
    const newCategory: Category = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      color,
      todos: [],
    };

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    await saveCategories(updatedCategories);
  };

  const handleAddTodoPress = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setIsAddingTodo(true);
  };

  const handleAddTodoSubmit = () => {
    if (newTodoText.trim() && activeCategoryId) {
      const updatedCategories = categories.map((category) => {
        if (category.id === activeCategoryId) {
          return {
            ...category,
            todos: [
              ...category.todos,
              {
                id: Date.now().toString(),
                text: newTodoText.trim(),
                completed: false,
                categoryId: activeCategoryId,
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }
        return category;
      });

      setCategories(updatedCategories);
      saveCategories(updatedCategories);
      setNewTodoText("");
      setIsAddingTodo(false);
      setActiveCategoryId(null);
    }
  };

  const handleUpdateCategory = async (
    categoryId: string,
    updates: Partial<Category>
  ) => {
    const updatedCategories = categories.map((category) =>
      category.id === categoryId ? { ...category, ...updates } : category
    );
    setCategories(updatedCategories);
    await saveCategories(updatedCategories);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const updatedCategories = categories.filter(
      (category) => category.id !== categoryId
    );
    setCategories(updatedCategories);
    await saveCategories(updatedCategories);
  };

  const handleAddCategoryPress = () => {
    setTimeout(() => {
      createCategoryRef.current?.present();
    }, 100);
  };

  return (
    <View className="flex-1 px-4">
      {categories.map((category) => (
        <Category
          key={category.id}
          category={category}
          onUpdate={handleUpdateCategory}
          onDelete={handleDeleteCategory}
          onTodoToggle={(todoId) => handleTodoToggle(category.id, todoId)}
          onTodoCreate={handleCreateTodo}
          onTodoEdit={(todoId, newText) =>
            handleEditTodo(category.id, todoId, newText)
          }
          onTodoDelete={(todoId) => handleDeleteTodo(category.id, todoId)}
          renderAddTodo={() =>
            isAddingTodo && activeCategoryId === category.id ? (
              <View className="px-3 py-3">
                <TextInput
                  value={newTodoText}
                  onChangeText={setNewTodoText}
                  placeholder="할 일을 입력하세요"
                  className="flex-1 border-b border-gray-200 px-1 py-2"
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleAddTodoSubmit}
                  onBlur={() => {
                    setIsAddingTodo(false);
                    setNewTodoText("");
                    setActiveCategoryId(null);
                  }}
                  style={{
                    fontSize: 16,
                    fontFamily: "SpoqaHanSansNeo-Regular",
                    color: "#374151",
                  }}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            ) : (
              <Pressable
                className="flex-row items-center py-3 px-3"
                onPress={() => handleAddTodoPress(category.id)}
              >
                <Plus size={20} color="#6B7280" />
                <CustomText size="base" className="text-gray-500 ml-2">
                  할 일 추가
                </CustomText>
              </Pressable>
            )
          }
        />
      ))}

      {/* 디바이더 */}
      <View className="h-[1px] bg-gray-200 my-4" />

      {/* 리스트 메뉴 버튼 */}
      <View className="items-end">
        <Pressable
          className="flex-row items-center bg-gray-50 rounded-xl py-2.5 px-4"
          onPress={handleAddCategoryPress}
        >
          <FolderPlus size={16} color="#111827" strokeWidth={2.5} />
          <CustomText size="sm" weight="medium" className="text-gray-900 ml-2">
            카테고리 추가
          </CustomText>
        </Pressable>
      </View>

      <CreateCategoryModal
        ref={createCategoryRef}
        onSubmit={handleCreateCategory}
      />
    </View>
  );
}
