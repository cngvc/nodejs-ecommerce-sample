"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../middlewares/asyncHandler.middleware");
const router = express.Router();

router.post("/shops/signup", asyncHandler(accessController.signup));

module.exports = router;
