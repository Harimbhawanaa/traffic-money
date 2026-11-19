import { getTotals } from './store.js';

const pages = [
  { id: 'overview', label: 'Overview', icon: '⌂' },
  { id: 'records', label: 'Records', icon: '▤' },
  { id: 'chart', label: 'Chart', icon: '▥' },
  { id: 'budgeting', label: 'Budgeting', icon: '◫' },
];

const rupiah = value => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function renderApp(root, state, activePage = 'overview', error = null) {
  root.replaceChildren();
  const shell = element('div', 'app-shell');
  const header = element('header', 'app-header');
  header.append(element('span', 'brand-mark', '↗'), element('strong', 'brand-name', 'Traffic Money'));
  const main = element('main', 'main-content');
  main.id = 'main-content';
  main.append(element('h1', 'page-title', pages.find(page => page.id === activePage)?.label || 'Overview'));

  if (error) {
    const message = element('p', 'notice error', error);
    message.setAttribute('role', 'alert');
    main.append(message);
  } else if (activePage === 'overview') {
    const { income, expense, balance } = getTotals(state.transactions);
    const cards = element('section', 'summary-grid');
    cards.setAttribute('aria-label', 'Ringkasan keuangan');
    for (const [label, value, className] of [
      ['Saldo', balance, 'balance'], ['Total pemasukan', income, 'income'], ['Total pengeluaran', expense, 'expense'],
    ]) {
      const card = element('article', `card ${className}`);
      card.append(element('p', 'card-label', label), element('p', 'card-value', rupiah(value)));
      cards.append(card);
    }
    main.append(cards);
    const recent = element('section', 'card recent');
    recent.append(element('h2', '', 'Transaksi terbaru'));
    const items = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
    if (!items.length) recent.append(element('p', 'muted', 'Belum ada transaksi.'));
    for (const item of items) {
      const category = state.categories.find(category => category.id === item.categoryId);
      const row = element('div', 'record-row');
      const info = element('div');
      info.append(element('strong', '', category?.name || 'Kategori tidak tersedia'), element('small', 'muted', item.date));
      row.append(info, element('span', item.type === 'income' ? 'amount-income' : 'amount-expense', `${item.type === 'income' ? '+' : '−'}${rupiah(item.amount)}`));
      recent.append(row);
    }
    main.append(recent);
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
    const icon = element('span', 'nav-icon', page.icon);
    icon.setAttribute('aria-hidden', 'true');
    button.append(icon, element('span', 'nav-label', page.label));
    nav.append(button);
  }
  shell.append(header, main, nav);
  root.append(shell);
}
