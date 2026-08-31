import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

// Layouts
import Layout from "./layouts/Layout";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";

// Route protection
import ProtectedRoute from "./components/ProtectedRoute";

// Landing / public pages
import HomePage from "./pages/LandingPages/HomePage";
import AboutPage from "./pages/LandingPages/AboutPage";
import ProductListPage from "./pages/LandingPages/ProductListPage";
import ProductPage from "./pages/LandingPages/ProductPage";

// Authentication pages
import SignInPage from "./pages/AuthPages/SignInPage";
import SignUpPage from "./pages/AuthPages/SignUpPage";

// Customer pages
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";

// Admin pages
import AdminPage from "./pages/AdminPages/AdminPage";
import AdminProductsPage from "./pages/AdminPages/AdminProductsPage";
import AdminOrdersPage from "./pages/AdminPages/AdminOrdersPage";
import AdminReviewsPage from "./pages/AdminPages/AdminReviewsPage";
import AdminUsersPage from "./pages/AdminPages/AdminUsersPage";

// Other pages
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================================= */}
        {/* PUBLIC / CUSTOMER LAYOUT */}
        {/* ================================= */}
        <Route
          path="/"
          element={
            <Layout />
          }
        >
          {/* Home */}
          <Route
            index
            element={
              <HomePage />
            }
          />

          {/* About */}
          <Route
            path="about"
            element={
              <AboutPage />
            }
          />

          {/* Product List */}
          <Route
            path="products"
            element={
              <ProductListPage />
            }
          />

          {/* Product Details */}
          <Route
            path="products/:id"
            element={
              <ProductPage />
            }
          />

          {/* ================================= */}
          {/* CUSTOMER ONLY ROUTES */}
          {/* ================================= */}

          {/* Cart */}
          <Route
            path="cart"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "customer",
                ]}
              >
                <CartPage />
              </ProtectedRoute>
            }
          />

          {/* Orders */}
          <Route
            path="orders"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "customer",
                ]}
              >
                <OrdersPage />
              </ProtectedRoute>
            }
          />

          {/* ================================= */}
          {/* LOGGED-IN USER ROUTE */}
          {/* ================================= */}

          {/* Profile */}
          <Route
            path="profile"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "customer",
                  "admin",
                ]}
              >
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ================================= */}
        {/* AUTHENTICATION ROUTES */}
        {/* ================================= */}
        <Route
          path="/auth"
          element={
            <AuthLayout />
          }
        >
          {/* Sign In */}
          <Route
            path="signin"
            element={
              <SignInPage />
            }
          />

          {/* Sign Up */}
          <Route
            path="signup"
            element={
              <SignUpPage />
            }
          />
        </Route>

        {/* ================================= */}
        {/* ADMIN ROUTES */}
        {/* ================================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
              ]}
            >
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Admin Dashboard */}
          <Route
            index
            element={
              <AdminPage />
            }
          />

          {/* Product Management */}
          <Route
            path="products"
            element={
              <AdminProductsPage />
            }
          />

          {/* Order Management */}
          <Route
            path="orders"
            element={
              <AdminOrdersPage />
            }
          />

          {/* Review Management */}
          <Route
            path="reviews"
            element={
              <AdminReviewsPage />
            }
          />

          {/* User Management */}
          <Route
            path="users"
            element={
              <AdminUsersPage />
            }
          />
        </Route>

        {/* ================================= */}
        {/* 404 */}
        {/* ================================= */}
        <Route
          path="*"
          element={
            <NotFoundPage />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;