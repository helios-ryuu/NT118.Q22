// Auth controller — dang nhap, dang ky, quen mat khau, reset, dang xuat
package com.helios.redshark.controller;

import com.helios.redshark.dto.AuthResponseDto;
import com.helios.redshark.dto.UserMapper;
import com.helios.redshark.entity.AuthTokenEntity;
import com.helios.redshark.entity.UserEntity;
import com.helios.redshark.repository.AuthTokenRepository;
import com.helios.redshark.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository users;
    private final AuthTokenRepository authTokens;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository users, AuthTokenRepository authTokens,
                          UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.authTokens = authTokens;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/check-email")
    public Map<String, Boolean> checkEmail(@RequestBody Map<String, String> body) {
        String email = body.getOrDefault("email", "");
        return Map.of("exists", users.existsByEmail(email.toLowerCase()));
    }

    @PostMapping("/login")
    public AuthResponseDto login(@RequestBody Map<String, String> body) {
        String email = body.getOrDefault("email", "");
        String password = body.getOrDefault("password", "");

        UserEntity user = users.findByEmail(email.toLowerCase())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email không tồn tại"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sai mật khẩu");
        }

        return new AuthResponseDto(createToken(user.getId()), userMapper.toDto(user));
    }

    @PostMapping("/register")
    public AuthResponseDto register(@RequestBody Map<String, String> body) {
        String email = body.getOrDefault("email", "").toLowerCase();

        if (users.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã tồn tại");
        }

        var user = new UserEntity();
        user.setName(body.getOrDefault("name", "Người dùng mới"));
        user.setUsername(body.getOrDefault("username", "user" + System.currentTimeMillis()));
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(body.getOrDefault("password", "")));
        user.setBio("Sinh viên UIT");
        String birthday = body.get("birthday");
        if (birthday != null) user.setBirthday(LocalDate.parse(birthday));
        user.setKarmaPoints(0);
        user.setOnline(true);

        users.save(user);

        return new AuthResponseDto(createToken(user.getId()), userMapper.toDto(user));
    }

    @DeleteMapping("/logout")
    @Transactional
    public Map<String, String> logout(@RequestHeader("Authorization") String header) {
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            authTokens.findByToken(token).ifPresent(authTokens::delete);
        }
        return Map.of("message", "Đã đăng xuất");
    }

    private String createToken(String userId) {
        var token = new AuthTokenEntity();
        token.setToken("token-" + UUID.randomUUID());
        token.setUserId(userId);
        authTokens.save(token);
        return token.getToken();
    }
}
