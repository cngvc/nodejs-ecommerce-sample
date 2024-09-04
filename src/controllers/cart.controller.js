"use strict";

const CartService = require("../services/cart.service");
const {
  CreatedRequestSuccess,
  OkRequestSuccess,
} = require("../core/responses/success.response");

class CartController {
  createCart = async (req, res) => {
    return new CreatedRequestSuccess({
      metadata: await CartService.createCart({
        ...req.body,
      }),
    }).send(res);
  };

  addToCard = async (req, res) => {
    return new CreatedRequestSuccess({
      metadata: await CartService.addToCart({
        ...req.body,
      }),
    }).send(res);
  };

  deleteItemInCart = async (req, res) => {
    return new OkRequestSuccess({
      metadata: await CartService.deleteItemInCart({
        ...req.body,
      }),
    }).send(res);
  };

  findByUserId = async (req, res) => {
    return new OkRequestSuccess({
      metadata: await CartService.findByUserId({
        ...req.query,
      }),
    }).send(res);
  };
}

module.exports = new CartController();
