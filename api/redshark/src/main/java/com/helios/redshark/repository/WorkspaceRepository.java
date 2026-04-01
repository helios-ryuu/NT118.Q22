// Repository phien lam viec
package com.helios.redshark.repository;

import com.helios.redshark.entity.WorkspaceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkspaceRepository extends JpaRepository<WorkspaceEntity, String> {
    Optional<WorkspaceEntity> findFirstByIssueIdOrderByCreatedAtAsc(String issueId);
    List<WorkspaceEntity> findAllByIssueIdOrderByCreatedAtAsc(String issueId);
    void deleteByIssueId(String issueId);
    int countByMembersId(String userId);
}
