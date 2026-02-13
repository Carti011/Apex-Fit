package com.apexfit.backend.status;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/status")
public class StatusController {

    @GetMapping
    public Map<String, Object> getStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "OK");
        status.put("timestamp", LocalDateTime.now());
        status.put("service", "Apex Fit Backend");
        status.put("environment",
                System.getenv("RAILWAY_ENVIRONMENT") != null ? System.getenv("RAILWAY_ENVIRONMENT") : "local");
        return status;
    }
}
