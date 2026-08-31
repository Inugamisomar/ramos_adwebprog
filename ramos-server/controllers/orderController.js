const mongoose = require(
  "mongoose"
);

const Order = require(
  "../models/orderModel"
);

const Product = require(
  "../models/productModel"
);

// HELPERS

const isValidObjectId = (
  value
) => {
  return mongoose.Types.ObjectId.isValid(
    value
  );
};

const populateOrder = (
  query
) => {
  return query
    .populate(
      "user",
      "name email role isActive"
    )
    .populate(
      "items.product"
    );
};

// GET ORDERS
//
// Customer -> own orders
// Admin    -> all orders

const getOrders = async (
  req,
  res
) => {
  try {
    const filter =
      req.user.role ===
      "admin"
        ? {}
        : {
            user:
              req.user._id,
          };

    const orders =
      await populateOrder(
        Order.find(filter)
      ).sort({
        createdAt: -1,
      });

    return res
      .status(200)
      .json(orders);
  } catch (error) {
    console.error(
      "Get orders error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Unable to retrieve orders.",
      });
  }
};

// GET ORDER BY ID

const getOrderById =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      // -------------------------
      // VALIDATE ID
      // -------------------------
      if (
        !isValidObjectId(
          id
        )
      ) {
        return res
          .status(400)
          .json({
            message:
              "Invalid order ID.",
          });
      }

      const order =
        await populateOrder(
          Order.findById(id)
        );

      if (!order) {
        return res
          .status(404)
          .json({
            message:
              "Order not found.",
          });
      }

      // -------------------------
      // OWNERSHIP CHECK
      // -------------------------
      if (
        req.user.role !==
          "admin" &&
        order.user._id.toString() !==
          req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({
            message:
              "You are not authorized to view this order.",
          });
      }

      return res
        .status(200)
        .json(order);
    } catch (error) {
      console.error(
        "Get order error:",
        error
      );

      return res
        .status(500)
        .json({
          message:
            "Unable to retrieve order.",
        });
    }
  };

// CREATE ORDER
// CUSTOMER ONLY

const createOrder = async (
  req,
  res
) => {
  try {
    // -------------------------
    // ROLE CHECK
    // -------------------------
    if (
      req.user.role !==
      "customer"
    ) {
      return res
        .status(403)
        .json({
          message:
            "Only customers can place orders.",
        });
    }

    const {
      items,
      shippingAddress,
      paymentMethod,
    } = req.body;

    // BASIC VALIDATION

    if (
      !Array.isArray(
        items
      ) ||
      items.length === 0
    ) {
      return res
        .status(400)
        .json({
          message:
            "Order must contain at least one product.",
        });
    }

    if (
      !shippingAddress ||
      !String(
        shippingAddress
      ).trim()
    ) {
      return res
        .status(400)
        .json({
          message:
            "Shipping address is required.",
        });
    }

    if (
      !paymentMethod ||
      !String(
        paymentMethod
      ).trim()
    ) {
      return res
        .status(400)
        .json({
          message:
            "Payment method is required.",
        });
    }

    // COMBINE DUPLICATE PRODUCT ENTRIES
    //
    // Example:
    // Product A quantity 3
    // Product A quantity 2
    //
    // becomes:
    // Product A quantity 5
    //
    // This prevents stock validation
    // from being bypassed.

    const combinedItems =
      new Map();

    for (const item of items) {
      if (
        !item ||
        !item.product
      ) {
        return res
          .status(400)
          .json({
            message:
              "Each order item must contain a product.",
          });
      }

      if (
        !isValidObjectId(
          item.product
        )
      ) {
        return res
          .status(400)
          .json({
            message:
              "One of the product IDs is invalid.",
          });
      }

      const quantity =
        Number(
          item.quantity
        );

      if (
        !Number.isInteger(
          quantity
        ) ||
        quantity < 1
      ) {
        return res
          .status(400)
          .json({
            message:
              "Product quantity must be a whole number of at least 1.",
          });
      }

      const productId =
        String(
          item.product
        );

      const currentQuantity =
        combinedItems.get(
          productId
        ) || 0;

      combinedItems.set(
        productId,
        currentQuantity +
          quantity
      );
    }

    // VALIDATE PRODUCTS AND STOCK

    let totalPrice = 0;

    const orderItems = [];
    const productsToUpdate =
      [];

    for (const [
      productId,
      quantity,
    ] of combinedItems) {
      const product =
        await Product.findById(
          productId
        );

      if (!product) {
        return res
          .status(404)
          .json({
            message:
              "One of the products was not found.",
          });
      }

      if (
        quantity >
        product.stock
      ) {
        return res
          .status(400)
          .json({
            message:
              `Not enough stock for ${product.name}. Available stock: ${product.stock}.`,
          });
      }

      // Never trust a total price
      // coming from the frontend.
      totalPrice +=
        Number(
          product.price
        ) * quantity;

      orderItems.push({
        product:
          product._id,
        quantity,
      });

      productsToUpdate.push({
        product,
        quantity,
      });
    }

    // DEDUCT PRODUCT STOCK

    for (
      const item of
      productsToUpdate
    ) {
      item.product.stock -=
        item.quantity;

      await item.product.save();
    }

    // CREATE ORDER

    const order =
      await Order.create({
        user:
          req.user._id,

        items:
          orderItems,

        totalPrice,

        shippingAddress:
          String(
            shippingAddress
          ).trim(),

        paymentMethod:
          String(
            paymentMethod
          ).trim(),

        status:
          "Pending",
      });

    const populatedOrder =
      await populateOrder(
        Order.findById(
          order._id
        )
      );

    return res
      .status(201)
      .json({
        message:
          "Order created successfully.",

        order:
          populatedOrder,
      });
  } catch (error) {
    console.error(
      "Create order error:",
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
          "Unable to create order.",
      });
  }
};

// UPDATE ORDER
// ADMIN ONLY

const updateOrder = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    // -------------------------
    // VALIDATE ID
    // -------------------------
    if (
      !isValidObjectId(
        id
      )
    ) {
      return res
        .status(400)
        .json({
          message:
            "Invalid order ID.",
        });
    }

    const order =
      await Order.findById(
        id
      );

    if (!order) {
      return res
        .status(404)
        .json({
          message:
            "Order not found.",
        });
    }

    const { status } =
      req.body;

    if (!status) {
      return res
        .status(400)
        .json({
          message:
            "Order status is required.",
        });
    }

    const allowedStatuses =
      [
        "Pending",
        "Confirmed",
        "Ready for Claiming",
      ];

    if (
      !allowedStatuses.includes(
        status
      )
    ) {
      return res
        .status(400)
        .json({
          message:
            "Invalid order status.",
        });
    }

    // VALID STATUS TRANSITIONS

    const validTransitions = {
      Pending: [
        "Confirmed",
      ],

      Confirmed: [
        "Ready for Claiming",
      ],

      "Ready for Claiming":
        [],
    };

    // Allow saving the same
    // status without error.
    if (
      status !==
        order.status &&
      !validTransitions[
        order.status
      ]?.includes(status)
    ) {
      return res
        .status(400)
        .json({
          message:
            `Order status cannot change from "${order.status}" to "${status}".`,
        });
    }

    order.status =
      status;

    await order.save();

    const updatedOrder =
      await populateOrder(
        Order.findById(
          order._id
        )
      );

    return res
      .status(200)
      .json({
        message:
          "Order updated successfully.",

        order:
          updatedOrder,
      });
  } catch (error) {
    console.error(
      "Update order error:",
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
          "Unable to update order.",
      });
  }
};

// DELETE ORDER
// ADMIN ONLY

const deleteOrder = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    if (
      !isValidObjectId(
        id
      )
    ) {
      return res
        .status(400)
        .json({
          message:
            "Invalid order ID.",
        });
    }

    const order =
      await Order.findById(
        id
      );

    if (!order) {
      return res
        .status(404)
        .json({
          message:
            "Order not found.",
        });
    }

    await order.deleteOne();

    return res
      .status(200)
      .json({
        message:
          "Order deleted successfully.",
      });
  } catch (error) {
    console.error(
      "Delete order error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Unable to delete order.",
      });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};