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

function MainScreen() {
  const { stage } = useCharacterStore();

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
