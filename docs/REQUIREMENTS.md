# REQUIREMENTS.md — Đặc tả yêu cầu phần mềm RedShark

Tài liệu này mô tả chi tiết **các yêu cầu chức năng** (Functional Requirements — FR) và **các yêu cầu phi chức năng** (Non-Functional Requirements — NFR) của ứng dụng **RedShark**.

- **Phạm vi:** Ứng dụng di động Android trong phạm vi MVP (xem [PROJECT_CHARTER.md](PROJECT_CHARTER.md) mục 4).
- **Đối tượng:** Đội phát triển nhóm NT118.Q22, giảng viên hướng dẫn.
- **Quy ước đánh số:** `FR-<nhóm>-<số>` cho yêu cầu chức năng, `NFR-<loại>-<số>` cho yêu cầu phi chức năng.

---

## Mục lục

1. [Tác nhân hệ thống (Actors)](#1-tác-nhân-hệ-thống-actors)
2. [Yêu cầu chức năng](#2-yêu-cầu-chức-năng)
   - 2.1. [Authentication & Account](#21-authentication--account-fr-auth)
   - 2.2. [Profile & Skill](#22-profile--skill-fr-prf)
   - 2.3. [Idea Management](#23-idea-management-fr-idea)
   - 2.4. [Issue Management](#24-issue-management-fr-iss)
   - 2.5. [Commenting](#25-commenting-fr-cmt)
   - 2.6. [Collaboration](#26-collaboration-fr-col)
   - 2.7. [Messaging](#27-messaging-fr-msg)
   - 2.8. [Notifications](#28-notifications-fr-ntf)
   - 2.9. [Feed & Discovery](#29-feed--discovery-fr-fed)
   - 2.10. [Lookup & Metadata](#210-lookup--metadata-fr-lkp)
3. [Yêu cầu phi chức năng](#3-yêu-cầu-phi-chức-năng)
4. [Ma trận truy vết Yêu cầu ↔ Schema](#4-ma-trận-truy-vết-yêu-cầu--schema)

---

## 1. Tác nhân hệ thống (Actors)

| Tác nhân | Mô tả | Quyền hạn |
|---|---|---|
| **Guest** | Người dùng chưa đăng nhập | Chỉ có thể xem màn hình login/register, gọi các query `PUBLIC` (`ListTags`, `ListSkills`, `GetUser`) |
| **User** | Người dùng đã đăng nhập Firebase Auth | Toàn bộ tính năng MVP: đăng idea, comment, tạo issue (nếu là collaborator), nhắn tin |
| **Author (Idea Owner)** | User là tác giả của idea | Có thêm quyền edit/delete idea, duyệt danh sách collaborator, chuyển trạng thái idea |
| **Collaborator** | User có `auth.uid` nằm trong `ideas.collaboratorIds` của một idea | Có thêm quyền tạo/sửa/xóa issue trong idea đó |
| **System** | Tiến trình tự động (CEL expression) | Tự động set `createdAt`, `request.time`, bind `authorId = auth.uid` |

---

## 2. Yêu cầu chức năng

### 2.1. Authentication & Account (FR-AUTH)

| Mã | Yêu cầu | Mô tả chi tiết | Ưu tiên |
|---|---|---|---|
| **FR-AUTH-01** | Đăng ký bằng email/mật khẩu | User nhập email, displayName, username, password (≥ 8 ký tự, gồm chữ và số); hệ thống kiểm tra email chưa tồn tại, tạo Firebase Auth account + record `users` qua `UpsertUser`. | MUST |
| **FR-AUTH-02** | Đăng nhập bằng email/mật khẩu | User nhập email + password; `signInWithEmailAndPassword` xác thực, `onAuthStateChanged` trigger load profile qua `GetMe`. | MUST |
| **FR-AUTH-03** | Đăng nhập bằng Google | User nhấn nút Google → native popup chọn tài khoản → `signInWithCredential(firebaseAuth, googleCred)` → nếu là lần đầu, tự tạo username và gọi `UpsertUser`. | MUST |
| **FR-AUTH-04** | Kiểm tra email tồn tại trước khi login | Màn hình nhập email đầu tiên: gọi `fetchSignInMethodsForEmail`, nếu đã có → chuyển sang màn password; nếu chưa có → chuyển sang màn register. | SHOULD |
| **FR-AUTH-05** | Đăng xuất | Gọi `signOut(firebaseAuth)`; observer set user = null; điều hướng về màn hình login. | MUST |
| **FR-AUTH-06** | Xóa tài khoản | Gọi `DeleteUser` (xóa record FDC) → `firebaseAuth.currentUser.delete()` → điều hướng về login. | SHOULD |
| **FR-AUTH-07** | Persist session | Firebase Auth SDK tự persist qua AsyncStorage, user không phải login lại sau mỗi lần mở app. | MUST |
| **FR-AUTH-08** | Validate username duy nhất | Không cho phép 2 user trùng username (enforced bởi constraint UNIQUE trên `users.username`). | MUST |

### 2.2. Profile & Skill (FR-PRF)

| Mã | Yêu cầu | Mô tả chi tiết | Ưu tiên |
|---|---|---|---|
| **FR-PRF-01** | Xem profile của chính mình | Dùng `GetMe` để hiển thị `displayName`, `username`, `avatarUrl`, danh sách skill. | MUST |
| **FR-PRF-02** | Xem profile user khác | Dùng `GetUser($id)` để hiển thị profile public (không bao gồm `skillIds`, `createdAt`). | MUST |
| **FR-PRF-03** | Chỉnh sửa profile | Cho phép update `displayName` và `avatarUrl` qua `UpdateUser`. | MUST |
| **FR-PRF-04** | Upload avatar | User chọn ảnh bằng `expo-image-picker` → upload lên Cloudflare R2 → URL trả về được ghi vào `avatarUrl`. | MUST |
| **FR-PRF-05** | Chọn skill cho bản thân | User chọn các skill từ danh sách `ListSkills` (public), lưu vào `users.skillIds`. | SHOULD |
| **FR-PRF-06** | Không cho sửa username | Username được cố định tại thời điểm đăng ký. (`UpdateUser` không nhận `username`.) | MUST |

### 2.3. Idea Management (FR-IDEA)

| Mã | Yêu cầu | Mô tả chi tiết | Ưu tiên |
|---|---|---|---|
| **FR-IDEA-01** | Tạo idea mới | Form nhập `title`, `description`, chọn `tagIds` từ `ListTags`; gọi `CreateIdea`; `authorId` tự bind `auth.uid`, `status` mặc định `ACTIVE`. | MUST |
| **FR-IDEA-02** | Xem danh sách idea của mình | Dùng `ListMyIdeas` — hiển thị các idea `deletedAt IS NULL` do user tạo, sắp xếp theo `lastActivityAt DESC`. | MUST |
| **FR-IDEA-03** | Xem chi tiết một idea | Dùng `GetIdea($id)` — hiển thị full thông tin idea, tags, collaborators, các issue con (qua `ListIssuesByIdea`). | MUST |
| **FR-IDEA-04** | Sửa idea | Chỉ owner được phép; gọi `UpdateIdea($id, $title, $description, $tagIds)`. Server enforce `authorId = auth.uid`. | MUST |
| **FR-IDEA-05** | Xóa mềm idea | Chỉ owner; gọi `DeleteIdea($id)` set `deletedAt = request.time`. Các query về sau sẽ không trả về. | MUST |
| **FR-IDEA-06** | Gắn tag cho idea | Nhiều tag/idea — chọn từ dropdown. Tag chỉ có thể là các id đã tồn tại trong bảng `tags`. | MUST |
| **FR-IDEA-07** | Chuyển trạng thái idea | `ACTIVE` → `CLOSED` hoặc `ACTIVE` → `CANCELLED`. (MVP có thể dùng `UpdateIdea` với field status.) | SHOULD |

### 2.4. Issue Management (FR-ISS)

| Mã | Yêu cầu | Mô tả chi tiết | Ưu tiên |
|---|---|---|---|
| **FR-ISS-01** | Tạo issue trong một idea | User là author hoặc collaborator → form nhập `title`, `content` → gọi `CreateIssue` (transaction cập nhật `lastActivityAt` của idea cha). | MUST |
| **FR-ISS-02** | Chỉ cho tạo khi issue đang active < 20 | Trước khi cho vào màn create, client gọi `CountMyActiveIssues`; nếu `result ≥ 20`, chặn và hiển thị thông báo. | MUST |
| **FR-ISS-03** | Xem danh sách issue của mình | Dùng `ListMyIssues` — các issue `authorId = auth.uid AND deletedAt IS NULL`. | MUST |
| **FR-ISS-04** | Xem danh sách issue của một idea | Dùng `ListIssuesByIdea($ideaId)`. | MUST |
| **FR-ISS-05** | Xem chi tiết một issue | Dùng `GetIssue($id)`. | MUST |
| **FR-ISS-06** | Sửa issue | Chỉ owner + trạng thái `OPEN`; gọi `UpdateIssue($id, $title, $content)`. Server enforce điều kiện này. | MUST |
| **FR-ISS-07** | Xóa mềm issue | Chỉ owner + trạng thái `OPEN`; gọi `DeleteIssue($id)`. | MUST |
| **FR-ISS-08** | Chuyển trạng thái issue | Gọi `UpdateIssueStatus($id, $status)`. Client enforce state machine hợp lệ: `OPEN → IN_PROGRESS → CLOSED`, hoặc `OPEN → CANCELLED`. | MUST |
| **FR-ISS-09** | Issue phải thuộc idea chưa bị xóa | Khi tạo issue, transaction check idea cha không bị soft-delete. | MUST |

### 2.5. Commenting (FR-CMT)

| Mã | Yêu cầu | Mô tả chi tiết | Ưu tiên |
|---|---|---|---|
| **FR-CMT-01** | Đăng comment trên idea | User đã đăng nhập có thể comment trên bất kỳ idea public nào. | MUST |
| **FR-CMT-02** | Xem danh sách comment | Hiển thị các comment `deletedAt IS NULL` của một idea, sắp xếp theo `createdAt ASC`. | MUST |
| **FR-CMT-03** | Xóa comment của chính mình | Soft delete comment (set `deletedAt = request.time`). Không cho phép xóa comment người khác. | SHOULD |
| **FR-CMT-04** | Không hỗ trợ reply lồng | Flat thread — không có nested comment trong MVP. | — |

### 2.6. Collaboration (FR-COL)

| Mã | Yêu cầu | Mô tả chi tiết | Ưu tiên |
|---|---|---|---|
| **FR-COL-01** | Xem danh sách collaborator của một idea | Hiển thị các user có ID nằm trong `ideas.collaboratorIds`. | MUST |
| **FR-COL-02** | Gửi yêu cầu collab | User nhấn nút "Request to collaborate" → gửi notification cho author với `type = "COLLAB_REQUEST"` và `targetId = ideaId`. | SHOULD |
| **FR-COL-03** | Chấp thuận/từ chối request | Author mở notification → nhấn chấp thuận → thêm requester_id vào `ideas.collaboratorIds` qua `UpdateIdea`. | SHOULD |
| **FR-COL-04** | Chỉ collaborator được tạo issue | Client kiểm tra `auth.uid` có trong `collaboratorIds` hoặc là `authorId` trước khi cho phép vào form tạo issue. | MUST |

### 2.7. Messaging (FR-MSG)

| Mã | Yêu cầu | Mô tả chi tiết | Ưu tiên |
|---|---|---|---|
| **FR-MSG-01** | Tạo cuộc trò chuyện 1-1 | Khi user A nhấn "Nhắn tin" ở profile user B → tạo `conversations` với `type = "DIRECT"`, `participantIds = [A.uid, B.uid]` (nếu chưa tồn tại). | MUST |
| **FR-MSG-02** | Gửi tin nhắn văn bản | Insert vào `messages` với `messageType = "TEXT"`, đồng thời cập nhật `conversations.lastMessageAt`. | MUST |
| **FR-MSG-03** | Xem danh sách conversation của mình | Liệt kê các conversation có `auth.uid` trong `participantIds`, sắp xếp theo `lastMessageAt DESC`. | MUST |
| **FR-MSG-04** | Xem tin nhắn trong conversation | Liệt kê messages `deletedAt IS NULL` theo `createdAt ASC`. | MUST |
| **FR-MSG-05** | Xóa tin nhắn của mình | Soft delete — set `deletedAt = request.time`. | SHOULD |
| **FR-MSG-06** | Group chat | **Ngoài phạm vi MVP.** | — |

### 2.8. Notifications (FR-NTF)

| Mã | Yêu cầu | Mô tả chi tiết | Ưu tiên |
|---|---|---|---|
| **FR-NTF-01** | Nhận thông báo in-app | Insert vào `notifications` với `recipientId`, `actorId`, `type`, `targetId`. Các loại: `COMMENT`, `COLLAB_REQUEST`, `ISSUE_CREATED`, `MESSAGE`. | MUST |
| **FR-NTF-02** | Xem danh sách thông báo | Liệt kê notifications của `recipientId = auth.uid`, sắp xếp `createdAt DESC`. | MUST |
| **FR-NTF-03** | Đánh dấu đã đọc | Update `isRead = true`. | MUST |
| **FR-NTF-04** | Đếm số thông báo chưa đọc | Hiển thị badge trên icon thông báo. | SHOULD |
| **FR-NTF-05** | Push notification (FCM) | **Ngoài phạm vi MVP.** | — |

### 2.9. Feed & Discovery (FR-FED)

| Mã | Yêu cầu | Mô tả chi tiết | Ưu tiên |
|---|---|---|---|
| **FR-FED-01** | Home feed — các issue OPEN | Dùng `ListOpenIssues`, lọc bỏ issue của chính user (client-side), sắp xếp `createdAt DESC`. | MUST |
| **FR-FED-02** | Pull-to-refresh | Cho phép kéo xuống để refresh feed. React Query `refetch()`. | MUST |
| **FR-FED-03** | Card hiển thị thông tin tóm tắt | Mỗi card issue có: title, content (truncate), author (avatar + displayName), idea cha. | MUST |
| **FR-FED-04** | Nhấn card để xem chi tiết | Navigation đến trang `issue/[id]`. | MUST |

### 2.10. Lookup & Metadata (FR-LKP)

| Mã | Yêu cầu | Mô tả chi tiết | Ưu tiên |
|---|---|---|---|
| **FR-LKP-01** | Danh sách tag (public) | `ListTags` — public query, không cần đăng nhập. | MUST |
| **FR-LKP-02** | Danh sách skill (public) | `ListSkills` — public query. | MUST |
| **FR-LKP-03** | Admin seed data | Dev/admin seed `tags` và `skills` qua `scripts/query.js seed`. | MUST |

---

## 3. Yêu cầu phi chức năng

### 3.1. Performance (NFR-PERF)

| Mã | Yêu cầu |
|---|---|
| **NFR-PERF-01** | Thời gian load màn hình home feed ≤ 2 giây trên mạng 4G ổn định (sau cache hit: < 500ms). |
| **NFR-PERF-02** | React Query phải cache kết quả query và re-use; invalidate tự động sau mutation. |
| **NFR-PERF-03** | Thao tác tạo idea/issue phản hồi trong ≤ 1 giây. |
| **NFR-PERF-04** | Không render list dài hơn 100 item không phân trang (dùng `FlatList`). |

### 3.2. Security (NFR-SEC)

| Mã | Yêu cầu |
|---|---|
| **NFR-SEC-01** | Không lưu password hoặc token thô trên client. Firebase SDK tự quản lý qua AsyncStorage mã hóa. |
| **NFR-SEC-02** | Mọi mutation/query đều phải có directive `@auth(level: USER)` (trừ lookup public). |
| **NFR-SEC-03** | Ownership check được enforce server-side qua CEL expression (`authorId: { eq_expr: "auth.uid" }`). Client **không** thể bypass. |
| **NFR-SEC-04** | File `.env.local`, `serviceAccountKey.json` KHÔNG được commit (đã nằm trong `.gitignore`). |
| **NFR-SEC-05** | API key của Firebase (web config) có thể public — được bảo vệ qua Firebase App Check và auth rules. |
| **NFR-SEC-06** | Upload avatar phải validate content-type và giới hạn kích thước ≤ 5MB. |

### 3.3. Usability (NFR-USE)

| Mã | Yêu cầu |
|---|---|
| **NFR-USE-01** | UI tiếng Việt, font dễ đọc (Lexend), theme sáng mặc định. |
| **NFR-USE-02** | Tất cả action quan trọng (xóa, logout) phải có dialog xác nhận. |
| **NFR-USE-03** | Mọi form có inline validation với thông báo lỗi rõ ràng. |
| **NFR-USE-04** | Mọi thao tác load dài > 500ms phải có loading indicator. |
| **NFR-USE-05** | Toast/snackbar báo thành công/thất bại cho mọi mutation. |

### 3.4. Reliability (NFR-REL)

| Mã | Yêu cầu |
|---|---|
| **NFR-REL-01** | Ứng dụng không crash trong các luồng chính — xử lý try/catch mọi mutation. |
| **NFR-REL-02** | Mất kết nối: hiển thị banner "Mất kết nối" và cho phép retry. |
| **NFR-REL-03** | React Query tự retry query thất bại 1 lần. |
| **NFR-REL-04** | Dữ liệu cache phải được invalidate sau mutation liên quan (dùng `queryKeys.ts`). |

### 3.5. Maintainability (NFR-MNT)

| Mã | Yêu cầu |
|---|---|
| **NFR-MNT-01** | Code TypeScript strict mode; không có `any` ngoài chỗ không tránh được. |
| **NFR-MNT-02** | Schema là nguồn sự thật — mọi thay đổi CSDL phải qua `schema.gql` + deploy. |
| **NFR-MNT-03** | SDK được regen bằng `firebase dataconnect:sdk:generate` sau mỗi lần sửa `.gql`. |
| **NFR-MNT-04** | Chạy `npm run lint` pass trước mỗi commit. |
| **NFR-MNT-05** | Cấu trúc thư mục theo chuẩn Expo Router: `app/` cho routes, `components/` cho UI, `services/` cho side-effect, `contexts/` cho state. |

### 3.6. Portability (NFR-PRT)

| Mã | Yêu cầu |
|---|---|
| **NFR-PRT-01** | Chạy được trên Android API 24+ (tương đương Android 7.0). |
| **NFR-PRT-02** | Hỗ trợ cả emulator (Google APIs image) và thiết bị thật. |
| **NFR-PRT-03** | iOS build — ngoài phạm vi MVP nhưng codebase không được dùng API Android-only trừ trường hợp bắt buộc. |

### 3.7. Scalability (NFR-SCA)

| Mã | Yêu cầu |
|---|---|
| **NFR-SCA-01** | Schema phải cho phép thêm các bảng mới (ví dụ: `groups`, `reactions`) mà không cần migrate dữ liệu hiện có. |
| **NFR-SCA-02** | Tất cả query phải có mệnh đề `orderBy` rõ ràng để về sau có thể phân trang. |
| **NFR-SCA-03** | Tránh N+1 query: dùng nested field của GraphQL (`issues { author { ... } }`). |

### 3.8. Ràng buộc môi trường (NFR-ENV)

| Mã | Yêu cầu |
|---|---|
| **NFR-ENV-01** | Node 22+, Firebase CLI, Expo CLI, Android Studio cài sẵn. |
| **NFR-ENV-02** | Biến môi trường trong `.env.local` (không commit). |
| **NFR-ENV-03** | `serviceAccountKey.json` chỉ dùng cho CLI deploy, không bundle vào app. |
| **NFR-ENV-04** | Khu vực Cloud SQL: `asia-southeast1` (Singapore) để giảm latency từ VN. |

---

## 4. Ma trận truy vết Yêu cầu ↔ Schema

Bảng dưới đây ánh xạ các FR quan trọng tới các bảng, query, mutation trong schema FDC.

| FR | Bảng liên quan | Query / Mutation |
|---|---|---|
| FR-AUTH-01 | `users` | `UpsertUser` |
| FR-AUTH-02 | `users` | `GetMe` (sau đăng nhập Firebase Auth) |
| FR-AUTH-03 | `users` | `UpsertUser`, `GetMe` |
| FR-AUTH-06 | `users` | `DeleteUser` |
| FR-PRF-01 | `users` | `GetMe` |
| FR-PRF-02 | `users` | `GetUser` |
| FR-PRF-03 | `users` | `UpdateUser` |
| FR-PRF-05 | `users`, `skills` | `UpdateUser`, `ListSkills` |
| FR-IDEA-01 | `ideas` | `CreateIdea`, `ListTags` |
| FR-IDEA-02 | `ideas` | `ListMyIdeas` |
| FR-IDEA-03 | `ideas`, `issues` | `GetIdea`, `ListIssuesByIdea` |
| FR-IDEA-04 | `ideas` | `UpdateIdea` |
| FR-IDEA-05 | `ideas` | `DeleteIdea` |
| FR-ISS-01 | `issues`, `ideas` | `CreateIssue` (transaction) |
| FR-ISS-02 | `issues` | `CountMyActiveIssues` |
| FR-ISS-03 | `issues` | `ListMyIssues` |
| FR-ISS-04 | `issues` | `ListIssuesByIdea` |
| FR-ISS-05 | `issues` | `GetIssue` |
| FR-ISS-06 | `issues` | `UpdateIssue` |
| FR-ISS-07 | `issues` | `DeleteIssue` |
| FR-ISS-08 | `issues` | `UpdateIssueStatus` |
| FR-CMT-01, 02, 03 | `comments` | `CreateComment` (transaction), `ListCommentsByIdea`, `DeleteComment` |
| FR-COL-02 | `notifications` | `CreateNotification` (type = COLLAB_REQUEST) |
| FR-COL-03 | `ideas`, `notifications` | `GetIdea`, `UpdateIdea` (collaboratorIds), `CreateNotification` (type = COLLAB_ACCEPTED) |
| FR-MSG-01 | `conversations` | `CreateConversation`, `ListMyConversations` (dedup check) |
| FR-MSG-02 | `messages`, `conversations` | `SendMessage` (transaction) |
| FR-MSG-03 | `conversations` | `ListMyConversations` |
| FR-MSG-04 | `messages` | `ListMessagesByConversation` |
| FR-NTF-01 | `notifications` | `CreateNotification` |
| FR-NTF-02 | `notifications` | `ListMyNotifications` |
| FR-NTF-03 | `notifications` | `MarkNotificationRead` |
| FR-NTF-04 | `notifications` | `CountUnreadNotifications` |
| FR-FED-01 | `issues` | `ListOpenIssues` |
| FR-LKP-01, 02 | `tags`, `skills` | `ListTags`, `ListSkills` |
