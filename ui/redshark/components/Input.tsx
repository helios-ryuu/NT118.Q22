import { forwardRef } from "react";
import { Text, TextInput, type TextInputProps, View } from "react-native";
import { colors } from "@/constants/theme";

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = forwardRef<TextInput, Props>(({ label, error, style, ...rest }, ref) => (
  <View className="mb-3">
    {label ? <Text className="text-sm font-lx-md text-foreground mb-1">{label}</Text> : null}
    <TextInput
      ref={ref}
      className={`border rounded-xl px-3 py-3 text-base font-lx text-foreground bg-surface ${error ? "border-error" : "border-border"}`}
      style={style}
      placeholderTextColor={colors.textSecondary}
      {...rest}
    />
    {error ? <Text className="text-xs font-lx text-error mt-1">{error}</Text> : null}
  </View>
));

Input.displayName = "Input";
