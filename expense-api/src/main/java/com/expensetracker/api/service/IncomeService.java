package com.expensetracker.api.service;

import com.expensetracker.api.model.Income;
import com.expensetracker.api.repository.IncomeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class IncomeService {

    private final IncomeRepository incomeRepository;

    public IncomeService(IncomeRepository incomeRepository) {
        this.incomeRepository = incomeRepository;
    }

    public List<Income> getAllIncomes() {
        return incomeRepository.findAll();
    }

    public Income createIncome(Income income) {
        return incomeRepository.save(income);
    }

    public Income updateIncome(Long id, Income incomeDetails) {
        Income existingIncome = incomeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Income not found with ID: " + id));

        existingIncome.setDescription(incomeDetails.getDescription());
        existingIncome.setAmount(incomeDetails.getAmount());
        existingIncome.setDate(incomeDetails.getDate());

        return incomeRepository.save(existingIncome);
    }

    public void deleteIncome(Long id) {
        if (!incomeRepository.existsById(id)) {
            throw new EntityNotFoundException("Income not found with ID: " + id);
        }
        incomeRepository.deleteById(id);
    }

    public BigDecimal getTotalIncome() {
        BigDecimal total = incomeRepository.findTotalIncomeAmount();
        return total == null ? BigDecimal.ZERO : total;
    }
}