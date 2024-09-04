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

  static addToCart = async ({ userId, shopOrders = [] }) => {
    for (const shopOrder of shopOrders) {
      for (const itemProduct of shopOrder.itemProducts) {
        const { id, quantity, oldQuantity = 0 } = itemProduct;
        const { shopId } = shopOrder;
        const foundProduct = await ProductRepository.findById({ id });
        if (!foundProduct) {
          throw new NotFoundError("Product not found");
        }
        if (foundProduct.shop.toString() !== shopId.toString()) {
          throw new NotFoundError("Product do not belong to this shop");
        }
        await CartRepository.updateCartItemQuantity({
          userId,
          product: {
            id,
            shop: shopId,
            quantity: quantity - oldQuantity,
          },
        });
      }
    }

    return await CartRepository.findByUserId({ userId });
  };

  static deleteItemInCart = async ({ userId, productId }) => {
    return await CartRepository.deleteItemInCart({ userId, productId });
  };

  static findByUserId = async ({ userId }) => {
    return await CartRepository.findByUserId({ userId });
  };
}

module.exports = CartService;
