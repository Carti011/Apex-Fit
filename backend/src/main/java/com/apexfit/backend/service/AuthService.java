package com.apexfit.backend.service;

import com.apexfit.backend.dto.RegisterDTO;
import com.apexfit.backend.exception.EmailAlreadyExistsException;
import com.apexfit.backend.model.User;
import com.apexfit.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.apexfit.backend.dto.LoginDTO;
import com.apexfit.backend.dto.AuthResponseDTO;
import com.apexfit.backend.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
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

    public AuthResponseDTO login(LoginDTO data) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(data.email(), data.password()));

        String token = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(data.email())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new AuthResponseDTO(token, user.getName(), user.getEmail());
    }
}
