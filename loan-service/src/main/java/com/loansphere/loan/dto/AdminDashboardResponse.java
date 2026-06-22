package com.loansphere.loan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminDashboardResponse {

    private Long totalLoans;
    private Long pendingLoans;
    private Long approvedLoans;
    private Long rejectedLoans;
    private Long cancelledLoans;
}