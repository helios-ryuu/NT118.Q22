import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { priorityLabel, statusLabel } from "@/constants/labels";
import type { Issue } from "@/types/issue";

export function IssueCard({ issue }: { issue: Issue }) {
  const router = useRouter();
  const priorityChip =
    issue.priority >= 8
      ? "bg-[#FEE2E2] text-[#991B1B]"
      : issue.priority >= 5
        ? "bg-[#FEF3C7] text-[#92400E]"
        : "bg-border text-foreground";
  const statusChip =
    issue.status === "open" || issue.status === "in_progress"
      ? "bg-primary text-white"
      : "bg-border text-foreground";

  return (
    <Pressable
      className="bg-surface rounded-xl p-4 mb-3 border border-border"
      onPress={() => router.push(`/issue/${issue.id}`)}
    >
      <View className="flex-row gap-2 mb-2">
        <Text className={`text-xs font-lx-semi px-2 py-0.5 rounded-full ${priorityChip}`}>
          {priorityLabel(issue.priority)}
        </Text>
        <Text className={`text-xs font-lx-semi px-2 py-0.5 rounded-full ${statusChip}`}>
          {statusLabel[issue.status]}
        </Text>
      </View>
      <Text className="text-base font-lx-semi text-foreground mb-1" numberOfLines={2}>{issue.title}</Text>
      <Text className="text-sm font-lx text-muted mb-2" numberOfLines={2}>{issue.description}</Text>
      {issue.tags.length > 0 && (
        <View className="flex-row flex-wrap gap-1 mb-2">
          {issue.tags.slice(0, 4).map(t => (
            <Text key={t} className="text-xs font-lx-md text-primary bg-primary-light px-2 py-0.5 rounded-full">{t}</Text>
          ))}
        </View>
      )}
      <Text className="text-xs font-lx text-muted">{issue.authorName}</Text>
    </Pressable>
  );
}
