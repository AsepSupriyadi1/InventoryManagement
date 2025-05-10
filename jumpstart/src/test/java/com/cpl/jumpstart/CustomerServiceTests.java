package com.cpl.jumpstart;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.cpl.jumpstart.entity.Customer;
import com.cpl.jumpstart.entity.Outlet;
import com.cpl.jumpstart.repositories.CustomerRepository;
import com.cpl.jumpstart.services.CustomerService;
import com.cpl.jumpstart.services.OutletService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

class CustomerServiceTests {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private OutletService outletService;

    @InjectMocks
    private CustomerService customerService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddNewCustomer() {
        Long outletId = 1L;
        Outlet outlet = new Outlet();
        Customer customer = new Customer();

        when(outletService.findById(outletId)).thenReturn(outlet);
        when(customerRepository.findMaxId()).thenReturn(1L);

        customerService.addNewCustomer(customer, outletId);

        assertEquals("CUSTOMER-JP-2", customer.getCustomerCode());
        assertEquals(outlet, customer.getOutlet());
        assertNotNull(customer.getDateRegister());
        verify(customerRepository, times(1)).save(customer);
    }

    @Test
    void testFindById_ValidId() {
        Long customerId = 1L;
        Customer customer = new Customer();
        when(customerRepository.findById(customerId)).thenReturn(Optional.of(customer));

        Customer result = customerService.findById(customerId);

        assertNotNull(result);
        assertEquals(customer, result);
    }

    @Test
    void testFindById_InvalidId() {
        Long customerId = 1L;
        when(customerRepository.findById(customerId)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> customerService.findById(customerId));
        assertEquals("Customer with id '1' not found", exception.getMessage());
    }

    @Test
    void testUpdateCustomer() {
        Long customerId = 1L;
        Customer existingCustomer = new Customer();
        Customer updatedCustomer = new Customer();
        updatedCustomer.setCustomerFullName("Updated Name");

        when(customerRepository.findById(customerId)).thenReturn(Optional.of(existingCustomer));

        customerService.updateCustomer(customerId, updatedCustomer);

        assertEquals("Updated Name", existingCustomer.getCustomerFullName());
        verify(customerRepository, times(1)).save(existingCustomer);
    }
}