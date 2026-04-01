// DTO phien lam viec — tra ve cho frontend
package com.helios.redshark.dto;

import java.util.List;

public record WorkspaceDto(
    String id,
    String issueId,
    String issueTitle,
    String issueStatus,
    String status,
    boolean isPublic,
    List<MemberDto> members,
    String createdAt
) {
    public record MemberDto(
        String id,
        String name,
        String avatar,
        String role
    ) {}
}
