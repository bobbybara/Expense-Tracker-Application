import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import ExpenseForm from './ExpenseForm';
import IncomeForm from './IncomeForm';
import BudgetManager from './BudgetManager';
import AnalyticsChart from './AnalyticsChart';
import axios from 'axios';

const TabsView = (props) => {
    const [isDetailedView, setIsDetailedView] = useState(false);

    const {
        expenses, incomes, year, month,
        expenseToEdit, incomeToEdit, onActionComplete,
        setExpenseToEdit, setIncomeToEdit,
        dashboardData, totalIncome, totalExpenses
    } = props;

    const handleDeleteExpense = async (idToDelete) => {
        try {
            await axios.delete(`http://localhost:8081/api/expenses/${idToDelete}`);
            onActionComplete();
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    const handleDeleteIncome = async (idToDelete) => {
        try {
            await axios.delete(`http://localhost:8081/api/incomes/${idToDelete}`);
            onActionComplete();
        } catch (error) {
            console.error('Error deleting income:', error);
        }
    };

    return (
        <Tabs>
            <TabList>
                <Tab>Expenses</Tab>
                <Tab>Income</Tab>
                <Tab>Budget</Tab>
                <Tab>Analytics</Tab>
            </TabList>

            <TabPanel>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <ExpenseForm onActionComplete={onActionComplete} expenseToEdit={expenseToEdit} clearEdit={() => setExpenseToEdit(null)} />
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <h2>My Expenses</h2>
                        <ul>
                            {expenses.map((expense) => (
                                <li key={expense.id}>
                                    <div><strong>{expense.description}</strong> ({expense.category} / {expense.subcategory})<br/><small>{expense.date}</small></div>
                                    <div><span>-${expense.amount.toFixed(2)}</span><button onClick={() => setExpenseToEdit(expense)}>Edit</button><button onClick={() => handleDeleteExpense(expense.id)} className="delete-button">Delete</button></div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </TabPanel>
            <TabPanel>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <IncomeForm onActionComplete={onActionComplete} incomeToEdit={incomeToEdit} clearEdit={() => setIncomeToEdit(null)} />
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <h2>My Income</h2>
                        <ul>
                            {incomes.map((income) => (
                                <li key={income.id}>
                                    <div><strong>{income.description}</strong><br/><small>{income.date}</small></div>
                                    <div><span>+${income.amount.toFixed(2)}</span><button onClick={() => setIncomeToEdit(income)}>Edit</button><button onClick={() => handleDeleteIncome(income.id)} className="delete-button">Delete</button></div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </TabPanel>
            <TabPanel>
                <BudgetManager year={year} month={month} onBudgetSet={onActionComplete} />
            </TabPanel>
            <TabPanel>
                <div className="analytics-section stat-card">
                    <button onClick={() => setIsDetailedView(!isDetailedView)} style={{marginBottom: '20px'}}>
                        {isDetailedView ? 'View Main Analytics' : 'View Detailed Analytics'}
                    </button>
                    <AnalyticsChart
                        dashboardData={dashboardData}
                        isDetailedView={isDetailedView}
                        totalIncome={totalIncome}
                        totalExpenses={totalExpenses}
                    />
                </div>
            </TabPanel>
        </Tabs>
    );
};

export default TabsView;