"use strict";

const { SHOP_ROLES } = require("../constants/roles.constant");
const shopModel = require("../models/shop.modal");
const KeyTokenService = require("../services/keyToken.service");
const bcrypt = require("bcrypt");
const { createTokenPair, generateKeys } = require("../utils/auth.utils");
const { projectionData } = require("../utils/projection.utils");
const { BadRequestError } = require("../core/responses/error.response");
const ShopService = require("../services/shop.service");

class AccessService {
  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await ShopService.findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registered");

    const isMatched = bcrypt.compare(password, foundShop.password);
    if (!isMatched) throw new BadRequestError("Authentication error");

    const { privateKey, publicKey } = generateKeys();

    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });
    return {
      shop: projectionData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

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
      const { privateKey, publicKey } = generateKeys();

      const tokens = await createTokenPair(
        { userId: newShopHolder._id, email },
        publicKey,
        privateKey
      );

      const keyToken = await KeyTokenService.createKeyToken({
        userId: newShopHolder._id,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken,
      });

      if (!keyToken) {
        throw new BadRequestError("Error: Create KeyToken Failed.");
      }

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
