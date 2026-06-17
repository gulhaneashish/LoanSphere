package com.loansphere.user.service;

import com.loansphere.user.dto.ProfileRequest;
import com.loansphere.user.entity.CustomerProfile;

public interface CustomerProfileService {
	
	String createProfile(ProfileRequest request);
    CustomerProfile getProfile(Long userId);
}
