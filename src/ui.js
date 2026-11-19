import { getTotals, getBudgetUsage } from './store.js';

const pages = [
  { id: 'overview', label: 'Overview', icon: 'home' },
  { id: 'records', label: 'Records', icon: 'records' },
  { id: 'chart', label: 'Chart', icon: 'chart' },
  { id: 'budgeting', label: 'Budgeting', icon: 'budget' },
];


const iconPaths = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  records: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-8M22 20V7"/>',
  budget: '<rect x="3" y="5" width="18" height="15" rx="3"/><path d="M3 10h18M16 15h2"/>',
};
function makeIcon(name) {
  const span = element('span', 'nav-icon');
  span.setAttribute('aria-hidden', 'true');
  span.innerHTML = `<svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${iconPaths[name]}</svg>`;
  return span;
}

const rupiah = value => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function renderApp(root, state, activePage = 'overview', error = null, view = {}) {
  root.replaceChildren();
  const shell = element('div', 'app-shell');
  const header = element('header', 'app-header');
  const brand = element('div', 'brand');
  brand.append(element('span', 'brand-mark', '↗'), element('strong', 'brand-name', 'Traffic Money'));
  header.append(brand, element('span', 'header-caption', 'Personal finance dashboard'));
  const main = element('main', 'main-content');
  main.id = 'main-content';
  const pageHead = element('div', 'page-heading');
  const headingText = element('div');
  headingText.append(element('p', 'eyebrow', 'YOUR MONEY, IN CONTROL'), element('h1', 'page-title', pages.find(page => page.id === activePage)?.label || 'Overview'));
  pageHead.append(headingText);
  main.append(pageHead);

  if (error) {
    const message = element('p', 'notice error', error);
    message.setAttribute('role', 'alert');
    main.append(message);
  } else if (activePage === 'overview') {
    const { income, expense, balance } = getTotals(state.transactions);
    const cards = element('section', 'summary-grid');
    cards.setAttribute('aria-label', 'Ringkasan keuangan keseluruhan');
    for (const [label, value, className, detail] of [
      ['Saldo saat ini', balance, 'balance', 'Pemasukan − Pengeluaran'],
      ['Total pemasukan', income, 'income', 'Seluruh transaksi pemasukan'],
      ['Total pengeluaran', expense, 'expense', 'Seluruh transaksi pengeluaran'],
    ]) {
      const card = element('article', `card ${className}`);
      card.append(element('p', 'card-label', label), element('p', 'card-value', rupiah(value)), element('p', 'card-detail', detail));
      cards.append(card);
    }
    main.append(cards);
    const recent = element('section', 'card recent');
    recent.setAttribute('aria-labelledby', 'recent-title');
    const recentHeader = element('div', 'section-heading');
    const recentTitle = element('h2', '', 'Transaksi terbaru');
    recentTitle.id = 'recent-title';
    const viewAll = element('button', 'text-button', 'Lihat semua');
    viewAll.type = 'button';
    viewAll.dataset.page = 'records';
    recentHeader.append(recentTitle, viewAll);
    recent.append(recentHeader);
    const items = state.transactions.map((item, index) => ({ ...item, originalIndex: index }))
      .sort((a, b) => b.date.localeCompare(a.date) || b.originalIndex - a.originalIndex).slice(0, 5);
    if (!items.length) {
      const empty = element('div', 'empty-state');
      empty.append(element('p', 'muted', 'Belum ada transaksi.'), element('p', 'muted', 'Mulai catat pemasukan atau pengeluaran di halaman Records.'));
      const action = element('button', 'primary-button', 'Tambah transaksi');
      action.type = 'button';
      action.dataset.page = 'records';
      empty.append(action);
      recent.append(empty);
    }
    for (const item of items) {
      const category = state.categories.find(category => category.id === item.categoryId);
      const row = element('div', 'record-row');
      const info = element('div', 'record-info');
      const categoryName = element('strong', '', category?.name || 'Kategori tidak tersedia');
      const meta = element('div', 'record-meta');
      const date = /^\d{4}-\d{2}-\d{2}$/.test(item.date)
        ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${item.date}T00:00:00Z`))
        : item.date;
      meta.append(element('span', '', date));
      if (item.note) meta.append(element('span', 'record-note', item.note));
      info.append(categoryName, meta);
      row.append(info, element('span', item.type === 'income' ? 'amount-income' : 'amount-expense', `${item.type === 'income' ? '+' : '−'}${rupiah(item.amount)}`));
      recent.append(row);
    }
    main.append(recent);
  } else if (activePage === 'records') {
    renderRecords(main, state, view);
  } else if (activePage === 'chart') {
    renderChart(main, state, view);
  } else if (activePage === 'budgeting') {
    renderBudgeting(main, state, view);
  } else {
    const section = element('section', 'card placeholder');
    section.append(element('h2', '', `${pages.find(page => page.id === activePage).label} — tahap berikutnya`),
      element('p', 'muted', 'Kerangka halaman siap. Fitur akan diimplementasikan sesuai TASKS.md.'));
    main.append(section);
  }

  const nav = element('nav', 'bottom-nav');
  nav.setAttribute('aria-label', 'Navigasi utama');
  for (const page of pages) {
    const button = element('button', `nav-item ${page.id === activePage ? 'active' : ''}`);
    button.type = 'button';
    button.dataset.page = page.id;
    button.setAttribute('aria-label', page.label);
    if (page.id === activePage) button.setAttribute('aria-current', 'page');
    button.append(makeIcon(page.icon), element('span', 'nav-label', page.label));
    nav.append(button);
  }
  shell.append(header, main, nav);
  root.append(shell);
}

function control(tag, attrs = {}, text = '') {
  const el = element(tag, attrs.class || '', text);
  for (const [key, value] of Object.entries(attrs)) if (key !== 'class' && value !== null && value !== undefined) el.setAttribute(key, String(value));
  return el;
}
function button(text, action, id, style = 'secondary-button') {
  return control('button', { type: 'button', class: style, 'data-action': action, 'data-id': id }, text);
}
function field(label, name, tag, attrs = {}) {
  const wrapper = element('label', 'form-field');
  wrapper.append(element('span', '', label));
  const input = control(tag, { name, ...attrs });
  wrapper.append(input);
  return wrapper;
}
function options(select, items, selected) {
  for (const [value, label] of items) {
    const option = new Option(label, value);
    if (value === selected) option.selected = true;
    select.add(option);
  }
}
function renderRecords(main, state, view) {
  const { filters = {search:'', type:'all', month:'all'}, editor, notice } = view;
  if (notice) { const msg = element('p', 'notice', notice); msg.setAttribute('role','status'); main.append(msg); }
  const actions = element('div', 'toolbar');
  actions.append(button('+ Tambah transaksi', 'new-transaction', '', 'primary-button'), button('+ Tambah kategori', 'new-category'));
  main.append(actions);
  const filterCard = element('section', 'card');
  const filterRow = element('div', 'filter-grid');
  const search = field('Cari catatan / kategori', 'search', 'input', { type: 'search', value: filters.search, placeholder: 'Cari transaksi...', 'data-filter': 'search' });
  const type = field('Tipe', 'type', 'select', {'data-filter': 'type'});
  options(type.querySelector('select'), [['all','Semua'],['income','Pemasukan'],['expense','Pengeluaran']], filters.type);
  const month = field('Periode', 'month', 'input', {type:'month', 'data-filter':'month', value: filters.month === 'all' ? '' : filters.month});
  filterRow.append(search, type, month);
  filterCard.append(filterRow);
  main.append(filterCard);
  const list = element('section', 'card records-panel');
  list.append(element('h2', 'panel-title', 'Riwayat transaksi'));
  const q = filters.search.trim().toLocaleLowerCase('id');
  const rows = state.transactions.map((item, i) => ({item, i})).filter(({item}) => {
    const category = state.categories.find(c => c.id === item.categoryId)?.name || '';
    return (filters.type === 'all' || item.type === filters.type) && (!filters.month || filters.month === 'all' || item.date.startsWith(filters.month)) && (!q || `${item.note} ${category}`.toLocaleLowerCase('id').includes(q));
  }).sort((a,b) => b.item.date.localeCompare(a.item.date) || b.i - a.i);
  if (!rows.length) list.append(element('p','muted','Belum ada transaksi yang cocok.'));
  for (const {item} of rows) {
    const row = element('div','record-row record-manage');
    const info = element('div','record-info');
    info.append(element('strong','',state.categories.find(c=>c.id===item.categoryId)?.name || 'Kategori tidak tersedia'), element('div','record-meta',`${item.date}${item.note ? ' · '+item.note : ''}`));
    const right = element('div','record-actions');
    right.append(element('strong',item.type === 'income' ? 'amount-income':'amount-expense',`${item.type === 'income' ? '+' : '−'}${rupiah(item.amount)}`),button('Edit','edit-transaction',item.id),button('Hapus','delete-transaction',item.id,'danger-button'));
    row.append(info,right); list.append(row);
  }
  main.append(list);
  const categoryCard = element('section','card records-panel');
  categoryCard.append(element('h2','panel-title','Kelola kategori'));
  for (const c of state.categories) {
    const row = element('div','category-row');
    row.append(element('span','',`${c.name} · ${c.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}`));
    const actions = element('div','record-actions');
    actions.append(button('Edit','edit-category',c.id),button('Hapus','delete-category',c.id,'danger-button'));
    row.append(actions); categoryCard.append(row);
  }
  main.append(categoryCard);
  if (editor) renderEditor(main, state, editor);
}
function renderEditor(main, state, editor) {
  const editingTransaction = editor.kind === 'transaction';
  const existing = editingTransaction ? state.transactions.find(t => t.id === editor.id) : state.categories.find(c => c.id === editor.id);
  const card = element('section','card editor-panel');
  card.append(element('h2','panel-title',`${editor.id ? 'Edit' : 'Tambah'} ${editingTransaction ? 'transaksi' : 'kategori'}`));
  const form = control('form', {'data-form': editor.kind});
  if (editingTransaction) {
    const type = field('Tipe transaksi','type','select',{id:'transaction-type',required:true});
    options(type.querySelector('select'),[['income','Pemasukan'],['expense','Pengeluaran']],existing?.type || 'expense');
    // Pilihan awal harus konsisten dengan tipe default.
    if (!existing) type.querySelector('select').value = 'expense';
    const category = field('Kategori','categoryId','select',{id:'transaction-category',required:true});
    const currentType = existing?.type || 'expense';
    options(category.querySelector('select'),state.categories.filter(c=>c.type===currentType).map(c=>[c.id,c.name]),existing?.categoryId);
    form.append(type,field('Nominal (Rp)','amount','input',{id:'transaction-amount',type:'number',min:1,step:1,required:true,value:existing?.amount || ''}),category,field('Tanggal','date','input',{type:'date',required:true,value:existing?.date || new Date().toLocaleDateString('en-CA')}),field('Catatan (opsional)','note','input',{maxlength:200,value:existing?.note || ''}));
    const calc = element('div','calculator');
    calc.append(element('h3','','Kalkulator sederhana'),control('input',{id:'calc-first',type:'number',placeholder:'Angka pertama','aria-label':'Angka pertama'}));
    const op = control('select',{id:'calc-op','aria-label':'Operasi'});
    options(op,[['+','+'],['-','−'],['*','×'],['/','÷']],'+');
    calc.append(op,control('input',{id:'calc-second',type:'number',placeholder:'Angka kedua','aria-label':'Angka kedua'}),button('Hitung & gunakan','calculator',''));
    calc.append(control('p',{id:'calc-result','aria-live':'polite'},'Hasil akan tampil di sini.'));
    form.append(calc);
  } else {
    form.append(field('Nama kategori','name','input',{required:true,maxlength:40,value:existing?.name || ''}));
    const type = field('Tipe kategori','type','select',{required:true});
    options(type.querySelector('select'),[['expense','Pengeluaran'],['income','Pemasukan']],existing?.type || 'expense');
    form.append(type);
  }
  form.append(control('p',{'data-form-error':'',class:'form-error',role:'alert'}));
  const footer = element('div','toolbar');
  footer.append(control('button',{type:'submit',class:'primary-button'},'Simpan'),button('Batal','close-editor',''));
  form.append(footer); card.append(form);
  main.insertBefore(card,main.querySelector('.records-panel'));
}


function renderChart(main, state, view) {
  const current = new Date();
  const filters = view.chartFilters || { month: String(current.getMonth() + 1), year: String(current.getFullYear()), type: 'expense' };
  const monthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const filterCard = element('section', 'card chart-filters');
  filterCard.append(element('h2', 'panel-title', 'Periode laporan'));
  const controls = element('div', 'filter-grid');
  const month = field('Bulan', 'month', 'select', { 'data-chart-filter': 'month' });
  options(month.querySelector('select'), monthNames.map((name, index) => [String(index + 1), name]), filters.month);
  const year = field('Tahun', 'year', 'select', { 'data-chart-filter': 'year' });
  const years = new Set([current.getFullYear(), Number(filters.year)]);
  for (const transaction of state.transactions) if (/^\d{4}-\d{2}-\d{2}$/.test(transaction.date)) years.add(Number(transaction.date.slice(0, 4)));
  options(year.querySelector('select'), [...years].filter(Number.isInteger).sort((a,b) => b-a).map(y => [String(y), String(y)]), filters.year);
  const type = field('Distribusi kategori', 'type', 'select', { 'data-chart-filter': 'type' });
  options(type.querySelector('select'), [['expense', 'Pengeluaran'], ['income', 'Pemasukan']], filters.type);
  controls.append(month, year, type);
  filterCard.append(controls);
  main.append(filterCard);

  const period = `${filters.year}-${String(filters.month).padStart(2,'0')}`;
  const items = state.transactions.filter(t => t.date.startsWith(`${period}-`));
  const { income, expense } = getTotals(items);
  const summary = element('section', 'chart-summary');
  summary.setAttribute('aria-label', `Ringkasan ${monthNames[Number(filters.month)-1]} ${filters.year}`);
  for (const [label, value, cls] of [['Pemasukan periode', income, 'income'], ['Pengeluaran periode', expense, 'expense']]) {
    const card = element('article', `card ${cls}`);
    card.append(element('p', 'card-label', label), element('p', 'card-value', rupiah(value)));
    summary.append(card);
  }
  main.append(summary);

  const comparison = element('section', 'card chart-panel');
  comparison.append(element('h2', 'panel-title', 'Perbandingan pemasukan dan pengeluaran'));
  const maximum = Math.max(income, expense);
  if (maximum === 0) comparison.append(element('p', 'muted', 'Belum ada transaksi pada periode ini.'));
  for (const [label, value, cls] of [['Pemasukan', income, 'income'], ['Pengeluaran', expense, 'expense']]) {
    const row = element('div', 'chart-bar-row');
    const header = element('div', 'chart-bar-header');
    header.append(element('span', '', label), element('strong', '', rupiah(value)));
    const track = element('div', 'chart-bar-track');
    const bar = element('div', `chart-bar-fill ${cls}`);
    bar.style.width = `${maximum ? value / maximum * 100 : 0}%`;
    track.append(bar); row.append(header, track); comparison.append(row);
  }
  main.append(comparison);

  const categoryCard = element('section', 'card chart-panel');
  const typeLabel = filters.type === 'income' ? 'pemasukan' : 'pengeluaran';
  categoryCard.append(element('h2', 'panel-title', `Distribusi ${typeLabel} per kategori`));
  const categoryTotals = new Map();
  for (const item of items.filter(t => t.type === filters.type)) categoryTotals.set(item.categoryId, (categoryTotals.get(item.categoryId) || 0) + item.amount);
  const sorted = [...categoryTotals.entries()].sort((a,b) => b[1] - a[1]);
  const total = sorted.reduce((sum, [, value]) => sum + value, 0);
  if (!sorted.length) categoryCard.append(element('p', 'muted', `Belum ada ${typeLabel} pada periode ini.`));
  for (const [id, value] of sorted) {
    const name = state.categories.find(c => c.id === id)?.name || 'Kategori tidak tersedia';
    const percent = total ? value / total * 100 : 0;
    const row = element('div', 'chart-category-row');
    const header = element('div', 'chart-bar-header');
    header.append(element('strong', '', name), element('span', '', `${rupiah(value)} · ${percent.toLocaleString('id-ID', { maximumFractionDigits: 1 })}%`));
    const track = element('div', 'chart-bar-track');
    const bar = element('div', 'chart-bar-fill purple');
    bar.style.width = `${percent}%`;
    track.append(bar); row.append(header, track); categoryCard.append(row);
  }
  main.append(categoryCard);
}


function renderBudgeting(main, state, view) {
  const now = new Date();
  const filters = view.budgetFilters || { month: String(now.getMonth() + 1), year: String(now.getFullYear()) };
  const monthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  if (view.notice) { const notice = element('p','notice',view.notice); notice.setAttribute('role','status'); main.append(notice); }
  const toolbar = element('section','card budget-toolbar');
  const controls = element('div','budget-controls');
  const month = field('Bulan','month','select',{'data-budget-filter':'month'});
  options(month.querySelector('select'),monthNames.map((name,i)=>[String(i+1),name]),filters.month);
  const year = field('Tahun','year','select',{'data-budget-filter':'year'});
  const years = new Set([now.getFullYear(),Number(filters.year),...state.budgets.map(b=>Number(b.year))]);
  options(year.querySelector('select'),[...years].filter(Number.isInteger).sort((a,b)=>b-a).map(y=>[String(y),String(y)]),filters.year);
  controls.append(month,year);
  toolbar.append(controls,button('+ Tambah anggaran','new-budget','','primary-button'));
  main.append(toolbar);
  if (view.editor?.kind === 'budget') renderBudgetEditor(main,state,view.editor,filters,monthNames);
  const budgets = state.budgets.filter(b=>Number(b.month)===Number(filters.month) && Number(b.year)===Number(filters.year));
  if (!budgets.length) {
    const empty = element('section','card empty-state');
    empty.append(element('h2','panel-title','Belum ada anggaran'),element('p','muted','Buat anggaran untuk mengontrol pengeluaran bulanan.'),button('+ Tambah anggaran','new-budget','','primary-button'));
    main.append(empty); return;
  }
  const grid = element('section','budget-grid');
  grid.setAttribute('aria-label','Daftar anggaran bulanan');
  for (const budget of budgets) {
    const usage = getBudgetUsage(budget,state.transactions);
    const card = element('article','card budget-card');
    const heading = element('div','budget-heading');
    heading.append(element('h2','panel-title',state.categories.find(c=>c.id===budget.categoryId)?.name || 'Kategori tidak tersedia'));
    const actions = element('div','record-actions');
    actions.append(button('Edit','edit-budget',budget.id),button('Hapus','delete-budget',budget.id,'danger-button'));
    heading.append(actions);card.append(heading);
    for (const [label,value] of [['Batas',budget.amount],['Terpakai',usage.spent],['Sisa',usage.remaining]]) {
      const row = element('div','budget-detail');
      row.append(element('span','muted',label),element('strong',value<0?'budget-negative':'',rupiah(value)));
      card.append(row);
    }
    const track = element('div','budget-progress-track');
    track.setAttribute('role','progressbar'); track.setAttribute('aria-label','Penggunaan anggaran');
    track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax','100');
    track.setAttribute('aria-valuenow',String(Math.min(100,Math.max(0,usage.percent))));
    track.setAttribute('aria-valuetext',`${usage.percent.toLocaleString('id-ID',{maximumFractionDigits:1})}% dari anggaran`);
    const fill = element('div',`budget-progress-fill ${usage.percent>100?'over':usage.percent>=80?'warning':'safe'}`);
    fill.style.width=`${Math.min(100,Math.max(0,usage.percent))}%`;
    track.append(fill);card.append(track);
    const status = element('div','budget-status');
    status.append(element('strong','',`${usage.percent.toLocaleString('id-ID',{maximumFractionDigits:1})}%`),element('span',`budget-status-label ${usage.percent>100?'over':usage.percent>=80?'warning':'safe'}`,usage.status));
    card.append(status);grid.append(card);
  }
  main.append(grid);
}

function renderBudgetEditor(main,state,editor,filters,monthNames) {
  const existing = state.budgets.find(b=>b.id===editor.id);
  const card = element('section','card editor-panel budget-editor');
  card.append(element('h2','panel-title',`${existing?'Edit':'Tambah'} anggaran`));
  const form = control('form',{'data-form':'budget'});
  const category = field('Kategori pengeluaran','categoryId','select',{required:true});
  options(category.querySelector('select'),state.categories.filter(c=>c.type==='expense').map(c=>[c.id,c.name]),existing?.categoryId);
  if (!state.categories.some(c=>c.type==='expense')) form.append(element('p','form-error','Buat kategori pengeluaran terlebih dahulu di Records.'));
  form.append(category,field('Batas anggaran (Rp)','amount','input',{type:'number',min:1,step:1,required:true,value:existing?.amount || ''}));
  const month = field('Bulan','month','select',{required:true});
  options(month.querySelector('select'),monthNames.map((name,i)=>[String(i+1),name]),String(existing?.month ?? filters.month));
  form.append(month,field('Tahun','year','input',{type:'number',min:2000,max:2100,step:1,required:true,value:existing?.year ?? filters.year}));
  form.append(control('p',{'data-form-error':'',class:'form-error',role:'alert'}));
  const actions = element('div','toolbar');
  actions.append(control('button',{type:'submit',class:'primary-button',...(state.categories.some(c=>c.type==='expense')?{}:{disabled:'disabled'})},'Simpan'),button('Batal','close-editor',''));
  form.append(actions);card.append(form);main.append(card);
}
