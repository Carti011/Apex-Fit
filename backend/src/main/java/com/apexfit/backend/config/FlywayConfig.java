package com.apexfit.backend.config;

import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FlywayConfig {

    @Bean
    public FlywayMigrationStrategy flywayMigrationStrategy() {
        return flyway -> {
            // Repair: Fixes checksum mismatches for existing migrations
            flyway.repair();
            // Migrate: Applies new migrations
            flyway.migrate();
        };
    }
}
