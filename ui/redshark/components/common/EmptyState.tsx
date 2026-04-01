// Shared empty state placeholder for list/page sections.
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, fontSize, spacing } from "@/constants/theme";

interface Props {
  icon?: string;
  title: string;
  message?: string;
}

export function EmptyState({ icon = "📭", title, message }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing[7],
  },
  icon: {
    fontSize: 48,
    marginBottom: spacing[4],
  },
  title: {
    fontSize: fontSize.lg,
    fontFamily: fonts.semiBold,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing[2],
  },
  message: {
    fontSize: fontSize.sm,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
