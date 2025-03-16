import { forwardRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { isBefore, startOfDay } from "date-fns";
import { CommonModal, ActionButton } from "../common/CommonModal";
import React from "react";

interface TodoActionSheetProps {
  onEdit: () => void;
  onDelete: () => void;
  onSetReminder: () => void;
  onMakeRoutine: () => void;
  onDeleteRoutine?: (id: string) => void;
  todoDate: string;
  isRoutine?: boolean;
  routineId?: string;
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
      routineId,
    },
    ref
  ) => {
    const isBeforeToday = isBefore(
      startOfDay(new Date(todoDate)),
      startOfDay(new Date())
    );

    const handleDeleteRoutine = () => {
      if (onDeleteRoutine && routineId) {
        onDeleteRoutine(routineId);
      }
    };

    return (
      <CommonModal ref={ref} title="할 일 관리" snapPoints={["40%"]}>
        <ActionButton
          label="수정하기"
          iconName="pencil-circle"
          iconFamily="MaterialCommunityIcons"
          onPress={onEdit}
        />

        {!isBeforeToday && (
          <ActionButton
            label="알림 설정"
            iconName="alarm"
            iconFamily="MaterialIcons"
            onPress={onSetReminder}
          />
        )}

        {!isRoutine ? (
          <>
            <ActionButton
              label="루틴으로 만들기"
              iconName="refresh-circle"
              iconFamily="Ionicons"
              onPress={onMakeRoutine}
            />
            <ActionButton
              label="삭제하기"
              iconName="trash-bin"
              iconFamily="Ionicons"
              onPress={onDelete}
              danger={true}
            />
          </>
        ) : (
          <ActionButton
            label="루틴 삭제하기"
            iconName="trash-bin"
            iconFamily="Ionicons"
            onPress={handleDeleteRoutine}
            danger={true}
          />
        )}
      </CommonModal>
    );
  }
);
