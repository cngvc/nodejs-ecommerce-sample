"use strict";

const { randomBytes } = require("node:crypto");
const apiKeyModel = require("../models/apiKey.model");
const keyTokenModel = require("../models/keyToken.model");
const shopModel = require("../models/shop.model");
const { productModel, electronicModel } = require("../models/product.model");
const inventoryModel = require("../models/inventory.model");
const cartModel = require("../models/cart.model");

class DbSeed {
  static createDbSeed = async () => {
    // await keyTokenModel.deleteMany({});
    // await shopModel.deleteMany({});

    // await productModel.deleteMany({});
    // await electronicModel.deleteMany({});
    // await inventoryModel.deleteMany({});
    // await cartModel.deleteMany({});

    const key = await apiKeyModel.findOne({ isActive: true });
    if (!key) {
      await apiKeyModel.create({
        isActive: true,
        key: randomBytes(64).toString("hex"),
        permissions: [1],
      });
    }
  };
}

module.exports = DbSeed;
