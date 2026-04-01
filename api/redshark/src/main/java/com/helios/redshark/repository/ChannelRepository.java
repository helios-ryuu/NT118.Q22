package com.helios.redshark.repository;

import com.helios.redshark.entity.ChannelEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChannelRepository extends JpaRepository<ChannelEntity, String> {
    List<ChannelEntity> findByWorkspaceIdOrderByCreatedAtAsc(String workspaceId);
    List<ChannelEntity> findByWorkspaceIdIn(List<String> workspaceIds);
    void deleteByWorkspaceIdIn(List<String> workspaceIds);
}
