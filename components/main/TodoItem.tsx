import { View, Pressable, TextInput } from "react-native";
import { CustomText } from "../common/CustomText";
import * as Haptics from "expo-haptics";
import { Check, MoreHorizontal, Bell } from "lucide-react-native";
import { useRef, useState, useEffect } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { TodoActionSheet } from "./TodoActionSheet";
import { getColorValue } from "@/constants/Colors";
import { ReminderModal } from "./ReminderModal";
import {
  setupNotifications,
  scheduleNotification,
  cancelNotification,
} from "@/utils/notification";
import { saveRoutine } from "@/utils/storage";
import { useRoutineStore } from "@/store/useRoutineStore";
import { nanoid } from "nanoid";
import { useCharacterStore } from "@/store/useCharacterStore";

interface TodoItemProps {
  todo: {
    id: string;
    text: string;
    completed: boolean;
    date: string;
    categoryId: string;
    reminderTime?: string | null;
    isRoutine?: boolean;
  };
  color: string;
  onToggle: () => void;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
  onSetReminder: (id: string, time?: string | null) => void;
  onDeleteRoutine?: (id: string) => void;
}

export function TodoItem({
  todo,
  color,
  onToggle,
  onEdit,
  onDelete,
  onSetReminder,
  onDeleteRoutine,
}: TodoItemProps) {
  const actionSheetRef = useRef<BottomSheetModal>(null);
  const reminderModalRef = useRef<BottomSheetModal>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [localText, setLocalText] = useState(todo.text);
  const [isDeleted, setIsDeleted] = useState(false);
  console.log("routinestodo", todo);
  const categoryColor = getColorValue(color);

  const addRoutine = useRoutineStore((state) => state.addRoutine);
  const {
    feedCharacter,
    stage,
    experience,
    lastFedDate,
    isEvolutionReady,
    resetCharacter,
  } = useCharacterStore();
  // resetCharacter();
  console.log("isEvolutionReady", isEvolutionReady);
  console.log("stage", stage);
  console.log("experience", experience);
  console.log("lastFedDate", lastFedDate);
  const handleToggle = async () => {
    if (!todo.completed) {
      feedCharacter();
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    onToggle();
  };

  useEffect(() => {
    setLocalText(todo.text);
  }, [todo.text]);

  const handleMorePress = () => {
    actionSheetRef.current?.present();
  };

  const handleEditPress = () => {
    actionSheetRef.current?.dismiss();
    setIsEditing(true);
  };

  const handleEditSubmit = () => {
    if (editText.trim() && editText !== localText) {
      setLocalText(editText.trim());
      setIsEditing(false);
      onEdit(todo.id, editText.trim());
    } else {
      setIsEditing(false);
      setEditText(localText);
    }
  };

  const handleDeletePress = () => {
    actionSheetRef.current?.dismiss();
    setIsDeleted(true);
    onDelete(todo.id);
  };

  const handleSetReminder = () => {
    actionSheetRef.current?.dismiss();
    setTimeout(() => {
      reminderModalRef.current?.present();
    }, 100);
  };

  const handleReminderSubmit = async (time: Date | null) => {
    try {
      const hasPermission = await setupNotifications();
      if (!hasPermission) {
        return;
      }

      if (time) {
        await scheduleNotification(todo.id, todo.text, time);
      } else {
        await cancelNotification(todo.id);
      }

      onSetReminder(todo.id, time ? time.toLocaleString() : null);
    } catch (error) {
      console.error("Error handling reminder:", error);
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const [, timePart] = dateStr.split(", ");
      const timeRegex = /(\d+):(\d+):\d+\s+(AM|PM)/;
      const matches = timePart.match(timeRegex);

      if (!matches) {
        throw new Error("Invalid time format");
      }

      const [, hours, minutes, period] = matches;
      const koreanPeriod = period === "AM" ? "오전" : "오후";

      return `${koreanPeriod} ${hours}:${minutes}`;
    } catch (error) {
      console.error("Error parsing time:", dateStr);
      return "";
    }
  };

  const handleMakeRoutine = async () => {
    try {
      const routine = {
        id: nanoid(),
        todoId: todo.id,
        text: todo.text,
        categoryId: todo.categoryId,
        startDate: todo.date,
        frequency: "daily",
        isRoutine: true,
        completed: false,
      };

      // 루틴 저장
      await saveRoutine(routine);

      // 전역 상태 업데이트
      addRoutine(routine);

      actionSheetRef.current?.dismiss();
      // 선택적: 성공 메시지 표시
    } catch (error) {
      console.error("Error creating routine:", error);
      // 선택적: 에러 메시지 표시
    }
  };

  if (isDeleted) return null;

  if (isEditing) {
    return (
      <View className="flex-row items-center justify-between py-3 px-3">
        <TextInput
          value={editText}
          onChangeText={setEditText}
          className="flex-1 border-b-2 px-1 py-2"
          style={{
            fontSize: 14,
            fontFamily: "SpoqaHanSansNeo-Regular",
            borderBottomColor: categoryColor,
          }}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleEditSubmit}
          onBlur={() => {
            setIsEditing(false);
            setEditText(localText);
          }}
        />
      </View>
    );
  }

  return (
    <View className="flex-row items-center justify-between py-3 px-3">
      <Pressable
        className="flex-row items-center flex-1"
        onPress={handleToggle}
      >
        <View className="mr-2" style={{ position: "relative" }}>
          <View
            className="w-6 h-6 rounded-md mr-3 border-2 items-center justify-center"
            style={{
              backgroundColor: todo.completed ? categoryColor : "transparent",
              borderColor: todo.completed ? categoryColor : "#D1D5DB",
            }}
          >
            {todo.completed && (
              <Check size={16} color="white" strokeWidth={4} />
            )}
          </View>
        </View>
        <View>
          <CustomText
            size="sm"
            weight="regular"
            className={`${
              todo.completed ? "text-gray-400 line-through" : "text-gray-700"
            }`}
          >
            {localText}
          </CustomText>
          {todo.reminderTime && (
            <View className="flex-row items-center mt-1">
              <View className="w-4 h-4 rounded-full bg-pink-100 items-center justify-center mr-1">
                <Bell size={10} color="#EC4899" />
              </View>
              <CustomText size="xs" className="text-pink-400">
                {formatTime(todo.reminderTime)}
              </CustomText>
            </View>
          )}
        </View>
      </Pressable>
      <Pressable
        className="w-8 h-8 items-center justify-center rounded-full"
        onPress={handleMorePress}
      >
        <MoreHorizontal size={16} color="#6B7280" />
      </Pressable>

      <TodoActionSheet
        ref={actionSheetRef}
        onEdit={handleEditPress}
        onDelete={handleDeletePress}
        onSetReminder={handleSetReminder}
        onMakeRoutine={handleMakeRoutine}
        todoDate={todo.date}
        isRoutine={todo.isRoutine}
        onDeleteRoutine={onDeleteRoutine}
      />

      <ReminderModal
        ref={reminderModalRef}
        onSubmit={handleReminderSubmit}
        initialTime={todo.reminderTime}
      />
    </View>
  );
}
