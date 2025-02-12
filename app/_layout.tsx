import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { useColorScheme } from "@/hooks/useColorScheme";
import { createTamagui, TamaguiProvider } from "tamagui";
import { defaultConfig } from "@tamagui/config/v4";
import { Platform, LogBox } from "react-native";
import { GLView } from "expo-gl";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
const config = createTamagui(defaultConfig);
import "../global.css";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Android WebGL 설정
if (Platform.OS === "android") {
  LogBox.ignoreLogs(["expo-gl-cpp"]);
  // @ts-ignore
  global.WebGL2RenderingContext = GLView.createContextAsync;
}

// 알림 기본 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    "SpoqaHanSansNeo-Thin": require("../assets/fonts/SpoqaHanSansNeo-Thin.ttf"),
    "SpoqaHanSansNeo-Light": require("../assets/fonts/SpoqaHanSansNeo-Light.ttf"),
    "SpoqaHanSansNeo-Regular": require("../assets/fonts/SpoqaHanSansNeo-Regular.ttf"),
    "SpoqaHanSansNeo-Medium": require("../assets/fonts/SpoqaHanSansNeo-Medium.ttf"),
    "SpoqaHanSansNeo-Bold": require("../assets/fonts/SpoqaHanSansNeo-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={config}>
        <BottomSheetModalProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </BottomSheetModalProvider>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}
