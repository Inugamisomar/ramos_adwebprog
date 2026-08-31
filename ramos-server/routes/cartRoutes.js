const express = require(
  "express"
);

const {
  getCarts,
  getCartById,
  createCart,
  updateCart,
  deleteCart,
} = require(
  "../controllers/cartController"
);

const {
  protect,
  customerOnly,
} = require(
  "../middleware/authMiddleware"
);

const router =
  express.Router();

// CUSTOMER CART ROUTES

router.get(
  "/",
  protect,
  customerOnly,
  getCarts
);

router.get(
  "/:id",
  protect,
  customerOnly,
  getCartById
);

router.post(
  "/",
  protect,
  customerOnly,
  createCart
);

router.put(
  "/:id",
  protect,
  customerOnly,
  updateCart
);

router.delete(
  "/:id",
  protect,
  customerOnly,
  deleteCart
);

module.exports = router;