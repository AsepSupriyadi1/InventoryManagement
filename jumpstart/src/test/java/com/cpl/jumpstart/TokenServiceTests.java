package com.cpl.jumpstart;

import com.cpl.jumpstart.entity.Token;
import com.cpl.jumpstart.entity.UserApp;
import com.cpl.jumpstart.repositories.TokenRepository;
import com.cpl.jumpstart.services.TokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

class TokenServiceTests {

    @Mock
    private TokenRepository tokenRepository;

    @InjectMocks
    private TokenService tokenService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRevokeAllUserTokens_WithValidTokens() {
        UserApp user = new UserApp();
        user.setUserId(1L);

        List<Token> validTokens = new ArrayList<>();
        Token token1 = new Token();
        Token token2 = new Token();
        validTokens.add(token1);
        validTokens.add(token2);

        when(tokenRepository.findAllValidTokensByUser(user.getUserId())).thenReturn(validTokens);

        tokenService.revokeAllUserTokens(user);

        assertTrue(token1.isExpired());
        assertTrue(token1.isRevoked());
        assertTrue(token2.isExpired());
        assertTrue(token2.isRevoked());
        verify(tokenRepository, times(1)).saveAll(validTokens);
    }

    @Test
    void testRevokeAllUserTokens_WithNoValidTokens() {
        UserApp user = new UserApp();
        user.setUserId(1L);

        when(tokenRepository.findAllValidTokensByUser(user.getUserId())).thenReturn(new ArrayList<>());

        tokenService.revokeAllUserTokens(user);

        verify(tokenRepository, never()).saveAll(anyList());
    }
}