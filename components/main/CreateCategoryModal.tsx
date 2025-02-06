import { View, TextInput, Pressable } from "react-native";
import { CustomText } from "../common/CustomText";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useState } from "react";
import { X } from "lucide-react-native";

interface CreateCategoryModalProps {
  onSubmit: (title: string, color: string) => void;
}

export const CreateCategoryModal = forwardRef<
  BottomSheetModal,
  CreateCategoryModalProps
>(({ onSubmit }, ref) => {
  const [title, setTitle] = useState("");

  const handleSubmit = useCallback(() => {
    if (title.trim()) {
      onSubmit(title.trim(), "blue"); // 기본 색상으로 blue 사용
      setTitle("");
      (ref as any).current?.dismiss();
    }
  }, [title, onSubmit]);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={["90%"]}
      index={0}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: "white" }}
    >
      <BottomSheetView className="flex-1 px-4 pt-2">
        {/* 헤더 */}
        <View className="flex-row items-center justify-between mb-8">
          <CustomText size="xl" weight="bold" className="text-gray-900">
            새로운 카테고리
          </CustomText>
          <Pressable
            onPress={() => (ref as any).current?.dismiss()}
            className="w-10 h-10 items-center justify-center rounded-full"
          >
            <X size={24} color="#6B7280" />
          </Pressable>
        </View>

        {/* 입력 폼 */}
        <View>
          <CustomText
            size="base"
            weight="medium"
            className="text-gray-700 mb-2"
          >
            카테고리 이름
          </CustomText>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="카테고리 이름을 입력하세요"
            className="border-b border-gray-200 px-1 py-2"
            style={{
              fontSize: 16,
              fontFamily: "SpoqaHanSansNeo-Regular",
              color: "#374151",
            }}
            placeholderTextColor="#9CA3AF"
            autoFocus
          />
        </View>

        {/* 하단 버튼 */}
        <View className="mt-auto mb-6">
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
      </BottomSheetView>
    </BottomSheetModal>
  );
});
