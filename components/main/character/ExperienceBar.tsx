import { View } from "react-native";
import { CustomText } from "@/components/common/CustomText";
import { IcecreamIcon } from "@/assets/icons/IcecreamIcon";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

interface ExperienceBarProps {
  experience: number;
  maxExperience: number;
  level: number;
}

export function ExperienceBar({
  experience,
  maxExperience,
  level,
}: ExperienceBarProps) {
  const insets = useSafeAreaInsets();
  const progress = experience / maxExperience;

  const progressStyle = useAnimatedStyle(() => ({
    width: withSpring(`${Math.min(progress * 100, 100)}%`, {
      damping: 15,
      stiffness: 100,
    }),
  }));

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="absolute top-0 left-0 z-50 px-4"
    >
      <View className="flex-row items-center space-x-3 w-full">
        <View className="flex-row items-center min-w-[60px]">
          <IcecreamIcon />
          <CustomText className="ml-1 text-sm font-medium text-gray-600">
            Lv.{level}
          </CustomText>
        </View>
        <View className="w-36 h-3 bg-gray-100 rounded-full">
          <Animated.View
            style={[
              {
                height: "100%",
                borderRadius: 9999,
              },
              progressStyle,
            ]}
          >
            <LinearGradient
              colors={["#FF9ECD", "#FF7AB5"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 9999,
              }}
            />
          </Animated.View>
        </View>
        <View className="">
          <CustomText className="text-gray-500" size="sm">
            {experience}/{maxExperience}
          </CustomText>
        </View>
      </View>
    </View>
  );
}
