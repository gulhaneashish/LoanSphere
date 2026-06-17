package com.loansphere.loan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardResponse {

    private Long totalApplications;

    private Long approvedLoans;

    private Long rejectedLoans;

    private Double totalLoanAmount;
}
