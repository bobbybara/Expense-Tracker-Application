import React, { useState, useEffect } from 'react';
import axios from 'axios';

function IncomeForm({ onActionComplete, incomeToEdit, clearEdit }) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        if (incomeToEdit) {
            setDescription(incomeToEdit.description);
            setAmount(incomeToEdit.amount);
            setDate(incomeToEdit.date);
        } else {
            setDescription('');
            setAmount('');
            setDate('');
        }
    }, [incomeToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const incomeData = {
            description: description,
            amount: parseFloat(amount),
            date: date,
        };

        try {
            if (incomeToEdit) {
                await axios.put(`http://localhost:8081/api/incomes/${incomeToEdit.id}`, incomeData);
                clearEdit();
            } else {
                await axios.post('http://localhost:8081/api/incomes', incomeData);
            }
            onActionComplete(); // Call the main refresh function
            // Clear form fields
            setDescription('');
            setAmount('');
            setDate('');
        } catch (error) {
            console.error('Error saving income:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '1px solid lightgreen' }}>
            <h3>{incomeToEdit ? 'Edit Income' : 'Add New Income'}</h3>
            <div>
                <label>Description: </label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div>
                <label>Amount: </label>
                <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div>
                <label>Date: </label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <button type="submit">{incomeToEdit ? 'Save Changes' : 'Add Income'}</button>
        </form>
    );
}

export default IncomeForm;