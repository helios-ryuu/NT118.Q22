# PROCESSES.md — Các quy trình nghiệp vụ RedShark

Tài liệu này mô tả **các quy trình thao tác chính** của hệ thống RedShark, bao gồm:

- Luồng thao tác từ người dùng đến CSDL.
- Các bảng bị ảnh hưởng trong mỗi quy trình.
- Điểm kiểm tra quyền và ràng buộc (cả client-side và server-side).
- Các hiệu ứng phụ (side effect) phát sinh trong và sau quy trình.

Các quy trình được chia thành **3 nhóm** tương ứng với cấu trúc schema (xem [SCHEMA.md](SCHEMA.md)):

- **Nhóm 1 — Identity & Lookup:** các quy trình liên quan đến tài khoản, profile, lookup.
- **Nhóm 2 — Core Workload:** các quy trình liên quan đến idea, issue, comment.
- **Nhóm 3 — Interaction & Messaging:** các quy trình liên quan đến collaboration, nhắn tin, thông báo.

---

## Mục lục

- [NHÓM 1 — Identity & Lookup](#nhóm-1--identity--lookup)
  - [P1.1. Đăng ký tài khoản bằng email/password](#p11-đăng-ký-tài-khoản-bằng-emailpassword)
  - [P1.2. Đăng nhập bằng email/password](#p12-đăng-nhập-bằng-emailpassword)
  - [P1.3. Đăng nhập bằng Google](#p13-đăng-nhập-bằng-google)
  - [P1.4. Đăng xuất](#p14-đăng-xuất)
  - [P1.5. Xóa tài khoản](#p15-xóa-tài-khoản)
  - [P1.6. Cập nhật profile](#p16-cập-nhật-profile)
  - [P1.7. Upload avatar lên R2](#p17-upload-avatar-lên-r2)
  - [P1.8. Lookup tags / skills (public)](#p18-lookup-tags--skills-public)
- [NHÓM 2 — Core Workload](#nhóm-2--core-workload)
  - [P2.1. Tạo idea mới](#p21-tạo-idea-mới)
  - [P2.2. Sửa idea](#p22-sửa-idea)
  - [P2.3. Xóa mềm idea](#p23-xóa-mềm-idea)
  - [P2.4. Tạo issue thuộc một idea](#p24-tạo-issue-thuộc-một-idea)
  - [P2.5. Sửa issue](#p25-sửa-issue)
  - [P2.6. Chuyển trạng thái issue](#p26-chuyển-trạng-thái-issue)
  - [P2.7. Xóa mềm issue](#p27-xóa-mềm-issue)
  - [P2.8. Xem feed các issue đang OPEN](#p28-xem-feed-các-issue-đang-open)
  - [P2.9. Đăng comment trên idea](#p29-đăng-comment-trên-idea)
  - [P2.10. Xóa comment](#p210-xóa-comment)
- [NHÓM 3 — Interaction & Messaging](#nhóm-3--interaction--messaging)
  - [P3.1. Gửi yêu cầu trở thành collaborator](#p31-gửi-yêu-cầu-trở-thành-collaborator)
  - [P3.2. Chấp thuận collaborator](#p32-chấp-thuận-collaborator)
  - [P3.3. Tạo cuộc hội thoại 1-1](#p33-tạo-cuộc-hội-thoại-1-1)
  - [P3.4. Gửi tin nhắn](#p34-gửi-tin-nhắn)
  - [P3.5. Xem danh sách hội thoại](#p35-xem-danh-sách-hội-thoại)
  - [P3.6. Đánh dấu notification đã đọc](#p36-đánh-dấu-notification-đã-đọc)

---

## NHÓM 1 — Identity & Lookup

### P1.1. Đăng ký tài khoản bằng email/password

**Mục tiêu:** Tạo một tài khoản Firebase Auth và một record `users` mới tương ứng.

**Tác nhân:** Guest (chưa đăng nhập)

**Bảng liên quan:** `users` (ghi); Firebase Auth (ngoài CSDL).

**Tiền điều kiện:** Email chưa tồn tại trong Firebase Auth.

**Luồng thực hiện:**

1. User nhập `email`, `displayName`, `username`, `password` trên màn hình Register.
2. Client validate: password ≥ 8 ký tự, gồm chữ và số; username chỉ chứa `[a-zA-Z0-9._]`.
3. Client đặt cờ `skipObserver = true` trong `AuthContext` để ngăn `onAuthStateChanged` chạy song song.
4. Client gọi `createUserWithEmailAndPassword(firebaseAuth, email, password)` — Firebase Auth trả về `currentUser` với `uid`.
5. Client gọi mutation **`UpsertUser`** với `{ username, displayName, avatarUrl: null }`. Server tự bind `id = auth.uid`, tự set `createdAt = request.time`. → Insert vào `users`.
6. Client gọi query **`GetMe`** để đọc lại record vừa tạo, set vào state `user` của context.
7. Client reset `skipObserver = false`.
8. Expo Router redirect sang màn hình chính `(tabs)/`.

**Hiệu ứng phụ:**
- Một bản ghi mới trong Firebase Authentication.
- Một dòng mới trong bảng `users`.
- `AuthContext.user` được hydrate.

**Lỗi có thể xảy ra:**
- Email đã tồn tại → `createUserWithEmailAndPassword` throw.
- Username trùng → mutation `UpsertUser` throw do ràng buộc `UNIQUE` trên `users.username`.
- Mất mạng giữa bước 4 và bước 5 → sẽ có Firebase Auth account "mồ côi" không có profile → lần đăng nhập tiếp theo flow Google sẽ tự tạo lại profile qua observer.

---

### P1.2. Đăng nhập bằng email/password

**Mục tiêu:** Xác thực user và hydrate `AuthContext`.

**Tác nhân:** Guest.

**Bảng liên quan:** `users` (đọc); Firebase Auth.

**Luồng:**

1. User nhập email → client gọi `fetchSignInMethodsForEmail(email)` — nếu có method `password` thì chuyển sang màn password.
2. User nhập password → client gọi `signInWithEmailAndPassword(firebaseAuth, email, password)`.
3. Firebase Auth xác thực; nếu đúng, trigger `onAuthStateChanged`.
4. Observer trong `AuthContext` chạy: gọi query **`GetMe`** → nếu `result.data.user` tồn tại thì `setUser(result.data.user)`. Nếu không tồn tại (trường hợp hiếm), tự tạo profile qua `UpsertUser` rồi gọi lại `GetMe`.
5. Redirect sang `(tabs)/`.

**Hiệu ứng phụ:** `user` state trong context được hydrate.

---

### P1.3. Đăng nhập bằng Google

**Tác nhân:** Guest.

**Bảng liên quan:** `users` (đọc và có thể ghi lần đầu); Firebase Auth; Google Identity Services.

**Luồng:**

1. User nhấn nút "Đăng nhập bằng Google" → `GoogleSignin.signIn()` mở native popup chọn account.
2. Google trả về `idToken` → client dựng `GoogleAuthProvider.credential(idToken)`.
3. Client gọi `signInWithCredential(firebaseAuth, googleCredential)`.
4. `onAuthStateChanged` fire → observer gọi **`GetMe`**.
5. **Phân nhánh:**
   - Nếu `GetMe` trả về user → `setUser(...)`, vào app.
   - Nếu `GetMe` trả về null (lần đầu Google) → tự generate `username` từ email (`email.split("@")[0].replace(/[^a-zA-Z0-9._]/g, "")`), gọi **`UpsertUser`** với `{ username, displayName: firebaseUser.displayName, avatarUrl: firebaseUser.photoURL }`, rồi retry `GetMe` và `setUser`.
6. Redirect sang `(tabs)/`.

**Hiệu ứng phụ:**
- Lần đầu: insert vào `users`.
- Các lần sau: chỉ đọc.

---

### P1.4. Đăng xuất

**Tác nhân:** User.

**Bảng liên quan:** không (client-side only).

**Luồng:**

1. User nhấn "Đăng xuất" → dialog xác nhận.
2. Xác nhận → client gọi `signOut(firebaseAuth)`.
3. Observer fire với `firebaseUser = null` → `setUser(null)`.
4. Expo Router redirect về màn hình login.

**Hiệu ứng phụ:** Session trên thiết bị bị xóa.

---

### P1.5. Xóa tài khoản

**Tác nhân:** User.

**Bảng liên quan:** `users` (xóa); Firebase Auth (xóa).

**Lưu ý:** Các bản ghi `ideas`, `issues` do user tạo **không bị xóa** theo (cascading delete chưa có) — vẫn còn trong DB nhưng sẽ trở thành "orphan" với `authorId` trỏ tới user không tồn tại. Đây là hạn chế đã biết của MVP.

**Luồng:**

1. User vào Settings → "Xóa tài khoản" → dialog xác nhận lần 1, lần 2.
2. Client gọi mutation **`DeleteUser`** (server: `user_delete(key: { id: auth.uid })`) — xóa record trong `users`.
3. Client gọi `firebaseAuth.currentUser.delete()` — xóa Firebase Auth account.
4. Observer fire với `firebaseUser = null` → `setUser(null)`.
5. Redirect về login.

**Lỗi có thể:** Firebase Auth yêu cầu re-authentication gần đây để cho phép delete → client phải prompt user đăng nhập lại trước khi gọi delete.

---

### P1.6. Cập nhật profile

**Tác nhân:** User.

**Bảng liên quan:** `users` (ghi).

**Luồng:**

1. User mở `profile/edit`.
2. Chỉnh sửa `displayName` và/hoặc `avatarUrl`. (Xem P1.7 cho flow upload avatar.)
3. Client gọi mutation **`UpdateUser`** với các field thay đổi. Server enforce `where: { id: auth.uid }` — chỉ update record của chính user.
4. Client gọi lại `GetMe` và update `AuthContext.user`.

**Hiệu ứng phụ:** `users.displayName` và/hoặc `users.avatarUrl` thay đổi.

---

### P1.7. Upload avatar lên R2

**Tác nhân:** User.

**Bảng liên quan:** `users` (ghi sau khi upload xong); Cloudflare R2 (ghi file).

**Luồng:**

1. User nhấn "Đổi avatar" → `expo-image-picker` mở gallery.
2. User chọn ảnh → client nhận được URI local.
3. Client resize/compress ảnh nếu lớn hơn ngưỡng.
4. Client upload lên R2 endpoint (PUT request multipart). R2 trả về URL công khai.
5. Client gọi **`UpdateUser({ avatarUrl: newUrl })`**.
6. Refresh `AuthContext.user`.

**Ràng buộc:**
- Content-type phải là `image/*`.
- Kích thước ≤ 5MB (client-side check).

---

### P1.8. Lookup tags / skills (public)

**Tác nhân:** Guest hoặc User.

**Bảng liên quan:** `tags` hoặc `skills` (đọc).

**Luồng:**

1. Client gọi **`ListTags`** hoặc **`ListSkills`** — không cần token.
2. React Query cache kết quả (stale time dài vì data này gần như tĩnh).
3. Hiển thị trong dropdown/multi-select.

**Hiệu ứng phụ:** Không.

---

## NHÓM 2 — Core Workload

### P2.1. Tạo idea mới

**Mục tiêu:** Thêm một idea mới vào feed của user.

**Tác nhân:** User.

**Bảng liên quan:** `ideas` (ghi), `tags` (đọc để chọn tag).

**Luồng:**

1. User vào `idea/create` → form nhập `title`, `description`, chọn `tagIds` (dùng component `TagSelect` lấy dữ liệu từ `ListTags`).
2. Client validate: title không rỗng, description không rỗng, tag hợp lệ.
3. Client gọi mutation **`CreateIdea`** với `{ title, description, tagIds }`.
4. Server tự bind `authorId = auth.uid`, tự set `status = "ACTIVE"`, `createdAt = lastActivityAt = request.time`. Insert mới.
5. React Query invalidate key `ListMyIdeas` → feed tự refresh.
6. Navigation: pop về `(tabs)/index` hoặc `idea/[newId]`.

**Hiệu ứng phụ:** Một row mới trong `ideas`.

---

### P2.2. Sửa idea

**Tác nhân:** User (phải là author).

**Bảng liên quan:** `ideas` (ghi).

**Tiền điều kiện:** `authorId = auth.uid` và `deletedAt IS NULL`.

**Luồng:**

1. User mở idea do chính mình tạo → nhấn "Sửa".
2. Form hiển thị giá trị hiện tại.
3. User thay đổi → client gọi **`UpdateIdea($id, $title, $description, $tagIds)`**.
4. Server enforce `where: { id = $id AND authorId = auth.uid AND deletedAt IS NULL }`. Nếu không khớp, mutation trả về 0 record update.
5. Server set `lastActivityAt = request.time`.
6. Invalidate `GetIdea($id)` và `ListMyIdeas`.

**Hiệu ứng phụ:** `ideas.lastActivityAt` được làm mới → idea nhảy lên đầu feed.

---

### P2.3. Xóa mềm idea

**Tác nhân:** User (author).

**Bảng liên quan:** `ideas` (set `deletedAt`).

**Lưu ý:** Các `issues` và `comments` thuộc idea này **không bị cascade delete** — vẫn còn, nhưng về mặt UI sẽ không reachable vì chỉ truy cập qua `GetIdea` (mà query sẽ không filter `deletedAt` field — nhưng feed và list đều filter → không hiển thị).

**Luồng:**

1. User nhấn "Xóa" → dialog xác nhận.
2. Client gọi **`DeleteIdea($id)`**.
3. Server update `deletedAt = request.time` với điều kiện ownership.
4. Client invalidate `ListMyIdeas`, `GetIdea($id)`.
5. Navigation pop về feed.

---

### P2.4. Tạo issue thuộc một idea

**Mục tiêu:** Tạo issue mới trong một idea, đồng thời "bump" idea cha lên đầu feed.

**Tác nhân:** User (phải là author hoặc collaborator của idea cha).

**Bảng liên quan:** `issues` (insert), `ideas` (update `lastActivityAt`).

**Đặc điểm:** Mutation này sử dụng **`@transaction`** — 2 thao tác atomic.

**Tiền điều kiện:**
- Idea cha tồn tại và chưa bị xóa (`deletedAt IS NULL`).
- User đang có **< 20 issue** ở trạng thái `OPEN` hoặc `IN_PROGRESS` (kiểm tra phía client).

**Luồng:**

1. User mở trang chi tiết idea (`idea/[id]`) → nhấn "Tạo issue".
2. Client gọi **`CountMyActiveIssues`** (query) — nếu count ≥ 20 → chặn, hiển thị cảnh báo.
3. Nếu OK → mở form `issue/create` → nhập `title`, `content`.
4. Client validate → gọi mutation **`CreateIssue($ideaId, $title, $content)`**.
5. Server (trong transaction):
   - Bước 1: `idea_update` — tìm idea với `id = $ideaId AND deletedAt IS NULL`, set `lastActivityAt = request.time`.
   - Bước 2: `issue_insert` — tạo issue mới với `authorId = auth.uid`, `status = "OPEN"`, `createdAt = request.time`.
6. Nếu một trong hai bước fail → rollback toàn bộ.
7. Client invalidate `ListOpenIssues`, `ListIssuesByIdea($ideaId)`, `ListMyIssues`, `GetIdea($ideaId)`, `CountMyActiveIssues`.

**Tương tác giữa các bảng:**

```
       trước                      sau
  ┌──────────────┐           ┌──────────────┐
  │ ideas        │           │ ideas        │
  │ lastActivity │ ────────▶ │ lastActivity │ = NOW
  │   = T0       │           │   = T1       │
  └──────────────┘           └──────────────┘
       không có                ┌──────────────┐
                               │ issues       │ NEW ROW
                               │ ideaId = X   │
                               │ authorId=me  │
                               │ status=OPEN  │
                               └──────────────┘
```

**Hiệu ứng phụ:**
- Idea cha được bump lên đầu tab "My Ideas".
- (Tùy chọn) Tạo notification `ISSUE_CREATED` gửi cho author của idea (nếu khác với người tạo issue).

---

### P2.5. Sửa issue

**Tác nhân:** User (author của issue).

**Bảng liên quan:** `issues` (ghi).

**Tiền điều kiện:** `status = "OPEN"` và `authorId = auth.uid` và `deletedAt IS NULL`. **Không cho phép** sửa issue ở trạng thái `IN_PROGRESS`/`CLOSED`/`CANCELLED` — ràng buộc này được enforce ở server.

**Luồng:**

1. User mở issue do mình tạo → nhấn "Sửa".
2. Client kiểm tra `status === "OPEN"` → nếu không, disable nút sửa.
3. Client gọi **`UpdateIssue($id, $title, $content)`**.
4. Server enforce `where: { id = $id AND authorId = auth.uid AND status = "OPEN" AND deletedAt IS NULL }`.
5. Invalidate `GetIssue($id)`, `ListMyIssues`, `ListIssuesByIdea`.

---

### P2.6. Chuyển trạng thái issue

**Tác nhân:** User (author).

**Bảng liên quan:** `issues` (ghi).

**Ràng buộc state machine (client-side):**

```
OPEN → IN_PROGRESS → CLOSED
OPEN → CANCELLED
```

Không cho phép:
- `CLOSED → OPEN`
- `CANCELLED → OPEN`
- `IN_PROGRESS → CANCELLED` (để chuyển cancel, phải rollback về OPEN trước — nhưng rollback không được phép → không có đường đi).

**Luồng:**

1. User mở issue → thấy list các trạng thái khả dĩ (filter theo state machine hiện tại).
2. Nhấn chọn trạng thái mới.
3. Client gọi **`UpdateIssueStatus($id, $status)`**. Server chỉ enforce `authorId = auth.uid AND deletedAt IS NULL` — không kiểm tra hướng chuyển (client chịu trách nhiệm).
4. Invalidate các query liên quan.

**Hiệu ứng phụ bổ sung:**
- Khi status thay đổi sang `CLOSED`/`CANCELLED`, issue sẽ rời khỏi `CountMyActiveIssues` — giải phóng quota 20 cho user.

---

### P2.7. Xóa mềm issue

**Tác nhân:** User (author).

**Tiền điều kiện:** `status = "OPEN"` (không cho xóa issue đã vào `IN_PROGRESS`).

**Luồng:**

1. User nhấn "Xóa" → dialog xác nhận.
2. Client gọi **`DeleteIssue($id)`**.
3. Server update `deletedAt = request.time` với điều kiện ownership + `status = "OPEN"`.
4. Invalidate `ListMyIssues`, `ListOpenIssues`, `ListIssuesByIdea`, `CountMyActiveIssues`.

**Lưu ý:** Việc xóa issue **không** cập nhật `lastActivityAt` của idea cha.

---

### P2.8. Xem feed các issue đang OPEN

**Tác nhân:** User.

**Bảng liên quan:** `issues` (đọc), `users` (đọc — nested), `ideas` (đọc — nested).

**Luồng:**

1. User mở tab Home.
2. Client gọi **`ListOpenIssues`** — React Query cache.
3. Server trả về list issue `deletedAt IS NULL AND status = "OPEN"` + nested `author { id, displayName, avatarUrl }` + nested `idea { id, title }`, sắp xếp `createdAt DESC`.
4. Client filter out các issue mà `author.id === auth.uid` (ẩn issue của chính mình).
5. Render `FlatList` với `IssueCard` component.
6. Pull-to-refresh → `refetch()`.

---

### P2.9. Đăng comment trên idea

> *Lưu ý: Các mutation cho comment chưa được hiện thực trong `mutations.gql` ở MVP M0; sẽ thêm trong M4.*

**Tác nhân:** User (bất kỳ, không cần là author/collaborator).

**Bảng liên quan:** `comments` (ghi), `ideas` (có thể cập nhật `lastActivityAt`).

**Luồng:**

1. User mở trang chi tiết idea → nhập comment.
2. Gọi mutation `CreateComment($ideaId, $content)`. Server tự set `authorId = auth.uid`, `createdAt = request.time`.
3. (Tùy chọn) Cập nhật `ideas.lastActivityAt` trong cùng transaction.
4. (Tùy chọn) Insert `notifications` với `type = "COMMENT"`, `recipientId = idea.authorId`, `actorId = auth.uid`, `targetId = idea.id`.
5. Invalidate `ListCommentsByIdea($ideaId)`.

---

### P2.10. Xóa comment

**Tác nhân:** User (author của comment).

**Luồng:**

1. User nhấn menu "Xóa comment" → dialog xác nhận.
2. Gọi mutation `DeleteComment($id)` — server set `deletedAt = request.time` với ownership check.
3. Invalidate `ListCommentsByIdea`.

---

## NHÓM 3 — Interaction & Messaging

### P3.1. Gửi yêu cầu trở thành collaborator

**Mục tiêu:** User (người gửi) thông báo cho author của idea rằng mình muốn tham gia.

**Tác nhân:** User (người gửi).

**Bảng liên quan:** `notifications` (ghi).

**Luồng:**

1. User mở trang chi tiết idea → nhấn "Xin cộng tác".
2. Client insert một `notifications` với:
   - `recipientId = idea.authorId`
   - `actorId = auth.uid`
   - `type = "COLLAB_REQUEST"`
   - `targetId = idea.id`
   - `metaData = { message: "..." }` (tùy chọn)
3. (Tùy chọn) Hiển thị toast "Yêu cầu đã gửi".

**Lưu ý:** Một user có thể gửi nhiều request cho cùng một idea; logic dedupe (nếu cần) thực hiện phía client bằng query trước khi insert.

---

### P3.2. Chấp thuận collaborator

**Tác nhân:** User (author của idea).

**Bảng liên quan:** `ideas` (ghi — thêm phần tử vào `collaboratorIds`), `notifications` (có thể ghi thông báo ngược).

**Luồng:**

1. Author mở notification `COLLAB_REQUEST` → thấy thông tin requester.
2. Nhấn "Chấp thuận" → client:
   - Đọc `idea.collaboratorIds` hiện tại qua `GetIdea`.
   - Thêm `actorId` vào mảng.
   - Gọi mutation `UpdateIdea($id, collaboratorIds: [...])` (hoặc một mutation chuyên biệt `AddCollaborator`).
3. (Tùy chọn) Insert notification ngược cho requester với `type = "COLLAB_ACCEPTED"`.
4. Mark notification gốc là `isRead = true`.

**Tương tác giữa các bảng:**

```
notifications                     ideas
┌────────────────┐              ┌──────────────────────┐
│ type=COLLAB_REQ│              │ collaboratorIds:     │
│ actorId=U2     │ ──đọc──▶     │   [U3]               │
│ targetId=IdX   │              └──────────────────────┘
│ isRead=false   │
└────────────────┘                          │ ghi
         │                                  ▼
         │                     ┌──────────────────────┐
         │                     │ collaboratorIds:     │
         │                     │   [U3, U2]           │
         │                     └──────────────────────┘
         │
         ▼ isRead=true
```

---

### P3.3. Tạo cuộc hội thoại 1-1

**Tác nhân:** User A muốn nhắn tin cho User B.

**Bảng liên quan:** `conversations` (đọc, có thể ghi).

**Luồng:**

1. User A mở profile của User B → nhấn nút "Nhắn tin".
2. Client query các conversation mà A là participant và B cũng là participant và `type = "DIRECT"`.
3. **Phân nhánh:**
   - Nếu đã tồn tại conversation → điều hướng đến đó.
   - Nếu chưa → insert `conversations` với `type = "DIRECT"`, `participantIds = [A.uid, B.uid]`, `lastMessageAt = request.time`.
4. Điều hướng đến màn hình chat.

---

### P3.4. Gửi tin nhắn

**Tác nhân:** User (participant của conversation).

**Bảng liên quan:** `messages` (insert), `conversations` (update `lastMessageAt`), `notifications` (insert).

**Luồng (transaction):**

1. User nhập nội dung → nhấn gửi.
2. Client gọi mutation (gợi ý tên `SendMessage($conversationId, $content)`):
   - Insert `messages` với `senderId = auth.uid`, `content = $content`, `messageType = "TEXT"`, `createdAt = request.time`.
   - Update `conversations.lastMessageAt = request.time` cùng transaction.
3. (Tùy chọn) Insert `notifications` với `type = "MESSAGE"`, `recipientId = đối phương`, `actorId = auth.uid`, `targetId = conversationId`, `metaData = { preview: content.slice(0, 50) }`.
4. Invalidate `ListMessagesByConversation($conversationId)`, `ListMyConversations`.

**Tương tác giữa các bảng:**

```
conversations                messages                   notifications
┌────────────┐          ┌────────────────┐          ┌─────────────────┐
│ lastMsgAt  │ ──bump──▶│ NEW MESSAGE    │          │ NEW NOTIFICATION │
│   =T1      │          │ conversationId │          │ type=MESSAGE     │
└────────────┘          │ senderId=A     │          │ recipientId=B    │
                        │ content=...    │          │ targetId=convId  │
                        └────────────────┘          └─────────────────┘
```

---

### P3.5. Xem danh sách hội thoại

**Tác nhân:** User.

**Bảng liên quan:** `conversations` (đọc), `messages` (đọc — để lấy tin cuối), `users` (đọc — để lấy thông tin đối phương).

**Luồng:**

1. User vào tab Messages.
2. Client gọi `ListMyConversations` — filter `participantIds` chứa `auth.uid`, sắp xếp `lastMessageAt DESC`.
3. Với mỗi conversation, client lấy thông tin đối phương (participant ≠ auth.uid) qua `GetUser`.
4. Render list với avatar, displayName, và tin nhắn mới nhất (nếu có).

---

### P3.6. Đánh dấu notification đã đọc

**Tác nhân:** User.

**Bảng liên quan:** `notifications` (ghi).

**Luồng:**

1. User mở tab Notifications → gọi `ListMyNotifications` (filter `recipientId = auth.uid`).
2. Khi user nhấn vào một notification:
   - Gọi mutation `MarkNotificationRead($id)` — set `isRead = true` (ownership check qua `recipientId = auth.uid`).
   - Điều hướng tới đối tượng liên quan dựa vào `type` và `targetId`:
     - `COMMENT` → `idea/[targetId]`
     - `COLLAB_REQUEST` → `idea/[targetId]` (+ modal confirm)
     - `ISSUE_CREATED` → `issue/[targetId]`
     - `MESSAGE` → `conversation/[targetId]`
3. Badge count (số notification chưa đọc) ở icon tab giảm đi 1 — tự động update nhờ React Query invalidation.

---

## Phụ lục — Ma trận bảng bị tác động theo quy trình

| Quy trình | users | ideas | issues | comments | notifications | conversations | messages | skills | tags |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| P1.1 Đăng ký | W | | | | | | | | |
| P1.2 Login email | R | | | | | | | | |
| P1.3 Login Google | R/W | | | | | | | | |
| P1.5 Xóa account | D | | | | | | | | |
| P1.6 Update profile | W | | | | | | | | |
| P1.8 List tags/skills | | | | | | | | R | R |
| P2.1 Tạo idea | | W | | | | | | | R |
| P2.2 Sửa idea | | W | | | | | | | |
| P2.3 Xóa idea | | W | | | | | | | |
| P2.4 Tạo issue | | W | W | | (W) | | | | |
| P2.5 Sửa issue | | | W | | | | | | |
| P2.6 Chuyển status | | | W | | | | | | |
| P2.7 Xóa issue | | | W | | | | | | |
| P2.8 Feed OPEN | R | R | R | | | | | | |
| P2.9 Tạo comment | | (W) | | W | (W) | | | | |
| P2.10 Xóa comment | | | | W | | | | | |
| P3.1 Request collab | | | | | W | | | | |
| P3.2 Accept collab | | W | | | W | | | | |
| P3.3 Tạo conv | | | | | | R/W | | | |
| P3.4 Gửi message | | | | | (W) | W | W | | |
| P3.5 List conv | R | | | | | R | R | | |
| P3.6 Mark read | | | | | W | | | | |

**Chú thích:** `R` = đọc, `W` = ghi/insert/update, `D` = delete, `(...)` = optional/phụ thuộc cấu hình.
