import { Image, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "@/constants/theme";

interface Props {
  uri: string | null | undefined;
  name: string;
  size?: number;
}

export function Avatar({ uri, name, size = 48 }: Props) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  if (uri) {
    return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.border }} />;
  }
  return (
    <View style={[s.circle, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[s.initials, { fontSize: size * 0.36 }]}>{initials}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  circle: { backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  initials: { color: colors.primary, fontFamily: fonts.bold },
});
