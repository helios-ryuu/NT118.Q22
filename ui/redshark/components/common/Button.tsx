// Shared button component for consistent actions across the app.
import { Pressable, StyleSheet, Text } from "react-native";
import { colors, borderRadius, fonts, fontSize, spacing } from "@/constants/theme";

type Variant = "primary" | "outline" | "ghost";

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
}

export function Button({ title, onPress, variant = "primary", disabled }: Props) {
  return (
    <Pressable
      style={[styles.base, styles[variant], disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.label, variant !== "primary" && styles.labelAlt]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: "#fff",
    fontSize: fontSize.md,
    fontFamily: fonts.semiBold,
  },
  labelAlt: {
    color: colors.primary,
  },
});
