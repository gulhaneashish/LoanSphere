package com.loansphere.auth.service;

import com.loansphere.auth.dto.AuthResponse;
import com.loansphere.auth.dto.LoginRequest;
import com.loansphere.auth.dto.RegisterRequest;

public interface AuthService {

    String register(RegisterRequest request);
    AuthResponse login(LoginRequest request);

}