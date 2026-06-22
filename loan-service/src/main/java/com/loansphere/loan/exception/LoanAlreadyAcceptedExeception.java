package com.loansphere.loan.exception;

public class LoanAlreadyAcceptedExeception extends RuntimeException {

public LoanAlreadyAcceptedExeception(
    String message) {

super(message);
}

}
