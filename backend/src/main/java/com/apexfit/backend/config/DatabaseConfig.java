package com.apexfit.backend.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class DatabaseConfig {

    @Value("${DATABASE_URL:#{null}}")
    private String databaseUrl;

    @Value("${spring.datasource.username:apexuser}")
    private String username;

    @Value("${spring.datasource.password:apexpassword}")
    private String password;

    @Value("${spring.datasource.url:#{null}}")
    private String localUrl;

    @Bean
    public DataSource dataSource() throws URISyntaxException {
        HikariConfig config = new HikariConfig();

        // Tenta pegar DATABASE_URL do ambiente primeiro
        String envDbUrl = System.getenv("DATABASE_URL");
        if (envDbUrl != null && !envDbUrl.isBlank()) {
            databaseUrl = envDbUrl;
        }

        // Se não tem DATABASE_URL, tenta montar usando PGHOST (Railway/Neon decomposed)
        if (databaseUrl == null || databaseUrl.isBlank()) {
            String pgHost = System.getenv("PGHOST");
            if (pgHost != null && !pgHost.isBlank()) {
                String pgPort = System.getenv("PGPORT");
                String pgUser = System.getenv("PGUSER");
                String pgPass = System.getenv("PGPASSWORD");
                String pgDb = System.getenv("PGDATABASE");

                // Default port 5432 for Cloud/Neon if missing
                if (pgPort == null || pgPort.isBlank()) {
                    pgPort = "5432";
                }

                // Monta a URL JDBC manualmente
                databaseUrl = String.format("jdbc:postgresql://%s:%s/%s", pgHost, pgPort, pgDb);

                // Configura user/pass
                if (pgUser != null)
                    config.setUsername(pgUser);
                if (pgPass != null)
                    config.setPassword(pgPass);

                System.out.println("Using Decomposed Env Vars (PGHOST) for Database Connection");
            }
        }

        if (databaseUrl != null && !databaseUrl.isBlank()) {
            // Lógica para Railway: Converte postgres:// para jdbc:postgresql://
            String jdbcUrl = databaseUrl;
            if (databaseUrl.startsWith("postgres://")) {
                jdbcUrl = databaseUrl.replace("postgres://", "jdbc:postgresql://");
            } else if (databaseUrl.startsWith("postgresql://")) {
                jdbcUrl = databaseUrl.replace("postgresql://", "jdbc:postgresql://");
            }

            // Forçar SSL mode=require se não estiver presente (Cloud standard)
            if (!jdbcUrl.contains("sslmode=")) {
                if (jdbcUrl.contains("?")) {
                    jdbcUrl += "&sslmode=require";
                } else {
                    jdbcUrl += "?sslmode=require";
                }
            }

            config.setJdbcUrl(jdbcUrl);

            // Log Seguro da URL
            String maskedUrl = jdbcUrl.replaceAll(":[^:/@]+@", ":***@");
            System.out.println(">>> RAILWAY DEBUG: Conectando no Banco...");
            System.out.println(">>> URL: " + maskedUrl);
        } else {
            // Fallback para local
            config.setJdbcUrl(localUrl);
            config.setUsername(username);
            config.setPassword(password);
            System.out.println("Using Local Datasource config");
        }

        config.setDriverClassName("org.postgresql.Driver");
        return new HikariDataSource(config);
    }
}
