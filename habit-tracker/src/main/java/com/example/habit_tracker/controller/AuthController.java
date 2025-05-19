package com.example.habit_tracker.controller;

import com.example.habit_tracker.model.ApiResponse;
import com.example.habit_tracker.model.User;
import com.example.habit_tracker.repository.UserRepository;
import com.example.habit_tracker.security.JwtUtil;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${env}")
    private String environment;


    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user) {
        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body(new ApiResponse("Username already taken.", null));
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");  // Default role

        if (isDevEnvironment()) {
            user.setRole("DEV");
        }

        userRepository.save(user);
        return ResponseEntity.ok(new ApiResponse("User registered successfully.", null));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody User user) {
        Optional<User> optionalUser = userRepository.findByUsername(user.getUsername());
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(404).body(new ApiResponse("User not found.", null));
        }
        
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(new ApiResponse("Invalid credentials.", null));
        }


        User dbUser = optionalUser.get();

        // ✅ Generate token with username + role
        String token = jwtUtil.generateToken(dbUser.getUsername(), dbUser.getRole());

        return ResponseEntity.ok(Map.of("token", token));
    }

    @PreAuthorize("hasAuthority('DEV')")
    @GetMapping("/all-users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // Optional: Define a method to check if you're in the dev environment (for role assignment)
    private boolean isDevEnvironment() {
        return "dev".equalsIgnoreCase(environment);
    }

}
