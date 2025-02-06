import { View, Pressable } from "react-native";
import { CustomText } from "../common/CustomText";
import { Edit3, ArrowUpDown, Trash2 } from "lucide-react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useMemo } from "react";

interface CategoryActionSheetProps {
  onEdit: () => void;
  onReorder: () => void;
  onDelete: () => void;
}

export const CategoryActionSheet = forwardRef<
  BottomSheetModal,
  CategoryActionSheetProps
>(({ onEdit, onReorder, onDelete }, ref) => {
  const snapPoints = useMemo(() => ["25%"], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  const actions = [
    {
      icon: Edit3,
      label: "카테고리 수정",
      onPress: onEdit,
      color: "#4B5563",
    },
    {
      icon: ArrowUpDown,
      label: "순서 변경",
      onPress: onReorder,
      color: "#4B5563",
    },
    {
      icon: Trash2,
      label: "카테고리 삭제",
      onPress: onDelete,
      color: "#EF4444",
    },
  ];

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      index={0}
      enablePanDownToClose
    >
      <BottomSheetView style={{ flex: 1, padding: 16 }}>
        {actions.map((action, index) => (
          <Pressable
            key={action.label}
            onPress={action.onPress}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 16,
              borderBottomWidth: index !== actions.length - 1 ? 1 : 0,
              borderBottomColor: "#f3f4f6",
            }}
          >
            <action.icon size={20} color={action.color} />
            <CustomText
              size="base"
              style={{
                marginLeft: 12,
                color: action.color === "#EF4444" ? "#ef4444" : "#374151",
              }}
            >
              {action.label}
            </CustomText>
          </Pressable>
        ))}
      </BottomSheetView>
    </BottomSheetModal>
  );
});
