package com.coffeeflow.controller;

import com.coffeeflow.entity.User;
import com.coffeeflow.payload.request.LoginRequest;
import com.coffeeflow.payload.response.JwtResponse;
import com.coffeeflow.payload.response.MessageResponse;
import com.coffeeflow.repository.UserRepository;
import com.coffeeflow.security.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    AuthenticationManager authenticationManager;
    
    @Autowired
    UserRepository userRepository;
    
    @Autowired
    PasswordEncoder encoder;
    
    @Autowired
    JwtUtils jwtUtils;
    
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(), 
                        loginRequest.getPassword()));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        User userDetails = (User) authentication.getPrincipal();
        
        // Update last login time
        userDetails.setLastLogin(LocalDateTime.now());
        userRepository.save(userDetails);
        
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getName(),
                userDetails.getRole().toString().toLowerCase(),
                roles));
    }
    
    @PostMapping("/signout")
    public ResponseEntity<?> logoutUser() {
        return ResponseEntity.ok(new MessageResponse("User signed out successfully!"));
    }
}
