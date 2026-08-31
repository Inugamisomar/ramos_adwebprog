const express = require("express");

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require(
  "../controllers/userController"
);

const {
  protect,
  adminOnly,
} = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

// ==============================
// ADMIN-ONLY USER MANAGEMENT
// ==============================

// View all users
router.get(
  "/",
  protect,
  adminOnly,
  getUsers
);

// View one user
router.get(
  "/:id",
  protect,
  adminOnly,
  getUserById
);

// Create user
router.post(
  "/",
  protect,
  adminOnly,
  createUser
);

// Edit user
router.put(
  "/:id",
  protect,
  adminOnly,
  updateUser
);

// Delete user
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteUser
);

module.exports = router;