package com.expensetracker.api.controller;

import com.expensetracker.api.model.Expense;
import com.expensetracker.api.service.ExpenseService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.expensetracker.api.dto.ExpenseSummaryByCategoryDto;

import java.math.BigDecimal;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

/**
 * Handles all HTTP requests related to expenses.
 * @CrossOrigin allows requests from our React frontend running on port 5174.
 */
// To the specific origin (resolves conflict)
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    // Constructor injection for the ExpenseService
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    /**
     * Endpoint to create a new expense.
     * Maps to: POST /api/expenses
     * @param expense The expense data sent in the request body.
     * @return The created expense object with its new ID.
     */
    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody Expense expense) {
        Expense createdExpense = expenseService.createExpense(expense);
        return new ResponseEntity<>(createdExpense, HttpStatus.CREATED);
    }

    /**
     * Endpoint to retrieve all expenses.
     * Maps to: GET /api/expenses
     * @return A list of all expenses.
     */
    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        return ResponseEntity.ok(expenseService.getAllExpenses());
    }

    /**
     * Endpoint to retrieve a single expense by its ID.
     * Maps to: GET /api/expenses/{id}
     * @param id The ID of the expense to retrieve.
     * @return The expense object if found, or a 404 Not Found response.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Long id) {
        try {
            Expense expense = expenseService.getExpenseById(id);
            return ResponseEntity.ok(expense);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }


    /**
     * Endpoint to update an existing expense.
     * Maps to: PUT /api/expenses/{id}
     * @param id The ID of the expense to update.
     * @param expenseDetails The new data for the expense.
     * @return The updated expense object, or a 404 Not Found response.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @RequestBody Expense expenseDetails) {
        try {
            Expense updatedExpense = expenseService.updateExpense(id, expenseDetails);
            return ResponseEntity.ok(updatedExpense);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Endpoint to delete an expense by its ID.
     * Maps to: DELETE /api/expenses/{id}
     * @param id The ID of the expense to delete.
     * @return A 204 No Content response on success, or a 404 Not Found response.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        try {
            expenseService.deleteExpense(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/summary/total")
    public ResponseEntity<Map<String, Object>> getTotalExpensesSummary() {
        BigDecimal totalExpenses = expenseService.getTotalExpenses();
        Map<String, Object> response = new HashMap<>();
        response.put("totalExpenses", totalExpenses);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/summary/category")
    public ResponseEntity<List<ExpenseSummaryByCategoryDto>> getSummaryByCategory() {
        return ResponseEntity.ok(expenseService.getExpenseSummaryByCategory());
    }
}