// Man hinh workspace — Discord-like: channel sidebar + chat area, tab Thanh vien
import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { ChannelSidebar } from "@/components/workspace/ChannelSidebar";
import { ChatArea } from "@/components/workspace/ChatArea";
import { ParticipantList } from "@/components/workspace/ParticipantList";
import { api } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { useAuth } from "@/hooks/useAuth";
import type { Channel, Session } from "@/types/workspace";
import { colors, fonts, fontSize, spacing } from "@/constants/theme";

type Tab = "discussion" | "members";

export default function WorkspaceScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { user } = useAuth();

  const [session, setSession] = useState<Session | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [tab, setTab] = useState<Tab>("discussion");
  const [loading, setLoading] = useState(true);

  const isOwner = !!user && !!session?.members.find((m) => m.id === user.id && m.role === "author");
  const isReadOnly = session?.issueStatus === "closed" || session?.issueStatus === "cancelled";

  const loadWorkspace = useCallback(() => {
    if (!sessionId) return;
    setLoading(true);
    Promise.all([
      api.get<Session>(endpoints.sessions.byId(sessionId)),
      api.get<Channel[]>(endpoints.sessions.channels(sessionId)),
    ])
      .then(([s, chs]) => {
        setSession(s);
        setChannels(chs);
        if (chs.length > 0) setActiveChannel(chs[0]);
      })
      .catch((e: unknown) => console.error("[Workspace] load:", e))
      .finally(() => setLoading(false));
  }, [sessionId]);

  useFocusEffect(
    useCallback(() => {
      loadWorkspace();
    }, [loadWorkspace]),
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!session) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Không tìm thấy phiên làm việc</Text>
      </View>
    );
  }

  const issueStatusLabel: Record<string, { label: string; color: string }> = {
    open: { label: "Đang mở", color: colors.success },
    in_progress: { label: "Đang xử lý", color: colors.primary },
    closed: { label: "Đã đóng", color: colors.textSecondary },
    cancelled: { label: "Đã huỷ", color: colors.error },
  };
  const statusPill = issueStatusLabel[session.issueStatus] ?? { label: session.issueStatus, color: colors.textSecondary };

  return (
    <View style={styles.screen}>
      {/* ---- Header ---- */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle} numberOfLines={1}>{session.issueTitle}</Text>
          <View style={[styles.statusPill, { backgroundColor: statusPill.color + "22" }]}>
            <Text style={[styles.statusText, { color: statusPill.color }]}>{statusPill.label}</Text>
          </View>
        </View>
      </View>

      {/* ---- Internal tabs ---- */}
      <View style={styles.tabs}>
        <Pressable
          style={[styles.tabItem, tab === "discussion" && styles.tabItemActive]}
          onPress={() => setTab("discussion")}
        >
          <Text style={[styles.tabText, tab === "discussion" && styles.tabTextActive]}>
            Thảo luận
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabItem, tab === "members" && styles.tabItemActive]}
          onPress={() => setTab("members")}
        >
          <Text style={[styles.tabText, tab === "members" && styles.tabTextActive]}>
            Thành viên
          </Text>
        </Pressable>
      </View>

      {/* ---- Content ---- */}
      {tab === "discussion" ? (
        <View style={styles.discussionPanel}>
          {/* Channel sidebar */}
          <ChannelSidebar
            sessionId={session.id}
            channels={channels}
            activeChannelId={activeChannel?.id ?? null}
            isOwner={isOwner}
            readOnly={isReadOnly}
            onSelectChannel={setActiveChannel}
            onChannelCreated={(ch) => {
              setChannels((prev) => [...prev, ch]);
              setActiveChannel(ch);
            }}
          />

          {/* Chat area */}
          {activeChannel ? (
            <ChatArea channelId={activeChannel.id} channelName={activeChannel.name} readOnly={isReadOnly} />
          ) : (
            <View style={styles.noChannel}>
              <Text style={styles.noChannelText}>Chưa có kênh nào</Text>
              {isOwner && !isReadOnly && (
                <Text style={styles.noChannelSub}>Nhấn + Kênh mới để tạo kênh đầu tiên</Text>
              )}
            </View>
          )}
        </View>
      ) : (
        <View style={styles.membersPanel}>
          <ParticipantList
            sessionId={session.id}
            members={session.members}
            isOwner={isOwner}
            readOnly={isReadOnly}
            currentUserId={user?.id ?? ""}
            onMemberKicked={(userId) =>
              setSession((s) =>
                s ? { ...s, members: s.members.filter((m) => m.id !== userId) } : s,
              )
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  notFound: { fontFamily: fonts.regular, fontSize: fontSize.md, color: colors.textSecondary },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: { flex: 1, gap: spacing[1] },
  headerTitle: { fontFamily: fonts.bold, fontSize: fontSize.md, color: colors.text },
  statusPill: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: 99,
  },
  statusText: { fontFamily: fonts.medium, fontSize: fontSize.xs },

  // Tabs
  tabs: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing[3],
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabItemActive: { borderBottomColor: colors.primary },
  tabText: { fontFamily: fonts.medium, fontSize: fontSize.sm, color: colors.textSecondary },
  tabTextActive: { color: colors.primary },

  // Discussion
  discussionPanel: { flex: 1, flexDirection: "row" },

  // No channel placeholder
  noChannel: { flex: 1, justifyContent: "center", alignItems: "center", gap: spacing[2] },
  noChannelText: { fontFamily: fonts.medium, fontSize: fontSize.md, color: colors.text },
  noChannelSub: { fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary },

  // Members
  membersPanel: { flex: 1, padding: spacing[4] },
});
