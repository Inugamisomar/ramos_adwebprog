const express = require(
  "express"
);

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
} = require(
  "../controllers/authController"
);

const {
  protect,
  adminOnly,
} = require(
  "../middleware/authMiddleware"
);

const router =
  express.Router();

// PUBLIC ROUTES

// Register
router.post(
  "/register",
  registerUser
);

// Login
router.post(
  "/login",
  loginUser
);

// PROTECTED PROFILE ROUTES

// View profile
router.get(
  "/profile",
  protect,
  getProfile
);

// Edit profile
router.put(
  "/profile",
  protect,
  updateProfile
);

// Change password
router.put(
  "/change-password",
  protect,
  changePassword
);

// ADMIN TEST ROUTE
router.get(
  "/admin-test",
  protect,
  adminOnly,
  (req, res) => {
    res
      .status(200)
      .json({
        message:
          "Admin access granted.",
      });
  }
);

module.exports = router;