// Chuyen doi UserEntity → UserDto — dung chung cho cac controller
package com.helios.redshark.dto;

import com.helios.redshark.entity.UserEntity;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDto toDto(UserEntity u) {
        return new UserDto(u.getId(), u.getName(), u.getUsername(), u.getEmail(),
            u.getAvatar(), u.getBio(), u.getBirthday() != null ? u.getBirthday().toString() : null,
            u.isOnline());
    }
}
