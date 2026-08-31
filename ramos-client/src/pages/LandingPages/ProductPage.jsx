import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import Button from "../../components/Button.jsx";
import apiRequest from "../../services/api.js";

import {
  getCurrentUser,
} from "../../services/authService.js";

function ProductPage() {
  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const currentUser =
    getCurrentUser();

  // =========================
  // PRODUCT STATE
  // =========================
  const [
    product,
    setProduct,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  // =========================
  // CART STATE
  // =========================
  const [
    cartMessage,
    setCartMessage,
  ] = useState("");

  const [
    cartError,
    setCartError,
  ] = useState("");

  const [
    addingToCart,
    setAddingToCart,
  ] = useState(false);

  // =========================
  // REVIEW STATE
  // =========================
  const [
    reviews,
    setReviews,
  ] = useState([]);

  const [
    reviewsLoading,
    setReviewsLoading,
  ] = useState(false);

  const [
    reviewError,
    setReviewError,
  ] = useState("");

  const [
    reviewSuccess,
    setReviewSuccess,
  ] = useState("");

  const [
    rating,
    setRating,
  ] = useState(5);

  const [
    comment,
    setComment,
  ] = useState("");

  const [
    submittingReview,
    setSubmittingReview,
  ] = useState(false);

  // =========================
  // LOAD PRODUCT
  // =========================
  useEffect(() => {
    const fetchProduct =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await apiRequest(
              `/products/${id}`
            );

          const productData =
            data?.product ||
            data?.data ||
            data;

          if (
            !productData ||
            !productData._id
          ) {
            setProduct(null);
            return;
          }

          setProduct(
            productData
          );
        } catch (err) {
          setError(
            err.message ||
              "Unable to load product."
          );

          setProduct(null);
        } finally {
          setLoading(false);
        }
      };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // =========================
  // LOAD REVIEWS
  // =========================
  useEffect(() => {
    if (!product?._id) {
      return;
    }

    const fetchReviews =
      async () => {
        try {
          setReviewsLoading(
            true
          );

          setReviewError("");

          const data =
            await apiRequest(
              "/reviews"
            );

          const reviewList =
            Array.isArray(data)
              ? data
              : Array.isArray(
                    data?.data
                  )
                ? data.data
                : [];

          const productReviews =
            reviewList.filter(
              (review) => {
                const productId =
                  typeof review.product ===
                  "object"
                    ? review.product
                        ?._id
                    : review.product;

                return (
                  String(
                    productId
                  ) ===
                  String(
                    product._id
                  )
                );
              }
            );

          setReviews(
            productReviews
          );
        } catch (err) {
          setReviewError(
            err.message ||
              "Unable to load reviews."
          );
        } finally {
          setReviewsLoading(
            false
          );
        }
      };

    fetchReviews();
  }, [product?._id]);

  // =========================
  // CREATE REVIEW
  // =========================
  const handleReviewSubmit =
    async (event) => {
      event.preventDefault();

      setReviewError("");
      setReviewSuccess("");

      const token =
        localStorage.getItem(
          "token"
        );

      if (
        !token ||
        !currentUser
      ) {
        navigate(
          "/auth/signin"
        );

        return;
      }

      if (
        currentUser.role !==
        "customer"
      ) {
        setReviewError(
          "Only customer accounts can create product reviews."
        );

        return;
      }

      if (
        !comment.trim()
      ) {
        setReviewError(
          "Please enter a review comment."
        );

        return;
      }

      if (
        rating < 1 ||
        rating > 5
      ) {
        setReviewError(
          "Rating must be between 1 and 5."
        );

        return;
      }

      try {
        setSubmittingReview(
          true
        );

        const response =
          await apiRequest(
            "/reviews",
            {
              method: "POST",

              body:
                JSON.stringify({
                  product:
                    product._id,

                  rating:
                    Number(
                      rating
                    ),

                  comment:
                    comment.trim(),
                }),
            }
          );

        const newReview =
          response?.data ||
          response;

        setReviews(
          (
            previousReviews
          ) => [
            ...previousReviews,
            newReview,
          ]
        );

        setRating(5);
        setComment("");

        setReviewSuccess(
          "Review submitted successfully."
        );
      } catch (err) {
        setReviewError(
          err.message ||
            "Unable to create review."
        );
      } finally {
        setSubmittingReview(
          false
        );
      }
    };

  // =========================
  // ADD TO CART
  // =========================
  const handleAddToCart =
    async () => {
      setCartMessage("");
      setCartError("");

      const token =
        localStorage.getItem(
          "token"
        );

      if (
        !token ||
        !currentUser
      ) {
        navigate(
          "/auth/signin"
        );

        return;
      }

      if (
        currentUser.role ===
        "admin"
      ) {
        setCartError(
          "Admin accounts cannot add products to cart."
        );

        return;
      }

      if (!product?._id) {
        setCartError(
          "Product information is unavailable."
        );

        return;
      }

      if (
        Number(
          product.stock
        ) <= 0
      ) {
        setCartError(
          "This product is out of stock."
        );

        return;
      }

      try {
        setAddingToCart(
          true
        );

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

        const existingCart =
          carts.length > 0
            ? carts[0]
            : null;

        // CART EXISTS
        if (existingCart) {
          const existingItems =
            existingCart.items ||
            [];

          const updatedItems =
            existingItems.map(
              (item) => ({
                product:
                  typeof item.product ===
                  "object"
                    ? item
                        .product
                        ._id
                    : item.product,

                quantity:
                  Number(
                    item.quantity
                  ),
              })
            );

          const existingItemIndex =
            updatedItems.findIndex(
              (item) =>
                String(
                  item.product
                ) ===
                String(
                  product._id
                )
            );

          if (
            existingItemIndex >=
            0
          ) {
            const newQuantity =
              updatedItems[
                existingItemIndex
              ].quantity + 1;

            if (
              newQuantity >
              Number(
                product.stock
              )
            ) {
              setCartError(
                `Only ${product.stock} item(s) are available.`
              );

              return;
            }

            updatedItems[
              existingItemIndex
            ].quantity =
              newQuantity;
          } else {
            updatedItems.push({
              product:
                product._id,
              quantity: 1,
            });
          }

          await apiRequest(
            `/carts/${existingCart._id}`,
            {
              method: "PUT",

              body:
                JSON.stringify({
                  items:
                    updatedItems,
                }),
            }
          );
        } else {
          // NEW CART
          await apiRequest(
            "/carts",
            {
              method: "POST",

              body:
                JSON.stringify({
                  items: [
                    {
                      product:
                        product._id,
                      quantity: 1,
                    },
                  ],
                }),
            }
          );
        }

        setCartMessage(
          `${product.name} was added to your cart.`
        );
      } catch (err) {
        setCartError(
          err.message ||
            "Unable to add product to cart."
        );
      } finally {
        setAddingToCart(
          false
        );
      }
    };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <section
        aria-labelledby="product-loading-title"
        className="px-4 py-16 sm:px-6 lg:px-8"
      >
        <div
          role="status"
          aria-live="polite"
          className="mx-auto max-w-3xl rounded-3xl border-2 border-blue-200 bg-white p-10 text-center shadow-sm"
        >
          <div
            aria-hidden="true"
            className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-950"
          />

          <h1
            id="product-loading-title"
            className="mt-5 text-xl font-black text-blue-950"
          >
            Loading product
          </h1>

          <p className="mt-2 text-sm text-zinc-600">
            Retrieving the latest
            product information.
          </p>
        </div>
      </section>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error) {
    return (
      <section
        aria-labelledby="product-error-title"
        className="px-4 py-16 sm:px-6 lg:px-8"
      >
        <div
          role="alert"
          className="mx-auto max-w-3xl rounded-3xl border-2 border-red-300 bg-red-50 p-8"
        >
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700">
            Product Error
          </p>

          <h1
            id="product-error-title"
            className="mt-2 text-3xl font-black text-red-950"
          >
            Failed to load product
          </h1>

          <p className="mt-3 leading-7 text-red-800">
            {error}
          </p>

          <Button
            to="/products"
            variant="secondary"
            className="mt-6"
          >
            Back to Products
          </Button>
        </div>
      </section>
    );
  }

  // =========================
  // PRODUCT NOT FOUND
  // =========================
  if (!product) {
    return (
      <section
        aria-labelledby="product-not-found-title"
        className="px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-3xl rounded-3xl border-2 border-zinc-300 bg-white p-8 text-center shadow-sm">
          <div
            aria-hidden="true"
            className="text-5xl"
          >
            📦
          </div>

          <h1
            id="product-not-found-title"
            className="mt-4 text-3xl font-black text-blue-950"
          >
            Product not found
          </h1>

          <p className="mt-3 text-zinc-700">
            The requested product
            does not exist or is
            no longer available.
          </p>

          <Button
            to="/products"
            variant="blue"
            className="mt-6"
          >
            Browse Products
          </Button>
        </div>
      </section>
    );
  }

  // =========================
  // PRODUCT VALUES
  // =========================
  const categoryName =
    typeof product.category ===
    "object"
      ? product.category?.name
      : product.category;

  const supplierName =
    typeof product.supplier ===
    "object"
      ? product.supplier?.name
      : product.supplier;

  const stock =
    Number(
      product.stock || 0
    );

  const formattedPrice =
    Number(
      product.price || 0
    ).toLocaleString(
      "en-PH",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

  // =========================
  // AVERAGE RATING
  // =========================
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (
              total,
              review
            ) =>
              total +
              Number(
                review.rating
              ),
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="w-full">

      {/* PRODUCT DETAILS */}
      <section
        aria-labelledby="product-title"
        className="bg-blue-50 px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">

          <Button
            to="/products"
            variant="secondary"
          >
            ← Back to Products
          </Button>

          <div className="mt-7 grid gap-8 lg:grid-cols-2 lg:items-start">

            {/* IMAGE */}
            <div className="overflow-hidden rounded-3xl border-2 border-blue-950 bg-white shadow-sm">
              <div className="aspect-[4/3] bg-zinc-100">
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
                    className="flex h-full w-full flex-col items-center justify-center gap-3 text-zinc-600"
                  >
                    <span
                      aria-hidden="true"
                      className="text-6xl"
                    >
                      📦
                    </span>

                    <span className="font-semibold">
                      No image
                      available
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* INFORMATION */}
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
                {categoryName ||
                  "Product"}
              </p>

              <h1
                id="product-title"
                className="mt-2 text-4xl font-black leading-tight tracking-tight text-blue-950 sm:text-5xl"
              >
                {product.name}
              </h1>

              {/* PRICE */}
              <p className="mt-5 text-3xl font-black text-zinc-950">
                <span className="sr-only">
                  Price:
                </span>

                ₱{formattedPrice}
              </p>

              {/* STATUS */}
              <div className="mt-5 flex flex-wrap gap-3">

                {stock > 0 ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-green-300 bg-green-50 px-4 py-2 text-sm font-bold text-green-900">
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full bg-green-700"
                    />

                    In Stock:{" "}
                    {stock}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full border border-red-300 bg-red-50 px-4 py-2 text-sm font-bold text-red-900">
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full bg-red-700"
                    />

                    Out of Stock
                  </span>
                )}

                <span className="rounded-full border border-yellow-400 bg-yellow-100 px-4 py-2 text-sm font-bold text-zinc-900">
                  ★{" "}
                  {averageRating}/5
                </span>

                <span className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700">
                  {reviews.length}{" "}
                  {reviews.length ===
                  1
                    ? "Review"
                    : "Reviews"}
                </span>
              </div>

              {/* DESCRIPTION */}
              <div className="mt-7">
                <h2 className="text-lg font-black text-blue-950">
                  Description
                </h2>

                <p className="mt-3 whitespace-pre-wrap text-base leading-7 text-zinc-700">
                  {product.description ||
                    "No description available."}
                </p>
              </div>

              {/* PRODUCT INFO */}
              <dl className="mt-7 grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl border-2 border-blue-100 bg-white p-4">
                  <dt className="text-xs font-black uppercase tracking-[0.15em] text-blue-700">
                    Category
                  </dt>

                  <dd className="mt-2 font-bold text-zinc-950">
                    {categoryName ||
                      "Uncategorized"}
                  </dd>
                </div>

                <div className="rounded-2xl border-2 border-blue-100 bg-white p-4">
                  <dt className="text-xs font-black uppercase tracking-[0.15em] text-blue-700">
                    Supplier
                  </dt>

                  <dd className="mt-2 font-bold text-zinc-950">
                    {supplierName ||
                      "Not specified"}
                  </dd>
                </div>

                <div className="rounded-2xl border-2 border-blue-100 bg-white p-4">
                  <dt className="text-xs font-black uppercase tracking-[0.15em] text-blue-700">
                    Price
                  </dt>

                  <dd className="mt-2 font-bold text-zinc-950">
                    ₱
                    {
                      formattedPrice
                    }
                  </dd>
                </div>

                <div className="rounded-2xl border-2 border-blue-100 bg-white p-4">
                  <dt className="text-xs font-black uppercase tracking-[0.15em] text-blue-700">
                    Available
                    Stock
                  </dt>

                  <dd className="mt-2 font-bold text-zinc-950">
                    {stock}
                  </dd>
                </div>
              </dl>

              {/* CART */}
              <div className="mt-8 border-t-2 border-blue-100 pt-7">
                <h2 className="text-xl font-black text-blue-950">
                  Purchase this
                  product
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-700">
                  Add this item to
                  your cart and
                  continue shopping
                  or proceed to
                  checkout later.
                </p>

                {cartMessage && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="mt-5 rounded-xl border-2 border-green-300 bg-green-50 px-4 py-3 text-sm font-semibold text-green-900"
                  >
                    {
                      cartMessage
                    }
                  </div>
                )}

                {cartError && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="mt-5 rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-900"
                  >
                    {
                      cartError
                    }
                  </div>
                )}

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  {currentUser?.role !==
                    "admin" && (
                    <Button
                      type="button"
                      variant="blue"
                      onClick={
                        handleAddToCart
                      }
                      disabled={
                        stock <= 0 ||
                        addingToCart
                      }
                      aria-busy={
                        addingToCart
                      }
                      className="w-full sm:w-auto"
                    >
                      {addingToCart
                        ? "Adding to Cart..."
                        : stock > 0
                          ? "Add to Cart"
                          : "Out of Stock"}
                    </Button>
                  )}

                  {currentUser?.role ===
                    "customer" && (
                    <Button
                      to="/cart"
                      variant="secondary"
                      className="w-full sm:w-auto"
                    >
                      View Cart
                    </Button>
                  )}
                </div>

                {currentUser?.role ===
                  "admin" && (
                  <div className="mt-5 rounded-xl border-2 border-blue-200 bg-blue-100 px-4 py-3">
                    <p className="font-bold text-blue-950">
                      Admin account
                    </p>

                    <p className="mt-1 text-sm leading-6 text-blue-900">
                      Admin
                      accounts can
                      view product
                      information
                      but cannot
                      add products
                      to customer
                      carts.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section
        aria-labelledby="reviews-title"
        className="border-t-2 border-zinc-200 bg-white px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">

          {/* REVIEW HEADER */}
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
              Customer Feedback
            </p>

            <h2
              id="reviews-title"
              className="mt-2 text-3xl font-black tracking-tight text-blue-950"
            >
              Product Reviews
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-700">
              Average rating{" "}
              <strong className="text-zinc-950">
                {averageRating}{" "}
                out of 5
              </strong>

              {" · "}

              {reviews.length}{" "}
              {reviews.length ===
              1
                ? "review"
                : "reviews"}
            </p>
          </div>

          {/* REVIEW ERROR */}
          {reviewError && (
            <div
              role="alert"
              aria-live="assertive"
              className="mt-6 rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-900"
            >
              {reviewError}
            </div>
          )}

          {/* REVIEW SUCCESS */}
          {reviewSuccess && (
            <div
              role="status"
              aria-live="polite"
              className="mt-6 rounded-xl border-2 border-green-300 bg-green-50 px-4 py-3 text-sm font-semibold text-green-900"
            >
              {
                reviewSuccess
              }
            </div>
          )}

          {/* REVIEW LIST */}
          <div className="mt-8">
            {reviewsLoading && (
              <div
                role="status"
                aria-live="polite"
                className="rounded-2xl border-2 border-blue-100 bg-blue-50 p-6"
              >
                <p className="font-bold text-blue-950">
                  Loading
                  reviews...
                </p>
              </div>
            )}

            {!reviewsLoading &&
              reviews.length ===
                0 && (
                <div className="rounded-2xl border-2 border-zinc-200 bg-zinc-50 p-6">
                  <h3 className="font-black text-zinc-950">
                    No reviews
                    yet
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-700">
                    Be the first
                    customer to
                    share an
                    experience
                    with this
                    product.
                  </p>
                </div>
              )}

            {!reviewsLoading &&
              reviews.length > 0 && (
                <ul
                  aria-label="Customer reviews"
                  className="grid gap-4 md:grid-cols-2"
                >
                  {reviews.map(
                    (
                      review
                    ) => {
                      const reviewerName =
                        review.user
                          ? `${
                              review
                                .user
                                .firstName ||
                              ""
                            } ${
                              review
                                .user
                                .lastName ||
                              ""
                            }`.trim()
                          : "";

                      const displayName =
                        reviewerName ||
                        review.user
                          ?.username ||
                        review.user
                          ?.name ||
                        "Customer";

                      return (
                        <li
                          key={
                            review._id
                          }
                        >
                          <article className="h-full rounded-2xl border-2 border-zinc-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <h3 className="font-black text-zinc-950">
                                {
                                  displayName
                                }
                              </h3>

                              <span
                                aria-label={`${review.rating} out of 5 stars`}
                                className="rounded-full border border-yellow-400 bg-yellow-100 px-3 py-1 text-xs font-black text-zinc-950"
                              >
                                <span
                                  aria-hidden="true"
                                >
                                  ★{" "}
                                  {
                                    review.rating
                                  }
                                  /5
                                </span>
                              </span>
                            </div>

                            <p className="mt-4 text-sm leading-6 text-zinc-700">
                              {
                                review.comment
                              }
                            </p>
                          </article>
                        </li>
                      );
                    }
                  )}
                </ul>
              )}
          </div>

          {/* WRITE REVIEW */}
          <div className="mt-12 border-t-2 border-zinc-200 pt-10">
            <div className="max-w-2xl">

              <h2 className="text-2xl font-black text-blue-950">
                Write a Review
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-700">
                Share your
                experience and
                rate this product
                from 1 to 5.
              </p>

              {/* GUEST */}
              {!currentUser && (
                <div className="mt-5 rounded-2xl border-2 border-blue-100 bg-blue-50 p-5">
                  <p className="text-sm leading-6 text-zinc-700">
                    You need to
                    sign in before
                    submitting a
                    product review.
                  </p>

                  <Button
                    to="/auth/signin"
                    variant="blue"
                    className="mt-4"
                  >
                    Sign In to
                    Review
                  </Button>
                </div>
              )}

              {/* ADMIN */}
              {currentUser?.role ===
                "admin" && (
                <div className="mt-5 rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                  <p className="font-bold text-blue-950">
                    Review
                    management
                  </p>

                  <p className="mt-2 text-sm leading-6 text-zinc-700">
                    Admin
                    accounts can
                    view customer
                    reviews here
                    and manage
                    them from the
                    Admin Review
                    Management
                    page.
                  </p>

                  <Button
                    to="/admin/reviews"
                    variant="secondary"
                    className="mt-4"
                  >
                    Manage Reviews
                  </Button>
                </div>
              )}

              {/* CUSTOMER FORM */}
              {currentUser?.role ===
                "customer" && (
                <form
                  onSubmit={
                    handleReviewSubmit
                  }
                  className="mt-6 space-y-6 rounded-3xl border-2 border-blue-100 bg-blue-50 p-5 sm:p-6"
                >
                  {/* RATING */}
                  <div>
                    <label
                      htmlFor="rating"
                      className="block text-sm font-bold text-zinc-950"
                    >
                      Rating
                    </label>

                    <select
                      id="rating"
                      name="rating"
                      value={
                        rating
                      }
                      onChange={(
                        event
                      ) =>
                        setRating(
                          Number(
                            event
                              .target
                              .value
                          )
                        )
                      }
                      disabled={
                        submittingReview
                      }
                      className="mt-2 min-h-12 w-full rounded-xl border-2 border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition hover:border-blue-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-zinc-100"
                    >
                      <option
                        value={
                          5
                        }
                      >
                        5 —
                        Excellent
                      </option>

                      <option
                        value={
                          4
                        }
                      >
                        4 — Very
                        Good
                      </option>

                      <option
                        value={
                          3
                        }
                      >
                        3 — Good
                      </option>

                      <option
                        value={
                          2
                        }
                      >
                        2 — Fair
                      </option>

                      <option
                        value={
                          1
                        }
                      >
                        1 — Poor
                      </option>
                    </select>
                  </div>

                  {/* COMMENT */}
                  <div>
                    <label
                      htmlFor="comment"
                      className="block text-sm font-bold text-zinc-950"
                    >
                      Review
                      comment
                      <span
                        aria-hidden="true"
                        className="ml-1 text-red-600"
                      >
                        *
                      </span>
                    </label>

                    <textarea
                      id="comment"
                      name="comment"
                      rows={
                        5
                      }
                      value={
                        comment
                      }
                      onChange={(
                        event
                      ) =>
                        setComment(
                          event
                            .target
                            .value
                        )
                      }
                      placeholder="Share your experience with this product..."
                      required
                      disabled={
                        submittingReview
                      }
                      aria-required="true"
                      className="mt-2 w-full resize-y rounded-xl border-2 border-zinc-300 bg-white px-4 py-3 text-sm leading-6 text-zinc-950 outline-none transition placeholder:text-zinc-500 hover:border-blue-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-zinc-100"
                    />

                    <p className="mt-2 text-xs leading-5 text-zinc-600">
                      Describe the
                      product
                      quality,
                      comfort,
                      usefulness,
                      or your
                      overall
                      experience.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    variant="blue"
                    disabled={
                      submittingReview
                    }
                    aria-busy={
                      submittingReview
                    }
                    className="w-full sm:w-auto"
                  >
                    {submittingReview
                      ? "Submitting Review..."
                      : "Submit Review"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductPage;