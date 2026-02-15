package com.apexfit.backend.controller;

import com.apexfit.backend.dto.RegisterDTO;
import com.apexfit.backend.model.User;
import com.apexfit.backend.service.AuthService;
import com.apexfit.backend.exception.EmailAlreadyExistsException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    @Test
    @DisplayName("Deve registrar usuário com sucesso (201 Created)")
    void shouldRegisterUserSuccessfully() {
        RegisterDTO dto = new RegisterDTO("Teste Unit", "unit@teste.com", "123456");
        User mockUser = new User("Teste Unit", "unit@teste.com", "hash");
        mockUser.setId(1L);

        when(authService.register(any(RegisterDTO.class))).thenReturn(mockUser);

        ResponseEntity<User> response = authController.register(dto);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("unit@teste.com", response.getBody().getEmail());
    }

    @Test
    @DisplayName("Deve lançar exceção quando email já existe")
    void shouldThrowExceptionForDuplicateEmail() {
        RegisterDTO dto = new RegisterDTO("Clone", "exists@teste.com", "123456");

        when(authService.register(any(RegisterDTO.class)))
                .thenThrow(new EmailAlreadyExistsException("Email já cadastrado"));

        assertThrows(EmailAlreadyExistsException.class, () -> authController.register(dto));
    }
}
