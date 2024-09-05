"use strict";

const { BadRequestError } = require("../core/responses/error.response");
const inventoryModel = require("../models/inventory.model");
const ProductRepository = require("../models/repositories/product.repo");
const { convertToObjectId } = require("../utils/mongo.utils");

class InventoryService {
  static addStockToInventory = async ({
    stock,
    productId,
    shopId,
    location = "494 CMT8",
  }) => {
    const product = await ProductRepository.findById({ id: productId });
    if (product) {
      throw new BadRequestError("Product not found");
    }
    return await inventoryModel.findOneAndUpdate(
      {
        shop: convertToObjectId(shopId),
        product: convertToObjectId(productId),
      },
      {
        $inc: {
          stock,
        },
        $set: {
          location,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );
  };
}

module.exports = InventoryService;
