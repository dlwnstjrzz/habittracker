import { View, Pressable } from "react-native";
import { CustomText } from "../common/CustomText";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback } from "react";
import { Pencil, Trash2, Bell } from "lucide-react-native";
import { format, isBefore, startOfDay } from "date-fns";

interface TodoActionSheetProps {
  onEdit: () => void;
  onDelete: () => void;
  onSetReminder: () => void;
  todoDate: string;
}

export const TodoActionSheet = forwardRef<
  BottomSheetModal,
  TodoActionSheetProps
>(({ onEdit, onDelete, onSetReminder, todoDate }, ref) => {
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

  const isBeforeToday = isBefore(
    startOfDay(new Date(todoDate)),
    startOfDay(new Date())
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
        {!isBeforeToday && (
          <Pressable
            className="flex-row items-center px-6 py-4"
            onPress={onSetReminder}
          >
            <Bell size={20} color="#6B7280" />
            <CustomText size="base" className="text-gray-600 ml-3">
              알림 설정
            </CustomText>
          </Pressable>
        )}
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
