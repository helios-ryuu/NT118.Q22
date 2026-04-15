<p align="center">
  <a href="https://www.uit.edu.vn/" title="Trường Đại học Công nghệ Thông tin">
    <img src="https://i.imgur.com/WmMnSRt.png" alt="Trường Đại học Công nghệ Thông tin | University of Information Technology">
  </a>
</p>
<h1 align="center"><b>NT118.Q22 - PHÁT TRIỂN ỨNG DỤNG TRÊN THIẾT BỊ DI ĐỘNG</b></h1>

## MỤC LỤC
- [Giới thiệu](#giới-thiệu)
- [Thành viên nhóm](#thành-viên-nhóm)
- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Khởi chạy](#khởi-chạy)
- [Quản lý schema và dữ liệu](#quản-lý-schema-và-dữ-liệu)
- [Lệnh hay dùng](#lệnh-hay-dùng)

---

## GIỚI THIỆU

| | |
|---|---|
| Môn học | Phát triển ứng dụng trên thiết bị di động (NT118) |
| Lớp | NT118.Q22 — HK2 2025-2026 |
| Giảng viên | ThS. Trần Hồng Nghi — nghith@uit.edu.vn |
| Đề tài | **RedShark** v0.1.0 — Ứng dụng di động quản lý năng suất cộng tác |

---

## THÀNH VIÊN NHÓM

| STT | MSSV | Họ và Tên | Github | Email |
|---|---:|---|---|---|
| 1 | 23521367 | Ngô Tiến Sỹ | [helios-ryuu](https://github.com/helios-ryuu) | 23521367@gm.uit.edu.vn |
| 2 | 24520442 | Phạm Tuấn Hải | [haiphamt](https://github.com/haiphamt) | 24520442@gm.uit.edu.vn |
| 3 | 23520982 | Nguyễn Văn Nam | [Sinister-VN](https://github.com/Sinister-VN) | 23520982@gm.uit.edu.vn |

---

## KIẾN TRÚC HỆ THỐNG

```
┌──────────────────────────────────────┐
│  React Native App (Expo)             │
│  Expo Router · React Query           │
│  Firebase Auth · FDC SDK             │
└──────────┬────────────────┬──────────┘
           │ Firebase Auth  │ Data Connect SDK (GraphQL)
           ▼                ▼
┌─────────────────────────────────────────────────┐
│  Firebase Platform                              │
│  ┌────────────────┐   ┌──────────────────────┐  │
│  │ Authentication │   │  Data Connect        │  │
│  │ · Email/Pass   │   │  · GraphQL API       │  │
│  │ · Google OAuth │   │  · Auth directives   │  │
│  └────────────────┘   └──────────┬───────────┘  │
└─────────────────────────────────┼───────────────┘
                                  │ Cloud SQL connector
                                  ▼
                     ┌────────────────────────┐
                     │  Cloud SQL (PostgreSQL) │
                     │  asia-southeast1       │
                     └────────────────────────┘
```

**Luồng auth:**
- **Email/password:** `signInWithEmailAndPassword` → `onAuthStateChanged` → `GetMe` → set user state
- **Google Sign-In:** native popup → `signInWithCredential` → `onAuthStateChanged` → nếu user mới: `UpsertUser` → `GetMe` → set user state

Frontend gọi thẳng Firebase Data Connect SDK — quyền truy cập kiểm soát qua `@auth(level: USER/PUBLIC)` và CEL expression (`auth.uid == authorId`) trong file `.gql`.

---

## TÍNH NĂNG

| Nhóm | Tính năng | Trạng thái |
|------|-----------|------------|
| **Auth** | Đăng ký/đăng nhập email + password | Done |
| | Đăng nhập Google (native) | Done |
| | Đăng xuất, xóa tài khoản | Done |
| **Profile** | Xem/chỉnh sửa displayName | Done |
| | Upload avatar lên R2 | Done |
| | Chọn kỹ năng | Done |
| | Xem profile người khác | Done |
| **Ý tưởng** | Tạo, sửa, xóa mềm ý tưởng | Done |
| | Gắn tag, chuyển trạng thái (ACTIVE → CLOSED/CANCELLED) | Done |
| **Vấn đề** | Tạo, sửa, xóa mềm vấn đề | Done |
| | State machine: OPEN → IN_PROGRESS → CLOSED, OPEN → CANCELLED | Done |
| | Giới hạn 20 issue/user | Done |
| **Feed** | Home feed (issue OPEN của người khác), tìm kiếm, pull-to-refresh | Done |
| **Comment** | Bình luận trên ý tưởng (tạo, xóa mềm) | Done |
| **Messaging** | Nhắn tin 1-1 (tạo conversation, gửi/nhận tin) | Done |
| **Notification** | Thông báo in-app, badge tab, đánh dấu đã đọc | Done |
| **Collaboration** | Yêu cầu cộng tác, chấp thuận/từ chối | Done |

Xem chi tiết kế hoạch tại [docs/PLAN.md](docs/PLAN.md) và checklist kiểm thử tại [docs/CHECK.md](docs/CHECK.md).

---

## CÔNG NGHỆ SỬ DỤNG

| Layer | Công nghệ | Phiên bản |
|---|---|---|
| Mobile | React Native + Expo | 0.81 / 54 |
| Navigation | Expo Router | 6 |
| Styling | NativeWind (Tailwind) | 4.2 |
| Server state | TanStack React Query | 5 |
| Auth | Firebase Authentication + Google Sign-In | — |
| Database | Firebase Data Connect (Cloud SQL PostgreSQL) | — |
| Storage | Cloudflare R2 (avatar) | — |

---

## KHỞI CHẠY

### Yêu cầu
- Node.js 22+
- Android Studio với emulator API 33+ có **Google Play Services**
- Firebase CLI: `npm install -g firebase-tools`
- Quyền truy cập Firebase project (liên hệ nhóm để được thêm vào)

---

### Bước 1 — Clone & cài dependencies

```powershell
git clone <repo-url>
cd NT118.Q22
npm install
```

---

### Bước 2 — Tạo file môi trường

**`.env`** (đặt tại thư mục gốc, không commit):
```env
EXPO_PUBLIC_FIREBASE_API_KEY=<Firebase Console → Project Settings → Web app → Config>
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=<project>.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=<project-id>
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=<project>.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<sender-id>
EXPO_PUBLIC_FIREBASE_APP_ID=<app-id>

EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=<Firebase Console → Authentication → Sign-in method → Google → Web SDK>
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=<Google Cloud Console → APIs & Services → Credentials>

EXPO_PUBLIC_R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
EXPO_PUBLIC_R2_BUCKET=<bucket-name>
EXPO_PUBLIC_R2_TOKEN=<Cloudflare API Token có quyền write vào bucket>

GOOGLE_APPLICATION_CREDENTIALS=./dataconnect/serviceAccountKey.json
```

`dataconnect/serviceAccountKey.json`: tải từ Firebase Console → Project Settings → Service accounts → Generate new private key.

---

### Bước 3 — Khởi động Firebase Data Connect Emulator

```powershell
firebase emulators:start --only dataconnect
```

- Emulator UI: `http://localhost:4000/dataconnect`
- FDC endpoint: `localhost:9399` (Android emulator dùng `10.0.2.2:9399`)

**Seed dữ liệu (lần đầu):**

```powershell
node query.js seed
```

Dữ liệu lưu tại `dataconnect/.dataconnect/pgliteData`, tồn tại qua các lần restart emulator. Mỗi thành viên seed độc lập trên máy của mình — không đụng đến Cloud SQL production.

---

### Bước 4 — Build dev client

Vì dùng native module (`@react-native-google-signin`), phải dùng **dev client** thay vì Expo Go.

**EAS Cloud (khuyến nghị):**

```powershell
npm install -g eas-cli
eas login
eas build --profile development --platform android
adb install <duong-dan-toi-file-apk>
```

**Local trên Windows:**

```powershell
$env:ANDROID_HOME="$env:LOCALAPPDATA\Android\Sdk"
$env:JAVA_HOME="$env:LOCALAPPDATA\Programs\Android Studio\jbr"
$env:Path="$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:Path"
npx expo run:android
```

Sau khi có SHA-1 fingerprint: Firebase Console → Project Settings → Android app `com.helios.redshark` → Add fingerprint. Lấy SHA-1 bằng `eas credentials`.

---

### Bước 5 — Chạy Metro

```powershell
npx expo start --dev-client
```

---

### Test auth

**Email/password:**
1. Mở app → nhập email mới → màn hình đăng ký
2. Điền tên hiển thị, username, mật khẩu (≥ 8 ký tự, gồm chữ và số)
3. Đăng ký thành công → vào app

**Google Sign-In (emulator):**
1. Emulator: Settings → Accounts → thêm Google account
2. Mở app → nhấn **Google** → chọn tài khoản → đăng nhập thành công

---

### Reset để test lại từ đầu

```powershell
adb shell pm clear com.helios.redshark   # xóa session trên thiết bị

node query.js delete all                 # xóa toàn bộ data emulator
node query.js seed                       # seed lại
```

Hoặc dừng emulator → xóa `dataconnect/.dataconnect/pgliteData` → restart và seed lại.

---

## QUẢN LÝ SCHEMA VÀ DỮ LIỆU

Schema định nghĩa tại [dataconnect/schema/schema.gql](dataconnect/schema/schema.gql). Không viết SQL thủ công.

**Sửa schema:**
```powershell
# 1. Chỉnh sửa dataconnect/schema/schema.gql
# 2. Deploy lên Cloud SQL:
firebase deploy --only dataconnect:schema
# 3. Tái sinh TypeScript SDK:
firebase dataconnect:sdk:generate
```

**Thêm/sửa queries và mutations:**

Chỉnh sửa [dataconnect/redshark/queries.gql](dataconnect/redshark/queries.gql) hoặc [dataconnect/redshark/mutations.gql](dataconnect/redshark/mutations.gql), sau đó:

```powershell
firebase dataconnect:sdk:generate
# SDK được sinh vào src/dataconnect-generated/
```

> Bắt buộc chạy `firebase dataconnect:sdk:generate` để sinh SDK cho các operations mới (Comment, Conversation, Message, Notification) trước khi build app.

---

## LỆNH HAY DÙNG

**Frontend:**
```powershell
npx expo start --dev-client        # dev build (đầy đủ tính năng)
npx expo start                     # Expo Go (chỉ email/password)
npx expo start -c                  # clear Metro cache
npx expo run:android               # local build trên Windows
eas build --profile development --platform android   # dev build cloud
eas build --profile preview --platform android       # preview APK
eas build --profile production --platform android    # production
npm run lint
```

**Firebase Data Connect:**
```powershell
firebase emulators:start --only dataconnect   # khởi động emulator local
firebase dataconnect:sdk:generate             # tái sinh SDK sau khi sửa .gql
firebase deploy --only dataconnect:schema     # deploy schema lên Cloud SQL
firebase deploy --only dataconnect            # deploy schema + connector
```

**Data Connect CLI (`query.js`):**
```powershell
node query.js seed                              # seed tags + skills
node query.js info                              # xem schema, số records
node query.js select tag                        # list tất cả tags
node query.js select tag 5                      # lấy tag id=5
node query.js insert tag '{"id":21,"name":"TypeScript"}'
node query.js upsert skill '{"id":11,"name":"GraphQL"}'
node query.js update tag 21 '{"name":"TS"}'
node query.js delete tag 21
node query.js delete all                        # xóa toàn bộ data
node query.js gql 'query { ideas { id title } }'
node query.js --help
```
