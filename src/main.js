import './style.css';
import { loadState, saveState, createId, validateTransaction, validateCategory } from './store.js';
import { renderApp } from './ui.js';

const root = document.querySelector('#app');
const loaded = loadState();
let state = loaded.state;
let error = loaded.error;
let activePage = 'overview';
let notice = '';
const filters = { search: '', type: 'all', month: 'all' };
let editor = null;

function update() {
  renderApp(root, state, activePage, error, { filters, editor, notice });
}
function commit(mutator, message) {
  const next = structuredClone(state);
  mutator(next);
  try {
    saveState(next);
    state = next;
    notice = message;
    editor = null;
    update();
  } catch {
    notice = 'Penyimpanan lokal gagal. Periksa kapasitas atau izin browser.';
    update();
  }
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
    const first = Number(document.querySelector('#calc-first')?.value);
    const second = Number(document.querySelector('#calc-second')?.value);
    const op = document.querySelector('#calc-op')?.value;
    const result = op === '+' ? first + second : op === '-' ? first - second : op === '*' ? first * second : second === 0 ? NaN : first / second;
    const output = document.querySelector('#calc-result');
    if (output) output.textContent = Number.isFinite(result) ? `Hasil: ${result.toLocaleString('id-ID')}` : 'Operasi tidak valid (termasuk pembagian dengan nol).';
    const amount = document.querySelector('#transaction-amount');
    if (amount && Number.isSafeInteger(result) && result > 0) amount.value = String(result);
    return;
  }
  update();
});
root.addEventListener('input', event => {
  if (event.target.matches('[data-filter]')) {
    filters[event.target.dataset.filter] = event.target.value;
    const focused = event.target.dataset.filter;
    const cursor = event.target.selectionStart;
    update();
    const target = root.querySelector(`[data-filter="${focused}"]`);
    target?.focus();
    if (target?.tagName === 'INPUT') target.setSelectionRange(cursor, cursor);
  }
});
root.addEventListener('change', event => {
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
