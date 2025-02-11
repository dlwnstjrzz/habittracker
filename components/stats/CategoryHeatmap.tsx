import { View } from "react-native";
import { CustomText } from "../common/CustomText";
import { getCategories } from "@/utils/storage";
import { useEffect, useState } from "react";

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

function getMonthDates() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = getDaysInMonth();

  return Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month, i + 1);
    return date.toISOString().split("T")[0];
  });
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
}: HeatmapProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const monthDates = getMonthDates();
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
              <CustomText size="base" weight="bold" className="text-gray-900">
                {category.title}
              </CustomText>
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
                    className="m-[2px] rounded-[4px]"
                    style={{
                      width: 22,
                      height: 22,
                      backgroundColor: categoryColor,
                      opacity,
                    }}
                  />
                );
              })}
            </View>
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
