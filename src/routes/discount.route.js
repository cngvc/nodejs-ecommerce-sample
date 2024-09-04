"use strict";

const express = require("express");
const DiscountController = require("../controllers/discount.controller");
const { asyncHandler } = require("../helpers/asyncHandler");
const { validateAuthentication } = require("../utils/auth.utils");
const router = express.Router();

router.post(
  "/calculate-amount",
  asyncHandler(DiscountController.calculateDiscountAmount)
);

router.use(asyncHandler(validateAuthentication));
router.post("/", asyncHandler(DiscountController.createDiscount));
router.get("/", asyncHandler(DiscountController.findDiscountsByShop));
router.get(
  "/products",
  asyncHandler(DiscountController.findProductsByDiscount)
);
router.delete("/", asyncHandler(DiscountController.deleteDiscount));
router.patch("/cancel", asyncHandler(DiscountController.cancelDiscount));

module.exports = router;
