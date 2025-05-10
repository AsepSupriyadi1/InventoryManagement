package com.cpl.jumpstart;

import com.cpl.jumpstart.entity.Token;
import com.cpl.jumpstart.repositories.TokenRepository;
import com.cpl.jumpstart.services.LogoutService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

class LogoutServiceTests {

    @Mock
    private TokenRepository tokenRepository;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private LogoutService logoutService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testLogout_WithValidToken() {
        String jwt = "validToken";
        String authHeader = "Bearer " + jwt;

        Token token = new Token();
        token.setExpired(false);
        token.setRevoked(false);

        when(request.getHeader("Authorization")).thenReturn(authHeader);
        when(tokenRepository.findByToken(jwt)).thenReturn(Optional.of(token));

        logoutService.logout(request, response, authentication);

        assertTrue(token.isExpired());
        assertTrue(token.isRevoked());
        verify(tokenRepository, times(1)).save(token);
    }

    @Test
    void testLogout_WithNoAuthorizationHeader() {
        when(request.getHeader("Authorization")).thenReturn(null);

        logoutService.logout(request, response, authentication);

        verify(tokenRepository, never()).findByToken(anyString());
        verify(tokenRepository, never()).save(any(Token.class));
    }

    @Test
    void testLogout_WithInvalidAuthorizationHeader() {
        when(request.getHeader("Authorization")).thenReturn("InvalidHeader");

        logoutService.logout(request, response, authentication);

        verify(tokenRepository, never()).findByToken(anyString());
        verify(tokenRepository, never()).save(any(Token.class));
    }

    @Test
    void testLogout_WithTokenNotFound() {
        String jwt = "nonExistentToken";
        String authHeader = "Bearer " + jwt;

        when(request.getHeader("Authorization")).thenReturn(authHeader);
        when(tokenRepository.findByToken(jwt)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> logoutService.logout(request, response, authentication));
        assertEquals("Token null", exception.getMessage());

        verify(tokenRepository, never()).save(any(Token.class));
    }
}