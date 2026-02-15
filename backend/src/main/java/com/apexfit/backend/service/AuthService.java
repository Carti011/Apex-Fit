package com.apexfit.backend.service;

import com.apexfit.backend.dto.RegisterDTO;
import com.apexfit.backend.exception.EmailAlreadyExistsException;
import com.apexfit.backend.model.User;
import com.apexfit.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(RegisterDTO data) {
        if (userRepository.existsByEmail(data.getEmail())) {
            throw new EmailAlreadyExistsException("Email já cadastrado");
        }

        User newUser = new User(
                data.getName(),
                data.getEmail(),
                passwordEncoder.encode(data.getPassword()));

        return userRepository.save(newUser);
    }
}
