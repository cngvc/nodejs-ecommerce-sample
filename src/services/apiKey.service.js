"use strict";

const apiKeyModal = require("../models/apiKey.modal");

class ApiKeyService {
  static findById = async (key) => {
    return await apiKeyModal.findOne({ key, isActive: true }).lean();
  };
}

module.exports = ApiKeyService;
