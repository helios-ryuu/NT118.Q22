// Controller kenh va tin nhan trong workspace
package com.helios.redshark.controller;

import com.helios.redshark.dto.ChannelDto;
import com.helios.redshark.dto.MessageDto;
import com.helios.redshark.entity.ChannelEntity;
import com.helios.redshark.entity.MessageEntity;
import com.helios.redshark.entity.UserEntity;
import com.helios.redshark.repository.ChannelRepository;
import com.helios.redshark.repository.MessageRepository;
import com.helios.redshark.repository.WorkspaceRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.helios.redshark.entity.IssueStatus;
import java.util.List;
import java.util.Map;

@RestController
public class ChannelController {

    private final WorkspaceRepository workspaces;
    private final ChannelRepository channels;
    private final MessageRepository messages;

    public ChannelController(WorkspaceRepository workspaces,
                              ChannelRepository channels,
                              MessageRepository messages) {
        this.workspaces = workspaces;
        this.channels = channels;
        this.messages = messages;
    }

    // Danh sach kenh
    @Transactional
    @GetMapping("/api/sessions/{id}/channels")
    public List<ChannelDto> listChannels(@PathVariable String id) {
        workspaces.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return channels.findByWorkspaceIdOrderByCreatedAtAsc(id)
            .stream().map(this::toChannelDto).toList();
    }

    // Tao kenh moi (owner only)
    @Transactional
    @PostMapping("/api/sessions/{id}/channels")
    @ResponseStatus(HttpStatus.CREATED)
    public ChannelDto createChannel(@PathVariable String id,
                                     @RequestBody Map<String, String> body,
                                     HttpServletRequest request) {
        UserEntity currentUser = (UserEntity) request.getAttribute("currentUser");
        if (currentUser == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);

        var workspace = workspaces.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        // Chi issue owner moi tao kenh
        if (!workspace.getIssue().getAuthor().getId().equals(currentUser.getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        String issueStatus = workspace.getIssue().getStatus();
        if (IssueStatus.CLOSED.equals(issueStatus) || IssueStatus.CANCELLED.equals(issueStatus))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Workspace đang ở chế độ chỉ đọc");

        String name = body.getOrDefault("name", "kênh-mới");
        var channel = new ChannelEntity();
        channel.setWorkspace(workspace);
        channel.setName(name);
        channels.save(channel);
        return toChannelDto(channel);
    }

    // Load tin nhan (phan trang, moi nhat truoc)
    @Transactional
    @GetMapping("/api/channels/{channelId}/messages")
    public List<MessageDto> listMessages(@PathVariable String channelId,
                                          @RequestParam(defaultValue = "0") int page,
                                          @RequestParam(defaultValue = "50") int size) {
        channels.findById(channelId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return messages.findByChannelIdOrderByCreatedAtDesc(channelId,
                PageRequest.of(page, Math.min(size, 100)))
            .stream().map(this::toMessageDto).toList();
    }

    // Gui tin nhan
    @Transactional
    @PostMapping("/api/channels/{channelId}/messages")
    @ResponseStatus(HttpStatus.CREATED)
    public MessageDto sendMessage(@PathVariable String channelId,
                                   @RequestBody Map<String, String> body,
                                   HttpServletRequest request) {
        UserEntity currentUser = (UserEntity) request.getAttribute("currentUser");
        if (currentUser == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);

        var channel = channels.findById(channelId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        String issueStatus = channel.getWorkspace().getIssue().getStatus();
        if (IssueStatus.CLOSED.equals(issueStatus) || IssueStatus.CANCELLED.equals(issueStatus))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Workspace đang ở chế độ chỉ đọc");

        String content = body.get("content");
        if (content == null || content.isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nội dung không được trống");

        var msg = new MessageEntity();
        msg.setChannel(channel);
        msg.setAuthor(currentUser);
        msg.setContent(content.trim());
        messages.save(msg);
        return toMessageDto(msg);
    }

    private ChannelDto toChannelDto(ChannelEntity c) {
        return new ChannelDto(c.getId(), c.getWorkspace().getId(),
            c.getName(), c.getCreatedAt().toString());
    }

    private MessageDto toMessageDto(MessageEntity m) {
        UserEntity a = m.getAuthor();
        return new MessageDto(m.getId(), m.getChannel().getId(),
            a.getId(), a.getName(), a.getAvatar(),
            m.getContent(), m.getCreatedAt().toString());
    }
}
