"use strict";

const express = require("express");
const ProductsController = require("../controllers/product.controller");
const { asyncHandler } = require("../helpers/asyncHandler");
const router = express.Router();

router.get("/search", asyncHandler(ProductsController.getListSearchProduct));
router.get("/:id", asyncHandler(ProductsController.findOne));
router.get("/", asyncHandler(ProductsController.findMany));

module.exports = router;
