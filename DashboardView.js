//  MODEL: BookModel
//  Responsibility: Book data, cart, and borrow records ONLY.
//  No UI logic. No DOM. Pure data.


class BookModel {

  constructor() {
    // Seed default books if not already stored
    if (!localStorage.getItem('lms_books')) {
      const defaultBooks = [
        { id: 'BK001', title: 'To Kill a Mockingbird', author: 'Harper Lee',       category: 'Classic',        total: 4, available: 4, img: 'https://covers.openlibrary.org/b/id/8739161-M.jpg' },
        { id: 'BK002', title: 'The Great Gatsby',       author: 'F. Scott Fitzgerald', category: 'Classic',    total: 5, available: 3, img: 'https://covers.openlibrary.org/b/id/8432472-M.jpg' },
        { id: 'BK003', title: 'Clean Code',             author: 'Robert C. Martin', category: 'Technology',    total: 6, available: 6, img: 'https://covers.openlibrary.org/b/id/8459412-M.jpg' },
        { id: 'BK004', title: 'Java Programming',       author: 'Herbert Schildt',  category: 'Technology',    total: 5, available: 5, img: 'https://covers.openlibrary.org/b/id/10521086-M.jpg' },
        { id: 'BK005', title: 'Matilda',                author: 'Roald Dahl',       category: 'Fiction',       total: 4, available: 4, img: 'https://covers.openlibrary.org/b/id/12648961-M.jpg' },
        { id: 'BK006', title: '1984',                   author: 'George Orwell',    category: 'Science Fiction',total: 8, available: 1, img: 'https://covers.openlibrary.org/b/id/10527843-M.jpg' },
        { id: 'BK007', title: 'Pride and Prejudice',    author: 'Jane Austen',      category: 'Romance',       total: 7, available: 5, img: 'https://covers.openlibrary.org/b/id/8472187-M.jpg' },
        { id: 'BK008', title: 'The Hobbit',             author: 'J.R.R. Tolkien',   category: 'Fantasy',       total: 3, available: 0, img: 'https://covers.openlibrary.org/b/id/6979861-M.jpg' },
      ];
      localStorage.setItem('lms_books', JSON.stringify(defaultBooks));
    }
  }

  // ---------- Books ----------

  getAllBooks() {
    return JSON.parse(localStorage.getItem('lms_books') || '[]');
  }

  getBookById(id) {
    return this.getAllBooks().find(b => b.id === id) || null;
  }

  searchBooks(query) {
    const q = query.toLowerCase();
    return this.getAllBooks().filter(b =>
      b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    );
  }

  // ---------- Cart ----------

  getCart() {
    return JSON.parse(localStorage.getItem('lms_cart') || '[]');
  }

  addToCart(bookId) {
    const cart = this.getCart();
    if (cart.includes(bookId)) return { success: false, message: 'Already in cart.' };
    const book = this.getBookById(bookId);
    if (!book || book.available === 0) return { success: false, message: 'Book not available.' };
    cart.push(bookId);
    localStorage.setItem('lms_cart', JSON.stringify(cart));
    return { success: true, message: 'Added to cart!' };
  }

  removeFromCart(bookId) {
    const cart = this.getCart().filter(id => id !== bookId);
    localStorage.setItem('lms_cart', JSON.stringify(cart));
    return { success: true };
  }

  clearCart() {
    localStorage.setItem('lms_cart', JSON.stringify([]));
  }

  getCartBooks() {
    const cart = this.getCart();
    return this.getAllBooks().filter(b => cart.includes(b.id));
  }

  // ---------- Borrowing ----------

  confirmBorrow(username) {
    const cart = this.getCart();
    if (cart.length === 0) return { success: false, message: 'Cart is empty.' };

    // Add to borrowed records
    const allBorrowed = this._getAllBorrowed();
    if (!allBorrowed[username]) allBorrowed[username] = [];
    cart.forEach(id => {
      if (!allBorrowed[username].includes(id)) {
        allBorrowed[username].push(id);
      }
      // Decrease available count
      this._decreaseAvailable(id);
    });
    localStorage.setItem('lms_borrowed', JSON.stringify(allBorrowed));
    this.clearCart();
    return { success: true, message: 'Books borrowed successfully!' };
  }

  getBorrowedBooks(username) {
    const allBorrowed = this._getAllBorrowed();
    const ids = allBorrowed[username] || [];
    return this.getAllBooks().filter(b => ids.includes(b.id));
  }

  returnBook(username, bookId) {
    const allBorrowed = this._getAllBorrowed();
    if (!allBorrowed[username]) return { success: false };
    allBorrowed[username] = allBorrowed[username].filter(id => id !== bookId);
    localStorage.setItem('lms_borrowed', JSON.stringify(allBorrowed));
    this._increaseAvailable(bookId);
    return { success: true, message: 'Book returned.' };
  }

  // ---------- Private helpers ----------

  _getAllBorrowed() {
    return JSON.parse(localStorage.getItem('lms_borrowed') || '{}');
  }

  _decreaseAvailable(bookId) {
    const books = this.getAllBooks();
    const book = books.find(b => b.id === bookId);
    if (book && book.available > 0) book.available--;
    localStorage.setItem('lms_books', JSON.stringify(books));
  }

  _increaseAvailable(bookId) {
    const books = this.getAllBooks();
    const book = books.find(b => b.id === bookId);
    if (book) book.available++;
    localStorage.setItem('lms_books', JSON.stringify(books));
  }
}
