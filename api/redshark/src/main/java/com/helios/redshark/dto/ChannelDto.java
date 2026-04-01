// DTO kenh chat
package com.helios.redshark.dto;

public record ChannelDto(
    String id,
    String workspaceId,
    String name,
    String createdAt
) {}
