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
    return await keyTokenModal.findOneAndDelete({
      _id: new Types.ObjectId(id),
    });
  };

  static findByRefreshTokenInRefreshTokensUsed = async (refreshToken) => {
    return await keyTokenModal
      .findOne({
        refreshTokensUsed: { $in: refreshToken },
      })
      .lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModal
      .findOne({
        refreshToken,
      })
      .lean();
  };

  static deleteByUserId = async (userId) => {
    return await keyTokenModal.findOneAndDelete({
      user: new Types.ObjectId(userId),
    });
  };

  static updateAndTrackRefreshTokenById = async (
    id,
    refreshToken,
    newRefreshToken
  ) => {
    return await keyTokenModal.updateOne(
      { _id: new Types.ObjectId(id) },
      {
        $set: {
          refreshToken: newRefreshToken,
        },
        $addToSet: {
          refreshTokensUsed: refreshToken,
        },
      }
    );
  };
}

module.exports = KeyTokenService;
