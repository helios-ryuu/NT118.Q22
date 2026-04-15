import { useCallback } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { getUser, listMyConversations } from "@dataconnect/generated";
import { Avatar } from "@/components/Avatar";
import { queryKeys } from "@/services/queryKeys";
import { useAuth } from "@/hooks/useAuth";
import type { Conversation } from "@/types/conversation";
import { colors } from "@/constants/theme";

// Conversation item — lấy tên người còn lại trong chat DIRECT
function ConversationItem({ conv, myId }: { conv: Conversation; myId: string }) {
  const router = useRouter();
  const otherId = conv.participantIds.find(id => id !== myId) ?? "";

  const otherQuery = useQuery({
    queryKey: queryKeys.users.detail(otherId),
    enabled: !!otherId,
    queryFn: async () => {
      const result = await getUser({ id: otherId });
      return result.data.user ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });

  const other = otherQuery.data;

  return (
    <Pressable
      className="flex-row items-center gap-3 bg-surface rounded-xl p-3 mb-2"
      onPress={() => router.push({ pathname: `/conversation/${conv.id}`, params: { recipientId: otherId, recipientName: other?.displayName ?? other?.username } })}
    >
      <Avatar uri={other?.avatarUrl ?? null} name={other?.displayName ?? other?.username ?? "?"} size={44} />
      <View className="flex-1">
        <Text className="text-base font-lx-semi text-foreground">
          {other?.displayName ?? other?.username ?? "..."}
        </Text>
        <Text className="text-xs font-lx text-muted mt-0.5">
          {new Date(conv.lastMessageAt).toLocaleString("vi-VN")}
        </Text>
      </View>
    </Pressable>
  );
}

export default function MessagesScreen() {
  const { user } = useAuth();

  const convsQuery = useQuery({
    queryKey: queryKeys.conversations.all,
    enabled: !!user,
    queryFn: async () => {
      const result = await listMyConversations({ myId: user!.id });
      return result.data.conversations.map<Conversation>(c => ({
        id: c.id,
        participantIds: c.participantIds ?? [],
        lastMessageAt: c.lastMessageAt,
      }));
    },
  });

  useFocusEffect(useCallback(() => {
    if (user) convsQuery.refetch();
  }, [convsQuery, user]));

  if (convsQuery.isLoading) {
    return <View className="flex-1 justify-center items-center"><ActivityIndicator color={colors.primary} /></View>;
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <FlatList
        data={convsQuery.data ?? []}
        keyExtractor={c => c.id}
        refreshControl={<RefreshControl refreshing={convsQuery.isRefetching} onRefresh={() => convsQuery.refetch()} tintColor={colors.primary} />}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={<Text className="text-2xl font-lx-bold text-foreground mb-4">Tin nhắn</Text>}
        ListEmptyComponent={<Text className="text-center text-muted font-lx text-base mt-8">Chưa có cuộc trò chuyện nào.</Text>}
        renderItem={({ item }) => <ConversationItem conv={item} myId={user?.id ?? ""} />}
      />
    </SafeAreaView>
  );
}
