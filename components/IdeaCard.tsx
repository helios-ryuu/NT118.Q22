import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ideaStatusLabel } from "@/constants/labels";
import type { Idea } from "@/types/idea";

export function IdeaCard({ idea }: { idea: Idea }) {
  const router = useRouter();
  const isActive = idea.status === "ACTIVE";
  const statusChip = isActive ? "bg-primary text-white" : "bg-border text-foreground";

  return (
    <Pressable
      className="bg-surface rounded-xl p-4 mb-3 border border-border"
      onPress={() => router.push(`/idea/${idea.id}`)}
    >
      <View className="flex-row gap-2 mb-2">
        <Text className={`text-xs font-lx-semi px-2 py-0.5 rounded-full ${statusChip}`}>
          {ideaStatusLabel[idea.status]}
        </Text>
        {idea.tagIds.length > 0 && (
          <Text className="text-xs font-lx text-muted self-center">{idea.tagIds.length} tag</Text>
        )}
      </View>
      <Text className="text-base font-lx-semi text-foreground mb-1" numberOfLines={2}>{idea.title}</Text>
      <Text className="text-sm font-lx text-muted mb-2" numberOfLines={2}>{idea.description}</Text>
      <Text className="text-xs font-lx text-muted">{idea.authorDisplayName ?? idea.authorId}</Text>
    </Pressable>
  );
}
