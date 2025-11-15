import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useInView } from 'react-intersection-observer';
import TabsView from './components/TabsView';
import './App.css';

// Helper component to create a scroll-animated section
const AnimatedSection = ({ children, id }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <section id={id} ref={ref} className={`fade-in-section ${inView ? 'is-visible' : ''}`}>
            {children}
        </section>
    );
};

function App() {
    // --- State Variables ---
    const [expenses, setExpenses] = useState([]);
    const [incomes, setIncomes] = useState([]);
    const [summary, setSummary] = useState({ totalExpenses: 0 });
    const [totalIncome, setTotalIncome] = useState(0);
    const [categorySummary, setCategorySummary] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [expenseToEdit, setExpenseToEdit] = useState(null);
    const [incomeToEdit, setIncomeToEdit] = useState(null);

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    // --- Data Fetching ---
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = () => {
        fetchExpenses();
        fetchIncomes();
        fetchBudgets();
        refreshAnalytics();
    };

    const fetchExpenses = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/expenses');
            setExpenses(response.data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    const fetchIncomes = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/incomes');
            setIncomes(response.data);
        } catch (error) {
            console.error('Error fetching incomes:', error);
        }
    };

    const fetchBudgets = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/api/budgets?year=${currentYear}&month=${currentMonth}`);
            setBudgets(response.data);
        } catch (error) {
            console.error("Error fetching budgets:", error);
        }
    };

    const refreshAnalytics = () => {
        fetchExpenseSummary();
        fetchIncomeSummary();
        fetchCategorySummary();
    };

    const fetchExpenseSummary = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/expenses/summary/total');
            setSummary(response.data);
        } catch (error) {
            console.error('Error fetching expense summary:', error);
        }
    };

    const fetchIncomeSummary = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/incomes/summary/total');
            setTotalIncome(response.data.totalIncome || 0);
        } catch (error) {
            console.error('Error fetching income summary:', error);
        }
    };

    const fetchCategorySummary = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/expenses/summary/category');
            setCategorySummary(response.data);
        } catch (error) {
            console.error('Error fetching category summary:', error);
        }
    };

    const handleActionCompletion = () => {
        fetchAllData();
    };

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // --- Derived State Calculation ---
    const savings = totalIncome - summary.totalExpenses;

    const dashboardData = categorySummary.map(summaryItem => {
        const budgetItem = budgets.find(b => b.category === summaryItem.category);
        const allocated = budgetItem ? budgetItem.allocatedAmount : 0;
        const spent = summaryItem.totalAmount;
        const remaining = allocated - spent;
        return { category: summaryItem.category, allocated, spent, remaining };
    });

    return (
        <div className="app-container">
            <header>
                <h1>Expense Tracker</h1>
                <nav>
                    <a href="#dashboard" onClick={(e) => { e.preventDefault(); scrollToSection('dashboard'); }}>Dashboard</a>
                    <a href="#transactions" onClick={(e) => { e.preventDefault(); scrollToSection('transactions'); }}>Transactions</a>
                </nav>
            </header>

            <main>
                <AnimatedSection id="about">
                    <div className="hero-section">
                        <h2>Manage Your Finances with Precision</h2>
                        <p>Track income and expenses, set budgets, and gain insights into your spending habits with this powerful tool built on Spring Boot and React.</p>
                    </div>
                </AnimatedSection>

                <AnimatedSection id="dashboard">
                    <div className="dashboard">
                        <h2>Dashboard</h2>
                        <div className="stats-container">
                            <div className="stat-card"><h3>Total Income</h3><p className="amount">${totalIncome.toFixed(2)}</p></div>
                            <div className="stat-card"><h3>Total Expenses</h3><p className="amount">${summary.totalExpenses.toFixed(2)}</p></div>
                            <div className="stat-card"><h3>Net Savings</h3><p className={`amount ${savings >= 0 ? 'savings-positive' : 'savings-negative'}`}>${savings.toFixed(2)}</p></div>
                        </div>

                        <div className="stat-card" style={{marginTop: '20px'}}>
                            <h3>Budget vs. Spending for {currentMonth}/{currentYear}</h3>
                            <ul>
                                {dashboardData.map(item => (
                                    <li key={item.category}>
                                        <strong>{item.category}:</strong> Spent ${item.spent.toFixed(2)} of ${item.allocated.toFixed(2)}
                                        <span style={{ color: item.remaining >= 0 ? 'var(--accent-green)' : 'var(--accent-red)', marginLeft: '10px' }}>
                                            (${Math.abs(item.remaining).toFixed(2)} {item.remaining >= 0 ? 'left' : 'overspent'})
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </AnimatedSection>

                <AnimatedSection id="transactions">
                    <TabsView
                        expenses={expenses}
                        incomes={incomes}
                        dashboardData={dashboardData}
                        totalIncome={totalIncome}
                        totalExpenses={summary.totalExpenses}
                        year={currentYear}
                        month={currentMonth}
                        expenseToEdit={expenseToEdit}
                        incomeToEdit={incomeToEdit}
                        onActionComplete={fetchAllData}
                        setExpenseToEdit={setExpenseToEdit}
                        setIncomeToEdit={setIncomeToEdit}
                    />
                </AnimatedSection>
            </main>
        </div>
    );
}

export default App;