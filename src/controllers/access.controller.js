"use strict";

const AccessService = require("../services/access.service");
const { OkRequestSuccess } = require("../core/responses/success.response");

class AccessController {
  signup = async (req, res, next) => {
    return new OkRequestSuccess({
      message: "Registration Successfully",
      metadata: await AccessService.signup(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
