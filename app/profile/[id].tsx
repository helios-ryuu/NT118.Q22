import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@dataconnect/generated";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { queryKeys } from "@/services/queryKeys";
import { useAuth } from "@/hooks/useAuth";
import { colors } from "@/constants/theme";

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user: me } = useAuth();

  const userQuery = useQuery({
    queryKey: queryKeys.users.detail(id ?? ""),
    enabled: !!id,
    queryFn: async () => {
      const result = await getUser({ id: id as string });
      return result.data.user ?? null;
    },
  });

  if (userQuery.isLoading) {
    return <View className="flex-1 justify-center items-center bg-background"><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  const profile = userQuery.data;
  if (!profile) {
    return <View className="flex-1 justify-center items-center bg-background"><Text className="text-base font-lx text-muted">Không tìm thấy người dùng</Text></View>;
  }

  const isMe = me?.id === profile.id;

  const handleMessage = () => {
    // Điều hướng sang màn hình messages, tạo conversation nếu chưa có
    router.push({ pathname: "/conversation/new", params: { recipientId: profile.id, recipientName: profile.displayName ?? profile.username } });
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
      <View className="items-center mb-8">
        <Avatar uri={profile.avatarUrl} name={profile.displayName ?? profile.username} size={88} />
        <Text className="text-xl font-lx-bold text-foreground mt-3">{profile.displayName ?? profile.username}</Text>
        <Text className="text-sm font-lx text-muted mt-1">@{profile.username}</Text>
      </View>

      {!isMe && (
        <Button title="Nhắn tin" onPress={handleMessage} />
      )}

      {isMe && (
        <Button title="Chỉnh sửa hồ sơ" variant="outline" onPress={() => router.push("/profile/edit")} />
      )}
    </ScrollView>
  );
}
