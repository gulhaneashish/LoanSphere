package com.loansphere.user.service;



import java.util.Optional;

import org.springframework.stereotype.Service;

import com.loansphere.user.dto.ProfileRequest;
import com.loansphere.user.entity.CustomerProfile;
import com.loansphere.user.exception.ProfileAlreadyExitException;
import com.loansphere.user.exception.ProfileNotFoundException;
import com.loansphere.user.repository.CustomerProfileRepository;

@Service
public class CustomerProfileServiceImpl
        implements CustomerProfileService {

    private final CustomerProfileRepository repository;

    public CustomerProfileServiceImpl(
            CustomerProfileRepository repository) {

        this.repository = repository;
    }

    @Override
    public String createProfile(ProfileRequest request) {

        Optional<CustomerProfile> existingProfileOpt =
                repository.findByUserId(request.getUserId());

        CustomerProfile profile;
        if (existingProfileOpt.isPresent()) {
            profile = existingProfileOpt.get();
        } else {
            profile = new CustomerProfile();
            profile.setUserId(request.getUserId());
        }

        profile.setFullName(request.getFullName());
        profile.setAge(request.getAge());
        profile.setSalary(request.getSalary());
        profile.setEmploymentType(
                request.getEmploymentType());
        profile.setExperienceYears(
                request.getExperienceYears());
        profile.setPanNumber(
                request.getPanNumber());
        profile.setAadhaarNumber(
                request.getAadhaarNumber());
        profile.setMobileNumber(
                request.getMobileNumber());

        repository.save(profile);

        return existingProfileOpt.isPresent() ? "Profile Updated Successfully" : "Profile Created Successfully";
    }

    @Override
    public CustomerProfile getProfile(Long userId) {

        return repository.findByUserId(userId)
                .orElseThrow(() ->
                        new ProfileNotFoundException(
                                "Profile Not Found"));
    }
}