"use strict";

const express = require("express");
const productsController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { validateAuthentication } = require("../../utils/auth.utils");
const router = express.Router();

router.use(asyncHandler(validateAuthentication));
router.post("/", asyncHandler(productsController.createProduct));

module.exports = router;
