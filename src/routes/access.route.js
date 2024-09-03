"use strict";

const express = require("express");
const AccessController = require("../controllers/access.controller");
const { asyncHandler } = require("../helpers/asyncHandler");
const { validateAuthentication } = require("../utils/auth.utils");
const router = express.Router();

router.post("/shops/login", asyncHandler(AccessController.login));
router.post("/shops/signup", asyncHandler(AccessController.signup));

router.use(asyncHandler(validateAuthentication));
router.post("/shops/logout", asyncHandler(AccessController.logout));
router.post(
  "/shops/process-refresh-token",
  asyncHandler(AccessController.processRefreshToken)
);

module.exports = router;
