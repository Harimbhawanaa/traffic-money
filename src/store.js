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

const validId = value => typeof value === 'string' && value.length > 0 && value.length <= 120;
const validAmount = value => Number.isSafeInteger(value) && value > 0;
const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) &&
  new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
const uniqueIds = items => new Set(items.map(item => item.id)).size === items.length;

/** Validasi seluruh entri dan relasi sebelum data lokal dipakai oleh UI. */
export function isStateShapeValid(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || value.version !== 1 ||
      !Array.isArray(value.transactions) || !Array.isArray(value.categories) || !Array.isArray(value.budgets)) return false;
  const { transactions, categories, budgets } = value;
  if (![transactions, categories, budgets].every(uniqueIds)) return false;
  if (!categories.every(c => c && validId(c.id) && typeof c.name === 'string' &&
      c.name.trim().length > 0 && c.name.trim().length <= 40 && ['income', 'expense'].includes(c.type))) return false;
  const categoryMap = new Map(categories.map(c => [c.id, c]));
  if (!transactions.every(t => t && validId(t.id) && ['income', 'expense'].includes(t.type) &&
      validAmount(t.amount) && validDate(t.date) && typeof t.note === 'string' &&
      t.note.length <= 200 && categoryMap.get(t.categoryId)?.type === t.type)) return false;
  if (!budgets.every(b => b && validId(b.id) && validAmount(b.amount) &&
      Number.isInteger(b.month) && b.month >= 1 && b.month <= 12 &&
      Number.isInteger(b.year) && b.year >= 2000 && b.year <= 2100 &&
      categoryMap.get(b.categoryId)?.type === 'expense')) return false;
  return new Set(budgets.map(b => `${b.categoryId}:${b.year}:${b.month}`)).size === budgets.length;
}

/** Jangan menimpa data tersimpan yang gagal dibaca atau tidak valid. */
export function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) {
      const state = createExampleState();
      saveState(state);
      return { state, error: null };
    }
    const state = JSON.parse(saved);
    if (!isStateShapeValid(state)) throw new Error('Struktur atau isi data tidak valid. Data asli tetap tersimpan.');
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
  if (!isStateShapeValid(state)) throw new Error('State tidak valid; penyimpanan dibatalkan.');
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


export function validateBudget(item, budgets, categories, currentId = null) {
  if (!categories.some(c => c.id === item.categoryId && c.type === 'expense')) return 'Pilih kategori pengeluaran yang valid.';
  if (!Number.isSafeInteger(item.amount) || item.amount <= 0) return 'Nominal anggaran harus bilangan bulat positif.';
  if (!Number.isInteger(item.month) || item.month < 1 || item.month > 12) return 'Bulan harus antara 1–12.';
  if (!Number.isInteger(item.year) || item.year < 2000 || item.year > 2100) return 'Tahun harus antara 2000–2100.';
  if (budgets.some(b => b.id !== currentId && b.categoryId === item.categoryId && Number(b.month) === item.month && Number(b.year) === item.year)) return 'Anggaran untuk kategori dan periode ini sudah ada.';
  return null;
}

export function getBudgetUsage(budget, transactions) {
  const period = `${budget.year}-${String(budget.month).padStart(2, '0')}-`;
  const spent = transactions.filter(t => t.type === 'expense' && t.categoryId === budget.categoryId && t.date.startsWith(period)).reduce((sum, t) => sum + t.amount, 0);
  const remaining = budget.amount - spent;
  const percent = spent / budget.amount * 100;
  return { spent, remaining, percent, status: percent > 100 ? 'Melebihi anggaran' : percent >= 80 ? 'Mendekati batas' : 'Aman' };
}
