import { View, TextInput, Pressable, ScrollView } from "react-native";
import { CustomText } from "../common/CustomText";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useState } from "react";
import { Check } from "lucide-react-native";
import { XStack, YStack } from "tamagui";
import { COLORS } from "@/constants/Colors";
import { CommonModal } from "../common/CommonModal";
import React from "react";

interface CreateCategoryModalProps {
  onSubmit: (title: string, color: string) => void;
}

export interface ColorItemProps {
  color: { id: string; value: string; tailwindValue: string };
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

export const CreateCategoryModal = forwardRef<
  BottomSheetModal,
  CreateCategoryModalProps
>(({ onSubmit }, ref) => {
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[15].id); // 기본값 blue

  const handleSubmit = useCallback(() => {
    if (title.trim()) {
      onSubmit(title.trim(), selectedColor);
      if (ref && typeof ref !== "function" && ref.current) {
        ref.current.dismiss();
      }
      setTitle("");
      setSelectedColor(COLORS[0].id);
    }
  }, [title, selectedColor, onSubmit, ref]);

  return (
    <CommonModal ref={ref} title="새로운 카테고리" snapPoints={["90%"]}>
      {/* 입력 폼 */}
      <View className="space-y-6 gap-4">
        <View>
          <TextInput
            onChangeText={setTitle}
            placeholder="카테고리 입력"
            className="border-b-2 px-1 py-2"
            style={{
              fontSize: 16,
              fontFamily: "SpoqaHanSansNeo-Medium",
              color: "#374151",
              borderBottomColor:
                COLORS.find((c) => c.id === selectedColor)?.value || "#E5E7EB",
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
          <YStack>
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
      <View className="mt-4 mb-4">
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
            추가하기
          </CustomText>
        </Pressable>
      </View>
    </CommonModal>
  );
});
