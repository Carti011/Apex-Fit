package com.apexfit.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:5173", // Frontend Local (Vite)
                        "https://carti011.com.br", // Frontend Produção (Vercel)
                        "https://apex-fit-frontend.vercel.app" // Frontend Default (Vercel)
                // TODO: Adicionar URLs de Preview da Vercel aqui conforme necessário
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "TRACE", "CONNECT")
                .allowCredentials(true); // Importante para Cookies/Auth no futuro
    }
}
