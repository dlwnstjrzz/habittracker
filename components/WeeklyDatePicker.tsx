// @ts-nocheck
import { View, Pressable } from "react-native";
import {
  format,
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  isSameWeek,
} from "date-fns";
import { ko } from "date-fns/locale";
import { Stack, XStack, styled } from "tamagui";
import { CustomText } from "./CustomText";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react-native";
import { useState } from "react";

interface WeeklyDatePickerProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  completedTasks?: number;
  totalTasks?: number;
}

const DateButton = styled(Stack, {
  width: 40,
  height: 40,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
  variants: {
    selected: {
      true: {
        backgroundColor: "#3B82F6",
        backgroundImage: "linear-gradient(135deg, #5A9FFF 0%, #3B82F6 100%)",
        shadowColor: "#3B82F6",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
      },
      false: {
        backgroundColor: "transparent",
      },
    },
    isToday: {
      true: {
        borderWidth: 1.5,
        borderColor: "#3B82F6",
      },
    },
    hasStreak: {
      true: {
        after: {
          content: "🔥",
          position: "absolute",
          top: -8,
          fontSize: 10,
        },
      },
    },
  } as const,
});

const TaskProgress = ({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) => (
  <View className="flex-row items-center bg-blue-50 px-3 py-1.5 rounded-full">
    <CustomText size="base" weight="bold" className="text-blue-600">
      {completed}
    </CustomText>
    <CustomText size="base" className="text-blue-400 mx-0.5">
      /
    </CustomText>
    <CustomText size="base" weight="medium" className="text-blue-500">
      {total}
    </CustomText>
  </View>
);

export function WeeklyDatePicker({
  selectedDate,
  onSelectDate,
  completedTasks = 0,
  totalTasks = 0,
}: WeeklyDatePickerProps) {
  // 현재 보고 있는 주의 시작일을 상태로 관리
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(selectedDate, { weekStartsOn: 1 })
  );

  // 현재 보고 있는 주가 이번 주인지 확인
  const isCurrentWeek = isSameWeek(currentWeekStart, new Date(), {
    weekStartsOn: 1,
  });

  // 이전 주로 이동
  const handlePrevWeek = () => {
    setCurrentWeekStart((prev) => subWeeks(prev, 1));
  };

  // 다음 주로 이동
  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => addWeeks(prev, 1));
  };

  // 오늘로 이동하는 함수
  const handleGoToToday = () => {
    const today = new Date();
    setCurrentWeekStart(startOfWeek(today, { weekStartsOn: 1 }));
    onSelectDate(today);
  };

  const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;
  const hasStreak = completedTasks >= 3; // 예시: 3일 이상 연속 달성 시 스트릭

  return (
    <View className="px-4 py-3">
      {/* 헤더 영역 수정 */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center space-x-4">
          {/* 월/년 표시 수정 */}
          <View className="flex-row items-baseline space-x-2">
            <CustomText size="2xl" weight="bold" className="text-gray-900">
              {format(currentWeekStart, "M")}
              <CustomText size="lg" weight="medium" className="text-gray-600">
                월
              </CustomText>
            </CustomText>
            <CustomText size="sm" className="text-gray-400">
              {format(currentWeekStart, "yyyy")}
            </CustomText>
          </View>

          {/* 주간 이동 버튼 수정 */}
          <View className="flex-row items-center bg-gray-50 rounded-full">
            <Pressable
              onPress={handlePrevWeek}
              className="w-8 h-8 rounded-full items-center justify-center hover:bg-gray-100"
            >
              <ChevronLeft size={20} color="#4B5563" />
            </Pressable>
            <View className="w-[1px] h-4 bg-gray-200" />
            <Pressable
              onPress={handleNextWeek}
              className="w-8 h-8 rounded-full items-center justify-center hover:bg-gray-100"
            >
              <ChevronRight size={20} color="#4B5563" />
            </Pressable>
          </View>
        </View>

        <View className="flex-row items-center space-x-3">
          {!isCurrentWeek && (
            <Pressable
              onPress={handleGoToToday}
              className="h-8 px-3 rounded-full flex-row items-center bg-blue-50"
            >
              <Calendar size={14} color="#3B82F6" />
              <CustomText
                size="sm"
                className="text-blue-600 ml-1.5 font-medium"
              >
                오늘
              </CustomText>
            </Pressable>
          )}
          <TaskProgress completed={completedTasks} total={totalTasks} />
        </View>
      </View>

      {/* 요일 및 날짜 그리드 */}
      <View>
        {/* 요일 헤더 */}
        <XStack justifyContent="space-between" mb={3}>
          {["월", "화", "수", "목", "금", "토", "일"].map((day, i) => (
            <View key={day} style={{ width: 40, alignItems: "center" }}>
              <CustomText
                size="xs"
                weight="medium"
                className={
                  i === 5
                    ? "text-blue-500"
                    : i === 6
                    ? "text-red-500"
                    : "text-gray-400"
                }
              >
                {day}
              </CustomText>
            </View>
          ))}
        </XStack>

        {/* 날짜 그리드 */}
        <XStack justifyContent="space-between">
          {[...Array(7)].map((_, i) => {
            const date = addDays(currentWeekStart, i);
            const dayNumber = format(date, "d");
            const isSelected =
              format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
            const isToday =
              format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
            const isSaturday = i === 5;
            const isSunday = i === 6;

            return (
              <Pressable key={i} onPress={() => onSelectDate(date)}>
                <DateButton
                  selected={isSelected}
                  isToday={isToday && !isSelected}
                  hasStreak={hasStreak && isSelected}
                >
                  <CustomText
                    size="base"
                    weight={isSelected || isToday ? "bold" : "medium"}
                    className={
                      isSelected
                        ? "text-white"
                        : isToday
                        ? "text-blue-600"
                        : isSunday
                        ? "text-red-500"
                        : isSaturday
                        ? "text-blue-500"
                        : "text-gray-700"
                    }
                  >
                    {dayNumber}
                  </CustomText>
                </DateButton>
              </Pressable>
            );
          })}
        </XStack>
      </View>
    </View>
  );
}
