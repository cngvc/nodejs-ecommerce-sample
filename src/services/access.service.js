"use strict";

const { SHOP_ROLES } = require("../constants/roles.constant");
const shopModel = require("../models/shop.modal");
const KeyTokenService = require("../services/keyToken.service");
const bcrypt = require("bcrypt");
const { randomBytes } = require("node:crypto");
const { createTokenPair } = require("../utils/auth.utils");
const { projectionData } = require("../utils/projection.utils");

class AccessService {
  static signup = async ({ name, email, password }) => {
    try {
      const shopHolder = await shopModel.findOne({ email }).lean();
      if (shopHolder) {
        return {}; // throw error
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
          return {}; // throw error
        }

        const tokens = await createTokenPair(
          { userId: newShopHolder._id, email },
          publicKey,
          privateKey
        );

        return {
          code: 201,
          metadata: {
            shop: projectionData({
              fields: ["_id", "name", "email"],
              object: newShopHolder,
            }),
            tokens,
          },
        };
      }
    } catch (error) {
      console.log(error);
      return {};
    }
  };
}

module.exports = AccessService;
