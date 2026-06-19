package com.loansphere.user.exception;

public class ProfileAlreadyExitException  
extends RuntimeException {

    public ProfileAlreadyExitException(
            String message) {

        super(message);
    }
}
