import { Image, Text, View } from "react-native";
import { colors } from "@/constants/theme";

interface Props {
  uri: string | null | undefined;
  name: string;
  size?: number;
}

export function Avatar({ uri, name, size = 48 }: Props) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.border }}
      />
    );
  }
  return (
    <View
      className="bg-primary-light items-center justify-center"
      style={{ width: size, height: size, borderRadius: size / 2 }}
    >
      <Text className="text-primary font-lx-bold" style={{ fontSize: size * 0.36 }}>{initials}</Text>
    </View>
  );
}
