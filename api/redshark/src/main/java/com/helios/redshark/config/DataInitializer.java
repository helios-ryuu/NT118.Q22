// Khoi tao du lieu mau khi database trong — chay 1 lan khi backend start
package com.helios.redshark.config;

import com.helios.redshark.entity.*;
import com.helios.redshark.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository users;
    private final IssueRepository issues;
    private final WorkspaceRepository workspaces;
    private final IssueApplicationRepository applications;
    private final ChannelRepository channels;
    private final MessageRepository messages;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository users,
                           IssueRepository issues, WorkspaceRepository workspaces,
                           IssueApplicationRepository applications,
                           ChannelRepository channels, MessageRepository messages,
                           PasswordEncoder passwordEncoder) {
        this.users = users;
        this.issues = issues;
        this.workspaces = workspaces;
        this.applications = applications;
        this.channels = channels;
        this.messages = messages;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (users.count() > 0) return;

        // --- 20 Users ---
        var an = createUser("Nguyễn Văn An", "an.nguyen", "an.nguyen@uit.edu.vn",
            "Sinh viên năm 3 KHMT, thích backend và DevOps",
            LocalDate.of(2003, 5, 15), "password123", 450, true, 10.7763, 106.7008);

        var bich = createUser("Trần Thị Bích", "bich.tran", "bich.tran@uit.edu.vn",
            "Đam mê React Native và thiết kế UI/UX",
            LocalDate.of(2003, 8, 22), "password123", 380, true, 10.7720, 106.6580);

        var cuong = createUser("Lê Hoàng Cường", "cuong.le", "cuong.le@uit.edu.vn",
            "Chuyên về mạng và bảo mật hệ thống",
            LocalDate.of(2002, 12, 1), "password123", 520, false, 10.7680, 106.6700);

        var duyen = createUser("Phạm Thị Duyên", "duyen.pham", "duyen.pham@uit.edu.vn",
            "Full-stack developer, yêu thích Node.js và Vue",
            LocalDate.of(2003, 3, 10), "password123", 290, true, 10.7580, 106.6850);

        var em = createUser("Hoàng Minh Em", "em.hoang", "em.hoang@uit.edu.vn",
            "AI/ML enthusiast, chuyên Python và TensorFlow",
            LocalDate.of(2002, 7, 18), "password123", 610, true, 10.7820, 106.6500);

        var phuong = createUser("Ngô Thị Phương", "phuong.ngo", "phuong.ngo@uit.edu.vn",
            "Mobile developer iOS/Android, Swift và Kotlin",
            LocalDate.of(2003, 11, 5), "password123", 340, false, 10.7650, 106.6780);

        var giang = createUser("Đinh Quốc Giang", "giang.dinh", "giang.dinh@uit.edu.vn",
            "DevOps engineer, Kubernetes và CI/CD pipelines",
            LocalDate.of(2002, 4, 25), "password123", 470, true, 10.7900, 106.6620);

        var huy = createUser("Vũ Thành Huy", "huy.vu", "huy.vu@uit.edu.vn",
            "Backend Java Spring Boot, thiết kế API",
            LocalDate.of(2003, 9, 12), "password123", 410, true, 10.7540, 106.6910);

        var iris = createUser("Lý Thị Iris", "iris.ly", "iris.ly@uit.edu.vn",
            "Data engineer, Spark và Kafka pipelines",
            LocalDate.of(2002, 1, 30), "password123", 550, false, 10.7730, 106.6430);

        var john = createUser("Trương Văn John", "john.truong", "john.truong@uit.edu.vn",
            "Security researcher, CTF player",
            LocalDate.of(2003, 6, 8), "password123", 490, true, 10.7610, 106.6630);

        // Users 11-20 (batch 2)
        var kim = createUser("Nguyễn Thị Kim", "kim.nguyen", "kim.nguyen@uit.edu.vn",
            "Frontend developer, chuyên React và Next.js",
            LocalDate.of(2003, 2, 14), "password123", 320, true, 10.7695, 106.6515);

        var longUser = createUser("Trần Đình Long", "long.tran", "long.tran@uit.edu.vn",
            "Game developer Unity, C# và shader programming",
            LocalDate.of(2002, 9, 3), "password123", 430, false, 10.7745, 106.6720);

        var mai = createUser("Phan Thị Mai", "mai.phan", "mai.phan@uit.edu.vn",
            "QA engineer, Selenium automation và performance testing",
            LocalDate.of(2003, 4, 19), "password123", 275, true, 10.7835, 106.6545);

        var nam = createUser("Đỗ Văn Nam", "nam.do", "nam.do@uit.edu.vn",
            "Blockchain developer, Solidity và Web3.js",
            LocalDate.of(2002, 11, 27), "password123", 560, true, 10.7560, 106.6760);

        var oanh = createUser("Lê Thị Oanh", "oanh.le", "oanh.le@uit.edu.vn",
            "Cloud architect, AWS và Terraform chuyên sâu",
            LocalDate.of(2002, 6, 11), "password123", 620, false, 10.7685, 106.6480);

        var phuc = createUser("Nguyễn Minh Phúc", "phuc.nguyen", "phuc.nguyen@uit.edu.vn",
            "Embedded systems, C/C++ và RTOS",
            LocalDate.of(2003, 1, 8), "password123", 395, true, 10.7870, 106.6590);

        var quynh = createUser("Võ Thị Quỳnh", "quynh.vo", "quynh.vo@uit.edu.vn",
            "Data analyst, Power BI và Pandas",
            LocalDate.of(2003, 7, 24), "password123", 310, true, 10.7625, 106.6840);

        var rong = createUser("Huỳnh Văn Rồng", "rong.huynh", "rong.huynh@uit.edu.vn",
            "Compiler engineer, LLVM và language design",
            LocalDate.of(2002, 3, 16), "password123", 580, false, 10.7780, 106.6660);

        var son = createUser("Bùi Minh Sơn", "son.bui", "son.bui@uit.edu.vn",
            "AR/VR developer, Unity và ARKit",
            LocalDate.of(2003, 10, 5), "password123", 355, true, 10.7520, 106.6930);

        var tuyen = createUser("Cao Thị Tuyên", "tuyen.cao", "tuyen.cao@uit.edu.vn",
            "NLP researcher, Hugging Face và BERT fine-tuning",
            LocalDate.of(2002, 8, 20), "password123", 505, true, 10.7715, 106.6395);

        // --- 21 Issues (priority 1-10, durationDays đa dạng) ---
        var i1 = createIssue(an, "Lỗi kết nối PostgreSQL trên Docker",
            "Spring Boot không kết nối được database. Lỗi Connection refused khi chạy docker compose.",
            List.of("Docker", "PostgreSQL", "Spring Boot"), 8, "open", 7, 10.7763, 106.7008);

        var i2 = createIssue(bich, "Không hiểu React useEffect cleanup",
            "Bị memory leak warning khi dùng useEffect với fetch. Cần giải thích cách cleanup đúng.",
            List.of("React Native", "TypeScript"), 5, "open", 3, 10.7720, 106.6580);

        var i3 = createIssue(cuong, "Cấu hình Nginx reverse proxy cho Spring Boot",
            "Cần giúp setup Nginx reverse proxy để forward request từ port 80 vào Spring Boot 8080.",
            List.of("Networking", "Linux", "Spring Boot"), 7, "in_progress", 30, 10.7680, 106.6700);

        var i4 = createIssue(bich, "Bug CSS Flexbox layout trên Android",
            "Layout bị vỡ trên Android nhưng iOS thì bình thường. Cần debug gấp.",
            List.of("React Native", "CSS"), 6, "open", 1, 10.7720, 106.6580);

        var i5 = createIssue(an, "Hướng dẫn deploy ứng dụng lên k3s",
            "Mới học Kubernetes, cần ai hướng dẫn deploy Spring Boot app lên k3s cluster.",
            List.of("Docker", "Kubernetes", "Linux"), 4, "closed", null, 10.7763, 106.7008);

        var i6 = createIssue(duyen, "Lỗi CORS khi call API từ React Native",
            "Gọi API từ Expo app bị blocked bởi CORS. Đã cấu hình header nhưng vẫn lỗi.",
            List.of("Node.js", "React Native"), 6, "open", 3, 10.7580, 106.6850);

        var i7 = createIssue(em, "Optimize model training TensorFlow chậm",
            "Model training mất 6 giờ cho 1 epoch. Cần tư vấn cách optimize pipeline.",
            List.of("Python", "TensorFlow", "Docker"), 9, "open", 7, 10.7820, 106.6500);

        var i8 = createIssue(phuong, "Swift crash khi push notification foreground",
            "App crash khi nhận push notification lúc foreground trên iOS 17. Stack trace đã có.",
            List.of("Swift"), 8, "in_progress", 7, 10.7650, 106.6780);

        var i9 = createIssue(giang, "Helm chart values không apply đúng",
            "Helm upgrade không update ConfigMap dù đã đổi values.yaml. Cần ai review chart.",
            List.of("Kubernetes", "Docker"), 7, "open", 3, 10.7900, 106.6620);

        var i10 = createIssue(huy, "N+1 query problem trong Spring Data JPA",
            "API /users trả về 200 users nhưng mỗi request tạo ra 200+ SQL queries. Cần fix.",
            List.of("Java", "Spring Boot", "PostgreSQL"), 8, "open", 7, 10.7540, 106.6910);

        var i11 = createIssue(iris, "Kafka consumer lag tăng đột biến",
            "Consumer group bị lag 50k messages sau khi scale up producer. Partition strategy cần review.",
            List.of("Apache Kafka", "Docker"), 9, "open", 1, 10.7730, 106.6430);

        var i12 = createIssue(john, "SQL injection trong query builder tự viết",
            "Phát hiện lỗ hổng SQL injection trong module search. Cần review và patch gấp.",
            List.of("Python", "Networking"), 10, "open", 1, 10.7610, 106.6630);

        createIssue(an, "Setup CI/CD với GitHub Actions cho monorepo",
            "Cần cấu hình workflow chỉ build service bị thay đổi thay vì build hết.",
            List.of("Docker", "Linux"), 5, "open", 7, 10.7760, 106.7010);

        createIssue(bich, "Expo Camera permission trên Android 13",
            "Camera permission bị denied silently trên Android 13 dù đã khai báo trong manifest.",
            List.of("React Native"), 6, "open", 3, 10.7725, 106.6575);

        createIssue(cuong, "WireGuard VPN setup cho lab network",
            "Cần cấu hình WireGuard để các VM trong lab có thể connect với nhau qua VPN.",
            List.of("Networking", "Linux"), 5, "open", 30, 10.7682, 106.6695);

        createIssue(duyen, "TypeORM migration tự động trong NestJS",
            "Migration không chạy tự động khi deploy lên production. Config synchronize=false.",
            List.of("Node.js", "PostgreSQL"), 7, "open", 7, 10.7582, 106.6848);

        createIssue(em, "Gradient explosion trong LSTM training",
            "Loss trở thành NaN sau epoch 3. Đã thử gradient clipping nhưng không ổn định.",
            List.of("Python", "TensorFlow"), 8, "open", 3, 10.7818, 106.6502);

        createIssue(giang, "k3s node NotReady sau khi restart server",
            "Node trở thành NotReady sau mỗi lần reboot. containerd service start delay.",
            List.of("Kubernetes", "Linux"), 7, "open", 7, 10.7898, 106.6618);

        createIssue(huy, "Spring Security JWT filter thứ tự sai",
            "JwtFilter chạy sau AuthorizationFilter nên token không được validate trước. Cần fix chain.",
            List.of("Java", "Spring Boot"), 6, "open", 3, 10.7542, 106.6908);

        createIssue(iris, "Kafka exactly-once semantics cấu hình",
            "Cần enable idempotent producer + transactional consumer để tránh duplicate messages.",
            List.of("Apache Kafka"), 7, "open", 7, 10.7732, 106.6428);

        createIssue(john, "Privilege escalation via SUID binary",
            "Phát hiện binary lạ có SUID bit trên server. Cần forensics và hardening.",
            List.of("Linux", "Networking"), 10, "open", 1, 10.7612, 106.6628);

        // Issues 22-42 (batch 2)
        var i22 = createIssue(kim, "Server-side rendering bị hydration mismatch Next.js",
            "Console báo lỗi hydration khi dùng useEffect trong SSR component. Cần fix strategy.",
            List.of("React", "Next.js", "TypeScript"), 6, "open", 5, 10.7695, 106.6515);

        createIssue(longUser, "Unity shader không compile trên Android Vulkan",
            "Shader hoạt động tốt trên OpenGLES nhưng crash khi switch sang Vulkan backend.",
            List.of("Unity", "C#", "HLSL"), 7, "open", 7, 10.7745, 106.6720);

        createIssue(mai, "Selenium test flaky do timing issue",
            "Test pass locally nhưng fail trên CI 30% run. Nghi ngờ implicit wait không đủ.",
            List.of("Selenium", "Python"), 5, "open", 3, 10.7835, 106.6545);

        var i25 = createIssue(nam, "Smart contract bị reentrancy attack",
            "Audit phát hiện withdraw() có thể bị drain toàn bộ ETH. Cần fix trước mainnet deploy.",
            List.of("Solidity", "Ethereum"), 10, "in_progress", 3, 10.7560, 106.6760);

        createIssue(oanh, "Terraform state bị lock sau crash",
            "terraform apply bị interrupt, giờ state file bị locked. Cần force-unlock an toàn.",
            List.of("Terraform", "AWS"), 8, "open", 1, 10.7685, 106.6480);

        createIssue(phuc, "FreeRTOS task stack overflow",
            "Hard fault handler trigger khi task thứ 5 start. Stack size 256 words không đủ.",
            List.of("C++", "FreeRTOS"), 9, "open", 7, 10.7870, 106.6590);

        createIssue(quynh, "Power BI DirectQuery chậm hơn Import 100x",
            "Dashboard refresh mất 45 giây với DirectQuery. Cần tư vấn optimize DAX measure.",
            List.of("Power BI", "SQL"), 6, "open", 7, 10.7625, 106.6840);

        createIssue(rong, "LLVM pass gây undefined behavior trong O2",
            "Custom optimization pass tạo ra sai code khi enable O2. Valgrind clean nhưng runtime crash.",
            List.of("C++", "LLVM"), 9, "open", 14, 10.7780, 106.6660);

        createIssue(son, "ARKit plane detection không hoạt động trong nhà",
            "Plane detection chỉ tìm thấy horizontal plane ngoài trời. Indoor lighting ảnh hưởng nhiều.",
            List.of("ARKit", "Unity"), 6, "open", 5, 10.7520, 106.6930);

        createIssue(tuyen, "BERT fine-tuning loss không giảm sau epoch 2",
            "Training loss stuck ở 0.69 (ln2). Learning rate scheduling hoặc tokenizer config sai.",
            List.of("Python", "PyTorch", "TensorFlow"), 8, "open", 7, 10.7715, 106.6395);

        createIssue(an, "Redis cache invalidation race condition",
            "Hai request đồng thời clear và set cache cùng key, gây inconsistent data trong 100ms window.",
            List.of("Java", "Docker"), 7, "open", 3, 10.7761, 106.7005);

        createIssue(bich, "Expo SecureStore bị corrupt sau OTA update",
            "User bị đăng xuất sau update do secure storage key đổi prefix. Cần migration strategy.",
            List.of("React Native", "TypeScript"), 7, "open", 5, 10.7722, 106.6582);

        createIssue(cuong, "BGP route leak từ internal AS ra Internet",
            "Monitoring phát hiện internal /24 route được advertise ra AS65000. Cần isolate và fix.",
            List.of("Networking"), 10, "open", 1, 10.7678, 106.6702);

        createIssue(duyen, "Deadlock trong transaction Node.js + PostgreSQL",
            "API đôi khi bị hang 30 giây rồi rollback. pg_locks cho thấy 2 transaction chờ nhau.",
            List.of("Node.js", "PostgreSQL"), 8, "open", 3, 10.7578, 106.6848);

        createIssue(em, "ResNet model quá lớn để deploy trên Raspberry Pi",
            "Model 90MB không fit vào RAM 512MB kèm OS. Cần quantization hoặc knowledge distillation.",
            List.of("Python", "TensorFlow", "Docker"), 7, "closed", null, 10.7818, 106.6498);

        createIssue(giang, "Helm rollback không restore ConfigMap cũ",
            "helm rollback về revision 2 nhưng ConfigMap vẫn giữ giá trị revision 3. Bug đã biết?",
            List.of("Kubernetes", "Docker"), 6, "open", 7, 10.7902, 106.6622);

        createIssue(huy, "Spring Boot Actuator endpoint bị expose public",
            "/actuator/env trả về credentials trong response. Cần secure endpoints ngay.",
            List.of("Java", "Spring Boot"), 9, "open", 1, 10.7538, 106.6912);

        createIssue(iris, "Kafka topic rebalance storm khi scale consumer",
            "Mỗi lần add consumer mới, toàn bộ group rebalance 3-4 lần liên tiếp. Max poll records sai.",
            List.of("Apache Kafka"), 8, "open", 3, 10.7728, 106.6432);

        createIssue(john, "DNS cache poisoning vulnerability trong resolver",
            "Resolver dùng predictable transaction ID. DNSSEC chưa enable. Cần audit toàn bộ.",
            List.of("Networking", "Linux"), 10, "open", 1, 10.7608, 106.6632);

        var i41 = createIssue(kim, "Next.js ISR stale content không invalidate",
            "revalidateTag() gọi nhưng CDN vẫn serve nội dung cũ 10 phút. Vercel cache layer issue.",
            List.of("React", "Next.js"), 6, "in_progress", 5, 10.7693, 106.6518);

        createIssue(longUser, "Unity coroutine leak khi scene unload",
            "Memory tăng dần sau mỗi lần load/unload scene. Profiler cho thấy coroutine không được cleanup.",
            List.of("Unity", "C#"), 7, "open", 7, 10.7743, 106.6718);

        // --- 4 Workspaces (i3, i8, i25, i41 đang in_progress) ---
        var ws1 = createWorkspace(i3, cuong, an);
        var ws2 = createWorkspace(i8, phuong, bich);
        var ws3 = createWorkspace(i25, nam, john);
        var ws4 = createWorkspace(i41, kim, rong);

        // --- Channels cho workspace 1 ---
        var ch1General = createChannel(ws1, "thảo-luận-chung");
        var ch1Debug   = createChannel(ws1, "debug-log");

        // --- Messages trong channel 1 ---
        createMessage(ch1General, cuong, "Chào An! Mình đã reproduce được lỗi Nginx rồi.");
        createMessage(ch1General, an,    "Tuyệt! upstream block đã đúng chưa?");
        createMessage(ch1General, cuong, "Upstream đúng rồi nhưng proxy_pass bị thiếu trailing slash.");
        createMessage(ch1General, an,    "Ah mình hiểu rồi. Thêm `/` vào cuối URL là fix được nha.");
        createMessage(ch1General, cuong, "Đúng rồi! Đang test lại, có vẻ hoạt động.");
        createMessage(ch1Debug,   an,    "Log Nginx: `upstream timed out (110: Connection timed out)`");
        createMessage(ch1Debug,   cuong, "Timeout 60s mặc định quá ngắn. Thêm `proxy_read_timeout 120s;`");

        // --- Channels cho workspace 2 ---
        var ch2General = createChannel(ws2, "thảo-luận-chung");
        var ch2Ios     = createChannel(ws2, "ios-crash-report");

        // --- Messages trong channel 2 ---
        createMessage(ch2General, phuong, "Bích ơi, mình paste stack trace vào channel ios-crash-report nha.");
        createMessage(ch2General, bich,   "OK, mình đang đọc. Trông giống vấn đề UNUserNotificationCenter delegate.");
        createMessage(ch2Ios,     phuong, "Fatal: -[AppDelegate application:didReceiveRemoteNotification:fetchCompletionHandler:] crash");
        createMessage(ch2Ios,     bich,   "Cần gọi completionHandler(.newData) trước khi return. Bạn có đang skip không?");
        createMessage(ch2Ios,     phuong, "Đúng rồi! Mình quên call completionHandler trong trường hợp notification foreground.");

        // --- Channels cho workspace 3 ---
        var ch3General = createChannel(ws3, "thảo-luận-chung");
        var ch3Audit   = createChannel(ws3, "audit-trail");

        // --- Messages trong channel 3 ---
        createMessage(ch3General, nam,  "John ơi, mình vừa vá lỗ hổng reentrancy bằng checks-effects-interactions pattern.");
        createMessage(ch3General, john, "Tốt! Mình cũng recommend dùng ReentrancyGuard của OpenZeppelin thêm vào.");
        createMessage(ch3General, nam,  "Đã thêm rồi, đang chạy Slither static analysis.");
        createMessage(ch3Audit,   john, "Slither report: HIGH - Reentrancy in withdraw() [FIXED]");
        createMessage(ch3Audit,   nam,  "Medium issues còn 2: unchecked return value và tx.origin usage.");
        createMessage(ch3Audit,   john, "tx.origin phải đổi sang msg.sender. unchecked return là trong SafeERC20?");

        // --- Channels cho workspace 4 ---
        var ch4General = createChannel(ws4, "thảo-luận-chung");
        var ch4Debug   = createChannel(ws4, "cache-debug");

        // --- Messages trong channel 4 ---
        createMessage(ch4General, kim,  "Rồng ơi, revalidateTag() trong Next.js 14 route handler có hoạt động không?");
        createMessage(ch4General, rong, "Có, nhưng phải đảm bảo tag được set đúng trong fetch() call. Paste code đi.");
        createMessage(ch4General, kim,  "Mình set `next: { tags: ['products'] }` trong fetch. Gọi `revalidateTag('products')` nhưng stale.");
        createMessage(ch4Debug,   rong, "Lỗi thường gặp: fetch() phải ở Server Component, không phải Client. Check xem.");
        createMessage(ch4Debug,   kim,  "Đúng rồi! Component của mình có 'use client'. Phải move fetch lên Server Component.");
        createMessage(ch4Debug,   rong, "Chính xác. ISR revalidation chỉ work với Server-side fetch. Fix rồi test lại nhé.");

        // --- 20 Applications (unique issue+applicant pairs) ---
        // Batch 1 (issues từ users 1-10)
        createApplication(i1, bich);    // bich → issue của an
        createApplication(i1, em);      // em → issue của an
        createApplication(i2, an);      // an → issue của bich
        createApplication(i4, cuong);   // cuong → issue bich
        createApplication(i6, john);    // john → issue duyen
        createApplication(i7, iris);    // iris → issue em
        createApplication(i9, huy);     // huy → issue giang
        createApplication(i10, an);     // an → issue huy
        createApplication(i11, john);   // john → issue iris
        createApplication(i12, cuong);  // cuong → issue john
        // Batch 2 (issues từ users 11-20)
        createApplication(i22, longUser);   // longUser → issue kim
        createApplication(i22, rong);   // rong → issue kim
        createApplication(i25, oanh);   // oanh → issue nam
        createApplication(i41, tuyen);  // tuyen → issue kim
        createApplication(i1, kim);     // kim → issue an
        createApplication(i7, nam);     // nam → issue em
        createApplication(i10, phuc);   // phuc → issue huy
        createApplication(i11, mai);    // mai → issue iris
        createApplication(i12, son);    // son → issue john
        createApplication(i9, quynh);   // quynh → issue giang

        System.out.println("✓ Seed data: 20 users, 42 issues, 4 workspaces, 8 channels, 24 messages, 20 applications");
    }

    private UserEntity createUser(String name, String username, String email,
                                   String bio, LocalDate birthday, String password,
                                   int karma, boolean online, double ignoredA, double ignoredB) {
        var u = new UserEntity();
        u.setName(name);
        u.setUsername(username);
        u.setEmail(email);
        u.setBio(bio);
        u.setBirthday(birthday);
        u.setPasswordHash(passwordEncoder.encode(password));
        u.setKarmaPoints(karma);
        u.setOnline(online);
        return users.save(u);
    }

    private IssueEntity createIssue(UserEntity author, String title, String description,
                                     List<String> tags, int priority, String status,
                                     Integer durationDays, double ignoredA, double ignoredB) {
        var i = new IssueEntity();
        i.setTitle(title);
        i.setDescription(description);
        i.setTags(tags);
        i.setPriority(priority);
        i.setStatus(status);
        i.setAuthor(author);
        i.setDurationDays(durationDays);
        i.setExpiresAt(durationDays != null
            ? Instant.now().plus(durationDays, ChronoUnit.DAYS)
            : Instant.now().plus(365 * 10L, ChronoUnit.DAYS));
        return issues.save(i);
    }

    private WorkspaceEntity createWorkspace(IssueEntity issue, UserEntity author, UserEntity helper) {
        var w = new WorkspaceEntity();
        w.setIssue(issue);
        w.setStatus("active");
        w.setPublic(true);
        w.setMembers(java.util.Arrays.asList(author, helper));
        w.setMemberRoles("author,helper");
        return workspaces.save(w);
    }

    private ChannelEntity createChannel(WorkspaceEntity workspace, String name) {
        var c = new ChannelEntity();
        c.setWorkspace(workspace);
        c.setName(name);
        return channels.save(c);
    }

    private void createMessage(ChannelEntity channel, UserEntity author, String content) {
        var m = new MessageEntity();
        m.setChannel(channel);
        m.setAuthor(author);
        m.setContent(content);
        messages.save(m);
    }

    private void createApplication(IssueEntity issue, UserEntity applicant) {
        // Bỏ qua nếu applicant là owner
        if (issue.getAuthor().getId().equals(applicant.getId())) return;
        var a = new IssueApplicationEntity();
        a.setIssue(issue);
        a.setApplicant(applicant);
        applications.save(a);
    }
}
