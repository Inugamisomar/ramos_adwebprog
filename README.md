# CTADWEBL: Advanced Web Programming - Long Exam 1

# BulldogEx Shop

BulldogEx Shop is a full-stack web application developed for **CTADWEBL: Advanced Web Programming - Long Exam 1**.

The project is an online campus shop where customers can create an account, sign in, browse products, search and filter products, manage their cart, place orders, submit reviews, and manage their profile.

The application also has an administrator side where admins can manage products, orders, reviews, and registered users.

The project is divided into two main parts:

```text
ramos-client
ramos-server
```

The client contains the React frontend, while the server contains the Express backend and MongoDB connection.

---

# Main Features

## Customer Features

Customers can:

- Register an account
- Sign in
- Sign out
- Browse products
- Search products
- Filter products by category
- View product details
- View product reviews
- Add products to the cart
- Change cart quantity
- Remove products from the cart
- View the cart total
- Place an order
- View ongoing orders
- Check order status
- Create product reviews
- View their profile
- Edit their information
- Change their password

## Administrator Features

Administrators can:

- Sign in using an admin account
- Access the Admin Dashboard
- View product, order, review, and user counts
- Create products
- View products
- Edit products
- Delete products
- View customer orders
- Confirm pending orders
- Mark orders as Ready for Claiming
- View customer reviews
- Edit reviews
- View registered users
- Edit user information
- Change user roles
- Activate accounts
- Deactivate accounts

---

# Frontend-Backend Integration

The BulldogEx project is divided into a frontend and a backend.

The frontend is inside:

```text
ramos-client/
```

The backend is inside:

```text
ramos-server/
```

The frontend is responsible for the part of the website that users can see and interact with.

Examples include:

- Home page
- Products page
- Cart
- Orders
- Profile
- Sign In
- Sign Up
- Admin Dashboard

The backend handles the data and the logic of the application.

Examples include:

- Authentication
- Authorization
- Product management
- Cart management
- Orders
- Reviews
- User management
- Validation
- Database operations

The React frontend communicates with the Express backend using API requests.

The backend then communicates with MongoDB using Mongoose.

The basic flow is:

```text
User
  ↓
React Frontend
  ↓
API Request
  ↓
Express Route
  ↓
Middleware
  ↓
Controller
  ↓
Mongoose Model
  ↓
MongoDB
```

After the backend finishes processing the request, it sends the result back to the frontend:

```text
MongoDB
  ↓
Mongoose Model
  ↓
Controller
  ↓
Express Response
  ↓
React Frontend
  ↓
Updated Page
```

For example, when a customer opens the Products page:

1. React sends a request to the backend.
2. The request goes to the product API route.
3. The product controller processes the request.
4. Mongoose gets the product information from MongoDB.
5. The backend sends the product data back as JSON.
6. React receives the data and displays the products.

Because of this integration, the main product information does not only depend on static frontend data.

---

# Authentication and Session Handling

BulldogEx uses **JSON Web Token or JWT** for authentication.

When a user signs in:

1. The frontend sends the user's email and password to the backend.
2. The backend checks if the user exists.
3. The password is checked using bcryptjs.
4. The backend checks if the account is active.
5. If the login is valid, the backend creates a JWT token.
6. The token and user information are sent back to the frontend.
7. The frontend saves the session.
8. Protected API requests include the token.

The token is sent using the Authorization header:

```text
Authorization: Bearer <JWT_TOKEN>
```

The backend checks the token before allowing protected requests.

When the user logs out, the saved session is removed.

---

# Role-Based Access Control

The system has two main roles:

```text
customer
admin
```

Role-Based Access Control or RBAC is used to separate customer and administrator permissions.

## Frontend Protection

The React frontend uses:

```text
ProtectedRoute.jsx
```

This component checks if:

- The user has a token
- The user information exists
- The user's role is allowed to open the page

For example:

```text
/cart
/orders
```

are customer-only pages.

Admin pages include:

```text
/admin
/admin/products
/admin/orders
/admin/reviews
/admin/users
```

If a user is not logged in, they are redirected to the Sign In page.

If the user has the wrong role, they are prevented from opening the protected page.

## Backend Protection

The backend also protects routes using middleware.

Examples include:

```text
protect
adminOnly
customerOnly
```

`protect` checks the JWT token.

`adminOnly` only allows admin users.

`customerOnly` only allows customer users.

The backend protection is important because frontend protection alone is not enough to secure the API.

---

# Client Libraries and Packages

The client and server use different packages, so they are discussed separately.

The client packages are mainly used for the user interface, navigation, styling, and frontend development.

## React

```text
react: ^19.2.4
```

I used React as the main frontend library.

React helped me divide the interface into reusable components instead of putting everything in one file.

Examples of reusable components are:

```text
Button.jsx
NavBar.jsx
Footer.jsx
ProductCard.jsx
ProductList.jsx
ProtectedRoute.jsx
```

React is also used to manage the data displayed on pages such as the cart, orders, products, profile, and admin dashboard.

---

## React DOM

```text
react-dom: ^19.2.4
```

React DOM is used to display the React application inside the browser.

---

## React Router DOM

```text
react-router-dom: ^7.14.0
```

I used React Router DOM for navigation between pages.

Some of the routes in the application are:

```text
/
/about
/products
/products/:id
/cart
/orders
/profile
/auth/signin
/auth/signup
/admin
/admin/products
/admin/orders
/admin/reviews
/admin/users
```

React Router DOM is also used with `ProtectedRoute.jsx` to protect customer and administrator pages.

---

## Tailwind CSS

```text
tailwindcss: ^4.2.2
@tailwindcss/vite: ^4.2.2
```

I used Tailwind CSS to design the interface.

It is used for:

- Colors
- Typography
- Spacing
- Buttons
- Forms
- Cards
- Navigation
- Responsive design
- Admin pages
- Focus states

Tailwind made it easier to keep the design consistent across the application.

---

## Vite

```text
vite: ^8.0.4
@vitejs/plugin-react: ^6.0.1
```

Vite is used to run and build the React frontend.

During development, I use:

```bash
npm run dev
```

Vite also supports the client environment variable used for the backend API URL.

---

## ESLint

```text
eslint: ^9.39.4
```

I used ESLint to help check the frontend code for possible problems.

Other related development packages include:

```text
@eslint/js
eslint-plugin-react-hooks
eslint-plugin-react-refresh
globals
```

---

## React Type Definitions

```text
@types/react
@types/react-dom
```

These packages provide React type definitions for development tools.

---

# Server Libraries and Packages

The server uses a different set of packages because it handles the API, database, authentication, and backend logic.

## Express

```text
express: ^5.2.1
```

I used Express as the main backend framework.

Express is used to:

- Create the server
- Define API endpoints
- Receive requests from the frontend
- Use middleware
- Connect routes to controllers
- Send JSON responses

Examples of API routes include:

```text
/api/auth
/api/products
/api/categories
/api/suppliers
/api/carts
/api/orders
/api/reviews
/api/users
```

---

## Mongoose

```text
mongoose: ^9.9.2
```

I used Mongoose to connect the Node.js server to MongoDB.

Mongoose is also used to define the database models and validation rules.

The main models are:

```text
User
Product
Category
Supplier
Cart
Order
Review
```

Mongoose helps the backend create, read, update, and delete data from MongoDB.

---

## JSON Web Token

```text
jsonwebtoken: ^9.0.3
```

I used `jsonwebtoken` for authentication.

After a successful login, the backend creates a token.

The frontend sends this token when accessing protected API routes.

The backend verifies the token before allowing the request to continue.

---

## bcryptjs

```text
bcryptjs: ^3.0.3
```

I used bcryptjs to protect user passwords.

Before a password is saved to MongoDB, it is hashed.

This means the original password is not stored as plain text.

During login, bcryptjs compares the password entered by the user with the stored password hash.

---

## CORS

```text
cors: ^2.8.6
```

I used CORS because the frontend and backend usually run on different ports during development.

For example:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

CORS allows the frontend and backend to communicate properly.

---

## dotenv

```text
dotenv: ^17.4.2
```

I used dotenv to load configuration values from the `.env` file.

Examples include:

```text
PORT
MONGODB_URI
JWT_SECRET
```

This helps prevent sensitive configuration from being hardcoded directly in the source code.

---

## Nodemon

```text
nodemon: ^3.1.14
```

I used Nodemon during backend development.

Nodemon automatically restarts the server when backend files are changed.

The development command is:

```bash
npm run dev
```

---

# Design Pattern Used

## Client-Side Design Pattern

For the frontend, I used a **component-based structure** because the application is built with React.

Instead of putting the whole user interface in one file, I separated it into different folders.

The main frontend folders are:

```text
components/
layouts/
pages/
services/
assets/
```

### Components

The `components` folder contains reusable parts of the interface.

Examples:

```text
Button.jsx
Footer.jsx
NavBar.jsx
ProductCard.jsx
ProductList.jsx
ProtectedRoute.jsx
```

This helps reduce repeated code.

For example, the same Button component can be used on different pages.

### Layouts

The `layouts` folder contains shared page structures.

The project uses:

```text
Layout.jsx
AuthLayout.jsx
AdminLayout.jsx
```

The layouts help separate the main website, authentication pages, and administrator interface.

### Pages

The `pages` folder contains the main screens of the application.

Examples:

```text
HomePage
ProductListPage
ProductPage
CartPage
OrdersPage
ProfilePage
SignInPage
SignUpPage
AdminPage
AdminProductsPage
AdminOrdersPage
AdminReviewsPage
AdminUsersPage
```

### Services

The `services` folder contains API and authentication functions.

```text
api.js
authService.js
```

`api.js` is used for communication with the backend.

`authService.js` is used for authentication and session-related operations.

This structure makes the frontend easier to understand and maintain.

---

# Server-Side Design Pattern

For the backend, I used an **MVC-style structure together with routes and middleware**.

The main backend folders are:

```text
models/
controllers/
routes/
middleware/
config/
```

## Models

The `models` folder contains the MongoDB schemas.

Examples:

```text
userModel.js
productModel.js
categoryModel.js
supplierModel.js
cartModel.js
orderModel.js
reviewModel.js
```

The models describe how the data should be stored.

---

## Controllers

The `controllers` folder contains the logic of the application.

Examples:

```text
authController.js
productController.js
categoryController.js
supplierController.js
cartController.js
orderController.js
reviewController.js
userController.js
```

The controller receives the request, processes it, uses the model when needed, and sends a response.

---

## Routes

The `routes` folder contains the API endpoints.

Examples:

```text
authRoutes.js
productRoutes.js
categoryRoutes.js
supplierRoutes.js
cartRoutes.js
orderRoutes.js
reviewRoutes.js
userRoutes.js
```

The routes connect incoming requests to the correct controllers.

---

## Middleware

The `middleware` folder contains code that runs before certain controllers.

Examples include:

```text
authMiddleware.js
errorMiddleware.js
```

Authentication middleware is used to check JWT tokens and user roles.

The basic backend flow is:

```text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Model
  ↓
MongoDB
```

This structure helps keep the backend organized because all the logic is not placed inside `server.js`.

---

# Database Models

The project uses MongoDB with Mongoose.

The main database models are:

## User

Stores:

- Name
- Email
- Password hash
- Role
- Account status

## Product

Stores:

- Name
- Description
- Price
- Stock
- Image
- Category
- Supplier

## Category

Stores product-category information.

## Supplier

Stores supplier information.

## Cart

Stores customer cart items and quantities.

## Order

Stores:

- Customer
- Products
- Quantities
- Total price
- Status
- Address
- Payment method

The order statuses are:

```text
Pending
Confirmed
Ready for Claiming
```

## Review

Stores:

- Product
- Customer
- Rating
- Comment

---

# REST API Overview

The backend provides REST API routes for the application.

```text
/api/auth
/api/products
/api/categories
/api/suppliers
/api/carts
/api/orders
/api/reviews
/api/users
```

## Authentication API

Used for:

- Registration
- Login
- Profile information
- Profile updates
- Password changes

## Products API

Used for:

- Viewing products
- Viewing one product
- Searching products
- Filtering by category
- Filtering by supplier
- Sorting
- Pagination
- Creating products
- Editing products
- Deleting products

Product management operations are restricted to administrators.

## Categories API

Used for category information and category management.

## Suppliers API

Used for supplier information and supplier management.

## Cart API

Used for:

- Viewing the cart
- Creating cart information
- Updating quantities
- Removing cart information

Cart operations are restricted to customers.

## Orders API

Used for:

- Creating orders
- Viewing customer orders
- Viewing admin order information
- Updating order status

## Reviews API

Used for:

- Viewing reviews
- Creating reviews
- Editing reviews
- Deleting reviews

Review permissions depend on the user's role.

## Users API

Used by administrators for:

- Viewing users
- Viewing one user
- Editing user information
- Changing roles
- Activating accounts
- Deactivating accounts

---

# CRUD Operations

CRUD means:

```text
Create
Read
Update
Delete
```

The application uses CRUD operations for different resources.

| Resource | Create | Read | Update | Delete |
| --- | --- | --- | --- | --- |
| Products | Admin | Public/Admin | Admin | Admin |
| Categories | Admin | Public/Admin | Admin | Admin |
| Suppliers | Admin | Public/Admin | Admin | Admin |
| Cart | Customer | Customer | Customer | Customer |
| Orders | Customer | Customer/Admin | Admin | Admin |
| Reviews | Customer | Public/Admin | Admin | Admin |
| Users | Admin | Admin | Admin | Admin |

The backend checks the user's authentication and role before allowing restricted operations.

---

# Error Handling and Validation

The application includes validation and error handling on both the frontend and backend.

## Authentication Errors

The system handles:

- Invalid email
- Invalid password
- Unregistered accounts
- Inactive accounts
- Missing tokens
- Invalid tokens

## Authorization Errors

The backend prevents users from accessing operations that are not allowed for their role.

For example, a customer cannot use administrator-only product management endpoints.

## Form Validation

The frontend checks fields before sending requests.

Examples include:

- Required fields
- Valid email format
- Minimum password length
- Password confirmation
- Product price
- Product stock
- Review rating
- Review comment
- Required order information

The backend also validates incoming data because frontend validation alone is not enough.

## Server and Network Errors

The frontend displays error messages if an API request fails.

For example, if the backend server is unavailable, the application shows an error instead of crashing.

---

# Accessibility and User Interface

The user interface was improved to make the application easier to use and more accessible.

The project includes:

- Semantic HTML
- Proper labels for form fields
- Required-field indicators
- Keyboard-accessible controls
- Visible focus states
- Accessible navigation
- ARIA attributes
- ARIA live regions
- Accessible password show/hide buttons
- Alternative text for meaningful images
- Decorative images hidden from screen readers
- Loading states
- Error messages
- Empty states
- Responsive layouts
- Consistent buttons and colors

The design uses the BulldogEx blue and yellow theme throughout the customer and admin interfaces.

---

# Application Routes

## Public Routes

```text
/
```

Home page.

```text
/about
```

About page.

```text
/products
```

Product catalog.

```text
/products/:id
```

Product details.

```text
/auth/signin
```

Sign In page.

```text
/auth/signup
```

Registration page.

---

## Customer Routes

```text
/cart
```

Shopping cart.

```text
/orders
```

Customer orders.

```text
/profile
```

Profile and password management.

---

## Administrator Routes

```text
/admin
```

Admin Dashboard.

```text
/admin/products
```

Product management.

```text
/admin/orders
```

Order management.

```text
/admin/reviews
```

Review management.

```text
/admin/users
```

User management.

---

# Environment Variables

The project uses `.env` files for configuration.

## Client `.env`

Create:

```text
ramos-client/.env
```

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

## Server `.env`

Create:

```text
ramos-server/.env
```

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Actual database credentials and JWT secrets should not be uploaded to a public GitHub repository.

---

# Installation and Setup

## 1. Clone the Repository

```bash
git clone <repository-url>
```

Enter the main project folder:

```bash
cd ramos-webprog-longexam
```

---

## 2. Install the Server

Open a terminal and enter:

```bash
cd ramos-server
```

Install the packages:

```bash
npm install
```

Create the server `.env` file.

Start the backend:

```bash
npm run dev
```

The normal start command is:

```bash
npm start
```

---

## 3. Install the Client

Open another terminal and enter:

```bash
cd ramos-client
```

Install the packages:

```bash
npm install
```

Create the client `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

---

# Available Commands

## Client Commands

Run development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

Preview the build:

```bash
npm run preview
```

## Server Commands

Run using Nodemon:

```bash
npm run dev
```

Start normally:

```bash
npm start
```

---

# Project File Structure

```text
ramos-webprog-longexam/
│
├── README.md
│
├── ramos-client/
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   │
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       │
│       ├── assets/
│       │   ├── product-content.js
│       │   ├── img/
│       │   └── styles/
│       │
│       ├── components/
│       │   ├── Button.jsx
│       │   ├── Footer.jsx
│       │   ├── NavBar.jsx
│       │   ├── ProductCard.jsx
│       │   ├── ProductList.jsx
│       │   └── ProtectedRoute.jsx
│       │
│       ├── layouts/
│       │   ├── Layout.jsx
│       │   ├── AuthLayout.jsx
│       │   └── AdminLayout.jsx
│       │
│       ├── pages/
│       │   ├── CartPage.jsx
│       │   ├── OrdersPage.jsx
│       │   ├── ProfilePage.jsx
│       │   ├── NotFoundPage.jsx
│       │   │
│       │   ├── AuthPages/
│       │   │   ├── SignInPage.jsx
│       │   │   └── SignUpPage.jsx
│       │   │
│       │   ├── LandingPages/
│       │   │   ├── HomePage.jsx
│       │   │   ├── AboutPage.jsx
│       │   │   ├── ProductListPage.jsx
│       │   │   └── ProductPage.jsx
│       │   │
│       │   └── AdminPages/
│       │       ├── AdminPage.jsx
│       │       ├── AdminProductsPage.jsx
│       │       ├── AdminOrdersPage.jsx
│       │       ├── AdminReviewsPage.jsx
│       │       └── AdminUsersPage.jsx
│       │
│       └── services/
│           ├── api.js
│           └── authService.js
│
└── ramos-server/
    ├── .env
    ├── package.json
    ├── server.js
    │
    ├── config/
    │   ├── constants.js
    │   └── db.js
    │
    ├── controllers/
    │   ├── authController.js
    │   ├── cartController.js
    │   ├── categoryController.js
    │   ├── orderController.js
    │   ├── productController.js
    │   ├── reviewController.js
    │   ├── supplierController.js
    │   └── userController.js
    │
    ├── middleware/
    │   ├── authMiddleware.js
    │   └── errorMiddleware.js
    │
    ├── models/
    │   ├── cartModel.js
    │   ├── categoryModel.js
    │   ├── orderModel.js
    │   ├── productModel.js
    │   ├── reviewModel.js
    │   ├── supplierModel.js
    │   └── userModel.js
    │
    └── routes/
        ├── authRoutes.js
        ├── cartRoutes.js
        ├── categoryRoutes.js
        ├── orderRoutes.js
        ├── productRoutes.js
        ├── reviewRoutes.js
        ├── supplierRoutes.js
        └── userRoutes.js
```

---

# Project Architecture Summary

## Client

```text
React
  ↓
Components / Pages
  ↓
Services
  ↓
API Requests
```

## Server

```text
API Route
  ↓
Middleware
  ↓
Controller
  ↓
Model
  ↓
MongoDB
```

## Full Application Flow

```text
React Client
     ↓
HTTP Request
     ↓
Express API
     ↓
Authentication / Authorization
     ↓
Controller
     ↓
Mongoose
     ↓
MongoDB
     ↓
JSON Response
     ↓
React Interface
```

---

# Security Features

The project includes the following security features:

- Password hashing using bcryptjs
- JWT authentication
- Protected backend routes
- Protected frontend routes
- Role-Based Access Control
- Administrator-only operations
- Customer-only operations
- Inactive-account blocking
- Server-side validation
- Frontend validation
- Environment variables for sensitive values

The backend is responsible for the main security checks.

---

# Testing and Demonstration

The project can be demonstrated using customer and administrator accounts.

## Customer Demonstration

```text
Register
→ Sign In
→ Browse Products
→ Search Products
→ Filter by Category
→ View Product
→ Add to Cart
→ Update Cart
→ Place Order
→ View Orders
→ Create Review
→ View Profile
→ Edit Profile
→ Change Password
→ Logout
```

## Admin Demonstration

```text
Admin Sign In
→ Admin Dashboard
→ Product Management
→ Create Product
→ Edit Product
→ Order Management
→ Confirm Order
→ Mark Ready for Claiming
→ Review Management
→ User Management
→ Activate / Deactivate User
→ Logout
```

## Error Handling Demonstration

The application can also demonstrate:

- Invalid login
- Invalid registration information
- Inactive account login
- Unauthorized route access
- Role-based API restrictions
- Form validation
- Server/network errors

---

# Long Exam Requirements Implemented

The project includes the main requirements for the Long Exam:

- React frontend
- Express backend
- MongoDB integration
- Frontend-backend API integration
- JWT authentication
- Login
- Registration
- Logout
- Session handling
- Protected frontend routes
- Protected backend routes
- Role-Based Access Control
- Customer features
- Administrator features
- Product CRUD
- Cart management
- Order management
- Review management
- User management
- Profile management
- Input validation
- Authentication error handling
- Authorization error handling
- Server error handling
- Responsive user interface
- Accessible interface improvements
- Separate client and server package discussion
- Client-side design pattern discussion
- Server-side design pattern discussion
- Project file outline

---

# Author

**Ramos**

CTADWEBL: Advanced Web Programming  
Long Exam 1