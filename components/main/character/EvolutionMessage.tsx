import { View, Pressable, StyleSheet } from "react-native";
import { CustomText } from "@/components/common/CustomText";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

interface EvolutionMessageProps {
  message: string;
  subMessage?: string;
  onPress?: () => void;
}

export function EvolutionMessage({
  message,
  subMessage,
  onPress,
}: EvolutionMessageProps) {
  // 애니메이션 값
  const translateY = useSharedValue(0);

  useEffect(() => {
    // 위아래 움직임 애니메이션
    translateY.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 1500 }),
        withTiming(3, { duration: 1500 })
      ),
      -1, // 무한 반복
      true // 부드럽게 반복
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Animated.View style={[styles.messageBox, animatedStyle]}>
        <CustomText weight="bold" size="base" style={styles.mainText}>
          {message}
        </CustomText>

        {subMessage && (
          <CustomText weight="medium" size="sm" style={styles.subText}>
            {subMessage}
          </CustomText>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 64,
    left: "50%",
    transform: [{ translateX: -100 }],
    zIndex: 50,
    width: 200,
  },
  messageBox: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    alignItems: "center",
  },
  mainText: {
    color: "#3182F7",
    textAlign: "center",
    marginBottom: 2,
  },
  subText: {
    color: "#666666",
    textAlign: "center",
  },
});
