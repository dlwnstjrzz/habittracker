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
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useSelectedDateStore } from "@/store/useSelectedDateStore";

interface DateButtonProps {
  selected: boolean;
  isToday: boolean;
  hasStreak: boolean;
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
  children,
}: DateButtonProps) {
  return (
    <View
      className={`w-10 h-10 rounded-xl items-center justify-center ${
        selected ? "bg-blue-500" : "bg-transparent"
      } ${isToday ? "border-2 border-blue-500" : ""}`}
    >
      {children}
    </View>
  );
}

const TaskProgress = ({
  completed: completedTasks,
  total: totalTasks,
}: {
  completed: number;
  total: number;
}) => (
  <View className="flex-row items-center bg-blue-50 px-3 py-1.5 rounded-full">
    <CustomText size="base" weight="bold" className="text-blue-600">
      {completedTasks}
    </CustomText>
    <CustomText size="base" className="text-blue-400 mx-0.5">
      /
    </CustomText>
    <CustomText size="base" weight="medium" className="text-blue-500">
      {totalTasks}
    </CustomText>
  </View>
);

export default function WeeklyDatePicker() {
  const { selectedDate, setSelectedDate } = useSelectedDateStore();

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    console.log(1111, selectedDate);
  };

  // 현재 보고 있는 주의 시작일을 상태로 관리
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(selectedDate), { weekStartsOn: 1 })
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

  return (
    <View className="px-4 py-3">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center space-x-4">
          {/* 월/년과 완료/전체 */}
          <View className="flex-row items-center space-x-2">
            <CustomText size="lg" weight="bold" className="text-gray-900">
              {format(currentWeekStart, "yyyy년 M월")}
            </CustomText>
            <View className="flex-row items-center px-2 py-0.5">
              <CustomText
                size="lg"
                weight="bold"
                className={progress === 1 ? "text-green-500" : "text-blue-500"}
              >
                {progress === 1 ? "Completed" : "In Progress"}
              </CustomText>
              <CustomText size="lg" className="text-gray-400 mx-0.5">
                /
              </CustomText>
              <CustomText size="lg" weight="medium" className="text-gray-500">
                100%
              </CustomText>
              {progress === 1 ? (
                <View className="ml-1 items-center justify-center">
                  <Check strokeWidth={3} size={18} color="#22C55E" />
                </View>
              ) : (
                <View className="w-1.5 h-1.5 rounded-full bg-blue-500 ml-1" />
              )}
            </View>
          </View>
        </View>

        {/* 주간 이동 버튼과 오늘 버튼을 오른쪽으로 */}
        <View className="flex-row items-center space-x-2">
          {!isCurrentWeek && (
            <Pressable
              onPress={handleGoToToday}
              className="h-9 px-3 mr-2 rounded-full items-center justify-center bg-gray-100"
            >
              <CustomText size="sm" weight="bold" className="text-gray-700">
                이번 주
              </CustomText>
            </Pressable>
          )}
          <View className="flex-row items-center space-x-2 gap-x-2">
            <Pressable
              onPress={handlePrevWeek}
              className="w-9 h-9 rounded-xl items-center justify-center bg-gray-100"
            >
              <ChevronLeft size={24} color="#374151" strokeWidth={2.5} />
            </Pressable>
            <Pressable
              onPress={handleNextWeek}
              className="w-9 h-9 rounded-xl items-center justify-center bg-gray-100"
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
          {[...Array(7)].map((_, i) => {
            const date = addDays(currentWeekStart, i);
            const dayNumber = format(date, "d");
            const isSelected = format(date, "yyyy-MM-dd") === selectedDate;
            const isToday =
              format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
            const isSaturday = i === 5;
            const isSunday = i === 6;

            return (
              <Pressable
                key={i}
                onPress={() => handleDateSelect(format(date, "yyyy-MM-dd"))}
              >
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
