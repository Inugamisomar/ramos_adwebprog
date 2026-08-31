import {
  useEffect,
  useState,
} from "react";

import Button from "../components/Button";
import apiRequest from "../services/api";

const OrdersPage = () => {
  const [
    orders,
    setOrders,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  // =========================
  // LOAD CUSTOMER ORDERS
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

        const orderList =
          Array.isArray(data)
            ? data
            : Array.isArray(
                  data?.data
                )
              ? data.data
              : [];

        setOrders(
          orderList
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to load orders."
        );

        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // STATUS STYLE
  // =========================
  const getStatusStyle =
    (status) => {
      switch (status) {
        case "Pending":
          return "border-yellow-400 bg-yellow-100 text-yellow-950";

        case "Confirmed":
          return "border-blue-300 bg-blue-100 text-blue-950";

        case "Ready for Claiming":
          return "border-green-300 bg-green-100 text-green-950";

        default:
          return "border-zinc-300 bg-zinc-100 text-zinc-800";
      }
    };

  // =========================
  // STATUS NUMBER
  // =========================
  const getStatusStep =
    (status) => {
      if (
        status ===
        "Ready for Claiming"
      ) {
        return 3;
      }

      if (
        status ===
        "Confirmed"
      ) {
        return 2;
      }

      return 1;
    };

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate =
    (date) => {
      if (!date) {
        return "Date unavailable";
      }

      return new Date(
        date
      ).toLocaleString(
        "en-PH",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }
      );
    };

  // =========================
  // FORMAT PRICE
  // =========================
  const formatPrice =
    (value) =>
      Number(
        value || 0
      ).toLocaleString(
        "en-PH",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      );

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <section
        aria-labelledby="orders-loading-title"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
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
            id="orders-loading-title"
            className="mt-5 text-xl font-black text-blue-950"
          >
            Loading your orders
          </h1>

          <p className="mt-2 text-sm text-zinc-600">
            Retrieving your latest
            BulldogEx order
            information.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="orders-title"
      className="bg-blue-50 px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <header className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
            BulldogEx Shop
          </p>

          <h1
            id="orders-title"
            className="mt-2 text-4xl font-black tracking-tight text-blue-950 sm:text-5xl"
          >
            My Orders
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-700 sm:text-base">
            Track your order
            progress and check when
            your items are ready
            for claiming.
          </p>
        </header>

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-6 rounded-2xl border-2 border-red-300 bg-red-50 p-5"
          >
            <h2 className="font-black text-red-950">
              Unable to load orders
            </h2>

            <p className="mt-2 text-sm leading-6 text-red-900">
              {error}
            </p>

            <Button
              type="button"
              variant="danger"
              onClick={
                fetchOrders
              }
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* EMPTY */}
        {!error &&
        orders.length === 0 ? (
          <div className="rounded-3xl border-2 border-blue-100 bg-white p-10 text-center shadow-sm">
            <div
              aria-hidden="true"
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-blue-950 bg-yellow-300 text-3xl"
            >
              📦
            </div>

            <h2 className="mt-6 text-2xl font-black text-blue-950">
              No orders yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-700">
              Your orders will
              appear here after
              you complete
              checkout.
            </p>

            <Button
              to="/products"
              variant="blue"
              className="mt-6"
            >
              Browse Products
            </Button>
          </div>
        ) : (
          !error && (
            <div className="space-y-7">
              {orders.map(
                (order) => {
                  const step =
                    getStatusStep(
                      order.status
                    );

                  return (
                    <article
                      key={
                        order._id
                      }
                      className="overflow-hidden rounded-3xl border-2 border-blue-100 bg-white shadow-sm"
                    >
                      {/* ORDER HEADER */}
                      <div className="flex flex-col gap-4 border-b-2 border-blue-100 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                            Order
                          </p>

                          <h2 className="mt-1 break-all text-base font-black text-blue-950">
                            #{order._id}
                          </h2>

                          <p className="mt-2 text-sm text-zinc-600">
                            Placed{" "}
                            <time
                              dateTime={
                                order.createdAt
                              }
                            >
                              {formatDate(
                                order.createdAt
                              )}
                            </time>
                          </p>
                        </div>

                        <span
                          className={`w-fit rounded-full border-2 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="p-5 sm:p-6">

                        {/* STATUS TRACKER */}
                        <section
                          aria-labelledby={`progress-${order._id}`}
                          className="rounded-2xl border-2 border-blue-100 bg-blue-50 p-5"
                        >
                          <h3
                            id={`progress-${order._id}`}
                            className="text-sm font-black uppercase tracking-[0.16em] text-blue-950"
                          >
                            Order Progress
                          </h3>

                          <p className="mt-2 text-sm text-zinc-700">
                            Current status:{" "}
                            <strong>
                              {order.status}
                            </strong>
                          </p>

                          <ol className="mt-6 grid gap-4 sm:grid-cols-3">

                            {/* PENDING */}
                            <li
                              aria-current={
                                step === 1
                                  ? "step"
                                  : undefined
                              }
                              className="relative"
                            >
                              <div
                                className={`rounded-2xl border-2 p-4 ${
                                  step >= 1
                                    ? "border-yellow-400 bg-yellow-100"
                                    : "border-zinc-200 bg-white"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <span
                                    aria-hidden="true"
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-zinc-900 bg-white font-black text-zinc-950"
                                  >
                                    {step > 1
                                      ? "✓"
                                      : "1"}
                                  </span>

                                  <div>
                                    <p className="font-black text-zinc-950">
                                      Pending
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-zinc-600">
                                      Order received.
                                    </p>
                                  </div>
                                </div>

                                {step === 1 && (
                                  <p className="sr-only">
                                    Current step
                                  </p>
                                )}

                                {step > 1 && (
                                  <p className="sr-only">
                                    Completed
                                  </p>
                                )}
                              </div>
                            </li>

                            {/* CONFIRMED */}
                            <li
                              aria-current={
                                step === 2
                                  ? "step"
                                  : undefined
                              }
                            >
                              <div
                                className={`rounded-2xl border-2 p-4 ${
                                  step >= 2
                                    ? "border-blue-300 bg-blue-100"
                                    : "border-zinc-200 bg-white"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <span
                                    aria-hidden="true"
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-zinc-900 bg-white font-black text-zinc-950"
                                  >
                                    {step > 2
                                      ? "✓"
                                      : "2"}
                                  </span>

                                  <div>
                                    <p className="font-black text-zinc-950">
                                      Confirmed
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-zinc-600">
                                      Order approved.
                                    </p>
                                  </div>
                                </div>

                                {step === 2 && (
                                  <p className="sr-only">
                                    Current step
                                  </p>
                                )}

                                {step > 2 && (
                                  <p className="sr-only">
                                    Completed
                                  </p>
                                )}
                              </div>
                            </li>

                            {/* READY */}
                            <li
                              aria-current={
                                step === 3
                                  ? "step"
                                  : undefined
                              }
                            >
                              <div
                                className={`rounded-2xl border-2 p-4 ${
                                  step >= 3
                                    ? "border-green-300 bg-green-100"
                                    : "border-zinc-200 bg-white"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <span
                                    aria-hidden="true"
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-zinc-900 bg-white font-black text-zinc-950"
                                  >
                                    {step >= 3
                                      ? "✓"
                                      : "3"}
                                  </span>

                                  <div>
                                    <p className="font-black text-zinc-950">
                                      Ready for
                                      Claiming
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-zinc-600">
                                      Ready for pickup.
                                    </p>
                                  </div>
                                </div>

                                {step === 3 && (
                                  <p className="sr-only">
                                    Current step
                                  </p>
                                )}
                              </div>
                            </li>
                          </ol>
                        </section>

                        {/* PRODUCTS */}
                        <section
                          aria-labelledby={`products-${order._id}`}
                          className="mt-7"
                        >
                          <h3
                            id={`products-${order._id}`}
                            className="text-sm font-black uppercase tracking-[0.16em] text-blue-700"
                          >
                            Products
                          </h3>

                          <ul className="mt-4 space-y-3">
                            {order.items?.map(
                              (
                                item,
                                index
                              ) => {
                                const product =
                                  item.product;

                                if (
                                  !product
                                ) {
                                  return null;
                                }

                                const subtotal =
                                  Number(
                                    product.price ||
                                      0
                                  ) *
                                  Number(
                                    item.quantity ||
                                      0
                                  );

                                return (
                                  <li
                                    key={
                                      product._id ||
                                      index
                                    }
                                    className="rounded-2xl border-2 border-zinc-200 bg-zinc-50 p-4"
                                  >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                      <div>
                                        <h4 className="font-black text-zinc-950">
                                          {
                                            product.name
                                          }
                                        </h4>

                                        <p className="mt-1 text-sm text-zinc-600">
                                          Quantity:{" "}
                                          <strong className="text-zinc-900">
                                            {
                                              item.quantity
                                            }
                                          </strong>
                                        </p>
                                      </div>

                                      <p className="text-lg font-black text-blue-950">
                                        <span className="sr-only">
                                          Item subtotal:
                                        </span>
                                        ₱
                                        {formatPrice(
                                          subtotal
                                        )}
                                      </p>
                                    </div>
                                  </li>
                                );
                              }
                            )}
                          </ul>
                        </section>

                        {/* ORDER DETAILS */}
                        <section
                          aria-labelledby={`details-${order._id}`}
                          className="mt-7 border-t-2 border-zinc-200 pt-6"
                        >
                          <h3
                            id={`details-${order._id}`}
                            className="text-sm font-black uppercase tracking-[0.16em] text-blue-700"
                          >
                            Order Details
                          </h3>

                          <dl className="mt-4 grid gap-4 sm:grid-cols-2">

                            <div className="rounded-2xl border-2 border-zinc-200 bg-zinc-50 p-4">
                              <dt className="text-xs font-black uppercase tracking-[0.12em] text-zinc-600">
                                Shipping Address
                              </dt>

                              <dd className="mt-2 text-sm font-semibold leading-6 text-zinc-950">
                                {
                                  order.shippingAddress
                                }
                              </dd>
                            </div>

                            <div className="rounded-2xl border-2 border-zinc-200 bg-zinc-50 p-4">
                              <dt className="text-xs font-black uppercase tracking-[0.12em] text-zinc-600">
                                Payment Method
                              </dt>

                              <dd className="mt-2 text-sm font-semibold text-zinc-950">
                                {
                                  order.paymentMethod
                                }
                              </dd>
                            </div>

                            <div className="rounded-2xl border-2 border-zinc-200 bg-zinc-50 p-4">
                              <dt className="text-xs font-black uppercase tracking-[0.12em] text-zinc-600">
                                Order Date
                              </dt>

                              <dd className="mt-2 text-sm font-semibold leading-6 text-zinc-950">
                                <time
                                  dateTime={
                                    order.createdAt
                                  }
                                >
                                  {formatDate(
                                    order.createdAt
                                  )}
                                </time>
                              </dd>
                            </div>

                            <div className="rounded-2xl border-2 border-blue-950 bg-blue-950 p-4 text-white">
                              <dt className="text-xs font-black uppercase tracking-[0.12em] text-blue-100">
                                Order Total
                              </dt>

                              <dd className="mt-2 text-2xl font-black text-yellow-300">
                                <span className="sr-only">
                                  Total:
                                </span>

                                ₱
                                {formatPrice(
                                  order.totalPrice
                                )}
                              </dd>
                            </div>
                          </dl>
                        </section>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default OrdersPage;