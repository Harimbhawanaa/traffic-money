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

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function createId(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function validateTransaction(data, categories) {
  if (!['income', 'expense'].includes(data.type)) return 'Tipe transaksi tidak valid.';
  if (!Number.isSafeInteger(data.amount) || data.amount <= 0) return 'Nominal harus berupa bilangan bulat positif.';
  if (!categories.some(c => c.id === data.categoryId && c.type === data.type)) return 'Pilih kategori yang sesuai tipe transaksi.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || Number.isNaN(Date.parse(`${data.date}T00:00:00Z`)) || new Date(`${data.date}T00:00:00Z`).toISOString().slice(0,10) !== data.date) return 'Tanggal tidak valid.';
  if (data.note.length > 200) return 'Catatan maksimal 200 karakter.';
  return null;
}

export function validateCategory(data, categories, currentId = null) {
  if (!['income', 'expense'].includes(data.type)) return 'Tipe kategori tidak valid.';
  if (!data.name.trim() || data.name.trim().length > 40) return 'Nama kategori wajib diisi (maksimal 40 karakter).';
  if (categories.some(c => c.id !== currentId && c.type === data.type && c.name.trim().toLocaleLowerCase('id') === data.name.trim().toLocaleLowerCase('id'))) return 'Nama kategori sudah digunakan pada tipe ini.';
  return null;
}
