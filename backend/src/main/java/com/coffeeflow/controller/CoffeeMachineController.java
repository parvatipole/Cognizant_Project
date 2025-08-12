package com.coffeeflow.controller;

import com.coffeeflow.entity.CoffeeMachine;
import com.coffeeflow.payload.request.SupplyUpdateRequest;
import com.coffeeflow.payload.response.MessageResponse;
import com.coffeeflow.repository.CoffeeMachineRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/machines")
public class CoffeeMachineController {
    
    @Autowired
    CoffeeMachineRepository coffeeMachineRepository;
    
    @GetMapping
    public ResponseEntity<List<CoffeeMachine>> getAllMachines() {
        List<CoffeeMachine> machines = coffeeMachineRepository.findAll();
        return ResponseEntity.ok(machines);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CoffeeMachine> getMachineById(@PathVariable Long id) {
        Optional<CoffeeMachine> machine = coffeeMachineRepository.findById(id);
        if (machine.isPresent()) {
            return ResponseEntity.ok(machine.get());
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/machine/{machineId}")
    public ResponseEntity<CoffeeMachine> getMachineByMachineId(@PathVariable String machineId) {
        Optional<CoffeeMachine> machine = coffeeMachineRepository.findByMachineId(machineId);
        if (machine.isPresent()) {
            return ResponseEntity.ok(machine.get());
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/locations")
    public ResponseEntity<List<String>> getAllLocations() {
        List<String> locations = coffeeMachineRepository.findAllDistinctLocations();
        return ResponseEntity.ok(locations);
    }
    
    @GetMapping("/offices")
    public ResponseEntity<List<String>> getOfficesByLocation(@RequestParam String location) {
        List<String> offices = coffeeMachineRepository.findDistinctOfficesByLocation(location);
        return ResponseEntity.ok(offices);
    }
    
    @GetMapping("/floors")
    public ResponseEntity<List<String>> getFloorsByLocationAndOffice(
            @RequestParam String location, @RequestParam String office) {
        List<String> floors = coffeeMachineRepository.findDistinctFloorsByLocationAndOffice(location, office);
        return ResponseEntity.ok(floors);
    }
    
    @GetMapping("/by-location-office-floor")
    public ResponseEntity<List<CoffeeMachine>> getMachinesByLocationOfficeFloor(
            @RequestParam String location, 
            @RequestParam String office, 
            @RequestParam String floor) {
        List<CoffeeMachine> machines = coffeeMachineRepository.findByLocationAndOfficeAndFloor(location, office, floor);
        return ResponseEntity.ok(machines);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<CoffeeMachine> updateMachine(@PathVariable Long id, 
                                                       @Valid @RequestBody CoffeeMachine machine) {
        Optional<CoffeeMachine> existingMachine = coffeeMachineRepository.findById(id);
        if (existingMachine.isPresent()) {
            machine.setId(id);
            CoffeeMachine updatedMachine = coffeeMachineRepository.save(machine);
            return ResponseEntity.ok(updatedMachine);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/supplies")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<MessageResponse> updateSupplies(@PathVariable Long id, 
                                                         @Valid @RequestBody SupplyUpdateRequest request) {
        Optional<CoffeeMachine> optionalMachine = coffeeMachineRepository.findById(id);
        if (optionalMachine.isPresent()) {
            CoffeeMachine machine = optionalMachine.get();
            
            if (request.getWaterLevel() != null) {
                machine.setWaterLevel(request.getWaterLevel());
            }
            if (request.getMilkLevel() != null) {
                machine.setMilkLevel(request.getMilkLevel());
            }
            if (request.getCoffeeBeansLevel() != null) {
                machine.setCoffeeBeansLevel(request.getCoffeeBeansLevel());
            }
            if (request.getSugarLevel() != null) {
                machine.setSugarLevel(request.getSugarLevel());
            }
            
            coffeeMachineRepository.save(machine);
            return ResponseEntity.ok(new MessageResponse("Supplies updated successfully!"));
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/low-supplies")
    public ResponseEntity<List<CoffeeMachine>> getMachinesWithLowSupplies(@RequestParam(defaultValue = "30") Integer threshold) {
        List<CoffeeMachine> machines = coffeeMachineRepository.findMachinesWithLowSupplies(threshold);
        return ResponseEntity.ok(machines);
    }
    
    @GetMapping("/maintenance-needed")
    public ResponseEntity<List<CoffeeMachine>> getMachinesNeedingMaintenance() {
        List<CoffeeMachine> machines = coffeeMachineRepository.findMachinesNeedingMaintenance();
        return ResponseEntity.ok(machines);
    }
}
