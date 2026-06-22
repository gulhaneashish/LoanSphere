package com.loansphere.loan.exception;

public class LoanAlreadyCancelledExeception extends RuntimeException {

public LoanAlreadyCancelledExeception(
    String message) {

super(message);
}
}
