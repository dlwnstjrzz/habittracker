import { View, TextInput, Pressable, ScrollView } from "react-native";
import { CustomText } from "../common/CustomText";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useState } from "react";
import { X, Check } from "lucide-react-native";

interface CreateCategoryModalProps {
  onSubmit: (title: string, color: string) => void;
}

const COLORS = [
  { id: "slate", value: "#475569" },
  { id: "gray", value: "#4B5563" },
  { id: "zinc", value: "#52525B" },
  { id: "neutral", value: "#525252" },
  { id: "stone", value: "#57534E" },
  { id: "red", value: "#DC2626" },
  { id: "orange", value: "#EA580C" },
  { id: "amber", value: "#D97706" },
  { id: "yellow", value: "#CA8A04" },
  { id: "lime", value: "#65A30D" },
  { id: "green", value: "#16A34A" },
  { id: "emerald", value: "#059669" },
  { id: "teal", value: "#0D9488" },
  { id: "cyan", value: "#0891B2" },
  { id: "sky", value: "#0284C7" },
  { id: "blue", value: "#2563EB" },
  { id: "indigo", value: "#4F46E5" },
  { id: "violet", value: "#7C3AED" },
  { id: "purple", value: "#9333EA" },
  { id: "fuchsia", value: "#C026D3" },
];

export const CreateCategoryModal = forwardRef<
  BottomSheetModal,
  CreateCategoryModalProps
>(({ onSubmit }, ref) => {
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[15].id); // 기본값 blue

  const handleSubmit = useCallback(() => {
    if (title.trim()) {
      onSubmit(title.trim(), selectedColor);
      setTitle("");
      setSelectedColor(COLORS[15].id);
      (ref as any).current?.dismiss();
    }
  }, [title, selectedColor, onSubmit]);

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
        <View className="space-y-6">
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

          <View>
            <CustomText
              size="base"
              weight="medium"
              className="text-gray-700 mb-4"
            >
              색상
            </CustomText>
            <View className="flex-row flex-wrap justify-center gap-4">
              {COLORS.map((color) => (
                <Pressable
                  key={color.id}
                  onPress={() => setSelectedColor(color.id)}
                  className="items-center justify-center"
                  style={{ width: "16%" }}
                >
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{
                      backgroundColor: color.value,
                    }}
                  >
                    {selectedColor === color.id && (
                      <Check size={20} color="white" strokeWidth={3} />
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
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
