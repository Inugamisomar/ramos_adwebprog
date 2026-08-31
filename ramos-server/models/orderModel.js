const mongoose = require("mongoose");

const orderItemSchema =
  new mongoose.Schema({
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  });

const orderSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      items: {
        type: [orderItemSchema],
        required: true,
      },

      totalPrice: {
        type: Number,
        required: true,
      },

      status: {
        type: String,
        enum: [
          "Pending",
          "Confirmed",
          "Ready for Claiming",
        ],
        default: "Pending",
        required: true,
      },

      shippingAddress: {
        type: String,
        required: true,
      },

      paymentMethod: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

orderSchema.index({
  user: 1,
});

orderSchema.index({
  status: 1,
});

module.exports =
  mongoose.model(
    "Order",
    orderSchema
  );