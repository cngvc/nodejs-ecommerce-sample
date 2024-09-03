"use strict";

const DiscountService = require("../services/discount.service");
const { CreatedRequestSuccess } = require("../core/responses/success.response");

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
    return new CreatedRequestSuccess({
      metadata: await DiscountService.findProductsByDiscount({
        shopId: req.user.userId,
        code: req.params.code,
        limit: req.query.limit,
        page: req.query.page,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
