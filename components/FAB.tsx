import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";

interface Props {
  onPress: () => void;
}

export function FAB({ onPress }: Props) {
  return (
    <Pressable className="absolute justify-center items-center rounded-full bg-primary" style={styles.fab} onPress={onPress}>
      <Ionicons name="add" size={28} color="#fff" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    right: 20,
    bottom: 32,
    width: 56,
    height: 56,
    elevation: 4,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
