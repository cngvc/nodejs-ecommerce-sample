"use strict";

const AccessService = require("../services/access.service");

class AccessController {
  signup = async (req, res, next) => {
    return res.send(await AccessService.signup(req.body));
  };
}

module.exports = new AccessController();
