package com.loansphere.loan.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.loansphere.loan.dto.AdminDashboardResponse;
import com.loansphere.loan.entity.LoanApplication;
import com.loansphere.loan.service.LoanService;

@RestController
@RequestMapping("/api/admin/loan")
public class AdminLoanController {

    private final LoanService service;

    public AdminLoanController(
            LoanService service) {

        this.service = service;
    }
    @GetMapping("/dashboard")
    public AdminDashboardResponse
    getDashboard() {

        return service.getAdminDashboard();
    }
    @GetMapping("/pending")
    public List<LoanApplication> getPendingLoans() {
        return service.getPendingLoans();
    }
    @PutMapping("/{id}/accept")
    public LoanApplication acceptLoan(
            @PathVariable Long id) {

        return service.acceptLoan(id);
    }

    @PutMapping("/{id}/cancel")
    public LoanApplication cancelLoan(
            @PathVariable Long id) {

        return service.cancelLoan(id);
    }
}
