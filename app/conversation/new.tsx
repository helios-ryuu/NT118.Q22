// Tạo hoặc mở lại conversation DIRECT với một người dùng cụ thể
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createConversation, listMyConversations } from "@dataconnect/generated";
import { useAuth } from "@/hooks/useAuth";
import { queryKeys } from "@/services/queryKeys";
import { colors } from "@/constants/theme";

export default function NewConversationScreen() {
  const { recipientId, recipientName } = useLocalSearchParams<{ recipientId: string; recipientName: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const convsQuery = useQuery({
    queryKey: queryKeys.conversations.all,
    enabled: !!user,
    queryFn: async () => {
      const result = await listMyConversations({ myId: user!.id });
      return result.data.conversations;
    },
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createConversation({ participantIds: [user!.id, recipientId] }),
    onSuccess: data => {
      router.replace({ pathname: `/conversation/${data.data.conversation_insert.id}`, params: { recipientId, recipientName } });
    },
  });

  useEffect(() => {
    if (!convsQuery.data || !user) return;

    // Tìm conversation đã tồn tại với recipientId
    const existing = convsQuery.data.find(
      c => c.participantIds?.includes(recipientId) && c.participantIds?.includes(user.id)
    );

    if (existing) {
      router.replace({ pathname: `/conversation/${existing.id}`, params: { recipientId, recipientName } });
    } else {
      createMutation.mutate();
    }
  }, [convsQuery.data, user]);

  return (
    <View className="flex-1 justify-center items-center bg-background">
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}
