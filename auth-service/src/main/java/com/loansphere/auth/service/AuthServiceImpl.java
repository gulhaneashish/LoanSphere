package com.loansphere.auth.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.loansphere.auth.dto.AuthResponse;
import com.loansphere.auth.dto.LoginRequest;
import com.loansphere.auth.dto.RegisterRequest;
import com.loansphere.auth.entity.User;
import com.loansphere.auth.exception.EmailAlreadyExistsException;
import com.loansphere.auth.exception.InvalidPasswordException;
import com.loansphere.auth.exception.UserNotFoundException;
import com.loansphere.auth.repository.UserRepository;
import com.loansphere.auth.util.JwtUtil;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public String register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(request.getPassword()));

        user.setRole("CUSTOMER");

        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        return "User Registered Successfully";
    }
    
    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(
                request.getEmail())
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new InvalidPasswordException("Invalid Password");
        }
        String token =
                jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token);
    }

    @Override
    public com.loansphere.auth.dto.UserResponse getUserDetailsByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        return new com.loansphere.auth.dto.UserResponse(user.getUserId(), user.getName(), user.getEmail());
    }
}