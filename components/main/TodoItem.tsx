import { View, Pressable, TextInput } from "react-native";
import { CustomText } from "../common/CustomText";
import * as Haptics from "expo-haptics";
import { Check, MoreHorizontal } from "lucide-react-native";
import { useRef, useState, useEffect } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { TodoActionSheet } from "./TodoActionSheet";
import { getColorValue } from "@/constants/Colors";

interface TodoItemProps {
  todo: {
    id: string;
    text: string;
    completed: boolean;
  };
  color: string;
  onToggle: () => void;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({
  todo,
  color,
  onToggle,
  onEdit,
  onDelete,
}: TodoItemProps) {
  const actionSheetRef = useRef<BottomSheetModal>(null);
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

  if (isDeleted) return null;

  if (isEditing) {
    return (
      <View className="flex-row items-center justify-between py-3 px-3">
        <TextInput
          value={editText}
          onChangeText={setEditText}
          className="flex-1 border-b-2 px-1 py-2"
          style={{
            fontSize: 16,
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
        <CustomText
          size="base"
          weight="medium"
          className={`${
            isCompleted ? "text-gray-400 line-through" : "text-gray-700"
          }`}
        >
          {localText}
        </CustomText>
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
      />
    </View>
  );
}
