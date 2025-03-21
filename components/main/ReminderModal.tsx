import { View, Pressable, ScrollView, StyleSheet } from "react-native";
import { CustomText } from "../common/CustomText";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { forwardRef, useState, useEffect } from "react";
import { CommonModal } from "../common/CommonModal";
import React from "react";

interface ReminderModalProps {
  onSubmit: (time: Date | null) => void;
  initialTime?: string | null;
}

const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const MINUTES = [
  "00",
  "05",
  "10",
  "15",
  "20",
  "25",
  "30",
  "35",
  "40",
  "45",
  "50",
  "55",
];

export const ReminderModal = forwardRef<BottomSheetModal, ReminderModalProps>(
  ({ onSubmit, initialTime }, ref) => {
    const now = new Date();
    const initialDate = initialTime ? new Date(initialTime) : now;

    const [selectedHour, setSelectedHour] = useState(
      (initialDate.getHours() > 12
        ? initialDate.getHours() - 12
        : initialDate.getHours() === 0
        ? 12
        : initialDate.getHours()
      ).toString()
    );
    const [selectedMinute, setSelectedMinute] = useState(
      initialDate.getMinutes().toString().padStart(2, "0")
    );
    const [period, setPeriod] = useState<"오전" | "오후">(
      initialDate.getHours() >= 12 ? "오후" : "오전"
    );

    // 분 선택을 5분 단위로 반올림
    useEffect(() => {
      const minute = parseInt(selectedMinute);
      if (!MINUTES.includes(selectedMinute)) {
        const roundedMinute = Math.round(minute / 5) * 5;
        setSelectedMinute(
          roundedMinute === 60
            ? "00"
            : roundedMinute.toString().padStart(2, "0")
        );
      }
    }, []);

    const handleSubmit = () => {
      if (!selectedHour || !selectedMinute) return;

      // 현재 날짜의 로컬 시간으로 Date 객체 생성
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const date = now.getDate();

      // 시간 계산 (12시간제에서 24시간제로 변환)
      let hour = parseInt(selectedHour);
      if (period === "오후" && hour < 12) {
        hour += 12;
      } else if (period === "오전" && hour === 12) {
        hour = 0;
      }

      // 선택된 시간으로 새로운 Date 객체 생성
      const scheduledTime = new Date(
        year,
        month,
        date,
        hour,
        parseInt(selectedMinute),
        0
      );

      // 만약 선택한 시간이 현재 시간보다 이전이면 다음 날로 설정
      if (scheduledTime < now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      console.log("Local time:", scheduledTime.toLocaleString());
      onSubmit(scheduledTime);
      if (ref && typeof ref !== "function" && ref.current) {
        ref.current.dismiss();
      }
    };

    const handleDeleteReminder = () => {
      onSubmit(null);
      if (ref && typeof ref !== "function" && ref.current) {
        ref.current.dismiss();
      }
    };

    // 버튼 행 계산 (6개씩 나누기)
    const hourRows = [];
    const minuteRows = [];

    for (let i = 0; i < HOURS.length; i += 6) {
      hourRows.push(HOURS.slice(i, i + 6));
    }

    for (let i = 0; i < MINUTES.length; i += 6) {
      minuteRows.push(MINUTES.slice(i, i + 6));
    }

    return (
      <CommonModal ref={ref} title="시간 알림" snapPoints={["80%"]}>
        <View className="py-6">
          {/* 오전/오후 선택 */}
          <View className="px-4 mb-6">
            <View className="flex-row bg-gray-100 p-1 rounded-full">
              <Pressable
                className={`flex-1 py-2 rounded-full ${
                  period === "오전" ? "bg-pink-400" : ""
                }`}
                onPress={() => setPeriod("오전")}
              >
                <CustomText
                  size="base"
                  weight="medium"
                  className={`text-center ${
                    period === "오전" ? "text-white" : "text-black"
                  }`}
                >
                  오전
                </CustomText>
              </Pressable>
              <Pressable
                className={`flex-1 py-2 rounded-full ${
                  period === "오후" ? "bg-pink-400" : ""
                }`}
                onPress={() => setPeriod("오후")}
              >
                <CustomText
                  size="base"
                  weight="medium"
                  className={`text-center ${
                    period === "오후" ? "text-white" : "text-black"
                  }`}
                >
                  오후
                </CustomText>
              </Pressable>
            </View>
          </View>

          {/* 시 */}
          <View className="mb-6 px-2">
            <CustomText
              size="base"
              weight="medium"
              className="text-gray-600 mb-3 ml-1"
            >
              시
            </CustomText>
            {hourRows.map((hourRow, rowIndex) => (
              <View
                key={`hour-row-${rowIndex}`}
                className="flex-row justify-between mb-2"
              >
                {hourRow.map((hour) => (
                  <Pressable
                    key={hour}
                    className={`w-[15.5%] aspect-square items-center justify-center rounded-full ${
                      selectedHour === hour ? "bg-pink-400" : "bg-gray-100"
                    }`}
                    onPress={() => setSelectedHour(hour)}
                  >
                    <CustomText
                      size="sm"
                      weight="medium"
                      className={
                        selectedHour === hour ? "text-white" : "text-black"
                      }
                    >
                      {hour}
                    </CustomText>
                  </Pressable>
                ))}
              </View>
            ))}
          </View>

          {/* 분 */}
          <View className="mb-6 px-2">
            <CustomText
              size="base"
              weight="medium"
              className="text-gray-600 mb-3 ml-1"
            >
              분
            </CustomText>
            {minuteRows.map((minuteRow, rowIndex) => (
              <View
                key={`minute-row-${rowIndex}`}
                className="flex-row justify-between mb-2"
              >
                {minuteRow.map((minute) => (
                  <Pressable
                    key={minute}
                    className={`w-[15.5%] aspect-square items-center justify-center rounded-full ${
                      selectedMinute === minute ? "bg-pink-400" : "bg-gray-100"
                    }`}
                    onPress={() => setSelectedMinute(minute)}
                  >
                    <CustomText
                      size="sm"
                      weight="medium"
                      className={
                        selectedMinute === minute ? "text-white" : "text-black"
                      }
                    >
                      {minute}
                    </CustomText>
                  </Pressable>
                ))}
              </View>
            ))}
          </View>

          {/* 버튼 그룹 */}
          <View className="mt-8 px-6">
            {initialTime ? (
              <View className="flex-row justify-between">
                <Pressable
                  className="w-[48%] py-3 rounded-xl bg-gray-100  items-center"
                  onPress={handleDeleteReminder}
                >
                  <CustomText
                    size="base"
                    weight="medium"
                    className="text-red-500"
                  >
                    삭제
                  </CustomText>
                </Pressable>
                <Pressable
                  className={`w-[48%] py-3 rounded-xl bg-pink-400 items-center ${
                    !selectedHour || !selectedMinute ? "opacity-50" : ""
                  }`}
                  onPress={handleSubmit}
                  disabled={!selectedHour || !selectedMinute}
                >
                  <CustomText
                    size="base"
                    weight="medium"
                    className="text-white"
                  >
                    완료
                  </CustomText>
                </Pressable>
              </View>
            ) : (
              <Pressable
                className={`w-full py-3 rounded-full bg-pink-400 items-center ${
                  !selectedHour || !selectedMinute ? "opacity-50" : ""
                }`}
                onPress={handleSubmit}
                disabled={!selectedHour || !selectedMinute}
              >
                <CustomText size="base" weight="medium" className="text-white">
                  완료
                </CustomText>
              </Pressable>
            )}
          </View>
        </View>
      </CommonModal>
    );
  }
);
