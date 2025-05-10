package com.cpl.jumpstart;

import com.cpl.jumpstart.services.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.User;

import java.security.Key;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtServiceTests {

    private JwtService jwtService;

    public static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    @Mock
    private HttpServletRequest httpServletRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        jwtService = new JwtService();
    }

    @Test
    void testExtractUsername() {
        String username = "testUser";
        String token = jwtService.generateToken(new User(username, "password", new ArrayList<>()));

        String extractedUsername = jwtService.extractUsername(token);

        assertEquals(username, extractedUsername);
    }

    @Test
    void testExtractClaims() {
        String username = "testUser";
        String token = jwtService.generateToken(new User(username, "password", new ArrayList<>()));

        Claims claims = jwtService.extractClaims(token, claimsResolver -> claimsResolver);

        assertNotNull(claims);
        assertEquals(username, claims.getSubject());
    }

    @Test
    void testExtractTokenFromRequest_ValidToken() {
        String token = "Bearer validToken";
        when(httpServletRequest.getHeader("Authorization")).thenReturn(token);

        String extractedToken = jwtService.extractTokenFromRequest(httpServletRequest);

        assertEquals("validToken", extractedToken);
    }

    @Test
    void testExtractTokenFromRequest_InvalidToken() {
        when(httpServletRequest.getHeader("Authorization")).thenReturn("InvalidToken");

        String extractedToken = jwtService.extractTokenFromRequest(httpServletRequest);

        assertNull(extractedToken);
    }

    @Test
    void testGenerateToken() {
        UserDetails userDetails = new User("testUser", "password", new ArrayList<>());

        String token = jwtService.generateToken(userDetails);

        assertNotNull(token);
    }

    @Test
    void testIsTokenValid_ValidToken() {
        UserDetails userDetails = new User("testUser", "password", new ArrayList<>());
        String token = jwtService.generateToken(userDetails);

        boolean isValid = jwtService.isTokenValid(token, userDetails);

        assertTrue(isValid);
    }

    @Test
    void testIsTokenValid_InvalidToken() {
        UserDetails userDetails = new User("testUser", "password", new ArrayList<>());
        String token = jwtService.generateToken(userDetails);

        UserDetails otherUser = new User("otherUser", "password", new ArrayList<>());

        boolean isValid = jwtService.isTokenValid(token, otherUser);

        assertFalse(isValid);
    }

    @Test
    void testIsTokenExpired_ExpiredToken() {
        Map<String, Object> claims = new HashMap<>();
        UserDetails userDetails = new User("testUser", "password", new ArrayList<>());

        String expiredToken = Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis() - 1000 * 60 * 60)) // 1 hour ago
                .setExpiration(new Date(System.currentTimeMillis() - 1000 * 60)) // Expired 1 minute ago
                .signWith(JwtService.SECRET_KEY)
                .compact();

        boolean isExpired = jwtService.isTokenValid(expiredToken, userDetails);

        assertFalse(isExpired);
    }

    @Test
    void testExtractExpiration() {
        UserDetails userDetails = new User("testUser", "password", new ArrayList<>());
        String token = jwtService.generateToken(userDetails);

        Date expirationDate = jwtService.extractClaims(token, Claims::getExpiration);

        assertNotNull(expirationDate);
        assertTrue(expirationDate.after(new Date()));
    }
}