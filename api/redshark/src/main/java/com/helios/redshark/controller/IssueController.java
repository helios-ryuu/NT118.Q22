// Issue controller — CRUD van de
package com.helios.redshark.controller;

import com.helios.redshark.dto.IssueDto;
import com.helios.redshark.repository.ChannelRepository;
import com.helios.redshark.repository.IssueApplicationRepository;
import com.helios.redshark.entity.IssueEntity;
import com.helios.redshark.entity.UserEntity;
import com.helios.redshark.entity.WorkspaceEntity;
import com.helios.redshark.repository.IssueRepository;
import com.helios.redshark.repository.MessageRepository;
import com.helios.redshark.repository.UserRepository;
import com.helios.redshark.repository.WorkspaceRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.helios.redshark.entity.IssueStatus;
import com.helios.redshark.entity.WorkspaceStatus;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    private final IssueRepository issues;
    private final UserRepository users;
    private final WorkspaceRepository workspaces;
    private final IssueApplicationRepository applications;
    private final ChannelRepository channels;
    private final MessageRepository messages;

    public IssueController(IssueRepository issues,
                           UserRepository users,
                           WorkspaceRepository workspaces,
                           IssueApplicationRepository applications,
                           ChannelRepository channels,
                           MessageRepository messages) {
        this.issues = issues;
        this.users = users;
        this.workspaces = workspaces;
        this.applications = applications;
        this.channels = channels;
        this.messages = messages;
    }

    @GetMapping
    public List<IssueDto> list() {
        return issues.findAll().stream().map(this::toDto).toList();
    }

    @GetMapping("/{id}")
    public IssueDto getById(@PathVariable String id) {
        return issues.findById(id)
            .map(this::toDto)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @SuppressWarnings("unchecked")
    @Transactional
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IssueDto create(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        UserEntity author = (UserEntity) request.getAttribute("currentUser");
        if (author == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);

        int activeCount = issues.countByAuthorIdAndStatusIn(
            author.getId(), List.of(IssueStatus.OPEN, IssueStatus.IN_PROGRESS));
        if (activeCount >= 20)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Bạn đã đạt giới hạn 20 vấn đề đang mở hoặc đang xử lý");

        int priority = 5;
        Object pVal = body.get("priority");
        if (pVal instanceof Number n) priority = Math.min(10, Math.max(1, n.intValue()));

        Integer durationDays = null;
        Object dVal = body.get("durationDays");
        if (dVal instanceof Number n) durationDays = n.intValue();

        var issue = new IssueEntity();
        issue.setTitle((String) body.get("title"));
        issue.setDescription((String) body.getOrDefault("description", ""));
        issue.setTags(body.get("tags") instanceof List<?> tags
            ? tags.stream().map(String::valueOf).toList()
            : List.of());
        issue.setPriority(priority);
        issue.setStatus(IssueStatus.OPEN);
        issue.setAuthor(author);
        issue.setDurationDays(durationDays);
        issue.setExpiresAt(durationDays != null
            ? Instant.now().plus(durationDays, ChronoUnit.DAYS)
            : Instant.now().plus(365 * 10L, ChronoUnit.DAYS));

        issues.save(issue);

        // Tao workspace ngay khi issue duoc tao (author-only).
        var workspace = new WorkspaceEntity();
        workspace.setIssue(issue);
        workspace.setStatus(WorkspaceStatus.ACTIVE);
        workspace.setPublic(true);
        workspace.setMembers(new java.util.ArrayList<>(List.of(author)));
        workspace.setMemberRoles("author");
        workspaces.save(workspace);

        return toDto(issue);
    }

    @SuppressWarnings("unchecked")
    @PutMapping("/{id}")
    public IssueDto update(@PathVariable String id, @RequestBody Map<String, Object> body,
                            HttpServletRequest request) {
        UserEntity currentUser = (UserEntity) request.getAttribute("currentUser");
        var issue = issues.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!issue.getAuthor().getId().equals(currentUser.getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        if (!IssueStatus.OPEN.equals(issue.getStatus()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chỉ có thể sửa vấn đề đang mở");

        if (body.containsKey("title")) issue.setTitle((String) body.get("title"));
        if (body.containsKey("description")) issue.setDescription((String) body.get("description"));
        if (body.get("tags") instanceof List<?> tags)
            issue.setTags(new java.util.ArrayList<>(tags.stream().map(String::valueOf).toList()));
        if (body.get("priority") instanceof Number n)
            issue.setPriority(Math.min(10, Math.max(1, n.intValue())));

        issues.save(issue);
        return toDto(issue);
    }

    @PutMapping("/{id}/status")
    public IssueDto updateStatus(@PathVariable String id, @RequestBody Map<String, String> body,
                                  HttpServletRequest request) {
        UserEntity currentUser = (UserEntity) request.getAttribute("currentUser");
        var issue = issues.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        String newStatus = body.get("status");
        if (!isValidTransition(issue.getStatus(), newStatus))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chuyển trạng thái không hợp lệ");

        // closed chỉ owner mới được thực hiện
        if (IssueStatus.CLOSED.equals(newStatus) || IssueStatus.CANCELLED.equals(newStatus)) {
            if (currentUser == null || !issue.getAuthor().getId().equals(currentUser.getId()))
                throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        issue.setStatus(newStatus);
        issues.save(issue);
        return toDto(issue);
    }

    @DeleteMapping("/{id}")
    @Transactional
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id, HttpServletRequest request) {
        UserEntity currentUser = (UserEntity) request.getAttribute("currentUser");
        var issue = issues.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!issue.getAuthor().getId().equals(currentUser.getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        if (!IssueStatus.OPEN.equals(issue.getStatus()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chỉ có thể xóa vấn đề đang mở");

        List<WorkspaceEntity> issueWorkspaces = workspaces.findAllByIssueIdOrderByCreatedAtAsc(id);
        if (!issueWorkspaces.isEmpty()) {
            List<String> workspaceIds = issueWorkspaces.stream().map(WorkspaceEntity::getId).toList();
            List<String> channelIds = channels.findByWorkspaceIdIn(workspaceIds).stream()
                .map(c -> c.getId())
                .toList();
            if (!channelIds.isEmpty()) {
                messages.deleteByChannelIdIn(channelIds);
                channels.deleteAllById(channelIds);
            }
            workspaces.deleteByIssueId(id);
        }

        applications.deleteByIssueId(id);
        issues.delete(issue);
    }

    // open → in_progress (qua candidacy accept), open → cancelled
    // in_progress → closed
    private boolean isValidTransition(String from, String to) {
        return switch (from) {
            case IssueStatus.OPEN -> Set.of(IssueStatus.IN_PROGRESS, IssueStatus.CANCELLED).contains(to);
            case IssueStatus.IN_PROGRESS -> IssueStatus.CLOSED.equals(to);
            default -> false;
        };
    }

    private IssueDto toDto(IssueEntity i) {
        UserEntity a = i.getAuthor();
        return new IssueDto(i.getId(), i.getTitle(), i.getDescription(),
            i.getTags(), i.getPriority(), i.getStatus(),
            a.getId(), a.getName(), a.getAvatar(),
            i.getCreatedAt().toString(), i.getExpiresAt().toString(),
            i.getDurationDays());
    }
}
