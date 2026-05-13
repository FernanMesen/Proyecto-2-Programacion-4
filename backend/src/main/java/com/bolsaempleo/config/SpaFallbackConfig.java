package com.bolsaempleo.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.server.ErrorPage;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Redirige todas las rutas desconocidas al index.html de React
 * para que React Router maneje el enrutamiento del lado del cliente.
 */
@Configuration
public class SpaFallbackConfig {

    @Bean
    public WebServerFactoryCustomizer<ConfigurableServletWebServerFactory> containerCustomizer() {
        return factory -> factory.addErrorPages(new ErrorPage(HttpStatus.NOT_FOUND, "/index.html"));
    }

    @Controller
    static class SpaController {
        @RequestMapping(value = {
            "/", "/login", "/buscar", "/puesto/**",
            "/registro/**", "/empresa/**", "/oferente/**", "/admin/**"
        })
        public String forward(HttpServletRequest request) {
            String path = request.getServletPath();
            if (path.startsWith("/api") || path.startsWith("/assets")) return null;
            return "forward:/index.html";
        }
    }
}
