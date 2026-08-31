import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import apiRequest from "../../services/api";

const AdminOrdersPage = () => {
  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [updatingId, setUpdatingId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  // =========================
  // LOAD ORDERS
  // =========================
  const fetchOrders =
    async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await apiRequest(
            "/orders"
          );

        setOrders(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to load orders."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // UPDATE STATUS
  // =========================
  const updateStatus =
    async (
      orderId,
      status
    ) => {
      try {
        setUpdatingId(
          orderId
        );

        setError("");
        setSuccess("");

        const data =
          await apiRequest(
            `/orders/${orderId}`,
            {
              method: "PUT",

              body:
                JSON.stringify({
                  status,
                }),
            }
          );

        setSuccess(
          data.message ||
            "Order updated successfully."
        );

        setOrders(
          (previous) =>
            previous.map(
              (order) =>
                order._id ===
                orderId
                  ? data.order
                  : order
            )
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to update order."
        );
      } finally {
        setUpdatingId(null);
      }
    };

  // =========================
  // FILTER ORDERS
  // =========================
  const filteredOrders =
    useMemo(() => {
      if (
        statusFilter ===
        "All"
      ) {
        return orders;
      }

      return orders.filter(
        (order) =>
          order.status ===
          statusFilter
      );
    }, [
      orders,
      statusFilter,
    ]);

  // =========================
  // COUNTS
  // =========================
  const pendingCount =
    orders.filter(
      (order) =>
        order.status ===
        "Pending"
    ).length;

  const confirmedCount =
    orders.filter(
      (order) =>
        order.status ===
        "Confirmed"
    ).length;

  const readyCount =
    orders.filter(
      (order) =>
        order.status ===
        "Ready for Claiming"
    ).length;

  // =========================
  // STATUS STYLE
  // =========================
  const getStatusStyle =
    (status) => {
      if (
        status ===
        "Confirmed"
      ) {
        return "border-blue-600 bg-blue-50 text-blue-800";
      }

      if (
        status ===
        "Ready for Claiming"
      ) {
        return "border-green-600 bg-green-50 text-green-800";
      }

      return "border-yellow-500 bg-yellow-50 text-yellow-800";
    };

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-50 px-4 py-10">
        <div className="mx-auto max-w-7xl rounded-2xl border-2 border-zinc-900 bg-yellow-100 p-8 text-center">
          <p className="font-bold text-zinc-900">
            Loading orders...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-zinc-500">
              BulldogEx
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-black text-zinc-900 sm:text-4xl">
              Order Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              Review customer
              orders and update
              their claiming
              status.
            </p>
          </div>

          <Link
            to="/admin"
            className="w-fit rounded-full border-2 border-zinc-900 bg-white px-5 py-3 text-xs font-black uppercase tracking-wider text-zinc-900 transition hover:bg-zinc-900 hover:text-white"
          >
            ← Dashboard
          </Link>
        </div>

        {/* MESSAGES */}
        {error && (
          <div className="mb-6 rounded-xl border-2 border-red-500 bg-red-50 p-4 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border-2 border-green-600 bg-green-50 p-4 text-sm font-bold text-green-800">
            {success}
          </div>
        )}

        {/* COUNTS */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border-2 border-zinc-900 bg-yellow-100 p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Pending
            </p>

            <p className="mt-2 text-3xl font-black text-zinc-900">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl border-2 border-zinc-900 bg-blue-50 p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Confirmed
            </p>

            <p className="mt-2 text-3xl font-black text-zinc-900">
              {confirmedCount}
            </p>
          </div>

          <div className="rounded-2xl border-2 border-zinc-900 bg-green-50 p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Ready for Claiming
            </p>

            <p className="mt-2 text-3xl font-black text-zinc-900">
              {readyCount}
            </p>
          </div>
        </div>

        {/* FILTER */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-500">
              Orders
            </p>

            <h2 className="mt-1 text-2xl font-black text-zinc-900">
              Customer Orders
            </h2>
          </div>

          <select
            value={
              statusFilter
            }
            onChange={(
              event
            ) =>
              setStatusFilter(
                event.target
                  .value
              )
            }
            className="rounded-xl border-2 border-zinc-900 bg-white px-4 py-3 text-sm font-bold text-zinc-900 outline-none focus:ring-4 focus:ring-yellow-300"
          >
            <option value="All">
              All Orders
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Confirmed">
              Confirmed
            </option>

            <option value="Ready for Claiming">
              Ready for Claiming
            </option>
          </select>
        </div>

        {/* ORDER LIST */}
        <div className="mt-5 space-y-5">
          {filteredOrders.length ===
          0 ? (
            <div className="rounded-2xl border-2 border-dashed border-zinc-400 bg-white p-10 text-center">
              <p className="font-bold text-zinc-900">
                No orders found.
              </p>
            </div>
          ) : (
            filteredOrders.map(
              (order) => (
                <article
                  key={
                    order._id
                  }
                  className="rounded-2xl border-2 border-zinc-900 bg-white p-6 shadow-sm"
                >
                  {/* TOP */}
                  <div className="flex flex-col gap-4 border-b-2 border-zinc-200 pb-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">
                        Order
                      </p>

                      <h3 className="mt-1 break-all text-lg font-black text-zinc-900">
                        #{order._id}
                      </h3>

                      <div className="mt-3 text-sm text-zinc-600">
                        <p>
                          <span className="font-bold text-zinc-900">
                            Customer:
                          </span>{" "}
                          {order.user
                            ?.name ||
                            "Unknown"}
                        </p>

                        <p className="mt-1">
                          <span className="font-bold text-zinc-900">
                            Email:
                          </span>{" "}
                          {order.user
                            ?.email ||
                            "N/A"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`w-fit rounded-full border-2 px-4 py-2 text-xs font-black uppercase tracking-wider ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {
                        order.status
                      }
                    </span>
                  </div>

                  {/* PRODUCTS */}
                  <div className="mt-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">
                      Products
                    </p>

                    <div className="mt-3 space-y-3">
                      {order.items?.map(
                        (
                          item,
                          index
                        ) => (
                          <div
                            key={
                              item._id ||
                              index
                            }
                            className="flex flex-col gap-2 rounded-xl bg-zinc-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div>
                              <p className="font-bold text-zinc-900">
                                {item
                                  .product
                                  ?.name ||
                                  "Product unavailable"}
                              </p>

                              <p className="mt-1 text-sm text-zinc-500">
                                Quantity:{" "}
                                {
                                  item.quantity
                                }
                              </p>
                            </div>

                            <p className="font-black text-zinc-900">
                              ₱
                              {(
                                Number(
                                  item
                                    .product
                                    ?.price ||
                                    0
                                ) *
                                Number(
                                  item.quantity ||
                                    0
                                )
                              ).toLocaleString(
                                "en-PH",
                                {
                                  minimumFractionDigits: 2,
                                }
                              )}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* ORDER INFO */}
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border-2 border-zinc-200 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                        Address
                      </p>

                      <p className="mt-2 text-sm font-bold text-zinc-900">
                        {
                          order.shippingAddress
                        }
                      </p>
                    </div>

                    <div className="rounded-xl border-2 border-zinc-200 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                        Payment
                      </p>

                      <p className="mt-2 text-sm font-bold text-zinc-900">
                        {
                          order.paymentMethod
                        }
                      </p>
                    </div>

                    <div className="rounded-xl border-2 border-zinc-200 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                        Total
                      </p>

                      <p className="mt-2 text-xl font-black text-zinc-900">
                        ₱
                        {Number(
                          order.totalPrice ||
                            0
                        ).toLocaleString(
                          "en-PH",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-5 flex flex-wrap gap-3">

                    {order.status ===
                      "Pending" && (
                      <button
                        type="button"
                        disabled={
                          updatingId ===
                          order._id
                        }
                        onClick={() =>
                          updateStatus(
                            order._id,
                            "Confirmed"
                          )
                        }
                        className="rounded-full border-2 border-blue-900 bg-blue-900 px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-blue-800 disabled:opacity-50"
                      >
                        {updatingId ===
                        order._id
                          ? "Updating..."
                          : "Confirm Order"}
                      </button>
                    )}

                    {order.status ===
                      "Confirmed" && (
                      <button
                        type="button"
                        disabled={
                          updatingId ===
                          order._id
                        }
                        onClick={() =>
                          updateStatus(
                            order._id,
                            "Ready for Claiming"
                          )
                        }
                        className="rounded-full border-2 border-green-700 bg-green-700 px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-green-600 disabled:opacity-50"
                      >
                        {updatingId ===
                        order._id
                          ? "Updating..."
                          : "Mark Ready for Claiming"}
                      </button>
                    )}

                    {order.status ===
                      "Ready for Claiming" && (
                      <p className="rounded-full border-2 border-green-600 bg-green-50 px-5 py-3 text-xs font-black uppercase tracking-wider text-green-800">
                        Ready for Customer
                      </p>
                    )}
                  </div>
                </article>
              )
            )
          )}
        </div>
      </div>
    </main>
  );
};

export default AdminOrdersPage;