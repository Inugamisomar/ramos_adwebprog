const mongoose = require("mongoose");

const Review = require("../models/reviewModel");
const Product = require("../models/productModel");

// HELPERS

const isValidObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(
    value
  );
};

const populateReview = (query) => {
  return query
    .populate("product")
    .populate(
      "user",
      "name email role isActive"
    );
};

// GET ALL REVIEWS

const getReviews = async (
  req,
  res
) => {
  try {
    const reviews =
      await populateReview(
        Review.find()
      ).sort({
        createdAt: -1,
      });

    return res
      .status(200)
      .json(reviews);
  } catch (error) {
    console.error(
      "Get reviews error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Unable to retrieve reviews.",
      });
  }
};

// GET REVIEW BY ID

const getReviewById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({
          message:
            "Invalid review ID.",
        });
    }

    const review =
      await populateReview(
        Review.findById(id)
      );

    if (!review) {
      return res
        .status(404)
        .json({
          message:
            "Review not found.",
        });
    }

    return res
      .status(200)
      .json(review);
  } catch (error) {
    console.error(
      "Get review error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Unable to retrieve review.",
      });
  }
};

// CREATE REVIEW

const createReview = async (
  req,
  res
) => {
  try {
    const {
      product,
      rating,
      comment,
    } = req.body;

    // --------------------------
    // REQUIRED FIELDS
    // --------------------------
    if (!product) {
      return res
        .status(400)
        .json({
          message:
            "Product is required.",
        });
    }

    if (
      rating === undefined ||
      rating === null ||
      rating === ""
    ) {
      return res
        .status(400)
        .json({
          message:
            "Rating is required.",
        });
    }

    if (
      !comment ||
      !String(
        comment
      ).trim()
    ) {
      return res
        .status(400)
        .json({
          message:
            "Review comment is required.",
        });
    }

    // --------------------------
    // PRODUCT ID
    // --------------------------
    if (
      !isValidObjectId(
        product
      )
    ) {
      return res
        .status(400)
        .json({
          message:
            "Invalid product ID.",
        });
    }

    const existingProduct =
      await Product.findById(
        product
      );

    if (!existingProduct) {
      return res
        .status(404)
        .json({
          message:
            "Product not found.",
        });
    }

    // --------------------------
    // RATING
    // --------------------------
    const numericRating =
      Number(rating);

    if (
      Number.isNaN(
        numericRating
      ) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res
        .status(400)
        .json({
          message:
            "Rating must be between 1 and 5.",
        });
    }

    // --------------------------
    // DUPLICATE REVIEW
    // --------------------------
    const existingReview =
      await Review.findOne({
        product,
        user: req.user._id,
      });

    if (existingReview) {
      return res
        .status(400)
        .json({
          message:
            "You have already reviewed this product.",
        });
    }

    // --------------------------
    // CREATE
    // --------------------------
    const review =
      await Review.create({
        product,
        user: req.user._id,
        rating: numericRating,
        comment:
          String(
            comment
          ).trim(),
      });

    const populatedReview =
      await populateReview(
        Review.findById(
          review._id
        )
      );

    return res
      .status(201)
      .json(populatedReview);
  } catch (error) {
    console.error(
      "Create review error:",
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
          "Unable to create review.",
      });
  }
};

// UPDATE REVIEW

const updateReview = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({
          message:
            "Invalid review ID.",
        });
    }

    const existingReview =
      await Review.findById(id);

    if (!existingReview) {
      return res
        .status(404)
        .json({
          message:
            "Review not found.",
        });
    }

    const {
      rating,
      comment,
    } = req.body;

    const updateData = {};

    // --------------------------
    // RATING
    // --------------------------
    if (
      rating !== undefined
    ) {
      const numericRating =
        Number(rating);

      if (
        Number.isNaN(
          numericRating
        ) ||
        numericRating < 1 ||
        numericRating > 5
      ) {
        return res
          .status(400)
          .json({
            message:
              "Rating must be between 1 and 5.",
          });
      }

      updateData.rating =
        numericRating;
    }

    // --------------------------
    // COMMENT
    // --------------------------
    if (
      comment !== undefined
    ) {
      const trimmedComment =
        String(
          comment
        ).trim();

      if (!trimmedComment) {
        return res
          .status(400)
          .json({
            message:
              "Review comment cannot be empty.",
          });
      }

      updateData.comment =
        trimmedComment;
    }

    // Nothing valid supplied.
    if (
      Object.keys(
        updateData
      ).length === 0
    ) {
      return res
        .status(400)
        .json({
          message:
            "Provide a rating or comment to update.",
        });
    }

    const review =
      await populateReview(
        Review.findByIdAndUpdate(
          id,
          updateData,
          {
            new: true,
            runValidators: true,
          }
        )
      );

    return res
      .status(200)
      .json({
        message:
          "Review updated successfully.",
        review,
      });
  } catch (error) {
    console.error(
      "Update review error:",
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
          "Unable to update review.",
      });
  }
};

// DELETE REVIEW

const deleteReview = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({
          message:
            "Invalid review ID.",
        });
    }

    const review =
      await Review.findByIdAndDelete(
        id
      );

    if (!review) {
      return res
        .status(404)
        .json({
          message:
            "Review not found.",
        });
    }

    return res
      .status(200)
      .json({
        message:
          "Review deleted successfully.",
      });
  } catch (error) {
    console.error(
      "Delete review error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Unable to delete review.",
      });
  }
};

module.exports = {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};