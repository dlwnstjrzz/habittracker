import { View, Pressable } from "react-native";
import { CustomText } from "../common/CustomText";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback } from "react";
import { Pencil, Trash2, Bell, Repeat } from "lucide-react-native";
import { format, isBefore, startOfDay } from "date-fns";

interface TodoActionSheetProps {
  onEdit: () => void;
  onDelete: () => void;
  onSetReminder: () => void;
  onMakeRoutine: () => void;
  onDeleteRoutine?: (id: string) => void;
  todoDate: string;
  isRoutine?: boolean;
}

export const TodoActionSheet = forwardRef<
  BottomSheetModal,
  TodoActionSheetProps
>(
  (
    {
      onEdit,
      onDelete,
      onSetReminder,
      onMakeRoutine,
      onDeleteRoutine,
      todoDate,
      isRoutine,
    },
    ref
  ) => {
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
        snapPoints={["40%"]}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: "white" }}
      >
        <BottomSheetView className="flex-1 pt-2 pb-4">
          <Pressable
            className="flex-row items-center px-6 py-4 rounded-lg bg-pink-100 mb-2"
            onPress={onEdit}
          >
            <Pencil size={20} color="#EC4899" />
            <CustomText size="base" className="text-pink-600 ml-3">
              수정하기
            </CustomText>
          </Pressable>
          {!isBeforeToday && (
            <Pressable
              className="flex-row items-center px-6 py-4 rounded-lg bg-blue-100 mb-2"
              onPress={onSetReminder}
            >
              <Bell size={20} color="#3B82F6" />
              <CustomText size="base" className="text-blue-600 ml-3">
                알림 설정
              </CustomText>
            </Pressable>
          )}
          {!isRoutine ? (
            <>
              <Pressable
                className="flex-row items-center px-6 py-4 rounded-lg bg-red-100 mb-2"
                onPress={onDelete}
              >
                <Trash2 size={20} color="#EF4444" />
                <CustomText size="base" className="text-red-500 ml-3">
                  삭제하기
                </CustomText>
              </Pressable>
              <Pressable
                className="flex-row items-center px-6 py-4 rounded-lg bg-green-100"
                onPress={onMakeRoutine}
              >
                <Repeat size={20} color="#10B981" />
                <CustomText size="base" className="text-green-600 ml-3">
                  루틴으로 만들기
                </CustomText>
              </Pressable>
            </>
          ) : (
            <Pressable
              className="flex-row items-center px-6 py-4 rounded-lg bg-red-100"
              onPress={onDeleteRoutine}
            >
              <Trash2 size={20} color="#EF4444" />
              <CustomText size="base" className="text-red-500 ml-3">
                루틴 삭제하기
              </CustomText>
            </Pressable>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);
