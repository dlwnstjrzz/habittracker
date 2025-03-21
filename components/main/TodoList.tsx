import { View, Pressable, TextInput } from "react-native";
import { CustomText } from "@/components/common/CustomText";
import Category from "./Category";
import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, FolderPlus } from "lucide-react-native";
import { CreateCategoryModal } from "./CreateCategoryModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { getColorValue } from "@/constants/Colors";
import { ReorderCategoryModal } from "./ReorderCategoryModal";
import { useSelectedDateStore } from "@/store/useSelectedDateStore";
import { useTodoStore } from "@/store/useTodoStore";
import { useRoutineStore } from "@/store/useRoutineStore";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  categoryId: string;
  reminderTime?: string | null;
}

// 루틴 인터페이스 정의 추가
interface RoutineWithCompleted {
  id: string;
  text: string;
  categoryId: string;
  startDate: string;
  endDate?: string;
  completedDates: { [date: string]: boolean };
  reminderTime?: string | null;
  frequency: {
    type: "daily" | "weekly" | "monthly";
    days?: number[];
    dates?: number[];
  };
  lastCompletedDate?: string;
  completed: boolean; // getRoutinesForDate에서 추가되는 속성
}

interface Category {
  id: string;
  title: string;
  color: string;
}

export default function TodoList() {
  const { categories, todos, setCategories, setTodos, loadData, saveTodoData } =
    useTodoStore();
  const { selectedDate, setCompletedCount } = useSelectedDateStore();
  const {
    getRoutinesForDate,
    toggleRoutineCompletion,
    deleteRoutine,
    setRoutineReminder,
  } = useRoutineStore();

  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [newTodoText, setNewTodoText] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const createCategoryRef = useRef<BottomSheetModal>(null);
  const reorderModalRef = useRef<BottomSheetModal>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      await loadData();
      setIsLoading(false);
    }
    init();
  }, [loadData]);

  useEffect(() => {
    const completedCount =
      todos[selectedDate]?.filter((todo) => todo.completed).length || 0;

    // 루틴의 완료 상태도 포함
    const routinesForDate = getRoutinesForDate(
      selectedDate
    ) as RoutineWithCompleted[];
    const completedRoutinesCount = routinesForDate.filter(
      (routine) => routine.completed
    ).length;

    setCompletedCount(completedCount + completedRoutinesCount);
  }, [selectedDate, todos, setCompletedCount, getRoutinesForDate]);

  const handleTodoToggle = async (todoId: string, isRoutine: boolean) => {
    if (isRoutine) {
      // 루틴 완료 상태 토글 (선택된 날짜 전달)
      toggleRoutineCompletion(todoId, selectedDate);

      // 루틴 완료 상태가 변경되면 완료된 할일 개수 업데이트
      const updatedRoutinesForDate = getRoutinesForDate(
        selectedDate
      ) as RoutineWithCompleted[];
      const completedTodosCount =
        todos[selectedDate]?.filter((todo) => todo.completed).length || 0;
      const completedRoutinesCount = updatedRoutinesForDate.filter(
        (routine) => routine.completed
      ).length;
      setCompletedCount(completedTodosCount + completedRoutinesCount);
    } else {
      const updatedTodos = {
        ...todos,
        [selectedDate]: todos[selectedDate].map((todo) =>
          todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
        ),
      };

      await saveTodoData({ categories, todos: updatedTodos });
    }
  };

  // 루틴 삭제 처리 함수 추가
  const handleDeleteRoutine = (routineId: string) => {
    deleteRoutine(routineId);
  };

  // 선택된 날짜의 todos를 카테고리별로 그룹화
  const getTodosByCategory = useCallback(
    (categoryId: string) => {
      const todosForDate = todos[selectedDate] || [];
      return todosForDate.filter((todo) => todo.categoryId === categoryId);
    },
    [todos, selectedDate]
  );

  const handleCreateTodo = async (categoryId: string, newTodo: Todo) => {
    const updatedTodos = {
      ...todos,
      [selectedDate]: [...(todos[selectedDate] || []), newTodo],
    };

    setTodos(updatedTodos);
    await saveTodoData({ categories, todos: updatedTodos });
  };

  const handleEditTodo = async (todoId: string, newText: string) => {
    const updatedTodos = {
      ...todos,
      [selectedDate]: todos[selectedDate].map((todo) =>
        todo.id === todoId ? { ...todo, text: newText } : todo
      ),
    };

    setTodos(updatedTodos);
    await saveTodoData({ categories, todos: updatedTodos });
  };

  const handleDeleteTodo = async (todoId: string) => {
    const updatedTodos = {
      ...todos,
      [selectedDate]: todos[selectedDate].filter((todo) => todo.id !== todoId),
    };

    setTodos(updatedTodos);
    await saveTodoData({ categories, todos: updatedTodos });
  };

  const handleCreateCategory = async (title: string, color: string) => {
    const newCategory: Category = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      color,
    };

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    await saveTodoData({ categories: updatedCategories, todos });
  };

  const handleAddTodoPress = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setIsAddingTodo(true);
  };

  const handleAddTodoSubmit = () => {
    if (newTodoText.trim() && activeCategoryId) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: newTodoText.trim(),
        completed: false,
        date: selectedDate,
        categoryId: activeCategoryId,
      };

      const updatedTodos = {
        ...todos,
        [selectedDate]: [...(todos[selectedDate] || []), newTodo],
      };

      setTodos(updatedTodos);
      saveTodoData({ categories, todos: updatedTodos });
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
    await saveTodoData({ categories: updatedCategories, todos });
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const updatedCategories = categories.filter(
      (category) => category.id !== categoryId
    );

    // 해당 카테고리의 todos도 모두 삭제
    const updatedTodos = { ...todos };
    Object.keys(updatedTodos).forEach((date) => {
      updatedTodos[date] = updatedTodos[date].filter(
        (todo) => todo.categoryId !== categoryId
      );
    });

    setCategories(updatedCategories);
    setTodos(updatedTodos);
    await saveTodoData({
      categories: updatedCategories,
      todos: updatedTodos,
    });
  };

  const handleAddCategoryPress = () => {
    setTimeout(() => {
      createCategoryRef.current?.present();
    }, 100);
  };

  const handleReorderCategories = useCallback(
    (reorderedCategories: Category[]) => {
      setCategories(reorderedCategories);
      saveTodoData({ categories: reorderedCategories, todos });
    },
    [todos, setCategories, saveTodoData]
  );

  const handleSetReminder = async (todoId: string, time?: string | null) => {
    const updatedTodos = {
      ...todos,
      [selectedDate]: todos[selectedDate].map((todo) =>
        todo.id === todoId ? { ...todo, reminderTime: time } : todo
      ),
    };
    setTodos(updatedTodos);
    await saveTodoData({ categories, todos: updatedTodos });
  };

  // 루틴 알림 설정 함수 추가
  const handleSetRoutineReminder = (
    routineId: string,
    time?: string | null
  ) => {
    if (time !== undefined) {
      setRoutineReminder(routineId, time);
    }
  };

  // 선택된 날짜에 표시할 루틴 가져오기
  const routinesForSelectedDate = getRoutinesForDate(
    selectedDate
  ) as RoutineWithCompleted[];

  // 카테고리별 루틴 필터링
  const getRoutinesByCategory = useCallback(
    (categoryId: string) => {
      return routinesForSelectedDate.filter(
        (routine) => routine.categoryId === categoryId
      );
    },
    [routinesForSelectedDate]
  );

  // 로딩 중이거나 categories가 undefined인 경우 처리
  if (isLoading || !categories) {
    return <View className="flex-1 px-4" />;
  }

  return (
    <View className="flex-1 px-4">
      {categories.map((category) => (
        <Category
          key={category.id}
          category={category}
          todos={getTodosByCategory(category.id)}
          routines={getRoutinesByCategory(category.id)}
          onTodoToggle={handleTodoToggle}
          onTodoCreate={(todo) => handleCreateTodo(category.id, todo)}
          onTodoEdit={(todoId, newText) => handleEditTodo(todoId, newText)}
          onTodoDelete={(todoId) => handleDeleteTodo(todoId)}
          onTodoSetReminder={handleSetReminder}
          onRoutineSetReminder={handleSetRoutineReminder}
          onDeleteRoutine={handleDeleteRoutine}
          onUpdate={handleUpdateCategory}
          onDelete={handleDeleteCategory}
          onReorder={() => {
            reorderModalRef.current?.present();
          }}
          renderAddTodo={() =>
            isAddingTodo && activeCategoryId === category.id ? (
              <View className="px-3 py-3">
                <TextInput
                  value={newTodoText}
                  onChangeText={setNewTodoText}
                  placeholder="할 일을 입력하세요"
                  className="flex-1 border-b-2 px-1 py-2"
                  style={{
                    fontSize: 14,
                    fontFamily: "SpoqaHanSansNeo-Regular",
                    color: "#374151",
                    borderBottomColor: getColorValue(category.color),
                  }}
                  placeholderTextColor="#9CA3AF"
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleAddTodoSubmit}
                  onBlur={() => {
                    setIsAddingTodo(false);
                    setNewTodoText("");
                    setActiveCategoryId(null);
                  }}
                />
              </View>
            ) : (
              <Pressable
                className="flex-row items-center py-3 px-3"
                onPress={() => handleAddTodoPress(category.id)}
              >
                <Plus size={20} color="#6B7280" />
                <CustomText size="sm" className="text-gray-500 ml-2">
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

      <ReorderCategoryModal
        ref={reorderModalRef}
        categories={categories}
        onReorder={handleReorderCategories}
      />
    </View>
  );
}
