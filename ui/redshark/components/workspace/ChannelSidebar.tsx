// Sidebar danh sach kenh — collapsible, owner co the tao kenh moi
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { Channel } from "@/types/workspace";
import { borderRadius, colors, fonts, fontSize, spacing } from "@/constants/theme";

interface Props {
  sessionId: string;
  channels: Channel[];
  activeChannelId: string | null;
  isOwner: boolean;
  readOnly: boolean;
  onSelectChannel: (channel: Channel) => void;
  onChannelCreated: (channel: Channel) => void;
}

export function ChannelSidebar({
  sessionId,
  channels,
  activeChannelId,
  isOwner,
  readOnly,
  onSelectChannel,
  onChannelCreated,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;
    try {
      const ch = await api.post<Channel>(endpoints.sessions.channels(sessionId), { name });
      onChannelCreated(ch);
      setNewName("");
      setCreating(false);
    } catch {
      Alert.alert("Lỗi", "Không thể tạo kênh");
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <Pressable style={styles.header} onPress={() => setCollapsed((c) => !c)}>
        <Text style={styles.headerText}>Kênh</Text>
        <Text style={styles.chevron}>{collapsed ? "›" : "⌄"}</Text>
      </Pressable>

      {!collapsed && (
        <>
          {channels.map((ch) => (
            <Pressable
              key={ch.id}
              style={[styles.item, ch.id === activeChannelId && styles.itemActive]}
              onPress={() => onSelectChannel(ch)}
            >
              <Text style={[styles.itemText, ch.id === activeChannelId && styles.itemTextActive]}>
                # {ch.name}
              </Text>
            </Pressable>
          ))}

          {isOwner && !readOnly && !creating && (
            <Pressable style={styles.addBtn} onPress={() => setCreating(true)}>
              <Text style={styles.addBtnText}>+ Kênh mới</Text>
            </Pressable>
          )}

          {creating && !readOnly && (
            <View style={styles.createRow}>
              <TextInput
                style={styles.input}
                placeholder="tên-kênh"
                placeholderTextColor={colors.textSecondary}
                value={newName}
                onChangeText={setNewName}
                autoFocus
                onSubmitEditing={handleCreate}
              />
              <Pressable style={styles.confirmBtn} onPress={handleCreate}>
                <Text style={styles.confirmText}>OK</Text>
              </Pressable>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    paddingVertical: spacing[2],
    minWidth: 140,
    maxWidth: 160,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  headerText: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  chevron: { fontSize: fontSize.sm, color: colors.textSecondary },
  item: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.sm,
    marginHorizontal: spacing[1],
  },
  itemActive: { backgroundColor: colors.primaryLight },
  itemText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  itemTextActive: { color: colors.primary, fontFamily: fonts.medium },
  addBtn: {
    marginTop: spacing[1],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  addBtnText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.primary,
  },
  createRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    gap: spacing[1],
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.text,
  },
  confirmBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
  },
  confirmText: { color: "#fff", fontFamily: fonts.medium, fontSize: fontSize.sm },
});
