package com.expensetracker.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data // Lombok: Generates getters, setters, toString(), equals(), and hashCode() methods.
@NoArgsConstructor // Lombok: Generates a no-argument constructor. Required by JPA.
@AllArgsConstructor // Lombok: Generates a constructor with all fields. Useful for testing.
@Entity // JPA: Marks this class as a persistent entity (i.e., tells Spring to create a table for it).
@Table(name = "expenses") // JPA: Specifies the actual table name in the database.
public class Expense {

    @Id // JPA: Marks this field as the primary key.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // DB: Configures the way the ID is generated. IDENTITY delegates ID generation to the database.
    private Long id;

    @Column(nullable = false) // DB: Marks this column as non-nullable.
    private String description;

    @Column(nullable = false) // DB: Marks this column as non-nullable.
    private BigDecimal amount; // Use BigDecimal for financial calculations to avoid floating-point errors.

    @Column(nullable = false)
    private LocalDate date;
    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String subcategory;
}