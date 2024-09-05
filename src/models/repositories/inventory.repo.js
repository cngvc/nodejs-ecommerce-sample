"use strict";

const inventoryModel = require("../inventory.model");
const { convertToObjectId } = require("../../utils/mongo.utils");
const { BadRequestError } = require("../../core/responses/error.response");

class InventoryRepository {
  static createInventory = async ({
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

  static reservationInventory = async ({ productId, quantity, cartId }) => {
    const productInventory = await inventoryModel.findOne({
      product: convertToObjectId(productId),
    });
    if (productInventory.stock < quantity) {
      console.log("The quantity of product in stock is not enough");
      return null;
    }
    productInventory.stock -= quantity;
    productInventory.reservations.push({
      quantity,
      cartId,
      createdAt: new Date(),
    });
    await productInventory.save();
    return productInventory;
  };
}

module.exports = InventoryRepository;
