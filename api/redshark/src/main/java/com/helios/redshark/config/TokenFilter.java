// Filter xac thuc token — kiem tra Bearer token trong moi request
package com.helios.redshark.config;

import com.helios.redshark.entity.UserEntity;
import com.helios.redshark.repository.AuthTokenRepository;
import com.helios.redshark.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class TokenFilter extends OncePerRequestFilter {

    private final AuthTokenRepository tokens;
    private final UserRepository users;

    public TokenFilter(AuthTokenRepository tokens, UserRepository users) {
        this.tokens = tokens;
        this.users = users;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return path.startsWith("/api/auth/") || path.startsWith("/actuator/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String tokenValue = header.substring(7);
            var authToken = tokens.findByToken(tokenValue);

            if (authToken.isPresent()) {
                var user = users.findById(authToken.get().getUserId());
                if (user.isPresent()) {
                    request.setAttribute("currentUser", user.get());
                    var auth = new UsernamePasswordAuthenticationToken(user.get(), null, List.of());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        }

        chain.doFilter(request, response);
    }
}
