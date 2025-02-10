import { View, Pressable } from "react-native";
import { CustomText } from "../common/CustomText";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useState, useEffect } from "react";
import { X, GripVertical } from "lucide-react-native";
import ReorderableList, {
  useReorderableDrag,
} from "react-native-reorderable-list";
import { getColorValue } from "@/constants/Colors";
import {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import Animated from "react-native-reanimated";

interface Category {
  id: string;
  title: string;
  color: string;
}

const CategoryItem = ({ item }: { item: Category }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const drag = useReorderableDrag();

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onLongPress={drag}
        onPressIn={() => {
          scale.value = withSpring(1.05);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        className="flex-row items-center justify-between py-4 px-4 bg-white"
      >
        <View className="flex-row items-center flex-1">
          <CustomText
            size="base"
            weight="medium"
            style={{ color: getColorValue(item.color) }}
          >
            {item.title}
          </CustomText>
        </View>
        <GripVertical size={20} color="#9CA3AF" />
      </Pressable>
    </Animated.View>
  );
};

interface ReorderCategoryModalProps {
  categories: Category[];
  onReorder: (categories: Category[]) => void;
}

export const ReorderCategoryModal = forwardRef<
  BottomSheetModal,
  ReorderCategoryModalProps
>(({ categories, onReorder }, ref) => {
  const [items, setItems] = useState(categories);

  useEffect(() => {
    setItems(categories);
  }, [categories]);

  const handleReorder = useCallback(
    ({ from, to }: { from: number; to: number }) => {
      const newItems = [...items];
      const [movedItem] = newItems.splice(from, 1);
      newItems.splice(to, 0, movedItem);
      setItems(newItems);
      onReorder(newItems);
    },
    [items, onReorder]
  );

  const renderItem = useCallback(({ item }: { item: Category }) => {
    return <CategoryItem item={item} />;
  }, []);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={["90%"]}
      index={0}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: "white" }}
    >
      <BottomSheetView className="flex-1 pt-2">
        {/* 헤더 */}
        <View className="flex-row items-center justify-between mb-4 px-4">
          <CustomText size="xl" weight="bold" className="text-gray-900">
            카테고리 순서 변경
          </CustomText>
          <Pressable
            onPress={() => (ref as any).current?.dismiss()}
            className="w-10 h-10 items-center justify-center rounded-full"
          >
            <X size={24} color="#6B7280" />
          </Pressable>
        </View>

        {/* 드래그 리스트 */}
        <ReorderableList
          data={items}
          onReorder={handleReorder}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});
