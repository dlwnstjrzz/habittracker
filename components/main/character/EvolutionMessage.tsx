import { View, Pressable } from "react-native";
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
  // 살짝 둥둥 떠있는 느낌의 애니메이션
  const translateY = useSharedValue(0);

  useEffect(() => {
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
    <Pressable
      className="absolute top-20 left-1/2 -translate-x-1/2 z-50"
      onPress={onPress}
    >
      <Animated.View
        style={animatedStyle}
        className="bg-white/95 px-5 py-3 rounded-xl border border-pink-200 shadow-sm"
      >
        <View className="absolute -top-2 left-1/2 -translate-x-1/2">
          <CustomText className="text-lg">✨</CustomText>
        </View>

        <View className="items-center">
          <CustomText
            weight="bold"
            size="base"
            className="text-rose-500 text-center mb-0.5"
          >
            {message}
          </CustomText>

          {subMessage && (
            <CustomText
              weight="medium"
              size="sm"
              className="text-pink-400 text-center"
            >
              {subMessage}
            </CustomText>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}
