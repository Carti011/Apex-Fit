package com.apexfit.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/status")
public class StatusController {

    @GetMapping
    public ResponseEntity<Map<String, String>> status() {
        return ResponseEntity.ok(Map.of("status", "online", "message", "Apex Fit Backend is running!"));
    }
}
