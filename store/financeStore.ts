import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Transaction, Budget, Settings, CategoryExpenses } from '../types';

interface FinanceState {
  // State
  transactions: Transaction[];
  budgets: Budget;
  settings: Settings;
  isLoading: boolean;

  // Transaction Actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  
  // Budget Actions
  setBudget: (category: string, amount: number) => void;
  deleteBudget: (category: string) => void;
  
  // Settings Actions
  updateSettings: (settings: Partial<Settings>) => void;
  
  // Data Management
  clearAllData: () => void;
  setLoading: (loading: boolean) => void;
  
  // Computed Values (Selectors)
  getBalance: () => number;
  getIncomeTotal: (startDate?: Date, endDate?: Date) => number;
  getExpenseTotal: (startDate?: Date, endDate?: Date) => number;
  getCategoryExpenses: (startDate?: Date, endDate?: Date) => CategoryExpenses;
  getTransactionsByDateRange: (startDate: Date, endDate: Date) => Transaction[];
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      // Initial State
      transactions: [],
      budgets: {},
      settings: {
        currency: 'USD',
        theme: 'dark',
      },
      isLoading: false,

      // Transaction Actions
      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          date: new Date().toISOString(),
        };
        
        set((state) => ({
          transactions: [...state.transactions, newTransaction],
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },

      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },

      // Budget Actions
      setBudget: (category, amount) => {
        set((state) => ({
          budgets: {
            ...state.budgets,
            [category]: amount,
          },
        }));
      },

      deleteBudget: (category) => {
        set((state) => {
          const newBudgets = { ...state.budgets };
          delete newBudgets[category];
          return { budgets: newBudgets };
        });
      },

      // Settings Actions
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
          },
        }));
      },

      // Data Management
      clearAllData: () => {
        set({
          transactions: [],
          budgets: {},
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // Computed Values (Selectors)
      getBalance: () => {
        const { transactions } = get();
        return transactions.reduce((acc, t) => {
          return t.type === 'income' ? acc + t.amount : acc - t.amount;
        }, 0);
      },

      getIncomeTotal: (startDate, endDate) => {
        const { transactions } = get();
        return transactions
          .filter(
            (t) =>
              t.type === 'income' &&
              (!startDate || new Date(t.date) >= startDate) &&
              (!endDate || new Date(t.date) <= endDate)
          )
          .reduce((acc, t) => acc + t.amount, 0);
      },

      getExpenseTotal: (startDate, endDate) => {
        const { transactions } = get();
        return transactions
          .filter(
            (t) =>
              t.type === 'expense' &&
              (!startDate || new Date(t.date) >= startDate) &&
              (!endDate || new Date(t.date) <= endDate)
          )
          .reduce((acc, t) => acc + t.amount, 0);
      },

      getCategoryExpenses: (startDate, endDate) => {
        const { transactions } = get();
        const categoryTotals: CategoryExpenses = {};
        
        transactions
          .filter(
            (t) =>
              t.type === 'expense' &&
              (!startDate || new Date(t.date) >= startDate) &&
              (!endDate || new Date(t.date) <= endDate)
          )
          .forEach((t) => {
            categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
          });
        
        return categoryTotals;
      },

      getTransactionsByDateRange: (startDate, endDate) => {
        const { transactions } = get();
        return transactions.filter(
          (t) =>
            new Date(t.date) >= startDate && new Date(t.date) <= endDate
        );
      },
    }),
    {
      name: 'finance-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useFinance = () => useFinanceStore((state) => state);
export const useTransactions = () => useFinanceStore((state) => state.transactions);