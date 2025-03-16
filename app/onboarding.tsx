import { View, Pressable, Image, ScrollView } from "react-native";
import { CustomText } from "@/components/common/CustomText";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const ONBOARDING_KEY = "onboarding_completed";

export default function OnboardingScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // 크리스탈 애니메이션 값
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  // 크리스탈 애니메이션 스타일
  const crystalStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
      ] as any,
    };
  });

  useEffect(() => {
    // 애니메이션 시작
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // 위아래로 둥둥 떠있는 느낌의 애니메이션
    translateY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(10, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // 온보딩 완료 여부 확인
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (value === "true") {
        // 이미 온보딩을 완료한 경우 메인 화면으로 이동
        router.replace("/(tabs)");
      } else {
        // 온보딩을 완료하지 않은 경우 로딩 상태 해제
        setIsLoading(false);
      }
    } catch (error) {
      console.error("온보딩 상태 확인 오류:", error);
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // 온보딩 완료 상태 저장
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
      // 메인 화면으로 이동
      router.replace("/(tabs)");
    } catch (error) {
      console.error("온보딩 완료 저장 오류:", error);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <CustomText>로딩 중...</CustomText>
      </View>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-white flex justify-between"
      style={{ paddingTop: 0 }}
    >
      <View className="items-center w-full px-6 pt-8">
        <CustomText
          size="xl"
          weight="bold"
          className="text-gray-900 mb-4 text-center"
        >
          짠, 파란 크리스탈이 나왔어요✨
        </CustomText>

        <CustomText size="base" className="text-gray-600 mb-6 text-center">
          할 일을 3번 완료하면 알에서 나만의 동물이 탄생해요!{"\n"}
          누가 나올까요?
        </CustomText>
      </View>

      <View className="flex-1 items-center justify-center">
        <Animated.View style={crystalStyle}>
          <Image
            source={require("@/assets/icons/crystal.png")}
            style={{ width: 320, height: 320 }}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      <View className="w-full px-6 pb-8">
        <Pressable
          onPress={handleComplete}
          style={{ backgroundColor: "#3182F7" }}
          className="w-[95%] py-4 px-6 rounded-2xl mx-auto"
        >
          <CustomText
            size="base"
            weight="bold"
            className="text-white text-center"
          >
            확인
          </CustomText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
