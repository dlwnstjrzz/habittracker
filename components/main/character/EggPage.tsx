import { View, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { CustomText } from "@/components/common/CustomText";
import { useCharacterStore } from "@/store/useCharacterStore";
import Animated, {
  useAnimatedStyle,
  withSequence,
  withRepeat,
  withTiming,
  useSharedValue,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { EvolutionMessage } from "./EvolutionMessage";

export default function EggPage() {
  const { isEvolutionReady, evolve } = useCharacterStore();
  const rotateZ = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (isEvolutionReady) {
      rotateZ.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
          withTiming(5, { duration: 1000, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      );
    }
  }, [isEvolutionReady]);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(15, { duration: 1500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const rotationTransform = { rotateZ: `${rotateZ.value}deg` };
    const translationTransform = { translateY: translateY.value };

    return {
      marginTop: 40,
      transform: [rotationTransform, translationTransform],
    };
  });

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (isEvolutionReady) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      evolve();
      return;
    }

    rotateZ.value = withSequence(
      withTiming(-5, { duration: 50 }),
      withTiming(5, { duration: 50 }),
      withTiming(-5, { duration: 50 }),
      withTiming(5, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  return (
    <View className="flex-1 items-center justify-center">
      <View className="items-center relative">
        {isEvolutionReady && (
          <EvolutionMessage
            message="크리스탈을 터치해보세요!"
            subMessage="누가 나올까요?"
            onPress={handlePress}
          />
        )}
        <Pressable onPress={handlePress}>
          <Animated.Image
            source={require("@/assets/icons/crystal.png")}
            className="w-72 h-72"
            style={animatedStyle}
          />
        </Pressable>
      </View>
    </View>
  );
}
