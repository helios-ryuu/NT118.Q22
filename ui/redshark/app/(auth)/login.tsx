// Man hinh login toi gian — chuyen huong thang toi email
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { colors } from "@/constants/theme";

export default function LoginScreen() {
  useEffect(() => {
    router.replace("/(auth)/email");
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    </SafeAreaView>
  );
}
