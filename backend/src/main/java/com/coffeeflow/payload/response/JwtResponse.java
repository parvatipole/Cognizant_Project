package com.coffeeflow.payload.response;

import java.util.List;

public class JwtResponse {
    
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String name;
    private String role;
    private List<String> authorities;
    
    public JwtResponse(String accessToken, Long id, String username, String name, String role, List<String> authorities) {
        this.token = accessToken;
        this.id = id;
        this.username = username;
        this.name = name;
        this.role = role;
        this.authorities = authorities;
    }
    
    public String getAccessToken() {
        return token;
    }
    
    public void setAccessToken(String accessToken) {
        this.token = accessToken;
    }
    
    public String getTokenType() {
        return type;
    }
    
    public void setTokenType(String tokenType) {
        this.type = tokenType;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public List<String> getAuthorities() {
        return authorities;
    }
    
    public void setAuthorities(List<String> authorities) {
        this.authorities = authorities;
    }
}
