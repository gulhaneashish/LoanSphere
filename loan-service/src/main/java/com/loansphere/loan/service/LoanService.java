package com.loansphere.loan.service;

import java.util.List;

import com.loansphere.loan.dto.DashboardResponse;
import com.loansphere.loan.dto.LoanRequest;
import com.loansphere.loan.entity.LoanApplication;

public interface LoanService {

    LoanApplication applyLoan(
            LoanRequest request);

    LoanApplication getLoan(
            Long applicationId);
    
    List<LoanApplication> getAllLoans();
    DashboardResponse getDashboard();
}