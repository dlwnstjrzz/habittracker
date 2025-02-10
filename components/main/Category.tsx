import "react-native-get-random-values";
import { nanoid } from "nanoid/non-secure";
import { View, Pressable, StyleSheet } from "react-native";
import { CustomText } from "../common/CustomText";
import { useState, useRef, useEffect } from "react";
import { Plus, Lock, MoreVertical, MoreHorizontal } from "lucide-react-native";
import { CategoryActionSheet } from "./CategoryActionSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { TodoItem } from "./TodoItem";
import { getColorValue } from "@/constants/Colors";
import { EditCategoryModal } from "./EditCategoryModal";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface Category {
  id: string;
  title: string;
  color: string;
  todos: { [date: string]: Todo[] };
}

interface CategoryProps {
  category: Category;
  selectedDate: string;
  onUpdate: (id: string, updates: Partial<Category>) => void;
  onDelete: (id: string) => void;
  onReorder: () => void;
  renderAddTodo: () => React.ReactNode;
}

export default function Category({
  category,
  selectedDate,
  onUpdate,
  onDelete,
  onReorder,
  renderAddTodo,
}: CategoryProps) {
  const actionSheetRef = useRef<BottomSheetModal>(null);
  const editModalRef = useRef<BottomSheetModal>(null);

  const [localTodos, setLocalTodos] = useState(
    category.todos[selectedDate] || []
  );

  useEffect(() => {
    setLocalTodos(category.todos[selectedDate] || []);
  }, [category.todos, selectedDate]);

  const handleToggleTodo = (id: string) => {
    const updatedTodos = localTodos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );

    onUpdate(category.id, {
      todos: {
        ...category.todos,
        [selectedDate]: updatedTodos,
      },
    });
  };

  const handleDeleteTodo = (id: string) => {
    const updatedTodos = localTodos.filter((todo) => todo.id !== id);
    onUpdate(category.id, {
      todos: {
        ...category.todos,
        [selectedDate]: updatedTodos,
      },
    });
  };

  const handleEditTodo = (id: string, newText: string) => {
    const updatedTodos = localTodos.map((todo) =>
      todo.id === id ? { ...todo, text: newText } : todo
    );
    onUpdate(category.id, {
      todos: {
        ...category.todos,
        [selectedDate]: updatedTodos,
      },
    });
  };

  const handleEdit = () => {
    actionSheetRef.current?.dismiss();
    setTimeout(() => {
      editModalRef.current?.present();
    }, 100);
  };

  const handleEditSubmit = (
    id: string,
    updates: { title: string; color: string }
  ) => {
    onUpdate(id, updates);
  };

  const handleReorder = () => {
    actionSheetRef.current?.dismiss();
    setTimeout(() => {
      onReorder();
    }, 100);
  };

  const handleCategoryDelete = () => {
    actionSheetRef.current?.dismiss();
    onDelete(category.id);
  };

  return (
    <View className="mb-6">
      {/* 카테고리 헤더 */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <CustomText
            size="lg"
            weight="bold"
            style={{ color: getColorValue(category.color) }}
          >
            {category.title}
          </CustomText>
        </View>
        <Pressable
          onPress={() => actionSheetRef.current?.present()}
          className="w-8 h-8 items-center justify-center rounded-full"
        >
          <MoreHorizontal size={20} color="#6B7280" />
        </Pressable>
      </View>

      {/* 할일 목록 */}
      <View className="space-y-1 px-1">
        {localTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            color={category.color}
            onToggle={() => handleToggleTodo(todo.id)}
            onEdit={handleEditTodo}
            onDelete={handleDeleteTodo}
          />
        ))}

        {/* 할일 추가 버튼 */}
        {renderAddTodo()}
      </View>

      <CategoryActionSheet
        ref={actionSheetRef}
        onEdit={handleEdit}
        onReorder={handleReorder}
        onDelete={handleCategoryDelete}
      />

      <EditCategoryModal
        ref={editModalRef}
        category={category}
        onSubmit={handleEditSubmit}
      />
    </View>
  );
}
