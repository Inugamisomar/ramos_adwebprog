const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },

        image: {
            type: String,
            trim: true
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        // Supplier reference for Part 7 filtering
        supplier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier"
        }
    },
    {
        timestamps: true
    }
);

// Indexes
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ supplier: 1 });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;