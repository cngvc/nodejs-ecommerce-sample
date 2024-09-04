"use strict";

const express = require("express");
const CartController = require("../controllers/cart.controller");
const { asyncHandler } = require("../helpers/asyncHandler");
const router = express.Router();

router.get("/", asyncHandler(CartController.findByUserId));
router.post("/", asyncHandler(CartController.createCart));
router.patch("/update", asyncHandler(CartController.addToCard));
router.delete("/remove-item", asyncHandler(CartController.deleteItemInCart));

module.exports = router;
