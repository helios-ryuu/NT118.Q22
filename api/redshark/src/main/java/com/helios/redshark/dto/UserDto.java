// DTO thong tin nguoi dung — tra ve cho frontend
package com.helios.redshark.dto;

public record UserDto(
    String id,
    String name,
    String username,
    String email,
    String avatar,
    String bio,
    String birthday,
    boolean isOnline
) {}
