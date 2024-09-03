"use strict";

const express = require("express");
const productsController = require("../controllers/product.controller");
const { asyncHandler } = require("../helpers/asyncHandler");
const router = express.Router();

router.get("/search", asyncHandler(productsController.getListSearchProduct));
router.get("/:id", asyncHandler(productsController.getOne));
router.get("/", asyncHandler(productsController.getAll));

module.exports = router;
