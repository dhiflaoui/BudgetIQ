export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  note?: string;
  date: string;
}

export interface Budget {
  [category: string]: number;
}

export interface Settings {
  currency: string;
  theme: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface CategoryExpenses {
  [category: string]: number;
}

export interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget;
  settings: Settings;
  isLoading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => Promise<boolean>;
  deleteTransaction: (id: string) => Promise<boolean>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<boolean>;
  setBudget: (category: string, amount: number) => Promise<boolean>;
  deleteBudget: (category: string) => Promise<boolean>;
  updateSettings: (settings: Settings) => Promise<boolean>;
  clearAllData: () => Promise<boolean>;
  getBalance: () => number;
  getIncomeTotal: (startDate?: Date, endDate?: Date) => number;
  getExpenseTotal: (startDate?: Date, endDate?: Date) => number;
  getCategoryExpenses: (startDate?: Date, endDate?: Date) => CategoryExpenses;
  getTransactionsByDateRange: (startDate: Date, endDate: Date) => Transaction[];
}