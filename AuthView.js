
//  Responsibility: Render login and signup HTML ONLY.

class AuthView {

  // Renders the Login page into #app
  renderLogin() {
    document.getElementById('app').innerHTML = `
      <div class="auth-wrapper">
        <div class="auth-container">
          <div class="auth-left">
            <div class="logo-icon">📖</div>
            <h2>Welcome Back to LMS</h2>
            <p>Access books easily. Borrow and return anytime.</p>
          </div>
          <div class="auth-right">
            <div class="auth-card">
              <h3>Login</h3>
              <div class="form-group">
                <label>Username</label>
                <input type="text" id="login-username" placeholder="Enter your Username"/>
              </div>
              <div class="form-group">
                <label>Password</label>
                <input type="password" id="login-password" placeholder="Enter your password"/>
              </div>
              <a href="#" class="forgot-link" id="forgot-link">Forgot Password ?</a>
              <button class="btn-primary" id="btn-login">Login</button>
              <div class="auth-footer">
                Don't have an account? <a href="#" id="go-signup">Register</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Renders the Signup page into
  renderSignup() {
    document.getElementById('app').innerHTML = `
      <div class="auth-wrapper">
        <div class="auth-container">
          <div class="auth-left">
            <div class="logo-icon">📖</div>
            <h2>Join Our Community</h2>
            <p>Create your account and get instant access to thousands of books and resources.</p>
          </div>
          <div class="auth-right">
            <div class="auth-card">
              <h3>Register Account</h3>
              <div class="form-group">
                <label>Full Name</label>
                <input type="text" id="reg-fullname" placeholder="Enter your full name"/>
              </div>
              <div class="form-group">
                <label>Username</label>
                <input type="text" id="reg-username" placeholder="Choose a username"/>
              </div>
              <div class="form-group">
                <label>Date of Birth</label>
                <input type="date" id="reg-dob"/>
              </div>
              <div class="form-group">
                <label>NIC</label>
                <input type="text" id="reg-nic" placeholder="Enter your NIC Number"/>
              </div>
              <div class="form-group">
                <label>Password</label>
                <input type="password" id="reg-password" placeholder="Create a password"/>
              </div>
              <div class="form-group">
                <label>NIC Upload</label>
                <label class="upload-box" for="nic-front">
                  ⬇ <span id="nic-front-label">Click to upload NIC Front</span>
                  <input type="file" id="nic-front" accept="image/*"/>
                </label>
                <label class="upload-box" for="nic-back">
                  ⬇ <span id="nic-back-label">Click to upload NIC Back</span>
                  <input type="file" id="nic-back" accept="image/*"/>
                </label>
              </div>
              <button class="btn-primary" id="btn-register">Register</button>
              <div class="auth-footer">
                Already have an account? <a href="#" id="go-login">Login</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Shows success or error message
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
}
