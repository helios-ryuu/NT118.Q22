import { forwardRef } from "react";
import { StyleSheet, Text, TextInput, type TextInputProps, View } from "react-native";
import { colors, fonts, text, radius, spacing } from "@/constants/theme";

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = forwardRef<TextInput, Props>(({ label, error, style, ...rest }, ref) => (
  <View style={s.wrap}>
    {label ? <Text style={s.label}>{label}</Text> : null}
    <TextInput
      ref={ref}
      style={[s.input, error ? s.err : null, style]}
      placeholderTextColor={colors.textSecondary}
      {...rest}
    />
    {error ? <Text style={s.errText}>{error}</Text> : null}
  </View>
));

const s = StyleSheet.create({
  wrap: { marginBottom: spacing[3] },
  label: { fontSize: text.sm, fontFamily: fonts.medium, color: colors.text, marginBottom: spacing[1] },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    fontSize: text.md,
    fontFamily: fonts.regular,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  err: { borderColor: colors.error },
  errText: { fontSize: text.xs, fontFamily: fonts.regular, color: colors.error, marginTop: spacing[1] },
});
