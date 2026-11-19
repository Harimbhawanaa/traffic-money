import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createExampleState, getTotals, getBudgetUsage, validateTransaction, loadState, saveState, STORAGE_KEY, isStateShapeValid } from '../src/store.js';
import { filterTransactions } from '../src/filters.js';

let saved;
beforeEach(() => {
  saved = new Map();
  vi.stubGlobal('localStorage', {
    getItem: key => saved.has(key) ? saved.get(key) : null,
    setItem: (key, value) => saved.set(key, value),
  });
});

describe('filter transaksi', () => {
  it('mengembalikan kosong bila data kosong', () => expect(filterTransactions([], [], {})).toEqual([]));
  it('memfilter berdasarkan tipe', () => {
    const s = createExampleState();
    expect(filterTransactions(s.transactions, s.categories, { type: 'income' }).every(t => t.type === 'income')).toBe(true);
  });
  it('memfilter berdasarkan periode', () => {
    const s = createExampleState();
    expect(filterTransactions(s.transactions, s.categories, { month: '1999-01' })).toEqual([]);
  });
  it('mencari nama kategori tanpa membedakan kapital', () => {
    const s = createExampleState();
    const name = s.categories.find(c => c.id === s.transactions[0].categoryId).name;
    expect(filterTransactions(s.transactions, s.categories, { search: name.toUpperCase() }).length).toBeGreaterThan(0);
  });
  it('mengurutkan transaksi terbaru dahulu', () => {
    const s = createExampleState();
    const rows = filterTransactions(s.transactions, s.categories, {});
    expect(rows.map(t => t.date)).toEqual([...rows.map(t => t.date)].sort().reverse());
  });
});

describe('validasi transaksi', () => {
  it('menolak nominal nol', () => { const s=createExampleState(); expect(validateTransaction({...s.transactions[0], amount:0},s.categories)).toBeTruthy(); });
  it('menolak nominal negatif', () => { const s=createExampleState(); expect(validateTransaction({...s.transactions[0], amount:-100},s.categories)).toBeTruthy(); });
  it('menolak kategori tidak ada', () => { const s=createExampleState(); expect(validateTransaction({...s.transactions[0], categoryId:'unknown'},s.categories)).toBeTruthy(); });
  it('menolak kategori dengan tipe berbeda', () => { const s=createExampleState(); const t=s.transactions[0]; const other=s.categories.find(c=>c.type!==t.type); expect(validateTransaction({...t,categoryId:other.id},s.categories)).toBeTruthy(); });
  it('menolak tanggal kalender tidak valid', () => { const s=createExampleState(); expect(validateTransaction({...s.transactions[0],date:'2026-02-30'},s.categories)).toBeTruthy(); });
  it('menerima transaksi valid', () => { const s=createExampleState(); expect(validateTransaction(s.transactions[0],s.categories)).toBeNull(); });
});

describe('saldo dan anggaran', () => {
  it('saldo adalah pemasukan dikurangi pengeluaran', () => expect(getTotals([{type:'income',amount:1000},{type:'expense',amount:350}])).toEqual({income:1000,expense:350,balance:650}));
  it('saldo berubah setelah transaksi ditambahkan dan diedit', () => {
    const rows=[{type:'income',amount:1000}];
    rows.push({type:'expense',amount:200});
    expect(getTotals(rows).balance).toBe(800);
    rows[1].amount=500;
    expect(getTotals(rows).balance).toBe(500);
  });
  it('data transaksi kosong menghasilkan saldo nol', () => expect(getTotals([])).toEqual({income:0,expense:0,balance:0}));
  it('anggaran terlampaui menghasilkan sisa negatif', () => {
    const b={amount:100,categoryId:'food',month:11,year:2026};
    const usage=getBudgetUsage(b,[{type:'expense',categoryId:'food',date:'2026-11-03',amount:150}]);
    expect(usage).toMatchObject({spent:150,remaining:-50,percent:150,status:'Melebihi anggaran'});
  });
  it('pengeluaran periode atau kategori lain tidak dihitung', () => {
    const b={amount:100,categoryId:'food',month:11,year:2026};
    expect(getBudgetUsage(b,[{type:'expense',categoryId:'other',date:'2026-11-01',amount:50},{type:'expense',categoryId:'food',date:'2026-10-01',amount:60}]).spent).toBe(0);
  });
});

describe('parser localStorage', () => {
  it('membuat data contoh ketika belum ada data', () => expect(isStateShapeValid(loadState().state)).toBe(true));
  it('membaca data tersimpan yang valid', () => { const s=createExampleState(); saveState(s); expect(loadState()).toEqual({state:s,error:null}); });
  it('menangani JSON rusak tanpa menimpa data asli', () => { saved.set(STORAGE_KEY,'{broken'); expect(loadState().state).toBeNull(); expect(loadState().error).toBeTruthy(); expect(saved.get(STORAGE_KEY)).toBe('{broken'); });
  it('menolak payload yang struktur array-nya salah', () => { const raw=JSON.stringify({version:1,transactions:{},categories:[],budgets:[]}); saved.set(STORAGE_KEY,raw); expect(loadState().state).toBeNull(); expect(saved.get(STORAGE_KEY)).toBe(raw); });
  it('menolak entri nominal rusak tanpa menghapus data', () => { const s=createExampleState(); s.transactions[0].amount=-1; const raw=JSON.stringify(s); saved.set(STORAGE_KEY,raw); expect(loadState().state).toBeNull(); expect(saved.get(STORAGE_KEY)).toBe(raw); });
});
