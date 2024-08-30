"use strict";

const { randomBytes } = require("node:crypto");
const apiKeyModal = require("../models/apiKey.modal");
const keyTokenModal = require("../models/keyToken.modal");
const shopModal = require("../models/shop.modal");

class DbSeed {
  static createDbSeed = async () => {
    // await keyTokenModal.deleteMany({});
    // await shopModal.deleteMany({});

    const key = await apiKeyModal.findOne({ isActive: true });
    if (!key) {
      await apiKeyModal.create({
        isActive: true,
        key: randomBytes(64).toString("hex"),
        permissions: [1],
      });
    }
  };
}

module.exports = DbSeed;
