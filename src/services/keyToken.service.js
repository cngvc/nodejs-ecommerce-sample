"use strict";

const { Types } = require("mongoose");
const keyTokenModal = require("../models/keyToken.modal");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    const tokens = await keyTokenModal.findOneAndUpdate(
      { user: userId },
      {
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken,
      },
      {
        upsert: true,
        new: true,
      }
    );
    return tokens ? tokens.publicKey : null;
  };

  static findByUserId = async (userId) => {
    return await keyTokenModal
      .findOne({ user: new Types.ObjectId(userId) })
      .lean();
  };

  static removeKeyById = async (id) => {
    return await keyTokenModal.deleteOne({
      _id: new Types.ObjectId(id),
    });
  };
}

module.exports = KeyTokenService;
