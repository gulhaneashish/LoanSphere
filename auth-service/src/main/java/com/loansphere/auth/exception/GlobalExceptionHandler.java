package com.loansphere.auth.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(
    		UserNotFoundException.class)
    public ResponseEntity<String>
    handleLoanNotFound(
    		UserNotFoundException ex) {

        return new ResponseEntity<>(
                ex.getMessage(),
                HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(
            EmailAlreadyExistsException.class)
    public ResponseEntity<String>
    handleEmailExists(
            EmailAlreadyExistsException ex) {

        return new ResponseEntity<>(
                ex.getMessage(),
                HttpStatus.CONFLICT);
    }

    @ExceptionHandler(
            InvalidPasswordException.class)
    public ResponseEntity<String>
    handleInvalidPassword(
            InvalidPasswordException ex) {

        return new ResponseEntity<>(
                ex.getMessage(),
                HttpStatus.UNAUTHORIZED);
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
