package com.tpms.config;

import com.tpms.model.Role;
import com.tpms.model.Account;
import com.tpms.repository.AccountRepository;
import com.tpms.repository.RoleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Set;

/**
 * Seeds the roles table at application startup if empty.
 */
@Configuration
public class DataInitializer {
    @Bean
    public ApplicationRunner initializer(RoleRepository roleRepository,
                                         AccountRepository accountRepository,
                                         PasswordEncoder passwordEncoder) {
        return args -> {
            List<String> roles = List.of("ROLE_ADMIN", "ROLE_RECRUITER", "ROLE_TRAINER", "ROLE_STUDENT");
            for (String roleName : roles) {
                roleRepository.findByName(roleName)
                              .orElseGet(() -> roleRepository.save(new Role(roleName)));
            }

            if (accountRepository.findByUsername("admin").isEmpty()) {
                Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                        .orElseThrow();
                Account admin = new Account();
                admin.setUsername("admin");
                admin.setEmail("admin@example.com");
                admin.setPassword(passwordEncoder.encode("Admin123!"));
                admin.setRoles(Set.of(adminRole));
                accountRepository.save(admin);
            }
        };
    }
}
