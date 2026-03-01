package com.apexfit.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record SaveDietDTO(@NotBlank String dietaPlan) {}
