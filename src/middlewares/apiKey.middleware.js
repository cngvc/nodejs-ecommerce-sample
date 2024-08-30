"use strict";

const ApiKeyService = require("../services/apiKey.service");
const { HEADER } = require("../constants/header.constant");
const { AuthFailedError } = require("../core/responses/error.response");

const apiKey = async (req, res, next) => {
  const key = req.headers[HEADER.API_KEY]?.toString();
  if (!key) {
    return next(new AuthFailedError());
  }
  const apiKey = await ApiKeyService.findById(key);
  if (!apiKey) {
    return next(new AuthFailedError());
  }
  req.apiKey = apiKey;
  return next();
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.apiKey.permissions) {
      return next(new AuthFailedError("Permission denied"));
    }
    const isValidPermission = req.apiKey.permissions.includes(permission);
    if (!isValidPermission) {
      return next(new AuthFailedError("Permission denied"));
    }
    return next();
  };
};

module.exports = {
  apiKey,
  permission,
};
