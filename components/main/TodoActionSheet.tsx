import { View, Pressable } from "react-native";
import { CustomText } from "../common/CustomText";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback } from "react";
import { Pencil, Trash2 } from "lucide-react-native";

interface TodoActionSheetProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const TodoActionSheet = forwardRef<
  BottomSheetModal,
  TodoActionSheetProps
>(({ onEdit, onDelete }, ref) => {
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={["25%"]}
      index={0}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: "white" }}
    >
      <BottomSheetView className="flex-1 pt-2 pb-4">
        <Pressable className="flex-row items-center px-6 py-4" onPress={onEdit}>
          <Pencil size={20} color="#6B7280" />
          <CustomText size="base" className="text-gray-600 ml-3">
            수정하기
          </CustomText>
        </Pressable>
        <Pressable
          className="flex-row items-center px-6 py-4"
          onPress={onDelete}
        >
          <Trash2 size={20} color="#EF4444" />
          <CustomText size="base" className="text-red-500 ml-3">
            삭제하기
          </CustomText>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  );
});
