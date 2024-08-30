"use strict";

const JWT = require("jsonwebtoken");
const { randomBytes } = require("node:crypto");
const { HEADER } = require("../constants/header.constant");
const {
  AuthFailedError,
  NotFoundError,
} = require("../core/responses/error.response");
const KeyTokenService = require("../services/keyToken.service");

const createTokenPair = async (payload, publicKey, privateKey) => {
  const accessToken = JWT.sign(payload, publicKey, {
    expiresIn: "2 days",
  });

  const refreshToken = JWT.sign(payload, privateKey, {
    expiresIn: "7 days",
  });
  JWT.verify(accessToken, publicKey, (err, decode) => {
    if (err) {
      throw new AuthFailedError();
    } else {
      console.log("Decode verify", decode);
    }
  });
  return { accessToken, refreshToken };
};

const generateKeys = () => {
  const privateKey = randomBytes(64).toString("hex");
  const publicKey = randomBytes(64).toString("hex");

  return {
    privateKey,
    publicKey,
  };
};

const validateAuthentication = async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailedError();

  const keyToken = await KeyTokenService.findByUserId(userId);
  if (!keyToken) throw new NotFoundError("KeyStore Not Found");

  if (req.headers[HEADER.REFRESH_TOKEN]) {
    const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
    const decodedUser = JWT.verify(refreshToken, keyToken.privateKey);
    if (userId !== decodedUser.userId) {
      throw new AuthFailedError();
    }
    req.keyToken = keyToken;
    req.user = decodedUser;
    req.refreshToken = refreshToken;
    return next();
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailedError();

  const decodedUser = JWT.verify(accessToken, keyToken.publicKey);
  if (userId !== decodedUser.userId) {
    throw new AuthFailedError();
  }
  req.keyToken = keyToken;
  req.user = decodedUser;
  return next();
};

const verifyJWT = (token, keySecret) => {
  return JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  generateKeys,
  validateAuthentication,
  verifyJWT,
};
