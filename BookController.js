//  Responsibility: Handle all book interactions.
//  Connects Views <-> BookModel + UserModel.


class BookController {

  constructor(bookModel, userModel, dashboardView, searchView, availabilityView, barcodeView, cartView, appController) {
    this.bookModel       = bookModel;
    this.userModel       = userModel;
    this.dashboardView   = dashboardView;
    this.searchView      = searchView;
    this.availabilityView= availabilityView;
    this.barcodeView     = barcodeView;
    this.cartView        = cartView;
    this.app             = appController;
  }

  // ---------- Dashboard ----------

  showDashboard() {
    const user          = this.userModel.getCurrentUser();
    const borrowedBooks = this.bookModel.getBorrowedBooks(user.username);
    const totalAvailable= this.bookModel.getAllBooks().filter(b => b.available > 0).length;

    this.dashboardView.render(user, borrowedBooks, totalAvailable);
    this._bindSidebarAndLogout(this.dashboardView);

    // Return book buttons
    document.querySelectorAll('.btn-return').forEach(btn => {
      btn.addEventListener('click', () => {
        const bookId = btn.dataset.id;
        const result = this.bookModel.returnBook(user.username, bookId);
        if (result.success) {
          this.dashboardView.showMessage('Book returned!', 'success');
          setTimeout(() => this.showDashboard(), 600);
        }
      });
    });
  }

  // ---------- Search ----------

  showSearch() {
    const user   = this.userModel.getCurrentUser();
    const books  = this.bookModel.getAllBooks();
    const cartIds= this.bookModel.getCart();

    this.searchView.render(user, books, cartIds);
    this._bindSidebarAndLogout(this.searchView);

    // Live search
    document.getElementById('search-input').addEventListener('input', (e) => {
      const results  = this.bookModel.searchBooks(e.target.value);
      const cartIds2 = this.bookModel.getCart();
      this.searchView.updateGrid(results, cartIds2);
      this._bindBorrowButtons();
    });

    this._bindBorrowButtons();
  }

  _bindBorrowButtons() {
    document.querySelectorAll('.btn-borrow').forEach(btn => {
      btn.addEventListener('click', () => {
        const bookId = btn.dataset.id;
        if (btn.classList.contains('added')) {
          this.bookModel.removeFromCart(bookId);
          btn.textContent = 'Borrow';
          btn.classList.remove('added');
          this.searchView.showMessage('Removed from cart.');
        } else {
          const result = this.bookModel.addToCart(bookId);
          if (result.success) {
            btn.textContent = 'Added ✓';
            btn.classList.add('added');
            this.searchView.showMessage('Added to cart!', 'success');
          } else {
            this.searchView.showMessage(result.message, 'error');
          }
        }
      });
    });
  }

  // ---------- Availability ----------

  showAvailability() {
    const user  = this.userModel.getCurrentUser();
    const books = this.bookModel.getAllBooks();
    this.availabilityView.render(user, books);
    this._bindSidebarAndLogout(this.availabilityView);
  }

  // ---------- Barcode ----------

  showBarcode() {
    const user      = this.userModel.getCurrentUser();
    const cartBooks = this.bookModel.getCartBooks();
    this.barcodeView.render(user, cartBooks);
    this._bindSidebarAndLogout(this.barcodeView);

    document.getElementById('btn-confirm-borrow').addEventListener('click', () => {
      this._confirmBorrow(this.barcodeView);
    });

    document.getElementById('btn-clear-cart').addEventListener('click', () => {
      this.bookModel.clearCart();
      this.barcodeView.showMessage('Cart cleared.');
      this.barcodeView.updateCartPreview([]);
    });
  }

  // ---------- Cart ----------

  showCart() {
    const user      = this.userModel.getCurrentUser();
    const cartBooks = this.bookModel.getCartBooks();
    this.cartView.render(user, cartBooks);
    this._bindSidebarAndLogout(this.cartView);

    document.getElementById('btn-confirm-borrow').addEventListener('click', () => {
      this._confirmBorrow(this.cartView);
    });

    document.getElementById('btn-clear-all').addEventListener('click', () => {
      this.bookModel.clearCart();
      this.cartView.showMessage('Cart cleared.');
      this.cartView.updateCartItems([]);
    });

    // Delete individual item
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-delete') && e.target.dataset.id) {
        this.bookModel.removeFromCart(e.target.dataset.id);
        this.cartView.showMessage('Removed from cart.');
        this.cartView.updateCartItems(this.bookModel.getCartBooks());
      }
    }, { once: true });
  }

  // ---------- Shared ----------

  _confirmBorrow(view) {
    const user   = this.userModel.getCurrentUser();
    const result = this.bookModel.confirmBorrow(user.username);
    if (result.success) {
      view.showMessage(result.message + ' 🎉', 'success');
      setTimeout(() => this.showDashboard(), 1200);
    } else {
      view.showMessage(result.message, 'error');
    }
  }

  _bindSidebarAndLogout(view) {
    // Sidebar navigation
    document.querySelectorAll('[data-page]').forEach(btn => {
      btn.addEventListener('click', () => this.app.navigate(btn.dataset.page));
    });

    // Logout
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.userModel.logout();
        this.app.navigate('login');
      });
    }
  }
}
