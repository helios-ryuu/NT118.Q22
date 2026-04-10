# PROJECT CHARTER — RedShark

> **Mã môn học:** NT118.Q22 — Phát triển ứng dụng trên thiết bị di động
> **Trường:** Đại học Công nghệ Thông tin — ĐHQG TP.HCM
> **Học kỳ:** HK2 năm học 2025–2026
> **Giảng viên hướng dẫn:** ThS. Trần Hồng Nghi

---

## 1. Project Overview

| Hạng mục | Nội dung |
|---|---|
| **Tên dự án** | **RedShark** |
| **Loại dự án** | Ứng dụng di động Android (đồ án môn học) |
| **Project Manager (PM)** | Ngô Tiến Sỹ (MSSV: 23521367) |
| **Ngày bắt đầu** | 16/03/2026 |
| **Ngày kết thúc dự kiến** | 17/05/2026 |
| **Thời lượng** | ~9 tuần |
| **Nhóm thực hiện** | 3 thành viên |
| **Repository** | `NT118.Q22` (GitHub) |

### Thành viên nhóm

| STT | MSSV | Họ và tên | Vai trò |
|---|---|---|---|
| 1 | 23521367 | Ngô Tiến Sỹ | Project Manager, Full-stack Developer, DevOps |
| 2 | 24520442 | Phạm Tuấn Hải | Frontend Developer, UI/UX |
| 3 | 23520982 | Nguyễn Văn Nam | Frontend Developer, Tester |

---

## 2. Project Summary

**RedShark** là một ứng dụng **mạng xã hội đóng góp ý tưởng** chạy trên nền tảng Android. Ứng dụng hướng tới việc tạo ra một cộng đồng nơi người dùng có thể:

- Xây dựng **profile cá nhân** với thông tin, avatar, các kỹ năng (skills) nổi bật của bản thân.
- **Đăng ý tưởng (Idea)** lên feed công khai để cộng đồng có thể xem, bình luận, và xin được tham gia đóng góp.
- **Yêu cầu trở thành collaborator** của một idea thuộc người khác; khi được chủ idea chấp thuận, họ được quyền **đăng các issue** (các vấn đề, task, chủ đề thảo luận nhỏ) và thảo luận xoay quanh việc hiện thực hóa idea đó.
- **Người dùng thông thường** (không phải collaborator) có thể theo dõi trạng thái của các idea public, **bình luận** để góp ý, nhưng không thể đăng issue.
- **Feed** hiển thị các idea/issue mới theo thời gian, theo tag quan tâm.
- **Nhắn tin 1-1** (direct message) giữa các user để trao đổi riêng.

Ứng dụng sử dụng kiến trúc **serverless**: không có backend server tự viết, toàn bộ business logic và persistence nằm ở Firebase Authentication + Firebase Data Connect (Cloud SQL PostgreSQL). Client React Native gọi trực tiếp GraphQL SDK sinh tự động để thao tác dữ liệu.

---

## 3. Business Case

### 3.1. Vấn đề

- **Ý tưởng chết non:** Sinh viên, developer, người trẻ khởi nghiệp thường có rất nhiều ý tưởng sản phẩm nhưng không có công cụ phù hợp để ghi lại, trình bày, và tìm kiếm cộng sự. Các công cụ hiện có (Notion, Trello, GitHub Issues) thiên về **quản lý dự án** chứ không có tính **xã hội** — khó phát hiện ý tưởng của người khác để tham gia.
- **Thiếu kênh kết nối theo sở thích kỹ thuật:** Facebook Groups/Reddit là kênh thảo luận chung, không cấu trúc, ý tưởng bị trôi nhanh và không có cơ chế trạng thái (ai đang làm gì, đã làm đến đâu).
- **Không có công cụ trung gian giữa “brainstorm” và “project management”:** Các ý tưởng mới thường chưa đủ độ chín để lập một repo GitHub hoặc một project Jira, nhưng vẫn cần một nơi để nuôi dưỡng và tìm cộng tác viên.

### 3.2. Giải pháp

**RedShark** định vị mình ở **khoảng giữa mạng xã hội và công cụ quản lý dự án nhẹ**:

- **Idea-first:** Người dùng đăng idea dưới dạng một post ngắn (title + description + tags), tương tự một bài đăng mạng xã hội. Mỗi idea có vòng đời trạng thái (`ACTIVE` → `CLOSED` / `CANCELLED`).
- **Collaboration có cấu trúc:** Mỗi idea có một danh sách collaborator rõ ràng; collaborator được phép thêm các **issue** (task nhỏ) và cập nhật trạng thái của chúng (`OPEN` → `IN_PROGRESS` → `CLOSED`).
- **Community layer:** Mọi người dùng (không cần là collaborator) đều có thể **comment** lên idea public, giúp chủ idea nhận được phản hồi sớm.
- **Direct messaging:** Giao tiếp 1-1 giữa các user để đàm phán việc trở thành collaborator.
- **Giới hạn 20 issue active/người** để khuyến khích sự tập trung, tránh spam task.

### 3.3. Lợi ích

| Đối tượng | Lợi ích |
|---|---|
| **Người khởi tạo idea** | Có nơi ghi lại và “quảng bá” ý tưởng; nhận feedback sớm từ cộng đồng; dễ dàng tìm được cộng sự phù hợp. |
| **Người đóng góp (collaborator)** | Có cơ hội tham gia vào các dự án thực tế phù hợp sở thích/kỹ năng; xây dựng portfolio cộng tác. |
| **Người xem (viewer)** | Khám phá các ý tưởng mới, học hỏi từ các thảo luận công khai, kết nối với cộng đồng cùng chí hướng. |
| **Nhóm phát triển RedShark (sinh viên NT118)** | Thực hành toàn bộ chu trình phát triển một ứng dụng mobile hoàn chỉnh: thiết kế, hiện thực, kiểm thử, deploy. Vận dụng stack công nghệ hiện đại (React Native, Expo, Firebase, GraphQL). |

### 3.4. Người dùng mục tiêu

- **Sinh viên IT/thiết kế/khởi nghiệp** (18–25 tuổi) đang muốn xây dựng các dự án phụ (side project).
- **Developer trẻ, freelancer** muốn tìm cộng sự hoặc đóng góp cho các dự án mã nguồn mở cá nhân.
- **Nhóm học tập/nghiên cứu nhỏ** cần một công cụ quản lý idea và task nhẹ, không cần setup phức tạp.
- **Người yêu thích brainstorming** — những người hay có ý tưởng và muốn chia sẻ, trao đổi.

---

## 4. Scope

### 4.1. Trong phạm vi (In Scope) — MVP

#### Authentication
- Đăng ký và đăng nhập bằng **email/mật khẩu** (Firebase Authentication).
- Đăng nhập bằng **Google Sign-In** (native SDK `@react-native-google-signin`).
- Kiểm tra email tồn tại trước khi quyết định flow đăng nhập hay đăng ký.
- Đăng xuất và xóa tài khoản.

#### Profile
- Xem và chỉnh sửa profile cá nhân: `displayName`, `avatarUrl`, `skillIds`.
- Upload avatar lên Cloudflare R2 Storage.
- Xem profile công khai của user khác (qua `GetUser`).

#### Idea Feed
- Tạo, sửa, xóa (soft delete) idea của chính mình.
- Xem danh sách idea của chính mình (`ListMyIdeas`).
- Gắn tag phân loại cho idea (nhiều tag/idea).
- Cập nhật trạng thái idea (`ACTIVE`, `CLOSED`, `CANCELLED`).

#### Issue Management
- Tạo, sửa, xóa issue trong một idea (dành cho author/collaborator).
- Feed home liệt kê các issue đang `OPEN` (`ListOpenIssues`).
- Tab “My Issues” (`ListMyIssues`).
- Chuyển trạng thái issue theo state machine (`OPEN` → `IN_PROGRESS` → `CLOSED`/`CANCELLED`).
- Giới hạn tối đa 20 issue active/người (`CountMyActiveIssues`).

#### Collaboration
- Xin/chấp thuận trở thành collaborator của một idea.
- Quản lý danh sách collaborator (`collaboratorIds`).

#### Commenting
- Bình luận công khai trên idea (ai đã đăng nhập đều comment được).
- Xóa mềm comment của chính mình.

#### Messaging
- Nhắn tin 1-1 (conversation type `DIRECT`).
- Liệt kê các conversation và tin nhắn trong mỗi conversation.

#### Notifications
- Nhận thông báo khi có sự kiện liên quan (comment mới, yêu cầu collab, tin nhắn mới…).
- Đánh dấu đã đọc (`isRead`).

#### Non-feature
- UI/UX cơ bản nhất quán bằng **NativeWind (Tailwind)**, tối ưu cho Android.
- Theo dõi analytics cơ bản bằng **Firebase Analytics**.
- Deploy production build qua **EAS Build**.

### 4.2. Ngoài phạm vi (Out of Scope)

- **iOS build:** Chỉ hỗ trợ Android trong giai đoạn MVP.
- **Nhắn tin nhóm (group chat):** Bảng `conversations` có trường `type` nhưng MVP chỉ dùng `DIRECT`.
- **Voice/video call:** Không có.
- **Push notification thực** (FCM): Chỉ có notification in-app, chưa tích hợp Firebase Cloud Messaging.
- **Comment lồng nhau (nested reply):** Chỉ flat comment.
- **Tìm kiếm full-text nâng cao:** Chỉ có filter theo tag cơ bản.
- **Hệ thống reputation/voting:** Không có upvote/downvote.
- **Bảng quảng cáo / monetization:** Không có.
- **Admin dashboard:** Không có.
- **Xuất báo cáo, export dữ liệu:** Không có.

---

## 5. Tech Stack

| Layer | Công nghệ | Lý do chọn |
|---|---|---|
| **Mobile (Android only)** | React Native 0.81 + Expo SDK 54 | Cross-platform, cộng đồng lớn, nhanh prototype; Expo giảm tải build native. |
| **Language** | TypeScript 5.9 | Type-safe, giảm lỗi runtime, tốt với SDK auto-generated của FDC. |
| **Navigation** | Expo Router 6 (file-based) | Routing trực quan theo cấu trúc thư mục, không cần config. |
| **UI Styling** | NativeWind 4.2 (Tailwind) | Utility-first, tăng tốc viết UI, dễ maintain. |
| **Server State / Caching** | TanStack React Query 5 | Caching, invalidation, optimistic update cho dữ liệu server. |
| **Backend** | **Firebase (serverless)** | Không cần tự viết/duy trì server — giảm chi phí vận hành. |
| **Database / DBMS** | **Firebase Data Connect** + Cloud SQL PostgreSQL (asia-southeast1) | GraphQL-first, schema-driven, tự sinh TypeScript SDK; kế thừa Cloud SQL nên có quan hệ SQL thực sự. |
| **Authentication** | Firebase Authentication (email/password + Google sign-in) | Quản lý credential, email verification, password reset out-of-the-box. |
| **Storage (media)** | **Cloudflare R2 Storage** | Lưu trữ avatar & media upload; chi phí rẻ, S3-compatible, không tính egress fee. |
| **Analytics** | Firebase Analytics | Miễn phí, tích hợp sẵn với Firebase. |
| **Build & CI** | Expo EAS Build | Build Android cloud, quản lý keystore/signing tự động. |
| **Dev tooling** | Firebase Data Connect Emulator (pglite), ESLint | Local development không cần Cloud SQL thực. |

### Kiến trúc tóm tắt

```
┌──────────────────────────────────────┐
│  React Native App (Expo)             │
│  Expo Router · NativeWind            │
│  React Query · FDC SDK · Firebase    │
└──────────┬────────────────┬──────────┘
           │                │
   Firebase Auth     Data Connect SDK (GraphQL)
           │                │
           ▼                ▼
  ┌───────────────────────────────────┐
  │  Firebase Platform                │
  │  ┌──────────┐  ┌────────────────┐ │
  │  │ Auth     │  │ Data Connect   │ │
  │  │ Email/Pw │  │ GraphQL API    │ │
  │  │ Google   │  │ @auth, CEL     │ │
  │  └──────────┘  └────────┬───────┘ │
  └─────────────────────────┼─────────┘
                            ▼
              ┌──────────────────────┐
              │ Cloud SQL PostgreSQL │
              │ asia-southeast1      │
              └──────────────────────┘

              ┌──────────────────────┐
              │ Cloudflare R2        │
              │ (avatar, media)      │
              └──────────────────────┘
```

---

## 6. Milestones & Timeline

Dự án được chia thành **5 giai đoạn chính**, tổng thời gian ~9 tuần (16/03/2026 → 17/05/2026).

| Milestone | Giai đoạn | Tuần | Khoảng thời gian | Deliverable chính |
|---|---|---|---|---|
| **M0** | Khởi động & phân tích | Tuần 1 | 16/03 – 22/03/2026 | Project Charter, Requirements, lựa chọn tech stack, setup repository |
| **M1** | Thiết kế hệ thống | Tuần 2 | 23/03 – 29/03/2026 | Schema CSDL (schema.gql), wireframe UI, sơ đồ use-case, sơ đồ luồng |
| **M2** | Hạ tầng & Authentication | Tuần 3 | 30/03 – 05/04/2026 | Setup Firebase project, emulator local, auth flow email/password + Google, profile cơ bản |
| **M3** | Tính năng cốt lõi (Ideas & Issues) | Tuần 4–5 | 06/04 – 19/04/2026 | CRUD Idea, CRUD Issue, feed home, tab My Issues, state machine issue, giới hạn 20 issue |
| **M4** | Tương tác & Nhắn tin | Tuần 6–7 | 20/04 – 03/05/2026 | Commenting, Collaboration flow, Direct messaging, Notifications in-app |
| **M5** | Kiểm thử, hoàn thiện & Báo cáo | Tuần 8–9 | 04/05 – 17/05/2026 | Test trên thiết bị thực, fix bug, viết báo cáo cuối khóa, build APK production, demo |

### Chi tiết các task chính theo giai đoạn

#### M0 — Khởi động (16/03 – 22/03)
- Thu thập yêu cầu, brainstorm ý tưởng, chốt tên "RedShark".
- Viết Project Charter, Requirements, phân công vai trò.
- Tạo Git repo, CI/CD skeleton (Expo + EAS).

#### M1 — Thiết kế (23/03 – 29/03)
- Vẽ wireframe các màn hình chính (Login, Home Feed, Idea Detail, Issue Create, Profile, Chat).
- Thiết kế schema `schema.gql` — chia 3 nhóm bảng (identity, core, interaction).
- Thiết kế các query/mutation GraphQL cần thiết.
- Vẽ sơ đồ use-case và sơ đồ luồng người dùng chính.

#### M2 — Hạ tầng & Auth (30/03 – 05/04)
- Tạo Firebase project, bật Authentication (email + Google).
- Setup Cloud SQL + Data Connect, deploy schema ban đầu.
- Setup emulator local để phát triển không đụng production.
- Hiện thực `AuthContext`, màn hình Login/Register/Email check.
- Hiện thực màn hình Profile và chức năng upload avatar lên R2.

#### M3 — Tính năng cốt lõi (06/04 – 19/04)
- CRUD Idea: form tạo idea, list my ideas, trang chi tiết idea.
- CRUD Issue: form tạo issue (có validate max 20), list issues by idea, trang chi tiết.
- State machine chuyển trạng thái issue.
- Tab Home Feed với `ListOpenIssues`.
- Tích hợp `TagSelect` component cho phân loại idea.

#### M4 — Tương tác & Messaging (20/04 – 03/05)
- Commenting: tạo comment, list comment theo idea, soft delete.
- Collaboration: request trở thành collaborator, danh sách collaborator.
- Direct messaging: conversation list, chat screen với `participantIds`.
- Notifications: bảng `notifications`, đánh dấu đã đọc.

#### M5 — QA & Báo cáo (04/05 – 17/05)
- Kiểm thử chức năng trên emulator và thiết bị thật.
- Đo analytics cơ bản, fix bug phản hồi.
- Build APK production qua EAS.
- Viết báo cáo cuối khóa (`REPORT.md`), chuẩn bị slide demo.
- Nộp đồ án — hạn cuối 17/05/2026.

---

## 7. Rủi ro & phương án giảm thiểu

| Rủi ro | Mức độ | Phương án giảm thiểu |
|---|---|---|
| Firebase Data Connect là sản phẩm mới, tài liệu còn hạn chế | Cao | Dựng emulator local để test nhanh; có backup plan dùng Firestore nếu FDC gặp vấn đề nghiêm trọng |
| Google Sign-In cần native build, không test được với Expo Go | Trung bình | Dùng `expo run:android` + dev client; tài liệu hóa SHA-1 fingerprint trong CLAUDE.md |
| Cloud SQL có chi phí nếu dùng production | Trung bình | Dùng emulator (pglite) cho dev; chỉ deploy Cloud SQL khi demo |
| Scope creep — thành viên muốn thêm tính năng ngoài MVP | Cao | Khóa scope tại M1; feature mới ghi backlog cho giai đoạn post-MVP |
| Thành viên thiếu kinh nghiệm React Native | Trung bình | Pair-programming, code review; tận dụng template và component có sẵn |

---

## 8. Tiêu chí thành công

Dự án được coi là thành công nếu đáp ứng được **tất cả** các tiêu chí sau:

1. **Chức năng:** Toàn bộ tính năng trong MVP scope hoạt động đúng trên Android thiết bị thật (build APK cài đặt được).
2. **Chất lượng code:** Code đi qua ESLint không có error; schema được version-control.
3. **Tài liệu:** Có đủ `README.md`, `SCHEMA.md`, `REQUIREMENTS.md`, `PROCESSES.md`, `REPORT.md`.
4. **Demo:** Demo thành công các luồng chính (đăng ký, đăng idea, tạo issue, comment, nhắn tin) trước lớp.
5. **Deadline:** Nộp báo cáo & APK trước 17/05/2026.
