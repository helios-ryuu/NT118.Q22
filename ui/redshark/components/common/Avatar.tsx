// Shared avatar component with initials fallback.
import { Image, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "@/constants/theme";

interface Props {
  uri: string | null;
  name: string;
  size?: number;
}

export function Avatar({ uri, name, size = 48 }: Props) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.36 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.border,
  },
  fallback: {
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: colors.primary,
    fontFamily: fonts.bold,
  },
});
