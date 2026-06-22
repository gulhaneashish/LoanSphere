package com.loansphere.user.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.loansphere.user.dto.ProfileRequest;
import com.loansphere.user.entity.CustomerProfile;
import com.loansphere.user.service.CustomerProfileService;

@RestController
@RequestMapping("/api/profile")
public class CustomerProfileController {

    private final CustomerProfileService service;

    public CustomerProfileController(
            CustomerProfileService service) {

        this.service = service;
    }

    @PostMapping
    public ResponseEntity<String> createProfile(
            @RequestBody ProfileRequest request) {

        return ResponseEntity.ok(
                service.createProfile(request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<CustomerProfile>
            getProfile(@PathVariable Long userId) {

        return ResponseEntity.ok(
                service.getProfile(userId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<CustomerProfile>> getAllProfiles() {
        return ResponseEntity.ok(service.getAllProfiles());
    }
}
