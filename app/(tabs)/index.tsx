import {
  View,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { CustomText } from "@/components/common/CustomText";
import TodoList from "@/components/main/TodoList";
import { clearStorage } from "@/utils/storage";
import WeeklyDatePicker from "@/components/main/WeeklyDatePicker";
import { useCharacterStore } from "@/store/useCharacterStore";
import CharacterSection from "@/components/main/character/CharacterSection";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const ONBOARDING_KEY = "onboarding_completed";

function MainScreen() {
  const { stage } = useCharacterStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // 온보딩 상태 확인
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        console.log("온보딩 상태:", value);
        if (value !== "true") {
          // 온보딩을 완료하지 않은 경우 온보딩 화면으로 이동
          console.log("온보딩 화면으로 이동");
          router.replace("/onboarding");
        } else {
          console.log("메인 화면 표시");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("온보딩 상태 확인 오류:", error);
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [router]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <CustomText>로딩 중...</CustomText>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "white" }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
    >
      <ScrollView
        className="flex-1 bg-white"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: "transparent",
        }}
        bounces={false}
      >
        <CharacterSection stage={stage} />
        <WeeklyDatePicker />
        <View className="h-[1px] my-4" />
        <TodoList />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default MainScreen;
