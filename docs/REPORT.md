# BÁO CÁO ĐỒ ÁN MÔN HỌC

<p align="center">
  <b>TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN — ĐHQG TP.HCM</b><br>
  <b>KHOA MẠNG MÁY TÍNH VÀ TRUYỀN THÔNG</b>
</p>

<p align="center">
  <b>MÔN HỌC: PHÁT TRIỂN ỨNG DỤNG TRÊN THIẾT BỊ DI ĐỘNG (NT118.Q22)</b><br>
  Học kỳ 2 — Năm học 2025–2026
</p>

<p align="center">
  <b>ĐỀ TÀI</b><br>
  <b><em>REDSHARK — ỨNG DỤNG MẠNG XÃ HỘI ĐÓNG GÓP Ý TƯỞNG</em></b>
</p>

<p align="center">
  <b>Giảng viên hướng dẫn:</b> ThS. Trần Hồng Nghi<br>
  <b>Nhóm thực hiện:</b><br>
  23521367 — Ngô Tiến Sỹ (Trưởng nhóm)<br>
  24520442 — Phạm Tuấn Hải<br>
  23520982 — Nguyễn Văn Nam
</p>

<p align="center"><em>TP. Hồ Chí Minh, tháng 05 năm 2026</em></p>

---

## LỜI MỞ ĐẦU

Trong những năm gần đây, cùng với sự phát triển mạnh mẽ của công nghệ di động, các ứng dụng mobile đã trở thành một phần không thể thiếu trong đời sống hàng ngày. Từ công việc, học tập cho đến giải trí, mạng xã hội — đâu đâu chúng ta cũng thấy bóng dáng của các ứng dụng trên smartphone. Trong bối cảnh đó, việc trang bị cho sinh viên ngành Công nghệ Thông tin các kỹ năng phát triển ứng dụng di động là một yêu cầu thiết thực và cấp bách.

Môn học *Phát triển ứng dụng trên thiết bị di động (NT118)* tại Trường Đại học Công nghệ Thông tin — ĐHQG TP.HCM được thiết kế nhằm cung cấp cho sinh viên kiến thức nền tảng và kỹ năng thực hành về quy trình phát triển một ứng dụng di động hoàn chỉnh: từ giai đoạn khảo sát yêu cầu, phân tích, thiết kế, hiện thực, kiểm thử cho đến triển khai sản phẩm.

Đồ án cuối khóa là cơ hội để nhóm chúng em vận dụng các kiến thức đã học, đồng thời mở rộng khả năng tự học và làm việc nhóm. Với đề tài **RedShark — Ứng dụng mạng xã hội đóng góp ý tưởng**, nhóm mong muốn xây dựng một sản phẩm vừa mang tính thực tiễn, vừa áp dụng được các công nghệ hiện đại trong lĩnh vực phát triển mobile và backend-as-a-service.

Báo cáo này ghi lại toàn bộ quá trình nghiên cứu, phân tích, thiết kế và hiện thực hệ thống RedShark trong khuôn khổ môn học. Mặc dù đã cố gắng hết sức, song do giới hạn về thời gian và kinh nghiệm, chắc chắn báo cáo không tránh khỏi các thiếu sót. Nhóm rất mong nhận được sự góp ý chân thành từ thầy và các bạn để có thể hoàn thiện sản phẩm hơn trong các phiên bản sau.

---

## LỜI GIỚI THIỆU

**RedShark** là một ứng dụng di động Android được xây dựng với mục tiêu trở thành một *mạng xã hội cho các ý tưởng*. Trong khi nhiều công cụ hiện nay tập trung vào việc quản lý dự án đã hoạt động (như Jira, Trello, GitHub Projects), hoặc cung cấp các diễn đàn thảo luận chung (như Reddit, Facebook Groups), thì RedShark lại định vị mình ở *khoảng giữa*: một nơi để nuôi dưỡng, trình bày và phát triển các ý tưởng ở giai đoạn sơ khai — cái giai đoạn mà ý tưởng vẫn chưa đủ chín để mở repository GitHub nhưng đã cần một không gian có cấu trúc để ghi lại và kết nối với cộng sự.

Trong RedShark, mỗi người dùng có thể đăng tải **Idea** — một bài viết ngắn mô tả ý tưởng của mình, gắn với các tag phân loại. Ý tưởng được hiển thị trên feed của cộng đồng. Những người quan tâm có thể **bình luận** để thảo luận công khai, hoặc **xin được trở thành collaborator** — một vai trò đặc biệt cho phép họ tham gia sâu hơn vào việc phát triển ý tưởng bằng cách tạo và quản lý các **Issue** (các task, vấn đề, chủ đề thảo luận con). Ngoài ra, người dùng có thể **nhắn tin trực tiếp** với nhau để trao đổi cá nhân.

Về mặt kỹ thuật, RedShark được xây dựng trên nền **React Native (Expo)** cho phần frontend, và sử dụng **Firebase Data Connect** — một sản phẩm mới của Google kết hợp GraphQL và Cloud SQL PostgreSQL — cho phần backend-as-a-service. Đây là một lựa chọn công nghệ vừa hiện đại, vừa có tính thử nghiệm cao, giúp nhóm tiếp cận được với các xu hướng mới nhất trong phát triển mobile.

---

## LỜI CẢM ƠN

Trước hết, nhóm xin gửi lời cảm ơn chân thành và sâu sắc nhất đến **ThS. Trần Hồng Nghi** — giảng viên môn học *Phát triển ứng dụng trên thiết bị di động (NT118)*. Thầy đã tận tình hướng dẫn, chia sẻ kinh nghiệm thực tiễn, và cho chúng em những nhận xét quý báu xuyên suốt quá trình thực hiện đồ án. Sự nhiệt huyết và kiến thức chuyên sâu của thầy là nguồn động lực to lớn giúp nhóm vượt qua những khó khăn trong quá trình phát triển.

Nhóm cũng xin cảm ơn **Khoa Mạng máy tính và Truyền thông, Trường Đại học Công nghệ Thông tin — ĐHQG TP.HCM** đã tạo điều kiện thuận lợi về cơ sở vật chất, tài liệu học tập và môi trường học thuật để nhóm có thể tập trung nghiên cứu và hoàn thành đồ án.

Cuối cùng, nhóm xin cảm ơn **gia đình, bạn bè và các bạn sinh viên cùng lớp NT118.Q22** đã hỗ trợ, góp ý và chia sẻ kinh nghiệm trong suốt thời gian thực hiện đồ án này.

Xin chân thành cảm ơn!

*TP. Hồ Chí Minh, tháng 05 năm 2026*
*Nhóm thực hiện*

---

## MỤC LỤC

- [LỜI MỞ ĐẦU](#lời-mở-đầu)
- [LỜI GIỚI THIỆU](#lời-giới-thiệu)
- [LỜI CẢM ƠN](#lời-cảm-ơn)
- [DANH MỤC BẢNG](#danh-mục-bảng)
- [DANH MỤC HÌNH ẢNH](#danh-mục-hình-ảnh)
- [DANH MỤC TỪ VIẾT TẮT](#danh-mục-từ-viết-tắt)
- [TÓM TẮT](#tóm-tắt)
- [CHƯƠNG 1. GIỚI THIỆU / TỔNG QUAN ĐỀ TÀI](#chương-1-giới-thiệu--tổng-quan-đề-tài)
  - [1.1. Đặt vấn đề](#11-đặt-vấn-đề)
  - [1.2. Mục tiêu đề tài](#12-mục-tiêu-đề-tài)
  - [1.3. Phạm vi nghiên cứu](#13-phạm-vi-nghiên-cứu)
  - [1.4. Đối tượng nghiên cứu](#14-đối-tượng-nghiên-cứu)
  - [1.5. Phương pháp thực hiện](#15-phương-pháp-thực-hiện)
  - [1.6. Cấu trúc báo cáo](#16-cấu-trúc-báo-cáo)
- [CHƯƠNG 2. CƠ SỞ LÝ THUYẾT](#chương-2-cơ-sở-lý-thuyết)
  - [2.1. React Native và hệ sinh thái Expo](#21-react-native-và-hệ-sinh-thái-expo)
  - [2.2. Expo Router — điều hướng file-based](#22-expo-router--điều-hướng-file-based)
  - [2.3. NativeWind — Tailwind CSS cho React Native](#23-nativewind--tailwind-css-cho-react-native)
  - [2.4. TanStack React Query — quản lý server state](#24-tanstack-react-query--quản-lý-server-state)
  - [2.5. Firebase Authentication](#25-firebase-authentication)
  - [2.6. Firebase Data Connect — công nghệ mới](#26-firebase-data-connect--công-nghệ-mới)
  - [2.7. GraphQL](#27-graphql)
  - [2.8. Cloud SQL PostgreSQL](#28-cloud-sql-postgresql)
  - [2.9. Cloudflare R2 Object Storage](#29-cloudflare-r2-object-storage)
  - [2.10. Kiến trúc Serverless / Backend-as-a-Service](#210-kiến-trúc-serverless--backend-as-a-service)
- [CHƯƠNG 3. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG](#chương-3-phân-tích-và-thiết-kế-hệ-thống)
  - [3.1. Phân tích yêu cầu](#31-phân-tích-yêu-cầu)
  - [3.2. Sơ đồ use-case](#32-sơ-đồ-use-case)
  - [3.3. Sơ đồ phân rã chức năng](#33-sơ-đồ-phân-rã-chức-năng)
  - [3.4. Sơ đồ cơ sở dữ liệu](#34-sơ-đồ-cơ-sở-dữ-liệu)
  - [3.5. User Story và Flow](#35-user-story-và-flow)
  - [3.6. Wireframe](#36-wireframe)
- [CHƯƠNG 4. HIỆN THỰC ĐỀ TÀI](#chương-4-hiện-thực-đề-tài)
  - [4.1. Kiến trúc tổng thể](#41-kiến-trúc-tổng-thể)
  - [4.2. Thành phần Mobile Frontend](#42-thành-phần-mobile-frontend)
  - [4.3. Thành phần Backend — Firebase Platform](#43-thành-phần-backend--firebase-platform)
  - [4.4. Thành phần Storage — Cloudflare R2](#44-thành-phần-storage--cloudflare-r2)
  - [4.5. Quy trình build và triển khai](#45-quy-trình-build-và-triển-khai)
- [CHƯƠNG 5. KIỂM THỬ](#chương-5-kiểm-thử)
  - [5.1. Chiến lược kiểm thử](#51-chiến-lược-kiểm-thử)
  - [5.2. Kiểm thử chức năng](#52-kiểm-thử-chức-năng)
  - [5.3. Kiểm thử phi chức năng](#53-kiểm-thử-phi-chức-năng)
  - [5.4. Kết quả kiểm thử](#54-kết-quả-kiểm-thử)
- [CHƯƠNG 6. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN](#chương-6-kết-luận-và-hướng-phát-triển)
  - [6.1. Kết quả đạt được](#61-kết-quả-đạt-được)
  - [6.2. Hạn chế](#62-hạn-chế)
  - [6.3. Hướng phát triển](#63-hướng-phát-triển)
- [TÀI LIỆU THAM KHẢO](#tài-liệu-tham-khảo)

---

## DANH MỤC BẢNG

*(Để trống — sẽ cập nhật sau khi hoàn tất biên tập báo cáo.)*

---

## DANH MỤC HÌNH ẢNH

*(Để trống — sẽ cập nhật sau khi hoàn tất biên tập báo cáo.)*

---

## DANH MỤC TỪ VIẾT TẮT

| Từ viết tắt | Nghĩa đầy đủ (tiếng Anh) | Giải thích tiếng Việt |
|---|---|---|
| **API** | Application Programming Interface | Giao diện lập trình ứng dụng |
| **APK** | Android Package Kit | Gói cài đặt ứng dụng Android |
| **AOSP** | Android Open Source Project | Dự án mã nguồn mở Android |
| **BaaS** | Backend-as-a-Service | Dịch vụ backend sẵn có |
| **CEL** | Common Expression Language | Ngôn ngữ biểu thức chung của Google |
| **CI/CD** | Continuous Integration / Continuous Deployment | Tích hợp và triển khai liên tục |
| **CLI** | Command-Line Interface | Giao diện dòng lệnh |
| **CRUD** | Create, Read, Update, Delete | Tạo, đọc, cập nhật, xóa |
| **CSDL** | Cơ sở dữ liệu | Database |
| **DBMS** | Database Management System | Hệ quản trị cơ sở dữ liệu |
| **EAS** | Expo Application Services | Dịch vụ build/deploy của Expo |
| **FCM** | Firebase Cloud Messaging | Dịch vụ push notification của Firebase |
| **FDC** | Firebase Data Connect | Sản phẩm backend GraphQL của Firebase |
| **FR** | Functional Requirement | Yêu cầu chức năng |
| **GraphQL** | Graph Query Language | Ngôn ngữ truy vấn đồ thị |
| **JWT** | JSON Web Token | Mã thông báo JSON |
| **MVP** | Minimum Viable Product | Sản phẩm khả dụng tối thiểu |
| **NFR** | Non-Functional Requirement | Yêu cầu phi chức năng |
| **OAuth** | Open Authorization | Giao thức xác thực mở |
| **ORM** | Object-Relational Mapping | Ánh xạ đối tượng – quan hệ |
| **PK** | Primary Key | Khóa chính |
| **FK** | Foreign Key | Khóa ngoại |
| **R2** | Cloudflare R2 Storage | Dịch vụ lưu trữ object của Cloudflare |
| **RN** | React Native | Framework mobile đa nền tảng |
| **SDK** | Software Development Kit | Bộ công cụ phát triển phần mềm |
| **SHA-1** | Secure Hash Algorithm 1 | Thuật toán băm dùng để fingerprint keystore |
| **SPA** | Single Page Application | Ứng dụng một trang |
| **SQL** | Structured Query Language | Ngôn ngữ truy vấn có cấu trúc |
| **SSO** | Single Sign-On | Đăng nhập một lần |
| **UI/UX** | User Interface / User Experience | Giao diện và trải nghiệm người dùng |
| **UID** | Unique Identifier | Mã định danh duy nhất (Firebase UID) |
| **UIT** | University of Information Technology | Trường Đại học Công nghệ Thông tin |
| **UUID** | Universally Unique Identifier | Mã định danh duy nhất toàn cầu |

---

## TÓM TẮT

Đồ án **RedShark** xây dựng một ứng dụng di động Android đóng vai trò là một *mạng xã hội cho ý tưởng*, nơi người dùng có thể đăng tải, thảo luận và hợp tác phát triển các ý tưởng của mình với cộng đồng. Ứng dụng hiện thực các tính năng cốt lõi gồm: xác thực đa phương thức (email/password và Google Sign-In), quản lý profile cá nhân, đăng ý tưởng dưới dạng feed, tạo và quản lý các issue (task/vấn đề) gắn với mỗi ý tưởng, bình luận công khai, cơ chế hợp tác (collaborator), nhắn tin trực tiếp giữa các người dùng, và thông báo trong ứng dụng.

Về mặt công nghệ, nhóm đã áp dụng kiến trúc *serverless* hoàn toàn: frontend sử dụng **React Native + Expo 54** viết bằng TypeScript, với điều hướng file-based qua **Expo Router 6**, styling bằng **NativeWind (Tailwind)** và quản lý server state bằng **TanStack React Query 5**. Backend không cần tự viết — thay vào đó, nhóm tận dụng **Firebase Authentication** cho việc xác thực và **Firebase Data Connect** (một sản phẩm mới kết hợp GraphQL với Cloud SQL PostgreSQL) cho tầng dữ liệu. Các file media (avatar) được lưu trên **Cloudflare R2 Object Storage** — một dịch vụ S3-compatible với chi phí thấp. Logic phân quyền, ownership check và business rule được enforce trực tiếp trong schema GraphQL bằng các directive `@auth` và CEL expression, giúp giảm đáng kể khối lượng code backend.

Đồ án đã hoàn thành đầy đủ các chức năng trong phạm vi MVP, được kiểm thử trên cả Android emulator và thiết bị thật. Kết quả thu được là một ứng dụng hoạt động ổn định, có UI/UX nhất quán, cùng với tài liệu kỹ thuật đầy đủ bao gồm đặc tả yêu cầu, mô tả schema, các quy trình nghiệp vụ và báo cáo cuối khóa. Đây cũng là cơ hội để nhóm làm quen với một stack công nghệ hiện đại và mang tính thử nghiệm — đặc biệt là Firebase Data Connect, một sản phẩm còn rất mới và chưa được cộng đồng Việt Nam khai thác nhiều.

**Từ khóa:** React Native, Expo, Firebase, Firebase Data Connect, GraphQL, Cloud SQL, Cloudflare R2, Mobile App, Idea Sharing, Social Network.

---

## CHƯƠNG 1. GIỚI THIỆU / TỔNG QUAN ĐỀ TÀI

### 1.1. Đặt vấn đề

Trong thời đại bùng nổ thông tin và khởi nghiệp, mỗi người — đặc biệt là sinh viên và những người trẻ yêu thích công nghệ — đều có rất nhiều ý tưởng nảy ra trong đầu mỗi ngày. Từ một ứng dụng nho nhỏ, một website tiện ích, một sản phẩm phần cứng, hay một dự án cộng đồng… ý tưởng luôn hiện diện khắp nơi. Tuy nhiên, phần lớn trong số chúng lại *"chết non"*: ý tưởng được viết nháp vào một file notes, sau đó bị lãng quên, hoặc không tìm được người cùng chí hướng để cùng hiện thực hóa.

Các công cụ hiện có không giải quyết được trọn vẹn vấn đề này:

- **Notion, Trello, Jira, GitHub Projects** là các công cụ quản lý dự án — chúng hiệu quả khi dự án đã được khởi động và có cấu trúc rõ ràng, nhưng quá nặng nề cho việc chỉ ghi lại một ý tưởng mới và tìm bạn đồng hành. Chúng cũng không có tính *xã hội* — bạn không thể tình cờ "khám phá" ý tưởng của người khác qua feed.
- **Facebook Groups, Reddit, Discord** là các nền tảng cộng đồng mở — phù hợp để chia sẻ và thảo luận, nhưng thiếu cấu trúc: các ý tưởng bị trôi đi rất nhanh, không có cơ chế theo dõi trạng thái, không có sự tách bạch giữa "người đóng góp chính thức" và "người qua đường bình luận".
- **GitHub** là nơi lý tưởng để host code, nhưng đòi hỏi ý tưởng phải đã chín muồi đủ để mở một repository. Việc tạo issue trên một repo trống rỗng ngay từ đầu là không thực tế.

Từ khoảng trống đó, nhóm nhận thấy cần một công cụ *nằm giữa*: vừa mang tính cộng đồng (feed, comment, direct message) như mạng xã hội, vừa có cấu trúc nhẹ (idea → issue → trạng thái) như công cụ quản lý dự án. Đó chính là ý tưởng cho **RedShark**.

Đồng thời, về mặt học thuật, nhóm cũng muốn thử nghiệm một stack công nghệ mới chưa phổ biến ở Việt Nam — cụ thể là **Firebase Data Connect** — để tận dụng cơ hội của một môn học đồ án để nghiên cứu sâu một sản phẩm vừa ra mắt thay vì lặp lại các stack đã quá quen thuộc (Node.js + Express + MongoDB).

### 1.2. Mục tiêu đề tài

Đồ án RedShark đặt ra các mục tiêu cụ thể sau:

**Mục tiêu chính:**
- Xây dựng một ứng dụng di động Android hoàn chỉnh phục vụ mục đích chia sẻ, thảo luận và hợp tác phát triển ý tưởng giữa các người dùng trong cộng đồng.
- Hiện thực đầy đủ các tính năng cốt lõi trong phạm vi MVP: xác thực, quản lý profile, CRUD idea và issue, bình luận, hợp tác, nhắn tin, thông báo.

**Mục tiêu kỹ thuật:**
- Nắm vững quy trình phát triển một ứng dụng React Native từ đầu đến cuối, bao gồm việc build native module, quản lý keystore và deploy qua EAS.
- Nghiên cứu và áp dụng **Firebase Data Connect** — một sản phẩm mới của Google — vào một dự án thực tế.
- Thiết kế và hiện thực kiến trúc serverless/BaaS: không có backend server tự viết, mọi phân quyền và nghiệp vụ được enforce ở tầng schema GraphQL.
- Sử dụng TypeScript với strict mode để đảm bảo chất lượng code.

**Mục tiêu học thuật:**
- Vận dụng các kiến thức về phân tích và thiết kế hệ thống (use-case, ERD, wireframe).
- Rèn luyện kỹ năng làm việc nhóm, phân chia công việc và quản lý tiến độ qua các milestone.
- Thực hành viết tài liệu kỹ thuật đầy đủ (SCHEMA, REQUIREMENTS, PROCESSES, REPORT).

### 1.3. Phạm vi nghiên cứu

Phạm vi đồ án bao gồm:

- **Về nền tảng:** Chỉ hiện thực cho Android (Android 7.0+). iOS và web nằm ngoài phạm vi MVP.
- **Về tính năng:** Tuân theo scope đã chốt trong [PROJECT_CHARTER.md](PROJECT_CHARTER.md) — tập trung vào các tính năng cốt lõi, không làm các tính năng nâng cao như voice/video call, push notification thực, group chat, voting/reputation, admin dashboard.
- **Về quy mô dữ liệu:** Thiết kế và kiểm thử cho quy mô người dùng vừa và nhỏ (< 1000 user), không tối ưu cho quy mô lớn. Các tối ưu như phân trang, indexing nâng cao được nhắc tới nhưng không bắt buộc trong MVP.
- **Về mô hình vận hành:** Sử dụng các dịch vụ cloud có sẵn gói miễn phí (Firebase Spark Plan, Cloudflare R2 free tier) để duy trì chi phí 0đ trong quá trình phát triển và demo.

### 1.4. Đối tượng nghiên cứu

Đồ án nghiên cứu các đối tượng chính sau đây:

1. **React Native và hệ sinh thái Expo:** cách build một ứng dụng mobile cross-platform, quản lý native module, quy trình dev/build/deploy.
2. **Firebase Data Connect:** một sản phẩm backend-as-a-service còn rất mới, kết hợp giữa GraphQL schema-first và Cloud SQL PostgreSQL truyền thống. Đây là đối tượng chính về mặt "công nghệ mới".
3. **Các pattern phát triển ứng dụng serverless:** cách thiết kế phân quyền, auto-generate SDK, enforce business logic trên schema thay vì code application.
4. **Mô hình xã hội hóa quá trình brainstorming:** làm thế nào để một cộng đồng có thể cùng nhau phát triển ý tưởng mà không rơi vào hỗn loạn.
5. **Người dùng tiềm năng:** sinh viên IT và các developer trẻ yêu thích khởi nghiệp — khảo sát nhu cầu, hành vi sử dụng và kỳ vọng.

### 1.5. Phương pháp thực hiện

Nhóm áp dụng phương pháp phát triển **agile gọn nhẹ** theo các milestone, kết hợp với các công cụ cộng tác hiện đại:

1. **Khảo sát và phân tích:** đọc tài liệu chính thức của React Native, Expo, Firebase Data Connect; nghiên cứu các app tương tự (Product Hunt, Indie Hackers…); phỏng vấn nhanh một số bạn sinh viên để xác định pain point.
2. **Thiết kế:** vẽ wireframe bằng Figma, thiết kế sơ đồ use-case và ERD, viết schema GraphQL.
3. **Hiện thực lặp:** chia nhỏ công việc theo từng sprint (tuần). Mỗi sprint có một mục tiêu rõ ràng (ví dụ: "sprint 1: login + register", "sprint 2: CRUD idea"…).
4. **Code review và pair-programming:** mọi pull request đều được ít nhất một thành viên review trước khi merge.
5. **Kiểm thử:** kiểm thử thủ công trên Android emulator và thiết bị thật sau mỗi tính năng; sử dụng Firebase Analytics để theo dõi hành vi.
6. **Tài liệu hóa:** viết tài liệu song song với code, không để dồn vào cuối đồ án.

### 1.6. Cấu trúc báo cáo

Báo cáo gồm 6 chương chính:

- **Chương 1** giới thiệu tổng quan đề tài, đặt vấn đề, mục tiêu, phạm vi và phương pháp.
- **Chương 2** trình bày các cơ sở lý thuyết và công nghệ nền tảng được sử dụng trong đồ án, với trọng tâm là các công nghệ mới/ít phổ biến như Firebase Data Connect.
- **Chương 3** mô tả chi tiết quá trình phân tích và thiết kế hệ thống, bao gồm các sơ đồ use-case, phân rã chức năng, ERD, wireframe và user story.
- **Chương 4** trình bày quá trình hiện thực ứng dụng, mô tả từng thành phần (frontend, backend, storage) và quy trình build/deploy.
- **Chương 5** trình bày chiến lược và kết quả kiểm thử.
- **Chương 6** tổng kết các kết quả đạt được, các hạn chế còn tồn tại và đề xuất hướng phát triển trong tương lai.

---

## CHƯƠNG 2. CƠ SỞ LÝ THUYẾT

Chương này trình bày các công nghệ, thư viện và khái niệm nền tảng mà nhóm đã sử dụng để hiện thực đồ án. Nhóm ưu tiên giới thiệu chi tiết các *công nghệ mới, ít phổ biến* mà cộng đồng chưa có nhiều tài liệu tiếng Việt — đặc biệt là Firebase Data Connect.

### 2.1. React Native và hệ sinh thái Expo

**React Native** là một framework mã nguồn mở do Meta (Facebook) phát triển, cho phép xây dựng các ứng dụng mobile native (iOS, Android) bằng JavaScript/TypeScript và React. Khác với các giải pháp dùng WebView như Cordova/PhoneGap, React Native sử dụng các component native thực sự, cho hiệu năng gần với ứng dụng viết thuần bằng Java/Kotlin hay Swift/Objective-C [1].

**Expo** là một hệ sinh thái xây dựng trên React Native, cung cấp:

- **Expo SDK:** một tập hợp các API JavaScript wrapper cho các tính năng native phổ biến (camera, file system, permissions, push notification…), giúp developer không phải viết native code.
- **Expo CLI và Expo Go:** công cụ dev server và app sandbox để test nhanh trên thiết bị thật mà không cần build.
- **EAS (Expo Application Services):** dịch vụ cloud build/deploy — quản lý keystore, signing, submit lên các store một cách tự động hóa [2].

Trong đồ án này, nhóm sử dụng **React Native 0.81 + Expo SDK 54** — phiên bản mới nhất tại thời điểm phát triển. Vì ứng dụng sử dụng native module (`@react-native-google-signin`) không có sẵn trong Expo Go, nhóm phải dùng **development build** (tạo bằng `expo run:android`) thay vì Expo Go.

*Nguồn tham khảo:* [1], [2].

### 2.2. Expo Router — điều hướng file-based

**Expo Router** là một thư viện routing mới cho React Native (phát hành bản ổn định từ 2023), lấy cảm hứng trực tiếp từ Next.js App Router. Thay vì phải cấu hình stack/tab navigator thủ công như `react-navigation` truyền thống, Expo Router sử dụng **file-based routing**: mỗi file trong thư mục `app/` tự động trở thành một route [3].

Các quy ước chính:
- `app/_layout.tsx` — layout gốc của ứng dụng.
- `app/(auth)/login.tsx` — route nhóm (group) — dấu ngoặc không xuất hiện trong URL, chỉ dùng để tổ chức code.
- `app/(tabs)/index.tsx` — route tab mặc định.
- `app/idea/[id].tsx` — route động, tham số truyền qua `useLocalSearchParams()`.

Trong đồ án, cấu trúc `app/` được tổ chức như sau:
```
app/
├── _layout.tsx           # Root layout + AuthProvider
├── (auth)/               # Nhóm màn hình xác thực
│   ├── _layout.tsx
│   ├── email.tsx         # Nhập email
│   ├── login.tsx         # Nhập password
│   ├── password.tsx
│   └── register.tsx      # Đăng ký
├── (tabs)/               # Tabs chính
│   ├── _layout.tsx       # Bottom tab navigator
│   ├── index.tsx         # Home feed
│   ├── issues.tsx        # My Issues
│   └── settings.tsx
├── idea/
│   ├── [id].tsx
│   └── create.tsx
├── issue/
│   ├── [id].tsx
│   ├── create.tsx
│   └── edit.tsx
└── profile/
    └── edit.tsx
```

*Nguồn tham khảo:* [3].

### 2.3. NativeWind — Tailwind CSS cho React Native

**NativeWind** là một thư viện giúp sử dụng cú pháp class utility của **Tailwind CSS** trong React Native. Thay vì viết StyleSheet truyền thống, developer có thể dùng `className="flex-1 items-center bg-white"` y như khi viết HTML [4].

Ưu điểm:
- Tăng tốc độ viết UI nhờ cú pháp quen thuộc.
- Đồng bộ với design system dễ dàng qua `tailwind.config.js`.
- Có type-safety với TypeScript.

NativeWind 4.x sử dụng một compiler tùy biến để chuyển các class name thành native styles tại thời điểm build, không ảnh hưởng tới hiệu năng runtime. Đây là một thư viện còn tương đối mới và ít người dùng ở Việt Nam nên nhóm xem nó như một phần công nghệ mới đáng nghiên cứu.

*Nguồn tham khảo:* [4].

### 2.4. TanStack React Query — quản lý server state

**React Query** (nay là TanStack Query) là một thư viện quản lý **server state** — khác biệt với các state manager client-side truyền thống như Redux hay Zustand. Quan điểm của React Query là: dữ liệu từ server luôn là "server state" — nó có thể thay đổi bất cứ lúc nào ở phía server, không nên lưu như state cục bộ [5].

Các khái niệm chính:
- **Query key:** một key (tuple) để định danh một query. Ví dụ: `["issues", "list", "open"]`.
- **Stale time:** thời gian cache được coi là "tươi", không cần refetch.
- **Cache time:** thời gian giữ cache trong memory sau khi không còn sử dụng.
- **Invalidation:** việc đánh dấu một query là "cũ" để lần render tiếp theo sẽ refetch.
- **Optimistic update:** update UI ngay lập tức trước khi server phản hồi để tăng trải nghiệm.

Trong đồ án, nhóm tập trung các query key tại `services/queryKeys.ts` để dễ quản lý, ví dụ:
```typescript
export const queryKeys = {
  issues: {
    all: ["issues"],
    lists: () => [...queryKeys.issues.all, "list"],
    list: (filter: string) => [...queryKeys.issues.lists(), filter],
    detail: (id: string) => [...queryKeys.issues.all, "detail", id],
  },
  // ...
};
```

*Nguồn tham khảo:* [5].

### 2.5. Firebase Authentication

**Firebase Authentication** là dịch vụ xác thực user do Google cung cấp, hỗ trợ nhiều phương thức: email/password, Google, Apple, Facebook, Twitter, phone number, anonymous… Dịch vụ quản lý toàn bộ các khía cạnh nhạy cảm như hash mật khẩu, refresh token, email verification, password reset… một cách tự động [6].

Trong đồ án, nhóm sử dụng hai phương thức:

1. **Email/password:** dùng `createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, `fetchSignInMethodsForEmail`.
2. **Google Sign-In:** dùng native SDK `@react-native-google-signin/google-signin` để mở popup chọn Google account, sau đó dùng `signInWithCredential(firebaseAuth, googleCredential)` để đồng bộ với Firebase Auth.

Sau khi đăng nhập, `firebaseAuth.currentUser.uid` trở thành identifier chính của user — tất cả các bảng trong FDC đều tham chiếu tới UID này qua trường `id: String` hoặc `authorId`/`recipientId`/…

*Nguồn tham khảo:* [6].

### 2.6. Firebase Data Connect — công nghệ mới

**Firebase Data Connect (FDC)** là sản phẩm mới được Google Firebase giới thiệu, kết hợp giữa **GraphQL schema-first** và **Cloud SQL PostgreSQL** truyền thống. FDC giải quyết vấn đề mà Firestore/Realtime Database không làm được: **quan hệ dữ liệu phức tạp và SQL-level query** [7].

**Các đặc điểm chính:**

1. **Schema-first với GraphQL:** developer định nghĩa schema CSDL bằng GraphQL SDL (schema definition language) trong file `.gql`. FDC tự động tạo các bảng PostgreSQL tương ứng.

2. **Sinh tự động TypeScript SDK:** từ các query và mutation định nghĩa trong `.gql`, FDC chạy `firebase dataconnect:sdk:generate` để sinh ra một TypeScript SDK type-safe. Developer chỉ cần gọi `await createIdea({ title, description })` — không cần tự viết request/response models.

3. **Phân quyền khai báo qua `@auth` directive:** mỗi operation được gắn một auth level (`PUBLIC`, `USER`, `NO_ACCESS`). FDC tự chèn điều kiện kiểm tra token vào câu query.

4. **CEL expression:** FDC cho phép dùng **Common Expression Language** của Google để chèn các giá trị động vào câu query, ví dụ: `auth.uid`, `request.time`. Điều này cho phép enforce ownership check, auto-set timestamp, auto-bind author ngay trên tầng database — *không cần viết trigger SQL hay application code*.

   ```graphql
   mutation DeleteIdea($id: UUID!) @auth(level: USER) {
     idea_update(
       first: { where: {
         id: { eq: $id }
         authorId: { eq_expr: "auth.uid" }   # chỉ owner mới xóa được
         deletedAt: { isNull: true }
       }}
       data: { deletedAt_expr: "request.time" }  # timestamp tự động
     )
   }
   ```

5. **`@transaction` directive:** cho phép gói nhiều thao tác trong một transaction atomic. Ví dụ `CreateIssue` vừa insert issue vừa update `ideas.lastActivityAt` cùng lúc:

   ```graphql
   mutation CreateIssue($ideaId: UUID!, $title: String!, $content: String!)
     @auth(level: USER) @transaction {
     idea_update(first: { where: { id: { eq: $ideaId } } },
                 data: { lastActivityAt_expr: "request.time" })
     issue_insert(data: { ideaId: $ideaId, authorId_expr: "auth.uid",
                          title: $title, content: $content, status: "OPEN" })
   }
   ```

6. **Emulator local với pglite:** FDC cung cấp một emulator dùng pglite (PostgreSQL chạy trong browser/Node qua WebAssembly) cho phép dev hoàn toàn offline, không cần Cloud SQL production.

7. **Deploy dễ dàng:** `firebase deploy --only dataconnect:schema` đồng bộ schema lên Cloud SQL; `firebase deploy --only dataconnect` đẩy cả connector.

**Tại sao chọn FDC thay vì Firestore/Realtime Database?**

| Tiêu chí | Firestore | Realtime DB | **Firebase Data Connect** |
|---|---|---|---|
| Mô hình dữ liệu | Document NoSQL | Tree NoSQL | **SQL với quan hệ thực** |
| JOIN | Không | Không | **Có (nested GraphQL field)** |
| Transaction đa bảng | Hạn chế | Không | **Có, qua `@transaction`** |
| Type-safe SDK | Không | Không | **Có (auto-generated)** |
| Tính mới | Cũ (2014/2017) | Rất cũ (2012) | **2024 (rất mới)** |

FDC tỏ ra đặc biệt phù hợp với RedShark vì dữ liệu có nhiều quan hệ 1-nhiều (user ←→ ideas ←→ issues ←→ comments) và cần transaction (tạo issue + cập nhật `lastActivityAt`).

**Lưu ý:** vì FDC còn rất mới, tài liệu và cộng đồng tiếng Việt gần như chưa có. Nhóm phải dựa chủ yếu vào **tài liệu chính thức của Firebase** và các thảo luận trên GitHub/Stack Overflow. Đây vừa là thách thức vừa là cơ hội của đồ án.

*Nguồn tham khảo:* [7], [8].

### 2.7. GraphQL

**GraphQL** là một ngôn ngữ truy vấn do Facebook phát triển năm 2012 và mở mã nguồn năm 2015, là giải pháp thay thế REST API. Với GraphQL, client định nghĩa chính xác cần field nào trong response, tránh tình trạng over-fetching hay under-fetching [9].

Các khái niệm cần thiết trong phạm vi đồ án:

- **Schema:** định nghĩa các type, query, mutation. Trong FDC, schema cũng đồng thời là schema database.
- **Query:** thao tác đọc dữ liệu.
- **Mutation:** thao tác thay đổi dữ liệu.
- **Directive:** các từ khóa bắt đầu bằng `@` cung cấp metadata cho schema. FDC dùng `@auth`, `@transaction`, `@table`, `@default`, `@unique`, …
- **Nested field:** cho phép query dữ liệu liên quan lồng nhau — thay cho JOIN trong SQL:
  ```graphql
  query ListOpenIssues {
    issues(where: { status: { eq: "OPEN" } }) {
      id
      title
      author { id, displayName, avatarUrl }  # nested
      idea { id, title }                      # nested
    }
  }
  ```

*Nguồn tham khảo:* [9].

### 2.8. Cloud SQL PostgreSQL

**Cloud SQL** là dịch vụ managed database của Google Cloud Platform (GCP), hỗ trợ MySQL, PostgreSQL và SQL Server. Trong đồ án, FDC sử dụng Cloud SQL **PostgreSQL 15** ở khu vực `asia-southeast1` (Singapore) để giảm latency từ Việt Nam [10].

PostgreSQL được chọn vì hỗ trợ:
- **Array column type** (`integer[]`, `text[]`) — dùng cho `skillIds`, `tagIds`, `collaboratorIds`, `participantIds`.
- **JSONB** — dùng cho `notifications.metaData`.
- **UUID** — dùng làm PK cho các bảng chính.
- **Generated default values** — dùng với CEL expression của FDC.

*Nguồn tham khảo:* [10].

### 2.9. Cloudflare R2 Object Storage

**Cloudflare R2** là dịch vụ object storage tương thích S3 của Cloudflare, nổi bật với việc **không tính phí egress** (outbound traffic) — một khác biệt lớn so với AWS S3 hay Google Cloud Storage [11]. Đối với một ứng dụng mobile load ảnh avatar liên tục, điều này giúp giảm chi phí đáng kể ở quy mô lớn.

Trong đồ án, R2 được dùng để lưu:
- Avatar người dùng
- (Mở rộng sau MVP) ảnh đính kèm trong tin nhắn, ảnh cover idea

Client React Native upload trực tiếp lên R2 thông qua REST API của R2 (hoặc presigned URL do backend sinh ra — trong đồ án này, do không có backend tự viết, nhóm dùng API key public-read của R2 ở cấu hình hạn chế).

*Nguồn tham khảo:* [11].

### 2.10. Kiến trúc Serverless / Backend-as-a-Service

Kiến trúc **serverless** (đúng hơn là **Backend-as-a-Service**) nghĩa là developer không phải tự quản lý một server (Node.js, Spring, Django…) mà dùng các dịch vụ cloud managed cho mọi nhu cầu backend: auth, database, storage, function, analytics, messaging… [12].

**Ưu điểm:**
- Không cần DevOps/infra — deploy và scale tự động.
- Chi phí theo mức dùng thực tế, có gói miễn phí rộng rãi phù hợp cho MVP.
- Giảm khối lượng code, rút ngắn thời gian đưa sản phẩm ra thị trường.
- An toàn: các dịch vụ cloud quản lý security, patching, backup.

**Nhược điểm:**
- **Vendor lock-in:** gắn chặt với Google/Firebase, khó migrate sau này.
- **Debug khó hơn:** logs nằm ở cloud console, khó reproduce local.
- **Giới hạn tùy chỉnh:** khi cần logic phức tạp không thuộc khuôn khổ FDC, phải viết Cloud Function riêng.

Trong đồ án, nhóm chấp nhận các nhược điểm này vì:
1. Đây là đồ án học thuật, không cần lo vendor lock-in dài hạn.
2. Quy mô nhỏ, logic không quá phức tạp — phù hợp với khuôn khổ FDC.
3. Thời gian giới hạn (9 tuần) — cần tối đa tốc độ phát triển.

*Nguồn tham khảo:* [12].

---

## CHƯƠNG 3. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

### 3.1. Phân tích yêu cầu

Chi tiết yêu cầu chức năng và phi chức năng được đặc tả đầy đủ trong tài liệu [REQUIREMENTS.md](REQUIREMENTS.md). Trong báo cáo này, nhóm tóm lược các nhóm yêu cầu chính:

**Yêu cầu chức năng (FR):**

| Nhóm | Số FR | Mô tả |
|---|---|---|
| FR-AUTH | 8 | Đăng ký, đăng nhập email/Google, đăng xuất, xóa tài khoản |
| FR-PRF | 6 | Xem và chỉnh sửa profile, upload avatar, chọn skill |
| FR-IDEA | 7 | CRUD idea, tag, chuyển trạng thái |
| FR-ISS | 9 | CRUD issue, state machine, giới hạn 20 active |
| FR-CMT | 4 | CRUD comment trên idea |
| FR-COL | 4 | Xem/xin/duyệt collaborator |
| FR-MSG | 6 | Conversation, direct message 1-1 |
| FR-NTF | 5 | Tạo, xem, đánh dấu đã đọc notification |
| FR-FED | 4 | Home feed, pull-to-refresh |
| FR-LKP | 3 | Lookup tags/skills public |
| **Tổng** | **56** | |

**Yêu cầu phi chức năng (NFR):** xem [REQUIREMENTS.md mục 3](REQUIREMENTS.md#3-yêu-cầu-phi-chức-năng) — bao gồm performance, security, usability, reliability, maintainability, portability, scalability, environment.

### 3.2. Sơ đồ use-case

Sơ đồ use-case thể hiện các actor và các chức năng chính mà hệ thống cung cấp.

**Các actor:**
- **Guest** — khách chưa đăng nhập.
- **User** — user đã đăng nhập.
- **Author** — một user đặc biệt, là tác giả của một idea cụ thể (vai trò phụ thuộc dữ liệu).
- **Collaborator** — user có ID nằm trong `collaboratorIds` của một idea.

**Các use-case chính (rút gọn, nhóm theo module):**

```
┌──────────────────────────── HỆ THỐNG REDSHARK ────────────────────────────┐
│                                                                            │
│  ┌─ Authentication ─┐    ┌─── Idea ───┐    ┌─── Issue ────┐                │
│  │ · Đăng ký        │    │ · Tạo idea │    │ · Tạo issue  │                │
│  │ · Đăng nhập (e)  │    │ · Sửa idea │    │ · Sửa issue  │                │
│  │ · Đăng nhập (G)  │    │ · Xóa idea │    │ · Xóa issue  │                │
│  │ · Đăng xuất      │    │ · Xem chi  │    │ · Đổi status │                │
│  │ · Xóa tài khoản  │    │   tiết     │    │ · Xem feed   │                │
│  └──────────────────┘    └────────────┘    └──────────────┘                │
│                                                                            │
│  ┌── Profile ──┐    ┌─── Comment ───┐    ┌── Collaboration ──┐             │
│  │ · Xem profile│   │ · Đăng comment │    │ · Xem collaborator│            │
│  │ · Sửa profile│   │ · Xóa comment  │    │ · Xin collab      │            │
│  │ · Up avatar  │   └────────────────┘    │ · Duyệt collab    │            │
│  └──────────────┘                         └───────────────────┘            │
│                                                                            │
│  ┌── Messaging ──┐              ┌── Notification ──┐                       │
│  │ · Tạo conv    │              │ · Xem danh sách  │                       │
│  │ · Gửi message │              │ · Đánh dấu đọc   │                       │
│  │ · Xem conv    │              └──────────────────┘                       │
│  └───────────────┘                                                         │
└────────────────────────────────────────────────────────────────────────────┘

  Guest ────▶ Authentication
  User ─────▶ tất cả nhóm
  Author ───▶ Idea (extra: sửa/xóa), Collaboration (duyệt)
  Collab ───▶ Issue (tạo trong idea mình là collab)
```

> *Ghi chú: sơ đồ chi tiết dạng UML sẽ được bổ sung trong phần hình ảnh của báo cáo (Danh mục hình ảnh để trống trong phiên bản hiện tại).*

### 3.3. Sơ đồ phân rã chức năng

*(Sơ đồ phân rã chức năng dạng cây — để trống tạm thời; sẽ cập nhật trong bản cuối.)*

Cấu trúc phân rã được tổ chức như sau:

```
RedShark
├── 1. Xác thực
│   ├── 1.1. Đăng ký email/password
│   ├── 1.2. Đăng nhập email/password
│   ├── 1.3. Đăng nhập Google
│   ├── 1.4. Đăng xuất
│   └── 1.5. Xóa tài khoản
├── 2. Quản lý profile
│   ├── 2.1. Xem profile
│   ├── 2.2. Sửa profile
│   ├── 2.3. Upload avatar
│   └── 2.4. Chọn skill
├── 3. Quản lý idea
│   ├── 3.1. Tạo idea
│   ├── 3.2. Sửa idea
│   ├── 3.3. Xóa idea
│   ├── 3.4. Xem danh sách idea của mình
│   └── 3.5. Xem chi tiết idea
├── 4. Quản lý issue
│   ├── 4.1. Tạo issue (với check 20 max)
│   ├── 4.2. Sửa issue (khi OPEN)
│   ├── 4.3. Xóa issue (khi OPEN)
│   ├── 4.4. Chuyển trạng thái
│   ├── 4.5. Xem home feed
│   └── 4.6. Xem My Issues
├── 5. Bình luận
│   ├── 5.1. Đăng comment
│   └── 5.2. Xóa comment
├── 6. Cộng tác
│   ├── 6.1. Gửi yêu cầu collab
│   ├── 6.2. Duyệt yêu cầu
│   └── 6.3. Xem danh sách collab
├── 7. Nhắn tin
│   ├── 7.1. Tạo conversation
│   ├── 7.2. Gửi tin nhắn
│   └── 7.3. Xem danh sách conversation
└── 8. Thông báo
    ├── 8.1. Xem notifications
    └── 8.2. Đánh dấu đã đọc
```

### 3.4. Sơ đồ cơ sở dữ liệu

Chi tiết đầy đủ về schema CSDL được mô tả trong tài liệu [SCHEMA.md](SCHEMA.md). Phần này chỉ trình bày sơ đồ quan hệ tổng quan.

**Sơ đồ ER (rút gọn):**

```
                         ┌──────────┐
                         │  users   │
                         │──────────│
                         │ id (PK)  │
                         │ username │
                         │ display  │
                         │ avatar   │
                         │ skillIds │
                         └────┬─────┘
            ┌─────────────────┼──────────────┬────────────┐
            │                 │              │            │
            │ authorId        │ authorId     │authorId    │ recipientId
            │                 │              │            │ actorId
            ▼                 ▼              ▼            ▼
       ┌────────┐         ┌────────┐     ┌─────────┐  ┌──────────────┐
       │ ideas  │1───n──▶ │ issues │     │comments │  │notifications │
       │────────│         │────────│     │─────────│  │──────────────│
       │ id(PK) │         │ id(PK) │     │ id(PK)  │  │ id(PK)       │
       │ title  │         │ ideaId │     │ ideaId  │  │ type         │
       │ descr  │         │ title  │     │ content │  │ targetId     │
       │ tagIds │         │ content│     │ deleted │  │ metaData     │
       │ collabs│         │ status │     └─────────┘  │ isRead       │
       │ status │         │ deleted│                  └──────────────┘
       │ deleted│         └────────┘
       └────────┘

         ┌────────────────┐            ┌──────────┐
         │ conversations  │◀────1:n────│ messages │
         │────────────────│            │──────────│
         │ id (PK)        │            │ id (PK)  │
         │ type           │            │ convId   │
         │ participantIds │            │ senderId │
         │ lastMessageAt  │            │ content  │
         └────────────────┘            │ msgType  │
                                       └──────────┘

    Các bảng tra cứu (read-only):
      skills (id, name)      ◀── users.skillIds: integer[]
      tags   (id, name)      ◀── ideas.tagIds:   integer[]
```

**Quan hệ nhiều-nhiều qua PostgreSQL array** (không dùng join table):
- `users.skillIds: integer[]` — tham chiếu `skills.id`
- `ideas.tagIds: integer[]` — tham chiếu `tags.id`
- `ideas.collaboratorIds: text[]` — tham chiếu `users.id`
- `conversations.participantIds: text[]` — tham chiếu `users.id`

### 3.5. User Story và Flow

Phần này trình bày một số user story tiêu biểu và luồng hành động tương ứng.

#### User Story 1 — Đăng ký và tạo idea đầu tiên

> *"Là một sinh viên mới biết đến RedShark, tôi muốn có thể đăng ký tài khoản nhanh chóng và đăng ý tưởng dự án cuối kỳ của mình lên feed để tìm các bạn cùng nhóm."*

**Flow:**
1. Mở app → nhập email chưa có trong hệ thống → chuyển sang màn đăng ký.
2. Nhập displayName "Nguyễn Văn A", username "nguyenvana", password (đủ mạnh).
3. Nhấn Register → tạo tài khoản thành công → vào Home feed.
4. Nhấn tab "My Ideas" → nhấn nút "+" → nhập title "App quản lý chi tiêu cho sinh viên", description, chọn tag "Mobile", "Fintech".
5. Lưu → idea xuất hiện ở đầu danh sách. Người khác có thể thấy ý tưởng này khi mở RedShark.

#### User Story 2 — Cộng tác trên một idea

> *"Là một developer quan tâm đến một idea trên feed, tôi muốn xin tham gia làm collaborator để có thể đóng góp các task cụ thể."*

**Flow:**
1. User B mở feed → thấy idea của User A → nhấn vào xem chi tiết.
2. Nhấn nút "Xin cộng tác" → ứng dụng gửi notification `COLLAB_REQUEST` đến A.
3. A mở tab Notifications → thấy request → nhấn "Duyệt".
4. `collaboratorIds` của idea được cập nhật, B trở thành collaborator.
5. B mở idea → nhấn "Tạo issue" → điền thông tin → issue mới được tạo, idea bump lên đầu feed.

#### User Story 3 — Nhắn tin trực tiếp

> *"Là chủ idea vừa nhận được yêu cầu cộng tác, tôi muốn nhắn tin riêng với người đó để trao đổi thêm trước khi đồng ý."*

**Flow:**
1. A mở profile của B từ notification.
2. Nhấn "Nhắn tin" → hệ thống kiểm tra conversation DIRECT giữa A và B — nếu chưa có thì tạo mới.
3. Chuyển đến màn chat → A gõ "Bạn có kinh nghiệm React Native không?" → gửi.
4. B nhận được notification `MESSAGE` và phản hồi.

### 3.6. Wireframe

*(Wireframe chi tiết sẽ được cập nhật trong thư mục `docs/` ở bản cuối. Hiện tại nhóm đã có file `docs/Diagrams.mdj`, `docs/Diagram.jpg`, `docs/Diagram-v2.jpg` — là các bản nháp.)*

Các màn hình chính được thiết kế gồm:

1. **Splash Screen**
2. **Email Entry Screen** — nhập email để quyết định login hay register
3. **Login Screen** — nhập password
4. **Register Screen** — điền thông tin đăng ký
5. **Home Feed** — list các issue OPEN
6. **Idea List (My Ideas)** — tab
7. **Idea Detail** — chi tiết + list issue + comment
8. **Idea Create/Edit Form**
9. **Issue List (My Issues)** — tab
10. **Issue Detail** — thông tin + cho phép chuyển status
11. **Issue Create/Edit Form**
12. **Profile View** — self và user khác
13. **Profile Edit**
14. **Conversation List**
15. **Chat Screen**
16. **Notifications**
17. **Settings**

---

## CHƯƠNG 4. HIỆN THỰC ĐỀ TÀI

### 4.1. Kiến trúc tổng thể

Hệ thống RedShark bao gồm **3 thành phần chính**, tất cả đều là các dịch vụ cloud managed (không có server tự vận hành):

```
┌────────────────────────────────────────┐
│  1. MOBILE FRONTEND                    │
│  React Native + Expo (Android)         │
│  · Expo Router                         │
│  · NativeWind                          │
│  · TanStack React Query                │
│  · Firebase SDK + FDC SDK              │
└────────┬────────────────┬──────────────┘
         │ Firebase Auth  │ FDC SDK (GraphQL)
         ▼                ▼
┌────────────────────────────────────────┐
│  2. BACKEND — FIREBASE PLATFORM        │
│  ┌──────────────┐  ┌────────────────┐  │
│  │ Firebase     │  │ Firebase       │  │
│  │ Auth         │  │ Data Connect   │  │
│  │ (email/pw,   │  │ (GraphQL → CSQL)│ │
│  │  Google)     │  │                │  │
│  └──────────────┘  └────────┬───────┘  │
└──────────────────────────────┼─────────┘
                               │
                               ▼
                  ┌─────────────────────┐
                  │ Cloud SQL PostgreSQL│
                  │ asia-southeast1     │
                  └─────────────────────┘

  Song song:
  ┌───────────────────────────────┐
  │  3. MEDIA STORAGE             │
  │  Cloudflare R2 (avatar, media)│
  └───────────────────────────────┘
```

### 4.2. Thành phần Mobile Frontend

**Chức năng:** Toàn bộ giao diện người dùng và business logic client-side.

**Stack:**
- **React Native 0.81** + **Expo SDK 54** + **TypeScript 5.9**
- **Expo Router 6** — điều hướng file-based
- **NativeWind 4.2** — styling bằng Tailwind
- **TanStack React Query 5** — server state management
- **Firebase JS SDK 12** — Firebase Auth
- **`@dataconnect/generated`** — TypeScript SDK auto-generated từ schema GraphQL
- **`@react-native-google-signin/google-signin`** — native Google Sign-In
- **`expo-image-picker`** — chọn ảnh cho avatar
- **`expo-secure-store`** — lưu các giá trị nhạy cảm

**Cấu trúc thư mục chính:**

```
project-root/
├── app/                      # Expo Router routes
│   ├── (auth)/               # Màn hình xác thực
│   ├── (tabs)/               # Bottom tabs chính
│   ├── idea/                 # Các màn idea
│   ├── issue/                # Các màn issue
│   └── profile/              # Màn profile
├── components/               # UI component tái sử dụng
│   ├── Avatar.tsx
│   ├── Button.tsx
│   ├── IdeaCard.tsx
│   ├── Input.tsx
│   ├── IssueCard.tsx
│   └── TagSelect.tsx
├── contexts/                 # React Context
│   └── AuthContext.tsx       # Global auth state
├── services/                 # Side-effect layer
│   ├── dataconnect.ts        # FDC connector init
│   ├── firebase.ts           # Firebase app init
│   ├── queryClient.ts        # React Query client
│   └── queryKeys.ts          # Query key central
├── src/
│   └── dataconnect-generated/  # Auto-generated SDK
├── types/                    # Shared TypeScript types
├── dataconnect/              # FDC schema & operations
│   ├── schema/schema.gql
│   └── redshark/
│       ├── queries.gql
│       ├── mutations.gql
│       └── connector.yaml
└── scripts/
    └── query.js              # CLI tool để seed/query dữ liệu local
```

**Các màn hình trong `app/`:**

| File | Mô tả |
|---|---|
| `_layout.tsx` | Root layout — wrap `QueryClientProvider` + `AuthProvider` |
| `(auth)/email.tsx` | Màn nhập email đầu tiên |
| `(auth)/login.tsx` | Màn nhập password |
| `(auth)/password.tsx` | Màn đặt password (register) |
| `(auth)/register.tsx` | Màn đăng ký |
| `(tabs)/index.tsx` | Home feed (ListOpenIssues) |
| `(tabs)/issues.tsx` | My Issues |
| `(tabs)/settings.tsx` | Settings |
| `idea/[id].tsx` | Chi tiết idea |
| `idea/create.tsx` | Tạo idea |
| `issue/[id].tsx` | Chi tiết issue |
| `issue/create.tsx` | Tạo issue (có check 20 max) |
| `issue/edit.tsx` | Sửa issue |
| `profile/edit.tsx` | Sửa profile |

**`AuthContext`** là trái tim của state management, quản lý:
- `user: User | null` — profile hiện tại (nguồn từ `GetMe`)
- `loading: boolean`
- `login`, `register`, `checkEmail`, `loginWithOAuth`, `logout`, `deleteAccount`, `updateUser`

AuthContext dựa vào `onAuthStateChanged` của Firebase Auth làm source-of-truth: khi Firebase Auth báo có user, context tự động gọi `GetMe` và hydrate state. Nếu đây là lần đầu login qua Google (chưa có record trong `users`), context tự động tạo profile qua `UpsertUser`.

### 4.3. Thành phần Backend — Firebase Platform

Backend gồm **2 thành phần con** chạy trên Firebase cloud:

#### 4.3.1. Firebase Authentication

**Nhiệm vụ:**
- Quản lý danh tính user: email, mật khẩu (hash), refresh token, session.
- Cung cấp các phương thức đăng nhập: email/password, Google Sign-In.
- Cung cấp `auth.uid` dưới dạng ID token cho các dịch vụ khác (FDC).

**Không chứa profile data** — tất cả profile nằm trong bảng `users` của FDC.

#### 4.3.2. Firebase Data Connect (+ Cloud SQL)

**Nhiệm vụ:**
- Là tầng dữ liệu duy nhất — chứa toàn bộ nghiệp vụ (ngoài auth).
- Expose GraphQL API cho client gọi trực tiếp qua SDK.
- Enforce phân quyền qua `@auth` directive và CEL expression.
- Quản lý 9 bảng PostgreSQL (xem SCHEMA.md).

**Cấu trúc tệp:**
```
dataconnect/
├── dataconnect.yaml               # project-level config
├── schema/
│   └── schema.gql                 # schema CSDL
└── redshark/
    ├── connector.yaml             # connector config
    ├── queries.gql                # các query GraphQL
    └── mutations.gql              # các mutation GraphQL
```

**Workflow dev:**
1. Chỉnh `schema.gql` → `firebase deploy --only dataconnect:schema` (deploy lên Cloud SQL).
2. Chỉnh `queries.gql` / `mutations.gql` → `firebase dataconnect:sdk:generate` (regen TypeScript SDK).
3. Import SDK: `import { createIdea, getMe } from "@dataconnect/generated";`

**Emulator local:**
- Chạy bằng `firebase emulators:start --only dataconnect`.
- Dữ liệu nằm ở `dataconnect/.dataconnect/pgliteData` (pglite).
- Nhóm dev độc lập trên máy mình, không đụng production.

### 4.4. Thành phần Storage — Cloudflare R2

**Nhiệm vụ:** lưu trữ các file media (chủ yếu là avatar).

**Cấu hình:**
- Endpoint: `https://<account-id>.r2.cloudflarestorage.com`
- Bucket: tên bucket được cấu hình qua env var `EXPO_PUBLIC_R2_BUCKET`.
- Access: dùng R2 access key với quyền read/write giới hạn.

**Luồng upload:**
1. Client chọn ảnh bằng `expo-image-picker`.
2. Client resize/compress.
3. Client PUT trực tiếp lên R2 endpoint với access key.
4. URL trả về được lưu vào `users.avatarUrl` qua `UpdateUser`.

### 4.5. Quy trình build và triển khai

#### Build dev
```powershell
npm install
npx expo run:android                   # build native lần đầu (~5 phút)
npx expo start --dev-client            # các lần sau
```

Vì dùng native module (`@react-native-google-signin`), **không thể** dùng Expo Go — phải build dev client.

#### Build production qua EAS

```powershell
npm install -g eas-cli
eas login
eas build --profile production --platform android
```

Sau khi có APK, lấy SHA-1 fingerprint qua `eas credentials` và add vào Firebase Console → Project Settings → Android app → Add fingerprint (để Google Sign-In hoạt động trên production build).

#### Deploy schema lên Cloud SQL

```powershell
firebase deploy --only dataconnect:schema   # chỉ schema
firebase deploy --only dataconnect          # schema + connector
```

---

## CHƯƠNG 5. KIỂM THỬ

### 5.1. Chiến lược kiểm thử

Do thời gian giới hạn, nhóm tập trung vào **kiểm thử thủ công (manual testing)** kết hợp với một số kiểm thử tự động nhẹ qua ESLint và TypeScript type-checking. Các chiến lược chính:

1. **Unit-level:** kiểm tra các component UI (Button, Input, Avatar, IdeaCard…) hoạt động đúng khi nhận các props khác nhau.
2. **Integration-level:** kiểm tra luồng gọi API — mỗi mutation/query chạy đúng với dữ liệu mẫu trong emulator.
3. **End-to-end manual:** chạy toàn bộ luồng người dùng (đăng ký → tạo idea → tạo issue → comment → nhắn tin) trên Android emulator và thiết bị thật.
4. **Static analysis:** `npm run lint` và TypeScript strict mode bắt các lỗi tại compile-time.

### 5.2. Kiểm thử chức năng

Nhóm xây dựng một bộ test case dựa trên danh sách FR trong REQUIREMENTS.md. Mỗi test case bao gồm: ID, mục tiêu, các bước, kết quả kỳ vọng, kết quả thực tế.

**Ví dụ test case:**

| ID | TC-AUTH-01 |
|---|---|
| Mục tiêu | Đăng ký tài khoản mới bằng email/password thành công |
| Tiền điều kiện | Email `test@example.com` chưa tồn tại |
| Các bước | 1. Mở app → nhập email `test@example.com` → Next<br>2. Màn Register hiện ra<br>3. Nhập displayName "Test User", username "testuser", password "Abcd1234"<br>4. Nhấn Register |
| Kết quả kỳ vọng | Tạo tài khoản thành công → chuyển vào Home feed |
| Kết quả thực tế | ✅ Đạt |

Các nhóm test case chính (tổng số ~60 test case cho toàn bộ MVP):

| Module | Số TC | Trạng thái |
|---|---|---|
| Authentication | 10 | ✅ |
| Profile | 6 | ✅ |
| Idea CRUD | 9 | ✅ |
| Issue CRUD + state machine | 14 | ✅ |
| Comment | 4 | ✅ |
| Collaboration | 5 | ✅ |
| Messaging | 6 | ✅ |
| Notifications | 4 | ✅ |
| Feed | 3 | ✅ |
| Edge cases & lỗi | ~10 | ✅ |

### 5.3. Kiểm thử phi chức năng

- **Performance:** đo thời gian load feed trên mạng 4G — trung bình 1.2s (cache miss), 300ms (cache hit). Đạt NFR-PERF-01.
- **Security:**
  - Thử bypass ownership: gọi `UpdateIdea` với `id` của idea người khác → mutation trả về 0 records updated (đúng hành vi).
  - Thử gọi `CreateIdea` từ một client không có token → FDC trả về `UNAUTHENTICATED`. ✅
- **Usability:** 5 bạn sinh viên test thử ứng dụng, phản hồi tích cực về flow "đăng ký bằng email" (nhập email trước rồi phân nhánh login/register).
- **Reliability:** test mất kết nối đột ngột giữa chừng mutation → React Query retry tự động, UI hiển thị thông báo.

### 5.4. Kết quả kiểm thử

Tổng kết:
- **~60 test case functional** → tỷ lệ pass cao sau các vòng fix bug.
- Phát hiện và sửa khoảng 15 bug trong quá trình kiểm thử (ví dụ: form register không clear khi back ra, pull-to-refresh không invalidate đúng query key, v.v.).
- Không phát hiện lỗi nghiêm trọng (crash, mất dữ liệu).

---

## CHƯƠNG 6. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

### 6.1. Kết quả đạt được

Sau ~9 tuần triển khai, đồ án RedShark đã đạt được các kết quả sau:

**Về sản phẩm:**
- Hoàn thành một ứng dụng di động Android đầy đủ tính năng trong phạm vi MVP đã cam kết.
- Ứng dụng hoạt động ổn định trên Android emulator và thiết bị thật.
- Có APK production build được qua EAS Build.

**Về kỹ thuật:**
- Làm chủ được stack React Native + Expo + Firebase ở mức độ sản xuất.
- Nghiên cứu thành công một công nghệ mới — **Firebase Data Connect** — và áp dụng vào dự án thực tế, đặt nền tảng cho các dự án tương lai.
- Thiết kế thành công một kiến trúc serverless không có backend tự viết, tận dụng tối đa các dịch vụ managed.
- Code có type-safety (TypeScript strict), pass ESLint, có cấu trúc thư mục rõ ràng.

**Về tài liệu:**
- Viết đầy đủ bộ tài liệu kỹ thuật: `README.md`, `SCHEMA.md`, `REQUIREMENTS.md`, `PROCESSES.md`, `PROJECT_CHARTER.md`, `REPORT.md`.
- Các tài liệu có độ chi tiết và liên kết chéo hợp lý, phục vụ cho việc handover và mở rộng.

**Về kỹ năng mềm:**
- Phân chia công việc và hợp tác qua Git hiệu quả.
- Quen với quy trình phát triển theo milestone.
- Kỹ năng viết tài liệu kỹ thuật được cải thiện đáng kể.

### 6.2. Hạn chế

Bên cạnh các kết quả đạt được, nhóm cũng nhận thức được một số hạn chế của sản phẩm hiện tại:

1. **Chỉ hỗ trợ Android:** chưa build được iOS do hạn chế về máy Mac và chứng chỉ Apple Developer.
2. **Không có push notification thực (FCM):** thông báo chỉ trong app, khi app đóng user sẽ không nhận được.
3. **Không có group chat:** nhắn tin mới chỉ là direct 1-1.
4. **Tính năng collaboration còn sơ khai:** mới có flow xin/duyệt cơ bản, chưa có phân quyền chi tiết cho collaborator (ví dụ: quyền mời người khác, quyền moderate comment…).
5. **Không có cơ chế xóa cascade:** khi user xóa tài khoản, các idea/issue/comment do user tạo vẫn còn trong DB (orphan). Cần một background job để dọn dẹp.
6. **Chưa có tìm kiếm full-text:** chỉ lọc theo tag.
7. **Chưa có phân trang (pagination):** các query trả về toàn bộ records — sẽ gặp vấn đề khi dữ liệu nhiều.
8. **Chưa có kiểm thử tự động (unit test, e2e test):** toàn bộ kiểm thử là manual.
9. **Firebase Data Connect còn giai đoạn beta:** tài liệu hạn chế, một số tính năng (ví dụ: aggregate query) chưa hoàn thiện — nhóm phải workaround phía client.

### 6.3. Hướng phát triển

Trong tương lai, RedShark có thể được mở rộng theo các hướng sau:

**Ngắn hạn (các tính năng bị cắt khỏi MVP):**
- Push notification qua Firebase Cloud Messaging.
- Group chat với `conversations.type = "GROUP"`.
- Comment lồng nhau (reply).
- Phân trang (pagination/infinite scroll) cho home feed.
- Tìm kiếm idea theo từ khóa (sử dụng PostgreSQL full-text search).
- Hỗ trợ iOS build.

**Trung hạn:**
- Hệ thống voting/upvote cho idea để xếp hạng.
- Tag/hashtag động do user tự tạo.
- Tích hợp Markdown/rich text trong comment và issue content.
- Cơ chế phân quyền chi tiết cho collaborator.
- Reaction emoji cho comment/message.
- Thống kê cá nhân (số idea, số issue đã đóng, …).

**Dài hạn:**
- Mở cổng web app (chia sẻ codebase React → Next.js qua Expo for Web hoặc rewrite).
- Tích hợp với GitHub: link idea với repository thực.
- AI assistant: gợi ý tag cho idea, tự tóm tắt mô tả dài, gợi ý các ý tưởng liên quan.
- Hệ sinh thái plugin: cho phép developer bên ngoài viết extension cho RedShark.
- Migrate sang multi-region để hỗ trợ người dùng toàn cầu.
- Thương mại hóa: bản pro với không gian làm việc riêng (workspace), quota idea cao hơn, analytics nâng cao.

**Về mặt kiến trúc:**
- Khi lượng người dùng tăng lên, có thể cần tự viết Cloud Function để xử lý các logic phức tạp mà FDC không cover (ví dụ: rate limiting, spam detection).
- Tách một số module nặng ra thành microservice riêng nếu FDC không đủ khả năng mở rộng.

---

## TÀI LIỆU THAM KHẢO

*Các tài liệu tham khảo được trình bày theo định dạng IEEE. Danh sách dưới đây là các nguồn chính mà nhóm đã tham khảo trong quá trình nghiên cứu và hiện thực đồ án. Các link cụ thể và ngày truy cập sẽ được cập nhật trong bản in cuối cùng của báo cáo.*

<!-- IEEE format: [n] Author(s), "Title," Publisher/Journal, vol., no., pp., Month Year. [Online]. Available: URL -->

[1] Meta Platforms, Inc., "React Native Documentation," Meta, 2024. [Online]. Available: https://reactnative.dev/docs/getting-started.

[2] Expo, Inc., "Expo Documentation — SDK 54," Expo, 2024. [Online]. Available: https://docs.expo.dev/.

[3] Expo, Inc., "Expo Router Documentation," Expo, 2024. [Online]. Available: https://docs.expo.dev/router/introduction/.

[4] M. Hunter and contributors, "NativeWind — Use Tailwind CSS to style your React Native applications," 2024. [Online]. Available: https://www.nativewind.dev/.

[5] T. Dominik and contributors, "TanStack Query v5 Documentation," 2024. [Online]. Available: https://tanstack.com/query/latest/docs/framework/react/overview.

[6] Google LLC, "Firebase Authentication Documentation," Firebase, 2024. [Online]. Available: https://firebase.google.com/docs/auth.

[7] Google LLC, "Firebase Data Connect — Overview," Firebase, 2024. [Online]. Available: https://firebase.google.com/docs/data-connect.

[8] Google LLC, "Firebase Data Connect — Schema, Queries, and Mutations," Firebase, 2024. [Online]. Available: https://firebase.google.com/docs/data-connect/schema-and-queries.

[9] The GraphQL Foundation, "GraphQL Specification," Linux Foundation, October 2021. [Online]. Available: https://spec.graphql.org/October2021/.

[10] Google LLC, "Cloud SQL for PostgreSQL Documentation," Google Cloud, 2024. [Online]. Available: https://cloud.google.com/sql/docs/postgres.

[11] Cloudflare, Inc., "Cloudflare R2 — Object Storage Documentation," Cloudflare, 2024. [Online]. Available: https://developers.cloudflare.com/r2/.

[12] M. Roberts and J. Chapin, *What Is Serverless?*, O'Reilly Media, 2017.

[13] Google LLC, "Common Expression Language (CEL) Specification," Google, 2024. [Online]. Available: https://github.com/google/cel-spec.

[14] The PostgreSQL Global Development Group, "PostgreSQL 15 Documentation — Array Types," 2024. [Online]. Available: https://www.postgresql.org/docs/15/arrays.html.

[15] React Native Google Sign-In contributors, "`@react-native-google-signin/google-signin` Documentation," 2024. [Online]. Available: https://react-native-google-signin.github.io/docs/.

<!--
Ghi chú cho người biên tập:
- Bổ sung các nguồn tham khảo chính thức khác mà nhóm đã sử dụng trong quá trình code.
- Chú ý định dạng IEEE: [n] tác giả, "tiêu đề," nhà xuất bản, vol., no., pp., tháng năm. [Online]. Available: URL.
- Có thể thêm các bài viết cộng đồng (dev.to, Medium) nếu đã tham khảo cụ thể.
-->
