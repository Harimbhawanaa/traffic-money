/** Logika murni filter Records; tidak bergantung pada DOM. */
export function filterTransactions(transactions, categories, filters = {}) {
  const q = (filters.search || '').trim().toLocaleLowerCase('id');
  return transactions.map((item, i) => ({ item, i })).filter(({ item }) => {
    const category = categories.find(c => c.id === item.categoryId)?.name || '';
    return (!filters.type || filters.type === 'all' || item.type === filters.type) &&
      (!filters.month || filters.month === 'all' || item.date.startsWith(filters.month)) &&
      (!q || `${item.note} ${category}`.toLocaleLowerCase('id').includes(q));
  }).sort((a, b) => b.item.date.localeCompare(a.item.date) || b.i - a.i).map(({ item }) => item);
}
