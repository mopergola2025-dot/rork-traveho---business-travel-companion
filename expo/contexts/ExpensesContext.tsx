import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: string;
  category: 'transport' | 'food' | 'accommodation' | 'entertainment' | 'other';
  date: string;
  hasReceipt: boolean;
}

export interface ScannedReceipt {
  id: string;
  date: string;
  imageUri?: string;
}

const EXPENSES_STORAGE_KEY = 'traveho_expenses';
const RECEIPTS_STORAGE_KEY = 'traveho_receipts';

export const [ExpensesContext, useExpenses] = createContextHook(() => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [scannedReceipts, setScannedReceipts] = useState<ScannedReceipt[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveData();
    }
  }, [expenses, scannedReceipts]);

  const loadData = async () => {
    try {
      const [storedExpenses, storedReceipts] = await Promise.all([
        AsyncStorage.getItem(EXPENSES_STORAGE_KEY),
        AsyncStorage.getItem(RECEIPTS_STORAGE_KEY),
      ]);

      if (storedExpenses) {
        setExpenses(JSON.parse(storedExpenses));
      }
      if (storedReceipts) {
        setScannedReceipts(JSON.parse(storedReceipts));
      }
    } catch (error) {
      console.error('Error loading expenses data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses)),
        AsyncStorage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify(scannedReceipts)),
      ]);
    } catch (error) {
      console.error('Error saving expenses data:', error);
    }
  };

  const addExpense = (expense: Expense) => {
    setExpenses(prev => [expense, ...prev]);
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, ...updates } : exp));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const addReceipt = (receipt: ScannedReceipt) => {
    setScannedReceipts(prev => [receipt, ...prev]);
  };

  const deleteReceipt = (id: string) => {
    setScannedReceipts(prev => prev.filter(receipt => receipt.id !== id));
  };

  return {
    expenses,
    scannedReceipts,
    isLoading,
    addExpense,
    updateExpense,
    deleteExpense,
    addReceipt,
    deleteReceipt,
  };
});
