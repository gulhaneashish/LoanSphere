package com.loansphere.loan.entity;



import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "loan_application")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoanApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long applicationId;

    private Long userId;

    private Double loanAmount;

    private Integer loanTenure;

    private String loanType;

    private String status;

    private String riskLevel;

    private Integer eligibilityScore;
    
    private Double monthlyEmi;
   
    private String adminAction;

    private LocalDateTime createdAt;
}