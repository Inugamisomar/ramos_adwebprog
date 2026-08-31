const User = require(
  "../models/userModel"
);

const bcrypt = require(
  "bcryptjs"
);

const jwt = require(
  "jsonwebtoken"
);

// HELPERS

const generateToken = (
  id,
  role
) => {
  return jwt.sign(
    {
      id,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

const isValidEmail = (
  email
) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
};

const buildUserResponse = (
  user
) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive:
      user.isActive,
  };
};

// REGISTER USER

const registerUser = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      password,
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
    // HASH PASSWORD
    // -------------------------
    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // -------------------------
    // CREATE CUSTOMER
    // -------------------------
    const user =
      await User.create({
        name:
          String(
            name
          ).trim(),

        email:
          normalizedEmail,

        password:
          hashedPassword,

        role:
          "customer",
      });

    const token =
      generateToken(
        user._id,
        user.role
      );

    return res
      .status(201)
      .json({
        message:
          "Account created successfully.",

        user:
          buildUserResponse(
            user
          ),

        token,
      });
  } catch (error) {
    console.error(
      "Register error:",
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
          "Server error while registering user.",
      });
  }
};

// LOGIN USER

const loginUser = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (
      !email ||
      !String(email).trim() ||
      !password
    ) {
      return res
        .status(400)
        .json({
          message:
            "Please provide email and password.",
        });
    }

    const normalizedEmail =
      String(email)
        .toLowerCase()
        .trim();

    const user =
      await User.findOne({
        email:
          normalizedEmail,
      });

    // Keep this message generic.
    if (!user) {
      return res
        .status(401)
        .json({
          message:
            "Invalid email or password.",
        });
    }

    // Inactive accounts cannot
    // create new sessions.
    if (!user.isActive) {
      return res
        .status(403)
        .json({
          message:
            "Your account is currently inactive.",
        });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res
        .status(401)
        .json({
          message:
            "Invalid email or password.",
        });
    }

    const token =
      generateToken(
        user._id,
        user.role
      );

    return res
      .status(200)
      .json({
        message:
          "Login successful.",

        user:
          buildUserResponse(
            user
          ),

        token,
      });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Server error while logging in.",
      });
  }
};

// GET PROFILE

const getProfile = async (
  req,
  res
) => {
  try {
    return res
      .status(200)
      .json({
        user:
          buildUserResponse(
            req.user
          ),
      });
  } catch (error) {
    console.error(
      "Profile error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Server error while retrieving profile.",
      });
  }
};

// UPDATE PROFILE

const updateProfile = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
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
    // DUPLICATE EMAIL
    // -------------------------
    const existingUser =
      await User.findOne({
        email:
          normalizedEmail,

        _id: {
          $ne:
            req.user._id,
        },
      });

    if (existingUser) {
      return res
        .status(400)
        .json({
          message:
            "Email is already in use.",
        });
    }

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      return res
        .status(404)
        .json({
          message:
            "User not found.",
        });
    }

    user.name =
      String(name).trim();

    user.email =
      normalizedEmail;

    await user.save();

    return res
      .status(200)
      .json({
        message:
          "Profile updated successfully.",

        user:
          buildUserResponse(
            user
          ),
      });
  } catch (error) {
    console.error(
      "Update profile error:",
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
            "Email is already in use.",
        });
    }

    return res
      .status(500)
      .json({
        message:
          "Server error while updating profile.",
      });
  }
};

// CHANGE PASSWORD

const changePassword = async (
  req,
  res
) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    // -------------------------
    // REQUIRED FIELDS
    // -------------------------
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res
        .status(400)
        .json({
          message:
            "Please complete all password fields.",
        });
    }

    // -------------------------
    // NEW PASSWORD LENGTH
    // -------------------------
    if (
      newPassword.length <
      6
    ) {
      return res
        .status(400)
        .json({
          message:
            "New password must be at least 6 characters.",
        });
    }

    // -------------------------
    // CONFIRM PASSWORD
    // -------------------------
    if (
      newPassword !==
      confirmPassword
    ) {
      return res
        .status(400)
        .json({
          message:
            "New password and confirmation do not match.",
        });
    }

    // -------------------------
    // SAME PASSWORD CHECK
    // -------------------------
    if (
      currentPassword ===
      newPassword
    ) {
      return res
        .status(400)
        .json({
          message:
            "New password must be different from the current password.",
        });
    }

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      return res
        .status(404)
        .json({
          message:
            "User not found.",
        });
    }

    // -------------------------
    // VERIFY CURRENT PASSWORD
    // -------------------------
    const passwordMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!passwordMatch) {
      return res
        .status(401)
        .json({
          message:
            "Current password is incorrect.",
        });
    }

    // -------------------------
    // HASH NEW PASSWORD
    // -------------------------
    user.password =
      await bcrypt.hash(
        newPassword,
        10
      );

    await user.save();

    return res
      .status(200)
      .json({
        message:
          "Password changed successfully.",
      });
  } catch (error) {
    console.error(
      "Change password error:",
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

    return res
      .status(500)
      .json({
        message:
          "Server error while changing password.",
      });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
};