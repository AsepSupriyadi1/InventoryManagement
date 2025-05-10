package com.cpl.jumpstart;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.cpl.jumpstart.dto.request.TransactionDto;
import com.cpl.jumpstart.dto.request.TransactionProductDto;
import com.cpl.jumpstart.dto.response.TransactionInfoDto;
import com.cpl.jumpstart.entity.*;
import com.cpl.jumpstart.entity.constraint.TransactionStatus;
import com.cpl.jumpstart.repositories.CustomerTransactionRepository;
import com.cpl.jumpstart.repositories.CustomerProductPurchaseRepository;
import com.cpl.jumpstart.repositories.OutletRepository;
import com.cpl.jumpstart.services.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.*;

class TransactionServiceTests {

    @Mock
    private CustomerTransactionRepository transactionRepo;

    @Mock
    private CustomerProductPurchaseRepository transactionProductRepo;

    @Mock
    private OutletRepository outletRepository;

    @Mock
    private ProductServices productServices;

    @Mock
    private OutletService outletService;

    @Mock
    private StockProductService stockProductService;

    @Mock
    private CustomerService customerService;

    @Mock
    private UserAppServices userAppServices;

    @Mock
    private PaymentTokenService paymentTokenService;

    @Mock
    private EmailSenderService emailSenderService;

    @InjectMocks
    private TransactionService transactionService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddNewPurchase_ValidData() {
        TransactionDto transactionDto = new TransactionDto();
        transactionDto.setOutletId("1");
        transactionDto.setCustomerId("2");
        transactionDto.setProductDtoList(List.of(new TransactionProductDto(1L, 2)));

        Outlet outlet = new Outlet();
        Customer customer = new Customer();
        Product product = new Product();
        product.setProductId(1L);
        StockProduct stockProduct = new StockProduct();
        product.setPrices(100.0); // Set a valid price for the product

        when(outletService.findById(1L)).thenReturn(outlet);
        when(customerService.findById(2L)).thenReturn(customer);
        when(productServices.findProductById(1L)).thenReturn(product);
        when(stockProductService.findByProductAndOutlet(1L, 1L)).thenReturn(stockProduct);
        UserApp staff = new UserApp();
        staff.setFullName("Test Staff");
        when(userAppServices.getCurrentUser()).thenReturn(staff);
        when(transactionRepo.findMaxId()).thenReturn(1L);

        TransactionInfoDto result = transactionService.addNewPurchase(transactionDto);

        assertNotNull(result);
        assertEquals("SALES-JP-2", result.getTransaction().getTransactionCode());
    }

    @Test
    void testAddNewPurchase_NoItems() {
        TransactionDto transactionDto = new TransactionDto();
        transactionDto.setOutletId("1");
        transactionDto.setProductDtoList(new ArrayList<>());

        when(outletService.findById(1L)).thenReturn(new Outlet());

        Exception exception = assertThrows(RuntimeException.class, () -> transactionService.addNewPurchase(transactionDto));
        assertEquals("NO_ITEMS", exception.getMessage());
    }

    @Test
    void testAddNewPurchase_ProductNotFound() {
        TransactionDto transactionDto = new TransactionDto();
        transactionDto.setOutletId("1");
        transactionDto.setCustomerId("2");
        transactionDto.setProductDtoList(List.of(new TransactionProductDto(1L, 2)));

        when(outletService.findById(1L)).thenReturn(new Outlet());
        when(customerService.findById(2L)).thenReturn(new Customer());
        when(productServices.findProductById(1L)).thenThrow(new RuntimeException("PRODUCT_NOT_FOUND"));

        Exception exception = assertThrows(RuntimeException.class, () -> transactionService.addNewPurchase(transactionDto));
        assertEquals("PRODUCT_NOT_FOUND", exception.getMessage());
    }

    @Test
    void testSaveTransaction() {
        CustomerTransaction transaction = new CustomerTransaction();
        List<CustomerProductPurchases> purchasesList = List.of(new CustomerProductPurchases());

        TransactionInfoDto transactionInfoDto = new TransactionInfoDto(transaction, purchasesList);

        transactionService.saveTransaction(transactionInfoDto);

        verify(transactionRepo, times(1)).save(transaction);
        verify(transactionProductRepo, times(1)).save(any(CustomerProductPurchases.class));
    }

    @Test
    void testDeliverTransaction() {
        Long transactionId = 1L;
        Date deliveryDate = new Date();
        CustomerTransaction transaction = new CustomerTransaction();

        when(transactionRepo.findById(transactionId)).thenReturn(Optional.of(transaction));
        doNothing().when(paymentTokenService).saveToken(any(PaymentToken.class));

        transactionService.deliverTransaction(transactionId, deliveryDate);

        assertEquals(TransactionStatus.DELIVER, transaction.getTransactionStatus());
        verify(transactionRepo, times(1)).save(transaction);
        verify(emailSenderService, times(1)).sendSimpleEmail(anyString(), anyString(), anyString());
    }

    @Test
    void testMakePayment() {
        Long transactionId = 1L;
        CustomerTransaction transaction = new CustomerTransaction();
        Outlet outlet = new Outlet();
        outlet.setTotalRevenue(1000.0);
        transaction.setOutlet(outlet);
        transaction.setTotalAmount(500.0);

        when(transactionRepo.findById(transactionId)).thenReturn(Optional.of(transaction));

        transactionService.makePayment(transactionId);

        assertEquals(TransactionStatus.COMPLETED, transaction.getTransactionStatus());
        assertEquals(1500.0, outlet.getTotalRevenue());
        verify(outletRepository, times(1)).save(outlet);
        verify(transactionRepo, times(1)).save(transaction);
    }

    @Test
    void testFindTransactionById_ValidId() {
        Long transactionId = 1L;
        CustomerTransaction transaction = new CustomerTransaction();

        when(transactionRepo.findById(transactionId)).thenReturn(Optional.of(transaction));

        CustomerTransaction result = transactionService.findTransactionById(transactionId);

        assertNotNull(result);
        assertEquals(transaction, result);
    }

    @Test
    void testFindTransactionById_InvalidId() {
        Long transactionId = 1L;

        when(transactionRepo.findById(transactionId)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> transactionService.findTransactionById(transactionId));
        assertEquals("Transaction not found for id 1", exception.getMessage());
    }

    @Test
    void testFindAllTransactionByOutlet() {
        Long outletId = 1L;
        List<CustomerTransaction> transactions = List.of(new CustomerTransaction(), new CustomerTransaction());

        when(transactionRepo.findAllTransactionByOutlet(outletId)).thenReturn(transactions);

        List<CustomerTransaction> result = transactionService.findALlTransactionByOutlet(outletId);

        assertNotNull(result);
        assertEquals(2, result.size());
    }

    @Test
    void testFindAllProductPurchasesTransaction() {
        Long transactionId = 1L;
        List<CustomerProductPurchases> purchases = List.of(new CustomerProductPurchases(), new CustomerProductPurchases());

        when(transactionProductRepo.findAllByProductByTransactionId(transactionId)).thenReturn(purchases);

        List<CustomerProductPurchases> result = transactionService.findAllProductPurchasesTransaction(transactionId);

        assertNotNull(result);
        assertEquals(2, result.size());
    }
}