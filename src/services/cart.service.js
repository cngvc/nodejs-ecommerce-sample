"use strict";

const CartRepository = require("../models/repositories/cart.repo");
const ProductRepository = require("../models/repositories/product.repo");
const { NotFoundError } = require("../core/responses/error.response");

class CartService {
  static createCart = async ({ userId, product = {} }) => {
    const foundCart = await CartRepository.findByUserId({ userId });
    if (!foundCart) {
      return await CartRepository.createCart({ userId, product });
    }
    if (!foundCart.products.length) {
      foundCart.products = [product];
      return await foundCart.save();
    }
    return await CartRepository.updateCartItemQuantity({
      userId,
      product,
    });
  };

  static addToCart = async ({ userId, product = {} }) => {
    const { id, quantity, oldQuantity = 0, shop } = product;
    const foundProduct = await ProductRepository.findOneById({ id });
    if (!foundProduct) {
      throw new NotFoundError("Product not found");
    }
    if (foundProduct.shop.toString() !== shop.toString()) {
      throw new NotFoundError("Product do not belong to this shop");
    }
    if (quantity === 0) {
      // delete
    }

    return await CartRepository.updateCartItemQuantity({
      userId,
      product: {
        id,
        quantity: quantity - oldQuantity,
      },
    });
  };

  static deleteItemInCart = async ({ userId, productId }) => {
    return await CartRepository.deleteItemInCart({ userId, productId });
  };

  static findByUserId = async ({ userId }) => {
    return await CartRepository.findByUserId({ userId });
  };
}

module.exports = CartService;
