import { View, ScrollView } from "react-native";
import { CustomText } from "../common/CustomText";
import { getCategories } from "@/utils/storage";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { getColorValue } from "@/constants/Colors";

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
  now.setHours(0, 0, 0, 0); // 오늘 날짜의 시작으로 설정

  // 내일 날짜 계산
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (viewMode === "month") {
    // 월간 뷰 로직은 그대로 유지
    const daysInMonth = getDaysInMonth();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth(), i + 1);
      return date.toISOString().split("T")[0];
    });
  } else {
    const dates: string[][] = [];
    const monthLabels: {
      label: string;
      weekIndex: number;
    }[] = [];
    let currentWeek: string[] = [];
    let weekIndex = 0;
    let lastMonth = -1;

    // 시작일을 6개월 전으로 설정
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 5);
    startDate.setDate(1);

    // 시작일을 이전 일요일로 조정
    while (startDate.getDay() !== 0) {
      startDate.setDate(startDate.getDate() - 1);
    }

    // 현재 처리 중인 날짜
    let currentDate = new Date(startDate);

    while (currentDate <= tomorrow) {
      // tomorrow까지 포함
      const currentMonth = currentDate.getMonth();

      // 월이 바뀌면 라벨 추가
      if (currentMonth !== lastMonth) {
        monthLabels.push({
          label: format(currentDate, "M월"),
          weekIndex,
        });
        lastMonth = currentMonth;
      }

      const dateStr = currentDate.toISOString().split("T")[0];

      // 현재 날짜가 내일 이후면 빈 문자열 추가
      if (currentDate > tomorrow) {
        currentWeek.push("");
      } else {
        currentWeek.push(dateStr);
      }

      if (currentWeek.length === 7) {
        dates.push([...currentWeek]);
        currentWeek = [];
        weekIndex++;
      }

      // 다음 날짜로
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // 마지막 주 처리
    if (currentWeek.length > 0) {
      // 나머지 날짜를 빈 문자열로 채움
      while (currentWeek.length < 7) {
        currentWeek.push("");
      }
      dates.push(currentWeek);
    }

    return { dates, monthLabels };
  }
}

// 현재 날짜 기준으로 목데이터 생성
const now = new Date();
const year = now.getFullYear();
const month = (now.getMonth() + 1).toString().padStart(2, "0");

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

interface TodoData {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  categoryId: string;
}

function processDataForHeatmap(todos: Record<string, TodoData[]>) {
  const result: {
    categoryId: string;
    date: string;
    completionRate: number;
  }[] = [];

  // 날짜별, 카테고리별로 완료율 계산
  Object.entries(todos).forEach(([date, dayTodos]) => {
    // 카테고리별로 그룹화
    const categoryGroups = dayTodos.reduce((acc, todo) => {
      if (!acc[todo.categoryId]) {
        acc[todo.categoryId] = [];
      }
      acc[todo.categoryId].push(todo);
      return acc;
    }, {} as Record<string, TodoData[]>);

    // 각 카테고리의 완료율 계산
    Object.entries(categoryGroups).forEach(([categoryId, todos]) => {
      const completedCount = todos.filter((todo) => todo.completed).length;
      const completionRate =
        todos.length > 0 ? completedCount / todos.length : 0;

      result.push({
        categoryId,
        date,
        completionRate,
      });
    });
  });

  return result;
}

export function CategoryHeatmap({ viewMode }: HeatmapProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapProps["data"]>([]);
  const monthDates = getMonthDates(viewMode);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const result = await getCategories();
    if (result) {
      setCategories(result.categories);
      const processedData = processDataForHeatmap(result.todos);
      setHeatmapData(processedData);
    }
  };

  return (
    <View className="space-y-6">
      {categories.map((category) => {
        const categoryData = heatmapData.filter(
          (d) => d.categoryId === category.id
        );
        const categoryColor = getColorValue(category.color);

        return (
          <View key={category.id} className="bg-white rounded-xl p-4">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <CustomText
                  size="sm"
                  weight="bold"
                  // className="opacity-80"
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
                    className="w-4 h-4 rounded-[3px] ml-1"
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
                ref={(scrollView) => {
                  scrollView?.scrollToEnd({ animated: false });
                }}
              >
                <View>
                  {/* 월 라벨 */}
                  <View className="flex-row mb-2 relative h-5">
                    {monthDates.monthLabels.map((monthLabel) => (
                      <View
                        key={monthLabel.label}
                        style={{
                          position: "absolute",
                          left: monthLabel.weekIndex * 20, // 각 주의 너비(18 + 2)
                        }}
                      >
                        <CustomText
                          size="xs"
                          weight="medium"
                          className="opacity-60"
                          style={{ color: categoryColor }}
                        >
                          {monthLabel.label}
                        </CustomText>
                      </View>
                    ))}
                  </View>

                  {/* 히트맵 그리드 */}
                  <View className="flex-row">
                    {monthDates.dates.map((week, weekIndex) => (
                      <View key={weekIndex} className="flex-col">
                        {week.map((dateStr, dayIndex) => {
                          // 빈 문자열이면 투명한 셀 렌더링
                          if (!dateStr) {
                            return (
                              <View
                                key={`empty-${weekIndex}-${dayIndex}`}
                                className="m-[1px] rounded-[3px]"
                                style={{
                                  width: 18,
                                  height: 18,
                                  backgroundColor: "transparent",
                                }}
                              />
                            );
                          }

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
              </ScrollView>
            )}
          </View>
        );
      })}
    </View>
  );
}
