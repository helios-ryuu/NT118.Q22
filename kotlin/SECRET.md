# SECRET.md — Quản lý biến môi trường & khóa bí mật

> **Nguyên tắc vàng:** Tuyệt đối KHÔNG commit bất kỳ giá trị thật nào. File này **chỉ** liệt kê tên biến, vị trí lưu trữ và cách lấy.

## 1. Bảng secret

| Tên biến | Môi trường | Nơi lưu trữ | Hướng dẫn lấy / sinh |
|----------|-----------|-------------|----------------------|
| `FIREBASE_API_KEY` | Dev + Prod | `local.properties` / CI Secrets | Firebase Console → Project Settings → General → Your apps → Android → `apiKey` (hoặc lấy từ `google-services.json`) |
| `FIREBASE_PROJECT_ID` | Dev + Prod | `local.properties` | Firebase Console → Project Settings → General → Project ID |
| `FIREBASE_APP_ID` | Dev + Prod | `local.properties` | Firebase Console → Project Settings → General → App ID (Android) |
| `FIREBASE_AUTH_DOMAIN` | Dev + Prod | `local.properties` | `<project-id>.firebaseapp.com` |
| `FIREBASE_STORAGE_BUCKET` | Dev + Prod | `local.properties` | `<project-id>.firebasestorage.app` |
| `FIREBASE_MESSAGING_SENDER_ID` | Dev + Prod | `local.properties` | Firebase Console → Cloud Messaging → Sender ID |
| `GOOGLE_WEB_CLIENT_ID` | Dev + Prod | `local.properties` | Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 (Web) |
| `GOOGLE_ANDROID_CLIENT_ID` | Dev + Prod | `local.properties` | Google Cloud Console → OAuth 2.0 (Android, package = `com.helios.redshark`) |
| `CLOUDFLARE_R2_ACCOUNT_ID` | Dev + Prod | `local.properties` / CI Secrets | Cloudflare Dashboard → R2 → Overview → Account ID |
| `CLOUDFLARE_R2_ACCESS_KEY_ID` | Dev + Prod | `local.properties` / CI Secrets | Cloudflare Dashboard → R2 → Manage R2 API Tokens → Create token (scope: bucket cụ thể, WRITE+READ) |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | Dev + Prod | `local.properties` / CI Secrets | Hiển thị duy nhất 1 lần khi tạo token — lưu ngay |
| `CLOUDFLARE_R2_BUCKET` | Dev + Prod | `local.properties` | Cloudflare Dashboard → R2 → Buckets (ví dụ: `redshark-media-dev`, `redshark-media-prod`) |
| `CLOUDFLARE_R2_ENDPOINT` | Dev + Prod | `local.properties` | `https://<account-id>.r2.cloudflarestorage.com` |
| `CLOUDFLARE_R2_PUBLIC_BASE_URL` | Dev + Prod | `local.properties` | URL custom domain (nếu có) hoặc R2 public URL từ Cloudflare Dashboard |
| `RELEASE_KEYSTORE_PATH` | Prod | `local.properties` / CI Secrets | Đường dẫn file `.keystore`. CI: decode từ base64 |
| `RELEASE_KEYSTORE_PASSWORD` | Prod | `local.properties` / CI Secrets | Password khi tạo keystore với `keytool -genkey` |
| `RELEASE_KEY_ALIAS` | Prod | `local.properties` / CI Secrets | Alias khi tạo keystore |
| `RELEASE_KEY_PASSWORD` | Prod | `local.properties` / CI Secrets | Password key alias |
| `GOOGLE_SERVICES_JSON` | Dev + Prod | `app/google-services.json` (gitignored) / CI Secret (base64) | Firebase Console → Project Settings → Your apps → Download `google-services.json` |
| `SERVICE_ACCOUNT_KEY_JSON` | Prod (CI deploy FDC) | CI Secret | Firebase Console → Project Settings → Service accounts → Generate new private key |

## 2. File `local.properties` mẫu (gitignored)

```properties
# Android SDK
sdk.dir=C\:\\Users\\<you>\\AppData\\Local\\Android\\Sdk

# Firebase
FIREBASE_API_KEY=xxx
FIREBASE_PROJECT_ID=xxx
FIREBASE_APP_ID=xxx
GOOGLE_WEB_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_ANDROID_CLIENT_ID=xxx.apps.googleusercontent.com

# Cloudflare R2
CLOUDFLARE_R2_ACCOUNT_ID=xxx
CLOUDFLARE_R2_ACCESS_KEY_ID=xxx
CLOUDFLARE_R2_SECRET_ACCESS_KEY=xxx
CLOUDFLARE_R2_BUCKET=redshark-media-dev
CLOUDFLARE_R2_ENDPOINT=https://xxx.r2.cloudflarestorage.com
CLOUDFLARE_R2_PUBLIC_BASE_URL=https://media.redshark.dev

# Release signing (chỉ prod)
RELEASE_KEYSTORE_PATH=../keystore/release.keystore
RELEASE_KEYSTORE_PASSWORD=xxx
RELEASE_KEY_ALIAS=redshark
RELEASE_KEY_PASSWORD=xxx
```

## 3. Cách load vào `BuildConfig` (Gradle Kotlin DSL)

```kotlin
// app/build.gradle.kts
val localProps = Properties().apply {
    val f = rootProject.file("local.properties")
    if (f.exists()) load(f.inputStream())
}

android {
    defaultConfig {
        buildConfigField("String", "FIREBASE_API_KEY",
            "\"${localProps.getProperty("FIREBASE_API_KEY") ?: ""}\"")
        buildConfigField("String", "CLOUDFLARE_R2_BUCKET",
            "\"${localProps.getProperty("CLOUDFLARE_R2_BUCKET") ?: ""}\"")
        // ...
    }
}
```

## 4. CI/CD — GitHub Actions Secrets

Cài đặt tại: **GitHub repo → Settings → Secrets and variables → Actions**.

| GitHub Secret Name | Giá trị |
|-------------------|---------|
| `GOOGLE_SERVICES_JSON_BASE64` | `base64` của `google-services.json` |
| `RELEASE_KEYSTORE_BASE64` | `base64` của file keystore |
| `RELEASE_KEYSTORE_PASSWORD` | — |
| `RELEASE_KEY_ALIAS` | — |
| `RELEASE_KEY_PASSWORD` | — |
| `CLOUDFLARE_R2_ACCESS_KEY_ID` | — |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | — |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | JSON service account (cho deploy FDC) |

## 5. Checklist khi commit

- [ ] `.gitignore` chứa: `local.properties`, `google-services.json`, `*.keystore`, `serviceAccountKey.json`, `.env*`
- [ ] Chạy `gitleaks detect` trước mỗi release
- [ ] Rotate token R2 mỗi 6 tháng hoặc khi thành viên rời dự án
- [ ] Không hardcode secret vào Kotlin source, luôn qua `BuildConfig.*`

## 6. Rotation plan

| Secret | Chu kỳ rotate | Trigger |
|--------|---------------|---------|
| R2 token | 6 tháng | Thành viên rời dự án, nghi ngờ lộ |
| Release keystore | Không rotate (giữ vĩnh viễn) | — |
| Firebase service account | 12 tháng | — |
