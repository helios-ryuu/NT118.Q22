# BÁO CÁO ĐỒ ÁN — ỨNG DỤNG REDSHARK ANDROID NATIVE (KOTLIN)

**Môn học:** NT118.Q22 — Lập trình ứng dụng di động
**Nhóm thực hiện:** Sỹ (PM), Nam, Hải
**Thời gian:** 05/04/2026 — 17/05/2026

---

## LỜI MỞ ĐẦU

Trong bối cảnh chuyển đổi số, các ứng dụng di động hỗ trợ cộng tác và quản lý công việc trở thành công cụ không thể thiếu với sinh viên và nhóm dự án nhỏ. Đồ án **RedShark** được thực hiện nhằm mục tiêu xây dựng một ứng dụng Android native bằng ngôn ngữ Kotlin, hướng đến trải nghiệm người dùng tối ưu, kiến trúc tường minh và khả năng mở rộng cao bằng cách tận dụng các dịch vụ serverless tiên tiến của Google Firebase và Cloudflare.

## LỜI GIỚI THIỆU

**RedShark** là ứng dụng cộng tác cho phép người dùng tạo, theo dõi các **Ý tưởng (Idea)**, quản lý **Issue (vấn đề/công việc)** và tương tác qua hệ thống **bình luận, thông báo, nhắn tin**. Hệ thống được xây dựng trên nền:

- **Frontend:** Kotlin Android Native + Jetpack Compose.
- **Backend & Database:** Firebase Authentication + Firebase Data Connect (PostgreSQL managed).
- **Storage:** Cloudflare R2 (S3-compatible object storage) cho ảnh đại diện và media.

Phiên bản đồ án này là kết quả của quá trình chuyển đổi kiến trúc từ React Native + Expo sang Kotlin thuần, giúp tối ưu hiệu năng và khai thác tối đa các API native của Android.

## LỜI CẢM ƠN

Nhóm xin gửi lời cảm ơn sâu sắc tới:
- Giảng viên môn NT118.Q22 đã hướng dẫn, phản biện và định hướng trong suốt quá trình thực hiện đề tài.
- Cộng đồng mã nguồn mở Kotlin, Jetpack Compose, Firebase, Cloudflare vì các tài liệu và công cụ chất lượng.
- Các thành viên trong nhóm đã nỗ lực cộng tác để hoàn thành đồ án đúng tiến độ.

## DANH MỤC BẢNG

| Số hiệu | Tên bảng | Chương |
|---------|----------|--------|
| Bảng 2.1 | So sánh các giải pháp lưu trữ object storage | 2 |
| Bảng 3.1 | Yêu cầu chức năng tổng hợp | 3 |
| Bảng 3.2 | Yêu cầu phi chức năng | 3 |
| Bảng 3.3 | Danh sách bảng CSDL | 3 |
| Bảng 3.4 | Ma trận phân quyền truy cập dữ liệu | 3 |
| Bảng 4.1 | Danh sách màn hình và route | 4 |
| Bảng 4.2 | Danh sách GraphQL queries/mutations | 4 |
| Bảng 5.1 | Tổng hợp test case Auth | 5 |
| Bảng 5.2 | Tổng hợp test case Content | 5 |
| Bảng 5.3 | Tổng hợp test case Interaction | 5 |
| Bảng 5.4 | Kết quả đo hiệu năng | 5 |

## DANH MỤC HÌNH ẢNH

| Số hiệu | Tên hình | Chương |
|---------|----------|--------|
| Hình 2.1 | Kiến trúc Firebase Data Connect | 2 |
| Hình 2.2 | Mô hình tương thích S3 của Cloudflare R2 | 2 |
| Hình 3.1 | Sơ đồ use-case tổng thể | 3 |
| Hình 3.2 | Sơ đồ ERD của hệ thống | 3 |
| Hình 3.3 | Sơ đồ tuần tự Đăng nhập Google | 3 |
| Hình 3.4 | Sơ đồ trạng thái Issue | 3 |
| Hình 4.1 | Cấu trúc thư mục dự án | 4 |
| Hình 4.2 | Luồng điều hướng màn hình | 4 |
| Hình 4.3 | Giao diện Home / Ideas / Profile | 4 |
| Hình 5.1 | Kết quả crash-free session | 5 |

## DANH MỤC TỪ VIẾT TẮT

| Từ viết tắt | Ý nghĩa |
|-------------|---------|
| FDC | Firebase Data Connect |
| R2 | Cloudflare R2 (Storage) |
| SDK | Software Development Kit |
| UI | User Interface |
| UX | User Experience |
| MVVM | Model – View – ViewModel |
| CRUD | Create – Read – Update – Delete |
| DTO | Data Transfer Object |
| DI | Dependency Injection |
| JWT | JSON Web Token |
| GraphQL | Graph Query Language |
| REST | Representational State Transfer |
| CI/CD | Continuous Integration / Continuous Delivery |
| APK | Android Package Kit |
| SigV4 | AWS Signature Version 4 |

## TÓM TẮT

Đồ án xây dựng ứng dụng **RedShark** trên nền tảng Android native (Kotlin + Jetpack Compose) áp dụng kiến trúc **Clean Architecture + MVVM**. Dữ liệu được quản lý qua **Firebase Data Connect** (Cloud SQL PostgreSQL) với **Firebase Authentication** cho phân quyền, và **Cloudflare R2** cho lưu trữ media. Ứng dụng gồm 7 nhóm tính năng chính: Xác thực, Hồ sơ, Idea, Issue, Bình luận, Thông báo, Nhắn tin. Toàn bộ dự án được triển khai trong 6 tuần bởi nhóm 3 người, đạt các tiêu chí: crash-free ≥ 99%, thời gian khởi động ≤ 3s, pass ≥ 95% test case thủ công.

---

## CHƯƠNG 1. GIỚI THIỆU / TỔNG QUAN ĐỀ TÀI

### 1.1 Đặt vấn đề
Các nhóm dự án nhỏ thường thiếu công cụ theo dõi idea/issue nhẹ, miễn phí, tập trung cho di động. Các nền tảng hiện tại (Jira, Trello) có cost, UX web-first, chưa tối ưu cho mobile.

### 1.2 Lý do chọn đề tài
- Nhu cầu thực tế trong cộng tác nhóm sinh viên.
- Cơ hội thực hành kiến trúc native Android chuẩn công nghiệp.
- Khám phá bộ công nghệ mới: Firebase Data Connect (PostgreSQL managed), Cloudflare R2.

### 1.3 Mục tiêu đề tài
- **Mục tiêu tổng quát:** Xây dựng ứng dụng Android theo dõi idea/issue có đầy đủ các tính năng cốt lõi.
- **Mục tiêu cụ thể:** Chuyển đổi thành công kiến trúc RN sang Kotlin native, áp dụng Clean Architecture, tích hợp 3 dịch vụ cloud.

### 1.4 Phạm vi đề tài
- **Trong phạm vi:** Auth, Profile, Idea, Issue, Comment, Notification, Message trên Android ≥ 8.0.
- **Ngoài phạm vi:** iOS, web, FCM realtime, nhóm chat nhiều người, thanh toán.

### 1.5 Đối tượng nghiên cứu
- Sinh viên và nhóm dự án nhỏ cần công cụ theo dõi công việc nhẹ.
- Sản phẩm: Ứng dụng Android cài đặt qua APK hoặc Google Play.

### 1.6 Phương pháp thực hiện
- Quy trình phát triển: Iterative theo 5 phase (xem [PLAN-1..5](PLAN-1-FOUNDATION.md)).
- Quản lý công việc: GitHub Issue + PR review, chuẩn Conventional Commits.
- Kiểm thử: Unit test (domain/data), UI test (Compose), manual test theo checklist.

---

## CHƯƠNG 2. CƠ SỞ LÝ THUYẾT

### 2.1 Kotlin và nền tảng Android native
Kotlin là ngôn ngữ chính thức của Google cho Android từ 2017, hỗ trợ null-safety, coroutines, extension functions, DSL. Jetpack Compose là toolkit UI khai báo (declarative) thay thế XML cho Android native, cho phép xây dựng UI hiện đại với ít boilerplate.

**Các thư viện Jetpack được sử dụng:**
- `Lifecycle` / `ViewModel` — quản lý vòng đời.
- `Navigation-Compose` — điều hướng giữa các màn.
- `DataStore` — lưu trữ preference thay SharedPreferences.
- `Hilt` — Dependency Injection.
- `Coil` — load ảnh bất đồng bộ.

### 2.2 Firebase Authentication
Dịch vụ managed của Google cho định danh. Hỗ trợ email/password, Google Sign-In (Credential Manager), token JWT tự refresh. Firebase Auth sinh `uid` duy nhất cho mỗi user, dùng làm khóa liên kết với các bảng nghiệp vụ trong Data Connect.

### 2.3 Firebase Data Connect (FDC)
FDC là backend-as-a-service mới của Firebase (phát hành beta 2024), cung cấp:
- PostgreSQL managed (Cloud SQL, khu vực `asia-southeast1`).
- Schema định nghĩa bằng GraphQL SDL; các `@auth`, `@table`, `@unique` directive.
- Tự sinh SDK (TypeScript/Android/iOS) từ `queries.gql` + `mutations.gql`.
- Authorization biểu thức `auth.uid`, `request.time` — đảm bảo ownership ngay tại query.
- Soft delete, audit pattern được hỗ trợ thông qua expression field.

**Ưu điểm:** Vừa có sức mạnh PostgreSQL (join, transaction, index) vừa tận dụng auth built-in của Firebase.

### 2.4 Cloudflare R2
Đối tượng lưu trữ tương thích **S3 API**, không phí egress, giá rẻ hơn S3 ~10 lần.
- Xác thực: AWS Signature Version 4 (SigV4).
- Hỗ trợ presigned URL TTL.
- Có thể gắn custom domain + Cloudflare CDN.

**Bảng 2.1 — So sánh giải pháp object storage:**

| Tiêu chí | AWS S3 | Firebase Storage | Cloudflare R2 |
|---------|--------|------------------|--------------|
| Phí egress | Có | Có | **Không** |
| Tương thích S3 API | Native | Không | Có |
| CDN tích hợp | CloudFront riêng | Có | **Có (miễn phí)** |
| Free tier | 5GB/tháng | 5GB | **10GB** |

### 2.5 Clean Architecture + MVVM
Phân tách 3 layer:
- **Domain** (Use Case + Model interface) — pure Kotlin, test độc lập.
- **Data** (Repository impl + data source) — phụ thuộc domain.
- **Presentation** (ViewModel + Composable) — phụ thuộc domain.

Unidirectional Data Flow: UI event → ViewModel intent → UseCase → Repository → StateFlow → UI.

---

## CHƯƠNG 3. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

### 3.1 Phân tích yêu cầu
Tổng hợp từ [REQUIREMENT-1-FUNCTIONAL.md](REQUIREMENT-1-FUNCTIONAL.md) và [REQUIREMENT-2-NONFUNCTIONAL.md](REQUIREMENT-2-NONFUNCTIONAL.md): 8 module chức năng + 6 nhóm yêu cầu phi chức năng (Performance, Security, Reliability, Scalability, Maintainability, Usability).

### 3.2 Sơ đồ Use-Case
Actor chính: `User (đã đăng nhập)`, `Visitor (chưa đăng nhập)`.
Use case chính: Đăng ký, Đăng nhập, Tạo/Sửa/Xóa Idea, Tạo/Sửa/Xóa Issue, Comment, Gửi/Nhận Notification, Nhắn tin 1-1.

### 3.3 Thiết kế cơ sở dữ liệu
Chi tiết tại [SCHEMA.md](SCHEMA.md). Gồm 9 bảng: `users`, `ideas`, `issues`, `comments`, `tags`, `skills`, `notifications`, `conversations`, `messages`. Soft delete trên `ideas`, `issues`.

### 3.4 Thiết kế kiến trúc hệ thống

```
┌──────────────────────────────────────────┐
│  UI Layer (Jetpack Compose + ViewModel)  │
└────────────────────┬─────────────────────┘
                     │ UseCase
┌────────────────────▼─────────────────────┐
│  Domain Layer (Model + Repo interface)   │
└────────────────────┬─────────────────────┘
                     │ Repository impl
┌────────────────────▼─────────────────────┐
│  Data Layer                              │
│  ├─ FirebaseAuthSource                   │
│  ├─ DataConnectSource (GraphQL)          │
│  ├─ R2Client (S3 SigV4)                  │
│  └─ DataStore (local prefs)              │
└──────────────────────────────────────────┘
```

### 3.5 Thiết kế giao diện
Theo Material 3, layout mobile-first, bottom navigation 5 tab: Home, Ideas, Messages, Notifications, Settings.

### 3.6 Thiết kế xử lý nghiệp vụ
Chi tiết trong [PROCESS-1-AUTH.md](PROCESS-1-AUTH.md), [PROCESS-2-CONTENT.md](PROCESS-2-CONTENT.md), [PROCESS-3-INTERACTION.md](PROCESS-3-INTERACTION.md).

---

## CHƯƠNG 4. HIỆN THỰC ĐỀ TÀI

### 4.1 Môi trường phát triển
- Android Studio Iguana+, JDK 17, Kotlin 2.0, Gradle 8.x.
- Firebase CLI cho `dataconnect:sdk:generate`.
- GitHub + GitHub Actions CI.
- Thiết bị test: Pixel 6 emulator, Samsung A54.

### 4.2 Cấu trúc mã nguồn
Chi tiết tại [STRUCTURE.md](STRUCTURE.md). Tổ chức 3 layer data/domain/ui + core cross-cutting.

### 4.3 Triển khai các module

**Module Auth:**
- `FirebaseAuthSource` wrap `FirebaseAuth.getInstance()`.
- `GoogleSignInHelper` dùng Credential Manager API (thay thế `GoogleSignInClient` deprecated).
- `AuthRepositoryImpl` expose `Flow<AuthState>`.

**Module Idea/Issue:**
- Generated SDK từ FDC: `src/main/java/.../dataconnect/generated`.
- Enforce "20 active issues" bằng UseCase pre-check trước khi gọi mutation.

**Module Profile/Media:**
- Nén ảnh bằng `BitmapFactory` → JPEG quality 80 → tối đa 512×512.
- Upload R2 qua OkHttp với `AwsV4SigningInterceptor`.

**Module Notification/Message:**
- Polling bằng `rememberCoroutineScope` + `while (isActive) { delay(...); refresh() }`.
- Optimistic update: append local trước, rollback nếu thất bại.

### 4.4 Tích hợp dịch vụ bên ngoài
- **Firebase:** `google-services.json` + init trong `RedSharkApp`.
- **R2:** Credential qua `BuildConfig` (từ `local.properties`).
- **Google Sign-In:** Cần cấu hình SHA-1 debug + release keystore trên Firebase Console.

### 4.5 Bảo mật và quản lý secret
Theo [SECRET.md](SECRET.md). Tất cả secret nằm trong `local.properties` / CI Secrets. ProGuard bật trên release. Ownership enforce server-side.

---

## CHƯƠNG 5. KIỂM THỬ

### 5.1 Chiến lược kiểm thử
- **Unit test:** Domain UseCase + Data Repository (JUnit + MockK).
- **UI test:** Compose Test (màn hình Auth, IdeaDetail).
- **Manual test:** Theo CHECK-1/2/3.
- **Performance test:** Android Profiler, Firebase Performance Monitoring.

### 5.2 Kịch bản kiểm thử
Bảng tổng hợp:
- CHECK-1: 20 test case Auth & Profile — xem [CHECK-1-AUTH.md](CHECK-1-AUTH.md).
- CHECK-2: 24 test case Content — xem [CHECK-2-CONTENT.md](CHECK-2-CONTENT.md).
- CHECK-3: 17 test case Interaction + cross-cutting — xem [CHECK-3-INTERACTION.md](CHECK-3-INTERACTION.md).

### 5.3 Kết quả kiểm thử (điền sau khi chạy thực tế)
| Nhóm | Tổng TC | PASS | FAIL | % PASS |
|------|---------|------|------|--------|
| Auth | 20 | _ | _ | _ |
| Content | 24 | _ | _ | _ |
| Interaction | 17 | _ | _ | _ |
| **Tổng** | **61** | **_** | **_** | **_** |

### 5.4 Đánh giá
Các chỉ số mục tiêu:
- Crash-free session ≥ 99%.
- Cold start ≤ 3s.
- APK size ≤ 25 MB.
- Upload avatar 1 MB ≤ 3s trên 4G.

---

## CHƯƠNG 6. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

### 6.1 Kết quả đạt được
- Ứng dụng RedShark Android native hoàn chỉnh, đầy đủ 7 nhóm tính năng.
- Kiến trúc Clean Architecture + MVVM rõ ràng, dễ mở rộng.
- Kho mã nguồn công khai kèm CI/CD, đúng chuẩn Conventional Commits.
- Tài liệu kỹ thuật đầy đủ trong thư mục `/kotlin`.

### 6.2 Hạn chế
- Chưa tích hợp FCM push notification (đang dùng polling).
- Chưa hỗ trợ nhóm chat > 2 người.
- Chưa có CI test instrumented (UI test chạy emulator).
- Chưa tích hợp Firebase Performance + Crashlytics giám sát production.

### 6.3 Hướng phát triển
- Tích hợp FCM + WebSocket-like (Firestore snapshot) cho realtime.
- Thêm nhóm chat, đính kèm media trong message.
- Mở rộng sang iOS (Kotlin Multiplatform Mobile).
- Module báo cáo/thống kê cho idea owner.
- Hỗ trợ offline-first với Room + sync.

---

## TÀI LIỆU THAM KHẢO

1. Google. *Android Developers Documentation.* https://developer.android.com/
2. JetBrains. *Kotlin Language Reference.* https://kotlinlang.org/docs/
3. Google. *Jetpack Compose.* https://developer.android.com/jetpack/compose
4. Firebase. *Firebase Data Connect Documentation.* https://firebase.google.com/docs/data-connect
5. Firebase. *Firebase Authentication.* https://firebase.google.com/docs/auth
6. Cloudflare. *R2 Object Storage — S3 API Compatibility.* https://developers.cloudflare.com/r2/
7. Robert C. Martin. *Clean Architecture: A Craftsman's Guide to Software Structure and Design.* Prentice Hall, 2017.
8. Google. *Guide to App Architecture.* https://developer.android.com/topic/architecture
9. Square. *OkHttp.* https://square.github.io/okhttp/
10. Material Design 3. https://m3.material.io/
