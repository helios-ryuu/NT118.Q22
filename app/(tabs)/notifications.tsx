import { useCallback } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  countUnreadNotifications,
  createNotification,
  getIdea,
  listMyNotifications,
  markNotificationRead,
  updateIdea,
} from "@dataconnect/generated";
import { Avatar } from "@/components/Avatar";
import { queryKeys } from "@/services/queryKeys";
import { useAuth } from "@/hooks/useAuth";
import type { Notification, NotificationType } from "@/types/notification";
import { colors } from "@/constants/theme";

const TYPE_LABEL: Record<NotificationType, string> = {
  ISSUE_CREATED: "đã tạo một vấn đề trong ý tưởng của bạn",
  COMMENT_ADDED: "đã bình luận vào ý tưởng của bạn",
  COLLAB_REQUEST: "muốn cộng tác với bạn",
  COLLAB_ACCEPTED: "đã chấp thuận yêu cầu cộng tác của bạn",
  MESSAGE_RECEIVED: "đã gửi tin nhắn cho bạn",
};

export default function NotificationsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const notifQuery = useQuery({
    queryKey: queryKeys.notifications.all,
    enabled: !!user,
    queryFn: async () => {
      const result = await listMyNotifications();
      return result.data.notifications.map<Notification>(n => ({
        id: n.id,
        type: n.type as NotificationType,
        targetId: n.targetId ?? null,
        metaData: (n.metaData as Record<string, unknown>) ?? null,
        isRead: n.isRead,
        createdAt: n.createdAt,
        actorId: n.actor.id,
        actorDisplayName: n.actor.displayName ?? null,
        actorAvatarUrl: n.actor.avatarUrl ?? null,
      }));
    },
  });

  const readMutation = useMutation({
    mutationFn: (id: string) => markNotificationRead({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount });
    },
  });

  const acceptCollabMutation = useMutation({
    mutationFn: async ({ ideaId, actorId }: { ideaId: string; actorId: string }) => {
      // Fetch current collaborators to avoid overwriting
      const ideaResult = await getIdea({ id: ideaId });
      const current: string[] = ideaResult.data.idea?.collaboratorIds ?? [];
      const merged = current.includes(actorId) ? current : [...current, actorId];
      await updateIdea({ id: ideaId, collaboratorIds: merged });
      await createNotification({
        recipientId: actorId,
        type: "COLLAB_ACCEPTED",
        targetId: ideaId,
        metaData: null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ideas.all });
    },
  });

  useFocusEffect(useCallback(() => {
    if (user) notifQuery.refetch();
  }, [notifQuery, user]));

  const handlePress = (notif: Notification) => {
    if (!notif.isRead) readMutation.mutate(notif.id);
    if (notif.targetId) {
      if (notif.type === "ISSUE_CREATED") router.push(`/issue/${notif.targetId}`);
      else if (notif.type === "COMMENT_ADDED" || notif.type === "COLLAB_REQUEST" || notif.type === "COLLAB_ACCEPTED")
        router.push(`/idea/${notif.targetId}`);
      else if (notif.type === "MESSAGE_RECEIVED")
        router.push({ pathname: `/conversation/${notif.targetId}`, params: { recipientId: notif.actorId, recipientName: notif.actorDisplayName ?? notif.actorId } });
    }
  };

  if (notifQuery.isLoading) {
    return <View className="flex-1 justify-center items-center"><ActivityIndicator color={colors.primary} /></View>;
  }

  const notifications = notifQuery.data ?? [];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <FlatList
        data={notifications}
        keyExtractor={n => n.id}
        refreshControl={<RefreshControl refreshing={notifQuery.isRefetching} onRefresh={() => notifQuery.refetch()} tintColor={colors.primary} />}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={<Text className="text-2xl font-lx-bold text-foreground mb-4">Thông báo</Text>}
        ListEmptyComponent={<Text className="text-center text-muted font-lx text-base mt-8">Chưa có thông báo nào.</Text>}
        renderItem={({ item }) => (
          <Pressable
            className={`flex-row gap-3 p-3 rounded-xl mb-2 ${item.isRead ? "bg-surface" : "bg-primary-light"}`}
            onPress={() => handlePress(item)}
          >
            <Avatar uri={item.actorAvatarUrl} name={item.actorDisplayName ?? item.actorId} size={40} />
            <View className="flex-1">
              <Text className="text-sm font-lx text-foreground" numberOfLines={2}>
                <Text className="font-lx-semi">{item.actorDisplayName ?? item.actorId}</Text>
                {" "}{TYPE_LABEL[item.type] ?? item.type}
              </Text>
              <Text className="text-xs font-lx text-muted mt-1">
                {new Date(item.createdAt).toLocaleString("vi-VN")}
              </Text>

              {/* Nút Accept/Reject cho COLLAB_REQUEST */}
              {item.type === "COLLAB_REQUEST" && !item.isRead && item.targetId && (
                <View className="flex-row gap-2 mt-2">
                  <Pressable
                    className="bg-primary px-3 py-1.5 rounded-lg"
                    onPress={() => {
                      acceptCollabMutation.mutate({ ideaId: item.targetId!, actorId: item.actorId });
                      readMutation.mutate(item.id);
                    }}
                  >
                    <Text className="text-white text-xs font-lx-semi">Chấp thuận</Text>
                  </Pressable>
                  <Pressable
                    className="border border-border px-3 py-1.5 rounded-lg"
                    onPress={() => readMutation.mutate(item.id)}
                  >
                    <Text className="text-foreground text-xs font-lx">Từ chối</Text>
                  </Pressable>
                </View>
              )}
            </View>
            {!item.isRead && <View className="w-2 h-2 bg-primary rounded-full mt-1.5" />}
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}
