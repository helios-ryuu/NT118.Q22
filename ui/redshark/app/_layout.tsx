// Root layout — load font Lexend, AuthContext provider + auth gate dieu huong
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import {
  Lexend_300Light,
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
  Lexend_800ExtraBold,
} from "@expo-google-fonts/lexend";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { colors, fonts } from "@/constants/theme";

// Giu splash screen cho den khi font load xong
SplashScreen.preventAutoHideAsync();

// Auth gate — chuyen huong dua tren trang thai dang nhap
function AuthGate() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Cho 1 frame de router mount xong truoc khi navigate
    const timer = setTimeout(() => {
      const inAuthGroup = segments[0] === "(auth)";

      if (!user && !inAuthGroup) {
        router.replace("/(auth)/email");
      } else if (user && inAuthGroup) {
        router.replace("/(tabs)");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [user, loading, segments, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerTransparent: false,
        headerStyle: { backgroundColor: "transparent" },
        headerBackground: () => <View style={{ flex: 1, backgroundColor: "transparent" }} />,
        headerTitleStyle: { fontFamily: fonts.semiBold, color: colors.text },
        headerBackTitle: "Quay lại",
        headerTintColor: colors.primary,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="issue/[id]" options={{ title: "Chi tiết vấn đề" }} />
      <Stack.Screen name="issue/[id]/applications" options={{ title: "Danh sách ứng cử viên" }} />
      <Stack.Screen name="issue/edit" options={{ title: "Chỉnh sửa vấn đề" }} />
      <Stack.Screen name="workspace/[sessionId]" options={{ title: "Workspace" }} />
      <Stack.Screen name="profile/edit" options={{ title: "Chỉnh sửa hồ sơ" }} />
      <Stack.Screen name="profile/settings" options={{ title: "Cài đặt" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Lexend_300Light,
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
    Lexend_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </ThemeProvider>
  );
}
