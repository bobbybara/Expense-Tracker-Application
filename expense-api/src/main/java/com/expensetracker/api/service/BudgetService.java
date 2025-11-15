package com.expensetracker.api.service;

import com.expensetracker.api.model.Budget;
import com.expensetracker.api.repository.BudgetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;

    public BudgetService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    public List<Budget> getBudgetsForMonth(int year, int month) {
        return budgetRepository.findByYearAndMonth(year, month);
    }

    public Budget setBudget(Budget budget) {
        // Here you might add logic to update an existing budget if one already exists
        // for the same year, month, and category. For simplicity, we'll just save.
        return budgetRepository.save(budget);
    }
}