package com.expensetracker.api.service;

import com.expensetracker.api.model.Expense;
import com.expensetracker.api.repository.ExpenseRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import com.expensetracker.api.dto.ExpenseSummaryByCategoryDto;
import java.util.List;
import java.util.Optional;

@Service // Marks this class as a Spring service component.
public class ExpenseService {

// ... constructor and other methods ...

    public BigDecimal getTotalExpenses() {
        BigDecimal total = expenseRepository.findTotalExpensesAmount();
        return total != null ? total : BigDecimal.ZERO; // Return 0 if total is null (no expenses)
    }

    private final ExpenseRepository expenseRepository;

    // Constructor Injection: Spring automatically provides the ExpenseRepository bean when creating ExpenseService.
    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;

    }
    public Expense createExpense(Expense expense) {
        return expenseRepository.save(expense);
    }
    // Add this import at the top of the file: import java.util.List;
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }
    // Add these imports at the top of the file:
    // import java.util.Optional;
    // import jakarta.persistence.EntityNotFoundException; // or create a custom exception

    public Expense getExpenseById(Long id) {
        Optional<Expense> optionalExpense = expenseRepository.findById(id);
        if (optionalExpense.isPresent()) {
            return optionalExpense.get();
        } else {
            // In a real application, you'd create a custom exception class.
            throw new EntityNotFoundException("Expense not found with ID: " + id);
        }

    }
    public Expense updateExpense(Long id, Expense expenseDetails) {
        // First, retrieve the existing expense record.
        Expense existingExpense = getExpenseById(id); // Re-uses the method we just wrote to find the expense or throw an error.

        // Update the fields of the existing expense with data from expenseDetails.
        existingExpense.setDescription(expenseDetails.getDescription());
        existingExpense.setAmount(expenseDetails.getAmount());
        existingExpense.setDate(expenseDetails.getDate());
        existingExpense.setCategory(expenseDetails.getCategory());

        // Save the updated entity back to the database.
        return expenseRepository.save(existingExpense);
    }
    public void deleteExpense(Long id) {
        // Check if expense exists before deleting.
        if (!expenseRepository.existsById(id)) {
            throw new EntityNotFoundException("Expense not found with ID: " + id);
        }
        expenseRepository.deleteById(id);
    }

    public List<ExpenseSummaryByCategoryDto> getExpenseSummaryByCategory() {
        return expenseRepository.findExpenseSummaryByCategory();
    }

}