package com.loansphere.loan.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.lang.NonNull;
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
        @CircuitBreaker(name = "userService", fallbackMethod = "applyLoanFallback")
        public LoanApplication applyLoan(
                        LoanRequest request) {
                System.out.println("UserId = " + request.getUserId());
                LoanApplication loan = new LoanApplication();

                loan.setUserId(request.getUserId());
                loan.setLoanAmount(
                                request.getLoanAmount());
                loan.setLoanTenure(
                                request.getLoanTenure());
                loan.setLoanType(
                                request.getLoanType());

                // Calculate EMI first so it can be used in eligibility and risk calculations
                Double emi = 0.0;
                if (request.getLoanAmount() != null && request.getLoanTenure() != null && request.getLoanTenure() > 0) {
                        emi = calculateEMI(request.getLoanAmount(), request.getLoanTenure());
                }
                loan.setMonthlyEmi(emi);

                // Basic Eligibility Logic
                CustomerProfileDTO profile = userServiceClient.getProfile(
                                request.getUserId());

                int score = 0;

                if (profile != null) {

                        if (profile.getSalary() != null
                                        && profile.getSalary() >= 100000)
                                score += 40;

                        if (profile.getExperienceYears() != null
                                        && profile.getExperienceYears() >= 5)
                                score += 30;

                        if (profile.getAge() != null
                                        && profile.getAge() >= 25
                                        && profile.getAge() <= 50)
                                score += 20;

                        if (profile.getEmploymentType() != null
                                        && ("PRIVATE".equalsIgnoreCase(
                                                        profile.getEmploymentType())
                                                        || "GOVERNMENT".equalsIgnoreCase(
                                                                        profile.getEmploymentType())))
                                score += 10;
                }

                // Salary & Amount Risk Adjustments
                double annualSalary = (profile != null && profile.getSalary() != null) ? profile.getSalary() : 0.0;
                double monthlySalary = annualSalary / 12.0;
                double loanAmount = request.getLoanAmount() != null ? request.getLoanAmount() : 0.0;
                double emiValue = emi != null ? emi : 0.0;

                boolean isHighRisk = false;
                boolean isMediumRisk = false;

                if (annualSalary <= 0.0) {
                        isHighRisk = true;
                } else {
                        double loanToSalaryRatio = loanAmount / annualSalary;
                        double emiToIncomeRatio = emiValue / monthlySalary;

                        if (loanToSalaryRatio > 3.0 || emiToIncomeRatio > 0.5) {
                                isHighRisk = true;
                                score = Math.max(0, score - 40); // Penalty for very high debt
                        } else if (loanToSalaryRatio > 1.5 || emiToIncomeRatio > 0.3) {
                                isMediumRisk = true;
                                score = Math.max(0, score - 20); // Penalty for medium debt
                        }
                }

                loan.setEligibilityScore(score);

                if (isHighRisk) {
                        loan.setRiskLevel("HIGH");
                } else if (isMediumRisk) {
                        loan.setRiskLevel("MEDIUM");
                } else {
                        if (score >= 80) {
                                loan.setRiskLevel("LOW");
                        } else if (score >= 60) {
                                loan.setRiskLevel("MEDIUM");
                        } else {
                                loan.setRiskLevel("HIGH");
                        }
                }

                loan.setStatus("PENDING");
                loan.setAdminAction("PENDING");
                loan.setCreatedAt(LocalDateTime.now());

                return repository.save(loan);
        }

        private Double calculateEMI(
                        Double principal,
                        Integer month) {

                double annualInterestRate = 8.5;

                double monthlyRate = annualInterestRate / 12 / 100;

                int months = month;

                double emi = (principal * monthlyRate *
                                Math.pow(1 + monthlyRate, months))
                                /
                                (Math.pow(1 + monthlyRate, months) - 1);

                return Math.round(emi * 100.0) / 100.0;
        }

        @Override
        public LoanApplication getLoan(
                        @NonNull Long applicationId) {

                return repository.findById(
                                applicationId)
                                .orElseThrow(() -> new LoanNotFoundException(
                                                "Loan Application Not Found"));
        }

        @Override
        public List<LoanApplication> getAllLoans() {

                return repository.findAll();
        }

        @Override
        public DashboardResponse getDashboard(Long userId) {

                List<LoanApplication> userLoans = repository.findByUserId(userId);

                long total = userLoans.size();

                long approved = userLoans.stream()
                                .filter(loan -> "APPROVED".equalsIgnoreCase(loan.getStatus()))
                                .count();

                long rejected = userLoans.stream()
                                .filter(loan -> "REJECTED".equalsIgnoreCase(loan.getStatus()))
                                .count();

                double amount = userLoans.stream()
                                .filter(loan -> "APPROVED".equalsIgnoreCase(loan.getStatus()))
                                .mapToDouble(LoanApplication::getLoanAmount)
                                .sum();

                return new DashboardResponse(
                                total,
                                approved,
                                rejected,
                                amount);
        }

        @Override
        public LoanApplication acceptLoan(
                        @NonNull Long id) {

                LoanApplication loan = repository.findById(id)
                                .orElseThrow(() -> new LoanNotFoundException(
                                                "Loan Not Found"));
                if ("CANCELLED".equals(loan.getAdminAction())) {
                        throw new RuntimeException(
                                        "Loan already cancelled");
                }
                loan.setAdminAction("ACCEPTED");
                loan.setStatus("APPROVED");

                return repository.save(loan);
        }

        @Override
        public LoanApplication cancelLoan(
                        @NonNull Long id) {

                LoanApplication loan = repository.findById(id)
                                .orElseThrow(() -> new LoanNotFoundException(
                                                "Loan Not Found"));
                if ("ACCEPTED".equals(loan.getAdminAction())) {
                        throw new RuntimeException(
                                        "Loan already accepted");
                }
                loan.setAdminAction("CANCELLED");
                loan.setStatus("REJECTED");

                return repository.save(loan);
        }

        @Override
        public AdminDashboardResponse getAdminDashboard() {

                long total = repository.count();

                long pending = repository.countByAdminAction(
                                "PENDING");

                long cancelled = repository.countByAdminAction(
                                "CANCELLED");

                long approved = repository.countByStatus(
                                "APPROVED");

                long rejected = repository.countByStatus(
                                "REJECTED");

                double totalLoanAmount = repository.findAll()
                                .stream()
                                .filter(loan -> "APPROVED".equalsIgnoreCase(loan.getStatus()))
                                .mapToDouble(
                                                LoanApplication::getLoanAmount)
                                .sum();

                return new AdminDashboardResponse(
                                total,
                                pending,
                                approved,
                                rejected,
                                cancelled,
                                totalLoanAmount);
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
                LoanApplication loan = new LoanApplication();

                loan.setUserId(request.getUserId());
                loan.setLoanAmount(request.getLoanAmount());
                loan.setLoanTenure(request.getLoanTenure());
                loan.setLoanType(request.getLoanType());

                loan.setStatus("PENDING");
                loan.setRiskLevel("UNKNOWN");
                loan.setAdminAction("PENDING");
                loan.setEligibilityScore(0);

                Double emi = calculateEMI(
                                request.getLoanAmount(),
                                request.getLoanTenure());

                loan.setMonthlyEmi(emi);

                loan.setCreatedAt(LocalDateTime.now());

                return repository.save(loan);
        }
}