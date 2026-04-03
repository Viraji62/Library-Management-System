
//  CONTROLLER: AppController  (Main Router)

//    User Action → Controller → Model (data) → View (render)

class AppController {

  constructor() {
    // ---------- Models ----------
    this.userModel = new UserModel();
    this.bookModel = new BookModel();

    // ---------- Views ----------
    this.authView        = new AuthView();
    this.dashboardView   = new DashboardView();
    this.searchView      = new SearchView();
    this.availabilityView= new AvailabilityView();
    this.barcodeView     = new BarcodeView();
    this.cartView        = new CartView();

    // ---------- Controllers ----------
    this.authController = new AuthController(
      this.userModel,
      this.authView,
      this
    );
    this.bookController = new BookController(
      this.bookModel,
      this.userModel,
      this.dashboardView,
      this.searchView,
      this.availabilityView,
      this.barcodeView,
      this.cartView,
      this
    );
  }

  // ---------- Router ----------
  // Central navigation: all page changes go through here.

  navigate(page) {
    const isLoggedIn = this.userModel.isLoggedIn();

    // Guard: redirect to login if not authenticated
    const protectedPages = ['dashboard', 'search', 'availability', 'barcode', 'cart'];
    if (protectedPages.includes(page) && !isLoggedIn) {
      this.authController.showLogin();
      return;
    }

    // Guard: redirect to dashboard if already logged in
    if ((page === 'login' || page === 'signup') && isLoggedIn) {
      this.bookController.showDashboard();
      return;
    }

    switch (page) {
      case 'login':        this.authController.showLogin();              break;
      case 'signup':       this.authController.showSignup();             break;
      case 'dashboard':    this.bookController.showDashboard();          break;
      case 'search':       this.bookController.showSearch();             break;
      case 'availability': this.bookController.showAvailability();       break;
      case 'barcode':      this.bookController.showBarcode();            break;
      case 'cart':         this.bookController.showCart();               break;
      default:             this.authController.showLogin();              break;
    }

    // Update browser tab title instead of URL
    document.title = `LMS - ${page.charAt(0).toUpperCase() + page.slice(1)}`;
  }

  // ---------- Boot ----------

  start() {
    // Always start from login (or dashboard if already logged in)
    this.navigate('login');
  }
}

//  BOOT: Start the application when DOM is ready

document.addEventListener('DOMContentLoaded', () => {
  const app = new AppController();
  app.start();
});
