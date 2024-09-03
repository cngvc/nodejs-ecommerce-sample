"use strict";

const express = require("express");
const ProductsController = require("../controllers/product.controller");
const { asyncHandler } = require("../helpers/asyncHandler");
const { validateAuthentication } = require("../utils/auth.utils");
const router = express.Router();

router.use(asyncHandler(validateAuthentication));
router.put(
  "/publish-product/:id",
  asyncHandler(ProductsController.publishByShop)
);
router.put(
  "/unpublish-product/:id",
  asyncHandler(ProductsController.unpublishByShop)
);

router.get("/drafts", asyncHandler(ProductsController.getAllDraftsByShop));
router.get(
  "/published",
  asyncHandler(ProductsController.getAllPublishedByShop)
);
router.patch("/:id", asyncHandler(ProductsController.updateProduct));
router.post("/", asyncHandler(ProductsController.createProduct));

module.exports = router;
