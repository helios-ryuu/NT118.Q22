// Issue controller — CRUD van de
package com.helios.redshark.controller;

import com.helios.redshark.dto.IssueDto;
import com.helios.redshark.entity.IssueEntity;
import com.helios.redshark.entity.UserEntity;
import com.helios.redshark.repository.IssueRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.helios.redshark.entity.IssueStatus;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    private final IssueRepository issues;

    public IssueController(IssueRepository issues) {
        this.issues = issues;
    }

    @GetMapping
    public List<IssueDto> list() {
        return issues.findAll().stream().map(this::toDto).toList();
    }

    @GetMapping("/{id}")
    public IssueDto getById(@PathVariable String id) {
        return toDto(findIssueOrThrow(id));
    }

    @Transactional
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IssueDto create(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        UserEntity author = requireCurrentUser(request);

        int activeCount = issues.countByAuthorIdAndStatusIn(
            author.getId(), List.of(IssueStatus.OPEN, IssueStatus.IN_PROGRESS));
        if (activeCount >= 20)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Bạn đã đạt giới hạn 20 vấn đề đang mở hoặc đang xử lý");

        int priority = 5;
        Object pVal = body.get("priority");
        if (pVal instanceof Number n) {
            priority = Math.min(10, Math.max(1, n.intValue()));
        }

        Integer durationDays = null;
        Object dVal = body.get("durationDays");
        if (dVal instanceof Number n) {
            durationDays = n.intValue();
        }

        var issue = new IssueEntity();
        issue.setTitle(String.valueOf(body.getOrDefault("title", "")).trim());
        issue.setDescription(String.valueOf(body.getOrDefault("description", "")));
        issue.setTags(body.get("tags") instanceof List<?> tags
            ? tags.stream().map(String::valueOf).toList()
            : List.of());
        issue.setPriority(priority);
        issue.setStatus(IssueStatus.OPEN);
        issue.setAuthor(author);
        issue.setDurationDays(durationDays);
        issue.setExpiresAt(calculateExpiresAt(durationDays));

        issues.save(issue);
        return toDto(issue);
    }

    @PutMapping("/{id}")
    public IssueDto update(@PathVariable String id, @RequestBody Map<String, Object> body,
                            HttpServletRequest request) {
        var issue = findIssueOrThrow(id);
        requireOwner(request, issue.getAuthor());
        if (!IssueStatus.OPEN.equals(issue.getStatus()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chỉ có thể sửa vấn đề đang mở");

        if (body.containsKey("title")) issue.setTitle(String.valueOf(body.get("title")).trim());
        if (body.containsKey("description")) issue.setDescription(String.valueOf(body.get("description")));
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
        var issue = findIssueOrThrow(id);

        String newStatus = body.get("status");
        if (!isValidTransition(issue.getStatus(), newStatus))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chuyển trạng thái không hợp lệ");

        if (IssueStatus.CLOSED.equals(newStatus) || IssueStatus.CANCELLED.equals(newStatus)) {
            requireOwner(request, issue.getAuthor());
        }

        issue.setStatus(newStatus);
        issues.save(issue);
        return toDto(issue);
    }

    @DeleteMapping("/{id}")
    @Transactional
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id, HttpServletRequest request) {
        var issue = findIssueOrThrow(id);
        requireOwner(request, issue.getAuthor());
        if (!IssueStatus.OPEN.equals(issue.getStatus()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chỉ có thể xóa vấn đề đang mở");

        issues.delete(issue);
    }

    private boolean isValidTransition(String from, String to) {
        return switch (from) {
            case IssueStatus.OPEN -> Set.of(IssueStatus.IN_PROGRESS, IssueStatus.CANCELLED).contains(to);
            case IssueStatus.IN_PROGRESS -> IssueStatus.CLOSED.equals(to);
            default -> false;
        };
    }

    private IssueEntity findIssueOrThrow(String id) {
        return issues.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    private Instant calculateExpiresAt(Integer durationDays) {
        return durationDays != null
            ? Instant.now().plus(durationDays, ChronoUnit.DAYS)
            : Instant.now().plus(365 * 10L, ChronoUnit.DAYS);
    }

    private UserEntity requireCurrentUser(HttpServletRequest request) {
        UserEntity currentUser = (UserEntity) request.getAttribute("currentUser");
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return currentUser;
    }

    private void requireOwner(HttpServletRequest request, UserEntity owner) {
        UserEntity currentUser = requireCurrentUser(request);
        if (!currentUser.getId().equals(owner.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }

    private IssueDto toDto(IssueEntity i) {
        UserEntity a = i.getAuthor();
        return new IssueDto(i.getId(), i.getTitle(), i.getDescription(),
            i.getTags(), i.getPriority(), i.getStatus(),
            a.getId(), a.getName(), a.getAvatar(),
            i.getCreatedAt().toString(), i.getExpiresAt() != null ? i.getExpiresAt().toString() : null,
            i.getDurationDays());
    }
}
