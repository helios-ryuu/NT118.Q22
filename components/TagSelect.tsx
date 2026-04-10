import { Pressable, ScrollView, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { listTags } from "@dataconnect/generated";
import { queryKeys } from "@/services/queryKeys";

interface Props {
  selected: number[];
  onChange: (tagIds: number[]) => void;
}

export function TagSelect({ selected, onChange }: Props) {
  const tagsQuery = useQuery({
    queryKey: queryKeys.tags.all,
    queryFn: async () => {
      const result = await listTags();
      return result.data.tags;
    },
    staleTime: Infinity,
  });

  const allTags = tagsQuery.data ?? [];

  const toggle = (id: number) =>
    onChange(selected.includes(id) ? selected.filter(t => t !== id) : [...selected, id]);

  return (
    <View className="mb-4">
      <Text className="text-sm font-lx-md text-foreground mb-2">Tags ({selected.length})</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
        {allTags.map(tag => {
          const active = selected.includes(tag.id);
          return (
            <Pressable
              key={tag.id}
              className={`px-3 py-2 rounded-app border ${active ? "border-primary bg-primary-light" : "border-border bg-surface"}`}
              onPress={() => toggle(tag.id)}
            >
              <Text className={`text-sm font-lx-md ${active ? "text-primary" : "text-muted"}`}>{tag.name}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
