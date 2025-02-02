import { Tabs } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GalleryHorizontalEnd, BarChart3, User } from "lucide-react-native";
import { CustomText } from "@/components/CustomText";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#999",
        headerShown: false,
        tabBarStyle: {
          height: 65 + insets.bottom,
          backgroundColor: "white",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          paddingTop: 0,
          paddingBottom: 8 + insets.bottom,
        },
        tabBarItemStyle: {
          paddingVertical: 0,
        },
        tabBarLabel: ({ children, color }) => (
          <CustomText
            size="xs"
            weight="medium"
            className="mt-0.5"
            style={{ color }}
          >
            {children}
          </CustomText>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "피드",
          tabBarIcon: ({ color, focused }) => (
            // @ts-ignore
            <GalleryHorizontalEnd
              size={24}
              color={color}
              fill={color}
              strokeWidth={2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "통계",
          tabBarIcon: ({ color, focused }) => (
            // @ts-ignore
            <BarChart3
              size={24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
          title: "My",
          tabBarIcon: ({ color, focused }) => (
            // @ts-ignore
            <User
              size={24}
              color={color}
              fill={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
    </Tabs>
  );
}
