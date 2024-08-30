"use strict";

const AccessService = require("../services/access.service");
const { OkRequestSuccess } = require("../core/responses/success.response");

class AccessController {
  login = async (req, res, next) => {
    return new OkRequestSuccess({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signup = async (req, res, next) => {
    return new OkRequestSuccess({
      message: "Registration Successfully",
      metadata: await AccessService.signup(req.body),
    }).send(res);
  };

  logout = async (req, res, next) => {
    return new OkRequestSuccess({
      message: "Logout Successfully",
      metadata: await AccessService.logout(req.keyToken),
    }).send(res);
  };

  processRefreshToken = async (req, res, next) => {
    return new OkRequestSuccess({
      message: "Process Refresh Successfully",
      metadata: await AccessService.processRefreshToken(req.body.refreshToken),
    }).send(res);
  };
}

module.exports = new AccessController();
