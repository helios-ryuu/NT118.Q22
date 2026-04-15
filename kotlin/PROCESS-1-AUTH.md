# PROCESS-1-AUTH.md — Quy trình nghiệp vụ: Auth & Profile

## 1. Đăng ký tài khoản Email/Password

| Bước | UI tương tác | Service gọi | Bảng/Thuộc tính ảnh hưởng |
|------|--------------|-------------|---------------------------|
| 1 | `EmailScreen`: user nhập email | — | — |
| 2 | `PasswordScreen`: user nhập password + confirm | — | — |
| 3 | Bấm "Đăng ký" | `FirebaseAuthSource.createUserWithEmailAndPassword()` | Firebase Auth (external) |
| 4 | Sau khi Firebase trả UID | `DataConnectSource.upsertUser(uid, email, displayName)` | Insert `users(id, email, displayName, createdAt)` |
| 5 | `onAuthStateChanged` fire | `GetMe` query | Select `users` where id = auth.uid |
| 6 | ViewModel map → `UiState.Authenticated(user)` | — | — |
| 7 | `NavGraph` điều hướng `home` | — | — |

## 2. Đăng nhập Email/Password

| Bước | UI | Service | Bảng |
|------|----|---------|------|
| 1 | `EmailScreen` → `PasswordScreen` | — | — |
| 2 | Submit | `signInWithEmailAndPassword(email, pw)` | Firebase Auth |
| 3 | `onAuthStateChanged` | `GetMe` | Read `users` |
| 4 | Cache user vào `DataStore` | — | Local `UserPreferences` |
| 5 | Navigate Home | — | — |

## 3. Đăng nhập Google

| Bước | UI | Service | Bảng |
|------|----|---------|------|
| 1 | `EmailScreen` → "Tiếp tục với Google" | `GoogleSignInHelper.requestCredential()` (Credential Manager) | — |
| 2 | User chọn tài khoản | Google trả `idToken` | — |
| 3 | Đổi credential | `GoogleAuthProvider.getCredential(idToken)` → `signInWithCredential()` | Firebase Auth |
| 4 | Nếu new user | `UpsertUser` mutation | Insert `users` |
| 5 | `GetMe` → Home | — | Read `users` |

## 4. Upload Avatar (R2)

| Bước | UI | Service | Bảng/Storage |
|------|----|---------|--------------|
| 1 | `ProfileEditScreen` → pick image | `ImagePicker` (system) | — |
| 2 | Nén ảnh | `ImageCompressor.compress(maxMB=1, 512x512)` | — |
| 3 | Upload | `R2Client.putObject("avatars/{uid}.jpg", bytes)` (S3 API SigV4) | Cloudflare R2 bucket `redshark-media` |
| 4 | Lấy URL | Build public URL hoặc presigned | — |
| 5 | Cập nhật DB | `UpdateProfile(avatarUrl)` mutation | Update `users.avatarUrl`, `updatedAt` |
| 6 | UI refresh | `GetMe` invalidate | — |

## 5. Đăng xuất

| Bước | UI | Service | Bảng |
|------|----|---------|------|
| 1 | `SettingsScreen` → "Đăng xuất" | Confirm dialog | — |
| 2 | Confirm | `FirebaseAuth.signOut()` + `GoogleSignInClient.signOut()` | Firebase Auth |
| 3 | Clear cache | `UserPreferences.clear()` | Local DataStore |
| 4 | `onAuthStateChanged(null)` | NavGraph → Auth | — |

## 6. Xem profile user khác

| Bước | UI | Service | Bảng |
|------|----|---------|------|
| 1 | Tap avatar/tên user trong Comment/Issue | Navigate `profile/{id}` | — |
| 2 | `ProfileViewScreen` load | `GetUserById(id)` query | Read `users` |
| 3 | Hiển thị info + nút "Nhắn tin" | — | — |
