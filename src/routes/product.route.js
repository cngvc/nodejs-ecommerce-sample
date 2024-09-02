"use strict";

const express = require("express");
const productsController = require("../controllers/product.controller");
const { asyncHandler } = require("../helpers/asyncHandler");
const { validateAuthentication } = require("../utils/auth.utils");
const router = express.Router();

router.get("/search", asyncHandler(productsController.getListSearchProduct));
router.get("/", asyncHandler(productsController.getAll));
router.get("/:product", asyncHandler(productsController.getOne));

router.use(asyncHandler(validateAuthentication));
router.post("/", asyncHandler(productsController.createProduct));

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

module.exports = router;
