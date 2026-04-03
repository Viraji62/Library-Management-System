
class SearchView {

  render(user, books, cartIds) {
    document.getElementById('app').innerHTML = `
      <div class="app-wrapper">
        ${this._sidebar('search')}
        <main class="main-content">
          <div class="topbar">
            <h1>Search Books</h1>
            ${this._topbarUser(user.fullname)}
          </div>
          <div class="search-bar-wrap">
            <span>🔍</span>
            <input type="text" id="search-input" placeholder="Search by title or author..."/>
          </div>
          <div class="search-results" id="books-grid">
            ${this._renderBookCards(books, cartIds)}
          </div>
        </main>
      </div>
    `;
  }

  // Re-renders just the book grid (called on search/filter)
  updateGrid(books, cartIds) {
    const grid = document.getElementById('books-grid');
    if (grid) grid.innerHTML = this._renderBookCards(books, cartIds);
  }

  _renderBookCards(books, cartIds) {
    if (books.length === 0) return '<p style="color:#94a3b8;font-size:14px;grid-column:1/-1;">No books found.</p>';
    return books.map(b => {
      const inCart = cartIds.includes(b.id);
      const unavailable = b.available === 0;
      return `
        <div class="search-book-card">
          <img src="${b.img}" alt="${b.title}" onerror="this.src='https://placehold.co/90x115?text=Book'"/>
          <div class="title">${b.title}</div>
          <div class="author">${b.author}</div>
          <button
            class="btn-borrow ${inCart ? 'added' : ''}"
            data-id="${b.id}"
            ${unavailable ? 'disabled style="background:#e2e8f0;color:#94a3b8;cursor:not-allowed"' : ''}>
            ${unavailable ? 'Unavailable' : inCart ? 'Added ✓' : 'Borrow'}
          </button>
        </div>`;
    }).join('');
  }

  showMessage(message, type = '') {
    this._removeToast();
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = `toast show ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => this._removeToast(), 3000);
  }

  _removeToast() {
    const old = document.getElementById('toast');
    if (old) old.remove();
  }

  _topbarUser(name) {
    return `<div class="topbar-user"><span class="user-icon">👤</span><span>${name}</span></div>`;
  }

  _sidebar(active) {
    const items = [
      { key: 'dashboard',    label: 'Dashboard',    icon: '⊞' },
      { key: 'search',       label: 'Search Books', icon: '▦' },
      { key: 'availability', label: 'Availability', icon: '📅' },
      { key: 'barcode',      label: 'My Bar Code',  icon: '⬤' },
      { key: 'cart',         label: 'Update',       icon: '🔄' },
    ];
    return `
      <aside class="sidebar">
        <div class="sidebar-logo">
          <span class="logo-icon">📖</span><span>LMS</span>
        </div>
        <nav class="sidebar-nav">
          ${items.map(i => `
            <button class="nav-item ${active === i.key ? 'active' : ''}" data-page="${i.key}">
              <span class="icon">${i.icon}</span> ${i.label}
            </button>`).join('')}
        </nav>
        <div class="sidebar-logout">
          <button class="btn-logout" id="btn-logout">Logout</button>
        </div>
      </aside>`;
  }
}
