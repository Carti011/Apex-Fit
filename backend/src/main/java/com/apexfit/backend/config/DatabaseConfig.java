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

        if (databaseUrl != null && !databaseUrl.isBlank()) {
            // Lógica para Railway: Converte postgres:// para jdbc:postgresql://
            String jdbcUrl = databaseUrl;
            if (databaseUrl.startsWith("postgres://")) {
                jdbcUrl = databaseUrl.replace("postgres://", "jdbc:postgresql://");
            } else if (databaseUrl.startsWith("postgresql://")) {
                jdbcUrl = databaseUrl.replace("postgresql://", "jdbc:postgresql://");
            }

            config.setJdbcUrl(jdbcUrl);
            // Railway geralmente coloca user/pass na URL, mas se precisar extrair:
            // O driver JDBC do Postgres geralmente lida com user:pass na URL,
            // mas por garantia vamos logar (sem senha) que estamos usando a URL do Railway.
            System.out.println("Using Railway DATABASE_URL: " + jdbcUrl.replaceAll(":.*@", ":***@"));
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
