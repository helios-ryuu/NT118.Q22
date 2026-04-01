// Bottom tab navigator — tab MVP toi gian
import { Tabs } from "expo-router";
import { colors, fonts, fontSize } from "@/constants/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontSize: fontSize.xs, fontFamily: fonts.medium },
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Trang chủ", tabBarIcon: () => null }}
      />
      <Tabs.Screen
        name="issues"
        options={{ title: "Vấn đề", tabBarIcon: () => null }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: "Cài đặt", tabBarIcon: () => null }}
      />
    </Tabs>
  );
}
