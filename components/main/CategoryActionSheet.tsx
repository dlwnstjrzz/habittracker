import { forwardRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { CommonModal, ActionButton } from "../common/CommonModal";
import React from "react";

interface CategoryActionSheetProps {
  onEdit: () => void;
  onReorder: () => void;
  onDelete: () => void;
}

export const CategoryActionSheet = forwardRef<
  BottomSheetModal,
  CategoryActionSheetProps
>(({ onEdit, onReorder, onDelete }, ref) => {
  return (
    <CommonModal ref={ref} title="카테고리 관리" snapPoints={["30%"]}>
      <ActionButton
        label="카테고리 수정"
        iconName="pencil-circle"
        iconFamily="MaterialCommunityIcons"
        onPress={onEdit}
      />

      <ActionButton
        label="순서 변경"
        iconName="swap-vertical-circle"
        iconFamily="MaterialIcons"
        onPress={onReorder}
      />

      <ActionButton
        label="카테고리 삭제"
        iconName="trash-bin"
        iconFamily="Ionicons"
        onPress={onDelete}
        danger={true}
      />
    </CommonModal>
  );
});
