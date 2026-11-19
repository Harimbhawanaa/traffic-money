import { exampleCategories, exampleTransactions, exampleBudgets } from './products.js';

export const STORAGE_KEY = 'traffic-money:v1';

export function createExampleState() {
  return {
    version: 1,
    transactions: structuredClone(exampleTransactions),
    categories: structuredClone(exampleCategories),
    budgets: structuredClone(exampleBudgets),
  };
}

export function isStateShapeValid(value) {
  return value !== null && typeof value === 'object' && value.version === 1 &&
    Array.isArray(value.transactions) && Array.isArray(value.categories) && Array.isArray(value.budgets);
}

/** Membaca data tanpa menimpa data rusak atau storage yang tidak dapat diakses. */
export function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) {
      const state = createExampleState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return { state, error: null };
    }
    const state = JSON.parse(saved);
    if (!isStateShapeValid(state)) throw new Error('Struktur data tidak valid.');
    return { state, error: null };
  } catch (error) {
    return { state: null, error: `Data lokal tidak dapat dibaca: ${error.message}` };
  }
}

export function getTotals(transactions) {
  const income = transactions.filter(item => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
  const expense = transactions.filter(item => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
  return { income, expense, balance: income - expense };
}
