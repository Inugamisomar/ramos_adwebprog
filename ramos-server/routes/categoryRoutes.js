const express = require("express");

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require(
  "../controllers/categoryController"
);

const {
  protect,
  adminOnly,
} = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

// ==============================
// PUBLIC ROUTES
// ==============================

// Anyone can view categories
router.get(
  "/",
  getCategories
);

// Anyone can view one category
router.get(
  "/:id",
  getCategoryById
);

// ==============================
// ADMIN-ONLY ROUTES
// ==============================

// Create category
router.post(
  "/",
  protect,
  adminOnly,
  createCategory
);

// Update category
router.put(
  "/:id",
  protect,
  adminOnly,
  updateCategory
);

// Delete category
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteCategory
);

module.exports = router;