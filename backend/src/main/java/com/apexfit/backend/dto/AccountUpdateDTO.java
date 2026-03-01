package com.apexfit.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AccountUpdateDTO(
        @NotBlank(message = "O nome não pode estar vazio") String name,
        String currentPassword,
        @Size(min = 6, message = "A nova senha deve ter no mínimo 6 caracteres") String newPassword
) {}
