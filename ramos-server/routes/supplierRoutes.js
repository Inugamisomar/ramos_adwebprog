const express = require("express");

const {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require(
  "../controllers/supplierController"
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

// Anyone can view suppliers
router.get(
  "/",
  getSuppliers
);

// Anyone can view one supplier
router.get(
  "/:id",
  getSupplierById
);

// ==============================
// ADMIN-ONLY ROUTES
// ==============================

// Create supplier
router.post(
  "/",
  protect,
  adminOnly,
  createSupplier
);

// Update supplier
router.put(
  "/:id",
  protect,
  adminOnly,
  updateSupplier
);

// Delete supplier
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteSupplier
);

module.exports = router;