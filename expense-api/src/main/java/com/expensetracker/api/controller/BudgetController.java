package com.expensetracker.api.controller;

import com.expensetracker.api.model.Budget;
import com.expensetracker.api.service.BudgetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "http://localhost:5173") // Use your frontend's port
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping
    public ResponseEntity<Budget> setBudget(@RequestBody Budget budget) {
        return ResponseEntity.ok(budgetService.setBudget(budget));
    }

    @GetMapping
    public ResponseEntity<List<Budget>> getBudgetsForMonth(
            @RequestParam int year,
            @RequestParam int month) {
        return ResponseEntity.ok(budgetService.getBudgetsForMonth(year, month));
    }
}