import { View, Pressable } from "react-native";
import { CustomText } from "@/components/common/CustomText";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useCharacterStore } from "@/store/useCharacterStore";
export default function EggPage() {
  const { isEvolutionReady, evolve } = useCharacterStore();
  const rotateZ = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotateZ.value}deg` }],
    };
  });

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isEvolutionReady) {
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
    <View className="w-full h-[400px] bg-[#F6F5F9]">
      <View className="w-full h-full flex items-center justify-center">
        {isEvolutionReady && (
          <CustomText className="text-lg text-blue-500 mb-4">
            부화 준비가 되었어요! 알을 터치해주세요!
          </CustomText>
        )}
        <Pressable onPress={handlePress}>
          <Animated.Image
            source={require("@/assets/icons/egg.png")}
            className="w-60 h-60"
            style={animatedStyle}
          />
        </Pressable>
      </View>
    </View>
  );
}
