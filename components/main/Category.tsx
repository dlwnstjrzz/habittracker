import "react-native-get-random-values";
import { nanoid } from "nanoid/non-secure";
import { View, Pressable, StyleSheet } from "react-native";
import { CustomText } from "../common/CustomText";
import { useState, useRef } from "react";
import { Plus, Lock, MoreVertical } from "lucide-react-native";
import { CategoryActionSheet } from "./CategoryActionSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { TodoItem } from "./TodoItem";
import { CreateTodoModal } from "./CreateTodoModal";
import { EditTodoModal } from "./EditTodoModal";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface Category {
  id: string;
  title: string;
  color: string;
  todos: Todo[];
}

interface CategoryProps {
  category: Category;
  onUpdate: (id: string, updates: Partial<Category>) => void;
  onDelete: (id: string) => void;
  renderAddTodo: () => React.ReactNode;
}

// 색상 상수를 객체로 정의
const CATEGORY_COLORS = {
  blue: "#2563EB",
  emerald: "#059669",
  purple: "#9333EA",
  rose: "#E11D48",
  amber: "#D97706",
  indigo: "#4F46E5",
} as const;

// Tailwind 대신 스타일 객체 사용
const styles = StyleSheet.create({
  categoryTitle: {
    fontSize: 16,
    fontFamily: "SpoqaHanSansNeo-Bold",
    letterSpacing: -0.5,
  },
});

export default function Category({
  category,
  onUpdate,
  onDelete,
  renderAddTodo,
}: CategoryProps) {
  const actionSheetRef = useRef<BottomSheetModal>(null);
  const colorStyle =
    CATEGORY_COLORS[category.color as keyof typeof CATEGORY_COLORS] ||
    "#6B7280";

  const handleToggleTodo = (id: string) => {
    const updatedTodos = category.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    onUpdate(category.id, { todos: updatedTodos });
  };

  const handleDeleteTodo = (id: string) => {
    const updatedTodos = category.todos.filter((todo) => todo.id !== id);
    onUpdate(category.id, { todos: updatedTodos });
  };

  const handleEditTodo = (id: string, newText: string) => {
    const updatedTodos = category.todos.map((todo) =>
      todo.id === id ? { ...todo, text: newText } : todo
    );
    onUpdate(category.id, { todos: updatedTodos });
  };

  const handleMorePress = () => {
    actionSheetRef.current?.present();
  };

  const handleEdit = () => {
    actionSheetRef.current?.dismiss();
    // TODO: 카테고리 수정 모달 열기
  };

  const handleReorder = () => {
    actionSheetRef.current?.dismiss();
    // TODO: 순서 변경 모드 진입
  };

  const handleCategoryDelete = () => {
    actionSheetRef.current?.dismiss();
    onDelete(category.id);
  };

  return (
    <View className="mb-6">
      {/* 카테고리 헤더 */}
      <View className="flex-row items-center justify-between mb-3 bg-gray-50 px-4 py-3 rounded-2xl">
        <CustomText
          size="base"
          weight="bold"
          style={[styles.categoryTitle, { color: colorStyle }]}
        >
          {category.title}
        </CustomText>
        <Pressable
          className="w-8 h-8 items-center justify-center rounded-full hover:bg-white/50"
          onPress={handleMorePress}
        >
          <MoreVertical size={16} color="#6B7280" />
        </Pressable>
      </View>

      {/* 할일 목록 */}
      <View className="space-y-1 px-1">
        {category.todos.map((todo) => (
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
    </View>
  );
}
