const mongoose = require("mongoose");

const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Supplier = require("../models/supplierModel");
const HttpStatus = require("../config/constants");

// ==============================
// HELPER FUNCTIONS
// ==============================

// Escape special regex characters from user input.
const escapeRegex = (value = "") => {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
};

// Check if a value is a valid MongoDB ObjectId.
const isValidObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(
    value
  );
};

// Find a category using either:
// 1. MongoDB _id
// 2. Category name
const findCategory = async (value) => {
  if (!value) {
    return null;
  }

  if (isValidObjectId(value)) {
    const categoryById =
      await Category.findById(value);

    if (categoryById) {
      return categoryById;
    }
  }

  return Category.findOne({
    name: {
      $regex: `^${escapeRegex(
        value
      )}$`,
      $options: "i",
    },
  });
};

// Find a supplier using either:
// 1. MongoDB _id
// 2. Supplier name
const findSupplier = async (value) => {
  if (!value) {
    return null;
  }

  if (isValidObjectId(value)) {
    const supplierById =
      await Supplier.findById(value);

    if (supplierById) {
      return supplierById;
    }
  }

  return Supplier.findOne({
    name: {
      $regex: `^${escapeRegex(
        value
      )}$`,
      $options: "i",
    },
  });
};

// ==============================
// GET ALL PRODUCTS
// ==============================

const getProducts = async (req, res) => {
  try {
    const {
      category,
      supplier,
      sort,
      search,
    } = req.query;

    // --------------------------
    // PAGINATION
    // --------------------------
    let page = Number.parseInt(
      req.query.page,
      10
    );

    let limit = Number.parseInt(
      req.query.limit,
      10
    );

    if (
      Number.isNaN(page) ||
      page < 1
    ) {
      page = 1;
    }

    if (
      Number.isNaN(limit) ||
      limit < 1
    ) {
      limit = 10;
    }

    // Prevent extremely large requests.
    if (limit > 100) {
      limit = 100;
    }

    const skip =
      (page - 1) * limit;

    const filter = {};

    // --------------------------
    // CATEGORY FILTER
    // --------------------------
    if (category) {
      const categoryData =
        await findCategory(
          category.trim()
        );

      if (!categoryData) {
        return res
          .status(HttpStatus.OK)
          .json({
            success: true,
            message:
              "No products found for the selected category.",
            count: 0,
            total: 0,
            page,
            limit,
            totalPages: 0,
            data: [],
          });
      }

      filter.category =
        categoryData._id;
    }

    // --------------------------
    // SUPPLIER FILTER
    // --------------------------
    if (supplier) {
      const supplierData =
        await findSupplier(
          supplier.trim()
        );

      if (!supplierData) {
        return res
          .status(HttpStatus.OK)
          .json({
            success: true,
            message:
              "No products found for the selected supplier.",
            count: 0,
            total: 0,
            page,
            limit,
            totalPages: 0,
            data: [],
          });
      }

      filter.supplier =
        supplierData._id;
    }

    // --------------------------
    // SEARCH
    // --------------------------
    if (
      search &&
      search.trim()
    ) {
      const safeSearch =
        escapeRegex(
          search.trim()
        );

      filter.$or = [
        {
          name: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          description: {
            $regex: safeSearch,
            $options: "i",
          },
        },
      ];
    }

    // --------------------------
    // SORTING
    // --------------------------

    const allowedSortFields = [
      "name",
      "-name",
      "price",
      "-price",
      "stock",
      "-stock",
      "createdAt",
      "-createdAt",
      "updatedAt",
      "-updatedAt",
    ];

    let sortOption =
      "-createdAt";

    if (
      sort &&
      allowedSortFields.includes(
        sort
      )
    ) {
      sortOption = sort;
    }

    // --------------------------
    // TOTAL MATCHING PRODUCTS
    // --------------------------
    const total =
      await Product.countDocuments(
        filter
      );

    // --------------------------
    // PRODUCT QUERY
    // --------------------------
    const products =
      await Product.find(filter)
        .populate("category")
        .populate("supplier")
        .sort(sortOption)
        .skip(skip)
        .limit(limit);

    const totalPages =
      total === 0
        ? 0
        : Math.ceil(
            total / limit
          );

    return res
      .status(HttpStatus.OK)
      .json({
        success: true,
        message:
          "Products retrieved successfully.",
        count: products.length,
        total,
        page,
        limit,
        totalPages,
        data: products,
      });
  } catch (error) {
    console.error(
      "Get products error:",
      error
    );

    return res
      .status(
        HttpStatus.INTERNAL_SERVER_ERROR
      )
      .json({
        success: false,
        message:
          "Unable to retrieve products.",
        count: 0,
        data: [],
      });
  }
};

// ==============================
// GET ONE PRODUCT
// ==============================

const getProductById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res
        .status(
          HttpStatus.BAD_REQUEST
        )
        .json({
          success: false,
          message:
            "Invalid product ID.",
          count: 0,
          data: null,
        });
    }

    const product =
      await Product.findById(id)
        .populate("category")
        .populate("supplier");

    if (!product) {
      return res
        .status(
          HttpStatus.NOT_FOUND
        )
        .json({
          success: false,
          message:
            "Product not found.",
          count: 0,
          data: null,
        });
    }

    return res
      .status(HttpStatus.OK)
      .json({
        success: true,
        message:
          "Product retrieved successfully.",
        count: 1,
        data: product,
      });
  } catch (error) {
    console.error(
      "Get product error:",
      error
    );

    return res
      .status(
        HttpStatus.INTERNAL_SERVER_ERROR
      )
      .json({
        success: false,
        message:
          "Unable to retrieve product.",
        count: 0,
        data: null,
      });
  }
};

// ==============================
// CREATE PRODUCT
// ==============================

const createProduct = async (
  req,
  res
) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      image,
      category,
      supplier,
    } = req.body;

    // --------------------------
    // REQUIRED FIELDS
    // --------------------------
    if (
      !name ||
      !name.trim()
    ) {
      return res
        .status(
          HttpStatus.BAD_REQUEST
        )
        .json({
          success: false,
          message:
            "Product name is required.",
          count: 0,
          data: null,
        });
    }

    if (
      price === undefined ||
      price === null ||
      price === "" ||
      Number.isNaN(
        Number(price)
      ) ||
      Number(price) < 0
    ) {
      return res
        .status(
          HttpStatus.BAD_REQUEST
        )
        .json({
          success: false,
          message:
            "Product price must be a valid number greater than or equal to 0.",
          count: 0,
          data: null,
        });
    }

    if (
      stock === undefined ||
      stock === null ||
      stock === "" ||
      Number.isNaN(
        Number(stock)
      ) ||
      Number(stock) < 0
    ) {
      return res
        .status(
          HttpStatus.BAD_REQUEST
        )
        .json({
          success: false,
          message:
            "Product stock must be a valid number greater than or equal to 0.",
          count: 0,
          data: null,
        });
    }

    if (!category) {
      return res
        .status(
          HttpStatus.BAD_REQUEST
        )
        .json({
          success: false,
          message:
            "Product category is required.",
          count: 0,
          data: null,
        });
    }

    // --------------------------
    // CATEGORY VALIDATION
    // --------------------------
    const categoryData =
      await findCategory(
        String(category).trim()
      );

    if (!categoryData) {
      return res
        .status(
          HttpStatus.BAD_REQUEST
        )
        .json({
          success: false,
          message:
            "Selected category does not exist.",
          count: 0,
          data: null,
        });
    }

    // --------------------------
    // SUPPLIER VALIDATION
    // --------------------------
    let supplierId = null;

    if (supplier) {
      const supplierData =
        await findSupplier(
          String(
            supplier
          ).trim()
        );

      if (!supplierData) {
        return res
          .status(
            HttpStatus.BAD_REQUEST
          )
          .json({
            success: false,
            message:
              "Selected supplier does not exist.",
            count: 0,
            data: null,
          });
      }

      supplierId =
        supplierData._id;
    }

    // --------------------------
    // CREATE PRODUCT
    // --------------------------
    const productData = {
      name: name.trim(),
      description:
        description?.trim() ||
        "",
      price: Number(price),
      stock: Number(stock),
      image:
        image?.trim() || "",
      category:
        categoryData._id,
    };

    if (supplierId) {
      productData.supplier =
        supplierId;
    }

    const product =
      await Product.create(
        productData
      );

    const populatedProduct =
      await Product.findById(
        product._id
      )
        .populate("category")
        .populate("supplier");

    return res
      .status(
        HttpStatus.CREATED
      )
      .json({
        success: true,
        message:
          "Product created successfully.",
        count: 1,
        data: populatedProduct,
      });
  } catch (error) {
    console.error(
      "Create product error:",
      error
    );

    if (
      error.name ===
      "ValidationError"
    ) {
      return res
        .status(
          HttpStatus.BAD_REQUEST
        )
        .json({
          success: false,
          message:
            error.message,
          count: 0,
          data: null,
        });
    }

    return res
      .status(
        HttpStatus.INTERNAL_SERVER_ERROR
      )
      .json({
        success: false,
        message:
          "Unable to create product.",
        count: 0,
        data: null,
      });
  }
};

// ==============================
// UPDATE PRODUCT
// ==============================

const updateProduct = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res
        .status(
          HttpStatus.BAD_REQUEST
        )
        .json({
          success: false,
          message:
            "Invalid product ID.",
          count: 0,
          data: null,
        });
    }

    const existingProduct =
      await Product.findById(id);

    if (!existingProduct) {
      return res
        .status(
          HttpStatus.NOT_FOUND
        )
        .json({
          success: false,
          message:
            "Product not found.",
          count: 0,
          data: null,
        });
    }

    const {
      name,
      description,
      price,
      stock,
      image,
      category,
      supplier,
    } = req.body;

    const updateData = {};

    // --------------------------
    // NAME
    // --------------------------
    if (
      name !== undefined
    ) {
      if (
        !String(
          name
        ).trim()
      ) {
        return res
          .status(
            HttpStatus.BAD_REQUEST
          )
          .json({
            success: false,
            message:
              "Product name cannot be empty.",
            count: 0,
            data: null,
          });
      }

      updateData.name =
        String(
          name
        ).trim();
    }

    // --------------------------
    // DESCRIPTION
    // --------------------------
    if (
      description !== undefined
    ) {
      updateData.description =
        String(
          description
        ).trim();
    }

    // --------------------------
    // PRICE
    // --------------------------
    if (
      price !== undefined
    ) {
      if (
        price === "" ||
        Number.isNaN(
          Number(price)
        ) ||
        Number(price) < 0
      ) {
        return res
          .status(
            HttpStatus.BAD_REQUEST
          )
          .json({
            success: false,
            message:
              "Product price must be a valid number greater than or equal to 0.",
            count: 0,
            data: null,
          });
      }

      updateData.price =
        Number(price);
    }

    // --------------------------
    // STOCK
    // --------------------------
    if (
      stock !== undefined
    ) {
      if (
        stock === "" ||
        Number.isNaN(
          Number(stock)
        ) ||
        Number(stock) < 0
      ) {
        return res
          .status(
            HttpStatus.BAD_REQUEST
          )
          .json({
            success: false,
            message:
              "Product stock must be a valid number greater than or equal to 0.",
            count: 0,
            data: null,
          });
      }

      updateData.stock =
        Number(stock);
    }

    // --------------------------
    // IMAGE
    // --------------------------
    if (image !== undefined) {
      updateData.image =
        String(image).trim();
    }

    // --------------------------
    // CATEGORY
    // --------------------------
    if (
      category !== undefined
    ) {
      if (!category) {
        return res
          .status(
            HttpStatus.BAD_REQUEST
          )
          .json({
            success: false,
            message:
              "Product category is required.",
            count: 0,
            data: null,
          });
      }

      const categoryData =
        await findCategory(
          String(
            category
          ).trim()
        );

      if (!categoryData) {
        return res
          .status(
            HttpStatus.BAD_REQUEST
          )
          .json({
            success: false,
            message:
              "Selected category does not exist.",
            count: 0,
            data: null,
          });
      }

      updateData.category =
        categoryData._id;
    }

    // --------------------------
    // SUPPLIER
    // --------------------------
    if (
      supplier !== undefined
    ) {
      if (!supplier) {
        updateData.supplier =
          null;
      } else {
        const supplierData =
          await findSupplier(
            String(
              supplier
            ).trim()
          );

        if (!supplierData) {
          return res
            .status(
              HttpStatus.BAD_REQUEST
            )
            .json({
              success: false,
              message:
                "Selected supplier does not exist.",
              count: 0,
              data: null,
            });
        }

        updateData.supplier =
          supplierData._id;
      }
    }

    const product =
      await Product.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate("category")
        .populate("supplier");

    return res
      .status(HttpStatus.OK)
      .json({
        success: true,
        message:
          "Product updated successfully.",
        count: 1,
        data: product,
      });
  } catch (error) {
    console.error(
      "Update product error:",
      error
    );

    if (
      error.name ===
      "ValidationError"
    ) {
      return res
        .status(
          HttpStatus.BAD_REQUEST
        )
        .json({
          success: false,
          message:
            error.message,
          count: 0,
          data: null,
        });
    }

    return res
      .status(
        HttpStatus.INTERNAL_SERVER_ERROR
      )
      .json({
        success: false,
        message:
          "Unable to update product.",
        count: 0,
        data: null,
      });
  }
};

// ==============================
// DELETE PRODUCT
// ==============================

const deleteProduct = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res
        .status(
          HttpStatus.BAD_REQUEST
        )
        .json({
          success: false,
          message:
            "Invalid product ID.",
          count: 0,
          data: null,
        });
    }

    const product =
      await Product.findByIdAndDelete(
        id
      );

    if (!product) {
      return res
        .status(
          HttpStatus.NOT_FOUND
        )
        .json({
          success: false,
          message:
            "Product not found.",
          count: 0,
          data: null,
        });
    }

    return res
      .status(HttpStatus.OK)
      .json({
        success: true,
        message:
          "Product deleted successfully.",
        count: 1,
        data: product,
      });
  } catch (error) {
    console.error(
      "Delete product error:",
      error
    );

    return res
      .status(
        HttpStatus.INTERNAL_SERVER_ERROR
      )
      .json({
        success: false,
        message:
          "Unable to delete product.",
        count: 0,
        data: null,
      });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};