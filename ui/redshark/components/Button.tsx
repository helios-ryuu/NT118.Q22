import { Pressable, StyleSheet, Text } from "react-native";
import { colors, fonts, text, radius, spacing } from "@/constants/theme";

type Variant = "primary" | "outline" | "ghost";

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
}

export function Button({ title, onPress, variant = "primary", disabled }: Props) {
  return (
    <Pressable style={[s.base, s[variant], disabled && s.dim]} onPress={onPress} disabled={disabled}>
      <Text style={[s.label, s[`${variant}Label` as const]]}>{title}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  base: { paddingVertical: spacing[3], paddingHorizontal: spacing[4], borderRadius: radius.md, alignItems: "center" },
  primary: { backgroundColor: colors.primary },
  outline: { borderWidth: 1, borderColor: colors.primary },
  ghost: {},
  dim: { opacity: 0.5 },
  label: { fontFamily: fonts.semiBold, fontSize: text.md },
  primaryLabel: { color: "#fff" },
  outlineLabel: { color: colors.primary },
  ghostLabel: { color: colors.textSecondary },
});
