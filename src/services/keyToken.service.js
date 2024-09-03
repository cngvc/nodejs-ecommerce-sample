"use strict";

const { Types } = require("mongoose");
const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    const tokens = await keyTokenModel.findOneAndUpdate(
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
    return await keyTokenModel
      .findOne({ user: new Types.ObjectId(userId) })
      .lean();
  };

  static removeKeyById = async (id) => {
    return await keyTokenModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
    });
  };

  static findByRefreshTokenInRefreshTokensUsed = async (refreshToken) => {
    return await keyTokenModel
      .findOne({
        refreshTokensUsed: { $in: refreshToken },
      })
      .lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel
      .findOne({
        refreshToken,
      })
      .lean();
  };

  static deleteByUserId = async (userId) => {
    return await keyTokenModel.findOneAndDelete({
      user: new Types.ObjectId(userId),
    });
  };

  static updateAndTrackRefreshTokenById = async (
    id,
    refreshToken,
    newRefreshToken
  ) => {
    return await keyTokenModel.updateOne(
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
