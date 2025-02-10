import {
  View,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
  InputAccessoryView,
} from "react-native";
import { useState, Suspense, useEffect } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import { ko } from "date-fns/locale";
import { CustomText } from "@/components/common/CustomText";
import { Character3D } from "@/components/common/Character3D";
import TodoList from "@/components/main/TodoList";
import { clearStorage } from "@/utils/storage";
import WeeklyDatePicker from "@/components/main/WeeklyDatePicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// @ts-ignore
import characterModel from "../../assets/models/animals/Rabby.fbx";
// @ts-ignore
import characterAnimation from "../../assets/models/animals/Anim_Rabby_Idle.fbx";
// @ts-ignore
import characterTexture from "../../assets/models/Textures/T_Rabby_01.png";
import React from "react";

function MainScreen() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 컴포넌트 마운트 시 초기 날짜 설정
  useEffect(() => {
    setSelectedDate(new Date());
    // clearStorage();
  }, []);

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
        {/* Character Section */}
        <View className="h-[400px] items-center justify-center bg-gray-50">
          {/* <Character3D
          modelUrl={characterModel}
          animationUrl={characterAnimation}
          textureUrl={characterTexture}
          /> */}
        </View>

        {/* Calendar Strip */}
        {selectedDate && <WeeklyDatePicker />}

        {/* Todo Lists */}
        <TodoList />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
export default MainScreen;
