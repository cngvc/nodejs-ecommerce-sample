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
}

module.exports = new AccessController();
