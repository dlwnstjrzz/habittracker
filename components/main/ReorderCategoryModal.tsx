import { View, Pressable, Image } from "react-native";
import { CustomText } from "../common/CustomText";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useState, useEffect } from "react";
import { GripVertical } from "lucide-react-native";
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
import { CommonModal } from "../common/CommonModal";
import React from "react";

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
    <CommonModal ref={ref} title="카테고리 순서 변경" snapPoints={["70%"]}>
      {/* 안내 문구와 캐릭터 추가 */}
      <View className="flex-row items-center mb-4 bg-pink-50 rounded-xl p-4">
        <CustomText size="sm" className="text-gray-600 flex-1">
          길게 누르고 드래그하면 순서가 변경됩니다!
        </CustomText>
        <Image
          source={require("@/assets/images/rabby2d.png")}
          className="w-12 h-12"
          resizeMode="contain"
        />
      </View>

      {/* 드래그 리스트 */}
      <ReorderableList
        data={items}
        onReorder={handleReorder}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </CommonModal>
  );
});
