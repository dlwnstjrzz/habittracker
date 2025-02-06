import { View } from "react-native";
import { CustomText } from "@/components/common/CustomText";

export default function StatsScreen() {
  return (
    <View className="flex-1 bg-white p-4">
      <View className="mt-12">
        <CustomText size="2xl" weight="bold">
          통계
        </CustomText>
      </View>

      {/* 통계 컨텐츠는 나중에 구현 */}
      <View className="flex-1 items-center justify-center">
        <CustomText className="text-gray-500">준비 중입니다...</CustomText>
      </View>
    </View>
  );
}
