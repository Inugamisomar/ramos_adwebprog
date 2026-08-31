const express = require("express");

const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} = require(
  "../controllers/orderController"
);

const {
  protect,
  adminOnly,
  customerOnly,
} = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

// CUSTOMER / ADMIN
// Customer:
// - sees only their own orders

// Admin:
// - can see all orders

// The controller handles the ownership / role filtering.
router.get(
  "/",
  protect,
  getOrders
);

// Customer:
// - can view their own order

// Admin:
// - can view any order
router.get(
  "/:id",
  protect,
  getOrderById
);

// CUSTOMER ONLY

// Only customers can place orders
router.post(
  "/",
  protect,
  customerOnly,
  createOrder
);

// ADMIN ONLY

// Admin updates order status
router.put(
  "/:id",
  protect,
  adminOnly,
  updateOrder
);

// Admin deletes an order
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteOrder
);

module.exports = router;