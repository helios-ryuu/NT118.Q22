// DTO van de — tra ve cho frontend
package com.helios.redshark.dto;

import java.util.List;

public record IssueDto(
    String id,
    String title,
    String description,
    List<String> tags,
    int priority,
    String status,
    String authorId,
    String authorName,
    String authorAvatar,
    String createdAt,
    String expiresAt,
    Integer durationDays
) {}
