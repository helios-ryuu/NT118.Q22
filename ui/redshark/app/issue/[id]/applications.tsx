// Danh sach ung cu vien — owner only
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { ApplicantCard } from "@/components/issue/ApplicantCard";
import { EmptyState } from "@/components/common/EmptyState";
import { api } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { IssueApplication } from "@/types/issue";
import { colors, fonts, fontSize, spacing } from "@/constants/theme";

export default function ApplicationsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [applications, setApplications] = useState<IssueApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!id) return;
    api.get<IssueApplication[]>(endpoints.issues.applications.list(id))
      .then(setApplications)
      .catch((e: unknown) => console.error("[Applications] load:", e))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const handleAccept = async (appId: string) => {
    Alert.alert("Nhận vào workspace", "Chấp nhận ứng viên này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Nhận",
        onPress: async () => {
          try {
            const result = await api.put<IssueApplication>(endpoints.issues.applications.accept(id as string, appId), {});
            if (result.workspaceId) {
              router.replace(`/(tabs)/issues`);
              router.push(`/workspace/${result.workspaceId}`);
            } else {
              load();
            }
          } catch {
            Alert.alert("Lỗi", "Không thể chấp nhận ứng viên");
          }
        },
      },
    ]);
  };

  const handleReject = async (appId: string) => {
    try {
      await api.put(endpoints.issues.applications.reject(id as string, appId), {});
      load();
    } catch {
      Alert.alert("Lỗi", "Không thể từ chối ứng viên");
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Ứng cử viên ({applications.length})</Text>
      {applications.length === 0 ? (
        <EmptyState icon="👥" title="Chưa có ứng cử viên" message="Chờ người dùng khác ứng cử để giúp bạn" />
      ) : (
        applications.map((app) => (
          <ApplicantCard
            key={app.id}
            application={app}
            onAccept={() => handleAccept(app.id)}
            onReject={() => handleReject(app.id)}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing[4] },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  heading: { fontSize: fontSize.xl, fontFamily: fonts.bold, color: colors.text, marginBottom: spacing[4] },
});
