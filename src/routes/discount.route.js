"use strict";

const express = require("express");
const DiscountController = require("../controllers/discount.controller");
const { asyncHandler } = require("../helpers/asyncHandler");
const { validateAuthentication } = require("../utils/auth.utils");
const router = express.Router();

router.use(asyncHandler(validateAuthentication));
router.post("/", asyncHandler(DiscountController.createDiscount));
router.get(
  "/:code/products",
  asyncHandler(DiscountController.findProductsByDiscount)
);

module.exports = router;
