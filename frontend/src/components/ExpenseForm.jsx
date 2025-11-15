import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUtensils, FaHome, FaPlane, FaFilm, FaTshirt } from 'react-icons/fa';

const categoryIcons = {
    Food: <FaUtensils />,
    Rent: <FaHome />,
    Travel: <FaPlane />,
    Entertainment: <FaFilm />,
    Personal: <FaTshirt />
};

function ExpenseForm({ onActionComplete, expenseToEdit, clearEdit }) {
    // State for form fields
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');

    // State for new category selection flow
    const [categories, setCategories] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8081/api/categories');
                setCategories(response.data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (expenseToEdit) {
            setDescription(expenseToEdit.description);
            setAmount(expenseToEdit.amount);
            setDate(expenseToEdit.date);
            setSelectedCategory(expenseToEdit.category);
            setSelectedSubcategory(expenseToEdit.subcategory);
        } else {
            setDescription('');
            setAmount('');
            setDate('');
            setSelectedCategory('');
            setSelectedSubcategory('');
        }
    }, [expenseToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCategory || !selectedSubcategory) {
            alert("Please select a category and subcategory.");
            return;
        }

        const expenseData = {
            description,
            amount: parseFloat(amount),
            date,
            category: selectedCategory,
            subcategory: selectedSubcategory // This was the missing line
        };

        try {
            if (expenseToEdit) {
                await axios.put(`http://localhost:8081/api/expenses/${expenseToEdit.id}`, expenseData);
                clearEdit();
            } else {
                await axios.post('http://localhost:8081/api/expenses', expenseData);
            }
            onActionComplete(); // Call the main refresh function
            // Reset form fields after successful submission
            setDescription('');
            setAmount('');
            setDate('');
            setSelectedCategory('');
            setSelectedSubcategory('');
        } catch (error) {
            console.error('Error saving expense:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>{expenseToEdit ? 'Edit Expense' : 'Add Expense'}</h3>
            <div className="category-selection">
                <h4>Select Category</h4>
                <div className="category-buttons">
                    {Object.keys(categories).map(category => (
                        <button
                            type="button"
                            key={category}
                            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => { setSelectedCategory(category); setSelectedSubcategory(''); }}
                        >
                            {categoryIcons[category]} {category}
                        </button>
                    ))}
                </div>
            </div>
            {selectedCategory && (
                <div className="subcategory-selection">
                    <h4>Select Subcategory for {selectedCategory}</h4>
                    <div className="subcategory-buttons">
                        {categories[selectedCategory].map(subcategory => (
                            <button
                                type="button"
                                key={subcategory}
                                className={`subcategory-btn ${selectedSubcategory === subcategory ? 'active' : ''}`}
                                onClick={() => setSelectedSubcategory(subcategory)}
                            >
                                {subcategory}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {selectedSubcategory && (
                <div className="expense-details">
                    <div>
                        <label>Description:</label>
                        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                    <div>
                        <label>Amount:</label>
                        <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                    </div>
                    <div>
                        <label>Date:</label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                    </div>
                    <button type="submit">{expenseToEdit ? 'Save Changes' : 'Add Expense'}</button>
                </div>
            )}
        </form>
    );
}

export default ExpenseForm;