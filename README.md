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
* [Công nghệ sử dụng](#công-nghệ-sử-dụng)

> **Hướng dẫn cài đặt và triển khai:** xem [SETUP.md](./SETUP.md)

---

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
| STT |   MSSV   |      Họ và Tên |                                        Github |                  Email |
|-----|:--------:|---------------:|----------------------------------------------:|-----------------------:|
| 1   | 23521367 |    Ngô Tiến Sỹ | [helios-ryuu](https://github.com/helios-ryuu) | 23521367@gm.uit.edu.vn |
| 2   | 24520442 |  Phạm Tuấn Hải |       [haiphamt](https://github.com/haiphamt) | 24520442@gm.uit.edu.vn |
| 3   | 23520982 | Nguyễn Văn Nam | [Sinister-VN](https://github.com/Sinister-VN) | 23520982@gm.uit.edu.vn |

---

## CÔNG NGHỆ SỬ DỤNG

> **Cập nhật:** 22 tháng 3 năm 2026

### Backend

| | Công nghệ | Chi tiết |
|---|---|---|
| Ngôn ngữ | [Java 25.0.2](https://www.oracle.com/java/technologies/downloads/) | |
| Framework | [Spring Boot 4.0.4](https://spring.io/projects/spring-boot) | Build tool: Maven Wrapper (`./mvnw`) |
| Package | `com.helios.redshark` | Group: `com.helios` · Artifact: `redshark` |

### Frontend

| | Công nghệ | Chi tiết |
|---|---|---|
| Ngôn ngữ | [TypeScript](https://www.typescriptlang.org/) | |
| Thư viện | [React 19.1](https://react.dev/) | Thư viện giao diện người dùng |
| Framework | [React Native 0.81.5](https://reactnative.dev/) | Nền tảng phát triển ứng dụng di động |
| Toolchain | [Expo](https://expo.dev/) | Công cụ phát triển & build |

### Database & Storage

| Dịch vụ | Công nghệ | Chi tiết |
|---|---|---|
| PostgreSQL | [Supabase Database](https://supabase.com/docs/guides/database) — PostgreSQL | Cơ sở dữ liệu quan hệ được quản lý bởi Supabase |
| Lưu trữ tệp | [Supabase Storage](https://supabase.com/docs/guides/storage) | Object storage, bucket `redshark` |

### Firebase Services

| Dịch vụ | Mục đích |
|---|---|
| [Firebase Authentication](https://firebase.google.com/docs/auth) | Identity Provider — đăng nhập Email/Password, Google, Apple. Backend xác thực Firebase ID Token. |
| [Firebase Cloud Messaging (FCM)](https://firebase.google.com/docs/cloud-messaging) | Push notification từ backend tới mobile. |

### Deployment

| Thành phần | Công nghệ | Chi tiết |
|---|---|---|
| Container | [Docker](https://www.docker.com/) | Multi-stage build (`api/Dockerfile`) |
| Orchestration | [k3s](https://k3s.io/) | Homelab multi-node cluster (3 master + 2 worker) |
| API deployment | Helm chart | `services/redshark/` — Deployment + ClusterIP Service |
| Public access | [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) | Không cần static IP hay mở port router |
| Mobile release | [Google Play Store](https://play.google.com/store/apps) | |

Kiến trúc tunnel:

```
Mobile App (React Native)
        │ HTTPS
        ▼
Cloudflare Edge
        │ Tunnel (outbound từ cluster)
        ▼
cloudflared (namespace: cloudflared)
        │
        └─▶ redshark-api.helios.id.vn → Spring Boot Service :8080
```

### CI/CD & DevOps

| Thành phần | Công nghệ | Mục đích |
|---|---|---|
| CI/CD | [GitHub Actions](https://docs.github.com/en/actions) | Build · Test · Push image · Deploy rolling update |
| Testing | JUnit 5 + Spring Boot Test | Unit test và integration test |
| Monitoring | Spring Boot Actuator + Prometheus + [Grafana](https://grafana.com/) | Health check, metrics (CPU/Memory/Requests/Errors) |
| Logging | Logback → [Alloy](https://grafana.com/docs/alloy/) → [Loki](https://grafana.com/oss/loki/) → Grafana | Cluster-wide log aggregation và error tracking |
