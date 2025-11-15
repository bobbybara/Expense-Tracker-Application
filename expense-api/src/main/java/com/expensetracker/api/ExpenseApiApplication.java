package com.expensetracker.api; // <-- Must be in this package

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication // <-- This annotation enables the component scan
public class ExpenseApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ExpenseApiApplication.class, args);
    }

}