package com.loansphere.loan.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.loansphere.loan.dto.DashboardResponse;
import com.loansphere.loan.dto.LoanRequest;
import com.loansphere.loan.entity.LoanApplication;
import com.loansphere.loan.service.LoanService;

@RestController
@RequestMapping("/api/loan")
public class LoanController {

    private final LoanService service;

    public LoanController(
            LoanService service) {

        this.service = service;
    }

    @PostMapping("/apply")
    public ResponseEntity<LoanApplication> applyLoan(
            @RequestBody LoanRequest request) {

        return ResponseEntity.ok(
                service.applyLoan(request));
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<LoanApplication> getLoan(
            @PathVariable Long applicationId) {

        return ResponseEntity.ok(
                service.getLoan(applicationId));
    }

    @GetMapping
    public ResponseEntity<List<LoanApplication>> getAllLoans() {

        return ResponseEntity.ok(
                service.getAllLoans());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard(@RequestParam Long userId) {

        return ResponseEntity.ok(
                service.getDashboard(userId));
    }
}
