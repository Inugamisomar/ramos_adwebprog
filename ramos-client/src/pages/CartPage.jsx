import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import Button from "../components/Button";
import apiRequest from "../services/api";

const CartPage = () => {
  const [
    cart,
    setCart,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    updating,
    setUpdating,
  ] = useState(false);

  const [
    placingOrder,
    setPlacingOrder,
  ] = useState(false);

  const [
    shippingAddress,
    setShippingAddress,
  ] = useState("");

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("");

  // LOAD CART
  const fetchCart =
    async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await apiRequest(
            "/carts"
          );

        const carts =
          Array.isArray(data)
            ? data
            : Array.isArray(
                  data?.data
                )
              ? data.data
              : [];

        setCart(
          carts.length > 0
            ? carts[0]
            : null
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to load cart."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchCart();
  }, []);

  // UPDATE CART ITEMS
  const updateCartItems =
    async (items) => {
      if (!cart?._id) {
        return;
      }

      try {
        setUpdating(true);
        setError("");
        setSuccess("");

        const response =
          await apiRequest(
            `/carts/${cart._id}`,
            {
              method: "PUT",

              body:
                JSON.stringify({
                  items,
                }),
            }
          );

        setCart(
          response.cart
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to update cart."
        );
      } finally {
        setUpdating(false);
      }
    };

  // GET PRODUCT ID
  const getProductId =
    (product) => {
      if (
        typeof product ===
        "object"
      ) {
        return product?._id;
      }

      return product;
    };

  // INCREASE QUANTITY
  const increaseQuantity =
    (item) => {
      const product =
        item.product;

      if (
        Number(
          item.quantity
        ) >=
        Number(
          product.stock
        )
      ) {
        setError(
          `Only ${product.stock} item(s) available for ${product.name}.`
        );

        return;
      }

      setError("");
      setSuccess("");

      const productId =
        getProductId(
          product
        );

      const items =
        cart.items.map(
          (
            cartItem
          ) => {
            const cartProductId =
              getProductId(
                cartItem.product
              );

            return {
              product:
                cartProductId,

              quantity:
                cartProductId ===
                productId
                  ? Number(
                      cartItem.quantity
                    ) + 1
                  : Number(
                      cartItem.quantity
                    ),
            };
          }
        );

      updateCartItems(
        items
      );
    };

  // DECREASE QUANTITY
  const decreaseQuantity =
    (item) => {
      if (
        Number(
          item.quantity
        ) <= 1
      ) {
        removeItem(
          item
        );

        return;
      }

      setError("");
      setSuccess("");

      const productId =
        getProductId(
          item.product
        );

      const items =
        cart.items.map(
          (
            cartItem
          ) => {
            const cartProductId =
              getProductId(
                cartItem.product
              );

            return {
              product:
                cartProductId,

              quantity:
                cartProductId ===
                productId
                  ? Number(
                      cartItem.quantity
                    ) - 1
                  : Number(
                      cartItem.quantity
                    ),
            };
          }
        );

      updateCartItems(
        items
      );
    };

  // REMOVE ITEM
  const removeItem =
    (item) => {
      setError("");
      setSuccess("");

      const productId =
        getProductId(
          item.product
        );

      const items =
        cart.items
          .filter(
            (
              cartItem
            ) =>
              getProductId(
                cartItem.product
              ) !==
              productId
          )
          .map(
            (
              cartItem
            ) => ({
              product:
                getProductId(
                  cartItem.product
                ),

              quantity:
                Number(
                  cartItem.quantity
                ),
            })
          );

      updateCartItems(
        items
      );
    };

  // PLACE ORDER
  const handlePlaceOrder =
    async () => {
      setError("");
      setSuccess("");

      // CHECK CART
      if (
        !cart ||
        !cart.items ||
        cart.items.length ===
          0
      ) {
        setError(
          "Your cart is empty."
        );

        return;
      }

      // CHECK ADDRESS
      if (
        !shippingAddress.trim()
      ) {
        setError(
          "Please enter your shipping address."
        );

        return;
      }

      // CHECK PAYMENT
      if (
        !paymentMethod
      ) {
        setError(
          "Please select a payment method."
        );

        return;
      }

      try {
        setPlacingOrder(
          true
        );

        const orderItems =
          cart.items.map(
            (item) => ({
              product:
                getProductId(
                  item.product
                ),

              quantity:
                Number(
                  item.quantity
                ),
            })
          );

        // CREATE ORDER
        const orderResponse =
          await apiRequest(
            "/orders",
            {
              method: "POST",

              body:
                JSON.stringify({
                  items:
                    orderItems,

                  shippingAddress:
                    shippingAddress.trim(),

                  paymentMethod,
                }),
            }
          );

        // CLEAR CART
        try {
          const cartResponse =
            await apiRequest(
              `/carts/${cart._id}`,
              {
                method:
                  "PUT",

                body:
                  JSON.stringify({
                    items:
                      [],
                  }),
              }
            );

          setCart(
            cartResponse.cart
          );
        } catch {
          setSuccess(
            `Order placed successfully${
              orderResponse
                ?.order?._id
                ? `! Order ID: ${orderResponse.order._id}`
                : "!"
            }`
          );

          setError(
            "The order was created, but the cart could not be cleared automatically."
          );

          return;
        }

        setShippingAddress(
          ""
        );

        setPaymentMethod(
          ""
        );

        setSuccess(
          `Order placed successfully${
            orderResponse
              ?.order?._id
              ? `! Order ID: ${orderResponse.order._id}`
              : "!"
          }`
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to place order."
        );
      } finally {
        setPlacingOrder(
          false
        );
      }
    };

  // CART TOTAL
  const formattedTotal =
    Number(
      cart?.totalPrice || 0
    ).toLocaleString(
      "en-PH",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

  // LOADING
  if (loading) {
    return (
      <section
        aria-labelledby="cart-loading-title"
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
            id="cart-loading-title"
            className="mt-5 text-xl font-black text-blue-950"
          >
            Loading your cart
          </h1>

          <p className="mt-2 text-sm text-zinc-600">
            Retrieving your
            selected products.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="cart-title"
      className="bg-blue-50 px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

          {/* PAGE HEADER */}
        <header className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
            BulldogEx Shop
          </p>

          <h1
            id="cart-title"
            className="mt-2 text-4xl font-black tracking-tight text-blue-950 sm:text-5xl"
          >
            Your Cart
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-700 sm:text-base">
            Review your selected
            items, adjust
            quantities, provide
            your order
            information, and
            place your order.
          </p>
        </header>

        {/* SUCCESS */}
        {success && (
          <div
            role="status"
            aria-live="polite"
            className="mb-6 rounded-2xl border-2 border-green-300 bg-green-50 px-5 py-4 text-sm font-semibold leading-6 text-green-900"
          >
            {success}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-6 rounded-2xl border-2 border-red-300 bg-red-50 px-5 py-4 text-sm font-semibold leading-6 text-red-900"
          >
            {error}
          </div>
        )}

        {/* EMPTY CART */}
        {!cart ||
        !cart.items ||
        cart.items.length ===
          0 ? (
          <div className="rounded-3xl border-2 border-blue-100 bg-white p-10 text-center shadow-sm">

            <div
              aria-hidden="true"
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-blue-950 bg-yellow-300 text-3xl"
            >
              🛒
            </div>

            <h2 className="mt-6 text-2xl font-black text-blue-950">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-700">
              Browse the BulldogEx
              catalog and add
              products before
              placing an order.
            </p>

            <Button
              to="/products"
              variant="blue"
              className="mt-6"
            >
              Browse Products
            </Button>

            {success && (
              <Button
                to="/orders"
                variant="secondary"
                className="mt-3 sm:ml-3"
              >
                View My Orders
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">

                  {/* CART ITEMS */}
            <div>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                    Selected Items
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-blue-950">
                    Shopping Cart
                  </h2>
                </div>

                <span className="rounded-full border-2 border-blue-950 bg-yellow-100 px-4 py-2 text-sm font-bold text-zinc-950">
                  {
                    cart.items
                      .length
                  }{" "}
                  {cart.items
                    .length ===
                  1
                    ? "item"
                    : "items"}
                </span>
              </div>

              <ul
                aria-label="Items in cart"
                className="space-y-5"
              >
                {cart.items.map(
                  (item) => {
                    const product =
                      item.product;

                    const itemTotal =
                      Number(
                        product.price ||
                          0
                      ) *
                      Number(
                        item.quantity ||
                          0
                      );

                    const itemPrice =
                      Number(
                        product.price ||
                          0
                      ).toLocaleString(
                        "en-PH",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      );

                    const formattedItemTotal =
                      itemTotal.toLocaleString(
                        "en-PH",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      );

                    return (
                      <li
                        key={
                          product._id
                        }
                      >
                        <article className="rounded-3xl border-2 border-blue-100 bg-white p-5 shadow-sm">
                          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                            {/* IMAGE */}
                            <div className="h-32 w-full shrink-0 overflow-hidden rounded-2xl border-2 border-zinc-200 bg-zinc-100 sm:w-32">
                              {product.image ? (
                                <img
                                  src={
                                    product.image
                                  }
                                  alt={`${product.name} product`}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div
                                  role="img"
                                  aria-label={`No image available for ${product.name}`}
                                  className="flex h-full flex-col items-center justify-center gap-2 p-3 text-center text-zinc-600"
                                >
                                  <span
                                    aria-hidden="true"
                                    className="text-3xl"
                                  >
                                    📦
                                  </span>

                                  <span className="text-xs font-semibold">
                                    No image
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* PRODUCT INFO */}
                            <div className="min-w-0 flex-1">
                              <h3 className="text-xl font-black text-blue-950">
                                {
                                  product.name
                                }
                              </h3>

                              <p className="mt-2 text-sm text-zinc-700">
                                <span className="sr-only">
                                  Price per
                                  item:
                                </span>

                                ₱
                                {
                                  itemPrice
                                }{" "}
                                each
                              </p>

                              <p className="mt-2 text-base font-black text-zinc-950">
                                Subtotal:{" "}
                                ₱
                                {
                                  formattedItemTotal
                                }
                              </p>

                              <p className="mt-2 text-xs font-semibold text-zinc-600">
                                Available
                                stock:{" "}
                                {
                                  product.stock
                                }
                              </p>
                            </div>

                            {/* CONTROLS */}
                            <div className="flex flex-col gap-3 sm:items-end">

                              <p
                                id={`quantity-label-${product._id}`}
                                className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-600"
                              >
                                Quantity
                              </p>

                              <div
                                role="group"
                                aria-labelledby={`quantity-label-${product._id}`}
                                className="inline-flex w-fit items-center overflow-hidden rounded-xl border-2 border-zinc-900 bg-white"
                              >
                                {/* DECREASE */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    decreaseQuantity(
                                      item
                                    )
                                  }
                                  disabled={
                                    updating ||
                                    placingOrder
                                  }
                                  aria-label={`Decrease quantity of ${product.name}`}
                                  className="flex h-12 w-12 items-center justify-center bg-zinc-100 text-xl font-black text-zinc-950 transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <span
                                    aria-hidden="true"
                                  >
                                    −
                                  </span>
                                </button>

                                {/* CURRENT QUANTITY */}
                                <span
                                  aria-live="polite"
                                  className="flex h-12 min-w-12 items-center justify-center border-x-2 border-zinc-900 bg-white px-4 font-black text-zinc-950"
                                >
                                  {
                                    item.quantity
                                  }
                                </span>

                                {/* INCREASE */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    increaseQuantity(
                                      item
                                    )
                                  }
                                  disabled={
                                    updating ||
                                    placingOrder ||
                                    Number(
                                      item.quantity
                                    ) >=
                                      Number(
                                        product.stock
                                      )
                                  }
                                  aria-label={`Increase quantity of ${product.name}`}
                                  className="flex h-12 w-12 items-center justify-center bg-yellow-300 text-xl font-black text-zinc-950 transition hover:bg-yellow-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <span
                                    aria-hidden="true"
                                  >
                                    +
                                  </span>
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  removeItem(
                                    item
                                  )
                                }
                                disabled={
                                  updating ||
                                  placingOrder
                                }
                                className="min-h-11 rounded-lg px-3 text-sm font-bold text-red-700 underline decoration-2 underline-offset-4 transition hover:bg-red-50 hover:text-red-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Remove{" "}
                                {
                                  product.name
                                }
                              </button>
                            </div>
                          </div>
                        </article>
                      </li>
                    );
                  }
                )}
              </ul>

              {/* UPDATE STATUS */}
              <div
                aria-live="polite"
                className="mt-4 min-h-6 text-sm font-semibold text-blue-800"
              >
                {updating
                  ? "Updating your cart..."
                  : ""}
              </div>

              <Link
                to="/products"
                className="mt-3 inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-bold text-blue-800 underline decoration-2 underline-offset-4 transition hover:text-blue-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 focus-visible:ring-offset-2"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* CHECKOUT */}
            <aside
              aria-labelledby="checkout-title"
              className="h-fit rounded-3xl border-2 border-blue-950 bg-yellow-100 p-6 shadow-sm lg:sticky lg:top-28"
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                Checkout
              </p>

              <h2
                id="checkout-title"
                className="mt-2 text-2xl font-black text-blue-950"
              >
                Order Summary
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-700">
                Complete the
                required
                information below
                before placing
                your order.
              </p>

              {/* ADDRESS */}
              <div className="mt-6">
                <label
                  htmlFor="shippingAddress"
                  className="block text-sm font-bold text-zinc-950"
                >
                  Shipping Address
                  <span
                    aria-hidden="true"
                    className="ml-1 text-red-600"
                  >
                    *
                  </span>
                </label>

                <textarea
                  id="shippingAddress"
                  name="shippingAddress"
                  rows={4}
                  value={
                    shippingAddress
                  }
                  disabled={
                    placingOrder
                  }
                  onChange={(
                    event
                  ) =>
                    setShippingAddress(
                      event.target
                        .value
                    )
                  }
                  placeholder="Enter your complete address"
                  required
                  aria-required="true"
                  aria-describedby="shipping-help"
                  className="mt-2 w-full resize-y rounded-xl border-2 border-zinc-300 bg-white px-4 py-3 text-sm leading-6 text-zinc-950 outline-none transition placeholder:text-zinc-500 hover:border-blue-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-zinc-100"
                />

                <p
                  id="shipping-help"
                  className="mt-2 text-xs leading-5 text-zinc-600"
                >
                  Enter the
                  complete address
                  or campus pickup
                  information
                  required for
                  this order.
                </p>
              </div>

              {/* PAYMENT */}
              <div className="mt-5">
                <label
                  htmlFor="paymentMethod"
                  className="block text-sm font-bold text-zinc-950"
                >
                  Payment Method
                  <span
                    aria-hidden="true"
                    className="ml-1 text-red-600"
                  >
                    *
                  </span>
                </label>

                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={
                    paymentMethod
                  }
                  disabled={
                    placingOrder
                  }
                  required
                  aria-required="true"
                  onChange={(
                    event
                  ) =>
                    setPaymentMethod(
                      event.target
                        .value
                    )
                  }
                  className="mt-2 min-h-12 w-full rounded-xl border-2 border-zinc-300 bg-white px-4 py-3 text-sm font-semibold text-zinc-950 outline-none transition hover:border-blue-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-zinc-100"
                >
                  <option value="">
                    Select payment
                    method
                  </option>

                  <option value="Cash on Claiming">
                    Cash on
                    Claiming
                  </option>

                  <option value="GCash">
                    GCash
                  </option>
                </select>
              </div>

              <div
                aria-hidden="true"
                className="my-6 border-t-2 border-dashed border-zinc-400"
              />

              {/* ORDER DETAILS */}
              <dl className="space-y-3">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <dt className="text-zinc-700">
                    Product lines
                  </dt>

                  <dd className="font-black text-zinc-950">
                    {
                      cart.items
                        .length
                    }
                  </dd>
                </div>

                <div className="flex items-end justify-between gap-4 border-t border-zinc-300 pt-4">
                  <dt className="text-lg font-black text-zinc-950">
                    Total
                  </dt>

                  <dd className="text-right text-3xl font-black text-blue-950">
                    <span className="sr-only">
                      Total price:
                    </span>

                    ₱
                    {
                      formattedTotal
                    }
                  </dd>
                </div>
              </dl>

              {/* PLACE ORDER */}
              <Button
                type="button"
                variant="blue"
                onClick={
                  handlePlaceOrder
                }
                disabled={
                  updating ||
                  placingOrder
                }
                aria-busy={
                  placingOrder
                }
                className="mt-6 w-full"
              >
                {placingOrder
                  ? "Placing Order..."
                  : "Place Order"}
              </Button>

              <div
                aria-live="polite"
                className="mt-3 min-h-5 text-center text-xs font-semibold text-zinc-700"
              >
                {placingOrder
                  ? "Your order is being submitted. Please wait."
                  : ""}
              </div>

              <p className="mt-3 text-center text-xs leading-5 text-zinc-600">
                New orders are
                initially marked
                as{" "}
                <strong className="text-zinc-900">
                  Pending
                </strong>
                .
              </p>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
};

export default CartPage;