package com.helios.redshark.repository;

import com.helios.redshark.entity.IssueApplicationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IssueApplicationRepository extends JpaRepository<IssueApplicationEntity, String> {
    @Query("SELECT a FROM IssueApplicationEntity a JOIN FETCH a.applicant WHERE a.issue.id = :issueId")
    List<IssueApplicationEntity> findByIssueId(@Param("issueId") String issueId);
    Optional<IssueApplicationEntity> findByIssueIdAndApplicantId(String issueId, String applicantId);
    boolean existsByIssueIdAndApplicantId(String issueId, String applicantId);
    void deleteByIssueId(String issueId);
}
