"use strict";

const { Types } = require("mongoose");
const inventoryModel = require("../inventory.model");

class DiscountRepository {
  static createDiscount = async ({
    productId,
    shopId,
    stock,
    location = "unknown",
  }) => {
    return await inventoryModel.create({
      product: new Types.ObjectId(productId),
      shop: new Types.ObjectId(shopId),
      stock,
      location,
    });
  };
}

module.exports = DiscountRepository;
