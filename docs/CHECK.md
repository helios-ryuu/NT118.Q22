# CHECK.md — Kiểm thử thủ công RedShark v0.1.0

Tài liệu này liệt kê các bước kiểm thử thủ công và kết quả mong muốn cho từng phase.

**Cách dùng:** Chạy emulator → `firebase emulators:start --only dataconnect` → `npx expo start --dev-client`
Đánh dấu `[x]` khi pass, ghi chú nếu fail.

> **Trạng thái:** Phase 1 ✅ — code hoàn thiện.
> Phase 2 ✅ — code hoàn thiện.
> Phase 3 ✅ — code hoàn thiện (bug fixes COL-03, author nav, TS type); cần kiểm thử thủ công trên emulator/thiết bị và build production.

---

## Phase 1 — Hoàn thiện & Sửa lỗi

### AUTH-01: Đăng ký email/password
- [ ] Mở app → hiển thị màn hình nhập email
- [ ] Nhập email mới → chuyển sang màn đăng ký
- [ ] Nhập displayName, username (chỉ `a-zA-Z0-9._`), password (≥8 ký tự, gồm chữ và số) → nhấn Đăng ký
- [ ] **Mong muốn:** Chuyển sang màn Home, hiển thị tên người dùng ở header

### AUTH-02: Đăng nhập email/password
- [ ] Đăng xuất → nhập email đã đăng ký → chuyển sang màn password
- [ ] Nhập password đúng → nhấn Đăng nhập
- [ ] **Mong muốn:** Chuyển sang màn Home, dữ liệu cũ vẫn còn

### AUTH-03: Đăng nhập Google
- [ ] Đăng xuất → nhấn nút Google Sign-In
- [ ] Chọn tài khoản Google → đăng nhập thành công
- [ ] **Mong muốn:** Username tự sinh có suffix (vd: `john_a1b2`), không bị trùng

### AUTH-04: Đăng xuất
- [ ] Vào Cài đặt → nhấn Đăng xuất → dialog xác nhận
- [ ] Nhấn Đăng xuất
- [ ] **Mong muốn:** Quay về màn nhập email

### AUTH-05: Xóa tài khoản
- [ ] Vào Cài đặt → nhấn Xóa tài khoản → dialog xác nhận
- [ ] Nhấn Xoá
- [ ] **Mong muốn:** Quay về màn nhập email, không thể đăng nhập lại bằng tài khoản đó

### IDEA-01: Tạo ý tưởng
- [ ] Vào tab Ý tưởng → nhấn FAB (+)
- [ ] Nhấn Tạo mà không nhập gì → **Mong muốn:** Alert "Vui lòng nhập tiêu đề"
- [ ] Nhập tiêu đề, để trống mô tả → **Mong muốn:** Alert "Vui lòng nhập mô tả"
- [ ] Nhập tiêu đề + mô tả + chọn tags → nhấn Tạo
- [ ] **Mong muốn:** Alert thành công, quay lại danh sách, idea mới xuất hiện ngay (không cần kéo refresh)

### IDEA-02: Chỉnh sửa ý tưởng
- [ ] Mở chi tiết idea do mình tạo → nhấn "Chỉnh sửa"
- [ ] **Mong muốn:** Form hiển thị dữ liệu hiện tại (title, description, tags)
- [ ] Sửa title và tags → nhấn Lưu
- [ ] **Mong muốn:** Quay lại chi tiết, hiển thị dữ liệu đã cập nhật

### IDEA-03: Thay đổi trạng thái ý tưởng
- [ ] Mở chi tiết idea ACTIVE → nhấn "Đóng ý tưởng" → dialog xác nhận → Đóng
- [ ] **Mong muốn:** Badge trạng thái chuyển sang "Đã đóng", các nút edit/status biến mất, chỉ còn nút Xóa
- [ ] Tạo idea mới → nhấn "Huỷ ý tưởng" → xác nhận
- [ ] **Mong muốn:** Badge trạng thái chuyển sang "Đã huỷ"

### IDEA-04: Xóa ý tưởng
- [ ] Mở chi tiết idea → nhấn "Xóa ý tưởng" → dialog xác nhận → Xóa
- [ ] **Mong muốn:** Quay lại danh sách, idea không còn hiển thị

### ISSUE-01: Tạo vấn đề
- [ ] Mở chi tiết idea ACTIVE → nhấn "+ Thêm"
- [ ] Nhập tiêu đề + nội dung → nhấn Tạo
- [ ] **Mong muốn:** Alert thành công, quay lại, vấn đề mới xuất hiện trong danh sách idea VÀ trong Home feed

### ISSUE-02: Trạng thái issue — OPEN → IN_PROGRESS
- [ ] Mở chi tiết issue OPEN của mình → nhấn "Bắt đầu xử lý" → xác nhận
- [ ] **Mong muốn:** Badge chuyển sang "Đang xử lý", chỉ còn nút "Đóng vấn đề"

### ISSUE-03: Trạng thái issue — IN_PROGRESS → CLOSED
- [ ] Mở chi tiết issue IN_PROGRESS → nhấn "Đóng vấn đề" → xác nhận
- [ ] **Mong muốn:** Badge chuyển sang "Đã đóng", không còn nút hành động

### ISSUE-04: Trạng thái issue — OPEN → CANCELLED
- [ ] Mở chi tiết issue OPEN → nhấn "Huỷ vấn đề" → xác nhận
- [ ] **Mong muốn:** Badge chuyển sang "Đã huỷ"

### ISSUE-05: Chỉnh sửa issue
- [ ] Mở chi tiết issue OPEN → nhấn "Chỉnh sửa"
- [ ] **Mong muốn:** Form với dữ liệu hiện tại, loading indicator (không blank screen)
- [ ] Sửa nội dung → nhấn Lưu
- [ ] **Mong muốn:** Quay lại chi tiết, hiển thị nội dung đã cập nhật

### ISSUE-06: Xóa issue
- [ ] Mở chi tiết issue OPEN → nhấn "Xóa" → xác nhận
- [ ] **Mong muốn:** Quay lại, issue biến mất khỏi danh sách VÀ Home feed

### ISSUE-07: Giới hạn 20 issue
- [ ] Tạo 20 issue (status OPEN hoặc IN_PROGRESS)
- [ ] Thử tạo issue thứ 21
- [ ] **Mong muốn:** Alert "Bạn đã đạt giới hạn 20 vấn đề đang hoạt động"

### PROFILE-01: Chỉnh sửa profile
- [ ] Vào Cài đặt → nhấn vào profile → màn chỉnh sửa
- [ ] Sửa tên hiển thị → nhấn Lưu
- [ ] **Mong muốn:** Quay lại, tên mới hiển thị ở Cài đặt và Home header

### TAB-01: Tab Ý tưởng hiển thị đúng
- [ ] Nhấn tab "Ý tưởng"
- [ ] **Mong muốn:** Hiển thị danh sách ý tưởng của mình, có FAB (+), header "Ý tưởng của tôi"

### FEED-01: Home feed
- [ ] Đăng nhập → tab Home
- [ ] **Mong muốn:** Hiển thị issue OPEN của người khác (không có issue của mình)
- [ ] Kéo xuống refresh → dữ liệu cập nhật
- [ ] Gõ từ khóa vào ô tìm kiếm → **Mong muốn:** Lọc theo title/content

### VERSION-01: Version 0.1.0
- [ ] Kiểm tra `package.json` → `"version": "0.1.0"`
- [ ] Kiểm tra `app.json` → `"version": "0.1.0"`

---

## Phase 2 — Tính năng tương tác

### AVATAR-01: Upload avatar
- [ ] Vào chỉnh sửa profile → nhấn "Đổi ảnh" → chọn ảnh từ gallery
- [ ] Nhấn Lưu
- [ ] **Mong muốn:** Avatar mới hiển thị ở profile, Cài đặt, Home header
- [ ] Đăng xuất → đăng nhập lại → avatar vẫn hiển thị (URL cloud, không phải file://)

### AVATAR-02: Giới hạn kích thước
- [ ] Chọn ảnh > 5MB
- [ ] **Mong muốn:** Thông báo lỗi "Ảnh không được vượt quá 5MB"

### SKILL-01: Chọn kỹ năng
- [ ] Vào chỉnh sửa profile → thấy danh sách skill
- [ ] Chọn/bỏ chọn vài skill → nhấn Lưu
- [ ] Mở lại → **Mong muốn:** Skill đã chọn vẫn được highlight

### PROFILE-VIEW-01: Xem profile người khác
- [ ] Trong Home feed, nhấn vào tên/avatar tác giả
- [ ] **Mong muốn:** Hiển thị profile (tên, username, avatar, nút "Nhắn tin")
- [ ] Nếu nhấn vào profile chính mình → **Mong muốn:** Chuyển sang chỉnh sửa profile

### CMT-01: Đăng comment
- [ ] Mở chi tiết idea → cuộn xuống phần bình luận
- [ ] Nhập nội dung → nhấn gửi
- [ ] **Mong muốn:** Comment xuất hiện ngay với avatar + tên + thời gian

### CMT-02: Xóa comment
- [ ] Nhấn giữ comment của mình → xác nhận xóa
- [ ] **Mong muốn:** Comment biến mất
- [ ] Comment của người khác → **Mong muốn:** Không có tùy chọn xóa

### CMT-03: Notification comment
- [ ] User A comment trên idea của User B
- [ ] Đăng nhập User B → tab Thông báo
- [ ] **Mong muốn:** Thông báo "A đã bình luận trên ý tưởng của bạn"

### MSG-01: Bắt đầu cuộc trò chuyện
- [ ] Mở profile User B → nhấn "Nhắn tin"
- [ ] **Mong muốn:** Mở màn hình chat (tạo conversation mới nếu chưa có)
- [ ] Nhấn "Nhắn tin" lần nữa → **Mong muốn:** Mở lại conversation cũ (không tạo mới)

### MSG-02: Gửi và nhận tin nhắn
- [ ] Trong màn hình chat, nhập nội dung → nhấn gửi
- [ ] **Mong muốn:** Tin nhắn xuất hiện bên phải (của mình)
- [ ] Đăng nhập User B → mở conversation → **Mong muốn:** Thấy tin nhắn bên trái

### MSG-03: Danh sách conversation
- [ ] Tab Tin nhắn → **Mong muốn:** Hiển thị danh sách conversation, sắp xếp theo tin mới nhất
- [ ] Mỗi item hiển thị tên/avatar đối phương + thời gian tin cuối

### NTF-01: Danh sách thông báo
- [ ] Tab Thông báo
- [ ] **Mong muốn:** Hiển thị danh sách thông báo, chưa đọc có style khác biệt

### NTF-02: Badge thông báo chưa đọc
- [ ] Có thông báo chưa đọc → **Mong muốn:** Badge số trên tab Thông báo
- [ ] Nhấn vào thông báo → **Mong muốn:** Badge giảm, thông báo chuyển sang đã đọc

### NTF-03: Các loại thông báo
- [ ] Tạo issue trên idea của người khác → **Mong muốn:** Notification ISSUE_CREATED
- [ ] Comment trên idea → **Mong muốn:** Notification COMMENT
- [ ] Gửi tin nhắn → **Mong muốn:** Notification MESSAGE
- [ ] Yêu cầu cộng tác → **Mong muốn:** Notification COLLAB_REQUEST

### COL-01: Yêu cầu cộng tác
- [ ] Mở idea của người khác → nhấn "Xin cộng tác"
- [ ] **Mong muốn:** Toast "Yêu cầu đã gửi"
- [ ] Đăng nhập idea author → tab Thông báo → thấy yêu cầu

### COL-02: Chấp thuận cộng tác
- [ ] Idea author mở notification COLLAB_REQUEST → nhấn "Chấp thuận"
- [ ] **Mong muốn:** Requester xuất hiện trong danh sách collaborator
- [ ] Đăng nhập requester → mở idea → **Mong muốn:** Có thể tạo issue

### COL-03: Chỉ collaborator tạo được issue
- [ ] User không phải author/collaborator mở idea → nhấn "+ Thêm"
- [ ] **Mong muốn:** Bị chặn hoặc không hiển thị nút

### TAB-LAYOUT-01: Cấu trúc tab mới
- [ ] **Mong muốn:** 5 tab: Home | Ý tưởng | Tin nhắn | Thông báo | Cài đặt
- [ ] Mỗi tab có icon phù hợp

---

## Phase 3 — QA, Polish & Ship

### E2E-01: Luồng hoàn chỉnh trên emulator
- [ ] Đăng ký → tạo idea → tạo issue → comment → nhắn tin → xem thông báo → chỉnh sửa profile → đăng xuất
- [ ] **Mong muốn:** Mọi bước hoạt động mượt, không crash

### E2E-02: Luồng hoàn chỉnh trên thiết bị thật
- [ ] Cài APK → lặp lại E2E-01
- [ ] **Mong muốn:** Tương tự emulator, bao gồm Google Sign-In

### UI-01: Empty states
- [ ] Danh sách idea trống → **Mong muốn:** "Chưa có ý tưởng nào. Nhấn + để tạo mới."
- [ ] Home feed trống → **Mong muốn:** "Chưa có vấn đề phù hợp"
- [ ] Thông báo trống → **Mong muốn:** Thông báo phù hợp
- [ ] Tin nhắn trống → **Mong muốn:** Thông báo phù hợp
- [ ] Comment trống → **Mong muốn:** "Chưa có bình luận"

### UI-02: Destructive actions có dialog
- [ ] Xóa idea → **Mong muốn:** Dialog xác nhận
- [ ] Xóa issue → **Mong muốn:** Dialog xác nhận
- [ ] Xóa comment → **Mong muốn:** Dialog xác nhận
- [ ] Đăng xuất → **Mong muốn:** Dialog xác nhận
- [ ] Xóa tài khoản → **Mong muốn:** Dialog xác nhận

### UI-03: Form validation
- [ ] Mọi form có inline validation (tiêu đề rỗng, mô tả rỗng, password ngắn...)
- [ ] **Mong muốn:** Thông báo lỗi rõ ràng bằng tiếng Việt

### UI-04: Loading indicators
- [ ] Mọi màn hình có loading khi fetch dữ liệu
- [ ] **Mong muốn:** ActivityIndicator hiển thị, không blank screen

### UI-05: Pull-to-refresh
- [ ] Home feed, danh sách idea, thông báo, tin nhắn — kéo xuống
- [ ] **Mong muốn:** Dữ liệu refresh, indicator hiển thị đúng

### DOC-01: Documentation chính xác
- [ ] `CLAUDE.md` phản ánh đúng architecture hiện tại (screens, data model, commands)
- [ ] `README.md` liệt kê đúng features đã implement
- [ ] `docs/SCHEMA.md` có đầy đủ queries/mutations (không còn "dự kiến")
- [ ] `docs/REQUIREMENTS.md` ma trận truy vết đã cập nhật

### BUILD-01: Production APK
- [ ] `eas build --profile preview --platform android` thành công
- [ ] Cài APK → mở app → không crash
- [ ] Đăng ký + đăng nhập hoạt động với production Firebase

### BUILD-02: Data Connect production
- [ ] `firebase deploy --only dataconnect` thành công
- [ ] App kết nối được đến production database
