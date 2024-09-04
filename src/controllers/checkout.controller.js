"use strict";
"use strict";

const CheckoutService = require("../services/checkout.service");
const { OkRequestSuccess } = require("../core/responses/success.response");

class CheckoutController {
  checkoutReview = async (req, res, next) => {
    return new OkRequestSuccess({
      metadata: await CheckoutService.checkoutReview(req.body),
    }).send(res);
  };
}

module.exports = new CheckoutController();
