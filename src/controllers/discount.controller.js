"use strict";

const DiscountService = require("../services/discount.service");
const {
  CreatedRequestSuccess,
  OkRequestSuccess,
} = require("../core/responses/success.response");

class DiscountController {
  createDiscount = async (req, res) => {
    const data = req.body;

    return new CreatedRequestSuccess({
      message: "New discount created successfully",
      metadata: await DiscountService.createDiscount({
        ...data,
        shop: req.user.userId,
      }),
    }).send(res);
  };

  findProductsByDiscount = async (req, res) => {
    return new OkRequestSuccess({
      metadata: await DiscountService.findProductsByDiscount({
        ...req.query,
      }),
    }).send(res);
  };

  findDiscountsByShop = async (req, res) => {
    return new OkRequestSuccess({
      metadata: await DiscountService.findDiscountsByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  deleteDiscount = async (req, res) => {
    return new OkRequestSuccess({
      metadata: await DiscountService.deleteDiscount({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  cancelDiscount = async (req, res) => {
    return new OkRequestSuccess({
      metadata: await DiscountService.cancelDiscount({
        ...req.body,
        shopId: req.user.shopId,
      }),
    }).send(res);
  };

  calculateDiscountAmount = async (req, res) => {
    return new OkRequestSuccess({
      metadata: await DiscountService.calculateDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
