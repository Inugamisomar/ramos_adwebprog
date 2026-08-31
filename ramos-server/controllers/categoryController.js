const mongoose = require("mongoose");
const Category = require("../models/categoryModel");

// =====================================
// GET ALL CATEGORIES
// =====================================
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({
      name: 1,
    });

    return res.status(200).json(categories);
  } catch (error) {
    console.error("Get categories error:", error);

    return res.status(500).json({
      message: "Unable to retrieve categories.",
    });
  }
};

// =====================================
// GET CATEGORY BY ID
// =====================================
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid category ID.",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found.",
      });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error("Get category error:", error);

    return res.status(500).json({
      message: "Unable to retrieve category.",
    });
  }
};

// =====================================
// CREATE CATEGORY
// ADMIN ONLY
// =====================================
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        message: "Category name is required.",
      });
    }

    const normalizedName = String(name).trim();

    // Prevent duplicate category names
    const existingCategory = await Category.findOne({
      name: {
        $regex: `^${normalizedName.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        )}$`,
        $options: "i",
      },
    });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category already exists.",
      });
    }

    const category = await Category.create({
      name: normalizedName,

      description:
        typeof description === "string"
          ? description.trim()
          : "",
    });

    return res.status(201).json(category);
  } catch (error) {
    console.error("Create category error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Category already exists.",
      });
    }

    return res.status(500).json({
      message: "Unable to create category.",
    });
  }
};

// =====================================
// UPDATE CATEGORY
// ADMIN ONLY
// =====================================
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid category ID.",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found.",
      });
    }

    const { name, description } = req.body;

    // Update name only when supplied
    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        !name.trim()
      ) {
        return res.status(400).json({
          message: "Category name cannot be empty.",
        });
      }

      const normalizedName = name.trim();

      const existingCategory = await Category.findOne({
        name: {
          $regex: `^${normalizedName.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          )}$`,
          $options: "i",
        },

        _id: {
          $ne: category._id,
        },
      });

      if (existingCategory) {
        return res.status(400).json({
          message: "Category already exists.",
        });
      }

      category.name = normalizedName;
    }

    // Update description only when supplied
    if (description !== undefined) {
      if (typeof description !== "string") {
        return res.status(400).json({
          message: "Description must be text.",
        });
      }

      category.description = description.trim();
    }

    await category.save();

    return res.status(200).json(category);
  } catch (error) {
    console.error("Update category error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Category already exists.",
      });
    }

    return res.status(500).json({
      message: "Unable to update category.",
    });
  }
};

// =====================================
// DELETE CATEGORY
// ADMIN ONLY
// =====================================
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid category ID.",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found.",
      });
    }

    await category.deleteOne();

    return res.status(200).json({
      message: "Category deleted successfully.",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    return res.status(500).json({
      message: "Unable to delete category.",
    });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};