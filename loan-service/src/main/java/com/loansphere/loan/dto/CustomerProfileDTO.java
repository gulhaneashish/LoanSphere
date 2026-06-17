package com.loansphere.loan.dto;

import lombok.Data;

@Data
public class CustomerProfileDTO {

    private Long profileId;
    private Long userId;
    private String fullName;
    private Integer age;
    private Double salary;
    private String employmentType;
    private Integer experienceYears;
}
