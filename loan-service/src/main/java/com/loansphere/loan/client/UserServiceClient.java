package com.loansphere.loan.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.loansphere.loan.dto.CustomerProfileDTO;


@FeignClient(name = "USER-SERVICE")
public interface UserServiceClient {

    @GetMapping("/api/profile/user/{userId}")
    CustomerProfileDTO getProfile(
            @PathVariable Long userId);
}
