"use strict";

const ProductService = require("../services/product.service");
const { CreatedRequestSuccess } = require("../core/responses/success.response");

class ProductController {
  createProduct = async (req, res) => {
    const data = req.body;

    return new CreatedRequestSuccess({
      message: "New product created successfully",
      metadata: await ProductService.createProduct(data.type, {
        ...data,
        shop: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
