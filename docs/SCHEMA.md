# SCHEMA.md — Lược đồ cơ sở dữ liệu RedShark

Tài liệu này mô tả đầy đủ lược đồ cơ sở dữ liệu của ứng dụng **RedShark**. Schema được định nghĩa bằng GraphQL tại [`dataconnect/schema/schema.gql`](../dataconnect/schema/schema.gql) và được quản lý bởi **Firebase Data Connect** — một lớp GraphQL phía trên **Cloud SQL PostgreSQL** (khu vực `asia-southeast1`).

> **Lưu ý quan trọng:**
> - Việc xác thực (email/password, Google OAuth) được **Firebase Authentication** đảm nhiệm. Do đó, trong cơ sở dữ liệu **KHÔNG** có các bảng như `accounts`, `auth_tokens`, `sessions`, `password_hashes` — mọi thông tin nhạy cảm về tài khoản nằm ở Firebase Auth.
> - Các trường mảng (`skillIds`, `tagIds`, `collaboratorIds`, `participantIds`) được lưu dưới dạng **PostgreSQL native array column** (`integer[]`, `text[]`), **không** sử dụng bảng trung gian (join table).
> - Tất cả các bảng có trường `deletedAt` đều áp dụng cơ chế **xóa mềm (soft delete)** — bản ghi không bị xóa vật lý mà chỉ đánh dấu thời điểm xóa.
> - Các trường `createdAt`, `lastActivityAt`, `lastMessageAt` sử dụng CEL expression `request.time` để tự động gán thời điểm thực hiện request phía máy chủ.
> - Trường `id` của bảng `users` được tự động bind với `auth.uid` của Firebase Authentication qua CEL expression `auth.uid`.

---

## Mục lục

1. [Tổng quan kiến trúc dữ liệu](#1-tổng-quan-kiến-trúc-dữ-liệu)
2. [Nhóm 1 — Identity & Lookup](#2-nhóm-1--identity--lookup)
3. [Nhóm 2 — Core Workload](#3-nhóm-2--core-workload)
4. [Nhóm 3 — Interaction & Messaging](#4-nhóm-3--interaction--messaging)
5. [Quan hệ giữa các bảng](#5-quan-hệ-giữa-các-bảng)
6. [Danh sách Query](#6-danh-sách-query)
7. [Danh sách Mutation](#7-danh-sách-mutation)
8. [Quy tắc phân quyền (Auth Level)](#8-quy-tắc-phân-quyền-auth-level)
9. [Quy tắc nghiệp vụ & ràng buộc phía server](#9-quy-tắc-nghiệp-vụ--ràng-buộc-phía-server)

---

## 1. Tổng quan kiến trúc dữ liệu

Schema được chia làm **3 nhóm** theo vai trò nghiệp vụ:

| Nhóm | Mục đích | Bảng |
|---|---|---|
| **Nhóm 1 — Identity & Lookup** | Thông tin người dùng và danh mục tra cứu | `users`, `skills`, `tags` |
| **Nhóm 2 — Core Workload** | Dữ liệu cốt lõi của ứng dụng: ý tưởng, vấn đề, bình luận | `ideas`, `issues`, `comments` |
| **Nhóm 3 — Interaction & Messaging** | Tương tác giữa người dùng: thông báo, nhắn tin | `notifications`, `conversations`, `messages` |

Tổng cộng **9 bảng**, sử dụng kết hợp giữa khóa chính kiểu `UUID` (sinh bằng `uuidV4()`), `Int64` (auto-increment) và `String` (bind với `auth.uid` của Firebase Auth).

---

## 2. Nhóm 1 — Identity & Lookup

### 2.1. Bảng `users` — Thông tin người dùng

Lưu trữ hồ sơ (profile) của người dùng. Mỗi user trong bảng này tương ứng **1-1** với một tài khoản Firebase Auth thông qua `auth.uid`.

| Thuộc tính     | Kiểu dữ liệu | Khóa | Ràng buộc |
|----------------|--------------|------|-----------|
| `id`           | `String`     | PK   | NOT NULL, DEFAULT `auth.uid` (CEL expression — bind tự động với Firebase UID khi insert) |
| `username`     | `String`     | —    | NOT NULL, UNIQUE |
| `displayName`  | `String`     | —    | NULLABLE |
| `avatarUrl`    | `String`     | —    | NULLABLE (URL trỏ tới ảnh lưu trên Cloudflare R2) |
| `skillIds`     | `Int[]`      | —    | NULLABLE (mảng FK logic → `skills.id`) |
| `createdAt`    | `Timestamp`  | —    | NOT NULL, DEFAULT `request.time` |

**Ghi chú:**
- Bảng này không lưu email/mật khẩu. Email nằm ở Firebase Auth và được truy xuất qua `firebaseAuth.currentUser.email`.
- Trường `skillIds` là PostgreSQL `integer[]` — không join bảng mà filter trực tiếp.
- Username bị ràng buộc UNIQUE toàn hệ thống; logic sinh username mặc định khi Google Sign-In: `email.split("@")[0]` đã được lọc ký tự đặc biệt.

---

### 2.2. Bảng `skills` — Danh mục kỹ năng

Bảng tra cứu cố định, được seed sẵn vào database. Dùng cho phần profile của user (user chọn các skill mình có).

| Thuộc tính | Kiểu dữ liệu | Khóa | Ràng buộc |
|------------|--------------|------|-----------|
| `id`       | `Int`        | PK   | NOT NULL |
| `name`     | `String`     | —    | NOT NULL, UNIQUE |

**Ghi chú:**
- Đây là bảng read-only với người dùng cuối — dữ liệu được admin/developer quản lý qua `scripts/query.js seed`.
- Query `ListSkills` công khai (auth level `PUBLIC`).

---

### 2.3. Bảng `tags` — Nhãn phân loại ý tưởng

Bảng tra cứu cố định, dùng để phân loại các `ideas` (ví dụ: `Web`, `Mobile`, `AI`, `IoT`...).

| Thuộc tính | Kiểu dữ liệu | Khóa | Ràng buộc |
|------------|--------------|------|-----------|
| `id`       | `Int`        | PK   | NOT NULL |
| `name`     | `String`     | —    | NOT NULL, UNIQUE |

**Ghi chú:**
- Tương tự `skills`, dữ liệu được seed sẵn và read-only với user.
- Query `ListTags` công khai.

---

## 3. Nhóm 2 — Core Workload

### 3.1. Bảng `ideas` — Ý tưởng / Dự án

Đơn vị trung tâm của ứng dụng. Một `idea` là một ý tưởng/dự án do người dùng đăng lên để cộng đồng có thể tham gia đóng góp (comment, xin trở thành collaborator).

| Thuộc tính        | Kiểu dữ liệu | Khóa            | Ràng buộc                                                                |
| ----------------- | ------------ | --------------- | ------------------------------------------------------------------------ |
| `id`              | `UUID`       | PK              | NOT NULL, DEFAULT `uuidV4()`                                             |
| `authorId`        | `String`     | FK → `users.id` | NOT NULL (tự gán qua `authorId_expr: "auth.uid"` khi insert)             |
| `title`           | `String`     | —               | NOT NULL                                                                 |
| `description`     | `String`     | —               | NOT NULL                                                                 |
| `status`          | `String`     | —               | NOT NULL, DEFAULT `"ACTIVE"`                                             |
| `tagIds`          | `Int[]`      | —               | NULLABLE (mảng FK logic → `tags.id`)                                     |
| `collaboratorIds` | `String[]`   | —               | NULLABLE (mảng Firebase UID của các user là cộng tác viên)               |
| `lastActivityAt`  | `Timestamp`  | —               | NOT NULL, DEFAULT `request.time` (cập nhật mỗi khi có issue/comment mới) |
| `createdAt`       | `Timestamp`  | —               | NOT NULL, DEFAULT `request.time`                                         |
| `deletedAt`       | `Timestamp`  | —               | NULLABLE — `NULL` = chưa bị xóa (soft delete)                            |

**Các giá trị hợp lệ của `status`:**
- `ACTIVE` — đang hoạt động, cho phép thêm issue/comment (mặc định)
- `CLOSED` — đã đóng, không nhận thêm đóng góp
- `CANCELLED` — đã hủy bỏ

**Ghi chú nghiệp vụ:**
- `lastActivityAt` được dùng làm khóa sắp xếp ở feed (newest activity first), được tự động cập nhật thông qua mutation `CreateIssue` trong cùng một transaction atomic.
- Trường `collaboratorIds` là PostgreSQL `text[]` chứa các `auth.uid`, cho phép query "các idea mà tôi là collaborator" bằng toán tử array contains.

---

### 3.2. Bảng `issues` — Vấn đề / Task thuộc một Idea

Mỗi `issue` là một vấn đề, task hoặc chủ đề thảo luận cụ thể gắn với một `idea` cha. Chỉ `author` của idea và các `collaborators` mới được tạo issue.

| Thuộc tính    | Kiểu dữ liệu | Khóa               | Ràng buộc |
|---------------|--------------|--------------------|-----------|
| `id`          | `UUID`       | PK                 | NOT NULL, DEFAULT `uuidV4()` |
| `ideaId`      | `UUID`       | FK → `ideas.id`    | NOT NULL |
| `authorId`    | `String`     | FK → `users.id`    | NOT NULL (tự gán qua `authorId_expr: "auth.uid"`) |
| `title`       | `String`     | —                  | NOT NULL |
| `content`     | `String`     | —                  | NOT NULL |
| `status`      | `String`     | —                  | NOT NULL, DEFAULT `"OPEN"` |
| `createdAt`   | `Timestamp`  | —                  | NOT NULL, DEFAULT `request.time` |
| `deletedAt`   | `Timestamp`  | —                  | NULLABLE — soft delete |

**State machine của `status`:**

```
          ┌───────────────┐
          │     OPEN      │ ◄── trạng thái khởi tạo
          └───┬───────┬───┘
              │       │
              ▼       ▼
     ┌─────────────┐  ┌────────────┐
     │ IN_PROGRESS │  │ CANCELLED  │
     └──────┬──────┘  └────────────┘
            │
            ▼
       ┌─────────┐
       │ CLOSED  │
       └─────────┘
```

- `OPEN` — vấn đề vừa được tạo, chưa xử lý.
- `IN_PROGRESS` — đang xử lý.
- `CLOSED` — đã xử lý xong.
- `CANCELLED` — đã hủy.

**Ràng buộc nghiệp vụ (xem thêm mục 9):**
- Mỗi user tối đa **20 issues** ở trạng thái `OPEN` hoặc `IN_PROGRESS` cùng lúc (kiểm tra phía client qua query `CountMyActiveIssues`).
- Chỉ có thể **chỉnh sửa (title, content)** hoặc **xóa mềm** một issue khi nó đang ở trạng thái `OPEN`.
- Khi tạo issue mới, `ideas.lastActivityAt` của idea cha được cập nhật trong cùng một transaction.

---

### 3.3. Bảng `comments` — Bình luận trên Idea

Bình luận (thread phẳng) của người dùng trên một `idea`. Bất kỳ user đã đăng nhập nào cũng có thể comment lên idea public.

| Thuộc tính  | Kiểu dữ liệu | Khóa               | Ràng buộc |
|-------------|--------------|--------------------|-----------|
| `id`        | `Int64`      | PK                 | NOT NULL, AUTO INCREMENT |
| `ideaId`    | `UUID`       | FK → `ideas.id`    | NOT NULL |
| `authorId`  | `String`     | FK → `users.id`    | NOT NULL |
| `content`   | `String`     | —                  | NOT NULL |
| `createdAt` | `Timestamp`  | —                  | NOT NULL, DEFAULT `request.time` |
| `deletedAt` | `Timestamp`  | —                  | NULLABLE — soft delete |

**Ghi chú:**
- Khóa chính là `Int64` auto-increment (không phải UUID) do comment thường được hiển thị dưới dạng list sắp xếp theo thứ tự chèn.
- Không hỗ trợ reply lồng nhau (flat thread).

---

## 4. Nhóm 3 — Interaction & Messaging

### 4.1. Bảng `notifications` — Thông báo

Hàng thông báo gửi cho người dùng khi có sự kiện liên quan (ví dụ: có người comment lên idea của mình, có người xin làm collaborator, có tin nhắn mới…).

| Thuộc tính    | Kiểu dữ liệu | Khóa               | Ràng buộc |
|---------------|--------------|--------------------|-----------|
| `id`          | `Int64`      | PK                 | NOT NULL, AUTO INCREMENT |
| `recipientId` | `String`     | FK → `users.id`    | NOT NULL (người nhận thông báo) |
| `actorId`     | `String`     | FK → `users.id`    | NOT NULL (người gây ra sự kiện) |
| `type`        | `String`     | —                  | NOT NULL (ví dụ: `COMMENT`, `COLLAB_REQUEST`, `ISSUE_CREATED`, `MESSAGE`…) |
| `targetId`    | `UUID`       | —                  | NULLABLE (ID của đối tượng liên quan: idea, issue, conversation…) |
| `metaData`    | `Any` (JSON) | —                  | NULLABLE (payload tùy ý, ví dụ: `{"commentPreview": "..."}`) |
| `isRead`      | `Boolean`    | —                  | NOT NULL, DEFAULT `false` |
| `createdAt`   | `Timestamp`  | —                  | NOT NULL, DEFAULT `request.time` |

**Ghi chú:**
- `metaData` là kiểu `Any` (JSONB) — cho phép lưu trữ payload không cấu trúc.
- Không có trường `deletedAt` — thông báo có thể bị xóa cứng hoặc giữ vĩnh viễn tùy policy.

---

### 4.2. Bảng `conversations` — Cuộc hội thoại

Một cuộc hội thoại giữa hai hoặc nhiều user. Ở MVP, loại `DIRECT` (1-1) là chủ đạo.

| Thuộc tính       | Kiểu dữ liệu | Khóa | Ràng buộc                                                           |
| ---------------- | ------------ | ---- | ------------------------------------------------------------------- |
| `id`             | `UUID`       | PK   | NOT NULL, DEFAULT `uuidV4()`                                        |
| `type`           | `String`     | —    | NOT NULL, DEFAULT `"DIRECT"`                                        |
| `participantIds` | `String[]`   | —    | NULLABLE (mảng Firebase UID của các thành viên)                     |
| `lastMessageAt`  | `Timestamp`  | —    | NOT NULL, DEFAULT `request.time` (cập nhật mỗi lần có tin nhắn mới) |
| `createdAt`      | `Timestamp`  | —    | NOT NULL, DEFAULT `request.time`                                    |

**Các giá trị hợp lệ của `type`:**
- `DIRECT` — cuộc trò chuyện 1-1
- `GROUP` — cuộc trò chuyện nhóm (dành cho mở rộng sau MVP)

---

### 4.3. Bảng `messages` — Tin nhắn trong cuộc hội thoại

| Thuộc tính       | Kiểu dữ liệu | Khóa                       | Ràng buộc |
|------------------|--------------|----------------------------|-----------|
| `id`             | `Int64`      | PK                         | NOT NULL, AUTO INCREMENT |
| `conversationId` | `UUID`       | FK → `conversations.id`    | NOT NULL |
| `senderId`       | `String`     | FK → `users.id`            | NOT NULL |
| `content`        | `String`     | —                          | NOT NULL |
| `messageType`    | `String`     | —                          | NOT NULL, DEFAULT `"TEXT"` |
| `createdAt`      | `Timestamp`  | —                          | NOT NULL, DEFAULT `request.time` |
| `deletedAt`      | `Timestamp`  | —                          | NULLABLE — soft delete |

**Các giá trị hợp lệ của `messageType`:**
- `TEXT` — tin nhắn văn bản (mặc định)
- `IMAGE` — tin nhắn ảnh (URL trỏ tới R2)
- `SYSTEM` — thông báo hệ thống trong hội thoại (ví dụ: "X đã tham gia nhóm")

---

## 5. Quan hệ giữa các bảng

### 5.1. Sơ đồ ER rút gọn

```
                  ┌──────────┐
                  │  users   │
                  └────┬─────┘
           ┌──────────┬┴────────┬─────────────┐
           │          │         │             │
           ▼          ▼         ▼             ▼
      ┌────────┐  ┌────────┐  ┌─────────┐ ┌───────────────┐
      │ ideas  │  │issues  │  │comments │ │notifications  │
      └───┬────┘  └───┬────┘  └────┬────┘ │ (recipient +  │
          │           │            │      │  actor)       │
          └───────────┴────────────┘      └───────────────┘
          ideas.id =  issues.ideaId
          ideas.id =  comments.ideaId

        ┌───────────────┐       ┌─────────┐
        │ conversations │ ──<──│messages │
        └───────────────┘       └─────────┘
                ▲
                │ participantIds: text[] (chứa users.id)
                │
            ┌───────┐
            │ users │
            └───────┘

   Bảng tra cứu (seed sẵn):
       skills   ─ tham chiếu logic qua  users.skillIds  (integer[])
       tags     ─ tham chiếu logic qua  ideas.tagIds    (integer[])
```

### 5.2. Bảng liệt kê quan hệ

| Quan hệ                          | Loại     | Cài đặt |
|----------------------------------|----------|---------|
| `users` 1 — n `ideas`            | 1-nhiều  | `ideas.authorId` → `users.id` |
| `users` 1 — n `issues`           | 1-nhiều  | `issues.authorId` → `users.id` |
| `users` 1 — n `comments`         | 1-nhiều  | `comments.authorId` → `users.id` |
| `ideas` 1 — n `issues`           | 1-nhiều  | `issues.ideaId` → `ideas.id` |
| `ideas` 1 — n `comments`         | 1-nhiều  | `comments.ideaId` → `ideas.id` |
| `users` n — n `ideas` (collab)   | nhiều-nhiều | `ideas.collaboratorIds: text[]` chứa `users.id` |
| `users` n — n `skills`           | nhiều-nhiều | `users.skillIds: integer[]` chứa `skills.id` |
| `ideas` n — n `tags`             | nhiều-nhiều | `ideas.tagIds: integer[]` chứa `tags.id` |
| `users` 1 — n `notifications` (recipient) | 1-nhiều | `notifications.recipientId` → `users.id` |
| `users` 1 — n `notifications` (actor)     | 1-nhiều | `notifications.actorId` → `users.id` |
| `users` n — n `conversations`    | nhiều-nhiều | `conversations.participantIds: text[]` chứa `users.id` |
| `conversations` 1 — n `messages` | 1-nhiều  | `messages.conversationId` → `conversations.id` |
| `users` 1 — n `messages`         | 1-nhiều  | `messages.senderId` → `users.id` |

---

## 6. Danh sách Query

Toàn bộ các query được định nghĩa tại [`dataconnect/redshark/queries.gql`](../dataconnect/redshark/queries.gql). Firebase Data Connect **không có khái niệm Stored Procedure/Function theo nghĩa SQL truyền thống**; thay vào đó, mọi thao tác đọc/ghi đều được khai báo dưới dạng GraphQL operation.

### 6.1. User Queries

| Tên query | Auth | Mô tả | Tham số | Trả về |
|-----------|------|-------|---------|--------|
| `GetMe` | `USER` | Lấy profile của user đang đăng nhập (dùng để hydrate `AuthContext` sau sign-in) | — (dùng `auth.uid`) | `{ id, username, displayName, avatarUrl, skillIds, createdAt }` |
| `GetUser` | `PUBLIC` | Lấy thông tin public của một user bất kỳ theo ID (dùng hiển thị thông tin tác giả) | `$id: String!` | `{ id, username, displayName, avatarUrl }` |

### 6.2. Issue Queries

| Tên query | Auth | Mô tả | Tham số | Lọc/Sắp xếp |
|-----------|------|-------|---------|-------------|
| `ListOpenIssues` | `USER` | Home feed: liệt kê tất cả issues trạng thái `OPEN`, chưa bị xóa, sắp xếp mới nhất trước. Client chịu trách nhiệm lọc bỏ issue của chính mình. | — | `deletedAt IS NULL AND status = 'OPEN'`, ORDER BY `createdAt DESC` |
| `ListMyIssues` | `USER` | Tab "My Issues": liệt kê tất cả issue do user hiện tại tạo | — | `authorId = auth.uid AND deletedAt IS NULL`, ORDER BY `createdAt DESC` |
| `ListIssuesByIdea` | `USER` | Liệt kê các issue thuộc một idea cụ thể | `$ideaId: UUID!` | `ideaId = $ideaId AND deletedAt IS NULL`, ORDER BY `createdAt DESC` |
| `GetIssue` | `USER` | Lấy chi tiết một issue theo ID | `$id: UUID!` | `id = $id` |
| `CountMyActiveIssues` | `USER` | Đếm số issue đang active (OPEN/IN_PROGRESS) của user hiện tại — dùng để enforce rule **tối đa 20 issue** phía client | — | `authorId = auth.uid AND deletedAt IS NULL AND status IN ('OPEN', 'IN_PROGRESS')` |

### 6.3. Idea Queries

| Tên query | Auth | Mô tả | Tham số | Lọc/Sắp xếp |
|-----------|------|-------|---------|-------------|
| `ListMyIdeas` | `USER` | Tab "My Ideas": liệt kê idea do user tạo | — | `authorId = auth.uid AND deletedAt IS NULL`, ORDER BY `lastActivityAt DESC` |
| `GetIdea` | `USER` | Lấy chi tiết một idea theo ID | `$id: UUID!` | `id = $id` |

### 6.4. Lookup Queries (public)

| Tên query | Auth | Mô tả | Tham số |
|-----------|------|-------|---------|
| `ListTags` | `PUBLIC` | Liệt kê toàn bộ tags đã seed, sắp xếp theo tên | — |
| `ListSkills` | `PUBLIC` | Liệt kê toàn bộ skills đã seed, sắp xếp theo tên | — |

---

## 7. Danh sách Mutation

Toàn bộ mutation được định nghĩa tại [`dataconnect/redshark/mutations.gql`](../dataconnect/redshark/mutations.gql). Các mutation đóng vai trò như các "operation" ghi dữ liệu, có thể gồm nhiều thao tác được gói trong một transaction atomic bằng directive `@transaction`.

### 7.1. User Mutations

| Tên mutation | Auth | Mô tả | Tham số | Ràng buộc server-side |
|--------------|------|-------|---------|----------------------|
| `UpsertUser` | `USER` | Tạo mới hoặc cập nhật profile (idempotent). Gọi lần đầu sau khi đăng ký hoặc Google Sign-In. | `$username: String!, $displayName: String, $avatarUrl: String` | `id` bind tự động với `auth.uid` |
| `UpdateUser` | `USER` | Cập nhật `displayName` và/hoặc `avatarUrl` của user hiện tại | `$displayName: String, $avatarUrl: String` | `where: { id = auth.uid }` |
| `DeleteUser` | `USER` | Xóa bản ghi profile của user hiện tại khỏi FDC. Việc xóa Firebase Auth account được client gọi riêng. | — | `key: { id = auth.uid }` |

### 7.2. Idea Mutations

| Tên mutation | Auth | Mô tả | Tham số | Ràng buộc server-side |
|--------------|------|-------|---------|----------------------|
| `CreateIdea` | `USER` | Tạo idea mới. `authorId` tự bind với `auth.uid`, `status` mặc định `ACTIVE`. | `$title: String!, $description: String!, $tagIds: [Int!]` | — |
| `UpdateIdea` | `USER` | Cập nhật idea — chỉ owner mới thao tác được, không cho update idea đã bị xóa. Đồng thời cập nhật `lastActivityAt`. | `$id: UUID!, $title: String, $description: String, $tagIds: [Int!]` | `id = $id AND authorId = auth.uid AND deletedAt IS NULL` |
| `DeleteIdea` | `USER` | Xóa mềm idea (set `deletedAt = request.time`), chỉ owner mới xóa được. | `$id: UUID!` | `id = $id AND authorId = auth.uid AND deletedAt IS NULL` |

### 7.3. Issue Mutations

| Tên mutation | Auth | Transaction | Mô tả | Tham số | Ràng buộc server-side |
|--------------|------|-------------|-------|---------|----------------------|
| `CreateIssue` | `USER` | **Yes** (`@transaction`) | Tạo issue mới **và** cập nhật `ideas.lastActivityAt` của idea cha trong cùng một transaction atomic. | `$ideaId: UUID!, $title: String!, $content: String!` | Idea cha phải chưa bị xóa. `status` mặc định `OPEN`. |
| `UpdateIssue` | `USER` | No | Chỉnh sửa `title`/`content` của issue. Chỉ được sửa khi issue ở trạng thái `OPEN`. | `$id: UUID!, $title: String!, $content: String!` | `id = $id AND authorId = auth.uid AND status = 'OPEN' AND deletedAt IS NULL` |
| `UpdateIssueStatus` | `USER` | No | Chuyển trạng thái của issue (OPEN → IN_PROGRESS → CLOSED, hoặc OPEN → CANCELLED). Client chịu trách nhiệm kiểm tra hướng chuyển trạng thái hợp lệ. | `$id: UUID!, $status: String!` | `id = $id AND authorId = auth.uid AND deletedAt IS NULL` |
| `DeleteIssue` | `USER` | No | Xóa mềm issue. Chỉ được xóa khi issue đang ở trạng thái `OPEN`. | `$id: UUID!` | `id = $id AND authorId = auth.uid AND status = 'OPEN' AND deletedAt IS NULL` |

---

## 8. Quy tắc phân quyền (Auth Level)

Firebase Data Connect hỗ trợ phân quyền ở cấp operation thông qua directive `@auth(level: ...)`:

| Auth Level | Ý nghĩa | Áp dụng cho |
|------------|---------|-------------|
| `PUBLIC`   | Không cần đăng nhập — ai cũng gọi được | `GetUser`, `ListTags`, `ListSkills` |
| `USER`     | Bắt buộc phải đăng nhập (Firebase Auth token hợp lệ) | Tất cả query/mutation còn lại |
| `NO_ACCESS`| Không ai gọi được (chỉ dùng cho internal) | Không áp dụng trong dự án này |

Quy tắc bảo mật bổ sung:
- **Ownership check** được enforce ở **phía server** thông qua CEL expression trong mệnh đề `where`: `authorId: { eq_expr: "auth.uid" }`. Client không thể bypass bằng cách truyền `authorId` giả.
- **Soft delete** được enforce bằng mệnh đề `deletedAt: { isNull: true }` ở mọi query/mutation đọc-ghi trên `ideas`/`issues`/`comments`/`messages`.

---

## 9. Quy tắc nghiệp vụ & ràng buộc phía server

Các ràng buộc nghiệp vụ được phân bố giữa **server-side** (CEL expression trong `.gql`) và **client-side** (kiểm tra trong code React Native):

### Ràng buộc server-side (không bypass được)

1. **Ownership:** Chỉ `author` mới được update/delete idea và issue của chính mình (qua `authorId: { eq_expr: "auth.uid" }`).
2. **Auto-bind authorId:** Khi tạo idea/issue, `authorId` được server tự gán qua `authorId_expr: "auth.uid"` — client không thể giả mạo.
3. **Auto-timestamp:** `createdAt`, `lastActivityAt`, `deletedAt`, `lastMessageAt` đều do server set qua `request.time`.
4. **Soft delete enforcement:** Mọi query đọc chính đều append điều kiện `deletedAt: { isNull: true }`.
5. **Issue edit chỉ khi OPEN:** Mutation `UpdateIssue` và `DeleteIssue` đều có điều kiện `status: { eq: "OPEN" }` — không thể sửa/xóa issue đã `IN_PROGRESS`/`CLOSED`/`CANCELLED`.
6. **Atomic update của lastActivityAt:** `CreateIssue` sử dụng `@transaction` để đảm bảo issue và `lastActivityAt` của idea cha được cập nhật cùng lúc.

### Ràng buộc client-side (kiểm tra ở UI)

1. **Tối đa 20 issue active/user:** Trước khi vào màn hình `issue/create`, client gọi `CountMyActiveIssues`; nếu kết quả ≥ 20 sẽ chặn không cho tạo thêm.
2. **State machine hợp lệ:** Client kiểm tra hướng chuyển trạng thái hợp lệ (OPEN → IN_PROGRESS → CLOSED) trước khi gọi `UpdateIssueStatus`.
3. **Username unique:** Client gọi check username trước khi register (FDC vẫn sẽ trả lỗi UNIQUE CONSTRAINT nếu trùng).
4. **Upload avatar:** Avatar được upload lên Cloudflare R2, chỉ URL trả về mới được ghi vào `users.avatarUrl`.

### Không có trong schema (dùng Firebase Auth thay thế)

- Hash mật khẩu, email verification, password reset: do Firebase Auth quản lý.
- Refresh token, access token: Firebase SDK tự xử lý trên client.
- Email lookup: sử dụng `fetchSignInMethodsForEmail()` của Firebase Auth, không query vào FDC.

---

## 10. Ghi chú triển khai

- **Không viết SQL thủ công.** Mọi thay đổi schema phải qua `dataconnect/schema/schema.gql` rồi `firebase deploy --only dataconnect:schema`.
- **Regen SDK sau mỗi lần sửa `.gql`:** `firebase dataconnect:sdk:generate` — output tại `src/dataconnect-generated/`.
- **Emulator local:** Dữ liệu pglite lưu tại `dataconnect/.dataconnect/pgliteData`, tồn tại qua các lần restart.
- **Seed dữ liệu lookup:** `node scripts/query.js seed` để nạp `tags` và `skills`.
