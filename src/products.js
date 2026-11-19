/** Data contoh fiktif untuk workshop. Nama modul mengikuti struktur yang diminta. */
export const exampleCategories = [
  { id: 'cat-salary', name: 'Gaji', type: 'income' },
  { id: 'cat-food', name: 'Makanan', type: 'expense' },
  { id: 'cat-transport', name: 'Transportasi', type: 'expense' },
];

export const exampleTransactions = [
  { id: 'tx-1', type: 'income', amount: 3000000, categoryId: 'cat-salary', date: '2026-11-01', note: 'Gaji contoh' },
  { id: 'tx-2', type: 'expense', amount: 75000, categoryId: 'cat-food', date: '2026-11-02', note: 'Makan siang contoh' },
];

export const exampleBudgets = [
  { id: 'budget-1', categoryId: 'cat-food', amount: 600000, month: 11, year: 2026 },
];
