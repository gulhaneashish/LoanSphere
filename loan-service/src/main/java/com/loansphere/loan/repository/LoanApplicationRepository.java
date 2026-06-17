package com.loansphere.loan.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.loansphere.loan.entity.LoanApplication;

@Repository
public interface LoanApplicationRepository
        extends JpaRepository<LoanApplication, Long> {
	long countByStatus(String status);
}
