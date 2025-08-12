package com.coffeeflow.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import java.time.LocalDateTime;

@Entity
@Table(name = "coffee_machines")
public class CoffeeMachine {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(unique = true)
    private String machineId;
    
    @NotBlank
    private String name;
    
    @NotBlank
    private String location;
    
    @NotBlank
    private String office;
    
    @NotBlank
    private String floor;
    
    @Enumerated(EnumType.STRING)
    private Status status;
    
    @Column(name = "last_maintenance")
    private LocalDateTime lastMaintenance;
    
    @Column(name = "next_maintenance")
    private LocalDateTime nextMaintenance;
    
    // Supply levels (0-100)
    @Min(0) @Max(100)
    @Column(name = "water_level")
    private Integer waterLevel;
    
    @Min(0) @Max(100)
    @Column(name = "milk_level")
    private Integer milkLevel;
    
    @Min(0) @Max(100)
    @Column(name = "coffee_beans_level")
    private Integer coffeeBeansLevel;
    
    @Min(0) @Max(100)
    @Column(name = "sugar_level")
    private Integer sugarLevel;
    
    // Maintenance data
    @Enumerated(EnumType.STRING)
    @Column(name = "filter_status")
    private FilterStatus filterStatus;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "cleaning_status")
    private CleaningStatus cleaningStatus;
    
    @Column(name = "temperature")
    private Double temperature;
    
    @Column(name = "pressure")
    private Double pressure;
    
    // Usage statistics
    @Column(name = "daily_cups")
    private Integer dailyCups;
    
    @Column(name = "weekly_cups")
    private Integer weeklyCups;
    
    @Column(name = "monthly_revenue")
    private Double monthlyRevenue;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum Status {
        OPERATIONAL, MAINTENANCE, OFFLINE
    }
    
    public enum FilterStatus {
        GOOD, NEEDS_REPLACEMENT, CRITICAL
    }
    
    public enum CleaningStatus {
        CLEAN, NEEDS_CLEANING, OVERDUE
    }
    
    public CoffeeMachine() {}
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getMachineId() { return machineId; }
    public void setMachineId(String machineId) { this.machineId = machineId; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public String getOffice() { return office; }
    public void setOffice(String office) { this.office = office; }
    
    public String getFloor() { return floor; }
    public void setFloor(String floor) { this.floor = floor; }
    
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    
    public LocalDateTime getLastMaintenance() { return lastMaintenance; }
    public void setLastMaintenance(LocalDateTime lastMaintenance) { this.lastMaintenance = lastMaintenance; }
    
    public LocalDateTime getNextMaintenance() { return nextMaintenance; }
    public void setNextMaintenance(LocalDateTime nextMaintenance) { this.nextMaintenance = nextMaintenance; }
    
    public Integer getWaterLevel() { return waterLevel; }
    public void setWaterLevel(Integer waterLevel) { this.waterLevel = waterLevel; }
    
    public Integer getMilkLevel() { return milkLevel; }
    public void setMilkLevel(Integer milkLevel) { this.milkLevel = milkLevel; }
    
    public Integer getCoffeeBeansLevel() { return coffeeBeansLevel; }
    public void setCoffeeBeansLevel(Integer coffeeBeansLevel) { this.coffeeBeansLevel = coffeeBeansLevel; }
    
    public Integer getSugarLevel() { return sugarLevel; }
    public void setSugarLevel(Integer sugarLevel) { this.sugarLevel = sugarLevel; }
    
    public FilterStatus getFilterStatus() { return filterStatus; }
    public void setFilterStatus(FilterStatus filterStatus) { this.filterStatus = filterStatus; }
    
    public CleaningStatus getCleaningStatus() { return cleaningStatus; }
    public void setCleaningStatus(CleaningStatus cleaningStatus) { this.cleaningStatus = cleaningStatus; }
    
    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }
    
    public Double getPressure() { return pressure; }
    public void setPressure(Double pressure) { this.pressure = pressure; }
    
    public Integer getDailyCups() { return dailyCups; }
    public void setDailyCups(Integer dailyCups) { this.dailyCups = dailyCups; }
    
    public Integer getWeeklyCups() { return weeklyCups; }
    public void setWeeklyCups(Integer weeklyCups) { this.weeklyCups = weeklyCups; }
    
    public Double getMonthlyRevenue() { return monthlyRevenue; }
    public void setMonthlyRevenue(Double monthlyRevenue) { this.monthlyRevenue = monthlyRevenue; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
