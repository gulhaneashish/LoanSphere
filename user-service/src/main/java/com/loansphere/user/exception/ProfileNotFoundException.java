package com.loansphere.user.exception;

public class ProfileNotFoundException
extends RuntimeException {

public ProfileNotFoundException(
    String message) {

super(message);
}
}
