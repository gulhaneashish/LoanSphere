package com.loansphere.loan.dto;

import lombok.Data;

@Data
public class LoanRequest {

    private Long userId;

    private Double loanAmount;

    private Integer loanTenure;

    private String loanType;
}