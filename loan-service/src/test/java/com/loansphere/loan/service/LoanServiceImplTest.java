package com.loansphere.loan.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.loansphere.loan.client.UserServiceClient;
import com.loansphere.loan.dto.CustomerProfileDTO;
import com.loansphere.loan.dto.LoanRequest;
import com.loansphere.loan.entity.LoanApplication;
import com.loansphere.loan.exception.ProfileNotUpdatedException;
import com.loansphere.loan.repository.LoanApplicationRepository;

import feign.FeignException;
import feign.Request;
import feign.RequestTemplate;

import java.util.HashMap;

public class LoanServiceImplTest {

    private LoanApplicationRepository repository;
    private UserServiceClient userServiceClient;
    private LoanServiceImpl loanService;

    @BeforeEach
    public void setUp() {
        repository = mock(LoanApplicationRepository.class);
        userServiceClient = mock(UserServiceClient.class);
        loanService = new LoanServiceImpl(repository, userServiceClient);
    }

    @Test
    public void testApplyLoan_ProfileNotFound_ThrowsProfileNotUpdatedException() {
        // Arrange
        LoanRequest request = new LoanRequest();
        request.setUserId(1L);
        request.setLoanAmount(50000.0);
        request.setLoanTenure(12);
        request.setLoanType("PERSONAL_LOAN");

        Request feignRequest = Request.create(Request.HttpMethod.GET, "/api/profile/user/1", new HashMap<>(), null, new RequestTemplate());
        FeignException.NotFound notFoundEx = new FeignException.NotFound("Profile Not Found", feignRequest, null, null);

        when(userServiceClient.getProfile(1L)).thenThrow(notFoundEx);

        // Act & Assert
        ProfileNotUpdatedException exception = assertThrows(ProfileNotUpdatedException.class, () -> {
            loanService.applyLoan(request);
        });

        assertEquals("Please add your profile details first", exception.getMessage());
    }

    @Test
    public void testApplyLoan_ProfileExists_Succeeds() {
        // Arrange
        LoanRequest request = new LoanRequest();
        request.setUserId(1L);
        request.setLoanAmount(50000.0);
        request.setLoanTenure(12);
        request.setLoanType("PERSONAL_LOAN");

        CustomerProfileDTO profile = new CustomerProfileDTO();
        profile.setUserId(1L);
        profile.setFullName("John Doe");
        profile.setAge(30);
        profile.setSalary(150000.0);
        profile.setEmploymentType("PRIVATE");
        profile.setExperienceYears(5);

        when(userServiceClient.getProfile(1L)).thenReturn(profile);
        
        LoanApplication savedLoan = new LoanApplication();
        savedLoan.setUserId(1L);
        savedLoan.setStatus("PENDING");
        when(repository.save(any(LoanApplication.class))).thenReturn(savedLoan);

        // Act
        LoanApplication result = loanService.applyLoan(request);

        // Assert
        assertEquals("PENDING", result.getStatus());
    }
}
