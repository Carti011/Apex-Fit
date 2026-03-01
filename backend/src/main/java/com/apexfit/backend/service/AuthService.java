package com.apexfit.backend.service;

import com.apexfit.backend.dto.RegisterDTO;
import com.apexfit.backend.exception.EmailAlreadyExistsException;
import com.apexfit.backend.exception.UserNotFoundException;
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
        String email = data.email() != null ? data.email().toLowerCase() : null;

        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("Email já cadastrado");
        }

        User newUser = new User(
                data.name(),
                email,
                passwordEncoder.encode(data.password()));

        return userRepository.save(newUser);
    }

    public AuthResponseDTO login(LoginDTO data) {
        String email = data.email() != null ? data.email().toLowerCase() : null;

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, data.password()));

        String token = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));

        return new AuthResponseDTO(token, user.getName(), user.getEmail());
    }
}
