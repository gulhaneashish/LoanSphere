package com.loansphere.loan.service;

import java.util.List;

import org.springframework.lang.NonNull;

import com.loansphere.loan.dto.AdminDashboardResponse;
import com.loansphere.loan.dto.DashboardResponse;
import com.loansphere.loan.dto.LoanRequest;
import com.loansphere.loan.entity.LoanApplication;

public interface LoanService {

        LoanApplication applyLoan(
                        LoanRequest request);

        LoanApplication getLoan(
                        @NonNull Long applicationId);

        List<LoanApplication> getAllLoans();

        DashboardResponse getDashboard(Long userId);

        LoanApplication acceptLoan(@NonNull Long id);

        LoanApplication cancelLoan(@NonNull Long id);

        AdminDashboardResponse getAdminDashboard();

        List<LoanApplication> getPendingLoans();
}