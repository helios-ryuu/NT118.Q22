package com.helios.redshark.repository;

import com.helios.redshark.entity.IssueEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;

public interface IssueRepository extends JpaRepository<IssueEntity, String> {
    List<IssueEntity> findByAuthorId(String authorId);
    int countByAuthorIdAndStatusIn(String authorId, List<String> statuses);

    @Query("SELECT i FROM IssueEntity i WHERE i.status = 'open' AND i.expiresAt < :now")
    List<IssueEntity> findExpiredOpenIssues(Instant now);
}
