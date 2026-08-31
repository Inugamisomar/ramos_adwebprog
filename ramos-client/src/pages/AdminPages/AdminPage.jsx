import { useEffect, useState } from "react";

import Button from "../../components/Button";
import apiRequest from "../../services/api";

const AdminPage = () => {
  const [products, setProducts] = useState([]);

  const [orders, setOrders] = useState([]);

  const [reviews, setReviews] = useState([]);

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // LOAD ADMIN DASHBOARD
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [productData, orderData, reviewData, userData] = await Promise.all([
        apiRequest("/products?limit=100"),

        apiRequest("/orders"),

        apiRequest("/reviews"),

        apiRequest("/users"),
      ]);

      // PRODUCTS
      setProducts(
        Array.isArray(productData)
          ? productData
          : Array.isArray(productData?.data)
            ? productData.data
            : [],
      );

      // ORDERS
      setOrders(
        Array.isArray(orderData)
          ? orderData
          : Array.isArray(orderData?.data)
            ? orderData.data
            : [],
      );

      // REVIEWS
      setReviews(
        Array.isArray(reviewData)
          ? reviewData
          : Array.isArray(reviewData?.data)
            ? reviewData.data
            : [],
      );

      // USERS
      setUsers(
        Array.isArray(userData)
          ? userData
          : Array.isArray(userData?.data)
            ? userData.data
            : [],
      );
    } catch (err) {
      setError(err.message || "Unable to load admin dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // DASHBOARD COUNTS
  const pendingOrders = orders.filter(
    (order) => order.status === "Pending",
  ).length;

  const confirmedOrders = orders.filter(
    (order) => order.status === "Confirmed",
  ).length;

  const readyOrders = orders.filter(
    (order) => order.status === "Ready for Claiming",
  ).length;

  const activeUsers = users.filter((user) => user.isActive).length;

  const inactiveUsers = users.filter((user) => !user.isActive).length;

  // STATISTICS
  const stats = [
    {
      label: "Products",
      value: products.length,
      description: "Products currently listed",
      symbol: "📦",
    },

    {
      label: "Orders",
      value: orders.length,
      description: `${pendingOrders} pending`,
      symbol: "🛍️",
    },

    {
      label: "Reviews",
      value: reviews.length,
      description: "Customer product reviews",
      symbol: "★",
    },

    {
      label: "Users",
      value: users.length,
      description: `${activeUsers} active`,
      symbol: "👥",
    },
  ];

  // MANAGEMENT SECTIONS
  const managementSections = [
    {
      title: "Product Management",

      description:
        "Create new products, view inventory, update product information, and remove products when necessary.",

      to: "/admin/products",

      buttonText: "Manage Products",

      symbol: "📦",

      detail: `${products.length} product${
        products.length === 1 ? "" : "s"
      } listed`,
    },

    {
      title: "Order Management",

      description:
        "Review customer orders, confirm pending orders, and mark completed orders as ready for claiming.",

      to: "/admin/orders",

      buttonText: "Manage Orders",

      symbol: "🛍️",

      detail: `${pendingOrders} pending order${pendingOrders === 1 ? "" : "s"}`,
    },

    {
      title: "Review Management",

      description:
        "View submitted customer reviews and edit review information when moderation is necessary.",

      to: "/admin/reviews",

      buttonText: "Manage Reviews",

      symbol: "★",

      detail: `${reviews.length} review${reviews.length === 1 ? "" : "s"}`,
    },

    {
      title: "User Management",

      description:
        "View registered users, update account information, assign roles, and activate or deactivate accounts.",

      to: "/admin/users",

      buttonText: "Manage Users",

      symbol: "👥",

      detail: `${activeUsers} active account${activeUsers === 1 ? "" : "s"}`,
    },
  ];

  // LOADING
  if (loading) {
    return (
      <section
        aria-labelledby="admin-loading-title"
        className="min-h-screen bg-blue-50 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div
            role="status"
            aria-live="polite"
            className="rounded-3xl border-2 border-blue-200 bg-white p-10 text-center shadow-sm"
          >
            <div
              aria-hidden="true"
              className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-950"
            />

            <h1
              id="admin-loading-title"
              className="mt-5 text-xl font-black text-blue-950"
            >
              Loading admin dashboard
            </h1>

            <p className="mt-2 text-sm text-zinc-600">
              Retrieving products, orders, reviews, and user information.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <main
      aria-labelledby="admin-dashboard-title"
      className="min-h-screen bg-blue-50 px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <header className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
            BulldogEx Administration
          </p>

          <h1
            id="admin-dashboard-title"
            className="mt-2 text-4xl font-black tracking-tight text-blue-950 sm:text-5xl"
          >
            Admin Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-700 sm:text-base">
            Monitor BulldogEx activity and manage products, customer orders,
            reviews, and registered users from one dashboard.
          </p>
        </header>

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-8 rounded-2xl border-2 border-red-300 bg-red-50 p-5"
          >
            <h2 className="font-black text-red-950">
              Dashboard data could not be loaded
            </h2>

            <p className="mt-2 text-sm leading-6 text-red-900">{error}</p>

            <Button
              type="button"
              variant="danger"
              onClick={fetchDashboardData}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* STATISTICS */}
        <section aria-labelledby="dashboard-overview-title">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                Overview
              </p>

              <h2
                id="dashboard-overview-title"
                className="mt-1 text-2xl font-black text-blue-950"
              >
                System Summary
              </h2>
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={fetchDashboardData}
            >
              Refresh Dashboard
            </Button>
          </div>

          <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border-2 border-blue-100 bg-white p-6 shadow-sm"
              >
                <div>
                  <dt className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                    {stat.label}
                  </dt>

                  <dd className="mt-3 text-4xl font-black text-blue-950">
                    {stat.value}
                  </dd>
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-700">
                  {stat.description}
                </p>
              </div>
            ))}
          </dl>
        </section>

        {/* ORDER STATUS SUMMARY */}
        <section
          aria-labelledby="order-status-title"
          className="mt-8 rounded-3xl border-2 border-blue-100 bg-white p-6 shadow-sm sm:p-8"
        >
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
              Order Activity
            </p>

            <h2
              id="order-status-title"
              className="mt-1 text-2xl font-black text-blue-950"
            >
              Current Order Status
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-700">
              A quick overview of the current customer order workflow.
            </p>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            {/* PENDING */}
            <div className="rounded-2xl border-2 border-yellow-300 bg-yellow-50 p-5">
              <dt className="font-black text-yellow-950">Pending</dt>

              <dd className="mt-2 text-3xl font-black text-yellow-950">
                {pendingOrders}
              </dd>

              <p className="mt-2 text-xs leading-5 text-yellow-900">
                Waiting for admin confirmation.
              </p>
            </div>

            {/* CONFIRMED */}
            <div className="rounded-2xl border-2 border-blue-300 bg-blue-50 p-5">
              <dt className="font-black text-blue-950">Confirmed</dt>

              <dd className="mt-2 text-3xl font-black text-blue-950">
                {confirmedOrders}
              </dd>

              <p className="mt-2 text-xs leading-5 text-blue-900">
                Orders currently being prepared.
              </p>
            </div>

            {/* READY */}
            <div className="rounded-2xl border-2 border-green-300 bg-green-50 p-5">
              <dt className="font-black text-green-950">Ready for Claiming</dt>

              <dd className="mt-2 text-3xl font-black text-green-950">
                {readyOrders}
              </dd>

              <p className="mt-2 text-xs leading-5 text-green-900">
                Customer orders ready for pickup.
              </p>
            </div>
          </dl>
        </section>

        {/* USER STATUS SUMMARY */}
        <section
          aria-labelledby="user-status-title"
          className="mt-8 rounded-3xl border-2 border-blue-100 bg-white p-6 shadow-sm sm:p-8"
        >
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
              Accounts
            </p>

            <h2
              id="user-status-title"
              className="mt-1 text-2xl font-black text-blue-950"
            >
              User Account Status
            </h2>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border-2 border-green-300 bg-green-50 p-5">
              <dt className="font-black text-green-950">Active Accounts</dt>

              <dd className="mt-2 text-3xl font-black text-green-950">
                {activeUsers}
              </dd>
            </div>

            <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-5">
              <dt className="font-black text-red-950">Inactive Accounts</dt>

              <dd className="mt-2 text-3xl font-black text-red-950">
                {inactiveUsers}
              </dd>
            </div>
          </dl>
        </section>

        {/* MANAGEMENT SECTIONS */}
        <section aria-labelledby="management-title" className="mt-10">
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
              Administration
            </p>

            <h2
              id="management-title"
              className="mt-1 text-2xl font-black text-blue-950"
            >
              Management Tools
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-700">
              Choose a management area to view and update BulldogEx information.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {managementSections.map((section) => (
              <article
                key={section.title}
                className="flex h-full flex-col rounded-3xl border-2 border-blue-100 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-black text-blue-950">
                    {section.title}
                  </h3>

                  <span className="shrink-0 rounded-full border border-yellow-300 bg-yellow-100 px-3 py-1.5 text-xs font-bold text-zinc-900">
                    {section.detail}
                  </span>
                </div>

                <p className="mt-3 flex-1 text-sm leading-6 text-zinc-700">
                  {section.description}
                </p>

                <Button
                  to={section.to}
                  variant="blue"
                  className="mt-6 w-full sm:w-fit"
                  aria-label={section.buttonText}
                >
                  {section.buttonText}
                </Button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminPage;
