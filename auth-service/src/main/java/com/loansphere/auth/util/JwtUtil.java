package com.loansphere.auth.util;

import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private static final String SECRET =
            "mySecretKeyForLoanSphereProject123456789";

    public String generateToken(String email) {

        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(
                        new Date(System.currentTimeMillis()
                                + 1000 * 60 * 60))
                .signWith(
                        Keys.hmacShaKeyFor(
                                SECRET.getBytes()),
                        Jwts.SIG.HS256)
                .compact();
    }
    
    public String extractEmail(String token) {

        return Jwts.parser()
                .verifyWith(
                        Keys.hmacShaKeyFor(
                                SECRET.getBytes()))
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }
    
    public boolean validateToken(String token,
            String email) {

String extractedEmail =
extractEmail(token);

return extractedEmail.equals(email);
}
    
    
}
