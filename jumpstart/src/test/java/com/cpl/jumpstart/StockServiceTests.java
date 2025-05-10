package com.cpl.jumpstart;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.cpl.jumpstart.entity.Outlet;
import com.cpl.jumpstart.entity.Product;
import com.cpl.jumpstart.entity.StockProduct;
import com.cpl.jumpstart.repositories.StockProductRepository;
import com.cpl.jumpstart.services.OutletService;
import com.cpl.jumpstart.services.ProductServices;
import com.cpl.jumpstart.services.StockProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

class StockServiceTests {

    @Mock
    private StockProductRepository stockProductRepo;

    @Mock
    private ProductServices productServices;

    @Mock
    private OutletService outletService;

    @InjectMocks
    private StockProductService stockProductService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddNewStock_ValidData() {
        StockProduct stockProduct = new StockProduct();
        stockProduct.setMaximumStockLevel(100);
        stockProduct.setMinimumStockLevel(10);

        String outletName = "Test Outlet";
        String productName = "Test Product";

        Outlet outlet = new Outlet();
        Product product = new Product();

        when(outletService.findByOutletName(outletName)).thenReturn(outlet);
        when(productServices.findByProductName(productName)).thenReturn(product);

        stockProductService.addNewStock(stockProduct, outletName, productName);

        assertEquals(outlet, stockProduct.getOutlet());
        assertEquals(product, stockProduct.getProduct());
        assertEquals(0, stockProduct.getCurrentQuantity());
        verify(stockProductRepo, times(1)).save(stockProduct);
    }

    @Test
    void testAddNewStock_InvalidStockLevels() {
        StockProduct stockProduct = new StockProduct();
        stockProduct.setMaximumStockLevel(5);
        stockProduct.setMinimumStockLevel(10);

        String outletName = "Test Outlet";
        String productName = "Test Product";

        Exception exception = assertThrows(RuntimeException.class, () -> stockProductService.addNewStock(stockProduct, outletName, productName));
        assertEquals("LESTLEVEL", exception.getMessage());
    }

    @Test
    void testFindById_ValidId() {
        Long stockId = 1L;
        StockProduct stockProduct = new StockProduct();

        when(stockProductRepo.findById(stockId)).thenReturn(Optional.of(stockProduct));

        StockProduct result = stockProductService.findById(stockId);

        assertNotNull(result);
        assertEquals(stockProduct, result);
    }

    @Test
    void testFindById_InvalidId() {
        Long stockId = 1L;

        when(stockProductRepo.findById(stockId)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> stockProductService.findById(stockId));
        assertEquals("Stock strategy not found for id 1", exception.getMessage());
    }

    @Test
    void testFindByProductAndOutlet() {
        Long productId = 1L;
        Long outletId = 2L;
        StockProduct stockProduct = new StockProduct();

        when(stockProductRepo.findStockByProductAndOutlet(productId, outletId)).thenReturn(stockProduct);

        StockProduct result = stockProductService.findByProductAndOutlet(productId, outletId);

        assertNotNull(result);
        assertEquals(stockProduct, result);
    }

    @Test
    void testDeleteStockById() {
        Long stockId = 1L;
        StockProduct stockProduct = new StockProduct();

        when(stockProductRepo.findById(stockId)).thenReturn(Optional.of(stockProduct));

        stockProductService.deleteStockById(stockId);

        verify(stockProductRepo, times(1)).deleteById(stockId);
    }

    @Test
    void testUpdateStock_ValidData() {
        Long stockId = 1L;
        StockProduct existingStock = new StockProduct();
        StockProduct updatedStock = new StockProduct();
        updatedStock.setMaximumStockLevel(100);
        updatedStock.setMinimumStockLevel(10);

        when(stockProductRepo.findById(stockId)).thenReturn(Optional.of(existingStock));

        stockProductService.updateStock(updatedStock, stockId);

        assertEquals(100, existingStock.getMaximumStockLevel());
        assertEquals(10, existingStock.getMinimumStockLevel());
        verify(stockProductRepo, times(1)).save(existingStock);
    }

    @Test
    void testFindAllStockLevel() {
        List<String[]> stockLevels = List.of(new String[][]{{"Product1", "Outlet1", "10", "5", "20", "1"}});

        when(stockProductRepo.findAllStocksUnitItem()).thenReturn(stockLevels);

        List<String[]> result = stockProductService.findAllStockLevel();

        assertNotNull(result);
        assertEquals(stockLevels.size(), result.size());
    }

    @Test
    void testFindAllStockLevelByOutlets_ValidOutlet() {
        Long outletId = 1L;
        List<String[]> stockLevels = List.of(new String[][]{{"Product1", "Outlet1", "10", "5", "20", "1"}});

        when(stockProductRepo.findAllStocksUnitItemByOutlets(outletId)).thenReturn(stockLevels);

        List<String[]> result = stockProductService.findAllStockLevelByOutlets(outletId);

        assertNotNull(result);
        assertEquals(stockLevels.size(), result.size());
    }

    @Test
    void testFindAllStockLevelByOutlets_InvalidOutlet() {
        Long outletId = 1L;

        when(stockProductRepo.findAllStocksUnitItemByOutlets(outletId)).thenThrow(new RuntimeException("Outlet not found !"));

        Exception exception = assertThrows(RuntimeException.class, () -> stockProductService.findAllStockLevelByOutlets(outletId));
        assertEquals("Outlet not found !", exception.getMessage());
    }
}