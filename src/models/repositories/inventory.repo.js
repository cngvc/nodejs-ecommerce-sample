"use strict";

const { Types } = require("mongoose");
const inventoryModal = require("../inventory.modal");

class InventoryRepository {
  static createInventory = async ({
    productId,
    shopId,
    stock,
    location = "unknown",
  }) => {
    return await inventoryModal.create({
      product: new Types.ObjectId(productId),
      shop: new Types.ObjectId(shopId),
      stock,
      location,
    });
  };
}

module.exports = InventoryRepository;
