const express = require("express");

const {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} = require(
  "../controllers/reviewController"
);

const {
  protect,
  adminOnly,
  customerOnly,
} = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

// ==============================
// PUBLIC REVIEW ROUTES
// ==============================

// Anyone can view reviews
router.get(
  "/",
  getReviews
);

// Anyone can view a single review
router.get(
  "/:id",
  getReviewById
);

// ==============================
// CUSTOMER ONLY
// ==============================

// Only customers can create reviews
router.post(
  "/",
  protect,
  customerOnly,
  createReview
);

// ==============================
// ADMIN ONLY
// ==============================

// Only admins can edit reviews
router.put(
  "/:id",
  protect,
  adminOnly,
  updateReview
);

// Only admins can delete reviews
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteReview
);

module.exports = router;