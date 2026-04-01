package com.helios.redshark.repository;

import com.helios.redshark.entity.MessageEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<MessageEntity, String> {
    Page<MessageEntity> findByChannelIdOrderByCreatedAtDesc(String channelId, Pageable pageable);
    void deleteByChannelIdIn(List<String> channelIds);
}
