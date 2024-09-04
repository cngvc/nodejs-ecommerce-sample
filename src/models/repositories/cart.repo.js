"use strict";

const cartModel = require("../cart.model");

class CartRepository {
  static findOne = async ({ filter }) => {
    return await cartModel.findOne(filter);
  };

  static createCart = async ({ userId, product }) => {
    return await cartModel.findOneAndUpdate(
      { user: userId, state: "active" },
      {
        $addToSet: {
          products: product,
        },
      },
      { upsert: true, new: true }
    );
  };

  static updateCartItemQuantity = async ({ userId, product }) => {
    const { id, quantity } = product;
    const foundCart = await cartModel.findOne({
      user: userId,
      state: "active",
    });
    if (!foundCart) {
      throw new NotFoundError("Cart not found");
    }
    const productIndex = foundCart.products.findIndex(
      (product) => product.id.toString() === id.toString()
    );
    if (productIndex >= 0) {
      foundCart.products[productIndex].quantity += quantity;
    } else {
      foundCart.products.push(product);
    }
    foundCart.markModified("products");
    await foundCart.save();
    return foundCart;
  };

  static deleteItemInCart = async ({ userId, productId }) => {
    return await cartModel.updateOne(
      { user: userId, state: "active", "products.id": productId },
      {
        $pull: {
          products: { id: productId },
        },
      }
    );
  };

  static findByUserId = async ({ userId }) => {
    return await cartModel.findOne({ user: userId });
  };
}

module.exports = CartRepository;
