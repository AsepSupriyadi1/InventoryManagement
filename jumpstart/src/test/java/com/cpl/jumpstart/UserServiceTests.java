package com.cpl.jumpstart;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.cpl.jumpstart.Exception.EmailAlreadyExistException;
import com.cpl.jumpstart.Exception.OutletNotActiveException;
import com.cpl.jumpstart.entity.Outlet;
import com.cpl.jumpstart.entity.UserApp;
import com.cpl.jumpstart.entity.constraint.UserAppRole;
import com.cpl.jumpstart.repositories.UserAppRepository;
import com.cpl.jumpstart.services.UserAppServices;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

class UserServiceTests {

    @Mock
    private UserAppRepository userAppRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private UserAppServices userAppServices;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testLoadUserByUsername_ValidUser() {
        String email = "test@example.com";
        UserApp userApp = new UserApp();
        userApp.setEmail(email);
        userApp.setPassword("password");
        userApp.setUserRole(UserAppRole.STORE_ADMIN);
        Outlet outlet = new Outlet();
        outlet.setOutletActive(true);
        userApp.setOutlet(outlet);

        when(userAppRepository.findByEmail(email)).thenReturn(Optional.of(userApp));

        UserDetails userDetails = userAppServices.loadUserByUsername(email);

        assertNotNull(userDetails);
        assertEquals(email, userDetails.getUsername());
    }

    @Test
    void testLoadUserByUsername_UserNotFound() {
        String email = "notfound@example.com";

        when(userAppRepository.findByEmail(email)).thenReturn(Optional.empty());

        Exception exception = assertThrows(UsernameNotFoundException.class, () -> userAppServices.loadUserByUsername(email));
        assertEquals("User with email notfound@example.com not found", exception.getMessage());
    }

    @Test
    void testLoadUserByUsername_OutletNotActive() {
        String email = "test@example.com";
        UserApp userApp = new UserApp();
        userApp.setEmail(email);
        userApp.setUserRole(UserAppRole.STORE_ADMIN);
        userApp.setOutlet(null);

        when(userAppRepository.findByEmail(email)).thenReturn(Optional.of(userApp));

        Exception exception = assertThrows(OutletNotActiveException.class, () -> userAppServices.loadUserByUsername(email));
        assertNotNull(exception);
    }

    @Test
    void testSaveUser_ValidUser() {
        UserApp user = new UserApp();
        user.setEmail("test@example.com");
        user.setPassword("password");

        when(userAppRepository.findByEmail(user.getEmail())).thenReturn(Optional.empty());
        when(userAppRepository.findMaxId()).thenReturn(1L);
        when(passwordEncoder.encode(user.getPassword())).thenReturn("encodedPassword");
        when(userAppRepository.save(user)).thenReturn(user);

        UserApp savedUser = userAppServices.save(user);

        assertNotNull(savedUser);
        assertEquals("STAFF-JP-2", savedUser.getStaffCode());
        assertEquals("encodedPassword", savedUser.getPassword());
        assertEquals(UserAppRole.STORE_ADMIN, savedUser.getUserRole());
    }

    @Test
    void testSaveUser_EmailAlreadyExists() {
        UserApp user = new UserApp();
        user.setEmail("test@example.com");

        when(userAppRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        Exception exception = assertThrows(EmailAlreadyExistException.class, () -> userAppServices.save(user));
        assertEquals("user with email 'test@example.com' already exist", exception.getMessage());
    }

    @Test
    void testGetCurrentUser_ValidUser() {
        String email = "currentuser@example.com";
        UserApp userApp = new UserApp();
        userApp.setEmail(email);

        when(userAppRepository.findByEmail(email)).thenReturn(Optional.of(userApp));
        org.springframework.security.core.Authentication authentication = mock(org.springframework.security.core.Authentication.class);
        when(authentication.getName()).thenReturn(email);
        org.springframework.security.core.context.SecurityContext securityContext = mock(org.springframework.security.core.context.SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        UserApp currentUser = userAppServices.getCurrentUser();

        assertNotNull(currentUser);
        assertEquals(email, currentUser.getEmail());
    }

    @Test
    void testGetCurrentUser_UserNotFound() {
        String email = "currentuser@example.com";

        org.springframework.security.core.Authentication authentication = mock(org.springframework.security.core.Authentication.class);
        when(authentication.getName()).thenReturn(email);
        org.springframework.security.core.context.SecurityContext securityContext = mock(org.springframework.security.core.context.SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(userAppRepository.findByEmail(email)).thenReturn(Optional.empty());

        Exception exception = assertThrows(UsernameNotFoundException.class, () -> userAppServices.getCurrentUser());
        assertEquals("current user not found", exception.getMessage());
    }

    @Test
    void testFindById_ValidId() {
        Long userId = 1L;
        UserApp userApp = new UserApp();

        when(userAppRepository.findById(userId)).thenReturn(Optional.of(userApp));

        UserApp result = userAppServices.findById(userId);

        assertNotNull(result);
        assertEquals(userApp, result);
    }

    @Test
    void testFindById_InvalidId() {
        Long userId = 1L;

        when(userAppRepository.findById(userId)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> userAppServices.findById(userId));
        assertEquals("User with id '1' not found", exception.getMessage());
    }

    @Test
    void testDeleteById() {
        Long userId = 1L;

        userAppServices.deleteById(userId);

        verify(userAppRepository, times(1)).deleteById(userId);
    }

    @Test
    void testDeleteStaff_ValidStaff() {
        Long staffId = 1L;
        UserApp userApp = new UserApp();
        userApp.setUserRole(UserAppRole.STORE_ADMIN);

        when(userAppRepository.findById(staffId)).thenReturn(Optional.of(userApp));

        userAppServices.deleteStaff(staffId);

        verify(userAppRepository, times(1)).deleteById(staffId);
    }

    @Test
    void testDeleteStaff_SuperAdmin() {
        Long staffId = 1L;
        UserApp userApp = new UserApp();
        userApp.setUserRole(UserAppRole.SUPER_ADMIN);

        when(userAppRepository.findById(staffId)).thenReturn(Optional.of(userApp));

        Exception exception = assertThrows(RuntimeException.class, () -> userAppServices.deleteStaff(staffId));
        assertEquals("Admin cannot be deleted !", exception.getMessage());
    }

    @Test
    void testUpdateUser() {
        UserApp user = new UserApp();

        userAppServices.updateUser(user);

        verify(userAppRepository, times(1)).save(user);
    }
}