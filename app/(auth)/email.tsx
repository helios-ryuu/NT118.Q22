import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useAuth } from "@/hooks/useAuth";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailScreen() {
  const { checkEmail } = useAuth();
  const { signIn: signInWithGoogle } = useGoogleAuth();
  const [oauthError, setOAuthError] = useState("");
  const [oauthLoading, setOAuthLoading] = useState(false);

  const handleGoogle = async () => {
    setOAuthLoading(true);
    setOAuthError("");
    try {
      await signInWithGoogle();
      // onAuthStateChanged trong AuthContext se set user, AuthGate se tu chuyen sang (tabs)
    } catch {
      setOAuthError("Đăng nhập Google thất bại. Vui lòng thử lại.");
      setOAuthLoading(false);
    }
  };
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const valid = EMAIL_RE.test(email.trim());

  const next = async () => {
    if (!valid) {
      setError("Email không đúng định dạng");
      return;
    }
    setLoading(true);
    try {
      const exists = await checkEmail(email.trim());
      router.push(exists
        ? { pathname: "/(auth)/password", params: { email: email.trim() } }
        : { pathname: "/(auth)/register", params: { email: email.trim() } }
      );
    } catch {
      setError("Không thể kiểm tra email. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-background" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }} keyboardShouldPersistTaps="handled">
        <View className="mb-6">
          <Text className="text-2xl font-lx-bold text-foreground mb-2">Nhập email của bạn</Text>
          <Text className="text-sm font-lx text-muted">Chúng tôi sẽ kiểm tra tài khoản của bạn</Text>
        </View>
        <Input
          label="Email"
          placeholder="email@uit.edu.vn"
          value={email}
          onChangeText={t => {
            setEmail(t);
            if (error) setError("");
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoFocus
          error={error}
        />
        <Button title={loading ? "Đang kiểm tra..." : "Tiếp tục"} onPress={next} disabled={loading} />

        <View className="flex-row items-center my-4 gap-2">
          <View className="flex-1 h-px bg-border" />
          <Text className="text-xs font-lx text-muted">hoặc tiếp tục với</Text>
          <View className="flex-1 h-px bg-border" />
        </View>

        {oauthError ? <Text className="text-xs text-error font-lx mb-2">{oauthError}</Text> : null}
        <Button
          title={oauthLoading ? "Đang đăng nhập..." : "Google"}
          onPress={handleGoogle}
          variant="outline"
          disabled={oauthLoading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
