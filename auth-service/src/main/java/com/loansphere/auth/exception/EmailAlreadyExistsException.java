package com.loansphere.auth.exception;

public class EmailAlreadyExistsException
extends RuntimeException {

public EmailAlreadyExistsException(
    String message) {

super(message);
}
}
