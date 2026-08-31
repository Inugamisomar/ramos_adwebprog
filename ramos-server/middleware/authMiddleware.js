const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// =====================================
// PROTECT
// User must be logged in
// =====================================
const protect = async (
  req,
  res,
  next
) => {
  try {
    let token;

    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith(
        "Bearer "
      )
    ) {
      token =
        req.headers.authorization.split(
          " "
        )[1];
    }

    // No token
    if (!token) {
      return res
        .status(401)
        .json({
          message:
            "Not authorized. No token provided.",
        });
    }

    // Verify token
    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    // Find user
    const user =
      await User.findById(
        decoded.id
      ).select("-password");

    // User no longer exists
    if (!user) {
      return res
        .status(401)
        .json({
          message:
            "Not authorized. User not found.",
        });
    }

    // Inactive account
    if (!user.isActive) {
      return res
        .status(403)
        .json({
          message:
            "Your account is inactive.",
        });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({
        message:
          "Not authorized. Invalid or expired token.",
      });
  }
};

// =====================================
// ADMIN ONLY
// =====================================
const adminOnly = (
  req,
  res,
  next
) => {
  if (
    req.user &&
    req.user.role === "admin"
  ) {
    return next();
  }

  return res
    .status(403)
    .json({
      message:
        "Access denied. Admin only.",
    });
};

// =====================================
// CUSTOMER ONLY
// =====================================
const customerOnly = (
  req,
  res,
  next
) => {
  if (
    req.user &&
    req.user.role ===
      "customer"
  ) {
    return next();
  }

  return res
    .status(403)
    .json({
      message:
        "Access denied. Customer only.",
    });
};

module.exports = {
  protect,
  adminOnly,
  customerOnly,
};