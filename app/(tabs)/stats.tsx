import { View, ScrollView, Pressable } from "react-native";
import { CategoryHeatmap } from "@/components/stats/CategoryHeatmap";
import { useEffect, useState } from "react";
import { getCategories } from "@/utils/storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomText } from "@/components/common/CustomText";

export default function StatsScreen() {
  const [viewMode, setViewMode] = useState<"month" | "year">("month");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-8 py-1">
        <CustomText size="lg" weight="bold">
          통계
        </CustomText>
      </View>

      {/* 뷰 모드 토글 */}
      <View className="flex-row items-center justify-center px-4 pb-4">
        <View className="flex-row rounded-full overflow-hidden">
          <Pressable
            onPress={() => setViewMode("month")}
            className={`px-5 py-1.5 ${
              viewMode === "month" ? "bg-gray-900" : "bg-gray-100"
            }`}
          >
            <CustomText
              size="sm"
              weight="medium"
              className={viewMode === "month" ? "text-white" : "text-gray-900"}
            >
              월간
            </CustomText>
          </Pressable>
          <Pressable
            onPress={() => setViewMode("year")}
            className={`px-5 py-1.5 ${
              viewMode === "year" ? "bg-gray-900" : "bg-gray-100"
            }`}
          >
            <CustomText
              size="sm"
              weight="medium"
              className={viewMode === "year" ? "text-white" : "text-gray-900"}
            >
              연간
            </CustomText>
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4">
          <CategoryHeatmap
            startDate={getStartDate()}
            endDate={new Date().toISOString()}
            viewMode={viewMode}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getStartDate() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString();
}
