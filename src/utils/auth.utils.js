"use strict";

const JWT = require("jsonwebtoken");
const { randomBytes } = require("node:crypto");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log("Error verify", err);
      } else {
        console.log("Decode verify", decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
};

const generateKeys = () => {
  const privateKey = randomBytes(64).toString("hex");
  const publicKey = randomBytes(64).toString("hex");

  return {
    privateKey,
    publicKey,
  };
};

module.exports = {
  createTokenPair,
  generateKeys,
};
