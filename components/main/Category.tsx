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
  date: string;
  categoryId: string;
  reminderTime?: string | null;
}

interface Category {
  id: string;
  title: string;
  color: string;
}

interface Routine {
  id: string;
  text: string;
  categoryId: string;
  startDate: string;
  endDate?: string;
  completed: boolean;
  completedDates: { [date: string]: boolean };
  frequency: {
    type: "daily" | "weekly" | "monthly";
    days?: number[];
    dates?: number[];
  };
  lastCompletedDate?: string;
}

interface CategoryProps {
  category: Category;
  todos: Todo[];
  routines: Routine[];
  onTodoToggle: (todoId: string, isRoutine: boolean) => void;
  onTodoCreate: (todo: Todo) => void;
  onTodoEdit: (todoId: string, newText: string) => void;
  onTodoDelete: (todoId: string) => void;
  onTodoSetReminder: (todoId: string, time?: string | null) => void;
  onDeleteRoutine: (routineId: string) => void;
  onUpdate: (categoryId: string, updates: Partial<Category>) => void;
  onDelete: (categoryId: string) => void;
  onReorder: () => void;
  renderAddTodo: () => JSX.Element;
}

export default function Category({
  category,
  todos,
  routines,
  onTodoToggle,
  onTodoEdit,
  onTodoDelete,
  onTodoSetReminder,
  onDeleteRoutine,
  onUpdate,
  onDelete,
  onReorder,
  renderAddTodo,
}: CategoryProps) {
  const actionSheetRef = useRef<BottomSheetModal>(null);
  const editModalRef = useRef<BottomSheetModal>(null);

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
      <View className="flex-row items-center justify-between mb-2 bg-gray-100 rounded-lg p-2">
        <View className="flex-row items-center">
          <CustomText
            size="sm"
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
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={{
              ...todo,
              isRoutine: false,
            }}
            color={category.color}
            onToggle={() => onTodoToggle(todo.id, false)}
            onEdit={onTodoEdit}
            onDelete={onTodoDelete}
            onSetReminder={onTodoSetReminder}
          />
        ))}
        {routines.map((routine) => (
          <TodoItem
            key={routine.id}
            todo={{
              id: routine.id,
              text: routine.text,
              completed: routine.completed,
              date: routine.startDate,
              categoryId: routine.categoryId,
              isRoutine: true,
            }}
            color={category.color}
            onToggle={() => onTodoToggle(routine.id, true)}
            onEdit={onTodoEdit}
            onDelete={onTodoDelete}
            onSetReminder={onTodoSetReminder}
            onDeleteRoutine={onDeleteRoutine}
          />
        ))}
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
