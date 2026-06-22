package com.loansphere.loan.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import com.loansphere.loan.client.UserServiceClient;
import com.loansphere.loan.dto.AdminDashboardResponse;
import com.loansphere.loan.dto.CustomerProfileDTO;
import com.loansphere.loan.dto.DashboardResponse;
import com.loansphere.loan.dto.LoanRequest;
import com.loansphere.loan.entity.LoanApplication;
import com.loansphere.loan.exception.LoanNotFoundException;
import com.loansphere.loan.repository.LoanApplicationRepository;

@Service
public class LoanServiceImpl
        implements LoanService {

    private final LoanApplicationRepository repository;

    private final UserServiceClient userServiceClient;

    public LoanServiceImpl(
            LoanApplicationRepository repository,
            UserServiceClient userServiceClient) {

        this.repository = repository;
        this.userServiceClient = userServiceClient;
    }

    @Override
    @CircuitBreaker(
            name = "userService",
            fallbackMethod = "applyLoanFallback")
    public LoanApplication applyLoan(
            LoanRequest request) {
    	 System.out.println("UserId = " + request.getUserId());
        LoanApplication loan =
                new LoanApplication();

        loan.setUserId(request.getUserId());
        loan.setLoanAmount(
                request.getLoanAmount());
        loan.setLoanTenure(
                request.getLoanTenure());
        loan.setLoanType(
                request.getLoanType());

        // Basic Eligibility Logic

        CustomerProfileDTO profile =
                userServiceClient.getProfile(
                        request.getUserId());

        int score = 0;

        if(profile != null) {

            if(profile.getSalary() != null
                    && profile.getSalary() >= 100000)
                score += 40;

            if(profile.getExperienceYears() != null
                    && profile.getExperienceYears() >= 5)
                score += 30;

            if(profile.getAge() != null
                    && profile.getAge() >= 25
                    && profile.getAge() <= 50)
                score += 20;

            if(profile.getEmploymentType() != null
                    && ("PRIVATE".equalsIgnoreCase(
                            profile.getEmploymentType())
                    || "GOVERNMENT".equalsIgnoreCase(
                            profile.getEmploymentType())))
                score += 10;
        }
        loan.setEligibilityScore(score);

        if(score >= 80) {

            loan.setRiskLevel("LOW");
            loan.setStatus("APPROVED");

        }
        else if(score >= 60) {

            loan.setRiskLevel("MEDIUM");
            loan.setStatus("APPROVED");

        }
        else {

            loan.setRiskLevel("HIGH");
            loan.setStatus("REJECTED");
        }
        loan.setAdminAction("PENDING");
        Double emi =
                calculateEMI(
                        request.getLoanAmount(),
                        request.getLoanTenure());

        loan.setMonthlyEmi(emi);

        loan.setCreatedAt(LocalDateTime.now());

        return repository.save(loan);
    }
    private Double calculateEMI(
            Double principal,
            Integer years) {

        double annualInterestRate = 8.5;

        double monthlyRate =
                annualInterestRate / 12 / 100;

        int months = years * 12;

        double emi =
                (principal * monthlyRate *
                        Math.pow(1 + monthlyRate, months))
                        /
                        (Math.pow(1 + monthlyRate, months) - 1);

        return Math.round(emi * 100.0) / 100.0;
    }

    @Override
    public LoanApplication getLoan(
            Long applicationId) {

        return repository.findById(
                applicationId)
                .orElseThrow(() ->
                        new LoanNotFoundException(
                                "Loan Application Not Found"));
    }
    @Override
    public List<LoanApplication> getAllLoans() {

        return repository.findAll();
    }
    
    @Override
    public DashboardResponse getDashboard() {

        long total =
                repository.count();

        long approved =
                repository.countByStatus(
                        "APPROVED");

        long rejected =
                repository.countByStatus(
                        "REJECTED");

        double amount =
                repository.findAll()
                        .stream()
                        .mapToDouble(
                                LoanApplication
                                        ::getLoanAmount)
                        .sum();

        return new DashboardResponse(
                total,
                approved,
                rejected,
                amount);
    }
    
    @Override
    public LoanApplication acceptLoan(
            Long id) {

        LoanApplication loan =
                repository.findById(id)
                        .orElseThrow(() ->
                                new LoanNotFoundException(
                                        "Loan Not Found"));
        if("CANCELLED".equals(loan.getAdminAction())) {
            throw new RuntimeException(
                    "Loan already cancelled");
        }
        loan.setAdminAction("ACCEPTED");

        return repository.save(loan);
    }
    
    @Override
    public LoanApplication cancelLoan(
            Long id) {

        LoanApplication loan =
                repository.findById(id)
                        .orElseThrow(() ->
                                new LoanNotFoundException(
                                        "Loan Not Found"));
        if("ACCEPTED".equals(loan.getAdminAction())) {
            throw new RuntimeException(
                    "Loan already accepted");
        }
        loan.setAdminAction("CANCELLED");

        return repository.save(loan);
    }
    @Override
    public AdminDashboardResponse
    getAdminDashboard() {

        long total =
                repository.count();

        long pending =
                repository.countByAdminAction(
                        "PENDING");

        long cancelled =
                repository.countByAdminAction(
                        "CANCELLED");

        long approved =
                repository.countByStatus(
                        "APPROVED");

        long rejected =
                repository.countByStatus(
                        "REJECTED");

        return new AdminDashboardResponse(
                total,
                pending,
                approved,
                rejected,
                cancelled);
    }
    @Override
    public List<LoanApplication> getPendingLoans() {

        return repository.findByAdminAction(
                "PENDING");
    }
    public LoanApplication applyLoanFallback(
            LoanRequest request,
            Exception ex) {
    	 System.out.println(
    	            "Fallback Triggered : "
    	            + ex.getMessage());
        LoanApplication loan =
                new LoanApplication();

        loan.setUserId(request.getUserId());
        loan.setLoanAmount(request.getLoanAmount());
        loan.setLoanTenure(request.getLoanTenure());
        loan.setLoanType(request.getLoanType());

        loan.setStatus("UNKNOWN");
        loan.setRiskLevel("UNKNOWN");
        loan.setAdminAction("PENDING");
        loan.setEligibilityScore(0);

        Double emi =
                calculateEMI(
                        request.getLoanAmount(),
                        request.getLoanTenure());

        loan.setMonthlyEmi(emi);

        loan.setCreatedAt(LocalDateTime.now());

        return repository.save(loan);
    }
}