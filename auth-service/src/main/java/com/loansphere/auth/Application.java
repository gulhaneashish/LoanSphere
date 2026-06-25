package com.loansphere.auth;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.loansphere.auth.entity.User;
import com.loansphere.auth.repository.UserRepository;
import java.time.LocalDateTime;

@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Bean
	public CommandLineRunner seedData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (userRepository.findByEmail("admin@loansphere.com").isEmpty()) {
				User admin = new User();
				admin.setName("Admin User");
				admin.setEmail("admin@loansphere.com");
				admin.setPassword(passwordEncoder.encode("admin123"));
				admin.setRole("ADMIN");
				admin.setCreatedAt(LocalDateTime.now());
				userRepository.save(admin);
				System.out.println("Admin user seeded successfully on startup!");
			} else {
				System.out.println("Admin user already exists.");
			}
		};
	}

}
