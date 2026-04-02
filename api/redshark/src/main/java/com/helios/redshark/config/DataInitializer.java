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
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository users,
                           IssueRepository issues,
                           PasswordEncoder passwordEncoder) {
        this.users = users;
        this.issues = issues;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (users.count() > 0) return;

        // --- 20 Users ---
        var an = createUser("Nguyễn Văn An", "an.nguyen", "an.nguyen@uit.edu.vn",
            "Sinh viên năm 3 KHMT, thích backend và DevOps",
            LocalDate.of(2003, 5, 15), "password123", 450, true);

        var bich = createUser("Trần Thị Bích", "bich.tran", "bich.tran@uit.edu.vn",
            "Đam mê React Native và thiết kế UI/UX",
            LocalDate.of(2003, 8, 22), "password123", 380, true);

        var cuong = createUser("Lê Hoàng Cường", "cuong.le", "cuong.le@uit.edu.vn",
            "Chuyên về mạng và bảo mật hệ thống",
            LocalDate.of(2002, 12, 1), "password123", 520, false);

        var duyen = createUser("Phạm Thị Duyên", "duyen.pham", "duyen.pham@uit.edu.vn",
            "Full-stack developer, yêu thích Node.js và Vue",
            LocalDate.of(2003, 3, 10), "password123", 290, true);

        var em = createUser("Hoàng Minh Em", "em.hoang", "em.hoang@uit.edu.vn",
            "AI/ML enthusiast, chuyên Python và TensorFlow",
            LocalDate.of(2002, 7, 18), "password123", 610, true);

        var phuong = createUser("Ngô Thị Phương", "phuong.ngo", "phuong.ngo@uit.edu.vn",
            "Mobile developer iOS/Android, Swift và Kotlin",
            LocalDate.of(2003, 11, 5), "password123", 340, false);

        var giang = createUser("Đinh Quốc Giang", "giang.dinh", "giang.dinh@uit.edu.vn",
            "DevOps engineer, Kubernetes và CI/CD pipelines",
            LocalDate.of(2002, 4, 25), "password123", 470, true);

        var huy = createUser("Vũ Thành Huy", "huy.vu", "huy.vu@uit.edu.vn",
            "Backend Java Spring Boot, thiết kế API",
            LocalDate.of(2003, 9, 12), "password123", 410, true);

        var iris = createUser("Lý Thị Iris", "iris.ly", "iris.ly@uit.edu.vn",
            "Data engineer, Spark và Kafka pipelines",
            LocalDate.of(2002, 1, 30), "password123", 550, false);

        var john = createUser("Trương Văn John", "john.truong", "john.truong@uit.edu.vn",
            "Security researcher, CTF player",
            LocalDate.of(2003, 6, 8), "password123", 490, true);

        var kim = createUser("Nguyễn Thị Kim", "kim.nguyen", "kim.nguyen@uit.edu.vn",
            "Frontend developer, chuyên React và Next.js",
            LocalDate.of(2003, 2, 14), "password123", 320, true);

        var longUser = createUser("Trần Đình Long", "long.tran", "long.tran@uit.edu.vn",
            "Game developer Unity, C# và shader programming",
            LocalDate.of(2002, 9, 3), "password123", 430, false);

        var mai = createUser("Phan Thị Mai", "mai.phan", "mai.phan@uit.edu.vn",
            "QA engineer, Selenium automation và performance testing",
            LocalDate.of(2003, 4, 19), "password123", 275, true);

        var nam = createUser("Đỗ Văn Nam", "nam.do", "nam.do@uit.edu.vn",
            "Blockchain developer, Solidity và Web3.js",
            LocalDate.of(2002, 11, 27), "password123", 560, true);

        var oanh = createUser("Lê Thị Oanh", "oanh.le", "oanh.le@uit.edu.vn",
            "Cloud architect, AWS và Terraform chuyên sâu",
            LocalDate.of(2002, 6, 11), "password123", 620, false);

        var phuc = createUser("Nguyễn Minh Phúc", "phuc.nguyen", "phuc.nguyen@uit.edu.vn",
            "Embedded systems, C/C++ và RTOS",
            LocalDate.of(2003, 1, 8), "password123", 395, true);

        var quynh = createUser("Võ Thị Quỳnh", "quynh.vo", "quynh.vo@uit.edu.vn",
            "Data analyst, Power BI và Pandas",
            LocalDate.of(2003, 7, 24), "password123", 310, true);

        var rong = createUser("Huỳnh Văn Rồng", "rong.huynh", "rong.huynh@uit.edu.vn",
            "Compiler engineer, LLVM và language design",
            LocalDate.of(2002, 3, 16), "password123", 580, false);

        var son = createUser("Bùi Minh Sơn", "son.bui", "son.bui@uit.edu.vn",
            "AR/VR developer, Unity và ARKit",
            LocalDate.of(2003, 10, 5), "password123", 355, true);

        var tuyen = createUser("Cao Thị Tuyên", "tuyen.cao", "tuyen.cao@uit.edu.vn",
            "NLP researcher, Hugging Face và BERT fine-tuning",
            LocalDate.of(2002, 8, 20), "password123", 505, true);

        // --- Issues ---
        var i1 = createIssue(an, "Lỗi kết nối PostgreSQL trên Docker",
            "Spring Boot không kết nối được database. Lỗi Connection refused khi chạy docker compose.",
            List.of("Docker", "PostgreSQL", "Spring Boot"), 8, "open", 7);

        var i2 = createIssue(bich, "Không hiểu React useEffect cleanup",
            "Bị memory leak warning khi dùng useEffect với fetch. Cần giải thích cách cleanup đúng.",
            List.of("React Native", "TypeScript"), 5, "open", 3);

        var i3 = createIssue(cuong, "Cấu hình Nginx reverse proxy cho Spring Boot",
            "Cần giúp setup Nginx reverse proxy để forward request từ port 80 vào Spring Boot 8080.",
            List.of("Networking", "Linux", "Spring Boot"), 7, "in_progress", 30);

        var i4 = createIssue(bich, "Bug CSS Flexbox layout trên Android",
            "Layout bị vỡ trên Android nhưng iOS thì bình thường. Cần debug gấp.",
            List.of("React Native", "CSS"), 6, "open", 1);

        createIssue(an, "Hướng dẫn deploy ứng dụng lên k3s",
            "Mới học Kubernetes, cần ai hướng dẫn deploy Spring Boot app lên k3s cluster.",
            List.of("Docker", "Kubernetes", "Linux"), 4, "closed", null);

        var i6 = createIssue(duyen, "Lỗi CORS khi call API từ React Native",
            "Gọi API từ Expo app bị blocked bởi CORS. Đã cấu hình header nhưng vẫn lỗi.",
            List.of("Node.js", "React Native"), 6, "open", 3);

        var i7 = createIssue(em, "Optimize model training TensorFlow chậm",
            "Model training mất 6 giờ cho 1 epoch. Cần tư vấn cách optimize pipeline.",
            List.of("Python", "TensorFlow", "Docker"), 9, "open", 7);

        var i8 = createIssue(phuong, "Swift crash khi push notification foreground",
            "App crash khi nhận push notification lúc foreground trên iOS 17. Stack trace đã có.",
            List.of("Swift"), 8, "in_progress", 7);

        var i9 = createIssue(giang, "Helm chart values không apply đúng",
            "Helm upgrade không update ConfigMap dù đã đổi values.yaml. Cần ai review chart.",
            List.of("Kubernetes", "Docker"), 7, "open", 3);

        var i10 = createIssue(huy, "N+1 query problem trong Spring Data JPA",
            "API /users trả về 200 users nhưng mỗi request tạo ra 200+ SQL queries. Cần fix.",
            List.of("Java", "Spring Boot", "PostgreSQL"), 8, "open", 7);

        var i11 = createIssue(iris, "Kafka consumer lag tăng đột biến",
            "Consumer group bị lag 50k messages sau khi scale up producer. Partition strategy cần review.",
            List.of("Apache Kafka", "Docker"), 9, "open", 1);

        var i12 = createIssue(john, "SQL injection trong query builder tự viết",
            "Phát hiện lỗ hổng SQL injection trong module search. Cần review và patch gấp.",
            List.of("Python", "Networking"), 10, "open", 1);

        createIssue(an, "Setup CI/CD với GitHub Actions cho monorepo",
            "Cần cấu hình workflow chỉ build service bị thay đổi thay vì build hết.",
            List.of("Docker", "Linux"), 5, "open", 7);

        createIssue(bich, "Expo Camera permission trên Android 13",
            "Camera permission bị denied silently trên Android 13 dù đã khai báo trong manifest.",
            List.of("React Native"), 6, "open", 3);

        createIssue(cuong, "WireGuard VPN setup cho lab network",
            "Cần cấu hình WireGuard để các VM trong lab có thể connect với nhau qua VPN.",
            List.of("Networking", "Linux"), 5, "open", 30);

        createIssue(duyen, "TypeORM migration tự động trong NestJS",
            "Migration không chạy tự động khi deploy lên production. Config synchronize=false.",
            List.of("Node.js", "PostgreSQL"), 7, "open", 7);

        createIssue(em, "Gradient explosion trong LSTM training",
            "Loss trở thành NaN sau epoch 3. Đã thử gradient clipping nhưng không ổn định.",
            List.of("Python", "TensorFlow"), 8, "open", 3);

        createIssue(giang, "k3s node NotReady sau khi restart server",
            "Node trở thành NotReady sau mỗi lần reboot. containerd service start delay.",
            List.of("Kubernetes", "Linux"), 7, "open", 7);

        createIssue(huy, "Spring Security JWT filter thứ tự sai",
            "JwtFilter chạy sau AuthorizationFilter nên token không được validate trước. Cần fix chain.",
            List.of("Java", "Spring Boot"), 6, "open", 3);

        createIssue(iris, "Kafka exactly-once semantics cấu hình",
            "Cần enable idempotent producer + transactional consumer để tránh duplicate messages.",
            List.of("Apache Kafka"), 7, "open", 7);

        createIssue(john, "Privilege escalation via SUID binary",
            "Phát hiện binary lạ có SUID bit trên server. Cần forensics và hardening.",
            List.of("Linux", "Networking"), 10, "open", 1);

        var i22 = createIssue(kim, "Server-side rendering bị hydration mismatch Next.js",
            "Console báo lỗi hydration khi dùng useEffect trong SSR component. Cần fix strategy.",
            List.of("React", "Next.js", "TypeScript"), 6, "open", 5);

        createIssue(longUser, "Unity shader không compile trên Android Vulkan",
            "Shader hoạt động tốt trên OpenGLES nhưng crash khi switch sang Vulkan backend.",
            List.of("Unity", "C#", "HLSL"), 7, "open", 7);

        createIssue(mai, "Selenium test flaky do timing issue",
            "Test pass locally nhưng fail trên CI 30% run. Nghi ngờ implicit wait không đủ.",
            List.of("Selenium", "Python"), 5, "open", 3);

        var i25 = createIssue(nam, "Smart contract bị reentrancy attack",
            "Audit phát hiện withdraw() có thể bị drain toàn bộ ETH. Cần fix trước mainnet deploy.",
            List.of("Solidity", "Ethereum"), 10, "in_progress", 3);

        createIssue(oanh, "Terraform state bị lock sau crash",
            "terraform apply bị interrupt, giờ state file bị locked. Cần force-unlock an toàn.",
            List.of("Terraform", "AWS"), 8, "open", 1);

        createIssue(phuc, "FreeRTOS task stack overflow",
            "Hard fault handler trigger khi task thứ 5 start. Stack size 256 words không đủ.",
            List.of("C++", "FreeRTOS"), 9, "open", 7);

        createIssue(quynh, "Power BI DirectQuery chậm hơn Import 100x",
            "Dashboard refresh mất 45 giây với DirectQuery. Cần tư vấn optimize DAX measure.",
            List.of("Power BI", "SQL"), 6, "open", 7);

        createIssue(rong, "LLVM pass gây undefined behavior trong O2",
            "Custom optimization pass tạo ra sai code khi enable O2. Valgrind clean nhưng runtime crash.",
            List.of("C++", "LLVM"), 9, "open", 14);

        createIssue(son, "ARKit plane detection không hoạt động trong nhà",
            "Plane detection chỉ tìm thấy horizontal plane ngoài trời. Indoor lighting ảnh hưởng nhiều.",
            List.of("ARKit", "Unity"), 6, "open", 5);

        createIssue(tuyen, "BERT fine-tuning loss không giảm sau epoch 2",
            "Training loss stuck ở 0.69 (ln2). Learning rate scheduling hoặc tokenizer config sai.",
            List.of("Python", "PyTorch", "TensorFlow"), 8, "open", 7);

        createIssue(an, "Redis cache invalidation race condition",
            "Hai request đồng thời clear và set cache cùng key, gây inconsistent data trong 100ms window.",
            List.of("Java", "Docker"), 7, "open", 3);

        createIssue(bich, "Expo SecureStore bị corrupt sau OTA update",
            "User bị đăng xuất sau update do secure storage key đổi prefix. Cần migration strategy.",
            List.of("React Native", "TypeScript"), 7, "open", 5);

        createIssue(cuong, "BGP route leak từ internal AS ra Internet",
            "Monitoring phát hiện internal /24 route được advertise ra AS65000. Cần isolate và fix.",
            List.of("Networking"), 10, "open", 1);

        createIssue(duyen, "Deadlock trong transaction Node.js + PostgreSQL",
            "API đôi khi bị hang 30 giây rồi rollback. pg_locks cho thấy 2 transaction chờ nhau.",
            List.of("Node.js", "PostgreSQL"), 8, "open", 3);

        createIssue(em, "ResNet model quá lớn để deploy trên Raspberry Pi",
            "Model 90MB không fit vào RAM 512MB kèm OS. Cần quantization hoặc knowledge distillation.",
            List.of("Python", "TensorFlow", "Docker"), 7, "closed", null);

        createIssue(giang, "Helm rollback không restore ConfigMap cũ",
            "helm rollback về revision 2 nhưng ConfigMap vẫn giữ giá trị revision 3. Bug đã biết?",
            List.of("Kubernetes", "Docker"), 6, "open", 7);

        createIssue(huy, "Spring Boot Actuator endpoint bị expose public",
            "/actuator/env trả về credentials trong response. Cần secure endpoints ngay.",
            List.of("Java", "Spring Boot"), 9, "open", 1);

        createIssue(iris, "Kafka topic rebalance storm khi scale consumer",
            "Mỗi lần add consumer mới, toàn bộ group rebalance 3-4 lần liên tiếp. Max poll records sai.",
            List.of("Apache Kafka"), 8, "open", 3);

        createIssue(john, "DNS cache poisoning vulnerability trong resolver",
            "Resolver dùng predictable transaction ID. DNSSEC chưa enable. Cần audit toàn bộ.",
            List.of("Networking", "Linux"), 10, "open", 1);

        var i41 = createIssue(kim, "Next.js ISR stale content không invalidate",
            "revalidateTag() gọi nhưng CDN vẫn serve nội dung cũ 10 phút. Vercel cache layer issue.",
            List.of("React", "Next.js"), 6, "in_progress", 5);

        createIssue(longUser, "Unity coroutine leak khi scene unload",
            "Memory tăng dần sau mỗi lần load/unload scene. Profiler cho thấy coroutine không được cleanup.",
            List.of("Unity", "C#"), 7, "open", 7);

        System.out.println("✓ Seed data: 20 users, 42 issues");
    }

    private UserEntity createUser(String name, String username, String email,
                                   String bio, LocalDate birthday, String password,
                                   int karma, boolean online) {
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
                                     Integer durationDays) {
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

}
