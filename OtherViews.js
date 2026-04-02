//  MODEL: UserModel
//  Responsibility: User data storage and retrieval ONLY.

class UserModel {

  // ---------- Auth ----------

  register(fullname, username, dob, nic, password) {
    if (!fullname || !username || !dob || !nic || !password) {
      return { success: false, message: 'All fields are required.' };
    }
    const users = this._getUsers();
    if (users.find(u => u.username === username)) {
      return { success: false, message: 'Username already exists.' };
    }
    const user = { fullname, username, dob, nic, password };
    users.push(user);
    localStorage.setItem('lms_users', JSON.stringify(users));
    return { success: true, message: 'Registration successful.' };
  }

  login(username, password) {
    if (!username || !password) {
      return { success: false, message: 'Please enter username and password.' };
    }
    const users = this._getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem('lms_current_user', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: 'Invalid username or password.' };
  }

  logout() {
    localStorage.removeItem('lms_current_user');
    localStorage.removeItem('lms_cart');
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('lms_current_user') || 'null');
  }

  isLoggedIn() {
    return this.getCurrentUser() !== null;
  }

  // ---------- Private helpers ----------

  _getUsers() {
    return JSON.parse(localStorage.getItem('lms_users') || '[]');
  }
}
