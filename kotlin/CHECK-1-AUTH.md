# CHECK-1-AUTH.md — Manual Test: Auth & Profile

| ID | Chức năng | Các bước | Kết quả mong đợi | Trạng thái |
|----|-----------|----------|------------------|-----------|
| TC-A01 | Đăng ký email mới | 1. Mở app, tab "Đăng ký" 2. Nhập email hợp lệ + password ≥ 6 ký tự 3. Bấm Submit | Tạo tài khoản Firebase Auth + record `users` qua `UpsertUser`. Điều hướng Home. | ⬜ |
| TC-A02 | Đăng ký email đã tồn tại | Tương tự TC-A01 với email đã có | Hiển thị thông báo "Email đã tồn tại", không crash | ⬜ |
| TC-A03 | Đăng ký password quá ngắn | Password < 6 ký tự | Firebase trả WEAK_PASSWORD, hiển thị message | ⬜ |
| TC-A04 | Đăng nhập email đúng | Nhập email + password đúng → Submit | Về Home, `GetMe` trả user | ⬜ |
| TC-A05 | Đăng nhập sai password | Password sai | Toast "Sai email hoặc mật khẩu" | ⬜ |
| TC-A06 | Đăng nhập Google thành công | Tap "Tiếp tục với Google" → chọn tài khoản | Về Home, avatar Google hiển thị | ⬜ |
| TC-A07 | Google Sign-In huỷ giữa chừng | Đóng popup Google | Không thay đổi state, không crash | ⬜ |
| TC-A08 | Persist session | Đăng nhập xong kill app, mở lại | Vẫn ở Home (không yêu cầu đăng nhập lại) | ⬜ |
| TC-A09 | Đăng xuất | Tab Settings → Đăng xuất | Về màn hình Auth, `GetMe` không được gọi | ⬜ |
| TC-A10 | Xem profile chính mình | Tab Settings hoặc Profile | Hiển thị displayName, avatar, bio, skills | ⬜ |
| TC-A11 | Edit displayName | Profile Edit → đổi name → Lưu | UI cập nhật, mutation `UpdateProfile` thành công | ⬜ |
| TC-A12 | Upload avatar (R2) | Edit → chọn ảnh < 1MB → Lưu | Ảnh nén → upload R2 → `avatarUrl` cập nhật → hiển thị ảnh mới | ⬜ |
| TC-A13 | Upload avatar lỗi mạng | Tắt wifi → chọn ảnh → Save | Hiển thị lỗi "Không thể upload, thử lại", state rollback | ⬜ |
| TC-A14 | Upload avatar > 5MB | Chọn ảnh lớn | Nén xuống ≤ 1MB rồi upload thành công | ⬜ |
| TC-A15 | Xem profile user khác | Tap avatar user trong comment | Vào ProfileViewScreen, hiển thị info, có nút "Nhắn tin" | ⬜ |
| TC-A16 | Edit bio > 280 ký tự | Nhập bio dài | Validate client, chặn lưu | ⬜ |
| TC-A17 | Chọn skills | Edit → tap skill chip | Toggle selected, lưu thành công | ⬜ |
| TC-A18 | Xóa tài khoản | Settings → Delete account → confirm | Xóa Firebase Auth + soft delete user, logout | ⬜ |
| TC-A19 | Mất mạng khi đăng nhập | Airplane mode → login | Hiển thị "Không có kết nối" | ⬜ |
| TC-A20 | Không lộ password trong log | `adb logcat` trong quá trình login | Không thấy password plaintext | ⬜ |
