import { Pressable, ScrollView, Text, View } from "react-native";

const TAGS = [
  "React Native", "React", "Vue", "Angular", "Flutter",
  "iOS", "Android", "Java", "Kotlin", "Swift",
  "Node.js", "Python", "Go", "Rust", "C++",
  "Spring Boot", "Django", "FastAPI", "PostgreSQL", "MongoDB",
  "Docker", "Kubernetes", "AWS", "Firebase", "Supabase",
  "UI/UX", "Figma", "Machine Learning", "Data Science", "DevOps",
];

interface Props {
  selected: string[];
  onChange: (tags: string[]) => void;
}

export function TagSelect({ selected, onChange }: Props) {
  const toggle = (tag: string) =>
    onChange(selected.includes(tag) ? selected.filter(t => t !== tag) : [...selected, tag]);

  return (
    <View className="mb-4">
      <Text className="text-sm font-lx-md text-foreground mb-2">Kỹ năng cần ({selected.length})</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
        {TAGS.map(tag => {
          const active = selected.includes(tag);
          return (
            <Pressable
              key={tag}
              className={`px-3 py-2 rounded-app border ${active ? "border-primary bg-primary-light" : "border-border bg-surface"}`}
              onPress={() => toggle(tag)}
            >
              <Text className={`text-sm font-lx-md ${active ? "text-primary" : "text-muted"}`}>{tag}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
