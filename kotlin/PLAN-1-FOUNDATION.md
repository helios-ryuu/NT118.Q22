# PLAN-1-FOUNDATION.md — Phase 1: Nền tảng dự án

**Thời gian:** 05/04/2026 – 11/04/2026 (Tuần 1)
**Mục tiêu:** Thiết lập nền tảng Kotlin Android Native, sẵn sàng cho việc code feature.

## 1. Deliverables
- [ ] Dự án Android Studio khởi tạo, build thành công (`./gradlew assembleDebug`)
- [ ] Cấu trúc thư mục tuân thủ [STRUCTURE.md](STRUCTURE.md)
- [ ] CI/CD GitHub Actions chạy được build + lint + unit test
- [ ] Firebase Auth + Data Connect SDK kết nối thành công (ping `GetMe`)
- [ ] Cloudflare R2 upload thử nghiệm thành công 1 file
- [ ] Tài liệu coding convention được commit

## 2. Công việc chi tiết

### 2.1 Khởi tạo dự án
- Android Studio Iguana+, Kotlin 2.0, AGP 8.5+
- `minSdk = 26`, `targetSdk = 34`, `compileSdk = 34`
- Gradle Kotlin DSL, version catalog `libs.versions.toml`
- Bật Compose, Hilt, Kotlin Serialization, Coroutines

### 2.2 Dependencies chính
```toml
[versions]
kotlin = "2.0.21"
compose-bom = "2024.10.00"
hilt = "2.52"
coroutines = "1.9.0"
lifecycle = "2.8.7"
navigation = "2.8.3"
datastore = "1.1.1"
firebase-bom = "33.5.1"
firebase-dataconnect = "16.0.0-beta01"
okhttp = "4.12.0"
aws-signer = "2.28.16"         # cho R2 SigV4
coil = "2.7.0"
```

### 2.3 Design Pattern chuẩn dự án

#### MVVM + Clean Architecture
- **View (Composable):** stateless, nhận `UiState` + `onEvent`.
- **ViewModel:** giữ `StateFlow<UiState>`, expose intent functions.
- **UseCase:** `operator fun invoke()` duy nhất, SRP.
- **Repository interface (domain):** định nghĩa contract.
- **RepositoryImpl (data):** gọi FDC / R2 / local, map DTO.

#### Unidirectional Data Flow (UDF)
```
UI Event ──► ViewModel.onEvent() ──► UseCase ──► Repository
                │                                     │
                ▼                                     ▼
          StateFlow<UiState> ◄────── map(Result<T>) ──┘
```

### 2.4 CI/CD (`.github/workflows/android-ci.yml`)
Pipeline chạy trên mỗi PR → `main`:
1. `actions/checkout@v4`
2. `actions/setup-java@v4` (JDK 17)
3. `gradle/actions/setup-gradle@v4`
4. `./gradlew lint testDebugUnitTest assembleDebug`
5. Upload APK artifact (optional)
6. Secret scan (gitleaks)

### 2.5 Kết nối hạ tầng
- `google-services.json` đặt trong `app/` (gitignored)
- Chạy `firebase dataconnect:sdk:generate --output app/src/main/java/com/helios/redshark/data/remote/dataconnect/generated`
- Smoke test: `DataConnectSource.getMe()` trả 401 (chưa login) là OK

### 2.6 Code Style (bắt buộc toàn dự án)

> **Nguyên tắc:** Ưu tiên **đơn giản, tường minh, dễ hiểu**. Không tối ưu sớm, không abstract khi chưa có 3 use case thực tế.

**Kotlin Naming Convention (Google + Kotlinlang official):**

| Mục | Quy tắc | Ví dụ |
|-----|--------|-------|
| Package | lowercase, không `_` | `com.helios.redshark.ui.feature.idea` |
| Class / Interface | PascalCase, danh từ | `IdeaDetailScreen`, `AuthRepository` |
| Hàm | camelCase, động từ | `fetchIdeas()`, `onSubmitClicked()` |
| Biến | camelCase | `currentUser`, `isLoading` |
| Constant | UPPER_SNAKE_CASE | `MAX_ACTIVE_ISSUES = 20` |
| Composable | PascalCase (như class) | `IdeaCard()`, `PrimaryButton()` |
| File | tên class chính | `IdeaDetailViewModel.kt` |
| Enum values | UPPER_SNAKE_CASE | `OPEN`, `IN_PROGRESS` |
| Resource (XML) | lowercase_snake | `ic_arrow_back.xml`, `color_primary` |

**Formatting:**
- Dùng `ktlint` + `detekt` (fail build khi violation)
- Line length ≤ 120
- 4 space indent, không tab
- Trailing comma bật
- Import sắp xếp alphabet

**API Convention:**
- **GraphQL (FDC):** `PascalCase` cho Query/Mutation name (đã áp dụng), field `camelCase`.
- **REST (R2):** tuân thủ chuẩn S3 API, URL dùng `kebab-case`.

**Commit message (Conventional Commits):**
```
feat(auth): add Google Sign-In flow
fix(idea): prevent crash when tagIds is null
refactor(data): extract FDC error mapper
docs: update SCHEMA with notifications table
```

## 3. DoD (Definition of Done)
- [ ] `./gradlew assembleDebug` xanh
- [ ] CI GitHub Actions xanh trên PR mẫu
- [ ] README.md có hướng dẫn setup < 10 bước
- [ ] Lint 0 warning nghiêm trọng
- [ ] Đã merge PR `chore: scaffold project`
