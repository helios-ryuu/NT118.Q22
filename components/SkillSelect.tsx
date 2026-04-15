import { Pressable, ScrollView, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { listSkills } from "@dataconnect/generated";
import { queryKeys } from "@/services/queryKeys";

interface Props {
  selected: number[];
  onChange: (skillIds: number[]) => void;
}

export function SkillSelect({ selected, onChange }: Props) {
  const skillsQuery = useQuery({
    queryKey: queryKeys.skills.all,
    queryFn: async () => {
      const result = await listSkills();
      return result.data.skills;
    },
    staleTime: Infinity,
  });

  const allSkills = skillsQuery.data ?? [];

  const toggle = (id: number) =>
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);

  return (
    <View className="mb-4">
      <Text className="text-sm font-lx-md text-foreground mb-2">Kỹ năng ({selected.length})</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
        {allSkills.map(skill => {
          const active = selected.includes(skill.id);
          return (
            <Pressable
              key={skill.id}
              className={`px-3 py-2 rounded-app border ${active ? "border-primary bg-primary-light" : "border-border bg-surface"}`}
              onPress={() => toggle(skill.id)}
            >
              <Text className={`text-sm font-lx-md ${active ? "text-primary" : "text-muted"}`}>{skill.name}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
