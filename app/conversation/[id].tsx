import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNotification,
  deleteMessage,
  listMessagesByConversation,
  sendMessage,
} from "@dataconnect/generated";
import { Avatar } from "@/components/Avatar";
import { queryKeys } from "@/services/queryKeys";
import { useAuth } from "@/hooks/useAuth";
import type { Message } from "@/types/conversation";
import { colors } from "@/constants/theme";

export default function ConversationScreen() {
  const { id, recipientId, recipientName } = useLocalSearchParams<{
    id: string;
    recipientId?: string;
    recipientName?: string;
  }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const [text, setText] = useState("");
  const listRef = useRef<FlatList>(null);
  const focused = useRef(false);

  // Dynamic header title
  useEffect(() => {
    if (recipientName) {
      navigation.setOptions({ title: recipientName });
    }
  }, [recipientName, navigation]);

  useFocusEffect(useCallback(() => {
    focused.current = true;
    return () => { focused.current = false; };
  }, []));

  const messagesQuery = useQuery({
    queryKey: queryKeys.conversations.messages(id ?? ""),
    enabled: !!id,
    refetchInterval: () => focused.current ? 5000 : false,
    queryFn: async () => {
      const result = await listMessagesByConversation({ conversationId: id as string });
      return result.data.messages.map<Message>(m => ({
        id: m.id,
        conversationId: id as string,
        content: m.content,
        senderId: m.sender.id,
        senderDisplayName: m.sender.displayName ?? null,
        senderAvatarUrl: m.sender.avatarUrl ?? null,
        createdAt: m.createdAt,
      }));
    },
  });

  const sendMutation = useMutation({
    mutationFn: async () => {
      await sendMessage({ conversationId: id as string, content: text.trim() });
      // Gửi notification MESSAGE_RECEIVED cho người nhận
      if (recipientId && user) {
        await createNotification({
          recipientId,
          type: "MESSAGE_RECEIVED",
          targetId: id as string,
          metaData: null,
        });
      }
    },
    onSuccess: () => {
      setText("");
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.messages(id as string) });
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all });
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (messageId: string) => deleteMessage({ id: messageId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.messages(id as string) });
    },
  });

  const handleLongPress = (item: Message) => {
    if (item.senderId !== user?.id) return;
    Alert.alert("Xóa tin nhắn", "Bạn có chắc muốn xóa tin nhắn này?", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => deleteMutation.mutate(item.id),
      },
    ]);
  };

  // Refetch on focus
  useFocusEffect(useCallback(() => {
    if (id) messagesQuery.refetch();
  }, [messagesQuery, id]));

  // Scroll xuống cuối khi messages load xong
  useEffect(() => {
    if (messagesQuery.data?.length) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 50);
    }
  }, [messagesQuery.data]);

  const messages = messagesQuery.data ?? [];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={88}
      >
        {messagesQuery.isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={m => m.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
            ListEmptyComponent={<Text className="text-center text-muted font-lx text-sm mt-8">Hãy bắt đầu cuộc trò chuyện!</Text>}
            renderItem={({ item }) => {
              const isMe = item.senderId === user?.id;
              return (
                <Pressable
                  onLongPress={() => handleLongPress(item)}
                  delayLongPress={400}
                >
                  <View className={`flex-row gap-2 mb-3 ${isMe ? "justify-end" : "justify-start"}`}>
                    {!isMe && (
                      <Avatar uri={item.senderAvatarUrl} name={item.senderDisplayName ?? item.senderId} size={28} />
                    )}
                    <View className={`max-w-[75%] px-3 py-2 rounded-2xl ${isMe ? "bg-primary" : "bg-surface border border-border"}`}>
                      <Text className={`text-sm font-lx ${isMe ? "text-white" : "text-foreground"}`}>
                        {item.content}
                      </Text>
                      <Text className={`text-xs font-lx mt-1 ${isMe ? "text-white/70" : "text-muted"}`}>
                        {new Date(item.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            }}
          />
        )}

        {/* Input gửi tin */}
        <View className="flex-row gap-2 items-end px-4 py-3 border-t border-border bg-background">
          <TextInput
            className="flex-1 border border-border rounded-2xl px-4 py-3 text-sm font-lx text-foreground bg-surface"
            placeholder="Nhập tin nhắn..."
            placeholderTextColor={colors.textSecondary}
            value={text}
            onChangeText={setText}
            multiline
            maxLength={1000}
          />
          <Pressable
            className={`bg-primary rounded-2xl px-4 py-3 ${(!text.trim() || sendMutation.isPending) ? "opacity-40" : ""}`}
            onPress={() => sendMutation.mutate()}
            disabled={!text.trim() || sendMutation.isPending}
          >
            <Text className="text-white text-sm font-lx-semi">Gửi</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
