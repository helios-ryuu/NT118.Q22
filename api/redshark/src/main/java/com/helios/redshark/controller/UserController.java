// User controller — danh sach va chi tiet nguoi dung
package com.helios.redshark.controller;

import com.helios.redshark.dto.UserDto;
import com.helios.redshark.dto.UserMapper;
import com.helios.redshark.entity.UserEntity;
import com.helios.redshark.repository.AuthTokenRepository;
import com.helios.redshark.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository users;
    private final UserMapper userMapper;
    private final AuthTokenRepository authTokens;

    public UserController(UserRepository users, UserMapper userMapper,
                          AuthTokenRepository authTokens) {
        this.users = users;
        this.userMapper = userMapper;
        this.authTokens = authTokens;
    }

    @GetMapping
    public List<UserDto> list() {
        return users.findAll().stream().map(userMapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public UserDto getById(@PathVariable String id) {
        return users.findById(id)
            .map(userMapper::toDto)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public UserDto updateUser(@PathVariable String id, @RequestBody Map<String, Object> body,
                              HttpServletRequest request) {
        UserEntity currentUser = (UserEntity) request.getAttribute("currentUser");
        if (currentUser == null || !currentUser.getId().equals(id)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        if (body.containsKey("name")) currentUser.setName((String) body.get("name"));
        if (body.containsKey("bio")) currentUser.setBio((String) body.get("bio"));
        if (body.containsKey("avatar")) currentUser.setAvatar((String) body.get("avatar"));
        if (body.containsKey("birthday")) {
            var bd = body.get("birthday");
            currentUser.setBirthday(bd != null ? java.time.LocalDate.parse((String) bd) : null);
        }
        return userMapper.toDto(users.save(currentUser));
    }

    @DeleteMapping("/{id}")
    @Transactional
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable String id, HttpServletRequest request) {
        UserEntity currentUser = (UserEntity) request.getAttribute("currentUser");
        if (currentUser == null || !currentUser.getId().equals(id)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        authTokens.deleteByUserId(id);
        users.deleteById(id);
    }
}
