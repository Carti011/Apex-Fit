package com.apexfit.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.apexfit.backend.dto.AuthResponseDTO;
import com.apexfit.backend.dto.LoginDTO;
import com.apexfit.backend.dto.RegisterDTO;
import com.apexfit.backend.model.User;
import com.apexfit.backend.repository.UserRepository;
import com.apexfit.backend.security.JwtTokenProvider;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthService authService;

    private RegisterDTO registerDTO;
    private LoginDTO loginDTO;
    private User user;

    @BeforeEach
    void setUp() {
        registerDTO = new RegisterDTO("Test User", "test@example.com", "password", "password");
        loginDTO = new LoginDTO("test@example.com", "password");
        user = new User("Test User", "test@example.com", "encodedPassword");
    }

    @Test
    void shouldRegisterUserSuccessfully() {
        when(userRepository.existsByEmail(registerDTO.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(registerDTO.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        User createdUser = authService.register(registerDTO);

        assertNotNull(createdUser);
        assertEquals("Test User", createdUser.getName());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void shouldLoginSuccessfully() {
        Authentication authentication = org.mockito.Mockito.mock(Authentication.class);
        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(jwtTokenProvider.generateToken(authentication)).thenReturn("jwt-token");
        when(userRepository.findByEmail(loginDTO.email())).thenReturn(Optional.of(user));

        AuthResponseDTO response = authService.login(loginDTO);

        assertNotNull(response);
        assertEquals("jwt-token", response.token());
        assertEquals("Test User", response.name());
    }
}
