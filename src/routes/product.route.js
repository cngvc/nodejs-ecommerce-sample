"use strict";

const express = require("express");
const productsController = require("../controllers/product.controller");
const { asyncHandler } = require("../helpers/asyncHandler");
const { validateAuthentication } = require("../utils/auth.utils");
const router = express.Router();

router.use(asyncHandler(validateAuthentication));
router.put(
  "/publish-product/:id",
  asyncHandler(productsController.publishByShop)
);
router.put(
  "/unpublish-product/:id",
  asyncHandler(productsController.unpublishByShop)
);

router.get("/drafts", asyncHandler(productsController.getAllDraftsByShop));
router.get(
  "/published",
  asyncHandler(productsController.getAllPublishedByShop)
);
router.patch("/:id", asyncHandler(productsController.updateProduct));
router.post("/", asyncHandler(productsController.createProduct));

module.exports = router;
