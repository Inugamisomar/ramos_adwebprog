import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Button from "../../components/Button";
import apiRequest from "../../services/api";

const AdminReviewsPage = () => {
  const [
    reviews,
    setReviews,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    editingId,
    setEditingId,
  ] = useState(null);

  const [
    rating,
    setRating,
  ] = useState("5");

  const [
    comment,
    setComment,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const editFormRef =
    useRef(null);

  // LOAD REVIEWS
  const fetchReviews =
    async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await apiRequest(
            "/reviews"
          );

        setReviews(
          Array.isArray(data)
            ? data
            : Array.isArray(
                  data?.data
                )
              ? data.data
              : []
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to load reviews."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchReviews();
  }, []);

  // START EDIT
  const handleEdit =
    (review) => {
      setEditingId(
        review._id
      );

      setRating(
        String(
          review.rating || 5
        )
      );

      setComment(
        review.comment || ""
      );

      setError("");
      setSuccess("");

      requestAnimationFrame(() => {
        editFormRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    };

  // CANCEL EDIT
  const cancelEdit = () => {
    setEditingId(null);
    setRating("5");
    setComment("");
  };

  // UPDATE REVIEW
  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");
      setSuccess("");

      if (!editingId) {
        return;
      }

      if (
        !comment.trim()
      ) {
        setError(
          "Review comment is required."
        );

        return;
      }

      const numericRating =
        Number(rating);

      if (
        numericRating < 1 ||
        numericRating > 5
      ) {
        setError(
          "Rating must be between 1 and 5."
        );

        return;
      }

      try {
        setSaving(true);

        const data =
          await apiRequest(
            `/reviews/${editingId}`,
            {
              method: "PUT",

              body:
                JSON.stringify({
                  rating:
                    numericRating,

                  comment:
                    comment.trim(),
                }),
            }
          );

        setReviews(
          (previous) =>
            previous.map(
              (review) =>
                review._id ===
                editingId
                  ? data.review
                  : review
            )
        );

        setSuccess(
          data.message ||
            "Review updated successfully."
        );

        cancelEdit();
      } catch (err) {
        setError(
          err.message ||
            "Unable to update review."
        );
      } finally {
        setSaving(false);
      }
    };

  // FILTER REVIEWS
  const filteredReviews =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      if (!keyword) {
        return reviews;
      }

      return reviews.filter(
        (review) => {
          const productName =
            review.product?.name ||
            "";

          const userName =
            review.user?.name ||
            "";

          const email =
            review.user?.email ||
            "";

          const reviewComment =
            review.comment || "";

          return (
            productName
              .toLowerCase()
              .includes(
                keyword
              ) ||
            userName
              .toLowerCase()
              .includes(
                keyword
              ) ||
            email
              .toLowerCase()
              .includes(
                keyword
              ) ||
            reviewComment
              .toLowerCase()
              .includes(
                keyword
              )
          );
        }
      );
    }, [
      reviews,
      search,
    ]);

  // REVIEW COUNTS
  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (
            total,
            review
          ) =>
            total +
            Number(
              review.rating ||
                0
            ),
          0
        ) /
        reviews.length
      : 0;

  const fiveStarCount =
    reviews.filter(
      (review) =>
        Number(
          review.rating
        ) === 5
    ).length;

  // FORMAT DATE
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
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }
      );
    };

  // RENDER STARS
  const renderStars =
    (value) => {
      const safeRating =
        Math.max(
          0,
          Math.min(
            5,
            Number(value) || 0
          )
        );

      return "★".repeat(
        safeRating
      ) +
        "☆".repeat(
          5 - safeRating
        );
    };

  // LOADING
  if (loading) {
    return (
      <main className="min-h-screen bg-blue-50 px-4 py-16 sm:px-6 lg:px-8">
        <div
          role="status"
          aria-live="polite"
          className="mx-auto max-w-7xl rounded-3xl border-2 border-blue-200 bg-white p-10 text-center shadow-sm"
        >
          <div
            aria-hidden="true"
            className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-950"
          />

          <h1 className="mt-5 text-xl font-black text-blue-950">
            Loading review management
          </h1>

          <p className="mt-2 text-sm text-zinc-600">
            Retrieving customer product
            reviews.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      aria-labelledby="admin-reviews-title"
      className="min-h-screen bg-blue-50 px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
              BulldogEx Administration
            </p>

            <h1
              id="admin-reviews-title"
              className="mt-2 text-4xl font-black tracking-tight text-blue-950 sm:text-5xl"
            >
              Review Management
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-700 sm:text-base">
              View submitted customer
              reviews and update review
              ratings or comments when
              moderation is necessary.
            </p>
          </div>

          <Button
            to="/admin"
            variant="secondary"
          >
            ← Dashboard
          </Button>
        </header>

        {/* MESSAGES */}
        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-6 rounded-2xl border-2 border-red-300 bg-red-50 p-5"
          >
            <p className="font-black text-red-950">
              Review management error
            </p>

            <p className="mt-1 text-sm leading-6 text-red-900">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div
            role="status"
            aria-live="polite"
            className="mb-6 rounded-2xl border-2 border-green-300 bg-green-50 p-5"
          >
            <p className="font-black text-green-950">
              Success
            </p>

            <p className="mt-1 text-sm leading-6 text-green-900">
              {success}
            </p>
          </div>
        )}

        {/* SUMMARY */}
        <section
          aria-labelledby="review-summary-title"
        >
          <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                Overview
              </p>

              <h2
                id="review-summary-title"
                className="mt-1 text-2xl font-black text-blue-950"
              >
                Review Summary
              </h2>
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={
                fetchReviews
              }
            >
              Refresh Reviews
            </Button>
          </div>

          <dl className="grid gap-4 sm:grid-cols-3">

            <div className="rounded-3xl border-2 border-blue-100 bg-white p-5 shadow-sm">
              <dt className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                Total Reviews
              </dt>

              <dd className="mt-2 text-4xl font-black text-blue-950">
                {
                  reviews.length
                }
              </dd>
            </div>

            <div className="rounded-3xl border-2 border-yellow-300 bg-yellow-50 p-5 shadow-sm">
              <dt className="text-xs font-black uppercase tracking-[0.16em] text-yellow-900">
                Average Rating
              </dt>

              <dd className="mt-2 text-4xl font-black text-yellow-950">
                {averageRating.toFixed(
                  1
                )}
                <span className="text-lg">
                  /5
                </span>
              </dd>
            </div>

            <div className="rounded-3xl border-2 border-green-300 bg-green-50 p-5 shadow-sm">
              <dt className="text-xs font-black uppercase tracking-[0.16em] text-green-900">
                Five-Star Reviews
              </dt>

              <dd className="mt-2 text-4xl font-black text-green-950">
                {
                  fiveStarCount
                }
              </dd>
            </div>
          </dl>
        </section>

        {/* REVIEWS HEADER */}
        <section
          aria-labelledby="customer-reviews-title"
          className="mt-10"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                Reviews
              </p>

              <h2
                id="customer-reviews-title"
                className="mt-1 text-2xl font-black text-blue-950"
              >
                Customer Reviews
              </h2>

              <p className="mt-2 text-sm text-zinc-700">
                Showing{" "}
                <strong>
                  {
                    filteredReviews.length
                  }
                </strong>{" "}
                of{" "}
                <strong>
                  {
                    reviews.length
                  }
                </strong>{" "}
                reviews.
              </p>
            </div>

            {/* SEARCH */}
            <div className="w-full sm:max-w-sm">
              <label
                htmlFor="admin-review-search"
                className="block text-sm font-bold text-zinc-950"
              >
                Search reviews
              </label>

              <input
                id="admin-review-search"
                type="search"
                value={
                  search
                }
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target
                      .value
                  )
                }
                placeholder="Product, reviewer, email..."
                className="mt-2 min-h-12 w-full rounded-xl border-2 border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-500 hover:border-blue-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-200"
              />
            </div>
          </div>

          <div
            role="status"
            aria-live="polite"
            className="mt-3 min-h-5 text-sm font-semibold text-zinc-700"
          >
            {search
              ? `${filteredReviews.length} review result${
                  filteredReviews.length ===
                  1
                    ? ""
                    : "s"
                } found.`
              : `${reviews.length} total review${
                  reviews.length ===
                  1
                    ? ""
                    : "s"
                }.`}
          </div>

          {/* EMPTY */}
          {filteredReviews.length ===
          0 ? (
            <div className="mt-5 rounded-3xl border-2 border-dashed border-zinc-300 bg-white p-10 text-center">
              <div
                aria-hidden="true"
                className="text-4xl"
              >
                ★
              </div>

              <h3 className="mt-4 text-xl font-black text-blue-950">
                No reviews found
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-700">
                No reviews match your
                current search.
              </p>

              {search && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    setSearch("")
                  }
                  className="mt-5"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <ul
              aria-label="Customer review management list"
              className="mt-5 space-y-6"
            >
              {filteredReviews.map(
                (review) => (
                  <li
                    key={
                      review._id
                    }
                  >
                    <article className="rounded-3xl border-2 border-blue-100 bg-white p-5 shadow-sm sm:p-6">

                      {/* REVIEW HEADER */}
                      <div className="flex flex-col gap-5 border-b-2 border-zinc-200 pb-5 lg:flex-row lg:items-start lg:justify-between">

                        <div className="min-w-0">
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                            Product
                          </p>

                          <h3 className="mt-1 text-xl font-black text-blue-950">
                            {review.product
                              ?.name ||
                              "Product unavailable"}
                          </h3>

                          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">

                            <div>
                              <dt className="font-bold text-zinc-950">
                                Reviewer
                              </dt>

                              <dd className="mt-1 text-zinc-700">
                                {review.user
                                  ?.name ||
                                  "Unknown reviewer"}
                              </dd>
                            </div>

                            <div>
                              <dt className="font-bold text-zinc-950">
                                Email
                              </dt>

                              <dd className="mt-1 break-all text-zinc-700">
                                {review.user
                                  ?.email ||
                                  "Email unavailable"}
                              </dd>
                            </div>

                            {review.createdAt && (
                              <div className="sm:col-span-2">
                                <dt className="font-bold text-zinc-950">
                                  Submitted
                                </dt>

                                <dd className="mt-1 text-zinc-700">
                                  <time
                                    dateTime={
                                      review.createdAt
                                    }
                                  >
                                    {formatDate(
                                      review.createdAt
                                    )}
                                  </time>
                                </dd>
                              </div>
                            )}
                          </dl>
                        </div>

                        {/* RATING */}
                        <div
                          aria-label={`${review.rating} out of 5 stars`}
                          className="w-fit rounded-2xl border-2 border-yellow-300 bg-yellow-50 px-4 py-3"
                        >
                          <p
                            aria-hidden="true"
                            className="text-lg tracking-wider text-yellow-700"
                          >
                            {renderStars(
                              review.rating
                            )}
                          </p>

                          <p className="mt-1 text-center text-sm font-black text-yellow-950">
                            {
                              review.rating
                            }
                            /5
                          </p>
                        </div>
                      </div>

                      {/* EDIT MODE */}
                      {editingId ===
                      review._id ? (
                        <form
                          ref={
                            editFormRef
                          }
                          onSubmit={
                            handleSubmit
                          }
                          aria-labelledby={`edit-review-${review._id}`}
                          className="mt-6 rounded-2xl border-2 border-blue-200 bg-blue-50 p-5"
                        >
                          <h4
                            id={`edit-review-${review._id}`}
                            className="text-lg font-black text-blue-950"
                          >
                            Edit Review
                          </h4>

                          <p className="mt-1 text-sm leading-6 text-zinc-700">
                            Update the rating or
                            comment below.
                          </p>

                          <div className="mt-5 grid gap-5 sm:grid-cols-[180px_minmax(0,1fr)]">

                            {/* RATING */}
                            <div>
                              <label
                                htmlFor={`review-rating-${review._id}`}
                                className="block text-sm font-bold text-zinc-950"
                              >
                                Rating
                                <span
                                  aria-hidden="true"
                                  className="ml-1 text-red-600"
                                >
                                  *
                                </span>
                              </label>

                              <select
                                id={`review-rating-${review._id}`}
                                value={
                                  rating
                                }
                                disabled={
                                  saving
                                }
                                required
                                aria-required="true"
                                onChange={(
                                  event
                                ) =>
                                  setRating(
                                    event.target
                                      .value
                                  )
                                }
                                className="mt-2 min-h-12 w-full rounded-xl border-2 border-zinc-300 bg-white px-4 py-3 text-sm font-semibold text-zinc-950 outline-none transition hover:border-blue-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-zinc-100"
                              >
                                <option value="1">
                                  1 - Poor
                                </option>

                                <option value="2">
                                  2 - Fair
                                </option>

                                <option value="3">
                                  3 - Good
                                </option>

                                <option value="4">
                                  4 - Very Good
                                </option>

                                <option value="5">
                                  5 - Excellent
                                </option>
                              </select>
                            </div>

                            {/* COMMENT */}
                            <div>
                              <label
                                htmlFor={`review-comment-${review._id}`}
                                className="block text-sm font-bold text-zinc-950"
                              >
                                Comment
                                <span
                                  aria-hidden="true"
                                  className="ml-1 text-red-600"
                                >
                                  *
                                </span>
                              </label>

                              <textarea
                                id={`review-comment-${review._id}`}
                                value={
                                  comment
                                }
                                disabled={
                                  saving
                                }
                                required
                                aria-required="true"
                                rows={5}
                                onChange={(
                                  event
                                ) =>
                                  setComment(
                                    event.target
                                      .value
                                  )
                                }
                                className="mt-2 w-full resize-y rounded-xl border-2 border-zinc-300 bg-white px-4 py-3 text-sm leading-6 text-zinc-950 outline-none transition hover:border-blue-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-zinc-100"
                              />
                            </div>
                          </div>

                          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                            <Button
                              type="submit"
                              variant="blue"
                              disabled={
                                saving
                              }
                              aria-busy={
                                saving
                              }
                              className="w-full sm:w-auto"
                            >
                              {saving
                                ? "Saving Changes..."
                                : "Save Changes"}
                            </Button>

                            <Button
                              type="button"
                              variant="secondary"
                              disabled={
                                saving
                              }
                              onClick={
                                cancelEdit
                              }
                              className="w-full sm:w-auto"
                            >
                              Cancel Editing
                            </Button>
                          </div>

                          <div
                            aria-live="polite"
                            className="mt-3 min-h-5 text-sm font-semibold text-blue-900"
                          >
                            {saving
                              ? "Updating review information."
                              : ""}
                          </div>
                        </form>
                      ) : (
                        <>
                          {/* COMMENT */}
                          <section
                            aria-labelledby={`comment-${review._id}`}
                            className="mt-6"
                          >
                            <h4
                              id={`comment-${review._id}`}
                              className="text-sm font-black uppercase tracking-[0.16em] text-blue-700"
                            >
                              Review Comment
                            </h4>

                            <blockquote className="mt-3 rounded-2xl border-2 border-zinc-200 bg-zinc-50 p-5 text-sm leading-7 text-zinc-800">
                              {review.comment ||
                                "No comment provided."}
                            </blockquote>
                          </section>

                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() =>
                              handleEdit(
                                review
                              )
                            }
                            aria-label={`Edit review for ${
                              review.product
                                ?.name ||
                              "product"
                            }`}
                            className="mt-5"
                          >
                            Edit Review
                          </Button>
                        </>
                      )}
                    </article>
                  </li>
                )
              )}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default AdminReviewsPage;