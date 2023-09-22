package com.cpl.jumpstart.services;

import com.cpl.jumpstart.Exception.EmailAlreadyExistException;
import com.cpl.jumpstart.entity.Outlet;
import com.cpl.jumpstart.entity.Token;
import com.cpl.jumpstart.entity.UserApp;
import com.cpl.jumpstart.entity.constraint.UserAppRole;
import com.cpl.jumpstart.repositories.TokenRepository;
import com.cpl.jumpstart.repositories.UserAppRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UserAppServices implements UserDetailsService {

    @Autowired
    private UserAppRepository userAppRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;





    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserApp userApp = userAppRepository.findByEmail(email)
                .orElseThrow( () -> new UsernameNotFoundException(String.format("User with email %s not found", email)));
        return new User(userApp.getUsername(), userApp.getPassword(), userApp.getAuthorities());
    }


    public UserApp findUserByEmail(String email) throws UsernameNotFoundException {
        return userAppRepository.findByEmail(email)
                .orElseThrow( () -> new UsernameNotFoundException(String.format("User with email %s not found", email)));
    }


    public UserApp save(UserApp user) {

        // Cek Apakah User Email Is Exist ?
        boolean userExist = userAppRepository.findByEmail(user.getEmail()).isPresent();
        if (userExist) {
            throw new EmailAlreadyExistException(user.getEmail());
        }

        // HASH PASSWORD
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        return userAppRepository.save(user);
    }


    public UserApp getCurrentUser() {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("currentuser: " + currentUserEmail);
        return userAppRepository.findByEmail(currentUserEmail).orElseThrow(()-> new UsernameNotFoundException("current user not found"));
    }

    public UserApp findById(Long userAppID){
        return userAppRepository.findById(userAppID).orElseThrow(() ->
                new RuntimeException(String.format("User with id '%s' not found", userAppID))
        );
    }




}
