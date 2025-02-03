import { View, ScrollView, Pressable } from "react-native";
import { useState, Suspense, useEffect } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import { ko } from "date-fns/locale";
import { CustomText } from "@/components/CustomText";
import { Character3D } from "@/components/Character3D";

import { WeeklyDatePicker } from "@/components/WeeklyDatePicker";

// @ts-ignore
import characterModel from "../../assets/models/animals/Rabby.fbx";
// @ts-ignore
import characterAnimation from "../../assets/models/animals/Anim_Rabby_Idle.fbx";
// @ts-ignore
import characterTexture from "../../assets/models/Textures/T_Rabby_01.png";

function MainScreen() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 컴포넌트 마운트 시 초기 날짜 설정
  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  return (
    <View className="flex-1 bg-white">
      {/* Character Section */}
      <View className="h-[400px] items-center justify-center bg-gray-50">
        <Character3D
          modelUrl={characterModel}
          animationUrl={characterAnimation}
          textureUrl={characterTexture}
        />
      </View>

      {/* Calendar Strip */}
      {selectedDate && (
        <WeeklyDatePicker
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          completedTasks={3}
          totalTasks={5}
        />
      )}

      {/* Todo Lists */}
      <ScrollView className="flex-1 px-4">
        <TodoCategory
          title="창업"
          items={[{ id: "1", text: "하루 4시간 이상 창업 일하기" }]}
        />
        <TodoCategory
          title="운동"
          items={[{ id: "2", text: "30분 이상 러닝하기" }]}
        />
        <TodoCategory
          title="자기개발"
          items={[{ id: "3", text: "CS공부하기" }]}
        />
      </ScrollView>
    </View>
  );
}

function WeeklyCalendar({
  selectedDate,
  onSelectDate,
}: {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}) {
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });

  return (
    <View className="flex-row justify-between px-4 py-3 bg-white">
      {[...Array(7)].map((_, i) => {
        const date = addDays(startDate, i);
        const dayName = format(date, "E", { locale: ko });
        const dayNumber = format(date, "d");
        const isSelected =
          format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");

        return (
          <Pressable
            key={i}
            onPress={() => onSelectDate(date)}
            className={`items-center w-12 py-2 rounded-full
              ${isSelected ? "bg-blue-500" : "bg-white"}`}
          >
            <CustomText
              size="sm"
              className={isSelected ? "text-white" : "text-gray-500"}
            >
              {dayName}
            </CustomText>
            <CustomText
              size="base"
              className={isSelected ? "text-white" : "text-black"}
            >
              {dayNumber}
            </CustomText>
          </Pressable>
        );
      })}
    </View>
  );
}

function TodoCategory({
  title,
  items,
}: {
  title: string;
  items: Array<{ id: string; text: string }>;
}) {
  return (
    <View className="mt-4">
      <View className="flex-row items-center justify-between mb-2">
        <CustomText size="lg">{title}</CustomText>
        <Pressable className="p-2">
          <CustomText size="lg">+</CustomText>
        </Pressable>
      </View>
      {items.map((item) => (
        <TodoItem key={item.id} item={item} />
      ))}
    </View>
  );
}

function TodoItem({ item }: { item: { id: string; text: string } }) {
  return (
    <View className="flex-row items-center py-2 px-4 bg-gray-50 rounded-lg mb-2">
      <Pressable className="w-6 h-6 border-2 border-blue-500 rounded-full mr-3" />
      <CustomText size="lg" weight="bold">
        {item.text}
      </CustomText>
    </View>
  );
}

export default MainScreen;
