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
import "react-native-reanimated";
import "../global.css";
import { useColorScheme } from "@/hooks/useColorScheme";
import { createTamagui, TamaguiProvider, View } from "tamagui";
import { defaultConfig } from "@tamagui/config/v4";
import { Platform, LogBox } from "react-native";
import { GLView } from "expo-gl";

const config = createTamagui(defaultConfig);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Android WebGL 설정
if (Platform.OS === "android") {
  LogBox.ignoreLogs(["expo-gl-cpp"]);
  // @ts-ignore
  global.WebGL2RenderingContext = GLView.createContextAsync;
}

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
    <TamaguiProvider config={config}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </TamaguiProvider>
  );
}
