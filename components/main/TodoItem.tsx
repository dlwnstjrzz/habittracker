import { View, Pressable, TextInput } from "react-native";
import { CustomText } from "../common/CustomText";
import * as Haptics from "expo-haptics";
import { Check, MoreHorizontal } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useRef, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { TodoActionSheet } from "./TodoActionSheet";
import { getColorValue } from "@/constants/Colors";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  color: string;
  onToggle: () => void;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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

  const categoryColor = getColorValue(color);

  const handleToggle = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  };

  const handleMorePress = () => {
    actionSheetRef.current?.present();
  };

  const handleEditPress = () => {
    actionSheetRef.current?.dismiss();
    setIsEditing(true);
  };

  const handleEditSubmit = () => {
    if (editText.trim() && editText !== todo.text) {
      onEdit(todo.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleDeletePress = () => {
    actionSheetRef.current?.dismiss();
    onDelete(todo.id);
  };

  const checkboxAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(todo.completed ? 1 : 0.9, {
            mass: 0.6,
            damping: 12,
          }),
        },
      ],
      backgroundColor: withTiming(
        todo.completed ? categoryColor : "transparent",
        { duration: 150 }
      ),
      borderColor: withTiming(todo.completed ? categoryColor : "#D1D5DB", {
        duration: 150,
      }),
    };
  });

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
            setEditText(todo.text);
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
        <AnimatedPressable
          onPress={handleToggle}
          className="w-6 h-6 rounded-md mr-3 border-2 items-center justify-center"
          style={checkboxAnimatedStyle}
        >
          {todo.completed && <Check size={16} color="white" strokeWidth={4} />}
        </AnimatedPressable>
        <CustomText
          size="base"
          weight="medium"
          className={`${
            todo.completed ? "text-gray-400 line-through" : "text-gray-700"
          }`}
        >
          {todo.text}
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
