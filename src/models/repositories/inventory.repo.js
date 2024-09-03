"use strict";

const inventoryModel = require("../inventory.model");
const { convertToObjectId } = require("../../utils/mongo.utils");

class InventoryRepository {
  static createDiscount = async ({
    productId,
    shopId,
    stock,
    location = "unknown",
  }) => {
    return await inventoryModel.create({
      product: convertToObjectId(productId),
      shop: convertToObjectId(shopId),
      stock,
      location,
    });
  };
}

module.exports = InventoryRepository;
