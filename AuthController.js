
//  CONTROLLER: AuthController
//  Responsibility: Handle login/signup user actions.
//  Connects AuthView (UI) <-> UserModel (data).

class AuthController {

  constructor(userModel, authView, appController) {
    this.userModel = userModel;
    this.authView = authView;
    this.app = appController;
  }

  // ---------- Show Pages ----------

  showLogin() {
    this.authView.renderLogin();
    this._bindLoginEvents();
  }

  showSignup() {
    this.authView.renderSignup();
    this._bindSignupEvents();
  }

  // ---------- Actions ----------

  handleLogin() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    const result = this.userModel.login(username, password);

    if (result.success) {
      this.authView.showMessage('Login successful!', 'success');
      setTimeout(() => this.app.navigate('dashboard'), 800);
    } else {
      this.authView.showMessage(result.message, 'error');
    }
  }

  handleRegister() {
    const fullname = document.getElementById('reg-fullname').value.trim();
    const username = document.getElementById('reg-username').value.trim();
    const dob      = document.getElementById('reg-dob').value;
    const nic      = document.getElementById('reg-nic').value.trim();
    const password = document.getElementById('reg-password').value;

    const result = this.userModel.register(fullname, username, dob, nic, password);

    if (result.success) {
      this.authView.showMessage('Account created! Redirecting to login...', 'success');
      setTimeout(() => this.showLogin(), 1200);
    } else {
      this.authView.showMessage(result.message, 'error');
    }
  }

  // ---------- Event Binding ----------

  _bindLoginEvents() {
    document.getElementById('btn-login')
      .addEventListener('click', () => this.handleLogin());

    document.getElementById('go-signup')
      .addEventListener('click', (e) => { e.preventDefault(); this.showSignup(); });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && document.getElementById('login-password')) this.handleLogin();
    }, { once: true });
  }

  _bindSignupEvents() {
    document.getElementById('btn-register')
      .addEventListener('click', () => this.handleRegister());

    document.getElementById('go-login')
      .addEventListener('click', (e) => { e.preventDefault(); this.showLogin(); });

    // Show filename when NIC uploaded
    document.getElementById('nic-front').addEventListener('change', function () {
      document.getElementById('nic-front-label').textContent = '✅ ' + (this.files[0]?.name || 'NIC Front');
    });
    document.getElementById('nic-back').addEventListener('change', function () {
      document.getElementById('nic-back-label').textContent = '✅ ' + (this.files[0]?.name || 'NIC Back');
    });
  }
}
