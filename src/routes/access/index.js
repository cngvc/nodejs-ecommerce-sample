"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { validateAuthentication } = require("../../utils/auth.utils");
const router = express.Router();

router.post("/shops/login", asyncHandler(accessController.login));
router.post("/shops/signup", asyncHandler(accessController.signup));

router.use(asyncHandler(validateAuthentication));
router.post("/shops/logout", asyncHandler(accessController.logout));
router.post(
  "/shops/process-refresh-token",
  asyncHandler(accessController.processRefreshToken)
);

module.exports = router;
