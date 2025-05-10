package com.cpl.jumpstart;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.cpl.jumpstart.entity.Outlet;
import com.cpl.jumpstart.entity.UserApp;
import com.cpl.jumpstart.repositories.OutletRepository;
import com.cpl.jumpstart.services.OutletService;
import com.cpl.jumpstart.services.UserAppServices;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

class OutletServiceTests {

    @Mock
    private OutletRepository outletRepository;

    @Mock
    private UserAppServices userAppServices;

    @InjectMocks
    private OutletService outletService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddNewOutlet() {
        Long userId = 1L;
        UserApp userApp = new UserApp();
        Outlet outlet = new Outlet();

        when(userAppServices.findById(userId)).thenReturn(userApp);
        when(outletRepository.findMaxId()).thenReturn(1L);

        outletService.addNewOutlet(outlet, userId);

        assertEquals("OUTLET-JP-2", outlet.getOutletCode());
        assertEquals(userApp, outlet.getUserApp());
        verify(outletRepository, times(1)).save(outlet);
    }

    @Test
    void testAddNewOutlet_FirstOutlet() {
        Long userId = 1L;
        UserApp userApp = new UserApp();
        Outlet outlet = new Outlet();

        when(userAppServices.findById(userId)).thenReturn(userApp);
        when(outletRepository.findMaxId()).thenReturn(null);

        outletService.addNewOutlet(outlet, userId);

        assertEquals("OUTLET-JP-1", outlet.getOutletCode());
        assertEquals(userApp, outlet.getUserApp());
        verify(outletRepository, times(1)).save(outlet);
    }

    @Test
    void testFindById_ValidId() {
        Long outletId = 1L;
        Outlet outlet = new Outlet();
        when(outletRepository.findById(outletId)).thenReturn(Optional.of(outlet));

        Outlet result = outletService.findById(outletId);

        assertNotNull(result);
        assertEquals(outlet, result);
    }

    @Test
    void testFindById_InvalidId() {
        Long outletId = 1L;
        when(outletRepository.findById(outletId)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> outletService.findById(outletId));
        assertEquals("Outlet with id '1' not found", exception.getMessage());
    }

    @Test
    void testFindByOutletName() {
        String outletName = "Test Outlet";
        Outlet outlet = new Outlet();
        when(outletRepository.findByOutletName(outletName)).thenReturn(outlet);

        Outlet result = outletService.findByOutletName(outletName);

        assertNotNull(result);
        assertEquals(outlet, result);
    }

    @Test
    void testFindByUser_ValidUser() {
        UserApp userApp = new UserApp();
        userApp.setUserId(1L);
        Outlet outlet = new Outlet();

        when(outletRepository.findByUserApp(userApp)).thenReturn(Optional.of(outlet));

        Outlet result = outletService.findByUser(userApp);

        assertNotNull(result);
        assertEquals(outlet, result);
    }

    @Test
    void testFindByUser_InvalidUser() {
        UserApp userApp = new UserApp();
        userApp.setUserId(1L);

        when(outletRepository.findByUserApp(userApp)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> outletService.findByUser(userApp));
        assertEquals("Outlet with userId 1 not found !", exception.getMessage());
    }

    @Test
    void testUpdateOutlet() {
        Long outletId = 1L;
        String staffId = "2";
        UserApp staff = new UserApp();
        Outlet updatedOutlet = new Outlet();

        when(userAppServices.findById(Long.parseLong(staffId))).thenReturn(staff);

        outletService.updateOutlet(outletId, updatedOutlet, staffId);

        assertEquals(staff, updatedOutlet.getUserApp());
        verify(outletRepository, times(1)).save(updatedOutlet);
    }
}