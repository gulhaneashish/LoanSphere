package com.loansphere.auth;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.loansphere.auth.entity.User;
import com.loansphere.auth.repository.UserRepository;
import java.time.LocalDateTime;

@SpringBootTest
class ApplicationTests {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Test
	void contextLoads() {
	}

	@Test
	void seedAdminUser() {
		if (userRepository.findByEmail("admin@loansphere.com").isEmpty()) {
			User admin = new User();
			admin.setName("Admin User");
			admin.setEmail("admin@loansphere.com");
			admin.setPassword(passwordEncoder.encode("admin123"));
			admin.setRole("ADMIN");
			admin.setCreatedAt(LocalDateTime.now());
			userRepository.save(admin);
			System.out.println("Admin user seeded successfully!");
		} else {
			System.out.println("Admin user already exists!");
		}
	}

	@Test
	void listUsers() {
		userRepository.findAll().forEach(u -> {
			System.out.println("USER: ID=" + u.getUserId() + ", Email=" + u.getEmail() + ", Name=" + u.getName() + ", Role=" + u.getRole());
		});
	}

}
