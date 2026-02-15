<p align="center">
  <a href="https://www.uit.edu.vn/" title="Trường Đại học Công nghệ Thông tin">
    <img src="https://i.imgur.com/WmMnSRt.png" alt="Trường Đại học Công nghệ Thông tin | University of Information Technology">
  </a>
</p>
<h1 align="center"><b>NT118.Q22 - PHÁT TRIỂN ỨNG DỤNG TRÊN THIẾT BỊ DI ĐỘNG</b></h1>

## BẢNG MỤC LỤC
* [Giới thiệu môn học](#giới-thiệu-môn-học)
* [Giới thiệu đồ án môn học](#giới-thiệu-đồ-án-môn-học)
* [Thành viên nhóm](#thành-viên-nhóm)
* [Cài đặt phần mềm](#cài-đặt-phần-mềm)
* [Khởi chạy dự án](#khởi-chạy-dự-án)
* [Công nghệ sử dụng](#công-nghệ-sử-dụng)


## GIỚI THIỆU MÔN HỌC
* **Tên môn học**: Phát triển ứng dụng trên thiết bị di động - Mobile Application Development
* **Mã môn học**: NT118
* **Lớp học**: NT118.Q22
* **Năm học**: HK2 2025-2026
* **Giảng viên hướng dẫn:** ThS. **Trần Hồng Nghi**
* **Email:** *nghith@uit.edu.vn*

---

## GIỚI THIỆU ĐỒ ÁN MÔN HỌC
* **Đề tài đồ án nhóm:** Ứng dụng di động quản lý năng suất

---

## THÀNH VIÊN NHÓM
| STT |   MSSV   |           Họ và Tên |                                                      Github |                  Email |
|-----|:--------:|--------------------:|------------------------------------------------------------:|-----------------------:|
| 1   | 23521367 |         Ngô Tiến Sỹ |               [helios-ryuu](https://github.com/helios-ryuu) | 23521367@gm.uit.edu.vn |
| 2   | 24520442 |      Phạm Tuấn Hải |               [haiphamt](https://github.com/haiphamt) | 24520442@gm.uit.edu.vn |
| 3   | 23520982 |      Nguyễn Văn Nam |               [Sinister-VN](https://github.com/Sinister-VN) | 23520982@gm.uit.edu.vn |

---

## CÀI ĐẶT PHẦN MỀM
- [X] [Docker](https://www.docker.com/)
- [X] [Git](https://git-scm.com/)
- [X] [Java Development Kit 25](https://www.oracle.com/java/technologies/downloads/)
- [X] [Android Studio](https://developer.android.com/studio)
- [X] [NVM (Node Version Manager)](https://github.com/nvm-sh/nvm)

### Hướng dẫn cài đặt JDK

1. **Tải JDK phiên bản phù hợp**
   - Truy cập [https://www.oracle.com/java/technologies/downloads/](https://www.oracle.com/java/technologies/downloads/)
   - Tải **Java Development Kit** về máy - Exe file

2. **Tiến hành cài đặt**
   - Chạy file **jdk-[version]_windows-x64_bin.exe**
   - Hoàn tất cài đặt

3. **Kiểm tra cài đặt JDK**
   ```cmd
   java -version
   javac -version
   ```

### Hướng dẫn cài đặt NVM (Node.js 24.13.0)

1. **Tải NVM**
   - Truy cập [https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)
   - Tải **nvm-setup.exe**

2. **Chạy trình cài đặt**
   - Chạy file **nvm-setup.exe**
   - Hoàn tất cài đặt

3. **Kiểm tra cài đặt NVM**
   ```cmd
   nvm version
   ```

4. **Cài đặt Node.js phiên bản 24.13.0**
   ```cmd
   nvm install 24.13.0
   ```

5. **Sử dụng Node.js phiên bản 24.13.0**
   ```cmd
   nvm use 24.13.0
   ```

6. **Kiểm tra phiên bản Node.js**
   ```cmd
   node -v
   npm -v
   ```

> **Lưu ý:** Nếu gặp lỗi phân quyền, hãy chạy Terminal/Command Prompt với quyền Administrator.


---

## KHỞI CHẠY DỰ ÁN
> ⚠️ **Phải bật Android Studio và khởi động 1 thiết bị Android ảo hoặc kết nối 1 thiết bị Android thật trước khi chạy lệnh**

### Bước 1: Khởi chạy ứng dụng React Native

1. **Mở terminal tại thư mục `redshark/` và khởi chạy Expo:**
   ```cmd
   npm install
   npx expo start
   ```

2. **Chạy ứng dụng trên máy ảo:**
   - Nhấn phím **a** để khởi chạy ứng dụng trên máy ảo Android (đã mở sẵn ở Android Studio).

### Bước 2: Khởi chạy backend Java Spring Boot

1. **Mở terminal tại thư mục `redshark-backend/` và chạy lệnh:**
   ```cmd
   .\gradlew.bat bootRun
   ```

---

## CÔNG NGHỆ SỬ DỤNG

> **Cập nhật:** 10 tháng 2 năm 2026

### Backend

1. **Ngôn ngữ:** [Java 25](https://www.oracle.com/java/technologies/downloads/)
2. **Framework:** [Spring Boot 4.0.2](https://spring.io/projects/spring-boot)

### Frontend

1. **Ngôn ngữ:** [TypeScript](https://www.typescriptlang.org/)
2. **Framework và công cụ:**
    * [React Native 0.81.5](https://reactnative.dev/) – Mobile application framework  
    * [Expo](https://expo.dev/) – Toolchain hỗ trợ phát triển và chạy ứng dụng React Native

### Database

**Hệ quản trị cơ sở dữ liệu:** [PostgreSQL 18.1](https://www.postgresql.org/)

### Firebase Services

1. **Authentication:** Sử dụng [Firebase Authentication](https://firebase.google.com/docs/auth) để hỗ trợ đăng nhập người dùng (Email/Password, Google, Apple, v.v.). Firebase đóng vai trò là Identity Provider, backend Spring Boot thực hiện xác thực Firebase ID Token.

2. **Push Notification:** Sử dụng [Firebase Cloud Messaging (FCM)](https://firebase.google.com/docs/cloud-messaging) để gửi thông báo đẩy (push notification) từ backend tới ứng dụng mobile.

3. **Analytics:** Sử dụng [Firebase Analytics](https://firebase.google.com/docs/analytics) để theo dõi hành vi người dùng, sự kiện trong ứng dụng và phân tích hiệu suất sử dụng.

4. **Crash Reporting:** Sử dụng [Firebase Crashlytics](https://firebase.google.com/docs/crashlytics) để theo dõi, ghi nhận và phân tích các lỗi crash xảy ra trên ứng dụng mobile.

### Deployment – Nền tảng triển khai

1. **Mobile Application:** Ứng dụng mobile phía người dùng (client) được triển khai trên [Google Play Store](https://play.google.com/store/apps)

2. **Backend API:** Dịch vụ Java Spring Boot API được triển khai lên [Railway](https://railway.app/)

3. **Cơ sở dữ liệu:** Sử dụng [Supabase](https://supabase.com/) (managed database) với PostgreSQL 18.1 instance để lưu trữ dữ liệu người dùng, sản phẩm, giao dịch, v.v.

4. **File Storage:** Sử dụng [Supabase Storage](https://supabase.com/docs/guides/storage) (bucket: `redshark`) để lưu trữ avatar người dùng, video và các file upload khác


### CI/CD & DevOps

1. **Containerization:**  
   Sử dụng [Docker](https://www.docker.com/) để đóng gói backend Spring Boot API dưới dạng container, đảm bảo tính nhất quán giữa môi trường phát triển, kiểm thử và triển khai.

2. **Version Control & CI/CD:**  
   Sử dụng [GitHub Actions](https://docs.github.com/en/actions) để tự động hóa quy trình:
   - Build project
   - Chạy test
   - Build Docker image
   - Deploy backend API lên Railway

3. **Testing:**  
   - **Backend Testing:**  
     Sử dụng **JUnit 5** và **Spring Boot Test** để kiểm thử unit test và integration test cho các service, controller và repository.
   - **API Testing:**  
     Sử dụng test tích hợp trong pipeline CI để đảm bảo các endpoint hoạt động đúng trước khi deploy.

4. **Monitoring & Metrics:**  
   - Sử dụng **Spring Boot Actuator** để expose health check và metrics.
   - Sử dụng **Prometheus** để thu thập metrics từ backend API.
   - Sử dụng **Grafana** để trực quan hóa các chỉ số như:
     - CPU / Memory usage
     - Request count
     - Response time
     - Error rate

5. **Logging & Error Tracking:**  
   - **Logging:**  
     Sử dụng logging framework mặc định của Spring Boot (Logback) để ghi log ứng dụng.
   - **Error Tracking:**  
     Tích hợp [Sentry](https://sentry.io/) để theo dõi lỗi runtime, exception và performance issue của backend API cũng như mobile application.

6. **Infrastructure as Code (Optional):**  
   - Sử dụng [Terraform](https://www.terraform.io/) để mô tả và quản lý hạ tầng (cloud resources, environment variables, service configuration) dưới dạng mã nguồn khi mở rộng hệ thống.

7. **Container Orchestration (Optional):**  
   - Sử dụng [Kubernetes](https://kubernetes.io/) trong trường hợp hệ thống mở rộng về quy mô, cần auto-scaling, rolling update và quản lý nhiều service backend.

