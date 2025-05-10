package com.cpl.jumpstart;

import com.cpl.jumpstart.services.EmailSenderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.mockito.Mockito.*;

class EmailServiceTests {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailSenderService emailSenderService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSendSimpleEmail() {
        String toEmail = "test@example.com";
        String body = "This is a test email.";
        String subject = "Test Subject";

        // Mock the behavior of JavaMailSender
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        // Call the method
        emailSenderService.sendSimpleEmail(toEmail, body, subject);

        // Verify that the mailSender's send method was called once
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }
}