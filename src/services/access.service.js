"use strict";

const { SHOP_ROLES } = require("../constants/roles.constant");
const shopModel = require("../models/shop.modal");
const KeyTokenService = require("../services/keyToken.service");
const bcrypt = require("bcrypt");
const { randomBytes } = require("node:crypto");
const { createTokenPair } = require("../utils/auth.utils");
const { projectionData } = require("../utils/projection.utils");
const { BadRequestError } = require("../core/responses/error.response");

class AccessService {
  static login = async ({ name, email, password }) => {};

  static signup = async ({ name, email, password }) => {
    const shopHolder = await shopModel.findOne({ email }).lean();
    if (shopHolder) {
      throw new BadRequestError("Error: Shop Already Registered.");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newShopHolder = await shopModel.create({
      name,
      email,
      password: hashedPassword,
      roles: [SHOP_ROLES.SHOP],
    });

    if (newShopHolder) {
      const privateKey = randomBytes(64).toString("hex");
      const publicKey = randomBytes(64).toString("hex");

      const keyToken = await KeyTokenService.createKeyToken({
        userId: newShopHolder._id,
        publicKey,
        privateKey,
      });

      if (!keyToken) {
        throw new BadRequestError("Error: Create KeyToken Failed.");
      }

      const tokens = await createTokenPair(
        { userId: newShopHolder._id, email },
        publicKey,
        privateKey
      );

      return {
        shop: projectionData({
          fields: ["_id", "name", "email"],
          object: newShopHolder,
        }),
        tokens,
      };
    }
  };
}

module.exports = AccessService;
