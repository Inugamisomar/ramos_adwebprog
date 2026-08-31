const mongoose = require("mongoose");

const Supplier = require(
  "../models/supplierModel"
);

const HttpStatus = require(
  "../config/constants"
);

// =====================================
// HELPERS
// =====================================
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
};

// =====================================
// GET ALL SUPPLIERS
// =====================================
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({
      name: 1,
    });

    return res
      .status(HttpStatus.OK)
      .json(suppliers);
  } catch (error) {
    console.error(
      "Get suppliers error:",
      error
    );

    return res
      .status(
        HttpStatus.INTERNAL_SERVER_ERROR
      )
      .json({
        message:
          "Unable to retrieve suppliers.",
      });
  }
};

// =====================================
// GET SUPPLIER BY ID
// =====================================
const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({
          message:
            "Invalid supplier ID.",
        });
    }

    const supplier =
      await Supplier.findById(id);

    if (!supplier) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({
          message:
            "Supplier not found.",
        });
    }

    return res
      .status(HttpStatus.OK)
      .json(supplier);
  } catch (error) {
    console.error(
      "Get supplier error:",
      error
    );

    return res
      .status(
        HttpStatus.INTERNAL_SERVER_ERROR
      )
      .json({
        message:
          "Unable to retrieve supplier.",
      });
  }
};

// =====================================
// CREATE SUPPLIER
// ADMIN ONLY
// =====================================
const createSupplier = async (req, res) => {
  try {
    const {
      name,
      contactPerson,
      email,
      phone,
    } = req.body;

    if (
      !name ||
      !String(name).trim()
    ) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({
          message:
            "Supplier name is required.",
        });
    }

    if (
      !contactPerson ||
      !String(contactPerson).trim()
    ) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({
          message:
            "Contact person is required.",
        });
    }

    if (
      !email ||
      !String(email).trim()
    ) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({
          message:
            "Email is required.",
        });
    }

    const normalizedEmail =
      String(email)
        .toLowerCase()
        .trim();

    if (!isValidEmail(normalizedEmail)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({
          message:
            "Please enter a valid email address.",
        });
    }

    if (
      !phone ||
      !String(phone).trim()
    ) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({
          message:
            "Phone number is required.",
        });
    }

    const supplier =
      await Supplier.create({
        name:
          String(name).trim(),

        contactPerson:
          String(contactPerson).trim(),

        email:
          normalizedEmail,

        phone:
          String(phone).trim(),
      });

    return res
      .status(HttpStatus.CREATED)
      .json(supplier);
  } catch (error) {
    console.error(
      "Create supplier error:",
      error
    );

    if (
      error.name ===
      "ValidationError"
    ) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({
          message:
            error.message,
        });
    }

    if (error.code === 11000) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({
          message:
            "Supplier information already exists.",
        });
    }

    return res
      .status(
        HttpStatus.INTERNAL_SERVER_ERROR
      )
      .json({
        message:
          "Unable to create supplier.",
      });
  }
};

// =====================================
// UPDATE SUPPLIER
// ADMIN ONLY
// =====================================
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({
          message:
            "Invalid supplier ID.",
        });
    }

    const supplier =
      await Supplier.findById(id);

    if (!supplier) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({
          message:
            "Supplier not found.",
        });
    }

    const {
      name,
      contactPerson,
      email,
      phone,
    } = req.body;

    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        !name.trim()
      ) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({
            message:
              "Supplier name cannot be empty.",
          });
      }

      supplier.name =
        name.trim();
    }

    if (contactPerson !== undefined) {
      if (
        typeof contactPerson !== "string" ||
        !contactPerson.trim()
      ) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({
            message:
              "Contact person cannot be empty.",
          });
      }

      supplier.contactPerson =
        contactPerson.trim();
    }

    if (email !== undefined) {
      if (
        typeof email !== "string" ||
        !email.trim()
      ) {
        return res
          .status(HttpStatus.BAD_REQUEST)
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
          .status(HttpStatus.BAD_REQUEST)
          .json({
            message:
              "Please enter a valid email address.",
          });
      }

      supplier.email =
        normalizedEmail;
    }

    if (phone !== undefined) {
      if (
        typeof phone !== "string" ||
        !phone.trim()
      ) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({
            message:
              "Phone number cannot be empty.",
          });
      }

      supplier.phone =
        phone.trim();
    }

    await supplier.save();

    return res
      .status(HttpStatus.OK)
      .json(supplier);
  } catch (error) {
    console.error(
      "Update supplier error:",
      error
    );

    if (
      error.name ===
      "ValidationError"
    ) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({
          message:
            error.message,
        });
    }

    if (error.code === 11000) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({
          message:
            "Supplier information already exists.",
        });
    }

    return res
      .status(
        HttpStatus.INTERNAL_SERVER_ERROR
      )
      .json({
        message:
          "Unable to update supplier.",
      });
  }
};

// =====================================
// DELETE SUPPLIER
// ADMIN ONLY
// =====================================
const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({
          message:
            "Invalid supplier ID.",
        });
    }

    const supplier =
      await Supplier.findById(id);

    if (!supplier) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({
          message:
            "Supplier not found.",
        });
    }

    await supplier.deleteOne();

    return res
      .status(HttpStatus.OK)
      .json({
        message:
          "Supplier deleted successfully.",
      });
  } catch (error) {
    console.error(
      "Delete supplier error:",
      error
    );

    return res
      .status(
        HttpStatus.INTERNAL_SERVER_ERROR
      )
      .json({
        message:
          "Unable to delete supplier.",
      });
  }
};

module.exports = {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};