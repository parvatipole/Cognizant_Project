package com.coffeeflow.payload.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class SupplyUpdateRequest {
    
    @Min(0) @Max(100)
    private Integer waterLevel;
    
    @Min(0) @Max(100)
    private Integer milkLevel;
    
    @Min(0) @Max(100)
    private Integer coffeeBeansLevel;
    
    @Min(0) @Max(100)
    private Integer sugarLevel;
    
    public Integer getWaterLevel() {
        return waterLevel;
    }
    
    public void setWaterLevel(Integer waterLevel) {
        this.waterLevel = waterLevel;
    }
    
    public Integer getMilkLevel() {
        return milkLevel;
    }
    
    public void setMilkLevel(Integer milkLevel) {
        this.milkLevel = milkLevel;
    }
    
    public Integer getCoffeeBeansLevel() {
        return coffeeBeansLevel;
    }
    
    public void setCoffeeBeansLevel(Integer coffeeBeansLevel) {
        this.coffeeBeansLevel = coffeeBeansLevel;
    }
    
    public Integer getSugarLevel() {
        return sugarLevel;
    }
    
    public void setSugarLevel(Integer sugarLevel) {
        this.sugarLevel = sugarLevel;
    }
}
