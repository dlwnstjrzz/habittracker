import { View } from "react-native";
import { CustomText } from "@/components/CustomText";

export default function MyScreen() {
  return (
    <View className="flex-1 bg-white p-4">
      <View className="mt-12">
        <CustomText size="2xl" weight="bold">
          My
        </CustomText>
      </View>

      <View className="flex-1 items-center justify-center">
        <CustomText className="text-gray-500">준비 중입니다...</CustomText>
      </View>
    </View>
  );
}
