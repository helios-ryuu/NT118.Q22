// DTO ung cu vao issue
package com.helios.redshark.dto;

public record IssueApplicationDto(
    String id,
    String issueId,
    String applicantId,
    String applicantName,
    String applicantAvatar,
    String status,
    String createdAt,
    String workspaceId
) {}
