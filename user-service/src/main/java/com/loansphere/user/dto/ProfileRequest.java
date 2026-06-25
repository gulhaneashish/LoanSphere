package com.loansphere.user.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ProfileRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 100, message = "Age must not exceed 100")
    private Integer age;

    @NotNull(message = "Salary is required")
    @DecimalMin(value = "0.0", message = "Salary cannot be negative")
    private Double salary;

    private String employmentType;

    @Min(value = 0, message = "Experience years cannot be negative")
    private Integer experienceYears;

    @Pattern(regexp = "^$|^[A-Z]{5}[0-9]{4}[A-Z]$", message = "Invalid PAN card number format (e.g. ABCDE1234F)")
    private String panNumber;

    @Pattern(regexp = "^$|^\\d{12}$", message = "Aadhaar card number must be exactly 12 digits")
    private String aadhaarNumber;

    @Pattern(regexp = "^$|^\\d{10}$", message = "Mobile number must be exactly 10 digits")
    private String mobileNumber;
}