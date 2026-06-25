package com.loansphere.loan.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LoanRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Loan amount is required")
    @DecimalMin(value = "1000.0", message = "Minimum loan amount must be 1,000")
    private Double loanAmount;

    @NotNull(message = "Loan tenure is required")
    @Min(value = 1, message = "Minimum tenure is 1 month")
    private Integer loanTenure;

    @NotBlank(message = "Loan type is required")
    private String loanType;
}