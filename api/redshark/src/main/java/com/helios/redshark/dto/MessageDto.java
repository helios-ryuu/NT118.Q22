// DTO tin nhan
package com.helios.redshark.dto;

public record MessageDto(
    String id,
    String channelId,
    String authorId,
    String authorName,
    String authorAvatar,
    String content,
    String createdAt
) {}
