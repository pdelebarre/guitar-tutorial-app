package com.guitar.tutorial.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173",
                                "http://localhost:3000",
                                "http://192.168.86.100:3100") // Make sure the origin is added correctly
                        .allowedMethods("*") // Allow all methods for testing purposes
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
