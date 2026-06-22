package com.loansphere.auth.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.loansphere.auth.util.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

	private final JwtUtil jwtUtil;
	private final CustomUserDetailsService userDetailsService;

	public JwtAuthenticationFilter(
	        JwtUtil jwtUtil,
	        CustomUserDetailsService userDetailsService) {

	    this.jwtUtil = jwtUtil;
	    this.userDetailsService = userDetailsService;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		String authHeader =
		        request.getHeader("Authorization");
		
		if(authHeader == null ||
				   !authHeader.startsWith("Bearer ")) {

				    filterChain.doFilter(request,response);
				    return;
				}
		String token =
		        authHeader.substring(7);
		
		try {
			String email =
			        jwtUtil.extractEmail(token);
			if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
				UserDetails userDetails =
				        userDetailsService
				        .loadUserByUsername(email);
				
				if(jwtUtil.validateToken(token, email)) {
				    UsernamePasswordAuthenticationToken authToken =
				            new UsernamePasswordAuthenticationToken(
				                    userDetails,
				                    null,
				                    userDetails.getAuthorities());

				    SecurityContextHolder.getContext()
				            .setAuthentication(authToken);
				}
			}
		} catch (Exception e) {
			// Catch any JWT-related exceptions (e.g. signature verification failed, expired, malformed, null/empty)
			// and let the request proceed. The SecurityContext remains unauthenticated,
			// so protected routes will still be blocked, but public routes can proceed.
		}
		
		filterChain.doFilter(request,response);
	}
}
