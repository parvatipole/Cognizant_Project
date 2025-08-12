package com.coffeeflow.repository;

import com.coffeeflow.entity.CoffeeMachine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CoffeeMachineRepository extends JpaRepository<CoffeeMachine, Long> {
    
    Optional<CoffeeMachine> findByMachineId(String machineId);
    
    List<CoffeeMachine> findByLocation(String location);
    
    List<CoffeeMachine> findByLocationAndOffice(String location, String office);
    
    List<CoffeeMachine> findByLocationAndOfficeAndFloor(String location, String office, String floor);
    
    List<CoffeeMachine> findByStatus(CoffeeMachine.Status status);
    
    @Query("SELECT DISTINCT c.location FROM CoffeeMachine c ORDER BY c.location")
    List<String> findAllDistinctLocations();
    
    @Query("SELECT DISTINCT c.office FROM CoffeeMachine c WHERE c.location = :location ORDER BY c.office")
    List<String> findDistinctOfficesByLocation(@Param("location") String location);
    
    @Query("SELECT DISTINCT c.floor FROM CoffeeMachine c WHERE c.location = :location AND c.office = :office ORDER BY c.floor")
    List<String> findDistinctFloorsByLocationAndOffice(@Param("location") String location, @Param("office") String office);
    
    @Query("SELECT c FROM CoffeeMachine c WHERE c.waterLevel < :threshold OR c.milkLevel < :threshold OR c.coffeeBeansLevel < :threshold OR c.sugarLevel < :threshold")
    List<CoffeeMachine> findMachinesWithLowSupplies(@Param("threshold") Integer threshold);
    
    @Query("SELECT c FROM CoffeeMachine c WHERE c.filterStatus = 'NEEDS_REPLACEMENT' OR c.filterStatus = 'CRITICAL'")
    List<CoffeeMachine> findMachinesNeedingMaintenance();
}
