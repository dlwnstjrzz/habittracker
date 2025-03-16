import { View, Animated as RNAnimated, Pressable } from "react-native";
import { CustomText } from "@/components/common/CustomText";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  useSharedValue,
  runOnJS,
  withDelay,
  withRepeat,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BabyBottleIcon } from "@/assets/icons/BabyBottleIcon";
import { IcecreamIcon } from "@/assets/icons/IcecreamIcon";
import { useCharacterStore } from "@/store/useCharacterStore";
import { useEffect } from "react";
import * as Haptics from "expo-haptics";
import { ChevronUp, Milk } from "lucide-react-native";

interface ExperienceBarProps {
  experience: number;
  maxExperience: number;
  level: number;
}

export function ExperienceBar({
  experience,
  maxExperience,
  level,
}: ExperienceBarProps) {
  const insets = useSafeAreaInsets();
  const progress = experience / maxExperience;
  const { isLevelingUp, completeLevelUp, canLevelUp, startLevelUp } =
    useCharacterStore();

  // 레벨업 애니메이션 관련 값
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const levelUpButtonScale = useSharedValue(1);
  const buttonFloat = useSharedValue(0);

  const progressStyle = useAnimatedStyle(() => ({
    width: withSpring(`${Math.max(3, Math.min(progress * 100, 100))}%`, {
      damping: 15,
      stiffness: 100,
    }),
  }));

  const levelContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const levelUpEffectStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 10,
    alignItems: "center",
    justifyContent: "center",
  }));

  const levelUpButtonStyle = useAnimatedStyle(() => ({
    opacity: canLevelUp ? 1 : 0,
    transform: [
      { scale: levelUpButtonScale.value },
      { translateY: buttonFloat.value },
    ] as any,
    display: canLevelUp ? "flex" : "none",
  }));

  // 레벨업 버튼 애니메이션
  useEffect(() => {
    if (canLevelUp) {
      // 버튼 크기 애니메이션
      levelUpButtonScale.value = withSequence(
        withTiming(1.1, { duration: 400 }),
        withTiming(1, { duration: 400 })
      );

      // 버튼 위아래 움직임 애니메이션
      buttonFloat.value = withRepeat(
        withSequence(
          withTiming(-3, { duration: 800 }),
          withTiming(0, { duration: 800 })
        ),
        -1, // 무한 반복
        true // 부드럽게 반복
      );
    }
  }, [canLevelUp]);

  // 레벨업 애니메이션 처리
  useEffect(() => {
    if (isLevelingUp) {
      // 진동 피드백
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // 레벨 숫자 애니메이션
      scale.value = withSequence(
        withTiming(1.2, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );

      // 레벨업 이펙트 표시
      opacity.value = withSequence(
        withTiming(1, { duration: 300 }),
        withDelay(
          1000,
          withTiming(0, { duration: 300 }, () => {
            runOnJS(completeLevelUp)();
          })
        )
      );

      return () => {};
    }
  }, [isLevelingUp]);

  // 레벨업 버튼 클릭 핸들러
  const handleLevelUpPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    startLevelUp();
  };

  return (
    <View
      style={{ paddingTop: insets.top + 8 }}
      className="absolute top-0 left-4 z-50"
    >
      <View className="relative">
        {/* 메인 경험치 바 컨테이너 */}
        <View className="flex-row items-center space-x-2">
          {/* 아이콘 - 배경색 제거 */}
          <View className="p-1 rounded-full">
            <IcecreamIcon size={38} />
          </View>

          {/* 레벨과 경험치 바 - 함께 묶음 */}
          <View className="bg-white/95 rounded-full px-3 py-1 shadow-sm border border-pink-100">
            <View className="flex-row items-center gap-2">
              {/* 레벨 표시 */}
              <Animated.View style={levelContainerStyle}>
                <CustomText size="sm" weight="bold" className="text-rose-400">
                  Lv.{isLevelingUp ? level + 1 : level}
                </CustomText>
              </Animated.View>

              {/* 경험치 바 */}
              <View className="w-24 relative">
                <View className="h-3 bg-stone-100 rounded-full overflow-hidden">
                  <Animated.View
                    style={[
                      {
                        height: "100%",
                        borderRadius: 9999,
                      },
                      progressStyle,
                    ]}
                  >
                    <LinearGradient
                      colors={["#F9A8D4", "#EC4899"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </Animated.View>
                </View>
              </View>

              {/* 경험치 수치 */}
              <CustomText
                size="sm"
                weight="bold"
                className="text-stone-500 w-10"
              >
                {experience}/{maxExperience}
              </CustomText>
            </View>
          </View>
        </View>

        {/* 루미 우유 주기 버튼 - 경험치 바 우측 아래에 배치 */}
        {canLevelUp && (
          <Animated.View
            style={levelUpButtonStyle}
            className="absolute top-10 left-32"
          >
            <Pressable
              onPress={handleLevelUpPress}
              className="bg-white/90 px-3 py-1.5 rounded-full flex-row items-center shadow-sm border border-pink-200"
            >
              <View className="mr-1.5">
                <BabyBottleIcon size={20} color="#EC4899" />
              </View>
              <CustomText size="xs" weight="bold" className="text-rose-500">
                루미 우유 주기
              </CustomText>
            </Pressable>
          </Animated.View>
        )}
      </View>

      {/* 레벨업 이펙트 - 간단한 텍스트만 표시 */}
      <Animated.View style={levelUpEffectStyle}>
        <View className="items-center justify-center">
          <CustomText
            size="xl"
            weight="bold"
            className="text-rose-500"
            style={{
              textShadowColor: "rgba(0, 0, 0, 0.2)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
            }}
          >
            LEVEL UP!
          </CustomText>
        </View>
      </Animated.View>
    </View>
  );
}
