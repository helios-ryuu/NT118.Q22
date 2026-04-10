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
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Khởi chạy local](#khởi-chạy-local)
- [Quản lý schema và dữ liệu](#quản-lý-schema-và-dữ-liệu)
- [Build Android với EAS](#build-android-với-eas)
- [Lệnh hay dùng](#lệnh-hay-dùng)

---

## GIỚI THIỆU

| | |
|---|---|
| Môn học | Phát triển ứng dụng trên thiết bị di động (NT118) |
| Lớp | NT118.Q22 — HK2 2025-2026 |
| Giảng viên | ThS. Trần Hồng Nghi — nghith@uit.edu.vn |
| Đề tài | **RedShark** — Ứng dụng di động quản lý năng suất cộng tác |

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
- **Email/password:** Firebase Auth `createUserWithEmailAndPassword` / `signInWithEmailAndPassword` → `onAuthStateChanged` → `GetMe` query → set user state
- **Google Sign-In:** native popup → `signInWithCredential` (Firebase) → `onAuthStateChanged` → nếu user mới: `UpsertUser` mutation → `GetMe` → set user state

**Không có backend server riêng.** Frontend gọi thẳng Firebase Data Connect SDK — mọi quyền truy cập được kiểm soát qua `@auth(level: USER/PUBLIC)` directive và CEL expression (`auth.uid == authorId`) trực tiếp trong file `.gql`.

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

## KHỞI CHẠY LOCAL

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

**`.env.local`** (đặt tại thư mục gốc):
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
```

---

### Bước 3 — Khởi động Firebase Data Connect Emulator

```powershell
# Từ thư mục gốc NT118.Q22/
firebase emulators:start --only dataconnect
```

FDC endpoint: `localhost:9399` (Android emulator: `10.0.2.2:9399`)

> **Lưu ý:** Data Connect emulator không có Emulator UI và Firebase web console không kết nối được tới emulator local. Dùng `query.js` để thao tác dữ liệu.

**Seed dữ liệu (lần đầu):** Chạy sau khi emulator đã khởi động:

```powershell
node query.js seed
```

Dữ liệu được lưu tại `dataconnect/.dataconnect/pgliteData` và tồn tại qua các lần restart emulator.

> **Emulator vs. Production:** Dữ liệu seed chỉ tồn tại trên máy cá nhân, không đụng đến Cloud SQL production. Mỗi thành viên seed độc lập trên máy của mình.

---

### Bước 4 — Chạy frontend

Vì dùng native module (`@react-native-google-signin`), phải build dev client thay vì Expo Go:

```powershell
npx expo run:android        # lần đầu (~5 phút build native)
npx expo start --dev-client # các lần sau
```

> **Tại sao không dùng Expo Go để test Google Sign-In?**
>
> Expo Go về bản chất là một "vỏ bọc" ứng dụng có sẵn, được cài từ CH Play/App Store. Nó **không chứa thư viện Native** (code Java/Kotlin/Swift) của bên thứ ba. Thư viện `@react-native-google-signin` bắt buộc phải giao tiếp sâu với hệ điều hành Android để gọi popup chọn tài khoản Google — điều này không thể thực hiện trong môi trường Expo Go.
>
> **Để test Google Sign-In trên Android Emulator, thực hiện đủ 3 bước sau:**
> 1. **Chuẩn bị máy ảo đúng loại:** Trong Android Studio, chọn emulator có biểu tượng Google Play bên cạnh tên (loại *Google APIs* hoặc *Google Play*). Máy ảo loại *AOSP* thuần túy sẽ không có Google Services và sẽ không hoạt động.
> 2. **Đăng nhập tài khoản Google vào máy ảo:** Khởi động emulator → vào **Settings → Accounts → Add account → Google** → đăng nhập một tài khoản Gmail bất kỳ. Đây là bước nhiều người hay bỏ qua.
> 3. **Build Native thay vì dùng Expo Go:** Chạy `npx expo run:android` để biên dịch toàn bộ code React Native cùng thư viện Google Sign-In thành APK và cài thẳng vào máy ảo. Sau bước này, nút *"Đăng nhập bằng Google"* sẽ hoạt động như trên một app tải từ CH Play.
>
> Nếu chỉ cần test **email/password**, không cần build native: `npx expo start` (Expo Go) là đủ.

---

### Test auth

**Email/password:**
1. Mở app → nhập email mới → màn hình đăng ký
2. Điền tên hiển thị, username, mật khẩu (≥ 8 ký tự, gồm chữ và số)
3. Đăng ký thành công → vào app

**Google Sign-In (emulator):**
1. Emulator: Settings → Accounts → thêm Google account
2. Mở app → nhấn **Google** → chọn tài khoản → đăng nhập thành công

> Google button không hoạt động: cần thêm SHA-1 fingerprint vào Firebase Console → Project Settings → Android app `com.helios.redshark` → Add fingerprint. Lấy SHA-1 bằng `eas credentials`.

---

### Reset để test lại từ đầu

**Xóa session trên thiết bị:**
```powershell
adb shell pm clear com.helios.redshark
```

**Xóa dữ liệu emulator (trong khi emulator đang chạy):**
```powershell
node query.js delete all   # xóa toàn bộ data
node query.js seed         # seed lại
```

Hoặc xóa thủ công: dừng emulator → xóa thư mục `dataconnect/.dataconnect/pgliteData` → khởi động lại và seed lại.

---

## QUẢN LÝ SCHEMA VÀ DỮ LIỆU

### Firebase Data Connect là nguồn sự thật

Schema được định nghĩa tại [dataconnect/schema/schema.gql](dataconnect/schema/schema.gql). Không viết SQL thủ công (`CREATE TABLE`, `ALTER TABLE`).

### Sửa schema

```powershell
# 1. Chỉnh sửa dataconnect/schema/schema.gql
# 2. Deploy lên Cloud SQL:
firebase deploy --only dataconnect:schema

# 3. Tái sinh TypeScript SDK:
firebase dataconnect:sdk:generate
```

### Thêm/sửa queries và mutations

Chỉnh sửa [dataconnect/redshark/queries.gql](dataconnect/redshark/queries.gql) hoặc [dataconnect/redshark/mutations.gql](dataconnect/redshark/mutations.gql), sau đó:

```powershell
firebase dataconnect:sdk:generate
# SDK được sinh vào src/dataconnect-generated/
```

---

## BUILD ANDROID VỚI EAS

```powershell
npm install -g eas-cli
eas login

eas build --profile development --platform android  # dev build (emulator/thiết bị)
eas build --profile preview --platform android      # preview APK
eas build --profile production --platform android   # production
```

**Quản lý keystore và SHA-1 fingerprint:**
```powershell
eas credentials
# Chọn: Android → production → Keystore → để EAS tự quản lý
```

Sau khi có SHA-1: Firebase Console → Project Settings → Android app `com.helios.redshark` → Add fingerprint.

> Local build nếu cần (không cần internet):
> ```powershell
> eas build --profile development --platform android --local
> ```

---

## LỆNH HAY DÙNG

**Frontend:**
```powershell
npx expo start                     # Expo Go (chỉ email/password)
npx expo start --dev-client        # dev build (đầy đủ tính năng)
npx expo start -c                  # clear Metro cache
npx expo run:android               # build lại native
npm run lint
```

**Firebase Data Connect:**
```powershell
# Khởi động emulator local
firebase emulators:start --only dataconnect

# Tái sinh TypeScript SDK (sau khi sửa .gql)
firebase dataconnect:sdk:generate

# Deploy schema lên Cloud SQL production
firebase deploy --only dataconnect:schema

# Deploy cả schema + connector
firebase deploy --only dataconnect
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
