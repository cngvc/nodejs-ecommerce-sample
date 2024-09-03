"use strict";

const apiKeyModel = require("../models/apiKey.model");

class ApiKeyService {
  static findById = async (key) => {
    return await apiKeyModel.findOne({ key, isActive: true }).lean();
  };
}

module.exports = ApiKeyService;
