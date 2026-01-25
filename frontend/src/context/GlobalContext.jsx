import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if user is logged in on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            try {
                setUser(JSON.parse(userData));
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    }, []);

    // Auth Functions
    const signup = async (userData) => {
        try {
            setLoading(true);
            const { data } = await api.post('/auth/signup', userData);

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));

            setUser(data);
            setIsAuthenticated(true);
            toast.success('Account created successfully!');
            return data;
        } catch (error) {
            const message = error.response?.data?.message || 'Signup failed';
            toast.error(message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            setLoading(true);
            const { data } = await api.post('/auth/login', credentials);

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));

            setUser(data);
            setIsAuthenticated(true);
            toast.success('Welcome back!');
            return data;
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        setIncomes([]);
        setExpenses([]);
        toast.info('Logged out successfully');
    };

    // Income Functions
    const addIncome = async (incomeData) => {
        try {
            setLoading(true);
            const { data } = await api.post('/income/add', incomeData);
            setIncomes([data, ...incomes]);
            toast.success('Income added successfully!');
            return data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to add income';
            toast.error(message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getIncomes = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/income/get');
            setIncomes(data);
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch incomes';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const deleteIncome = async (id) => {
        try {
            await api.delete(`/income/delete/${id}`);
            setIncomes(incomes.filter((income) => income._id !== id));
            toast.success('Income deleted');
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete income';
            toast.error(message);
        }
    };

    const downloadIncomes = async () => {
        try {
            const response = await api.get('/income/download', {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'incomes.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success('Incomes downloaded!');
        } catch (error) {
            toast.error('Failed to download incomes');
        }
    };

    // Expense Functions
    const addExpense = async (expenseData) => {
        try {
            setLoading(true);
            const { data } = await api.post('/expense/add', expenseData);
            setExpenses([data, ...expenses]);
            toast.success('Expense added successfully!');
            return data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to add expense';
            toast.error(message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getExpenses = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/expense/get');
            setExpenses(data);
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch expenses';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const deleteExpense = async (id) => {
        try {
            await api.delete(`/expense/delete/${id}`);
            setExpenses(expenses.filter((expense) => expense._id !== id));
            toast.success('Expense deleted');
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete expense';
            toast.error(message);
        }
    };

    const downloadExpenses = async () => {
        try {
            const response = await api.get('/expense/download', {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'expenses.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success('Expenses downloaded!');
        } catch (error) {
            toast.error('Failed to download expenses');
        }
    };

    // Calculations
    const totalIncome = incomes.reduce((acc, income) => acc + income.amount, 0);
    const totalExpense = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    const totalBalance = totalIncome - totalExpense;

    const value = {
        user,
        incomes,
        expenses,
        loading,
        isAuthenticated,
        totalIncome,
        totalExpense,
        totalBalance,
        signup,
        login,
        logout,
        addIncome,
        getIncomes,
        deleteIncome,
        downloadIncomes,
        addExpense,
        getExpenses,
        deleteExpense,
        downloadExpenses,
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobalContext must be used within GlobalProvider');
    }
    return context;
};

export default GlobalContext;
