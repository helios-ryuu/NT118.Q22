// Auth stack — header voi nut back cho cac man hinh sau onboarding
import { Stack } from "expo-router";
import { colors, fonts } from "@/constants/theme";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerTransparent: false,
        headerStyle: { backgroundColor: "transparent" },
        headerBackground: () => null,
        headerTitleStyle: { fontFamily: fonts.semiBold, color: colors.text },
        headerBackTitle: "Quay lại",
        headerTintColor: colors.primary,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="email" options={{ title: "", headerShown: false }} />
      <Stack.Screen name="password" options={{ title: "Đăng nhập" }} />
      <Stack.Screen name="register" options={{ title: "Tạo tài khoản" }} />
    </Stack>
  );
}
