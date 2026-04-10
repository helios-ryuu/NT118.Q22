import { Tabs } from "expo-router";
import { colors, fonts, text } from "@/constants/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontSize: text.xs, fontFamily: fonts.medium },
        tabBarStyle: { borderTopColor: colors.border, backgroundColor: colors.surface },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Trang chủ" }} />
      <Tabs.Screen name="issues" options={{ title: "Ý tưởng" }} />
      <Tabs.Screen name="settings" options={{ title: "Cài đặt" }} />
    </Tabs>
  );
}
