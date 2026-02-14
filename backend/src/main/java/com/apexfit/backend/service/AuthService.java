package com.apexfit.backend.service;

import com.apexfit.backend.dto.RegisterDTO;
import com.apexfit.backend.model.User;
import com.apexfit.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.apexfit.backend.exception.EmailAlreadyExistsException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(RegisterDTO data) {
        if (userRepository.existsByEmail(data.email())) {
            throw new EmailAlreadyExistsException("Email já cadastrado");
        }

        String passwordHash = passwordEncoder.encode(data.password());
        User newUser = new User(data.fullName(), data.email(), passwordHash);

        return userRepository.save(newUser);
    }
}
