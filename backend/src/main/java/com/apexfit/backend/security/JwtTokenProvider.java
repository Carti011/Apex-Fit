package com.apexfit.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private static final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${app.jwt.secret:MySuperSecretKeyForApexFitApplicationWhichShouldBeVeryLongAndSecure}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-milliseconds:86400000}") // 24h
    private long jwtExpirationDate;

    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + jwtExpirationDate);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(expireDate)
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key key() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String getUsername(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    // Corrigido: usa parseClaimsJws (verifica assinatura + expiracao)
    // O metodo anterior usava parse() que nao validava a assinatura corretamente
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key())
                    .build()
                    .parseClaimsJws(token); // <-- corrigido de parse() para parseClaimsJws()
            return true;
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            log.warn("JWT expirado: {}", e.getMessage());
        } catch (io.jsonwebtoken.security.SecurityException e) {
            log.warn("Assinatura JWT invalida: {}", e.getMessage());
        } catch (Exception e) {
            log.warn("JWT invalido: {}", e.getMessage());
        }
        return false;
    }
}
