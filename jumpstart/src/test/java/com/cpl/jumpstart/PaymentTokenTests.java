package com.cpl.jumpstart;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import com.cpl.jumpstart.entity.PaymentToken;
import com.cpl.jumpstart.repositories.PaymentTokenRepository;
import com.cpl.jumpstart.services.PaymentTokenService;

@SpringBootTest
class PaymentTokenTests {
@Mock
	private PaymentTokenRepository paymentTokenRepository;

	@InjectMocks
	private PaymentTokenService paymentTokenService;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void testSaveToken() {
		PaymentToken token = new PaymentToken();
		paymentTokenService.saveToken(token);
		verify(paymentTokenRepository, times(1)).save(token);
	}

	@Test
	void testFindByToken_ValidToken() {
		String token = "validToken";
		PaymentToken paymentToken = new PaymentToken();
		when(paymentTokenRepository.findByToken(token)).thenReturn(paymentToken);

		PaymentToken result = paymentTokenService.findByToken(token);
		assertNotNull(result);
		assertEquals(paymentToken, result);
	}

	@Test
	void testFindByToken_InvalidToken() {
		String token = "invalidToken";
		when(paymentTokenRepository.findByToken(token)).thenReturn(null);

		Exception exception = assertThrows(RuntimeException.class, () -> paymentTokenService.findByToken(token));
		assertEquals("Token not found", exception.getMessage());
	}

	@Test
	void testFindById_ValidId() {
		Long id = 1L;
		PaymentToken paymentToken = new PaymentToken();
		when(paymentTokenRepository.findById(id)).thenReturn(Optional.of(paymentToken));

		PaymentToken result = paymentTokenService.findById(id);
		assertNotNull(result);
		assertEquals(paymentToken, result);
	}

	@Test
	void testFindById_InvalidId() {
		Long id = 1L;
		when(paymentTokenRepository.findById(id)).thenReturn(Optional.empty());

		Exception exception = assertThrows(RuntimeException.class, () -> paymentTokenService.findById(id));
		assertEquals("Token Not Found", exception.getMessage());
	}

	@Test
	void testDeleteTokenById() {
		Long id = 1L;
		paymentTokenService.deleteTokenById(id);
		verify(paymentTokenRepository, times(1)).deleteById(id);
	}
}
