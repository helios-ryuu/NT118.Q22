// Khu vuc chat — polling tin nhan, hien thi va gui tin
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { MessageBubble } from "@/components/workspace/MessageBubble";
import type { Message } from "@/types/workspace";
import { borderRadius, colors, fonts, fontSize, spacing } from "@/constants/theme";

interface Props {
  channelId: string;
  channelName: string;
  readOnly: boolean;
}

export function ChatArea({ channelId, channelName, readOnly }: Props) {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const listRef = useRef<FlatList>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const data = await api.get<Message[]>(`${endpoints.channels.messages(channelId)}?page=0&size=50`);
      setMessages(data);
    } catch (e) {
      console.warn("fetchMessages failed:", e);
    } finally {
      setLoading(false);
    }
  }, [channelId]);

  // Load ngay khi kenh thay doi
  useEffect(() => {
    setLoading(true);
    setMessages([]);
    fetchMessages();
  }, [fetchMessages]);

  // Polling moi 5s
  useEffect(() => {
    const id = setInterval(fetchMessages, 5000);
    return () => clearInterval(id);
  }, [fetchMessages]);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      await api.post(endpoints.channels.messages(channelId), { content: text });
      setInput("");
      await fetchMessages();
    } catch {
      Alert.alert("Lỗi", "Không thể gửi tin nhắn. Vui lòng thử lại.");
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      {/* Channel header */}
      <View style={styles.channelHeader}>
        <Text style={styles.channelName}># {channelName}</Text>
      </View>

      {/* Tin nhan */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>Chưa có tin nhắn. Hãy bắt đầu thảo luận!</Text>
            </View>
          }
        />
      )}

      {/* Input bar */}
      <View style={[styles.inputBar, { paddingBottom: keyboardVisible ? spacing[2] : Math.max(insets.bottom, spacing[2]) }]}> 
        {readOnly ? (
          <Text style={styles.readOnlyText}>Workspace đã đóng, bạn chỉ có thể đọc nội dung.</Text>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder={`Nhắn #${channelName}`}
              placeholderTextColor={colors.textSecondary}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={2000}
              returnKeyType="send"
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
            />
            <Pressable
              style={[styles.sendBtn, (!input.trim() || sending) && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!input.trim() || sending}
            >
              <Text style={styles.sendIcon}>↑</Text>
            </Pressable>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: colors.background },
  channelHeader: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  channelName: { fontFamily: fonts.semiBold, fontSize: fontSize.md, color: colors.text },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: spacing[5] },
  listContent: { paddingVertical: spacing[2] },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  readOnlyText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.text,
    maxHeight: 100,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { backgroundColor: colors.border },
  sendIcon: { color: "#fff", fontSize: fontSize.md, fontFamily: fonts.bold },
});
