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
import { CustomText } from "../common/CustomText";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Check,
  CircleCheck,
  CheckCheck,
} from "lucide-react-native";
import { useState, useEffect, useMemo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useSelectedDateStore } from "@/store/useSelectedDateStore";
import { getCompletedTodosCount } from "@/utils/storage";
import { FlowerIcon } from "@/assets/icons/FlowerIcon";
import { FlowerFillIcon } from "@/assets/icons/FlowerFillIcon";
import { useTodoStore } from "@/store/useTodoStore";

interface DateButtonProps {
  selected: boolean;
  isToday: boolean;
  hasStreak: boolean;
  completedCount: number;
  children: React.ReactNode;
}

interface WeeklyDatePickerProps {
  selectedDate: string; // YYYY-MM-DD 형식
  onDateSelect: (date: string) => void;
}

function DateButton({
  selected,
  isToday,
  hasStreak,
  completedCount,
  children,
}: DateButtonProps) {
  // 테두리 색상만 사용
  const strokeColor =
    completedCount > 0
      ? "#EC4899" // pink-500 (진한 분홍)
      : "#D1D5DB"; // gray-300 (연한 회색)

  return (
    <View className="items-center">
      <CustomText
        size="sm"
        weight="medium"
        className={selected ? "text-blue-500" : "text-gray-600"}
      >
        {children}
      </CustomText>
      <View className="my-1">
        <FlowerIcon size={24} color={strokeColor} />
      </View>
    </View>
  );
}

export default function WeeklyDatePicker() {
  const { selectedDate, setSelectedDate, completedCount } =
    useSelectedDateStore();
  const { todos } = useTodoStore();
  const [completedCountsByDate, setCompletedCountsByDate] = useState<
    Record<string, number>
  >({});

  // 현재 보고 있는 주의 시작일을 상태로 관리
  const currentWeekStart = useMemo(
    () => startOfWeek(new Date(selectedDate), { weekStartsOn: 1 }),
    [selectedDate]
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
    handleDateSelect(format(today, "yyyy-MM-dd"));
  };

  const progress = 0; // Assuming totalTasks is 0, so progress is 0
  const hasStreak = false; // Assuming hasStreak is false

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  // todos가 변경될 때마다 완료된 할일 개수 업데이트
  useEffect(() => {
    const fetchCompletedCounts = async () => {
      const counts: Record<string, number> = {};
      for (let i = 0; i < 7; i++) {
        const date = addDays(currentWeekStart, i);
        const dateStr = format(date, "yyyy-MM-dd");
        // storage에서 가져오는 대신 todos에서 직접 계산
        const todosForDate = todos[dateStr] || [];
        const completedCount = todosForDate.filter(
          (todo) => todo.completed
        ).length;
        counts[dateStr] = completedCount;
      }
      setCompletedCountsByDate(counts);
    };

    fetchCompletedCounts();
  }, [currentWeekStart, todos]);

  return (
    <View className="px-4 py-3">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center space-x-4">
          {/* 월/년과 완료/전체 */}
          <View className="flex-row items-center space-x-2">
            <CustomText size="base" weight="bold" className="text-gray-900">
              {format(currentWeekStart, "yyyy년 M월")}
            </CustomText>

            <View className="flex-row items-center px-1 py-0.5">
              <View className="flex-row items-center">
                <FlowerIcon size={18} color="gray" />
                {/* <View className="w-6 h-6 rounded-md mr-3 items-center justify-center bg-pink-300">
                  <Check size={16} color="white" strokeWidth={4} />
                </View> */}
                <CustomText
                  size="base"
                  weight="bold"
                  className="text-gray-700 ml-1"
                >
                  {completedCount}
                </CustomText>
              </View>
            </View>
          </View>
        </View>

        {/* 주간 이동 버튼과 오늘 버튼을 오른쪽으로 */}
        <View className="flex-row items-center space-x-2">
          {!isCurrentWeek && (
            <Pressable
              onPress={handleGoToToday}
              className="h-8 px-3 mr-2 rounded-full items-center justify-center bg-gray-100"
            >
              <CustomText size="sm" weight="bold" className="text-gray-700">
                이번 주
              </CustomText>
            </Pressable>
          )}
          <View className="flex-row items-center space-x-2 gap-x-2">
            <Pressable
              onPress={handlePrevWeek}
              className="w-8 h-8 rounded-xl items-center justify-center bg-gray-100"
            >
              <ChevronLeft size={24} color="#374151" strokeWidth={2.5} />
            </Pressable>
            <Pressable
              onPress={handleNextWeek}
              className="w-8 h-8 rounded-xl items-center justify-center bg-gray-100"
            >
              <ChevronRight size={24} color="#374151" strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* 요일 및 날짜 그리드 */}
      <View className="mt-2">
        {/* 요일 헤더 */}
        <XStack justifyContent="space-between" mb={3}>
          {["월", "화", "수", "목", "금", "토", "일"].map((day, i) => (
            <View key={day} style={{ width: 40, alignItems: "center" }}>
              <CustomText
                size="sm"
                weight="medium"
                className={
                  i === 5
                    ? "text-blue-500"
                    : i === 6
                    ? "text-red-500"
                    : "text-gray-600"
                }
              >
                {day}
              </CustomText>
            </View>
          ))}
        </XStack>

        {/* 날짜 그리드 */}
        <XStack justifyContent="space-between">
          {[...Array(7)].map((_, index) => {
            const date = addDays(currentWeekStart, index);
            const dateStr = format(date, "yyyy-MM-dd");
            const isSelected = dateStr === selectedDate;
            const isToday = format(new Date(), "yyyy-MM-dd") === dateStr;
            const dateCompletedCount = completedCountsByDate[dateStr] || 0;

            return (
              <Pressable
                key={dateStr}
                onPress={() => handleDateSelect(dateStr)}
                style={{ width: 40 }}
              >
                <DateButton
                  selected={isSelected}
                  isToday={isToday}
                  hasStreak={false}
                  completedCount={dateCompletedCount}
                >
                  {format(date, "d")}
                </DateButton>
              </Pressable>
            );
          })}
        </XStack>
      </View>
    </View>
  );
}
