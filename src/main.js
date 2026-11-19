import './style.css';
import { loadState } from './store.js';
import { renderApp } from './ui.js';

const root = document.querySelector('#app');
const { state, error } = loadState();
let activePage = 'overview';

function update() {
  renderApp(root, state, activePage, error);
}

root.addEventListener('click', event => {
  const navButton = event.target.closest('[data-page]');
  if (!navButton) return;
  activePage = navButton.dataset.page;
  update();
});

update();
