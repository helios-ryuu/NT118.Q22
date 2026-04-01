// Danh sach thanh vien — hien avatar + ten + vai tro, owner co the kick
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Avatar } from "@/components/common/Avatar";
import { api } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { WorkspaceMember } from "@/types/workspace";
import { borderRadius, colors, fonts, fontSize, spacing } from "@/constants/theme";

const roleLabel: Record<string, string> = { author: "Chủ workspace", helper: "Thành viên" };

interface Props {
  sessionId: string;
  members: WorkspaceMember[];
  isOwner: boolean;
  readOnly: boolean;
  currentUserId: string;
  onMemberKicked: (userId: string) => void;
}

export function ParticipantList({ sessionId, members, isOwner, readOnly, currentUserId, onMemberKicked }: Props) {
  const handleKick = (member: WorkspaceMember) => {
    Alert.alert(
      "Kick thành viên",
      `Bạn có chắc muốn kick ${member.name} khỏi workspace?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Kick",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(endpoints.sessions.members.remove(sessionId, member.id));
              onMemberKicked(member.id);
            } catch {
              Alert.alert("Lỗi", "Không thể kick thành viên này");
            }
          },
        },
      ],
    );
  };

  const deduped = members.filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Thành viên ({deduped.length})</Text>
      {deduped.map((m) => (
        <View key={m.id} style={styles.row}>
          <Avatar uri={m.avatar} name={m.name} size={36} />
          <View style={styles.info}>
            <Text style={styles.name}>{m.name}</Text>
            <Text style={styles.role}>{roleLabel[m.role] ?? m.role}</Text>
          </View>
          {/* Kick button: owner co the kick bat ky ai tru chinh minh */}
          {isOwner && !readOnly && m.id !== currentUserId && (
            <Pressable style={styles.kickBtn} onPress={() => handleKick(m)}>
              <Text style={styles.kickText}>Kick</Text>
            </Pressable>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing[3] },
  title: { fontSize: fontSize.sm, fontFamily: fonts.semiBold, color: colors.text },
  row: { flexDirection: "row", alignItems: "center", gap: spacing[3] },
  info: { flex: 1 },
  name: { fontSize: fontSize.md, fontFamily: fonts.medium, color: colors.text },
  role: { fontSize: fontSize.xs, fontFamily: fonts.regular, color: colors.textSecondary },
  kickBtn: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.error,
  },
  kickText: { fontFamily: fonts.medium, fontSize: fontSize.xs, color: colors.error },
});
