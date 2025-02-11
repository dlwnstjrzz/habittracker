import { View, ScrollView } from "react-native";
import { CustomText } from "../common/CustomText";
import { getCategories } from "@/utils/storage";
import { useEffect, useState } from "react";
import { format } from "date-fns";

interface Category {
  id: string;
  title: string;
  color: string;
}

interface HeatmapProps {
  data: {
    categoryId: string;
    date: string;
    completionRate: number; // 0-1 사이의 값
  }[];
  startDate: string;
  endDate: string;
  viewMode: "month" | "year"; // viewMode 추가
}

// 투명도로 완료율을 표현
const OPACITY_LEVELS = [
  "opacity-10",
  "opacity-30",
  "opacity-50",
  "opacity-70",
  "opacity-100",
];

function getOpacityByCompletion(rate: number) {
  if (rate === 0) return OPACITY_LEVELS[0];
  if (rate <= 0.25) return OPACITY_LEVELS[1];
  if (rate <= 0.5) return OPACITY_LEVELS[2];
  if (rate <= 0.75) return OPACITY_LEVELS[3];
  return OPACITY_LEVELS[4];
}

function getDaysInMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

// 월 데이터 타입 정의 추가
type MonthData = {
  month: string;
  weeks: string[][];
};

function getMonthDates(viewMode: "month" | "year") {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  if (viewMode === "month") {
    // 월간 뷰 로직은 그대로 유지
    const daysInMonth = getDaysInMonth();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(year, month, i + 1);
      return date.toISOString().split("T")[0];
    });
  } else {
    // 최근 6개월의 데이터를 월별로 그룹화
    const monthsData: MonthData[] = [];

    for (let i = 5; i >= 0; i--) {
      const targetMonth = new Date(year, month - i, 1);
      const monthStr = format(targetMonth, "M월");
      let currentWeek: string[] = [];
      const weeks: string[][] = [];

      const daysInMonth = new Date(
        targetMonth.getFullYear(),
        targetMonth.getMonth() + 1,
        0
      ).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(
          targetMonth.getFullYear(),
          targetMonth.getMonth(),
          day
        );
        const dateStr = date.toISOString().split("T")[0];

        currentWeek.push(dateStr);

        if (currentWeek.length === 7) {
          weeks.push([...currentWeek]);
          currentWeek = [];
        }
      }

      if (currentWeek.length > 0) {
        weeks.push(currentWeek);
      }

      monthsData.push({
        month: monthStr,
        weeks,
      });
    }

    return monthsData;
  }
}

// 현재 날짜 기준으로 목데이터 생성
const now = new Date();
const year = now.getFullYear();
const month = (now.getMonth() + 1).toString().padStart(2, "0");

const MOCK_DATA = [
  // 빨간색 카테고리의 데이터
  {
    categoryId: "red",
    date: `${year}-${month}-01`,
    completionRate: 0.8,
  },
  {
    categoryId: "red",
    date: `${year}-${month}-02`,
    completionRate: 0.4,
  },
  {
    categoryId: "red",
    date: `${year}-${month}-05`,
    completionRate: 1.0,
  },
  // 파란색 카테고리의 데이터
  {
    categoryId: "blue",
    date: `${year}-${month}-01`,
    completionRate: 0.6,
  },
  {
    categoryId: "blue",
    date: `${year}-${month}-03`,
    completionRate: 0.3,
  },
  {
    categoryId: "blue",
    date: `${year}-${month}-06`,
    completionRate: 0.9,
  },
  // 초록색 카테고리의 데이터
  {
    categoryId: "green",
    date: `${year}-${month}-02`,
    completionRate: 0.7,
  },
  {
    categoryId: "green",
    date: `${year}-${month}-04`,
    completionRate: 0.5,
  },
  {
    categoryId: "green",
    date: `${year}-${month}-07`,
    completionRate: 1.0,
  },
];

// opacity 값을 rgba로 변환하는 함수 추가
function getOpacityValue(level: string) {
  switch (level) {
    case "opacity-10":
      return 0.1;
    case "opacity-30":
      return 0.3;
    case "opacity-50":
      return 0.5;
    case "opacity-70":
      return 0.7;
    case "opacity-100":
      return 1;
    default:
      return 0.1;
  }
}

export function CategoryHeatmap({
  data: propData,
  startDate,
  endDate,
  viewMode,
}: HeatmapProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const monthDates = getMonthDates(viewMode);
  const data = MOCK_DATA; // 나중에 propData로 변경

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const result = await getCategories();
    if (result) {
      setCategories(result.categories);
    }
  };

  return (
    <View className="space-y-6">
      {categories.map((category) => {
        const categoryData = data.filter((d) => d.categoryId === category.id);
        const categoryColor = category.color;

        return (
          <View key={category.id} className="bg-white rounded-xl p-4">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <CustomText
                  size="sm"
                  weight="bold"
                  className="opacity-80"
                  style={{ color: categoryColor }}
                >
                  {category.title}
                </CustomText>
                {/* {viewMode === "year" && (
                  <CustomText size="xs" className="text-gray-500 mt-1">
                    최근 6개월
                  </CustomText>
                )} */}
              </View>
              {/* 범례 */}
              <View className="flex-row items-center space-x-1">
                {OPACITY_LEVELS.map((opacity) => (
                  <View
                    key={opacity}
                    className="w-3 h-3 rounded-sm"
                    style={{
                      backgroundColor: categoryColor,
                      opacity: getOpacityValue(opacity),
                    }}
                  />
                ))}
              </View>
            </View>

            {/* 히트맵 그리드 */}
            {viewMode === "month" ? (
              <View className="flex-row flex-wrap">
                {monthDates.map((dateStr) => {
                  const dayData = categoryData.find((d) => d.date === dateStr);
                  const opacity = dayData
                    ? getOpacityValue(
                        getOpacityByCompletion(dayData.completionRate)
                      )
                    : 0.1;

                  return (
                    <View
                      key={dateStr}
                      className="m-[1px] rounded-[4px]"
                      style={{
                        width: 18,
                        height: 18,
                        backgroundColor: categoryColor,
                        opacity,
                      }}
                    />
                  );
                })}
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row"
              >
                {monthDates.map((monthData, monthIndex) => (
                  <View key={monthIndex} className="mr-4">
                    {/* 월 헤더 */}
                    <View className="flex-row items-center mb-2">
                      <CustomText
                        size="xs"
                        weight="medium"
                        className="opacity-80"
                        style={{ color: categoryColor }}
                      >
                        {monthData.month}
                      </CustomText>
                    </View>
                    {/* 주차별 데이터 */}
                    <View className="flex-row">
                      {monthData.weeks.map((week, weekIndex) => (
                        <View key={weekIndex} className="flex-col">
                          {week.map((dateStr) => {
                            const dayData = categoryData.find(
                              (d) => d.date === dateStr
                            );
                            const opacity = dayData
                              ? getOpacityValue(
                                  getOpacityByCompletion(dayData.completionRate)
                                )
                              : 0.1;

                            return (
                              <View
                                key={dateStr}
                                className="m-[1px] rounded-[3px]"
                                style={{
                                  width: 18,
                                  height: 18,
                                  backgroundColor: categoryColor,
                                  opacity,
                                }}
                              />
                            );
                          })}
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        );
      })}
    </View>
  );
}

// 데이터를 카테고리별로 그룹화하는 헬퍼 함수
function groupByCategory(data: HeatmapProps["data"]) {
  return data.reduce((acc, curr) => {
    if (!acc[curr.categoryId]) {
      acc[curr.categoryId] = [];
    }
    acc[curr.categoryId].push(curr);
    return acc;
  }, {} as Record<string, typeof data>);
}

// 카테고리 ID로 이름을 가져오는 함수 (실제 구현 필요)
function getCategoryName(categoryId: string) {
  // TODO: categories 데이터에서 실제 이름을 가져오도록 구현
  return categoryId;
}
