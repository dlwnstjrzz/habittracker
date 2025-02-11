import { View, ScrollView, Pressable } from "react-native";
import { CategoryHeatmap } from "@/components/stats/CategoryHeatmap";
import { useEffect, useState } from "react";
import { getCategories } from "@/utils/storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomText } from "@/components/common/CustomText";

export default function StatsScreen() {
  const [heatmapData, setHeatmapData] = useState([]);
  const [viewMode, setViewMode] = useState<"month" | "year">("month");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getCategories();
    if (data) {
      const processedData = processDataForHeatmap(data.todos, data.categories);
      setHeatmapData(processedData);
    }
  };

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
            data={heatmapData}
            startDate={getStartDate()}
            endDate={new Date().toISOString()}
            viewMode={viewMode}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function processDataForHeatmap(
  todos: Record<string, any[]>,
  categories: any[]
) {
  const result = [];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // 현재 월의 모든 날짜에 대해 완료율 계산
  Object.entries(todos).forEach(([date, dayTodos]) => {
    const todoDate = new Date(date);
    // 현재 월의 데이터만 처리
    if (todoDate.getMonth() === month && todoDate.getFullYear() === year) {
      // 카테고리별로 완료율 계산
      categories.forEach((category) => {
        const categoryTodos = dayTodos.filter(
          (todo) => todo.categoryId === category.id
        );
        if (categoryTodos.length > 0) {
          const completedTodos = categoryTodos.filter((todo) => todo.completed);
          result.push({
            categoryId: category.id,
            date: date,
            completionRate: completedTodos.length / categoryTodos.length,
          });
        }
      });
    }
  });

  return result;
}

function getStartDate() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString();
}
