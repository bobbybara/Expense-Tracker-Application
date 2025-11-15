package com.expensetracker.api.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
public class CategoryService {

    public Map<String, List<String>> getCategories() {
        // Using a TreeMap to keep the categories sorted alphabetically
        Map<String, List<String>> categories = new TreeMap<>();

        categories.put("Food", List.of("Groceries", "Cooking Essentials"));
        categories.put("Rent", List.of("House Bill", "Water Bill", "Electricity Bill"));
        categories.put("Travel", List.of("Office", "Train"));
        categories.put("Entertainment", List.of("Outside Food", "Movies"));
        categories.put("Personal", List.of("Clothes", "Gym", "Medicines and Healthcare"));

        return categories;
    }
}