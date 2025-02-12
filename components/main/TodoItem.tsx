import { View, Pressable, TextInput } from "react-native";
import { CustomText } from "../common/CustomText";
import * as Haptics from "expo-haptics";
import { Check, MoreHorizontal, Bell } from "lucide-react-native";
import { useRef, useState, useEffect } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { TodoActionSheet } from "./TodoActionSheet";
import { getColorValue } from "@/constants/Colors";
import { ReminderModal } from "./ReminderModal";

interface TodoItemProps {
  todo: {
    id: string;
    text: string;
    completed: boolean;
    date: string;
    categoryId: string;
    reminderTime?: string | null;
  };
  color: string;
  onToggle: () => void;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
  onSetReminder: (id: string, time?: string | null) => void;
}

export function TodoItem({
  todo,
  color,
  onToggle,
  onEdit,
  onDelete,
  onSetReminder,
}: TodoItemProps) {
  const actionSheetRef = useRef<BottomSheetModal>(null);
  const reminderModalRef = useRef<BottomSheetModal>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isCompleted, setIsCompleted] = useState(todo.completed);
  const [localText, setLocalText] = useState(todo.text);
  const [isDeleted, setIsDeleted] = useState(false);

  const categoryColor = getColorValue(color);

  const handleToggle = async () => {
    setIsCompleted(!isCompleted);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  };

  useEffect(() => {
    setIsCompleted(todo.completed);
    setLocalText(todo.text);
  }, [todo.completed, todo.text]);

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

  const handleReminderSubmit = (time: Date | null) => {
    onSetReminder(todo.id, time ? time.toLocaleString() : null);
  };

  // 시간을 "오전/오후 HH:MM" 형식으로 변환
  const formatTime = (dateStr: string) => {
    try {
      // "2/12/2025, 3:15:00 AM" 형식의 문자열에서 시간 부분만 추출
      const [, timePart] = dateStr.split(", ");

      // "3:15:00 AM" 형식에서 시간과 AM/PM 추출
      const timeRegex = /(\d+):(\d+):\d+\s+(AM|PM)/;
      const matches = timePart.match(timeRegex);

      if (!matches) {
        throw new Error("Invalid time format");
      }

      const [, hours, minutes, period] = matches;

      // 한국어로 오전/오후 변환
      const koreanPeriod = period === "AM" ? "오전" : "오후";

      return `${koreanPeriod} ${hours}:${minutes}`;
    } catch (error) {
      console.error("Error parsing time:", dateStr);
      return "";
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
        <View
          className="w-6 h-6 rounded-md mr-3 border-2 items-center justify-center"
          style={{
            backgroundColor: isCompleted ? categoryColor : "transparent",
            borderColor: isCompleted ? categoryColor : "#D1D5DB",
          }}
        >
          {isCompleted && <Check size={16} color="white" strokeWidth={4} />}
        </View>
        <View>
          <CustomText
            size="sm"
            weight="regular"
            className={`${
              isCompleted ? "text-gray-400 line-through" : "text-gray-700"
            }`}
          >
            {localText}
          </CustomText>
          {/* 알림 시간 표시 */}
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
      />

      <ReminderModal
        ref={reminderModalRef}
        onSubmit={handleReminderSubmit}
        initialTime={todo.reminderTime}
      />
    </View>
  );
}
