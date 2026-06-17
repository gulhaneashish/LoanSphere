package com.loansphere.user.dto;

import lombok.Data;

@Data
public class ProfileRequest {

    private Long userId;
    private String fullName;
    private Integer age;
    private Double salary;
    private String employmentType;
    private Integer experienceYears;
    private String panNumber;
    private String aadhaarNumber;
    private String mobileNumber;
}