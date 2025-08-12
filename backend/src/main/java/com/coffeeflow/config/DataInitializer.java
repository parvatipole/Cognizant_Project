package com.coffeeflow.config;

import com.coffeeflow.entity.CoffeeMachine;
import com.coffeeflow.entity.User;
import com.coffeeflow.repository.CoffeeMachineRepository;
import com.coffeeflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CoffeeMachineRepository coffeeMachineRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        
        // Initialize default users if they don't exist
        if (!userRepository.existsByUsername("tech1")) {
            User technician = new User("tech1", "John Technician", 
                    passwordEncoder.encode("password"), User.Role.TECHNICIAN);
            userRepository.save(technician);
        }
        
        if (!userRepository.existsByUsername("admin1")) {
            User admin = new User("admin1", "Sarah Admin", 
                    passwordEncoder.encode("password"), User.Role.ADMIN);
            userRepository.save(admin);
        }
        
        // Initialize sample coffee machines if they don't exist
        if (coffeeMachineRepository.count() == 0) {
            initializeSampleMachines();
        }
    }
    
    private void initializeSampleMachines() {
        CoffeeMachine machine1 = new CoffeeMachine();
        machine1.setMachineId("A-001");
        machine1.setName("Machine A-001");
        machine1.setLocation("New York");
        machine1.setOffice("Main Office");
        machine1.setFloor("2nd Floor");
        machine1.setStatus(CoffeeMachine.Status.OPERATIONAL);
        machine1.setLastMaintenance(LocalDateTime.now().minusDays(5));
        machine1.setNextMaintenance(LocalDateTime.now().plusDays(25));
        machine1.setWaterLevel(85);
        machine1.setMilkLevel(60);
        machine1.setCoffeeBeansLevel(75);
        machine1.setSugarLevel(90);
        machine1.setFilterStatus(CoffeeMachine.FilterStatus.GOOD);
        machine1.setCleaningStatus(CoffeeMachine.CleaningStatus.CLEAN);
        machine1.setTemperature(92.0);
        machine1.setPressure(15.0);
        machine1.setDailyCups(127);
        machine1.setWeeklyCups(890);
        machine1.setMonthlyRevenue(2340.0);
        machine1.setNotes("Machine running smoothly. Recent cleaning completed on schedule.");
        
        CoffeeMachine machine2 = new CoffeeMachine();
        machine2.setMachineId("A-002");
        machine2.setName("Machine A-002");
        machine2.setLocation("New York");
        machine2.setOffice("Main Office");
        machine2.setFloor("1st Floor");
        machine2.setStatus(CoffeeMachine.Status.OPERATIONAL);
        machine2.setLastMaintenance(LocalDateTime.now().minusDays(3));
        machine2.setNextMaintenance(LocalDateTime.now().plusDays(27));
        machine2.setWaterLevel(70);
        machine2.setMilkLevel(45);
        machine2.setCoffeeBeansLevel(80);
        machine2.setSugarLevel(65);
        machine2.setFilterStatus(CoffeeMachine.FilterStatus.GOOD);
        machine2.setCleaningStatus(CoffeeMachine.CleaningStatus.CLEAN);
        machine2.setTemperature(91.5);
        machine2.setPressure(14.8);
        machine2.setDailyCups(95);
        machine2.setWeeklyCups(665);
        machine2.setMonthlyRevenue(1995.0);
        machine2.setNotes("Good performance. Milk supply needs attention soon.");
        
        CoffeeMachine machine3 = new CoffeeMachine();
        machine3.setMachineId("B-001");
        machine3.setName("Machine B-001");
        machine3.setLocation("Los Angeles");
        machine3.setOffice("West Branch");
        machine3.setFloor("Ground Floor");
        machine3.setStatus(CoffeeMachine.Status.MAINTENANCE);
        machine3.setLastMaintenance(LocalDateTime.now().minusDays(15));
        machine3.setNextMaintenance(LocalDateTime.now().plusDays(15));
        machine3.setWaterLevel(25);
        machine3.setMilkLevel(20);
        machine3.setCoffeeBeansLevel(30);
        machine3.setSugarLevel(40);
        machine3.setFilterStatus(CoffeeMachine.FilterStatus.NEEDS_REPLACEMENT);
        machine3.setCleaningStatus(CoffeeMachine.CleaningStatus.NEEDS_CLEANING);
        machine3.setTemperature(89.0);
        machine3.setPressure(13.5);
        machine3.setDailyCups(0);
        machine3.setWeeklyCups(0);
        machine3.setMonthlyRevenue(0.0);
        machine3.setNotes("Under maintenance. Filter replacement and deep cleaning required.");
        
        coffeeMachineRepository.save(machine1);
        coffeeMachineRepository.save(machine2);
        coffeeMachineRepository.save(machine3);
    }
}
