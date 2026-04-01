// Scheduled task: auto-cancel expired open issues every minute
package com.helios.redshark.config;

import com.helios.redshark.entity.IssueStatus;
import com.helios.redshark.repository.IssueRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Component
public class IssueExpiryScheduler {

    private final IssueRepository issues;

    public IssueExpiryScheduler(IssueRepository issues) {
        this.issues = issues;
    }

    @Scheduled(fixedDelay = 60_000)
    @Transactional
    public void cancelExpiredIssues() {
        var expired = issues.findExpiredOpenIssues(Instant.now());
        if (expired.isEmpty()) return;
        for (var issue : expired) {
            issue.setStatus(IssueStatus.CANCELLED);
        }
        issues.saveAll(expired);
    }
}
