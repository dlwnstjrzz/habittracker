import { View, Pressable } from "react-native";
import { CustomText } from "./CustomText";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, ReactNode } from "react";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React from "react";

interface CommonModalProps {
  title?: string;
  children: ReactNode;
  snapPoints?: string[];
  showCloseButton?: boolean;
  onClose?: () => void;
}

export const CommonModal = forwardRef<BottomSheetModal, CommonModalProps>(
  (
    { title, children, snapPoints = ["40%"], showCloseButton = true, onClose },
    ref
  ) => {
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

    const handleClose = () => {
      if (ref && typeof ref !== "function" && ref.current) {
        ref.current.dismiss();
      }
      if (onClose) {
        onClose();
      }
    };

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        index={0}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: "white" }}
        handleIndicatorStyle={{ backgroundColor: "#E5E7EB", width: 40 }}
      >
        <BottomSheetView className="flex-1 pt-2 pb-6">
          {/* 헤더 */}
          {(title || showCloseButton) && (
            <View className="flex-row items-center justify-between px-6 py-4">
              {title && (
                <CustomText size="lg" weight="bold" className="text-gray-900">
                  {title}
                </CustomText>
              )}
              {showCloseButton && (
                <Pressable
                  onPress={handleClose}
                  className="w-8 h-8 items-center justify-center"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close-circle" size={24} color="#9CA3AF" />
                </Pressable>
              )}
            </View>
          )}

          {/* 컨텐츠 */}
          <View className="px-6 flex-1 pt-2 space-y-1">{children}</View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

// 액션 버튼 컴포넌트
interface ActionButtonProps {
  label: string;
  iconName?: any;
  iconFamily?:
    | "Ionicons"
    | "MaterialIcons"
    | "FontAwesome"
    | "Feather"
    | "MaterialCommunityIcons";
  onPress: () => void;
  danger?: boolean;
  fullWidth?: boolean;
}

export const ActionButton = ({
  label,
  iconName,
  iconFamily = "Ionicons",
  onPress,
  danger = false,
  fullWidth = false,
}: ActionButtonProps) => {
  const textColor = danger ? "#EF4444" : "#374151";

  const renderIcon = () => {
    if (!iconName) return null;

    switch (iconFamily) {
      case "Ionicons":
        return <Ionicons name={iconName} size={22} color={textColor} />;
      case "MaterialIcons":
        return <MaterialIcons name={iconName} size={22} color={textColor} />;
      case "FontAwesome":
        return <FontAwesome name={iconName} size={22} color={textColor} />;
      case "Feather":
        return <Feather name={iconName} size={22} color={textColor} />;
      case "MaterialCommunityIcons":
        return (
          <MaterialCommunityIcons name={iconName} size={22} color={textColor} />
        );
      default:
        return <Ionicons name={iconName} size={22} color={textColor} />;
    }
  };

  return (
    <Pressable
      className={`flex-row items-center py-4 ${fullWidth ? "w-full" : ""}`}
      onPress={onPress}
      android_ripple={{ color: "rgba(0, 0, 0, 0.05)" }}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "rgba(0, 0, 0, 0.02)" : "transparent",
        },
      ]}
    >
      <View className="flex-row items-center">
        {iconName && <View className="w-9 items-center">{renderIcon()}</View>}
        <CustomText
          size="base"
          weight="medium"
          className="ml-2"
          style={{ color: textColor }}
        >
          {label}
        </CustomText>
      </View>
    </Pressable>
  );
};
