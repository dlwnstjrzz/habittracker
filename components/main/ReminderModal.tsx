import { View, Pressable, ScrollView } from "react-native";
import { CustomText } from "../common/CustomText";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { forwardRef, useState } from "react";
import { CommonModal } from "../common/CommonModal";
import React from "react";

interface ReminderModalProps {
  onSubmit: (time: Date | null) => void;
  initialTime?: string | null;
}

const HOURS = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0")
);
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, "0")
);

export const ReminderModal = forwardRef<BottomSheetModal, ReminderModalProps>(
  ({ onSubmit, initialTime }, ref) => {
    const now = new Date();
    const [selectedHour, setSelectedHour] = useState(
      initialTime
        ? new Date(initialTime).getHours().toString().padStart(2, "0")
        : now.getHours().toString().padStart(2, "0")
    );
    const [selectedMinute, setSelectedMinute] = useState(
      initialTime
        ? new Date(initialTime).getMinutes().toString().padStart(2, "0")
        : now.getMinutes().toString().padStart(2, "0")
    );

    const handleSubmit = () => {
      // 현재 날짜의 로컬 시간으로 Date 객체 생성
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const date = now.getDate();

      // 선택된 시간으로 새로운 Date 객체 생성
      const scheduledTime = new Date(
        year,
        month,
        date,
        parseInt(selectedHour),
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

    return (
      <CommonModal ref={ref} title="알림 시간 설정" snapPoints={["50%"]}>
        {/* 시간 선택 */}
        <View className="py-6">
          <View className="flex-row justify-center items-center bg-gray-50 rounded-2xl p-4">
            {/* 시간 선택 */}
            <View className="flex-1">
              <ScrollView className="h-40" showsVerticalScrollIndicator={false}>
                {HOURS.map((hour) => (
                  <Pressable
                    key={hour}
                    className={`h-10 items-center justify-center rounded-xl mx-2 ${
                      selectedHour === hour ? "bg-pink-100" : ""
                    }`}
                    onPress={() => setSelectedHour(hour)}
                  >
                    <CustomText
                      size="xl"
                      weight={selectedHour === hour ? "bold" : "regular"}
                      className={
                        selectedHour === hour
                          ? "text-pink-500"
                          : "text-gray-400"
                      }
                    >
                      {hour}
                    </CustomText>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <CustomText size="xl" weight="bold" className="text-gray-400 mx-2">
              :
            </CustomText>

            {/* 분 선택 */}
            <View className="flex-1">
              <ScrollView className="h-40" showsVerticalScrollIndicator={false}>
                {MINUTES.map((minute) => (
                  <Pressable
                    key={minute}
                    className={`h-10 items-center justify-center rounded-xl mx-2 ${
                      selectedMinute === minute ? "bg-pink-100" : ""
                    }`}
                    onPress={() => setSelectedMinute(minute)}
                  >
                    <CustomText
                      size="xl"
                      weight={selectedMinute === minute ? "bold" : "regular"}
                      className={
                        selectedMinute === minute
                          ? "text-pink-500"
                          : "text-gray-400"
                      }
                    >
                      {minute}
                    </CustomText>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>

        {/* 확인 버튼 */}
        <View className="mt-auto">
          <Pressable
            className="w-full py-4 rounded-2xl bg-pink-400 items-center"
            onPress={handleSubmit}
          >
            <CustomText size="base" weight="bold" className="text-white">
              완료
            </CustomText>
          </Pressable>
        </View>
      </CommonModal>
    );
  }
);
