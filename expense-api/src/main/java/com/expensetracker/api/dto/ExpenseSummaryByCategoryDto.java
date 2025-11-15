package com.expensetracker.api.dto;

import java.math.BigDecimal;

// This is a DTO class. Lombok's @AllArgsConstructor helps create a constructor
// that Spring Data JPA will use to populate data from the query result.
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ExpenseSummaryByCategoryDto {
    private String category;
    private BigDecimal totalAmount;
}