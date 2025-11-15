import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BudgetManager = ({ year, month, onBudgetSet }) => {
    const [categories, setCategories] = useState({});
    const [budgets, setBudgets] = useState({});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8081/api/categories');
                setCategories(response.data);
                // Initialize budget state
                const initialBudgets = {};
                Object.keys(response.data).forEach(cat => {
                    initialBudgets[cat] = '';
                });
                setBudgets(initialBudgets);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleBudgetChange = (category, amount) => {
        setBudgets({
            ...budgets,
            [category]: amount
        });
    };

    const handleSaveBudgets = async () => {
        for (const category in budgets) {
            const amount = parseFloat(budgets[category]);
            if (!isNaN(amount) && amount > 0) {
                const budgetData = {
                    year,
                    month,
                    category,
                    allocatedAmount: amount
                };
                try {
                    await axios.post('http://localhost:8081/api/budgets', budgetData);
                } catch (error) {
                    console.error(`Failed to save budget for ${category}`, error);
                }
            }
        }
        alert('Budgets saved!');
        if (onBudgetSet) {
            onBudgetSet(); // Notify parent component to refresh data
        }
    };

    return (
        <div className="budget-manager">
            <h3>Set Budget for {month}/{year}</h3>
            {Object.keys(categories).map(category => (
                <div key={category} className="budget-input">
                    <label>{category}:</label>
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Set budget"
                        value={budgets[category] || ''}
                        onChange={(e) => handleBudgetChange(category, e.target.value)}
                    />
                </div>
            ))}
            <button onClick={handleSaveBudgets}>Save Budgets</button>
        </div>
    );
};

export default BudgetManager;