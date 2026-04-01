// Entity ung cu vao issue
package com.helios.redshark.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "issue_applications",
    uniqueConstraints = @UniqueConstraint(columnNames = {"issue_id", "applicant_id"}))
public class IssueApplicationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id", nullable = false)
    private IssueEntity issue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_id", nullable = false)
    private UserEntity applicant;

    @Column(nullable = false)
    private String status; // pending | accepted | rejected

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
        if (status == null) status = "pending";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public IssueEntity getIssue() { return issue; }
    public void setIssue(IssueEntity issue) { this.issue = issue; }

    public UserEntity getApplicant() { return applicant; }
    public void setApplicant(UserEntity applicant) { this.applicant = applicant; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
}
