"use strict";

const discountModel = require("../models/discount.model");
const KeyTokenService = require("./keyToken.service");
const bcrypt = require("bcrypt");
const { createTokenPair, generateKeys } = require("../utils/auth.utils");
const { projectionData } = require("../utils/mongo.utils");
const {
  BadRequestError,
  ForbiddenRequestError,
  AuthFailedError,
} = require("../core/responses/error.response");
const ShopService = require("./shop.service");

class AccessService {}

module.exports = AccessService;
