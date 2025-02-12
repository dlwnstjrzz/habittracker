import { View, Pressable, ScrollView } from "react-native";
import { CustomText } from "../common/CustomText";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useState, useRef, useEffect } from "react";
import { Bell, X, Check } from "lucide-react-native";

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

    const renderBackdrop = useCallback(
      (props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
        />
      ),
      []
    );

    const handleSubmit = () => {
      const time = new Date();
      time.setHours(parseInt(selectedHour));
      time.setMinutes(parseInt(selectedMinute));
      time.setSeconds(0);
      time.setMilliseconds(0);
      onSubmit(time);
      (ref as any).current?.dismiss();
    };

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={["50%"]}
        index={0}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: "white" }}
      >
        <BottomSheetView className="flex-1 pt-2 pb-4">
          {/* 헤더 */}
          <View className="flex-row items-center justify-between px-6 pb-4">
            <CustomText size="lg" weight="bold" className="text-gray-900">
              알림 시간 설정
            </CustomText>
            <Pressable
              onPress={() => (ref as any).current?.dismiss()}
              className="w-8 h-8 items-center justify-center rounded-full bg-gray-50"
            >
              <X size={20} color="#6B7280" />
            </Pressable>
          </View>

          {/* 시간 선택 */}
          <View className="px-6 py-6">
            <View className="flex-row justify-center items-center bg-gray-50 rounded-2xl p-4">
              {/* 시간 선택 */}
              <View className="flex-1">
                <ScrollView
                  className="h-40"
                  showsVerticalScrollIndicator={false}
                >
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

              <CustomText
                size="xl"
                weight="bold"
                className="text-gray-400 mx-2"
              >
                :
              </CustomText>

              {/* 분 선택 */}
              <View className="flex-1">
                <ScrollView
                  className="h-40"
                  showsVerticalScrollIndicator={false}
                >
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
          <View className="px-6 mt-auto">
            <Pressable
              className="w-full py-4 rounded-2xl bg-pink-400 items-center"
              onPress={handleSubmit}
            >
              <CustomText size="base" weight="bold" className="text-white">
                완료
              </CustomText>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);
