package com.cpl.jumpstart;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.cpl.jumpstart.entity.Product;
import com.cpl.jumpstart.entity.ProductCategory;
import com.cpl.jumpstart.entity.Supplier;
import com.cpl.jumpstart.repositories.ProductCategoryRepository;
import com.cpl.jumpstart.repositories.ProductRepository;
import com.cpl.jumpstart.repositories.SupplierRepository;
import com.cpl.jumpstart.services.ProductServices;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

class ProductServiceTests {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private SupplierRepository supplierRepository;

    @Mock
    private ProductCategoryRepository categoryRepository;

    @InjectMocks
    private ProductServices productServices;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddProduct_WithValidSupplierAndCategory() {
        Product product = new Product();
        String supplierId = "1";
        String categoryId = "2";

        Supplier supplier = new Supplier();
        ProductCategory category = new ProductCategory();

        when(supplierRepository.findById(Long.parseLong(supplierId))).thenReturn(Optional.of(supplier));
        when(categoryRepository.findById(Long.parseLong(categoryId))).thenReturn(Optional.of(category));

        productServices.addProduct(product, supplierId, categoryId);

        assertEquals(supplier, product.getSupplier());
        assertEquals(category, product.getCategory());
        verify(productRepository, times(1)).save(product);
    }

    @Test
    void testAddProduct_WithInvalidSupplier() {
        Product product = new Product();
        String supplierId = "1";
        String categoryId = "null";

        when(supplierRepository.findById(Long.parseLong(supplierId))).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> productServices.addProduct(product, supplierId, categoryId));
        assertEquals("Supplier not found 1", exception.getMessage());
    }

    @Test
    void testAddProduct_WithInvalidCategory() {
        Product product = new Product();
        String supplierId = "null";
        String categoryId = "2";

        when(categoryRepository.findById(Long.parseLong(categoryId))).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> productServices.addProduct(product, supplierId, categoryId));
        assertEquals("Category not found 2", exception.getMessage());
    }

    @Test
    void testFindProductById_ValidId() {
        Long productId = 1L;
        Product product = new Product();

        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        Product result = productServices.findProductById(productId);

        assertNotNull(result);
        assertEquals(product, result);
    }

    @Test
    void testFindProductById_InvalidId() {
        Long productId = 1L;

        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> productServices.findProductById(productId));
        assertEquals("Product with id 1 not found", exception.getMessage());
    }

    @Test
    void testUpdateProduct() {
        Product updatedProduct = new Product();

        productServices.updateProduct(updatedProduct);

        verify(productRepository, times(1)).save(updatedProduct);
    }

    @Test
    void testDeleteById() {
        Long productId = 1L;

        productServices.deleteById(productId);

        verify(productRepository, times(1)).deleteById(productId);
    }

    @Test
    void testFindAllBySupplier_ValidSupplier() {
        Long supplierId = 1L;
        List<Product> products = List.of(new Product(), new Product());

        when(productRepository.findAllByProductBySupplier(supplierId)).thenReturn(products);

        List<Product> result = productServices.findALlBySupplier(supplierId);

        assertNotNull(result);
        assertEquals(products.size(), result.size());
    }

    @Test
    void testFindAllBySupplier_InvalidSupplier() {
        Long supplierId = 1L;

        when(productRepository.findAllByProductBySupplier(supplierId)).thenThrow(new RuntimeException("Supplier Not Found"));

        Exception exception = assertThrows(RuntimeException.class, () -> productServices.findALlBySupplier(supplierId));
        assertEquals("Supplier Not Found", exception.getMessage());
    }

    @Test
    void testFindByProductName() {
        String productName = "Test Product";
        Product product = new Product();

        when(productRepository.findByProductName(productName)).thenReturn(product);

        Product result = productServices.findByProductName(productName);

        assertNotNull(result);
        assertEquals(product, result);
    }
}