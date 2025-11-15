package com.expensetracker.api.controller;

import com.expensetracker.api.model.Income;
import com.expensetracker.api.service.IncomeService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173") // Use your frontend's specific port
@RestController
@RequestMapping("/api/incomes")
public class IncomeController {

    private final IncomeService incomeService;

    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    @GetMapping
    public ResponseEntity<List<Income>> getAllIncomes() {
        return ResponseEntity.ok(incomeService.getAllIncomes());
    }

    @PostMapping
    public ResponseEntity<Income> createIncome(@RequestBody Income income) {
        return new ResponseEntity<>(incomeService.createIncome(income), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Income> updateIncome(@PathVariable Long id, @RequestBody Income incomeDetails) {
        try {
            Income updatedIncome = incomeService.updateIncome(id, incomeDetails);
            return ResponseEntity.ok(updatedIncome);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncome(@PathVariable Long id) {
        try {
            incomeService.deleteIncome(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/summary/total")
    public ResponseEntity<Map<String, Object>> getTotalIncomeSummary() {
        BigDecimal totalIncome = incomeService.getTotalIncome();
        Map<String, Object> response = new HashMap<>();
        response.put("totalIncome", totalIncome);
        return ResponseEntity.ok(response);
    }
}