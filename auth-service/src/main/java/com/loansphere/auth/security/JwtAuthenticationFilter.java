package com.loansphere.auth.security;

import java.io.IOException;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.loansphere.auth.util.JwtUtil;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

	private final JwtUtil jwtUtil;
	private final CustomUserDetailsService userDetailsService;
	private static final Logger logger =
	        LoggerFactory.getLogger(JwtAuthenticationFilter.class);

	public JwtAuthenticationFilter(
	        JwtUtil jwtUtil,
	        CustomUserDetailsService userDetailsService) {

	    this.jwtUtil = jwtUtil;
	    this.userDetailsService = userDetailsService;
	}

	@Override
	protected void doFilterInternal(
			@NonNull HttpServletRequest request,
			@NonNull HttpServletResponse response,
			@NonNull FilterChain filterChain)
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
		} catch (ExpiredJwtException e) {
		    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		    response.getWriter().write("JWT Token Expired");
		    return;
		}

		catch (MalformedJwtException e) {
		    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		    response.getWriter().write("Invalid JWT Token");
		    return;
		}

		catch (UsernameNotFoundException e) {
		    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		    response.getWriter().write("User Not Found");
		    return;
		}

		catch (Exception e) {
		    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		    response.getWriter().write("Authentication Failed");
		    return;
		}
		
		filterChain.doFilter(request,response);
	}
}
