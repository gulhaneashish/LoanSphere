package com.loansphere.loan.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .findFirst()
                .orElse("Validation error");
        return new ResponseEntity<>(
                errorMessage,
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(
            LoanNotFoundException.class)
    public ResponseEntity<String>
    handleLoanNotFound(
            LoanNotFoundException ex) {

        return new ResponseEntity<>(
                ex.getMessage(),
                HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(
    		LoanAlreadyAcceptedExeception.class)
    public ResponseEntity<String>
    handleLoanNotFound(
    		LoanAlreadyAcceptedExeception ex) {

        return new ResponseEntity<>(
                ex.getMessage(),
                HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(
    		LoanAlreadyCancelledExeception.class)
    public ResponseEntity<String>
    handleLoanNotFound(
    		LoanAlreadyCancelledExeception ex) {

        return new ResponseEntity<>(
                ex.getMessage(),
                HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(
            Exception.class)
    public ResponseEntity<String>
    handleException(
            Exception ex) {

        return new ResponseEntity<>(
                ex.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
