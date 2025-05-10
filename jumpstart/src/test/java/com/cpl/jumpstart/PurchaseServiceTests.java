package com.cpl.jumpstart;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.cpl.jumpstart.dto.request.ProductPurchasesDto;
import com.cpl.jumpstart.dto.request.PurchaseDto;
import com.cpl.jumpstart.dto.response.BillsInfoDto;
import com.cpl.jumpstart.entity.*;
import com.cpl.jumpstart.entity.constraint.PurchasesStatus;
import com.cpl.jumpstart.repositories.OutletRepository;
import com.cpl.jumpstart.repositories.ProductPurchasesRepository;
import com.cpl.jumpstart.repositories.PurchasesRepository;
import com.cpl.jumpstart.repositories.StockProductRepository;
import com.cpl.jumpstart.services.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.*;

class PurchaseServiceTests {

    @Mock
    private PurchasesRepository purchasesRepo;

    @Mock
    private ProductPurchasesRepository productPurchasesRepo;

    @Mock
    private StockProductRepository stockProductRepo;

    @Mock
    private ProductServices productServices;

    @Mock
    private OutletService outletService;

    @Mock
    private OutletRepository outletRepository;

    @Mock
    private StockProductService stockProductService;

    @Mock
    private SupplierServices supplierServices;

    @Mock
    private UserAppServices userAppServices;

    @InjectMocks
    private PurchaseServices purchaseServices;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddNewPurchase_ValidData() {
        PurchaseDto purchaseDto = new PurchaseDto();
        purchaseDto.setOutletId("1");
        purchaseDto.setSupplierId("2");
        purchaseDto.setListProduct(List.of(new ProductPurchasesDto(1L, 5)));

        Outlet outlet = new Outlet();
        Supplier supplier = new Supplier();
        Product product = new Product();
        product.setProductId(1L);
        product.setPrices(100.0);
        StockProduct stockProduct = new StockProduct();

        when(outletService.findById(1L)).thenReturn(outlet);
        when(supplierServices.findById(2L)).thenReturn(supplier);
        when(productServices.findProductById(1L)).thenReturn(product);
        when(stockProductService.findByProductAndOutlet(1L, 1L)).thenReturn(stockProduct);
        when(purchasesRepo.findMaxId()).thenReturn(1L);

        UserApp staff = new UserApp();
        staff.setFullName("Test Staff");
        when(userAppServices.getCurrentUser()).thenReturn(staff);

        BillsInfoDto result = purchaseServices.addNewPurchase(purchaseDto);

        assertNotNull(result);
        assertEquals("BILL-JP-2", result.getPurchases().getPurchaseCode());
        verify(purchasesRepo, never()).save(any());
    }

    @Test
    void testAddNewPurchase_NoItems() {
        PurchaseDto purchaseDto = new PurchaseDto();
        purchaseDto.setListProduct(new ArrayList<>());

        Exception exception = assertThrows(RuntimeException.class, () -> purchaseServices.addNewPurchase(purchaseDto));
        assertEquals("NO_ITEMS", exception.getMessage());
    }

    @Test
    void testAddNewPurchase_ProductNotFound() {
        PurchaseDto purchaseDto = new PurchaseDto();
        purchaseDto.setOutletId("1");
        purchaseDto.setSupplierId("2");
        purchaseDto.setListProduct(List.of(new ProductPurchasesDto(1L, 5)));

        when(outletService.findById(1L)).thenReturn(new Outlet());
        when(supplierServices.findById(2L)).thenReturn(new Supplier());
        when(productServices.findProductById(1L)).thenThrow(new RuntimeException("PRODUCT_NOT_FOUND"));

        Exception exception = assertThrows(RuntimeException.class, () -> purchaseServices.addNewPurchase(purchaseDto));
        assertEquals("PRODUCT_NOT_FOUND", exception.getMessage());
    }

    @Test
    void testSaveBills() {
        Purchases purchases = new Purchases();
        List<ProductPurchases> productPurchasesList = List.of(new ProductPurchases());

        BillsInfoDto billsInfoDto = new BillsInfoDto(purchases, productPurchasesList);

        purchaseServices.saveBills(billsInfoDto);

        verify(purchasesRepo, times(1)).save(purchases);
        verify(productPurchasesRepo, times(1)).save(any(ProductPurchases.class));
    }

    @Test
    void testApproveBills() {
        String purchaseId = "1";
        Purchases purchases = new Purchases();
        UserApp userApp = new UserApp();
        userApp.setStaffCode("STAFF-001");

        when(userAppServices.getCurrentUser()).thenReturn(userApp);
        when(purchasesRepo.findById(1L)).thenReturn(Optional.of(purchases));

        purchaseServices.approveBills(purchaseId);

        assertEquals(PurchasesStatus.APPROVED, purchases.getPurchasesStatus());
        assertEquals("STAFF-001", purchases.getApprovedBy());
        verify(purchasesRepo, times(1)).save(purchases);
    }

    @Test
    void testGoodsArrived() {
        String purchaseId = "1";
        Date dateArrived = new Date();
        Purchases purchases = new Purchases();
        Outlet outlet = new Outlet();
        Product product = new Product();
        ProductPurchases productPurchases = new ProductPurchases();
        productPurchases.setProductId("1");
        productPurchases.setQuantity(10);
        purchases.setProductPurchasesList(List.of(productPurchases));
        purchases.setOutlet(outlet);

        when(purchasesRepo.findById(1L)).thenReturn(Optional.of(purchases));
        when(productServices.findProductById(1L)).thenReturn(product);
        when(stockProductRepo.findByOutletAndProduct(outlet, product)).thenReturn(Optional.empty());

        purchaseServices.goodsArrived(purchaseId, dateArrived);

        assertEquals(PurchasesStatus.ARRIVED, purchases.getPurchasesStatus());
        verify(stockProductRepo, times(1)).save(any(StockProduct.class));
        verify(purchasesRepo, times(1)).save(purchases);
    }

    @Test
    void testFindPurchaseById_ValidId() {
        Long purchaseId = 1L;
        Purchases purchases = new Purchases();

        when(purchasesRepo.findById(purchaseId)).thenReturn(Optional.of(purchases));

        Purchases result = purchaseServices.findPurchaseById(purchaseId);

        assertNotNull(result);
        assertEquals(purchases, result);
    }

    @Test
    void testFindPurchaseById_InvalidId() {
        Long purchaseId = 1L;

        when(purchasesRepo.findById(purchaseId)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> purchaseServices.findPurchaseById(purchaseId));
        assertEquals("Purchase not found for id 1", exception.getMessage());
    }

    @Test
    void testMakePayment() {
        Long purchaseId = 1L;
        Purchases purchases = new Purchases();
        Outlet outlet = new Outlet();
        outlet.setTotalExpenses(1000.0);
        purchases.setOutlet(outlet);
        purchases.setTotalAmount(500.0);

        when(purchasesRepo.findById(purchaseId)).thenReturn(Optional.of(purchases));

        purchaseServices.makePayment(purchaseId);

        assertEquals(PurchasesStatus.COMPLETED, purchases.getPurchasesStatus());
        assertEquals(1500.0, outlet.getTotalExpenses());
        verify(outletRepository, times(1)).save(outlet);
        verify(purchasesRepo, times(1)).save(purchases);
    }
}