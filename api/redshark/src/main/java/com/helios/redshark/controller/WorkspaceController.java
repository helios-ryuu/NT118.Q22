// Controller workspace — CRUD phien lam viec
package com.helios.redshark.controller;

import com.helios.redshark.dto.WorkspaceDto;
import com.helios.redshark.entity.IssueEntity;
import com.helios.redshark.entity.UserEntity;
import com.helios.redshark.entity.WorkspaceEntity;
import com.helios.redshark.repository.IssueRepository;
import com.helios.redshark.repository.UserRepository;
import com.helios.redshark.repository.WorkspaceRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.helios.redshark.entity.IssueStatus;
import com.helios.redshark.entity.WorkspaceStatus;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
public class WorkspaceController {

    private final WorkspaceRepository workspaces;
    private final IssueRepository issues;
    private final UserRepository users;

    public WorkspaceController(WorkspaceRepository workspaces, IssueRepository issues, UserRepository users) {
        this.workspaces = workspaces;
        this.issues = issues;
        this.users = users;
    }

    @Transactional
    @GetMapping("/{id}")
    public ResponseEntity<WorkspaceDto> getById(@PathVariable String id) {
        return workspaces.findById(id)
            .map(this::toDto)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @Transactional
    @GetMapping("/by-issue/{issueId}")
    public ResponseEntity<WorkspaceDto> getByIssue(@PathVariable String issueId) {
        IssueEntity issue = issues.findById(issueId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var workspace = findOrCreateWorkspaceForIssue(issue);

        return ResponseEntity.ok(toDto(workspace));
    }

    // Tao workspace (candidacy flow → IssueApplicationController la chinh, giu endpoint nay de backward compat)
    @Transactional
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WorkspaceDto create(@RequestBody Map<String, String> body) {
        String issueId = body.get("issueId");
        String helperId = body.get("helperId");
        if (issueId == null || issueId.isBlank() || helperId == null || helperId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu issueId hoặc helperId");
        }

        IssueEntity issue = issues.findById(issueId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Issue không tồn tại"));
        UserEntity helper = users.findById(helperId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Helper không tồn tại"));

        var workspace = findOrCreateWorkspaceForIssue(issue);

        if (IssueStatus.IN_PROGRESS.equals(issue.getStatus()))
            return toDto(workspace);
        if (!IssueStatus.OPEN.equals(issue.getStatus()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Issue không ở trạng thái hợp lệ");

        if (workspace.getMembers().stream().noneMatch(m -> m.getId().equals(helper.getId()))) {
            workspace.getMembers().add(helper);
        }
        workspace.setMemberRoles("author,helper");
        workspace.setStatus(WorkspaceStatus.ACTIVE);

        issue.setStatus(IssueStatus.IN_PROGRESS);
        issues.save(issue);
        workspaces.save(workspace);
        return toDto(workspace);
    }

    // Cap nhat workspace (isPublic)
    @Transactional
    @PutMapping("/{id}")
    public ResponseEntity<WorkspaceDto> update(@PathVariable String id,
                                                @RequestBody Map<String, Object> body,
                                                HttpServletRequest request) {
        UserEntity currentUser = (UserEntity) request.getAttribute("currentUser");
        var workspace = workspaces.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!workspace.getIssue().getAuthor().getId().equals(currentUser.getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        String issueStatus = workspace.getIssue().getStatus();
        if (IssueStatus.CLOSED.equals(issueStatus) || IssueStatus.CANCELLED.equals(issueStatus))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Workspace đang ở chế độ chỉ đọc");

        if (body.containsKey("isPublic") && body.get("isPublic") instanceof Boolean b)
            workspace.setPublic(b);

        workspaces.save(workspace);
        return ResponseEntity.ok(toDto(workspace));
    }

    // Kick thanh vien (owner only)
    @Transactional
    @DeleteMapping("/{id}/members/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void kickMember(@PathVariable String id, @PathVariable String userId,
                            HttpServletRequest request) {
        UserEntity currentUser = (UserEntity) request.getAttribute("currentUser");
        var workspace = workspaces.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!workspace.getIssue().getAuthor().getId().equals(currentUser.getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        if (!IssueStatus.IN_PROGRESS.equals(workspace.getIssue().getStatus()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Workspace đang ở chế độ chỉ đọc");
        if (workspace.getIssue().getAuthor().getId().equals(userId))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không thể kick owner");

        workspace.getMembers().removeIf(m -> m.getId().equals(userId));
        workspaces.save(workspace);
    }

    // Hoan thanh phien: workspace → completed, issue → closed
    @Transactional
    @PutMapping("/{id}/complete")
    public ResponseEntity<WorkspaceDto> complete(@PathVariable String id) {
        var workspace = workspaces.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!WorkspaceStatus.ACTIVE.equals(workspace.getStatus()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phiên đã kết thúc");

        workspace.setStatus(WorkspaceStatus.COMPLETED);

        IssueEntity issue = workspace.getIssue();
        issue.setStatus(IssueStatus.CLOSED);

        issues.save(issue);
        workspaces.save(workspace);
        return ResponseEntity.ok(toDto(workspace));
    }

    private WorkspaceEntity findOrCreateWorkspaceForIssue(IssueEntity issue) {
        List<WorkspaceEntity> existing = workspaces.findAllByIssueIdOrderByCreatedAtAsc(issue.getId());
        if (!existing.isEmpty()) {
            WorkspaceEntity primary = existing.get(0);
            if (existing.size() > 1) {
                workspaces.deleteAll(existing.subList(1, existing.size()));
            }
            return primary;
        }

        var ws = new WorkspaceEntity();
        ws.setIssue(issue);
        ws.setStatus((IssueStatus.CLOSED.equals(issue.getStatus()) || IssueStatus.CANCELLED.equals(issue.getStatus()))
            ? WorkspaceStatus.COMPLETED : WorkspaceStatus.ACTIVE);
        ws.setPublic(true);
        ws.setMembers(new ArrayList<>(List.of(issue.getAuthor())));
        ws.setMemberRoles("author");
        return workspaces.save(ws);
    }

    private WorkspaceDto toDto(WorkspaceEntity w) {
        List<UserEntity> members = w.getMembers();
        String[] roles = (w.getMemberRoles() != null ? w.getMemberRoles() : "").split(",");

        List<WorkspaceDto.MemberDto> memberDtos = new ArrayList<>();
        for (int i = 0; i < members.size(); i++) {
            var m = members.get(i);
            String role = i < roles.length ? roles[i].trim() : "helper";
            memberDtos.add(new WorkspaceDto.MemberDto(m.getId(), m.getName(), m.getAvatar(), role));
        }

        return new WorkspaceDto(
            w.getId(),
            w.getIssue().getId(),
            w.getIssue().getTitle(),
            w.getIssue().getStatus(),
            w.getStatus(),
            w.isPublic(),
            memberDtos,
            w.getCreatedAt().toString()
        );
    }
}
