// DTO phan hoi dang nhap/dang ky — chua token va thong tin user
package com.helios.redshark.dto;

public record AuthResponseDto(
    String token,
    UserDto user
) {}
