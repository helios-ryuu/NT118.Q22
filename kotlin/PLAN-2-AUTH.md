# PLAN-2-AUTH.md — Phase 2: Authentication & Profile

**Thời gian:** 12/04/2026 – 20/04/2026 (Tuần 2 + đầu Tuần 3)
**Mốc Milestone:** Commit hoàn thiện module Authentication trước **20/04/2026**.

## 1. Phạm vi tính năng
- Đăng ký Email/Password
- Đăng nhập Email/Password
- Đăng nhập Google (One-Tap / GIS)
- Đăng xuất
- Xem / Chỉnh sửa profile (displayName, avatar, bio, skills)
- Upload avatar lên Cloudflare R2
- Xem profile công khai của user khác

## 2. Màn hình
| Route | Screen | Ghi chú |
|-------|--------|---------|
| `auth/email` | `EmailScreen` | Nhập email, kiểm tra tồn tại |
| `auth/password` | `PasswordScreen` | Đăng nhập |
| `auth/register` | `RegisterScreen` | Đăng ký mới |
| `profile/{id}` | `ProfileViewScreen` | Profile công khai |
| `profile/edit` | `ProfileEditScreen` | Chỉnh sửa |
| `settings` | `SettingsScreen` | Logout, delete account |

## 3. Components
- `FirebaseAuthSource` — wrapper `FirebaseAuth.getInstance()`
- `GoogleSignInHelper` — Credential Manager API
- `AuthRepository` / `AuthRepositoryImpl`
- `ProfileRepository` / `ProfileRepositoryImpl`
- `MediaRepository` (R2 upload)
- UseCases: `SignInEmailUseCase`, `SignInGoogleUseCase`, `RegisterUseCase`, `SignOutUseCase`, `ObserveAuthStateUseCase`, `UpdateProfileUseCase`, `UploadAvatarUseCase`

## 4. Luồng xử lý (tóm tắt)

### 4.1 Sign-in Email
```
EmailScreen → PasswordScreen
  └─ signInWithEmailAndPassword(email, pw)
     └─ onAuthStateChanged → GetMe query → NavGraph.home
```

### 4.2 Sign-in Google
```
GoogleSignInHelper.requestCredential()
  → GoogleAuthProvider.getCredential(idToken)
  → signInWithCredential()
  → if new user: UpsertUser mutation
  → GetMe → home
```

### 4.3 Upload avatar
```
ProfileEditScreen → pick image
  → ImageCompressor.compress(1MB, 512x512)
  → R2Client.putObject(bucket, key="avatars/{uid}.jpg", body)
  → UpdateProfile mutation (avatarUrl)
```

## 5. Acceptance Criteria
- [ ] Đăng nhập email sai mật khẩu → hiển thị message rõ ràng (không crash)
- [ ] Đăng nhập Google trên emulator (thêm SHA-1 debug vào Firebase)
- [ ] `onAuthStateChanged` persist qua restart app
- [ ] Avatar hiển thị sau upload (R2 public URL hoặc presigned)
- [ ] Không lộ Firebase API key trong logcat release

## 6. Rủi ro / Mitigation
- **Google Sign-In SHA-1:** test debug + release keystore, tài liệu trong [SECRET.md](SECRET.md)
- **R2 CORS:** Android không cần CORS nhưng signed URL phải TTL < 15 phút
