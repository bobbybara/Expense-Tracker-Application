package com.expensetracker.api.repository;

import com.expensetracker.api.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // Add this import
import org.springframework.stereotype.Repository;
import com.expensetracker.api.dto.ExpenseSummaryByCategoryDto; // Add this import
import java.util.List;
import java.math.BigDecimal; // Add this import

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    /**
     * Custom query using JPQL (Java Persistence Query Language) to calculate the sum
     * of the 'amount' field for all expenses in the database.
     * Returns BigDecimal, or null if the table is empty.
     */
    @Query("SELECT SUM(e.amount) FROM Expense e")
    BigDecimal findTotalExpensesAmount();
    @Query("SELECT new com.expensetracker.api.dto.ExpenseSummaryByCategoryDto(e.category, SUM(e.amount)) FROM Expense e GROUP BY e.category")
    List<ExpenseSummaryByCategoryDto> findExpenseSummaryByCategory();
}