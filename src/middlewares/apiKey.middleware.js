"use strict";

const ApiKeyService = require("../services/apiKey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({ message: "F" });
    }
    const apiKey = await ApiKeyService.findById(key);
    if (!apiKey) {
      return res.status(403).json({ message: "F" });
    }
    req.apiKey = apiKey;
    return next();
  } catch (error) {}
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.apiKey.permissions) {
      return res.status(403).json({ message: "Permission denied" });
    }
    const isValidPermission = req.apiKey.permissions.includes(permission);
    if (!isValidPermission) {
      return res.status(403).json({ message: "Permission denied" });
    }
    return next();
  };
};

module.exports = {
  apiKey,
  permission,
};
