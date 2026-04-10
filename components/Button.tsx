import { Pressable, Text } from "react-native";

type Variant = "primary" | "outline" | "ghost";

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
}

const variantCls: Record<Variant, string> = {
  primary: "bg-primary",
  outline: "border border-primary",
  ghost: "",
};

const labelCls: Record<Variant, string> = {
  primary: "text-white",
  outline: "text-primary",
  ghost: "text-muted",
};

export function Button({ title, onPress, variant = "primary", disabled }: Props) {
  return (
    <Pressable
      className={`py-3 px-4 rounded-xl items-center ${variantCls[variant]} ${disabled ? "opacity-50" : ""}`}
      onPress={onPress}
      disabled={disabled}
    >
      <Text className={`font-lx-semi text-base ${labelCls[variant]}`}>{title}</Text>
    </Pressable>
  );
}
