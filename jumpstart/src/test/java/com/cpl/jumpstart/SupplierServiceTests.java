package com.cpl.jumpstart;

import com.cpl.jumpstart.entity.Supplier;
import com.cpl.jumpstart.repositories.SupplierRepository;
import com.cpl.jumpstart.services.SupplierServices;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SupplierServiceTests {

    @Mock
    private SupplierRepository supplierRepository;

    @InjectMocks
    private SupplierServices supplierServices;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetLastSavedSupplierId_WithExistingSuppliers() {
        when(supplierRepository.findMaxId()).thenReturn(10L);

        Long lastSavedSupplierId = supplierServices.getLastSavedSupplierId();

        assertNotNull(lastSavedSupplierId);
        assertEquals(10L, lastSavedSupplierId);
    }

    @Test
    void testGetLastSavedSupplierId_WithNoSuppliers() {
        when(supplierRepository.findMaxId()).thenReturn(null);

        Long lastSavedSupplierId = supplierServices.getLastSavedSupplierId();

        assertNull(lastSavedSupplierId);
    }

    @Test
    void testAddNewSupplier_WithExistingSuppliers() {
        Supplier supplier = new Supplier();
        when(supplierRepository.findMaxId()).thenReturn(10L);

        supplierServices.addNewSupplier(supplier);

        assertEquals("SUPPLIER-JP-11", supplier.getSupplierCode());
        verify(supplierRepository, times(1)).save(supplier);
    }

    @Test
    void testAddNewSupplier_WithNoSuppliers() {
        Supplier supplier = new Supplier();
        when(supplierRepository.findMaxId()).thenReturn(null);

        supplierServices.addNewSupplier(supplier);

        assertEquals("SUPPLIER-JP-1", supplier.getSupplierCode());
        verify(supplierRepository, times(1)).save(supplier);
    }

    @Test
    void testFindById_WithValidId() {
        Long supplierId = 1L;
        Supplier supplier = new Supplier();
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));

        Supplier result = supplierServices.findById(supplierId);

        assertNotNull(result);
        assertEquals(supplier, result);
    }

    @Test
    void testFindById_WithInvalidId() {
        Long supplierId = 1L;
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> supplierServices.findById(supplierId));
        assertEquals("Supplier with id '1' not found", exception.getMessage());
    }

    @Test
    void testUpdateSupplier_WithValidId() {
        Long supplierId = 1L;
        Supplier existingSupplier = new Supplier();
        Supplier updatedSupplier = new Supplier();
        updatedSupplier.setSupplierName("Updated Name");
        updatedSupplier.setAddress("Updated Address");
        updatedSupplier.setCompanyName("Updated Company");
        updatedSupplier.setPhoneNumber("123456789");
        updatedSupplier.setEmail("updated@example.com");

        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(existingSupplier));

        supplierServices.updateSupplier(supplierId, updatedSupplier);

        assertEquals("Updated Name", existingSupplier.getSupplierName());
        assertEquals("Updated Address", existingSupplier.getAddress());
        assertEquals("Updated Company", existingSupplier.getCompanyName());
        assertEquals("123456789", existingSupplier.getPhoneNumber());
        assertEquals("updated@example.com", existingSupplier.getEmail());
        verify(supplierRepository, times(1)).save(existingSupplier);
    }

    @Test
    void testUpdateSupplier_WithInvalidId() {
        Long supplierId = 1L;
        Supplier updatedSupplier = new Supplier();

        when(supplierRepository.findById(supplierId)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> supplierServices.updateSupplier(supplierId, updatedSupplier));
        assertEquals("Supplier with id '1' not found", exception.getMessage());
    }
}