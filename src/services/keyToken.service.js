"use strict";

const keyTokenModal = require("../models/keyToken.modal");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
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
    } catch (error) {
      console.log(error);
      return error;
    }
  };
}

module.exports = KeyTokenService;
