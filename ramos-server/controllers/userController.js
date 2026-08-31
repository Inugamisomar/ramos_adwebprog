const mongoose = require(
  "mongoose"
);

const bcrypt = require(
  "bcryptjs"
);

const User = require(
  "../models/userModel"
);

// =====================================
// HELPERS
// =====================================

const isValidObjectId = (
  value
) => {
  return mongoose.Types.ObjectId.isValid(
    value
  );
};

const isValidEmail = (
  email
) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
};

const allowedRoles = [
  "customer",
  "admin",
];

const sanitizeUser = (
  user
) => {
  const userResponse =
    user.toObject();

  delete userResponse.password;

  return userResponse;
};

// =====================================
// GET ALL USERS
// ADMIN ONLY
// =====================================

const getUsers = async (
  req,
  res
) => {
  try {
    const users =
      await User.find()
        .select("-password")
        .sort({
          createdAt: -1,
        });

    return res
      .status(200)
      .json(users);
  } catch (error) {
    console.error(
      "Get users error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Unable to retrieve users.",
      });
  }
};

// =====================================
// GET USER BY ID
// ADMIN ONLY
// =====================================

const getUserById = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    if (
      !isValidObjectId(id)
    ) {
      return res
        .status(400)
        .json({
          message:
            "Invalid user ID.",
        });
    }

    const user =
      await User.findById(
        id
      ).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({
          message:
            "User not found.",
        });
    }

    return res
      .status(200)
      .json(user);
  } catch (error) {
    console.error(
      "Get user error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Unable to retrieve user.",
      });
  }
};

// =====================================
// CREATE USER
// ADMIN ONLY
// =====================================

const createUser = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      password,
      role,
      isActive,
    } = req.body;

    // -------------------------
    // NAME
    // -------------------------
    if (
      !name ||
      !String(name).trim()
    ) {
      return res
        .status(400)
        .json({
          message:
            "Name is required.",
        });
    }

    // -------------------------
    // EMAIL
    // -------------------------
    if (
      !email ||
      !String(email).trim()
    ) {
      return res
        .status(400)
        .json({
          message:
            "Email is required.",
        });
    }

    const normalizedEmail =
      String(email)
        .toLowerCase()
        .trim();

    if (
      !isValidEmail(
        normalizedEmail
      )
    ) {
      return res
        .status(400)
        .json({
          message:
            "Please enter a valid email address.",
        });
    }

    // -------------------------
    // PASSWORD
    // -------------------------
    if (
      !password ||
      typeof password !==
        "string"
    ) {
      return res
        .status(400)
        .json({
          message:
            "Password is required.",
        });
    }

    if (
      password.length < 6
    ) {
      return res
        .status(400)
        .json({
          message:
            "Password must be at least 6 characters.",
        });
    }

    // -------------------------
    // DUPLICATE EMAIL
    // -------------------------
    const existingUser =
      await User.findOne({
        email:
          normalizedEmail,
      });

    if (existingUser) {
      return res
        .status(400)
        .json({
          message:
            "Email is already registered.",
        });
    }

    // -------------------------
    // ROLE
    // -------------------------
    const userRole =
      role === undefined
        ? "customer"
        : role;

    if (
      !allowedRoles.includes(
        userRole
      )
    ) {
      return res
        .status(400)
        .json({
          message:
            "Invalid user role.",
        });
    }

    // -------------------------
    // HASH PASSWORD
    // -------------------------
    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // -------------------------
    // CREATE
    // -------------------------
    const user =
      await User.create({
        name:
          String(name).trim(),

        email:
          normalizedEmail,

        password:
          hashedPassword,

        role:
          userRole,

        isActive:
          typeof isActive ===
          "boolean"
            ? isActive
            : true,
      });

    return res
      .status(201)
      .json({
        message:
          "User created successfully.",

        user:
          sanitizeUser(user),
      });
  } catch (error) {
    console.error(
      "Create user error:",
      error
    );

    if (
      error.name ===
      "ValidationError"
    ) {
      return res
        .status(400)
        .json({
          message:
            error.message,
        });
    }

    if (
      error.code === 11000
    ) {
      return res
        .status(400)
        .json({
          message:
            "Email is already registered.",
        });
    }

    return res
      .status(500)
      .json({
        message:
          "Unable to create user.",
      });
  }
};

// =====================================
// UPDATE USER
// ADMIN ONLY
// =====================================

const updateUser = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    if (
      !isValidObjectId(id)
    ) {
      return res
        .status(400)
        .json({
          message:
            "Invalid user ID.",
        });
    }

    const user =
      await User.findById(
        id
      );

    if (!user) {
      return res
        .status(404)
        .json({
          message:
            "User not found.",
        });
    }

    const {
      name,
      email,
      role,
      isActive,
    } = req.body;

    // -------------------------
    // NAME
    // -------------------------
    if (
      name !== undefined
    ) {
      if (
        typeof name !==
          "string" ||
        !name.trim()
      ) {
        return res
          .status(400)
          .json({
            message:
              "Name cannot be empty.",
          });
      }

      user.name =
        name.trim();
    }

    // -------------------------
    // EMAIL
    // -------------------------
    if (
      email !== undefined
    ) {
      if (
        typeof email !==
          "string" ||
        !email.trim()
      ) {
        return res
          .status(400)
          .json({
            message:
              "Email cannot be empty.",
          });
      }

      const normalizedEmail =
        email
          .toLowerCase()
          .trim();

      if (
        !isValidEmail(
          normalizedEmail
        )
      ) {
        return res
          .status(400)
          .json({
            message:
              "Please enter a valid email address.",
          });
      }

      const existingUser =
        await User.findOne({
          email:
            normalizedEmail,

          _id: {
            $ne: user._id,
          },
        });

      if (existingUser) {
        return res
          .status(400)
          .json({
            message:
              "Email is already registered.",
          });
      }

      user.email =
        normalizedEmail;
    }

    // -------------------------
    // ROLE
    // -------------------------
    if (
      role !== undefined
    ) {
      if (
        !allowedRoles.includes(
          role
        )
      ) {
        return res
          .status(400)
          .json({
            message:
              "Invalid user role.",
          });
      }

      // Prevent the logged-in admin
      // from removing their own
      // admin permission.
      if (
        user._id.toString() ===
          req.user._id.toString() &&
        role !== "admin"
      ) {
        return res
          .status(400)
          .json({
            message:
              "You cannot remove your own administrator role.",
          });
      }

      user.role = role;
    }

    // -------------------------
    // ACTIVE / INACTIVE
    // -------------------------
    if (
      isActive !==
      undefined
    ) {
      if (
        typeof isActive !==
        "boolean"
      ) {
        return res
          .status(400)
          .json({
            message:
              "Account status must be true or false.",
          });
      }

      // Prevent admin from
      // deactivating themselves.
      if (
        user._id.toString() ===
          req.user._id.toString() &&
        isActive === false
      ) {
        return res
          .status(400)
          .json({
            message:
              "You cannot deactivate your own account.",
          });
      }

      user.isActive =
        isActive;
    }

    await user.save();

    return res
      .status(200)
      .json({
        message:
          "User updated successfully.",

        user:
          sanitizeUser(user),
      });
  } catch (error) {
    console.error(
      "Update user error:",
      error
    );

    if (
      error.name ===
      "ValidationError"
    ) {
      return res
        .status(400)
        .json({
          message:
            error.message,
        });
    }

    if (
      error.code === 11000
    ) {
      return res
        .status(400)
        .json({
          message:
            "Email is already registered.",
        });
    }

    return res
      .status(500)
      .json({
        message:
          "Unable to update user.",
      });
  }
};

// =====================================
// DELETE USER
// ADMIN ONLY
// =====================================

const deleteUser = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    if (
      !isValidObjectId(id)
    ) {
      return res
        .status(400)
        .json({
          message:
            "Invalid user ID.",
        });
    }

    const user =
      await User.findById(
        id
      );

    if (!user) {
      return res
        .status(404)
        .json({
          message:
            "User not found.",
        });
    }

    // Do not allow an admin to
    // delete their own account.
    if (
      user._id.toString() ===
      req.user._id.toString()
    ) {
      return res
        .status(400)
        .json({
          message:
            "You cannot delete your own administrator account.",
        });
    }

    await user.deleteOne();

    return res
      .status(200)
      .json({
        message:
          "User deleted successfully.",
      });
  } catch (error) {
    console.error(
      "Delete user error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Unable to delete user.",
      });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};