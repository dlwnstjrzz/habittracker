import { View, Pressable, TextInput } from "react-native";
import { CustomText } from "../common/CustomText";
import * as Haptics from "expo-haptics";
import { Check, MoreHorizontal, Bell, Repeat } from "lucide-react-native";
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
  const { feedCharacter, stage, experience, lastFedDate, isEvolutionReady } =
    useCharacterStore();
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
    setEditText(todo.text);
  }, [todo.text]);

  const handleMorePress = () => {
    actionSheetRef.current?.present();
  };

  const handleEditPress = () => {
    actionSheetRef.current?.dismiss();
    setEditText(localText);
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

  const handleMakeRoutine = () => {
    try {
      const createRoutineFromTodo =
        useRoutineStore.getState().createRoutineFromTodo;

      // 루틴 생성
      createRoutineFromTodo({
        id: todo.id,
        text: todo.text,
        categoryId: todo.categoryId,
        date: todo.date,
      });

      // 기존 할일 삭제
      onDelete(todo.id);

      actionSheetRef.current?.dismiss();
    } catch (error) {
      console.error("Error creating routine:", error);
    }
  };

  if (isDeleted) return null;

  if (isEditing) {
    return (
      <View className="flex-row items-center justify-between py-3 px-3">
        <View className="flex-1 max-w-[85%]">
          <TextInput
            value={editText}
            onChangeText={setEditText}
            className="px-1 py-2 border-b-2"
            style={{
              fontSize: 14,
              fontFamily: "SpoqaHanSansNeo-Regular",
              borderBottomColor: categoryColor,
              textAlignVertical: "top",
            }}
            multiline
            numberOfLines={3}
            autoFocus
            returnKeyType="done"
            blurOnSubmit={true}
            onSubmitEditing={handleEditSubmit}
            onBlur={() => {
              setIsEditing(false);
              setEditText(localText);
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row items-center justify-between py-3 px-3">
      <Pressable className="flex-row items-start flex-1" onPress={handleToggle}>
        <View>
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
        <View className="flex-1 pr-2">
          <View className="flex-row items-center flex-wrap">
            <CustomText
              size="sm"
              weight="regular"
              className={`${
                todo.completed ? "text-gray-400 line-through" : "text-gray-700"
              } flex-shrink`}
            >
              {localText}
            </CustomText>
            {todo.isRoutine && (
              <View className="ml-2 flex-row items-center">
                <View className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 items-center justify-center">
                  <Repeat size={14} color="#EC4899" strokeWidth={3} />
                </View>
              </View>
            )}
          </View>
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
        onDeleteRoutine={
          todo.isRoutine && onDeleteRoutine
            ? () => onDeleteRoutine(todo.id)
            : undefined
        }
      />

      <ReminderModal
        ref={reminderModalRef}
        onSubmit={handleReminderSubmit}
        initialTime={todo.reminderTime}
      />
    </View>
  );
}
