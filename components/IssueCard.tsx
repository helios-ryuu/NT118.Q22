import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { statusLabel } from "@/constants/labels";
import type { Issue } from "@/types/issue";

export function IssueCard({ issue }: { issue: Issue }) {
  const router = useRouter();
  const isActive = issue.status === "OPEN" || issue.status === "IN_PROGRESS";
  const statusChip = isActive ? "bg-primary text-white" : "bg-border text-foreground";

  return (
    <Pressable
      className="bg-surface rounded-xl p-4 mb-3 border border-border"
      onPress={() => router.push(`/issue/${issue.id}`)}
    >
      <View className="flex-row gap-2 mb-2">
        <Text className={`text-xs font-lx-semi px-2 py-0.5 rounded-full ${statusChip}`}>
          {statusLabel[issue.status]}
        </Text>
      </View>
      <Text className="text-base font-lx-semi text-foreground mb-1" numberOfLines={2}>{issue.title}</Text>
      <Text className="text-sm font-lx text-muted mb-2" numberOfLines={2}>{issue.content}</Text>
      <Text className="text-xs font-lx text-muted">{issue.authorDisplayName ?? issue.authorId}</Text>
    </Pressable>
  );
}
