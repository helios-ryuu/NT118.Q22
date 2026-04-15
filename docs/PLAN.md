# PLAN.md — Kế hoạch phát triển RedShark v0.1.0

> **Lưu ý:** Đây là MVP — code ngắn gọn, dễ hiểu, đơn giản nhưng tường minh và robust. Không mock. Mọi tính năng sử dụng Firebase Data Connect thật.

**App:** RedShark | **Package:** `com.helios.redshark` | **Version:** `0.1.0`
**Deadline:** 17/05/2026 | **Team:** 3 thành viên

---

## Phase 1 — Hoàn thiện & Sửa lỗi (13/04 – 20/04) ✅ HOÀN THÀNH

Mục tiêu: Sửa toàn bộ bug hiện tại, bổ sung tính năng M3 còn thiếu, dọn dẹp codebase.

### 1.1 Sửa lỗi (đã hoàn thành)

| Bug | File | Mô tả |
|-----|------|-------|
| Query invalidation thiếu | `app/issue/create.tsx` | Thêm invalidate `issues.all`, `issues.byIdea`, `ideas.detail` sau khi tạo issue |
| Query invalidation thiếu | `app/issue/[id].tsx` | Thêm invalidate `issues.byIdea` khi xóa/đóng issue |
| Query invalidation thiếu | `app/idea/[id].tsx` | Thêm invalidate `issues.byIdea` khi xóa idea |
| Loading trống | `app/issue/edit.tsx` | Thay `return null` bằng `ActivityIndicator` |
| Import thừa | `app/profile/edit.tsx` | Xóa `getMe` import không dùng |
| Username trùng | `contexts/AuthContext.tsx` | Thêm suffix timestamp cho Google auto-username |
| Tab đặt tên sai | `app/(tabs)/issues.tsx` | Đổi tên thành `ideas.tsx`, cập nhật `_layout.tsx` |

### 1.2 Tính năng bổ sung (đã hoàn thành)

| Tính năng | File | Mô tả |
|-----------|------|-------|
| Chỉnh sửa ý tưởng | `app/idea/edit.tsx` (MỚI) | Form edit title/description/tags, gọi `UpdateIdea` |
| Trạng thái ý tưởng | `app/idea/[id].tsx` | Nút Đóng/Huỷ ý tưởng cho owner (ACTIVE → CLOSED/CANCELLED) |
| Trạng thái issue đầy đủ | `app/issue/[id].tsx` | Nút Bắt đầu xử lý (OPEN→IN_PROGRESS), Huỷ (OPEN→CANCELLED) |
| Validate mô tả | `app/idea/create.tsx` | Không cho tạo idea với mô tả rỗng |
| FAB component | `components/FAB.tsx` (MỚI) | Tách FAB inline style thành component tái sử dụng |
| UpdateIdea + status | `mutations.gql` | Thêm `$status` vào mutation UpdateIdea |

### 1.3 Dọn dẹp (đã hoàn thành)

- Version đặt `0.1.0` trong `package.json` và `app.json`
- Chuẩn hoá textarea height = 120px
- Tái tạo SDK sau thay đổi GQL

### 1.4 Branding & UI Icons (đã hoàn thành)

| Thay đổi | File | Mô tả |
|----------|------|-------|
| Xóa header "Nhập email" | `app/(auth)/_layout.tsx` | Ẩn hoàn toàn header màn hình email (`headerShown: false`) |
| Logo auth screens | `app/(auth)/email.tsx`, `app/(auth)/password.tsx` | Thêm `logo_text_vertical.png` (160px) phía trên form |
| Icon Google button | `app/(auth)/email.tsx` | Thêm `Ionicons logo-google` vào Button Google |
| Button icon prop | `components/Button.tsx` | Hỗ trợ `icon?: ReactNode` render trước title |
| Tab bar icons | `app/(tabs)/_layout.tsx` | `Ionicons`: home/bulb/settings (filled khi active, outline khi inactive) |
| FAB icon | `components/FAB.tsx` | Thay text `+` bằng `<Ionicons name="add" size={28} />` |
| App icon | `app.json` | `icon`, `adaptiveIcon.foregroundImage`, `favicon` → `logo.png`; splash → `logo_text_vertical.png` |

---

## Phase 2 — Tính năng tương tác M4 (21/04 – 04/05) ✅ HOÀN THÀNH

Mục tiêu: Implement commenting, collaboration, messaging, notifications.

### 2.1 GQL mới cần thêm

**`dataconnect/redshark/mutations.gql`** — thêm:

| Mutation | Mô tả |
|----------|-------|
| `CreateComment($ideaId, $content)` | @transaction — tạo comment + cập nhật idea.lastActivityAt |
| `DeleteComment($id)` | Soft delete comment, ownership check |
| `CreateConversation($participantIds)` | Tạo conversation DIRECT |
| `SendMessage($conversationId, $content)` | @transaction — gửi tin + cập nhật lastMessageAt |
| `DeleteMessage($id)` | Soft delete message, ownership check |
| `CreateNotification($recipientId, $type, $targetId, $metaData)` | Tạo thông báo |
| `MarkNotificationRead($id)` | Đánh dấu đã đọc |

Cập nhật `UpdateUser` thêm `$skillIds: [Int!]`.
Cập nhật `UpdateIdea` thêm `$collaboratorIds: [String!]`.

**`dataconnect/redshark/queries.gql`** — thêm:

| Query | Mô tả |
|-------|-------|
| `ListCommentsByIdea($ideaId)` | Comment của 1 idea, sắp xếp createdAt ASC |
| `ListMyConversations` | Conversation có auth.uid, sắp xếp lastMessageAt DESC |
| `ListMessagesByConversation($conversationId)` | Tin nhắn trong conversation |
| `ListMyNotifications` | Thông báo cho auth.uid, sắp xếp createdAt DESC |
| `CountUnreadNotifications` | Đếm notification chưa đọc |

Sau khi thêm xong: `firebase dataconnect:sdk:generate`

### 2.2 Types mới

| File | Nội dung |
|------|----------|
| `types/comment.ts` | `Comment { id, ideaId, content, authorId, authorDisplayName, authorAvatarUrl, createdAt }` |
| `types/conversation.ts` | `Conversation`, `Message` |
| `types/notification.ts` | `Notification`, `NotificationType` |

### 2.3 Query Keys mở rộng

**`services/queryKeys.ts`** — thêm:
- `comments.byIdea(ideaId)`
- `conversations.all`, `conversations.messages(id)`
- `notifications.all`, `notifications.unreadCount`
- `users.detail(id)`

### 2.4 Commenting (FR-CMT)

| Việc | File |
|------|------|
| Component bình luận | `components/CommentSection.tsx` (MỚI) — fetch + hiển thị + gửi + xóa comment |
| Tích hợp vào idea detail | `app/idea/[id].tsx` — render `<CommentSection ideaId={idea.id} />` |

### 2.5 Xem profile người khác (FR-PRF-02)

| Việc | File |
|------|------|
| Màn hình profile | `app/profile/[id].tsx` (MỚI) — hiển thị thông tin user, nút "Nhắn tin" |
| Route | `app/_layout.tsx` — thêm `profile/[id]` |
| Điều hướng | `app/issue/[id].tsx`, `app/idea/[id].tsx`, `components/IssueCard.tsx` — tên tác giả bấm được |

### 2.6 Chọn kỹ năng (FR-PRF-05)

| Việc | File |
|------|------|
| Component chọn skill | `components/SkillSelect.tsx` (MỚI) — tương tự TagSelect |
| Tích hợp | `app/profile/edit.tsx` — thêm SkillSelect |
| AuthContext | `contexts/AuthContext.tsx` — truyền skillIds vào updateUser |

### 2.7 Upload avatar lên R2 (FR-PRF-04)

| Việc | File |
|------|------|
| Service upload | `services/r2.ts` (MỚI) — upload ảnh lên Cloudflare R2, trả về URL |
| Tích hợp | `app/profile/edit.tsx` — gọi upload trước khi lưu nếu URI là local file |
| Đăng ký avatar | `app/(auth)/register.tsx` — tương tự |

### 2.8 Notifications (FR-NTF)

| Việc | File |
|------|------|
| Tab thông báo | `app/(tabs)/notifications.tsx` (MỚI) — danh sách notification |
| Badge | `app/(tabs)/_layout.tsx` — badge số chưa đọc trên tab |
| Gửi thông báo | Tích hợp vào: tạo issue → notify idea author, tạo comment → notify, gửi tin nhắn → notify |

### 2.9 Messaging (FR-MSG)

| Việc | File |
|------|------|
| Tab tin nhắn | `app/(tabs)/messages.tsx` (MỚI) — danh sách conversation |
| Màn hình chat | `app/conversation/[id].tsx` (MỚI) — gửi/nhận tin nhắn |
| Bubble component | `components/MessageBubble.tsx` (MỚI) |
| Bắt đầu chat | `app/profile/[id].tsx` — nút "Nhắn tin" tạo/mở conversation |

### 2.10 Collaboration (FR-COL)

| Việc | File |
|------|------|
| Yêu cầu cộng tác | `app/idea/[id].tsx` — nút "Xin cộng tác" gửi notification COLLAB_REQUEST |
| Chấp thuận | `app/(tabs)/notifications.tsx` — nút Accept/Reject trên notification COLLAB_REQUEST |
| Hiển thị collaborators | `app/idea/[id].tsx` — danh sách avatar collaborators |

### 2.11 Cấu trúc tab mới

```
Home | Ý tưởng | Tin nhắn | Thông báo | Cài đặt
```

---

## Phase 3 — QA, Polish & Ship (05/05 – 17/05) ✅ HOÀN THÀNH

Mục tiêu: Test toàn diện, sửa bug, hoàn thiện documentation, build production.

### 3.1 Kiểm thử (05/05 – 10/05)

- Test end-to-end mọi luồng trên Android emulator
- Test trên thiết bị thật
- Kiểm tra query invalidation sau mọi mutation
- Kiểm tra edge cases: empty state, mất mạng, back navigation
- Xem chi tiết tại `CHECK.md`

### 3.2 UI Polish (10/05 – 13/05) ✅

- Tab bar icons đầy đủ (`Ionicons`, filled khi active) ✅
- Empty states trên mọi màn hình danh sách ✅
- Pull-to-refresh hoạt động trên mọi danh sách ✅
- Keyboard avoidance (`KeyboardAvoidingView`) trên mọi form ✅
- Spacing/typography nhất quán ✅

### 3.2.1 Bug fixes (từ review code)

| Bug | File | Fix |
|-----|------|-----|
| COL-03: nút `+ Thêm` hiển thị với mọi user | `app/idea/[id].tsx` | Ẩn nút khi user không phải owner/collaborator hoặc idea không ACTIVE ✅ |
| Author không bấm được trong issue detail | `app/issue/[id].tsx` | Thêm `Pressable` điều hướng đến `/profile/[id]` ✅ |
| `collaboratorIds` thiếu trong Idea mapping | `app/(tabs)/ideas.tsx` | Thêm `collaboratorIds: i.collaboratorIds ?? []` ✅ |

### 3.3 Documentation (13/05 – 15/05) ✅ HOÀN THÀNH

| File | Cập nhật |
|------|----------|
| `CLAUDE.md` | Đã cập nhật Architecture, Data Model, screens mới ✅ |
| `README.md` | Đã cập nhật feature list ✅ |
| `docs/SCHEMA.md` | Đã thêm queries/mutations Phase 2, bỏ dấu "dự kiến" ✅ |
| `docs/REQUIREMENTS.md` | Đã cập nhật ma trận truy vết — đánh dấu đã implement ✅ |
| `docs/PLAN.md` | Đã cập nhật trạng thái Phase 3 ✅ |
| `docs/CHECK.md` | Đã cập nhật trạng thái kiểm thử ✅ |

### 3.4 Build & Deploy (15/05 – 17/05)

```bash
# Deploy Data Connect lên production
firebase deploy --only dataconnect

# Build APK
eas build --profile preview --platform android

# Tag release
git tag v0.1.0
```

- Test APK trên emulator sạch và thiết bị thật
- Seed dữ liệu demo cho buổi trình bày
- Chuẩn bị kịch bản demo

---

## Phân công gợi ý

| Thành viên | Phase 2 | Phase 3 |
|------------|---------|---------|
| Dev A | Comments + Collaboration (2.4, 2.10) | QA auth + idea flows |
| Dev B | Messaging (2.9) + Profile view (2.5) | QA messaging + notifications |
| Dev C | Notifications (2.8) + Skills + Avatar upload (2.6, 2.7) | Documentation + Build |
| Chung | GQL + SDK regen (2.1) | UI Polish |

---

## Lưu ý quan trọng

1. **SDK regen bắt buộc** sau mỗi lần sửa `.gql`: `firebase dataconnect:sdk:generate`
2. **R2 upload:** Nếu cấu hình R2 phức tạp, fallback dùng Firebase Storage (có SDK native)
3. **Notification là pull-based:** Không có push (FCM ngoài scope MVP). Cân nhắc refetch unread count mỗi 30s
4. **Collaboration eventually consistent:** Collaborator chỉ thấy mình được thêm khi refresh idea detail
5. **FDC array filtering:** Verify `participantIds: { includes: ... }` hoạt động với Data Connect. Nếu không, filter client-side
