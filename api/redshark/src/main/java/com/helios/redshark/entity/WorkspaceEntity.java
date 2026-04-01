// Entity phien lam viec — luu trong bang "workspaces"
package com.helios.redshark.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workspaces")
public class WorkspaceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id", nullable = false)
    private IssueEntity issue;

    @Column(nullable = false)
    private String status; // active, completed

    @Column(nullable = false)
    private boolean isPublic = true;

    @ManyToMany
    @JoinTable(
        name = "workspace_members",
        joinColumns = @JoinColumn(name = "workspace_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<UserEntity> members = new ArrayList<>();

    // Luu vai tro cua tung member (author/helper) dang chuoi phan cach bang dau phay, thu tu tuong ung members
    @Column(columnDefinition = "TEXT")
    private String memberRoles;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
    }

    // Getters & setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public IssueEntity getIssue() { return issue; }
    public void setIssue(IssueEntity issue) { this.issue = issue; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isPublic() { return isPublic; }
    public void setPublic(boolean isPublic) { this.isPublic = isPublic; }

    public List<UserEntity> getMembers() { return members; }
    public void setMembers(List<UserEntity> members) { this.members = members; }

    public String getMemberRoles() { return memberRoles; }
    public void setMemberRoles(String memberRoles) { this.memberRoles = memberRoles; }

    public Instant getCreatedAt() { return createdAt; }
}
