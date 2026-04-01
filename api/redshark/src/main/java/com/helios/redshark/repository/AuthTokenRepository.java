package com.helios.redshark.repository;

import com.helios.redshark.entity.AuthTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthTokenRepository extends JpaRepository<AuthTokenEntity, String> {
    Optional<AuthTokenEntity> findByToken(String token);
    void deleteByUserId(String userId);
}
