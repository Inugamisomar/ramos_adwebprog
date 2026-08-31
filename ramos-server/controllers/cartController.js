const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// Helper:
// When a product referenced by a cart has been deleted,
// Mongoose populate() returns product: null.
// This removes those invalid items from API responses.
const cleanPopulatedCart = (cart) => {
  if (!cart) {
    return null;
  }

  const cartObject =
    typeof cart.toObject === "function"
      ? cart.toObject()
      : { ...cart };

  cartObject.items = Array.isArray(
    cartObject.items
  )
    ? cartObject.items.filter(
        (item) =>
          item &&
          item.product !== null &&
          item.product !== undefined
      )
    : [];

  return cartObject;
};

// GET CARTS
// Customer -> only their own cart
// Admin    -> all carts
const getCarts = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role !== "admin") {
      filter = {
        user: req.user._id,
      };
    }

    const carts = await Cart.find(filter)
      .populate(
        "user",
        "name email role isActive"
      )
      .populate("items.product");

    const cleanedCarts =
      carts.map((cart) =>
        cleanPopulatedCart(cart)
      );

    res.status(200).json(
      cleanedCarts
    );
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "Unable to retrieve carts.",
    });
  }
};

// GET CART BY ID
// Customer -> only own cart
// Admin    -> any cart
const getCartById = async (
  req,
  res
) => {
  try {
    const cart = await Cart.findById(
      req.params.id
    )
      .populate(
        "user",
        "name email role isActive"
      )
      .populate("items.product");

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const cartOwnerId =
      cart.user?._id?.toString() ||
      cart.user?.toString();

    if (
      req.user.role !== "admin" &&
      cartOwnerId !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to access this cart.",
      });
    }

    const cleanedCart =
      cleanPopulatedCart(cart);

    res.status(200).json(
      cleanedCart
    );
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "Unable to retrieve cart.",
    });
  }
};

// CREATE CART
// Logged-in customer only
const createCart = async (
  req,
  res
) => {
  try {
    const { items } = req.body;

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        message:
          "Cart must contain at least one product.",
      });
    }

    // Prevent multiple carts
    // for the same customer
    const existingCart =
      await Cart.findOne({
        user: req.user._id,
      });

    if (existingCart) {
      return res.status(400).json({
        message:
          "You already have a cart.",
      });
    }

    const validatedItems = [];
    let totalPrice = 0;

    for (const item of items) {
      if (
        !item ||
        !item.product ||
        item.quantity === undefined ||
        item.quantity === null
      ) {
        return res.status(400).json({
          message:
            "Each cart item must contain a product and quantity.",
        });
      }

      const quantity = Number(
        item.quantity
      );

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          message:
            "Quantity must be at least 1.",
        });
      }

      const product =
        await Product.findById(
          item.product
        );

      if (!product) {
        return res.status(404).json({
          message:
            "One of the products was not found.",
        });
      }

      if (
        Number(product.stock) <= 0
      ) {
        return res.status(400).json({
          message: `${product.name} is out of stock.`,
        });
      }

      if (
        quantity >
        Number(product.stock)
      ) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Only ${product.stock} item(s) are available.`,
        });
      }

      totalPrice +=
        Number(product.price) *
        quantity;

      validatedItems.push({
        product: product._id,
        quantity,
      });
    }

    const cart =
      await Cart.create({
        user: req.user._id,
        items: validatedItems,
        totalPrice,
      });

    const populatedCart =
      await Cart.findById(
        cart._id
      )
        .populate(
          "user",
          "name email role isActive"
        )
        .populate(
          "items.product"
        );

    res.status(201).json({
      message:
        "Cart created successfully.",
      cart:
        cleanPopulatedCart(
          populatedCart
        ),
    });
  } catch (error) {
    res.status(400).json({
      message:
        error.message ||
        "Unable to create cart.",
    });
  }
};

// UPDATE CART
// Customer -> only own cart
// Admin    -> any cart
const updateCart = async (
  req,
  res
) => {
  try {
    const cart =
      await Cart.findById(
        req.params.id
      );

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    if (!cart.user) {
      return res.status(400).json({
        message:
          "Cart owner information is unavailable.",
      });
    }

    if (
      req.user.role !== "admin" &&
      cart.user.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to update this cart.",
      });
    }

    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        message:
          "Cart items are required.",
      });
    }

    // Allow the customer to empty
    // their cart completely
    if (items.length === 0) {
      cart.items = [];
      cart.totalPrice = 0;

      await cart.save();

      const emptyCart =
        await Cart.findById(
          cart._id
        )
          .populate(
            "user",
            "name email role isActive"
          )
          .populate(
            "items.product"
          );

      return res.status(200).json({
        message:
          "Cart updated successfully.",
        cart:
          cleanPopulatedCart(
            emptyCart
          ),
      });
    }

    const validatedItems = [];
    let totalPrice = 0;

    for (const item of items) {
      if (
        !item ||
        !item.product ||
        item.quantity === undefined ||
        item.quantity === null
      ) {
        return res.status(400).json({
          message:
            "Each cart item must contain a product and quantity.",
        });
      }

      const quantity = Number(
        item.quantity
      );

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          message:
            "Quantity must be at least 1.",
        });
      }

      const product =
        await Product.findById(
          item.product
        );

      if (!product) {
        return res.status(404).json({
          message:
            "One of the products was not found.",
        });
      }

      if (
        Number(product.stock) <= 0
      ) {
        return res.status(400).json({
          message: `${product.name} is out of stock.`,
        });
      }

      if (
        quantity >
        Number(product.stock)
      ) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Only ${product.stock} item(s) are available.`,
        });
      }

      totalPrice +=
        Number(product.price) *
        quantity;

      validatedItems.push({
        product: product._id,
        quantity,
      });
    }

    cart.items =
      validatedItems;

    cart.totalPrice =
      totalPrice;

    await cart.save();

    const updatedCart =
      await Cart.findById(
        cart._id
      )
        .populate(
          "user",
          "name email role isActive"
        )
        .populate(
          "items.product"
        );

    res.status(200).json({
      message:
        "Cart updated successfully.",
      cart:
        cleanPopulatedCart(
          updatedCart
        ),
    });
  } catch (error) {
    res.status(400).json({
      message:
        error.message ||
        "Unable to update cart.",
    });
  }
};

// DELETE CART
// Customer -> only own cart
// Admin    -> any cart
const deleteCart = async (
  req,
  res
) => {
  try {
    const cart =
      await Cart.findById(
        req.params.id
      );

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    if (!cart.user) {
      return res.status(400).json({
        message:
          "Cart owner information is unavailable.",
      });
    }

    if (
      req.user.role !== "admin" &&
      cart.user.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to delete this cart.",
      });
    }

    await cart.deleteOne();

    res.status(200).json({
      message:
        "Cart deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "Unable to delete cart.",
    });
  }
};

module.exports = {
  getCarts,
  getCartById,
  createCart,
  updateCart,
  deleteCart,
};