# LMS — Library Management System
## MVC Architecture (Pure HTML/CSS/JS)

---

## File Structure

```
lms-mvc/
├── index.html                        ← Only HTML file (SPA entry point)
├── css/
│   └── style.css                     ← All styles
└── js/
    ├── models/
    │   ├── UserModel.js              ← User data: register, login, logout
    │   └── BookModel.js              ← Book data: borrow, cart, availability
    ├── views/
    │   ├── AuthView.js               ← Renders login & signup UI
    │   ├── DashboardView.js          ← Renders dashboard UI
    │   ├── SearchView.js             ← Renders search books UI
    │   └── OtherViews.js             ← AvailabilityView, BarcodeView, CartView
    └── controllers/
        ├── AuthController.js         ← Handles login/signup events
        ├── BookController.js         ← Handles borrow/search/cart events
        └── AppController.js          ← Main router, wires all MVC components
```

---

## MVC Responsibilities

### MODEL
- Holds all data and business logic
- Reads/writes localStorage
- Has NO knowledge of the DOM or UI
- Returns plain result objects `{ success, message, data }`

### VIEW
- Renders HTML strings into `#app`
- Receives ready-to-display data from Controller
- Has NO business logic, no localStorage access
- Only knows how to display data

### CONTROLLER
- Listens for user events (clicks, inputs)
- Calls the Model to process data
- Passes the result to the View to render
- Handles navigation via AppController

---

## MVC Data Flow

```
User clicks "Login"
    ↓
AuthController.handleLogin()          ← Controller receives event
    ↓
UserModel.login(username, password)   ← Controller asks Model for data
    ↓
{ success: true, user: {...} }        ← Model returns result
    ↓
AuthView.showMessage(...)             ← Controller tells View what to show
AppController.navigate('dashboard')   ← Controller triggers navigation
```

---

## How to Run

1. Open `index.html` in any browser — no server needed
2. Register a new account from the signup page
3. Login and explore the system

---

## Pages

| Page         | URL Hash       | Controller Method              |
|--------------|----------------|-------------------------------|
| Login        | `#login`       | AuthController.showLogin()     |
| Signup       | `#signup`      | AuthController.showSignup()    |
| Dashboard    | `#dashboard`   | BookController.showDashboard() |
| Search Books | `#search`      | BookController.showSearch()    |
| Availability | `#availability`| BookController.showAvailability()|
| My Barcode   | `#barcode`     | BookController.showBarcode()   |
| Cart/Update  | `#cart`        | BookController.showCart()      |
