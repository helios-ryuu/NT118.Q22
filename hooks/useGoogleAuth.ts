// Hook dang nhap bang Google — native flow, khong dung browser redirect
// Sau khi signInWithCredential thanh cong, onAuthStateChanged trong AuthContext
// se tu dong xu ly viec tao/load user profile.
import { firebaseAuth } from "@/services/firebase";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  offlineAccess: false,
});

export function useGoogleAuth() {
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;
      if (!idToken) throw new Error("Không lấy được idToken từ Google");

      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(firebaseAuth, credential);
      // onAuthStateChanged trong AuthContext se xu ly phan con lai
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) return;
      if (error.code === statusCodes.IN_PROGRESS) return;
      // Emit full diagnostics to Metro log so OAuth misconfiguration is easier to debug.
      console.error("[GoogleAuth] signIn failed", {
        code: error?.code,
        message: error?.message,
        userInfo: error?.userInfo,
      });

      const code = String(error?.code ?? "");

      if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error("Google Play Services không khả dụng trên thiết bị này");
      }

      if (code === "10") {
        throw new Error(
          "Google OAuth cấu hình sai (thiếu SHA-1/SHA-256 của APK đang cài hoặc client ID không đúng project Firebase)"
        );
      }

      throw error;
    }
  };

  return { signIn };
}
