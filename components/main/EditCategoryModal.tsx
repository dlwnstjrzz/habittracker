import { View, TextInput, Pressable } from "react-native";
import { CustomText } from "../common/CustomText";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useState, useEffect, useRef } from "react";
import { Check } from "lucide-react-native";
import { XStack, YStack } from "tamagui";
import { getColorValue } from "@/constants/Colors";
import { COLORS } from "@/constants/Colors";
import { CommonModal } from "../common/CommonModal";
import React from "react";

interface EditCategoryModalProps {
  category: {
    id: string;
    title: string;
    color: string;
  };
  onSubmit: (id: string, updates: { title: string; color: string }) => void;
}

interface ColorItemProps {
  color: {
    id: string;
    value: string;
    tailwindValue: string;
  };
  isSelected: boolean;
  onSelect: () => void;
}

const ColorItem = ({ color, isSelected, onSelect }: ColorItemProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const backgroundColor = color.value;
  return (
    <Pressable
      onPress={onSelect}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      className={`items-center justify-center ${
        isPressed ? "scale-110" : "scale-100"
      }`}
    >
      <View
        className={`w-12 h-12 rounded-full items-center justify-center`}
        style={{ backgroundColor }}
      >
        {isSelected && <Check size={20} color="white" strokeWidth={3.5} />}
      </View>
    </Pressable>
  );
};

export const EditCategoryModal = forwardRef<
  BottomSheetModal,
  EditCategoryModalProps
>(({ category, onSubmit }, ref) => {
  const inputRef = useRef<TextInput>(null);
  const [title, setTitle] = useState(category.title);
  const [selectedColor, setSelectedColor] = useState(category.color);

  useEffect(() => {
    setTitle(category.title);
    setSelectedColor(category.color);
  }, [category]);

  const handleSubmit = useCallback(() => {
    if (title.trim()) {
      onSubmit(category.id, {
        title: title.trim(),
        color: selectedColor,
      });
      if (ref && typeof ref !== "function" && ref.current) {
        ref.current.dismiss();
      }
    }
  }, [title, selectedColor, category.id, onSubmit, ref]);

  return (
    <CommonModal ref={ref} title="카테고리 수정" snapPoints={["90%"]}>
      {/* 입력 폼 */}
      <View className="space-y-6 gap-4">
        <View>
          <TextInput
            ref={inputRef}
            defaultValue={category.title}
            onChangeText={setTitle}
            placeholder="카테고리 입력"
            className="border-b-2 px-1 py-2"
            style={{
              fontSize: 16,
              fontFamily: "SpoqaHanSansNeo-Medium",
              color: "#374151",
              borderBottomColor: getColorValue(selectedColor),
            }}
            placeholderTextColor="#9CA3AF"
            autoFocus
          />
        </View>

        <View>
          <CustomText
            size="base"
            weight="medium"
            className="text-gray-700 mb-4"
          >
            색상
          </CustomText>
          <YStack space="$4">
            <XStack flexWrap="wrap" justifyContent="space-between" gap="$4">
              {COLORS.map((color) => (
                <ColorItem
                  key={color.id}
                  color={color}
                  isSelected={selectedColor === color.id}
                  onSelect={() => setSelectedColor(color.id)}
                />
              ))}
            </XStack>
          </YStack>
        </View>
      </View>

      {/* 하단 버튼 */}
      <View className="mt-auto mb-4">
        <Pressable
          onPress={handleSubmit}
          disabled={!title.trim()}
          className={`py-4 rounded-xl ${
            title.trim() ? "bg-gray-900" : "bg-gray-200"
          }`}
        >
          <CustomText
            size="base"
            weight="bold"
            className={title.trim() ? "text-white" : "text-gray-400"}
            style={{ textAlign: "center" }}
          >
            수정하기
          </CustomText>
        </Pressable>
      </View>
    </CommonModal>
  );
});
