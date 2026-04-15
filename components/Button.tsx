import { Pressable, Text, View, type ViewStyle } from "react-native";
import type { ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  icon?: ReactNode;
  style?: ViewStyle;
}

const variantCls: Record<Variant, string> = {
  primary: "bg-primary",
  outline: "border border-border",
  ghost: "",
};

const labelCls: Record<Variant, string> = {
  primary: "text-white",
  outline: "text-foreground",
  ghost: "text-muted",
};

export function Button({ title, onPress, variant = "primary", disabled, icon, style }: Props) {
  return (
    <Pressable
      className={`py-3 px-4 rounded-xl items-center flex-row justify-center gap-2 ${variantCls[variant]} ${disabled ? "opacity-50" : ""}`}
      onPress={onPress}
      disabled={disabled}
      style={style}
    >
      {icon ? <View>{icon}</View> : null}
      <Text className={`font-lx-semi text-base ${labelCls[variant]}`}>{title}</Text>
    </Pressable>
  );
}
