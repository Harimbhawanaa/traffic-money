import './style.css';
import { loadState, saveState, createId, validateTransaction, validateCategory, validateBudget } from './store.js';
import { renderApp } from './ui.js';
import { commitState } from './commit.js';

const root = document.querySelector('#app');
const loaded = loadState();
let state = loaded.state;
let error = loaded.error;
let activePage = 'overview';
let notice = '';
const filters = { search: '', type: 'all', month: 'all' };
const now = new Date();
const chartFilters = { month: String(now.getMonth() + 1), year: String(now.getFullYear()), type: 'expense' };
let editor = null;
const budgetFilters = { month: String(now.getMonth() + 1), year: String(now.getFullYear()) };

function update() {
  renderApp(root, state, activePage, error, { filters, chartFilters, budgetFilters, editor, notice });
}
function commit(mutator, message) {
  const result = commitState(state, mutator, saveState);
  if (result.errorType) {
    notice = result.errorType === 'validation'
      ? 'Perubahan tidak valid; data sebelumnya tetap tersimpan.'
      : result.errorType === 'storage'
        ? 'Penyimpanan lokal gagal. Periksa kapasitas atau izin browser.'
        : 'Perubahan gagal diproses. Data sebelumnya tetap tersimpan.';
    update();
    return;
  }
  state = result.state;
  notice = message;
  editor = null;
  update();
}
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
root.addEventListener('click', event => {
  const nav = event.target.closest('[data-page]');
  if (nav) { activePage = nav.dataset.page; editor = null; notice = ''; update(); return; }
  const action = event.target.closest('[data-action]');
  if (!action || !state) return;
  const { action: kind, id } = action.dataset;
  if (kind === 'new-transaction') editor = { kind: 'transaction', id: null };
  if (kind === 'edit-transaction') editor = { kind: 'transaction', id };
  if (kind === 'new-category') editor = { kind: 'category', id: null };
  if (kind === 'edit-category') editor = { kind: 'category', id };
  if (kind === 'new-budget') editor = { kind: 'budget', id: null };
  if (kind === 'edit-budget') editor = { kind: 'budget', id };
  if (kind === 'delete-budget') {
    if (!window.confirm('Hapus anggaran ini?')) return;
    commit(next => { next.budgets = next.budgets.filter(b => b.id !== id); }, 'Anggaran berhasil dihapus.');
    return;
  }
  if (kind === 'close-editor') editor = null;
  if (kind === 'delete-transaction') {
    if (!window.confirm('Hapus transaksi ini?')) return;
    commit(next => { next.transactions = next.transactions.filter(t => t.id !== id); }, 'Transaksi berhasil dihapus.');
    return;
  }
  if (kind === 'delete-category') {
    if (state.transactions.some(t => t.categoryId === id) || state.budgets.some(b => b.categoryId === id)) {
      notice = 'Kategori sedang digunakan transaksi atau anggaran, sehingga tidak dapat dihapus.'; update(); return;
    }
    if (!window.confirm('Hapus kategori ini?')) return;
    commit(next => { next.categories = next.categories.filter(c => c.id !== id); }, 'Kategori berhasil dihapus.');
    return;
  }
  if (kind === 'calculator') {
    const firstRaw = root.querySelector('#calc-first')?.value;
    const secondRaw = root.querySelector('#calc-second')?.value;
    const first = firstRaw?.trim() ? Number(firstRaw) : NaN;
    const second = secondRaw?.trim() ? Number(secondRaw) : NaN;
    const op = document.querySelector('#calc-op')?.value;
    const result = !Number.isFinite(first) || !Number.isFinite(second) ? NaN :
      op === '+' ? first + second : op === '-' ? first - second : op === '*' ? first * second : op === '/' && second !== 0 ? first / second : NaN;
    const output = document.querySelector('#calc-result');
    if (output) output.textContent = Number.isFinite(result) ? `Hasil: ${result.toLocaleString('id-ID')}` : 'Operasi tidak valid (termasuk pembagian dengan nol).';
    const amount = document.querySelector('#transaction-amount');
    if (amount && Number.isSafeInteger(result) && result > 0) amount.value = String(result);
    return;
  }
  update();
});
root.addEventListener('input', event => {
  if (event.target.matches('[data-filter="search"]')) {
    filters.search = event.target.value;
    const focused = 'search';
    const cursor = event.target.selectionStart;
    update();
    const target = root.querySelector(`[data-filter="${focused}"]`);
    target?.focus();
    if (target?.type === 'search' && cursor !== null) target.setSelectionRange(cursor, cursor);
  }
});
root.addEventListener('change', event => {
  if (event.target.matches('[data-budget-filter]')) {
    budgetFilters[event.target.dataset.budgetFilter] = event.target.value;
    editor = null; update(); return;
  }
  if (event.target.matches('[data-chart-filter]')) {
    chartFilters[event.target.dataset.chartFilter] = event.target.value;
    update();
    return;
  }
  if (event.target.matches('[data-filter]')) { filters[event.target.dataset.filter] = event.target.value; update(); }
  if (event.target.id === 'transaction-type') {
    const select = root.querySelector('#transaction-category');
    select.replaceChildren();
    for (const category of state.categories.filter(c => c.type === event.target.value)) select.add(new Option(category.name, category.id));
  }
});
root.addEventListener('submit', event => {
  if (!event.target.matches('[data-form]') || !state) return;
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  const id = editor?.id;
  if (form.dataset.form === 'transaction') {
    const item = { id: id || createId('tx'), type: data.get('type'), amount: Number(data.get('amount')), categoryId: data.get('categoryId'), date: data.get('date') || today(), note: String(data.get('note') || '').trim() };
    const problem = validateTransaction(item, state.categories);
    if (problem) { form.querySelector('[data-form-error]').textContent = problem; return; }
    commit(next => { const i = next.transactions.findIndex(t => t.id === id); if (i < 0) next.transactions.push(item); else next.transactions[i] = item; }, id ? 'Transaksi diperbarui.' : 'Transaksi ditambahkan.');
  } else if (form.dataset.form === 'budget') {
    const item = { id: id || createId('budget'), categoryId: String(data.get('categoryId')), amount: Number(data.get('amount')), month: Number(data.get('month')), year: Number(data.get('year')) };
    const problem = validateBudget(item, state.budgets, state.categories, id);
    if (problem) { form.querySelector('[data-form-error]').textContent = problem; return; }
    commit(next => { const i = next.budgets.findIndex(b => b.id === id); if (i < 0) next.budgets.push(item); else next.budgets[i] = item; }, id ? 'Anggaran diperbarui.' : 'Anggaran ditambahkan.');
  } else {
    const original = state.categories.find(c => c.id === id);
    const item = { id: id || createId('cat'), name: String(data.get('name') || '').trim(), type: data.get('type') };
    const problem = validateCategory(item, state.categories, id);
    if (problem) { form.querySelector('[data-form-error]').textContent = problem; return; }
    if (original && original.type !== item.type && (state.transactions.some(t => t.categoryId === id) || state.budgets.some(b => b.categoryId === id))) {
      form.querySelector('[data-form-error]').textContent = 'Tipe kategori yang sedang digunakan tidak boleh diubah.'; return;
    }
    commit(next => { const i = next.categories.findIndex(c => c.id === id); if (i < 0) next.categories.push(item); else next.categories[i] = item; }, id ? 'Kategori diperbarui.' : 'Kategori ditambahkan.');
  }
});
update();
