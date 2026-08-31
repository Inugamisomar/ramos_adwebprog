const express = require("express");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require(
  "../controllers/productController"
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

// Anyone can view products
router.get(
  "/",
  getProducts
);

// Anyone can view one product
router.get(
  "/:id",
  getProductById
);

// ==============================
// ADMIN PROTECTED ROUTES
// ==============================

// Only logged-in admins
// can create a product
router.post(
  "/",
  protect,
  adminOnly,
  createProduct
);

// Only logged-in admins
// can edit a product
router.put(
  "/:id",
  protect,
  adminOnly,
  updateProduct
);

// Only logged-in admins
// can delete a product
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

module.exports = router;