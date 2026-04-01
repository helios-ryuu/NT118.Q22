// Bubble hien thi mot tin nhan trong kenh thao luan
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "@/components/common/Avatar";
import type { Message } from "@/types/workspace";
import { colors, fonts, fontSize, spacing } from "@/constants/theme";

interface Props {
  message: Message;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

export function MessageBubble({ message }: Props) {
  return (
    <View style={styles.row}>
      <Avatar uri={message.authorAvatar} name={message.authorName} size={32} />
      <View style={styles.body}>
        <View style={styles.meta}>
          <Text style={styles.name}>{message.authorName}</Text>
          <Text style={styles.time}>{formatTime(message.createdAt)}</Text>
        </View>
        <Text style={styles.content}>{message.content}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  body: { flex: 1 },
  meta: { flexDirection: "row", alignItems: "baseline", gap: spacing[2], marginBottom: 2 },
  name: { fontFamily: fonts.semiBold, fontSize: fontSize.sm, color: colors.text },
  time: { fontFamily: fonts.regular, fontSize: fontSize.xs, color: colors.textSecondary },
  content: { fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.text, lineHeight: 20 },
});
