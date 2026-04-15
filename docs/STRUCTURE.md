# STRUCTURE.md — Cấu trúc thư mục dự án Kotlin

Kiến trúc áp dụng: **Clean Architecture + MVVM** với 3 layer chính: **data**, **domain**, **ui** (presentation). Sử dụng Hilt cho DI, Coroutines + Flow cho reactive, Jetpack Compose cho UI.

## 1. Cây thư mục tổng thể

```
redshark-android/
├── .github/
│   └── workflows/
│       ├── android-ci.yml              # Lint + unit test trên PR
│       └── android-release.yml         # Build APK release khi tag
├── app/
│   ├── build.gradle.kts
│   ├── proguard-rules.pro
│   ├── google-services.json            # (gitignored) Firebase config
│   └── src/
│       ├── main/
│       │   ├── AndroidManifest.xml
│       │   ├── java/com/helios/redshark/
│       │   │   ├── RedSharkApp.kt              # @HiltAndroidApp
│       │   │   ├── MainActivity.kt             # Single-activity host
│       │   │   │
│       │   │   ├── data/                       # ----- DATA LAYER -----
│       │   │   │   ├── remote/
│       │   │   │   │   ├── firebase/
│       │   │   │   │   │   ├── FirebaseAuthDataSource.kt
│       │   │   │   │   │   └── FirebaseAuthModule.kt
│       │   │   │   │   ├── dataconnect/
│       │   │   │   │   │   ├── DataConnectClient.kt      # Apollo/GraphQL client
│       │   │   │   │   │   ├── queries/                  # .graphql files
│       │   │   │   │   │   ├── mutations/
│       │   │   │   │   │   └── generated/                # Apollo codegen output
│       │   │   │   │   └── r2/
│       │   │   │   │       ├── R2StorageDataSource.kt    # S3-compatible SDK
│       │   │   │   │       └── R2Module.kt
│       │   │   │   ├── local/
│       │   │   │   │   ├── datastore/
│       │   │   │   │   │   └── UserPreferences.kt        # Proto DataStore
│       │   │   │   │   └── cache/
│       │   │   │   │       └── ImageCache.kt
│       │   │   │   ├── repository/
│       │   │   │   │   ├── AuthRepositoryImpl.kt
│       │   │   │   │   ├── UserRepositoryImpl.kt
│       │   │   │   │   ├── IdeaRepositoryImpl.kt
│       │   │   │   │   ├── IssueRepositoryImpl.kt
│       │   │   │   │   ├── CommentRepositoryImpl.kt
│       │   │   │   │   ├── MessageRepositoryImpl.kt
│       │   │   │   │   ├── NotificationRepositoryImpl.kt
│       │   │   │   │   └── StorageRepositoryImpl.kt
│       │   │   │   └── mapper/
│       │   │   │       ├── UserMapper.kt
│       │   │   │       ├── IdeaMapper.kt
│       │   │   │       └── ...                          # DTO ↔ Domain
│       │   │   │
│       │   │   ├── domain/                     # ----- DOMAIN LAYER -----
│       │   │   │   ├── model/
│       │   │   │   │   ├── User.kt
│       │   │   │   │   ├── Idea.kt
│       │   │   │   │   ├── Issue.kt
│       │   │   │   │   ├── Comment.kt
│       │   │   │   │   ├── Conversation.kt
│       │   │   │   │   ├── Message.kt
│       │   │   │   │   ├── Notification.kt
│       │   │   │   │   ├── Skill.kt
│       │   │   │   │   └── Tag.kt
│       │   │   │   ├── repository/             # Interfaces (contracts)
│       │   │   │   │   ├── AuthRepository.kt
│       │   │   │   │   ├── IdeaRepository.kt
│       │   │   │   │   └── ...
│       │   │   │   └── usecase/
│       │   │   │       ├── auth/
│       │   │   │       │   ├── SignInWithEmailUseCase.kt
│       │   │   │       │   ├── SignInWithGoogleUseCase.kt
│       │   │   │       │   ├── RegisterUseCase.kt
│       │   │   │       │   ├── LogoutUseCase.kt
│       │   │   │       │   └── ObserveAuthStateUseCase.kt
│       │   │   │       ├── idea/
│       │   │   │       │   ├── CreateIdeaUseCase.kt
│       │   │   │       │   ├── GetIdeaByIdUseCase.kt
│       │   │   │       │   ├── ListMyIdeasUseCase.kt
│       │   │   │       │   ├── UpdateIdeaUseCase.kt
│       │   │   │       │   └── DeleteIdeaUseCase.kt
│       │   │   │       ├── issue/
│       │   │   │       │   ├── CreateIssueUseCase.kt
│       │   │   │       │   ├── ChangeIssueStatusUseCase.kt
│       │   │   │       │   └── CountMyActiveIssuesUseCase.kt
│       │   │   │       ├── message/
│       │   │   │       │   ├── SendMessageUseCase.kt
│       │   │   │       │   └── ObserveConversationUseCase.kt
│       │   │   │       └── storage/
│       │   │   │           └── UploadAvatarUseCase.kt
│       │   │   │
│       │   │   ├── ui/                         # ----- PRESENTATION LAYER -----
│       │   │   │   ├── theme/
│       │   │   │   │   ├── Color.kt
│       │   │   │   │   ├── Type.kt
│       │   │   │   │   └── Theme.kt
│       │   │   │   ├── navigation/
│       │   │   │   │   ├── RedSharkNavHost.kt
│       │   │   │   │   └── Routes.kt
│       │   │   │   ├── components/             # Reusable composables
│       │   │   │   │   ├── Avatar.kt
│       │   │   │   │   ├── PrimaryButton.kt
│       │   │   │   │   ├── Fab.kt
│       │   │   │   │   ├── SkillChip.kt
│       │   │   │   │   ├── TagChip.kt
│       │   │   │   │   └── EmptyState.kt
│       │   │   │   ├── auth/
│       │   │   │   │   ├── EmailScreen.kt
│       │   │   │   │   ├── PasswordScreen.kt
│       │   │   │   │   ├── RegisterScreen.kt
│       │   │   │   │   └── AuthViewModel.kt
│       │   │   │   ├── home/
│       │   │   │   │   ├── HomeScreen.kt
│       │   │   │   │   └── HomeViewModel.kt
│       │   │   │   ├── idea/
│       │   │   │   │   ├── list/
│       │   │   │   │   ├── detail/
│       │   │   │   │   ├── create/
│       │   │   │   │   └── edit/
│       │   │   │   ├── issue/
│       │   │   │   │   ├── detail/
│       │   │   │   │   ├── create/
│       │   │   │   │   └── edit/
│       │   │   │   ├── messaging/
│       │   │   │   │   ├── list/
│       │   │   │   │   └── conversation/
│       │   │   │   ├── notification/
│       │   │   │   ├── profile/
│       │   │   │   │   ├── view/
│       │   │   │   │   └── edit/
│       │   │   │   └── settings/
│       │   │   │
│       │   │   ├── di/                         # Hilt modules
│       │   │   │   ├── NetworkModule.kt
│       │   │   │   ├── RepositoryModule.kt
│       │   │   │   ├── DispatcherModule.kt
│       │   │   │   └── UseCaseModule.kt
│       │   │   │
│       │   │   ├── util/
│       │   │   │   ├── Resource.kt             # sealed class Success/Error/Loading
│       │   │   │   ├── DispatcherProvider.kt
│       │   │   │   ├── NetworkMonitor.kt
│       │   │   │   └── Logger.kt
│       │   │   │
│       │   │   └── common/
│       │   │       ├── Constants.kt
│       │   │       └── extensions/
│       │   │
│       │   └── res/
│       │       ├── drawable/
│       │       ├── values/
│       │       │   ├── strings.xml
│       │       │   ├── colors.xml
│       │       │   └── themes.xml
│       │       └── mipmap-*/
│       │
│       ├── test/                               # Unit tests
│       │   └── java/com/helios/redshark/
│       │       ├── domain/usecase/
│       │       └── data/repository/
│       │
│       └── androidTest/                        # Instrumentation / UI tests
│           └── java/com/helios/redshark/
│               └── ui/
│
├── buildSrc/                                   # Version catalogs (optional)
├── gradle/
│   └── libs.versions.toml                      # Version catalog
├── dataconnect/                                # FDC schema + connector .gql
│   ├── schema/
│   │   └── schema.gql
│   └── redshark/
│       ├── connector.yaml
│       ├── queries.gql
│       └── mutations.gql
├── docs/                                       # Tài liệu dự án
│   ├── PROJECT_CHARTER.md
│   ├── STRUCTURE.md
│   ├── SCHEMA.md
│   ├── REQUIREMENT-FUNCTIONAL.md
│   ├── REQUIREMENT-NONFUNCTIONAL.md
│   ├── PLAN.md
│   ├── PROCESS-AUTH.md
│   ├── PROCESS-IDEA-ISSUE.md
│   ├── PROCESS-MESSAGING.md
│   ├── CHECK-AUTH.md
│   ├── CHECK-IDEA-ISSUE.md
│   ├── CHECK-MESSAGING.md
│   ├── SECRET.md
│   ├── TIMELINE.md
│   └── REPORT.md
├── .gitignore
├── .editorconfig
├── build.gradle.kts
├── settings.gradle.kts
├── gradle.properties
├── local.properties                            # (gitignored) secrets
├── firebase.json
└── README.md
```

## 2. Giải thích các layer

### 2.1. Data Layer
- **`remote/`** — gọi API ngoài: Firebase Auth, Firebase Data Connect (GraphQL), Cloudflare R2 (S3 SDK).
- **`local/`** — persistence cục bộ: DataStore (preferences), file cache.
- **`repository/`** — implement interface từ `domain/repository`, tổng hợp nhiều data source, trả về domain model.
- **`mapper/`** — chuyển DTO (GraphQL generated) ↔ Domain model, không leak chi tiết backend lên domain.

### 2.2. Domain Layer
- **`model/`** — entity thuần Kotlin, không phụ thuộc Android framework.
- **`repository/`** — interface, do data layer implement.
- **`usecase/`** — mỗi class 1 nhiệm vụ (SRP), expose `operator fun invoke(...)`; là đơn vị test-friendly.

### 2.3. UI Layer
- **`ui/<feature>/`** — mỗi feature có `Screen.kt` (Composable stateless) + `ViewModel.kt` (StateFlow<UiState>) + `UiState.kt`.
- **`navigation/`** — single-activity với `NavHost`, type-safe routes.
- **`components/`** — Composable dùng lại toàn app.
- **`theme/`** — Material3 theme, color scheme, typography.

## 3. Nguyên tắc phụ thuộc (Dependency Rule)
```
ui ─► domain ◄─ data
         ▲
         │ (interface)
      data implements
```
Domain **không** biết gì về Android framework, Firebase, Apollo, R2. Chỉ UI và Data được phép import các SDK bên ngoài.
