package com.coffeeflow.repository;

import com.coffeeflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Boolean existsByUsername(String username);
    
    Optional<User> findByUsernameAndRole(String username, User.Role role);
}
