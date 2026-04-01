// Controller ung cu vao issue (candidacy)
package com.helios.redshark.controller;

import com.helios.redshark.dto.IssueApplicationDto;
import com.helios.redshark.entity.IssueApplicationEntity;
import com.helios.redshark.entity.IssueEntity;
import com.helios.redshark.entity.UserEntity;
import com.helios.redshark.entity.WorkspaceEntity;
import com.helios.redshark.repository.IssueApplicationRepository;
import com.helios.redshark.repository.IssueRepository;
import com.helios.redshark.repository.WorkspaceRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.helios.redshark.entity.ApplicationStatus;
import com.helios.redshark.entity.IssueStatus;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/issues")
public class IssueApplicationController {

    private final IssueRepository issues;
    private final IssueApplicationRepository applications;
    private final WorkspaceRepository workspaces;

    public IssueApplicationController(IssueRepository issues,
                                       IssueApplicationRepository applications,
                                       WorkspaceRepository workspaces) {
        this.issues = issues;
        this.applications = applications;
        this.workspaces = workspaces;
    }

    // Kiem tra user hien tai da ung cu chua
    @GetMapping("/{id}/applied")
    public java.util.Map<String, Boolean> hasApplied(@PathVariable String id, HttpServletRequest request) {
        UserEntity currentUser = (UserEntity) request.getAttribute("currentUser");
        if (currentUser == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        boolean applied = applications.existsByIssueIdAndApplicantId(id, currentUser.getId());
        return java.util.Map.of("applied", applied);
    }

    // Ung cu vao issue (non-owner, issue phai open)
    @Transactional
    @PostMapping("/{id}/apply")
    @ResponseStatus(HttpStatus.CREATED)
    public IssueApplicationDto apply(@PathVariable String id, HttpServletRequest request) {
        UserEntity currentUser = (UserEntity) request.getAttribute("currentUser");
        if (currentUser == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);

        IssueEntity issue = issues.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (issue.getAuthor().getId().equals(currentUser.getId()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không thể ứng cử vấn đề của chính mình");

        if (!IssueStatus.OPEN.equals(issue.getStatus()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Issue không còn mở");

        if (applications.existsByIssueIdAndApplicantId(id, currentUser.getId()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bạn đã ứng cử rồi");

        var app = new IssueApplicationEntity();
        app.setIssue(issue);
        app.setApplicant(currentUser);
        applications.save(app);
        return toDto(app);
    }

    // Danh sach ung cu (owner only)
    @Transactional
    @GetMapping("/{id}/applications")
    public List<IssueApplicationDto> list(@PathVariable String id, HttpServletRequest request) {
        UserEntity currentUser = (UserEntity) request.getAttribute("currentUser");
        IssueEntity issue = issues.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!issue.getAuthor().getId().equals(currentUser.getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        return applications.findByIssueId(id).stream().map(this::toDto).toList();
    }

    // Chap nhan ung cu → tao workspace + in_progress
    @Transactional
    @PutMapping("/{id}/applications/{appId}/accept")
    public IssueApplicationDto accept(@PathVariable String id, @PathVariable String appId,
                                       HttpServletRequest request) {
        UserEntity currentUser = (UserEntity) request.getAttribute("currentUser");
        IssueEntity issue = issues.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!issue.getAuthor().getId().equals(currentUser.getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        if (!IssueStatus.OPEN.equals(issue.getStatus()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Issue không còn mở");

        var app = applications.findById(appId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!app.getIssue().getId().equals(id))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        app.setStatus(ApplicationStatus.ACCEPTED);
        applications.save(app);

        // Workspace duoc tao san khi issue duoc tao, chi can gan helper vao.
        var workspace = workspaces.findFirstByIssueIdOrderByCreatedAtAsc(id).orElseGet(() -> {
            var ws = new WorkspaceEntity();
            ws.setIssue(issue);
            ws.setStatus("active");
            ws.setPublic(true);
            ws.setMembers(new ArrayList<>(List.of(issue.getAuthor())));
            ws.setMemberRoles("author");
            return ws;
        });

        boolean hasApplicant = workspace.getMembers().stream()
            .anyMatch(m -> m.getId().equals(app.getApplicant().getId()));
        if (!hasApplicant) {
            workspace.getMembers().add(app.getApplicant());
        }

        workspace.setMemberRoles("author,helper");
        workspaces.save(workspace);

        issue.setStatus(IssueStatus.IN_PROGRESS);
        issues.save(issue);

        return toDto(app, workspace.getId());
    }

    // Tu choi ung cu
    @Transactional
    @PutMapping("/{id}/applications/{appId}/reject")
    public IssueApplicationDto reject(@PathVariable String id, @PathVariable String appId,
                                       HttpServletRequest request) {
        UserEntity currentUser = (UserEntity) request.getAttribute("currentUser");
        IssueEntity issue = issues.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!issue.getAuthor().getId().equals(currentUser.getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        var app = applications.findById(appId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!app.getIssue().getId().equals(id))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        app.setStatus(ApplicationStatus.REJECTED);
        applications.save(app);
        return toDto(app);
    }

    private IssueApplicationDto toDto(IssueApplicationEntity a) {
        return toDto(a, null);
    }

    private IssueApplicationDto toDto(IssueApplicationEntity a, String workspaceId) {
        UserEntity u = a.getApplicant();
        return new IssueApplicationDto(
            a.getId(), a.getIssue().getId(),
            u.getId(), u.getName(), u.getAvatar(),
            a.getStatus(), a.getCreatedAt().toString(), workspaceId);
    }
}
